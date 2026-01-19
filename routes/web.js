const express = require('express');
const router = express.Router();
const Assignment = require('../model/assignment');
const { ensureAuthenticated, isLoggedIn } = require('../middleware/auth');
const mongoose = require('mongoose');
const assignmentpdfs = require('../model/assignmentPdf');
const User = require("../model/user.js");
const Bid = require('../model/bid');

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

        const assignment = await Assignment.find({postedBy: req.user._id})
            .populate('postedBy', 'username email')
            .populate({
                path: 'pdfs',
                select: 'file uploadedBy',
            });
        if (!assignment) return res.status(404).send('Assignment not found');
        

        // const pdfs = await assignmentpdfs.find({assignment: userId });

        res.render('dashboard', { user: req.user, assignments  });
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