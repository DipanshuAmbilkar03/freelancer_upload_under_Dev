const express = require('express');
const router = express.Router();
const Assignment = require('../model/assignment');
const { ensureAuthenticated, isLoggedIn } = require('../middleware/auth');

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
router.get('/dashboard', ensureAuthenticated,isLoggedIn, async (req, res) => {
    try {
        const assignments = await Assignment.find({ postedBy: req.user.userId }).sort({ createdAt: -1 });
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
        const assignments = await Assignment.find().sort({ createdAt: -1 }).populate('postedBy', 'username');
        res.render('assignments', { assignments, currentUserId: req.user ? req.user.userId : null });
    } catch (err) {
        console.error('Error loading assignments:', err);
        res.status(500).send('Server error');
    }
});

// Assignment detail route
router.get('/assignments/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id).populate('postedBy', 'username email');
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