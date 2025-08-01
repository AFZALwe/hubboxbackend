const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// TODO: Add Google OAuth logic here
router.get('/', (req, res) => {
  res.send('Auth route');
});

// POST /api/auth/google-login
router.post('/google-login', async (req, res) => {
  const { tokenId } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, picture, sub } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, name, picture, googleId: sub, lastLogin: new Date() });
    } else {
      user.name = name;
      user.picture = picture;
      user.googleId = sub;
      user.lastLogin = new Date();
    }
    await user.save();

    const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: jwtToken, user: { name: user.name, email: user.email, picture: user.picture } });
  } catch (err) {
    res.status(401).json({ message: 'Google login failed', error: err.message });
  }
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  console.log('Signup request:', req.body); // Debug log
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    console.log('Signup error: Missing fields');
    return res.status(400).json({ message: 'All fields required' });
  }
  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('Signup error: User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, name, password: hashedPassword });
    await user.save();
    console.log('User created:', user); // Debug log
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.log('Signup error:', err); // Debug log
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'All fields required' });
  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: jwtToken, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// GET /api/auth/users - Admin: Get all users with lastLogin info
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'email name picture lastLogin').sort({ lastLogin: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

module.exports = router; 