const express = require('express');
const router = express.Router();
const Assignment = require('../model/assignment');
const { ensureAuthenticated, isLoggedIn } = require('../middleware/auth');
const mongoose = require('mongoose');
const assignmentpdfs = require('../model/assignmentPdf');
const user = require("../model/user");

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

// router.get("/test/img",(req,res) => {
//     console.log(user.body);
//     res.render("test.ejs",{user});
// })

// Dashboard route
router.get('/dashboard', ensureAuthenticated,isLoggedIn, async (req, res) => {
    try {
        const assignments = await Assignment.find({ postedBy: req.user.userId })
        .populate({
            path: 'pdfs',           
            select: 'file uploadedBy', 
        })
        .sort({ createdAt: -1 });

        // const pdfs = await assignmentpdfs.find({assignment: userId });

        res.render('dashboard', { user: req.user, assignments });
    } catch (err) {
        console.error('Error fetching assignments:', err);
        res.status(500).send('Server error');
    }
});

// Post assignment route
router.get('/post-assignment', ensureAuthenticated, (req, res) => {
    const user = req.user;
    res.render('post-assignment',{user});
});

// View all assignments route
router.get('/assignments', async (req, res) => {
    try {
        const assignments = await Assignment.find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'postedBy',
                select: 'username avatar' 
            });

        res.render('assignments', { assignments });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Assignment detail route
router.get('/assignments/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Assignment ID received:', req.params.id, 'Full URL:', req.originalUrl);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error('Invalid assignment ID:', id);
        return res.status(400).send('Invalid assignment ID');
    }

    try {
        const assignment = await Assignment.findById(id)
        .populate('postedBy', 'username email')
        .populate({
        path: 'pdfs',
        select: 'file uploadedBy',
    });
        if (!assignment) return res.status(404).send('Assignment not found');
        res.render('assignment-detail', { assignment, user: req.user });
    } catch (err) {
        console.error('Error fetching assignment details:', err);
        res.status(500).send('Server error');
    }
});

router.get('/file/:id', (req, res) => {
    const gfs = req.app.locals.gfs;
    gfs.files.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, (err, file) => {
        if (!file || file.length === 0) return res.status(404).send('No file found');

        const readstream = gfs.createReadStream(file.filename);
        res.set('Content-Type', file.contentType);
        readstream.pipe(res);
    });
});


// logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log('Session destruction error:', err);
            return res.redirect('/'); 
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

module.exports = router;