import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/questions');
        setQuestions(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch questions');
        setIsLoading(false);
        console.error('Error fetching questions:', err);
      }
    };

    fetchQuestions();
  }, []);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recent Questions</h1>
      
      {questions.length === 0 ? (
        <div className="text-gray-500 text-xl">No questions found</div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <div 
              key={question._id} 
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {question.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {question.body}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {question.tags && question.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  Asked by {question.author?.username || 'Anonymous'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage; 