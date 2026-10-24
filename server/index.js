const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
// Security mitigation against Node2Shell (CVE-2026-111497 Brotli RCE/DoS)
// Rejects unauthenticated requests sending Brotli-compressed request bodies to unpatched decompressors
app.use((req, res, next) => {
  const encoding = req.headers['content-encoding'];
  if (encoding && typeof encoding === 'string' && encoding.toLowerCase().includes('br')) {
    return res.status(415).json({
      error: 'Unsupported Media Type: Brotli request body compression is disabled for security mitigation (CVE-2026-111497).'
    });
  }
  next();
});

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const meetingRoutes = require('./routes/meetings');
app.use('/api/meetings', meetingRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'InsightSync Server is running' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/insightsync')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`StudySlate Backend running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
