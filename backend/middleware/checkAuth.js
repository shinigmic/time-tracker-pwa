const bcrypt = require('bcryptjs');
const User = require('../models/User');

const checkAuth = async (req, res, next) => {
  try {
    // Check for basic auth header
    if (
      !req.headers.authorization ||
      req.headers.authorization.indexOf('Basic') === -1
    ) {
      return res.status(401).json({ message: 'Invalid authorization header' });
    }

    // Verify basic auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'ascii'
    );

    let [email, password] = credentials.split(':');
    email = String(email).trim();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { checkAuth };
