import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              VoidQA
            </Link>
            <div className="space-x-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-gray-800 transition"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 