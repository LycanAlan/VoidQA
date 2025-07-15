import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Signup({ setIsLoggedIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validate inputs
    if (password !== confirmPassword) {
      setError("Passwords do not match!")
      return
    }

    // Basic password strength check
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    try {
      setIsLoading(true)
      
      // Call backend signup API
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        email,
        password
      })

      // Save token to local storage
      localStorage.setItem('token', response.data.token)

      // Update login state in parent component
      setIsLoggedIn(true)

      // Redirect to home page or dashboard
      navigate('/')
    } catch (err) {
      // Handle signup errors
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
      console.error('Signup error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl grid grid-cols-12 overflow-hidden">
        {/* Left side - Welcome Section */}
        <div className="hidden md:flex md:col-span-5 bg-blue-50 items-center justify-center p-12">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-blue-800 mb-6">Join VoidQA</h3>
            <p className="text-xl text-blue-600">Create your account and start your journey with us</p>
          </div>
        </div>
        
        {/* Right side - Signup Form */}
        <div className="col-span-12 md:col-span-7 bg-white p-8 sm:p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">Create New Account</h2>
          <p className="text-lg text-center text-gray-600 mb-8">Sign up to our platform</p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto w-full">
            <div>
              <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                required
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-base font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-3 rounded-lg text-base font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
            <div className="flex items-center my-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-400">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <Link 
              to="/login" 
              className="w-full block text-center border border-blue-500 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
            >
              Sign In
            </Link>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup 