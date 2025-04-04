const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, `../.env`),
});
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_KEY;

const checkToken = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      token = req.headers['token'];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Access denied: No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if the token payload contains the required property (email)
    if (!decoded || !decoded.email) {
      return res.status(401).json({ message: 'Invalid token payload.' });
    }

    // Find the user by email from the token payload
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found for token.' });
    }

    // Attach the user to the request object for further processing
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    // If the error is related to token verification, return 403; otherwise, return 500
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { checkToken };
