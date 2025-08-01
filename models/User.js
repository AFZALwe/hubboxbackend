const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  password: { type: String }, // Added for local auth
  views: { type: Number, default: 0 }, // Total video views
  earning: { type: Number, default: 0 }, // Total earnings in dollars
  picture: String,
  googleId: String,
  lastLogin: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 