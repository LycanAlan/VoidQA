import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { useParams, Link } from 'react-router-dom';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const QuestionDetail = () => {
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState('');
  const [voteError, setVoteError] = useState('');
  const { questionId } = useParams();
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        const response = await axios.get(`/questions/${questionId}`);
        setQuestion(response.data);
      } catch (err) {
        setError('Failed to fetch question details');
        console.error(err);
      }
    };

    fetchQuestionDetails();
  }, [questionId]);

  const handleVote = async (type, id, voteType) => {
    if (!isLoggedIn) {
      setVoteError('Please login to vote');
      return;
    }

    try {
      let endpoint = type === 'questions' 
        ? `/questions/${id}/vote`
        : `/answers/${id}/vote`;

      const response = await axios.post(endpoint, { voteType });
      
      if (type === 'questions') {
        setQuestion(prev => ({
          ...prev,
          votes: response.data.votes,
          userVote: response.data.userVote
        }));
      } else {
        // Update answer votes
        setQuestion(prev => ({
          ...prev,
          answers: prev.answers.map(answer => 
            answer._id === id 
              ? { ...answer, votes: response.data.votes, userVote: response.data.userVote }
              : answer
          )
        }));
      }
      setVoteError('');
    } catch (err) {
      console.error('Vote error:', err.response || err);
      setVoteError(err.response?.data?.message || 'Failed to vote. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500 p-4">{error}</div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-24 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {voteError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {voteError}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        {' > '}
        <span className="text-gray-700">Question</span>
        {' > '}
        <span className="text-gray-900">{question.title}</span>
      </div>

      {/* Question Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex">
          {/* Vote buttons */}
          <div className="flex flex-col items-center mr-6">
            <button
              onClick={() => handleVote('questions', questionId, 'upvote')}
              className={`p-2 hover:bg-gray-100 rounded ${
                question.userVote === 'upvote' ? 'text-green-500' : 'text-gray-400'
              }`}
              disabled={!isLoggedIn}
            >
              <FaArrowUp size={20} />
            </button>
            <span className="my-2 text-lg font-semibold">
              {question.votes || 0}
            </span>
            <button
              onClick={() => handleVote('questions', questionId, 'downvote')}
              className={`p-2 hover:bg-gray-100 rounded ${
                question.userVote === 'downvote' ? 'text-red-500' : 'text-gray-400'
              }`}
              disabled={!isLoggedIn}
            >
              <FaArrowDown size={20} />
            </button>
          </div>

          {/* Question content */}
          <div className="flex-grow">
            <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
            <div className="flex items-center mb-4">
              <span className="text-sm text-gray-500">
                Asked by {question.author.email}
                {' | '}
                {new Date(question.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700">{question.body}</p>
            </div>
            {question.tags && question.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Answers ({question.answers.length})
        </h2>
        
        {question.answers.map((answer) => (
          <div
            key={answer._id}
            className="bg-white shadow-md rounded-lg p-6 mb-4"
          >
            <div className="flex">
              {/* Answer vote buttons */}
              <div className="flex flex-col items-center mr-6">
                <button
                  onClick={() => handleVote('answers', answer._id, 'upvote')}
                  className={`p-2 hover:bg-gray-100 rounded ${
                    answer.userVote === 'upvote' ? 'text-green-500' : 'text-gray-400'
                  }`}
                  disabled={!isLoggedIn}
                >
                  <FaArrowUp size={20} />
                </button>
                <span className="my-2 text-lg font-semibold">
                  {answer.votes || 0}
                </span>
                <button
                  onClick={() => handleVote('answers', answer._id, 'downvote')}
                  className={`p-2 hover:bg-gray-100 rounded ${
                    answer.userVote === 'downvote' ? 'text-red-500' : 'text-gray-400'
                  }`}
                  disabled={!isLoggedIn}
                >
                  <FaArrowDown size={20} />
                </button>
              </div>

              {/* Answer content */}
              <div className="flex-grow">
                <div className="prose max-w-none mb-4">
                  <p className="text-gray-700">{answer.body}</p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span>
                    Answered by {answer.author.email}
                    {' | '}
                    {new Date(answer.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Answer Button */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Your Answer</h3>
        <Link
          to={`/questions/${questionId}/answer`}
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Submit Your Answer
        </Link>
      </div>
    </div>
  );
};

export default QuestionDetail; 