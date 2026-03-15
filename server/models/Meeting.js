const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'completed', 'failed'],
    default: 'uploaded'
  },
  transcript: String,
  summary: String,
  actionItems: [String],
  flashcards: [{
    q: String,
    a: String
  }],
  glossary: [{
    term: String,
    definition: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Meeting', meetingSchema);
