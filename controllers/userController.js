const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Adjust the path as needed

// Register a new user
module.exports.registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully.', user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error });
    }
};
// Log in an existing user
module.exports.loginUser = (req, res) => {
    const { username, password } = req.body;

    // Find the user by username
    User.findOne({ username })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Compare the password with the stored hash
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ message: 'Error comparing passwords', details: err });
                }

                if (!isMatch) {
                    return res.status(401).json({ message: 'Invalid password' });
                }

                // Generate JWT token
                const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
                    expiresIn: '1h' // Token expires in 1 hour
                });

                res.status(200).json({
                    message: 'Login successful',
                    token: `Bearer ${token}`
                });
            });
        })
        .catch(err => res.status(500).json({ message: 'Error logging in', details: err }));
};
