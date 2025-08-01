const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  videoId: { type: String, unique: true }, // Unique ID for sharing
  views: { type: Number, default: 0 },
  earning: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema); 