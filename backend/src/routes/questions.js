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

// GET route to retrieve questions
router.get('/', async (req, res) => {
  try {
    // Simple retrieval of questions with author details
    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username') // Populate author username
      .limit(20); // Limit to 20 most recent questions

    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ 
      message: 'Error fetching questions', 
      error: error.message 
    });
  }
});

module.exports = router; 