const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

router.get('/', protect, authorize('admin'), async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

module.exports = router;
