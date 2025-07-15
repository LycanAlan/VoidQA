import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AskQuestion from './pages/AskQuestion';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status when component mounts and on any change
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    // Remove token from local storage
    localStorage.removeItem('token');
    // Update login state
    setIsLoggedIn(false);
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600">
              VoidQA
            </Link>
            <div className="flex space-x-4 items-center">
              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-gray-800 hover:text-gray-600">
                    Login
                  </Link>
                  <Link to="/signup" className="text-gray-800 hover:text-gray-600">
                    Signup
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/login" 
            element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <HomePage />} 
          />
          <Route 
            path="/signup" 
            element={!isLoggedIn ? <Signup setIsLoggedIn={setIsLoggedIn} /> : <HomePage />} 
          />
          <Route 
            path="/ask" 
            element={isLoggedIn ? <AskQuestion /> : <Login setIsLoggedIn={setIsLoggedIn} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 