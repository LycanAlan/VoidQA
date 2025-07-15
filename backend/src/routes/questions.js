const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const authMiddleware = require('../middleware/authMiddleware');

// GET route to list all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });

    // Calculate votes and get user vote status if user is logged in
    const userId = req.user?.id;
    const questionsWithVotes = questions.map(question => {
      const totalVotes = question.votes.reduce((acc, vote) => {
        return acc + (vote.type === 'upvote' ? 1 : -1);
      }, 0);

      const userVote = userId ? question.votes.find(vote => vote.user.toString() === userId)?.type : null;

      return {
        ...question.toObject(),
        votes: totalVotes,
        userVote: userVote
      };
    });

    res.json(questionsWithVotes);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// GET route to fetch a single question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username email')
      .populate('answers.author', 'username email');
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Calculate total votes and get user vote status if user is logged in
    const userId = req.user?.id;
    const totalVotes = question.votes.reduce((acc, vote) => {
      return acc + (vote.type === 'upvote' ? 1 : -1);
    }, 0);

    // Get user's vote if they're logged in
    const userVote = userId ? question.votes.find(vote => vote.user.toString() === userId)?.type : null;

    // Calculate votes for each answer
    const answersWithVotes = question.answers.map(answer => {
      const answerVotes = answer.votes.reduce((acc, vote) => {
        return acc + (vote.type === 'upvote' ? 1 : -1);
      }, 0);
      const answerUserVote = userId ? answer.votes.find(vote => vote.user.toString() === userId)?.type : null;
      
      return {
        ...answer.toObject(),
        votes: answerVotes,
        userVote: answerUserVote
      };
    });

    // Return formatted response
    res.json({
      ...question.toObject(),
      votes: totalVotes,
      userVote: userVote,
      answers: answersWithVotes
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ message: 'Error fetching question details' });
  }
});

// Vote on question
router.post('/:id/vote', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const userId = req.user.id;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user has already voted
    const existingVoteIndex = question.votes.findIndex(vote => vote.user.toString() === userId);
    
    if (existingVoteIndex !== -1) {
      if (question.votes[existingVoteIndex].type === voteType) {
        // Remove vote if clicking the same button
        question.votes.splice(existingVoteIndex, 1);
      } else {
        // Change vote type if voting differently
        question.votes[existingVoteIndex].type = voteType;
      }
    } else {
      // Add new vote
      question.votes.push({ user: userId, type: voteType });
    }

    await question.save();

    // Calculate total votes
    const totalVotes = question.votes.reduce((acc, vote) => {
      return acc + (vote.type === 'upvote' ? 1 : -1);
    }, 0);

    // Get user's current vote type
    const userVote = question.votes.find(vote => vote.user.toString() === userId)?.type || null;

    res.json({ votes: totalVotes, userVote });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ message: 'Failed to vote. Please try again.' });
  }
});

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
        .populate('author', 'username email');
      return res.json(questions);
    }

    // Split the query into individual tags and clean them
    const searchTags = query.toLowerCase().split(/[ ,]+/).filter(Boolean);

    // Search for questions that have any of the provided tags
    const questions = await Question.find({
      tags: { 
        $in: searchTags.map(tag => new RegExp(`^${tag}$`, 'i')) 
      }
    })
    .sort({ createdAt: -1 })
    .populate('author', 'username email');

    res.json(questions);
  } catch (error) {
    console.error('Error searching questions:', error);
    res.status(500).json({ 
      message: 'Error searching questions', 
      error: error.message 
    });
  }
});

module.exports = router; 