const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['upvote', 'downvote'],
    required: true
  }
});

const AnswerSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  votes: [VoteSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  body: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  votes: [VoteSchema],
  answers: [AnswerSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
QuestionSchema.index({ createdAt: -1 }); // For sorting by newest
QuestionSchema.index({ title: 'text', body: 'text', tags: 'text' }); // For text search
QuestionSchema.index({ 'answers._id': 1 }); // For finding answers by ID
QuestionSchema.index({ author: 1 }); // For finding questions by author

module.exports = mongoose.model('Question', QuestionSchema); 