const jwt = require('jsonwebtoken');

function ensureAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token required" });
        }
    
        try {
        const token = authHeader.split(" ")[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            userId: payload.userId,
            role: payload.role
        };
        next();
        } catch {
        res.status(401).json({ error: "Invalid token" });
        }
    }

module.exports = ensureAuthenticated;
