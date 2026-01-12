// function ensureAuthenticated(req, res, next) {
//     if (!req.session || !req.session.user) {
//     return res.status(401).redirect('/login');
//     }

//     try {
//     // Attach user info for downstream routes
//     req.user = {
//         _id: req.session.user._id,
//         username: req.session.user.username,
//         avatar: req.session.user.avatar
//         };
    
//         next();
//     }catch (err) {
//         console.error('Auth middleware error:', err);
//         return res.status(401).redirect('/login');
//     }

// }

// module.exports = ensureAuthenticated;


function ensureAuthenticated(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.redirect('/login');
    }

    try {
        req.user = {
        _id: req.session.user._id,
        username: req.session.user.username,
        avatar: req.session.user.avatar
        };

        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        return res.redirect('/login');
    }
}

module.exports = ensureAuthenticated;
