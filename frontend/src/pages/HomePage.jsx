import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { Link, useSearchParams } from 'react-router-dom';

const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const searchQuery = searchParams.get('q');
        let url = searchQuery 
          ? `/questions/search?query=${encodeURIComponent(searchQuery)}`
          : '/questions';

        const response = await axios.get(url);
        // Transform the response to include vote count
        const questionsWithVotes = response.data.map(question => {
          // Calculate total votes
          const voteCount = Array.isArray(question.votes) 
            ? question.votes.reduce((acc, vote) => acc + (vote.type === 'upvote' ? 1 : -1), 0)
            : 0;
          
          return {
            ...question,
            voteCount // Store calculated vote count
          };
        });
        setQuestions(questionsWithVotes);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch questions');
        setIsLoading(false);
        console.error('Error fetching questions:', err);
      }
    };

    fetchQuestions();
  }, [searchParams]); // Re-fetch when search params change

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-2xl">{error}</div>
      </div>
    );
  }

  const searchQuery = searchParams.get('q');
  const title = searchQuery 
    ? `Questions tagged with "${searchQuery}"`
    : "Recent Questions";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        {isLoggedIn && (
          <Link 
            to="/ask" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Ask Question
          </Link>
        )}
      </div>
      
      {questions.length === 0 ? (
        <div className="text-center py-8">
          {searchQuery ? (
            <>
              <p className="text-gray-500 text-xl mb-4">No questions found with the specified tags</p>
              <Link to="/" className="text-blue-500 hover:underline">
                View all questions
              </Link>
            </>
          ) : (
            <p className="text-gray-500 text-xl mb-4">No questions found</p>
          )}
          {isLoggedIn && (
            <div className="mt-4">
              <Link 
                to="/ask" 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Be the first to ask a question
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <Link 
              to={`/questions/${question._id}`}
              key={question._id} 
              className="block"
            >
              <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start">
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-800 mb-2">
                      {question.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {question.body}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {question.tags && question.tags.map((tag) => (
                          <Link
                            key={tag}
                            to={`/?q=${encodeURIComponent(tag)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs hover:bg-gray-200"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">
                        Asked by {question.author?.username || question.author?.email?.split('@')[0] || 'Anonymous'}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-gray-600">
                      {question.answers?.length || 0} answers
                    </div>
                    <div className={`text-gray-600 mt-1 ${question.voteCount !== 0 ? (question.voteCount > 0 ? 'text-green-600' : 'text-red-600') : ''}`}>
                      {question.voteCount > 0 ? `+${question.voteCount}` : question.voteCount} votes
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage; 