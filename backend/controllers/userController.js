const bcrypt = require('bcryptjs');
const User = require('../models/User');

// GET a single user by ID
const getSingleUserHandler = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// PUT update a single user by ID
const putSingleUserHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = { name, email };

    // If password is provided, hash it and update passwordHash
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.passwordHash = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(req.params.userId, updateData, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE a single user by ID
const deleteSingleUserHandler = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getSingleUserHandler,
  putSingleUserHandler,
  deleteSingleUserHandler,
};
