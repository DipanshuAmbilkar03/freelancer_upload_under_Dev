// // Simple session-based authentication middleware

// function ensureAuthenticated(req, res, next) {
//   if (!req.session.user) {
//     return res.redirect('/login');
//   }
//   req.user = req.session.user;
//   next();
// }


// function isLoggedIn(req, res, next) {
//   if (req.session.user) {
//     return next();
//   } 

//   // Redirect to login with a query parameter indicating the message
//   return res.redirect('/login?message=Please+login+to+access+this+page');
// }

// module.exports = { ensureAuthenticated ,isLoggedIn};   


const User = require('../model/user');

async function ensureAuthenticated(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }

  try {
    const user = await User.findById(req.session.user._id);

    if (!user) {
      req.session.destroy();
      return res.redirect('/login');
    }

    req.user = user; 
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.redirect('/login');
  }
}

function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect('/login?message=Please+login+to+access+this+page');
}

module.exports = { ensureAuthenticated, isLoggedIn };
