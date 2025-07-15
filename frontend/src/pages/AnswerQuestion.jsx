import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';

const AnswerQuestion = () => {
  const [question, setQuestion] = useState(null);
  const [answerBody, setAnswerBody] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { questionId } = useParams();
  const navigate = useNavigate();

  // Fetch question details
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

  // Submit answer
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await axios.post(`/questions/${questionId}/answers`, {
        body: answerBody
      });
      
      // Redirect to question detail page after successful submission
      navigate(`/questions/${questionId}`);
    } catch (err) {
      setError('Failed to submit answer. Please try again.');
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
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
    <div className="container mx-auto p-4">
      {/* Question Details */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
        <p className="text-gray-700 mb-4">{question.body}</p>
        
        <div className="flex items-center mb-4">
          <span className="text-sm text-gray-500">
            Asked by {question.author.email} 
            {' | '}
            {new Date(question.createdAt).toLocaleDateString()}
          </span>
        </div>

        {question.tags && question.tags.length > 0 && (
          <div className="mb-4">
            {question.tags.map((tag) => (
              <span 
                key={tag} 
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Answer Form */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Answer</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              value={answerBody}
              onChange={(e) => setAnswerBody(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="8"
              placeholder="Write your detailed answer here..."
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg text-white font-medium
                ${isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
              {isSubmitting ? 'Submitting...' : 'Post Your Answer'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate(`/questions/${questionId}`)}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnswerQuestion; 