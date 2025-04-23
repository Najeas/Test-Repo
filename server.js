require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Initialize Express
const app = express();

// Connect to MongoDB (Replace URI in .env)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose Schema
const trackingSchema = new mongoose.Schema({
  trackingId: String,
  destinationUrl: String,
  clicks: [{
    timestamp: Date,
    latitude: Number,
    longitude: Number,
    accuracy: Number,
    userAgent: String,
    ip: String
  }]
});
const TrackingLink = mongoose.model('TrackingLink', trackingSchema);

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.post('/api/links', async (req, res) => {
  try {
    const trackingId = Math.random().toString(36).slice(2, 10);
    const newLink = new TrackingLink({
      trackingId,
      destinationUrl: req.body.destinationUrl,
      clicks: []
    });
    await newLink.save();

    res.json({
      trackingUrl: `${process.env.BASE_URL}/track?id=${trackingId}&url=${encodeURIComponent(req.body.destinationUrl)}`,
      trackingId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/track', async (req, res) => {
  try {
    await TrackingLink.updateOne(
      { trackingId: req.body.trackingId },
      { $push: { clicks: { ...req.body, ip: req.ip } } }
    );
    res.status(200).send();
  } catch (err) {
    console.error('Tracking error:', err);
    res.status(500).send();
  }
});

// Serve frontend
app.get('/track', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'track.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));