const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const authMiddleware = require('../middleware/authMiddleware');

// POST route to create a new question - NOW REQUIRES AUTHENTICATION
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, body } = req.body;

    // Basic validation
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    // Create new question WITH AUTHENTICATED USER
    const newQuestion = new Question({
      title,
      body,
      author: req.user.id, // Use the authenticated user's ID
      tags: req.body.tags || []
    });

    // Save question
    const savedQuestion = await newQuestion.save();

    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ 
      message: 'Error creating question', 
      error: error.message 
    });
  }
});

// POST route to add an answer to a specific question
router.post('/:questionId/answers', authMiddleware, async (req, res) => {
  try {
    const { body } = req.body;

    // Validate input
    if (!body) {
      return res.status(400).json({ message: 'Answer body is required' });
    }

    // Find the question
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Create new answer
    const newAnswer = {
      body,
      author: req.user.id
    };

    // Add answer to question's answers array
    question.answers.push(newAnswer);

    // Save the updated question
    const updatedQuestion = await question.save();

    res.status(201).json(updatedQuestion);
  } catch (error) {
    console.error('Error adding answer:', error);
    res.status(500).json({ 
      message: 'Error adding answer', 
      error: error.message 
    });
  }
});

// GET route to search questions
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;

    // If no query provided, return all questions
    if (!query) {
      const questions = await Question.find()
        .sort({ createdAt: -1 })
        .populate('author', 'email');
      return res.json(questions);
    }

    // Search in title, body, and tags using case-insensitive regex
    const questions = await Question.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { body: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('author', 'email');

    res.json(questions);
  } catch (error) {
    console.error('Error searching questions:', error);
    res.status(500).json({ 
      message: 'Error searching questions', 
      error: error.message 
    });
  }
});

// GET route to fetch a single question with its answers
router.get('/:questionId', async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId)
      .populate('author', 'email')
      .populate('answers.author', 'email');

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ 
      message: 'Error fetching question', 
      error: error.message 
    });
  }
});

// GET route to list all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .populate('author', 'email');

    res.json(questions);
  } catch (error) {
    console.error('Error listing questions:', error);
    res.status(500).json({ 
      message: 'Error listing questions', 
      error: error.message 
    });
  }
});

module.exports = router; 