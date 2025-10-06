const express = require('express');
const router = express.Router();
const User = require('../model/user');  
const Assignment = require('../model/assignment');
const Bid = require('../model/bid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ensureAuthenticated = require('../middleware/post_auth');
const path = require('path');
const fs = require('fs'); 

// User registration
router.post('/users/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, email });
        await user.save();
        // res.status(201).json({ message: 'User registered successfully' });
        // confirm("You have been logged in.");
        res.redirect("/assignments");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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
            req.session.user = payload; // create server session used by ensureAuthenticated
            return res.redirect('/assignments'); // for HTML nav
        }

        // API clients get token JSON
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// New: convert token -> session (useful when your client receives token first)
router.post('/session-from-token', (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'token required' });
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.session.user = { userId: payload.userId, username: payload.username, role: payload.role };
        return res.json({ message: 'Session created' });
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
});

// Create assignment
// router.post('/assignments', ensureAuthenticated, async (req, res) => {
//     const { title, description, startingPrice, image, subject, deadline, category } = req.body;
//     try {
//         const assignment = new Assignment({
//             title,
//             description,
//             startingPrice,
//             image,
//             subject,
//             deadline: deadline ? new Date(deadline) : undefined,
//             category,
//             postedBy: req.user.userId  
//         });
//         await assignment.save();
//         res.status(201).json({ message: 'Assignment created successfully', assignment });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

router.post('/assignments', ensureAuthenticated, async (req, res) => {
    try {
        const { title, description, startingPrice, subject, deadline, category } = req.body;
        const userId = req.user.userId; // ensureAuthenticated sets this

        if (!req.files || !req.files.image) {
            return res.status(400).send('No file uploaded');
        }

        const imageFile = req.files.image;
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

        const filename = Date.now() + '-' + imageFile.name;
        const uploadPath = path.join(uploadDir, filename);
        await imageFile.mv(uploadPath);

        const assignment = new Assignment({
            title,
            description,
            startingPrice,
            subject,
            deadline,
            category,
            postedBy: userId,
            image: {
                filename: imageFile.name,
                path: `/uploads/${filename}`,
                mimetype: imageFile.mimetype
            }
        });

        await assignment.save();
        res.redirect("/dashboard")
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


// Place a bid
router.post('/assignments/:id/bid', ensureAuthenticated, async (req, res) => {
    const { bidAmount, message } = req.body;
    if (bidAmount <= 0) {
        return res.status(400).json({ error: 'Bid amount must be greater than zero' });
    }
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment || assignment.status === 'closed') {
            return res.status(404).json({ error: 'Assignment not found or bidding is closed' });
        }
        const bid = new Bid({
            assignment: assignment._id,
            bidder: req.user.userId,  // now defined
            bidAmount,
            message
        });
        await bid.save();
        assignment.bids.push(bid._id);
        await assignment.save();
        res.status(201).json({ message: 'Bid placed successfully', bid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get assignment details with bids
router.get('/assignments/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id).populate('postedBy', 'username').populate('bids');
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }
        res.json(assignment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;