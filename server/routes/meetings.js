const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Meeting = require('../models/Meeting');
const { processMeetingFile, askAILesson } = require('../services/aiEngine');

// Middleware to log requests
router.use((req, res, next) => {
  console.log(`[Meetings API] ${req.method} ${req.url}`);
  next();
});

// Multer configuration
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.mp3' && ext !== '.pdf' && ext !== '.wav') {
      return cb(new Error('Only .mp3, .pdf, and .wav files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// @route   GET api/meetings
// @desc    Get all meetings
router.get('/', async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST api/meetings/upload
// @desc    Upload a file and create a meeting record
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newMeeting = new Meeting({
      title: req.body.title || 'Untitled Meeting',
      fileType: path.extname(req.file.originalname).slice(1),
      fileName: req.file.filename,
      filePath: req.file.path,
      status: 'uploaded'
    });

    const meeting = await newMeeting.save();
    res.status(201).json(meeting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST api/meetings/:id/process
// @desc    Trigger AI processing for a meeting
router.post('/:id/process', async (req, res) => {
  let meeting;
  try {
    meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

    meeting.status = 'processing';
    await meeting.save();

    // Process with Gemini (engine handles parsing now)
    const result = await processMeetingFile(meeting);

    meeting.transcript = result.transcript;
    meeting.summary = result.summary;
    meeting.actionItems = result.actionItems;
    meeting.flashcards = result.flashcards || [];
    meeting.glossary = result.glossary || [];
    meeting.status = 'completed';
    
    await meeting.save();
    res.json(meeting);
  } catch (err) {
    console.error('Processing Error:', err);
    if (meeting) {
      meeting.status = 'failed';
      await meeting.save();
    }
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
});

// @route   POST api/meetings/:id/chat
// @desc    Chat with the AI about a specific lesson
router.post('/:id/chat', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Safety: Check if ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`[Meetings API] Invalid ID format for chat: ${id}`);
      return res.status(400).json({ message: 'Invalid Meeting ID format' });
    }

    console.log(`[Meetings API] Chat request for meeting: ${id}`);
    const meeting = await Meeting.findById(id);
    if (!meeting) {
      console.warn(`[Meetings API] Meeting not found in DB: ${id}`);
      return res.status(404).json({ message: `Meeting ${id} not found in database` });
    }

    const { query } = req.body;
    
    const answer = await askAILesson(meeting, query);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET api/meetings/:id
// @desc    Get single meeting
router.get('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE api/meetings/:id
// @desc    Delete a meeting
router.delete('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    
    await meeting.deleteOne();
    res.json({ message: 'Meeting deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Catch-all for unmatched routes within /api/meetings
router.use((req, res) => {
  console.warn(`[Meetings API] Unmatched request: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: `Route ${req.method} ${req.originalUrl} not found in Meetings API`,
    debug_hint: "Check if the meeting ID is valid and the route is correctly defined in meetings.js"
  });
});

module.exports = router;
