const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { authenticate } = require('../middleware/auth');

// 🔐 Create user under a client
router.post('/create', authenticate, async (req, res) => {
  try {
    const newUser = new User({ ...req.body, clientId: req.user.clientId });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
});

// 🔐 Get all users for current client (admin only)
router.get('/', authenticate, async (req, res) => {
  try {
    // if (req.user.role !== 'ADMIN') {
    //   return res.status(403).json({ message: 'Only admins can list users' });
    // }

    const users = await User.find({ clientId: req.user.clientId })
      .select('-password')
      .lean();

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// 🔐 User login
router.post('/login', async (req, res) => {  // Removed authenticate middleware from login
  try {
    const { phoneNumber, password } = req.body;
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        userId: user._id,
        clientId: user.clientId,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.put('/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    // Find user to update
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found.' });
    }

    userToUpdate.password = newPassword;
    await userToUpdate.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// 🔐 Delete user (admin or user can delete their own account)
router.delete('/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // if (req.user.userId !== userId && req.user.role !== 'ADMIN') {
    //   return res.status(403).json({ message: 'Unauthorized to delete this user' });
    // }

    const user = await User.findOne({ 
      _id: userId, 
      clientId: req.user.clientId 
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

module.exports = router;