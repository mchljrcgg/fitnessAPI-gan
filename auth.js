const jwt = require('jsonwebtoken');
const User = require('./models/user');

// Middleware to verify JWT token and attach user to request
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token', details: err });
        }

        // Fetch user from database
        User.findById(decoded.id)
            .then(user => {
                if (!user) {
                    return res.status(401).json({ message: 'Unauthorized: User not found' });
                }

                req.user = user; // Attach user object to request
                next();
            })
            .catch(err => res.status(500).json({ message: 'Error fetching user', details: err }));
    });
};

// Middleware to check if user is an admin
const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
};

module.exports = { verifyToken, checkAdmin };
