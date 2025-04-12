const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { authenticate } = require('../middleware/auth');

// 🔐 Create user under a client
router.post('/create', authenticate, async (req, res) => {
  const newUser = new User({ ...req.body, clientId: req.user.clientId });
  await newUser.save();
  res.json({ message: 'User created successfully' });
});

// 🔐 User login
router.post('/login',authenticate, async (req, res) => {
  const { email, password } = req.body;
  const clientId = req.user.clientId;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'User not found' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    {
      userId: user._id,
      clientId,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ token });
});

module.exports = router;
