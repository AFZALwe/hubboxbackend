const express = require('express');
const router = express.Router();
const User = require('../models/User');

// TODO: Add analytics logic here
router.get('/', (req, res) => {
  res.send('Analytics route');
});

// Add a view for a user and update earning
router.post('/add-view', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.views = (user.views || 0) + 1;
    user.earning = parseFloat(((user.views / 1000) * 2).toFixed(2));
    await user.save();
    res.json({ views: user.views, earning: user.earning });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add view', error: err.message });
  }
});

// Get all users' views and earnings (admin)
router.get('/all-users', async (req, res) => {
  try {
    const users = await User.find({}, 'email name views earning').sort({ views: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

module.exports = router; 