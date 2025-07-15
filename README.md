# VoidQA - Question & Answer Platform

VoidQA is a modern Q&A platform built with the MERN stack (MongoDB, Express.js, React, Node.js) that allows users to ask questions, provide answers, and engage with the community through voting and tagging.

## Features

- **User Authentication**
  - Sign up with username and email
  - Secure login/logout functionality
  - Protected routes for authenticated users

- **Questions**
  - Ask questions with titles, descriptions, and tags
  - View all questions with vote counts and answer counts
  - Search questions by tags (supports multiple tags)
  - Vote on questions (upvote/downvote)

- **Answers**
  - Post answers to questions
  - Vote on answers
  - View answer counts and vote statistics

- **Search & Navigation**
  - Tag-based search functionality
  - Real-time search results
  - Clean and intuitive user interface
  - Responsive design for all devices

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/VoidQA.git
cd VoidQA
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Create a .env file in the backend directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

5. Start the backend server
```bash
cd backend
npm start
```

6. Start the frontend development server
```bash
cd frontend
npm run dev
```

The application should now be running at `http://localhost:5173` (frontend) and `http://localhost:5000` (backend).

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/search` - Search questions by tags
- `GET /api/questions/:id` - Get a specific question
- `POST /api/questions` - Create a new question
- `POST /api/questions/:id/vote` - Vote on a question

### Answers
- `POST /api/questions/:questionId/answers` - Add an answer to a question
- `POST /api/questions/:questionId/answers/:answerId/vote` - Vote on an answer

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- Inspired by platforms like Stack Overflow,Reddit.
