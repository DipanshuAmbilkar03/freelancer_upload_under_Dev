// Simple session-based authentication middleware

function ensureAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  req.user = req.session.user;
  next();
}


function isLoggedIn(req, res, next) {
  if (req.session.user) {
    return next();
  } 

  // Redirect to login with a query parameter indicating the message
  return res.redirect('/login?message=Please+login+to+access+this+page');
}

module.exports = { ensureAuthenticated ,isLoggedIn};   


