const express = require('express');
const router = express.Router();
const User = require('../model/user');  
const Assignment = require('../model/assignment');
const AssignmentPDF = require('../model/assignmentPdf');
// const savedUser = require("../model/savedAssignments");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ensureAuthenticated = require('../middleware/post_auth');
const path = require('path');
const fs = require('fs'); 
const Bid = require("../model/bid.js")

const multer = require('multer');
const uploadDir = path.join(__dirname, '../uploads');

// Ensure the uploads folder exists
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// User registration
router.post('/users/register', upload.single('avatar'), async (req, res) => {
  const { username, password, email } = req.body;
    // console.log("registered avater : ",req.avatar);  
    // console.log("registered body : ",req.body);
    // console.log("registered file : ",req.file);
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let defaultAvater = [
      '/assets/pfp.png',
      '/assets/pfp1.png',
      '/assets/pfp2.png',
      '/assets/pfp3.png',
      '/assets/pfp4.png',
      '/assets/pfp5.png',
    ]

    let avatarPath;

    if (req.file) {
      // console.log("registered User Image : ",req.file.filename);
      avatarPath = `/uploads/${req.file.filename}`;
    } else {
      avatarPath = defaultAvater[
        Math.floor(Math.random()*defaultAvater.length)
      ];
    }

    console.log(avatarPath);

    const user = new User({
      username,
      password: hashedPassword,
      email,
      avatar: avatarPath
    });

    await user.save();

    res.redirect('/assignments');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});


// saved assignments 
router.post(
  '/assignments/:id/save',
  ensureAuthenticated,
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const assignmentId = req.params.id;

      console.log("SAVE ROUTE HIT", req.params.id);
      
      const exists = user.savedAssignments.some(
        id => id.toString() === assignmentId
      );

      if (exists) {
        user.savedAssignments.pull(assignmentId);
      } else {
        user.savedAssignments.push(assignmentId);
      }

      await user.save();

      res.json({ success: true, saved: !exists });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
  }
);

// User login

// Update login: allow creating a server session when requested
router.post('/users/login', async (req, res) => {
    const { username, password, createSession } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const payload = { userId: user._id.toString(), username: user.username, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

        // If this is a browser navigation (Accept header includes text/html) OR client asked to create session
        const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
        if (acceptsHtml || createSession) {
              req.session.user = {
              _id: user._id,
              username: user.username,
              avatar: user.avatar
            };
             // create server session used by ensureAuthenticated
            return res.redirect('/assignments'); // for HTML nav
        }

        // API clients get token JSON
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/session-check", (req, res) => {
  res.json(req.session);
});

// Update an existing assignment
router.put('/assignments/update/:id', ensureAuthenticated, async (req, res) => {
    try {
        const { title, description, startingPrice, subject, deadline, category } = req.body;
        
        // Find the assignment and ensure the user owns it
        const assignment = await Assignment.findOne({ _id: req.params.id, postedBy: req.user._id });

        if (!assignment) {
            return res.status(404).json({ success: false, message: "Assignment not found or unauthorized" });
        }

        // Update fields
        assignment.title = title || assignment.title;
        assignment.description = description || assignment.description;
        assignment.startingPrice = startingPrice || assignment.startingPrice;
        assignment.subject = subject || assignment.subject;
        assignment.deadline = deadline || assignment.deadline;
        assignment.category = category || assignment.category;

        await assignment.save();
        res.json({ success: true, message: "Assignment updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});


router.post('/assignments', ensureAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const { title, description, startingPrice, subject, deadline, category } = req.body;
    const userId = req.user._id;

    // Multer stores uploaded file in req.file
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const assignment = new Assignment({
      title,
      description,
      startingPrice,
      subject,
      deadline,
      category,
      postedBy: userId,
      image: {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        mimetype: req.file.mimetype
      }
    });

    await assignment.save();
    console.log('Assignment saved:', assignment.title);
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error creating assignment:', err);
    res.status(500).json({ error: err.message });
  }
});

// PDF Upload Page
router.get("/pdfUpload", ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const assignments = await Assignment.find({ postedBy: userId });

        res.render('upload.ejs', { user: req.user, assignments });
    } catch (error) {
        console.error("Error loading PDF upload page:", error);
        res.status(500).send("Server error while loading upload page");
    }
    });

router.post('/pdfUpload', ensureAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const { assignmentId } = req.body;
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).send('No PDF uploaded');
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).send('Assignment not found');
    }

    const pdf = new AssignmentPDF({
      assignment: assignment._id,
      uploadedBy: userId,
      file: {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        mimetype: req.file.mimetype
      }
    });

    await pdf.save();

    // Link PDF to the assignment (optional, but useful)
    assignment.pdfs = assignment.pdfs || [];
    assignment.pdfs.push(pdf._id);
    await assignment.save();

    console.log('PDF uploaded successfully:', pdf.file.filename);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('PDF upload error:', error);
    res.status(500).send('Server error during PDF upload');
  }
});

router.post('/submit-bid/:assignmentId', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.assignmentId);
        const { bidAmount, deliveryDate, proposalMessage } = req.body;

        if (bidAmount <= 0) {
            return res.status(400).send("Bid amount must be greater than 0.");
        }
        const selectedDate = new Date(deliveryDate);
        const deadlineDate = new Date(assignment.deadline);

        if (selectedDate > deadlineDate) {
            return res.status(400).send("Delivery date cannot exceed the assignment deadline.");
        }
      const newBid = new Bid({
            assignmentId: req.params.assignmentId,
            bidderId: req.user._id, 
            bidAmount,
            deliveryDate,
            proposalMessage
        });

        await newBid.save();
        res.redirect(`/assignment/${req.params.assignmentId}`);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});


router.get('/assignment/:id', async (req, res) => {
    const assignment = await Assignment.findById(req.params.id);
    const bids = await Bid.find({ assignmentId: req.params.id }).populate('bidderId', 'username');
    
    res.render('assignmentdetails', { assignment, bids });
});

// Get assignment details with bids
router.get('/assignments/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id).populate('postedBy', 'username');
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }
        res.json(assignment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;