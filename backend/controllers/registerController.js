const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');
const bcrypt = require('bcryptjs'); // Added bcrypt import
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});
const User = require('../models/User');
const ActivityType = require('../models/ActivityType');

// Define default activities
const defaultActivities = [
  {
    name: 'Work',
    description: 'Work related activity',
    color: '#1976D2',
    icon: 'mdi-briefcase-outline',
  },
  {
    name: 'Rest',
    description: 'Time to relax',
    color: '#81C784',
    icon: 'mdi-sofa',
  },
  {
    name: 'Reading',
    description: 'Reading books or articles',
    color: '#FFD54F',
    icon: 'mdi-book-open-page-variant',
  },
  {
    name: 'Meditation',
    description: 'Meditation for mindfulness',
    color: '#B39DDB',
    icon: 'mdi-meditation',
  },
  {
    name: 'House Chores',
    description: 'Household tasks',
    color: '#FF8A65',
    icon: 'mdi-broom',
  },
  {
    name: 'Exercise',
    description: 'Physical workouts and fitness activities',
    color: '#E53935',
    icon: 'mdi-dumbbell',
  },
  {
    name: 'Learning',
    description: 'Engaging in educational activities or courses',
    color: '#3F51B5',
    icon: 'mdi-school',
  },
  {
    name: 'Socializing',
    description: 'Spending time with friends and social groups',
    color: '#F06292',
    icon: 'mdi-account-group',
  },
  {
    name: 'Commuting',
    description: 'Traveling to and from different locations',
    color: '#757575',
    icon: 'mdi-car',
  },
  {
    name: 'Entertainment',
    description: 'Watching movies, playing games, or other leisure activities',
    color: '#8E24AA',
    icon: 'mdi-movie',
  },
];

// POST: Create a new user
const registerUserHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      passwordHash: hashedPassword,
    });
    await newUser.save();

    // Automatically create default activities for the new user
    for (const activity of defaultActivities) {
      await ActivityType.create({
        user: newUser._id,
        name: activity.name,
        description: activity.description,
        color: activity.color,
        icon: activity.icon,
      });
    }

    res
      .status(201)
      .json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Use a separate secret for email verification if needed, otherwise use the same JWT secret
const EMAIL_VERIFICATION_SECRET =
  process.env.EMAIL_VERIFICATION_SECRET || process.env.JWT_KEY;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Create a transporter for sending emails using nodemailer (example using Gmail)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address from .env
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password from .env
  },
});

/**
 * Send a verification email to the user.
 * @param {Object} user - The user object containing at least email and name.
 */
const sendVerificationEmail = async (user) => {
  try {
    // Generate a verification token with a 1-day expiration
    const token = jwt.sign({ email: user.email }, EMAIL_VERIFICATION_SECRET, {
      expiresIn: '1d',
    });
    const verificationUrl = `${BASE_URL}/register/verify?token=${token}`;

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Email Verification - Personal Time Tracker',
      html: `<p>Hello ${user.name},</p>
             <p>Please verify your email by clicking the link below:</p>
             <a href="${verificationUrl}">Verify Email</a>
             <p>If you did not sign up for this account, please ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

/**
 * Handler to verify the user's email using the token provided in the query string.
 * Expects a query parameter 'token'.
 */
const verifyEmailHandler = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: 'Missing token' });
    }

    // Verify the token
    const decoded = jwt.verify(token, EMAIL_VERIFICATION_SECRET);
    const email = decoded.email;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mark email as verified; assumes the User schema has a field `isVerified`
    user.isVerified = true;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ message: 'Error verifying email' });
  }
};

module.exports = {
  registerUserHandler,
  sendVerificationEmail,
  verifyEmailHandler,
};
