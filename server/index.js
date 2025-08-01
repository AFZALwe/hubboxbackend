const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

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