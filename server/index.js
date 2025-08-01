require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hubbox', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Import routes
const videoRoutes = require('./routes/video');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/video', videoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);

// Sample working route (for test)
app.get('/api/video', (req, res) => {
  res.send('✅ Video API is working!');
});

// Example route to serve a direct video URL (if needed)
app.get('/video/:id', (req, res) => {
  const videoId = req.params.id;

  // Dummy video URL logic (replace this with your actual database or logic)
  const videoMap = {
    '1': 'https://www.w3schools.com/html/mov_bbb.mp4', // Sample video
  };

  const videoUrl = videoMap[videoId];

  if (videoUrl) {
    res.json({ video: videoUrl });
  } else {
    res.status(404).json({ error: 'Video not found' });
  }
});

// Server start
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}); 