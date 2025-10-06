const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const multer = require('multer');
const fileUpload = require('express-fileupload');

dotenv.config();

const User = require('./model/user');
const Assignment = require('./model/assignment');
const apiRoutes = require('./routes/api');
const webRoutes = require('./routes/web');

const app = express();

// Enable file upload
app.use(fileUpload());

// Serve uploaded files as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

/* middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

/* session for browser flows */
app.use(session({
  secret: process.env.SESSION_SECRET || '7tbdr6d6nc85758gm8yymv8mc8rxe75b79ntc80yb',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } 
}));

// Add this middleware so EJS partials can read currentUser / user
app.use((req, res, next) => {
  const user = req.session && req.session.user ? req.session.user : null;
  res.locals.currentUser = user;
  res.locals.user = user;
  res.locals.currentUserId = user ? user.userId : null; // <-- added
  next();
});

/* mongo */
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/freelancer';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

/* routes */
app.use('/api', apiRoutes);
app.use('/', webRoutes);

/* server */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}/`);
});