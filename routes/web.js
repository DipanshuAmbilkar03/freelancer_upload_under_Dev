const express = require('express');
const router = express.Router();
const Assignment = require('../model/assignment');
const { ensureAuthenticated, isLoggedIn } = require('../middleware/auth');
const mongoose = require('mongoose');
const assignmentpdfs = require('../model/assignmentPdf');
const User = require("../model/user.js");
const Bid = require('../model/bid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ===== MULTER CONFIGURATION FOR FILE UPLOADS =====
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, images, and documents are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

// Home page route
router.get('/', (req, res) => {
    res.render('home');
});

// Login page route
router.get('/login', (req, res) => {
    res.render('login');
});

// Registration page route
router.get('/register', (req, res) => {
    res.render('register');
});

// Dashboard route
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    try {
        const assignments = await Assignment.find({ postedBy: req.user._id })
            .populate({
                path: 'pdfs',
                select: 'file uploadedBy',
            })
            .sort({ createdAt: -1 });

        // Mock notices - you can replace this with a real notices collection later
        const notices = [
            {
                _id: 1,
                title: 'Welcome to Dashboard',
                message: 'Your dashboard is now live! You can upload assignments and manage your profile.',
                icon: 'star',
                isNew: true,
                createdAt: new Date()
            }
        ];

        res.render('dashboard', {
            user: req.user,
            assignments,
            notices,
            message: req.session.message || null
        });

        // Clear message after rendering
        if (req.session.message) {
            req.session.message = null;
        }
    } catch (err) {
        console.error('Error fetching assignments:', err);
        res.status(500).send('Server error');
    }
});

// Post assignment route
router.get('/post-assignment', ensureAuthenticated, (req, res) => {
    const user = req.user;
    console.log(user);
    
    res.render('post-assignment', { user });
});

router.get(
    '/savedAssignmemt',
    ensureAuthenticated,
    async (req, res) => {
      const user = await User.findById(req.user._id)
        .populate('savedAssignments');
  
      res.render('saved', {
        assignments: user.savedAssignments || [],
        user
      });
    }
  );
  

// View all assignments route
router.get('/assignments', async (req, res) => {
    try {
        const assignments = await Assignment.find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'postedBy',
                select: 'username avatar'
            });

        res.render('assignments', { assignments ,user: req.user});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Assignment detail route
router.get('/assignments/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send('Invalid ID');

    try {
        const assignment = await Assignment.findById(id)
            .populate('postedBy', 'username email')
            .populate({ path: 'pdfs', select: 'file uploadedBy' });

        if (!assignment) return res.status(404).send('Assignment not found');

        const bids = await Bid.find({ assignmentId: id })
            .populate('bidderId', 'username')
            .sort({ createdAt: -1 });

        res.render('assignment-detail', { 
            assignment, 
            user: req.user, 
            bids: bids || [] 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/assignments/:id/bid', ensureAuthenticated, async (req, res) => {
    try {
        const { bidAmount, deliveryTime, proposalMessage } = req.body;
        const assignment = await Assignment.findById(req.params.id);
        
        if (!assignment) return res.status(404).send("Assignment not found");

        if (Number(bidAmount) <= 0) return res.status(400).send("Invalid amount");
        
        const deliveryDate = new Date(deliveryTime);
        if (deliveryDate > new Date(assignment.deadline)) {
            return res.status(400).send("Delivery date exceeds deadline");
        }

        const newBid = new Bid({
            assignmentId: req.params.id,
            bidderId: req.user._id,
            bidAmount: Number(bidAmount),
            deliveryDate: deliveryDate,
            proposalMessage: proposalMessage
        });

        await newBid.save();
        res.redirect(`/assignments/${req.params.id}`);
    } catch (err) {
        console.error("Bid Submission Error:", err);
        res.status(500).send("Internal Server Error");
    }
});

// ===== UPLOAD ASSIGNMENT ROUTE =====
router.post('/upload-assignment', ensureAuthenticated, upload.single('assignmentFile'), async (req, res) => {
    try {
        const { title, description, subject, category, startingPrice, deadline } = req.body;

        if (!title || !startingPrice) {
            return res.status(400).json({ error: 'Title and starting price are required' });
        }

        const assignment = new Assignment({
            title,
            description: description || '',
            subject: subject || '',
            category: category || '',
            startingPrice: Number(startingPrice),
            deadline: deadline ? new Date(deadline) : null,
            status: 'open',
            postedBy: req.user._id
        });

        // If a file was uploaded, create an AssignmentPDF document
        if (req.file) {
            const pdf = new assignmentpdfs({
                file: {
                    filename: req.file.originalname,
                    path: req.file.filename,
                    mimetype: req.file.mimetype
                },
                uploadedBy: req.user._id,
                assignment: assignment._id
            });

            await pdf.save();
            assignment.pdfs.push(pdf._id);
        }

        await assignment.save();

        req.session.message = {
            type: 'success',
            text: 'Assignment uploaded successfully!'
        };

        res.redirect('/dashboard');
    } catch (err) {
        console.error('Upload error:', err);
        req.session.message = {
            type: 'error',
            text: 'Error uploading assignment: ' + err.message
        };
        res.redirect('/dashboard');
    }
});

// ===== EDIT ASSIGNMENT - SHOW FORM =====
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
            .populate('pdfs');

        if (!assignment) {
            return res.status(404).send('Assignment not found');
        }

        // Check if user owns this assignment
        if (assignment.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).send('Not authorized to edit this assignment');
        }

        res.render('edit-assignment', {
            assignment,
            user: req.user,
            message: req.session.message || null
        });

        if (req.session.message) {
            req.session.message = null;
        }
    } catch (err) {
        console.error('Error fetching assignment:', err);
        res.status(500).send('Server error');
    }
});

// ===== EDIT ASSIGNMENT - UPDATE =====
router.post('/edit/:id', ensureAuthenticated, upload.single('assignmentFile'), async (req, res) => {
    try {
        const { title, description, subject, category, startingPrice, deadline } = req.body;
        const assignmentId = req.params.id;

        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        // Verify ownership
        if (assignment.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Update fields
        if (title) assignment.title = title;
        if (description) assignment.description = description;
        if (subject) assignment.subject = subject;
        if (category) assignment.category = category;
        if (startingPrice) assignment.startingPrice = Number(startingPrice);
        if (deadline) assignment.deadline = new Date(deadline);

        // Handle file replacement
        if (req.file) {
            // Remove old PDFs if they exist
            if (assignment.pdfs.length > 0) {
                for (const pdfId of assignment.pdfs) {
                    const oldPdf = await assignmentpdfs.findById(pdfId);
                    if (oldPdf && oldPdf.file && oldPdf.file.path) {
                        const oldFilePath = path.join(uploadsDir, oldPdf.file.path);
                        if (fs.existsSync(oldFilePath)) {
                            fs.unlinkSync(oldFilePath);
                        }
                    }
                    await assignmentpdfs.findByIdAndDelete(pdfId);
                }
                assignment.pdfs = [];
            }

            // Create new PDF entry
            const pdf = new assignmentpdfs({
                file: {
                    filename: req.file.originalname,
                    path: req.file.filename,
                    mimetype: req.file.mimetype
                },
                uploadedBy: req.user._id,
                assignment: assignmentId
            });

            await pdf.save();
            assignment.pdfs.push(pdf._id);
        }

        await assignment.save();

        req.session.message = {
            type: 'success',
            text: 'Assignment updated successfully!'
        };

        res.redirect('/dashboard');
    } catch (err) {
        console.error('Update error:', err);
        req.session.message = {
            type: 'error',
            text: 'Error updating assignment: ' + err.message
        };
        res.redirect(`/edit/${req.params.id}`);
    }
});

// ===== DELETE ASSIGNMENT =====
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
            .populate('pdfs');

        if (!assignment) {
            return res.status(404).send('Assignment not found');
        }

        // Verify ownership
        if (assignment.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).send('Not authorized');
        }

        // Delete associated files
        if (assignment.pdfs && assignment.pdfs.length > 0) {
            for (const pdf of assignment.pdfs) {
                if (pdf.file && pdf.file.path) {
                    const filePath = path.join(uploadsDir, pdf.file.path);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
                await assignmentpdfs.findByIdAndDelete(pdf._id);
            }
        }

        // Delete assignment
        await Assignment.findByIdAndDelete(req.params.id);

        req.session.message = {
            type: 'success',
            text: 'Assignment deleted successfully!'
        };

        res.redirect('/dashboard');
    } catch (err) {
        console.error('Delete error:', err);
        req.session.message = {
            type: 'error',
            text: 'Error deleting assignment: ' + err.message
        };
        res.redirect('/dashboard');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Session destruction error:', err);
            return res.redirect('/');
        }

        res.clearCookie('connect.sid', { path: '/' });
        res.clearCookie('freelancer.sid', { path: '/' });
        res.clearCookie('username-localhost-8888', { path: '/' });

        req.session = null;

        return res.redirect('/login');
    });
});

module.exports = router;