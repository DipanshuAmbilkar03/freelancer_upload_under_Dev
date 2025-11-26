const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');

dotenv.config();

const apiRoutes = require('./routes/api');
const webRoutes = require('./routes/web');

const app = express();

// Serve uploaded files as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/pdfs', express.static(path.join(__dirname, 'uploads/pdfs')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Body parsers (needed for login/register forms)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
}));

// Make user data available to all templates
app.use((req, res, next) => {
  const user = req.session?.user || null;
  res.locals.currentUser = user;
  res.locals.user = user;
  res.locals.currentUserId = user ? user.userId : null;
  next();
});

/* MongoDB */
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/freelancer';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

/* Routes */
app.use('/api', apiRoutes);
app.use('/', webRoutes);

/* server */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}/`);
});