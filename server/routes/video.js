const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Video = require('../models/Video');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Simple JWT auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Add a new video
router.post('/', auth, async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ message: 'URL required' });
  try {
    const video = new Video({ user: req.user.id, url });
    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: 'Error adding video', error: err.message });
  }
});

// Upload video
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    console.log('Upload request:', req.body, req.file);
    const { userId } = req.body;
    if (!req.file || !userId) return res.status(400).json({ message: 'Video file and userId required' });
    const videoId = uuidv4();
    const url = `/uploads/${req.file.filename}`;
    const video = new Video({ user: userId, url, videoId });
    await video.save();
    res.json({ link: `${req.protocol}://${req.get('host')}/v/${videoId}`, videoId });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// List user's videos
router.get('/', auth, async (req, res) => {
  try {
    const videos = await Video.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching videos', error: err.message });
  }
});

// Get video by videoId
router.get('/by-id/:videoId', async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching video', error: err.message });
  }
});

// Deep link video viewer - redirects to app
router.get('/v/:videoId', async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).send(`
        <html>
          <head><title>Video Not Found</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>Video Not Found</h1>
            <p>This video link is invalid or has been removed.</p>
            <a href="https://hubbox.knowledge4world.com/hubbox/" style="color: #00b050;">Go to HubBox</a>
          </body>
        </html>
      `);
    }

    // Increment view count
    video.views = (video.views || 0) + 1;
    video.earning = parseFloat(((video.views / 1000) * 2).toFixed(2));
    await video.save();

    // Create deep link for app - using the correct format from your app
    const deepLink = `hubbox://video/${video.videoId}`;
    const httpsLink = `https://hubboxbackend.onrender.com/hubbox/v/${video.videoId}`;
    
    // HTML page that tries to open app, falls back to web
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Watch Video - HubBox</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: linear-gradient(135deg, #00e676 0%, #b2ffec 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 20px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 400px;
              width: 100%;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #00b050;
              margin-bottom: 20px;
            }
            .btn {
              background: #00b050;
              color: white;
              padding: 15px 30px;
              border: none;
              border-radius: 10px;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
              margin: 10px;
              text-decoration: none;
              display: inline-block;
            }
            .btn:hover {
              background: #00913a;
            }
            .video-preview {
              margin: 20px 0;
              border-radius: 10px;
              overflow: hidden;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🎬 HubBox</div>
            <h2>Watch This Video</h2>
            <p>Click below to open this video in HubBox app:</p>
            
            <div class="video-preview">
              <video src="https://hubboxbackend.onrender.com${video.url}" 
                     width="100%" 
                     controls 
                     style="max-height: 200px; border-radius: 10px;">
                Your browser doesn't support video playback.
              </video>
            </div>
            
            <a href="${deepLink}" class="btn" id="openApp">
              📱 Open in HubBox App (Deep Link)
            </a>
            <a href="${httpsLink}" class="btn" style="margin-top: 10px;">
              📱 Open in HubBox App (HTTPS)
            </a>
            
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
              Don't have the app? 
              <a href="https://play.google.com/store/apps/details?id=com.hubbox.app" 
                 style="color: #00b050; text-decoration: none;">
                Download HubBox
              </a>
            </p>
          </div>
          
          <script>
            // Try to open app, fallback to web after 2 seconds
            setTimeout(function() {
              window.location.href = 'https://hubboxbackend.onrender.com${video.url}';
            }, 2000);
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching video', error: err.message });
  }
});

// Increment view and update earning by videoId
router.post('/add-view', async (req, res) => {
  try {
    const { videoId } = req.body;
    if (!videoId) return res.status(400).json({ message: 'videoId required' });
    const video = await Video.findOne({ videoId });
    if (!video) return res.status(404).json({ message: 'Video not found' });
    video.views = (video.views || 0) + 1;
    video.earning = parseFloat(((video.views / 1000) * 2).toFixed(2));
    await video.save();
    res.json({ views: video.views, earning: video.earning });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add view', error: err.message });
  }
});

module.exports = router; 