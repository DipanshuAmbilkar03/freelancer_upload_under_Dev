// Simple session-based authentication middleware

function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }

  if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return res.redirect('/login');
}

function isLoggedIn(req, res, next) {
  if (req.session.user) {
    return next();
  } 

  // Redirect to login with a query parameter indicating the message
  return res.redirect('/login?message=Please+login+to+access+this+page');
}

module.exports = { ensureAuthenticated ,isLoggedIn};   


