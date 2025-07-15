const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Question = require('../models/Question');

// Vote on answer
router.post('/:id/vote', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const userId = req.user.id;

    // Find the question containing this answer
    const question = await Question.findOne({ 'answers._id': id });
    if (!question) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Find the specific answer
    const answer = question.answers.id(id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user has already voted
    const existingVoteIndex = answer.votes.findIndex(vote => vote.user.toString() === userId);
    
    if (existingVoteIndex !== -1) {
      if (answer.votes[existingVoteIndex].type === voteType) {
        // Remove vote if clicking the same button
        answer.votes.splice(existingVoteIndex, 1);
      } else {
        // Change vote type if voting differently
        answer.votes[existingVoteIndex].type = voteType;
      }
    } else {
      // Add new vote
      answer.votes.push({ user: userId, type: voteType });
    }

    await question.save();

    // Calculate total votes
    const totalVotes = answer.votes.reduce((acc, vote) => {
      return acc + (vote.type === 'upvote' ? 1 : -1);
    }, 0);

    // Get user's current vote type
    const userVote = answer.votes.find(vote => vote.user.toString() === userId)?.type || null;

    res.json({ votes: totalVotes, userVote });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ message: 'Failed to vote. Please try again.' });
  }
});

module.exports = router; 