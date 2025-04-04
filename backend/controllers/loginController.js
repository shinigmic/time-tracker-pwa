const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, `../.env`),
});

const JWT_SECRET = process.env.JWT_KEY;

const getLoginHandler = async (req, res) => {
  try {
    const user = req.user;
    // Create JWT token using user's id and email for consistency
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '14d',
    });
    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getLoginHandler };
