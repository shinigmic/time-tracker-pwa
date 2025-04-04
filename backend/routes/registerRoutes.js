const express = require('express');
const {
  registerUserHandler,
  verifyEmailHandler,
  sendVerificationEmail,
} = require('../controllers/registerController');
const User = require('../models/User');

const router = express.Router();

router.post('/', registerUserHandler);

// Route for verifying the user's email via a token query parameter
// Example: GET /register/verify?token=...
router.get('/verify', verifyEmailHandler);

// Optional route to trigger sending a verification email
// Expects req.body.email to be provided
router.post('/send-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send verification email using the controller function
    await sendVerificationEmail(user);
    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
