const jwt = require('jsonwebtoken');

function ensureAuthenticated(req, res, next) {
    if (!req.session || !req.session.user) {
    return res.status(401).redirect('/login');
    }

    try {
    // Attach user info for downstream routes
    req.user = {
        userId: req.session.user.id,
        username: req.session.user.username,
        avatar: req.session.user.avatar
        };
    
        next();
    }catch {
        req.status(401).json({error : "Invalid Token"})
    }
}

module.exports = ensureAuthenticated;
