# SigmaGPT

SigmaGPT is a full-stack AI chat application with user authentication, persistent conversation threads, and Markdown-rendered responses.

## Features

- JWT authentication with HTTP-only cookies
- Bcrypt password hashing
- Protected Express API routes
- User-specific MongoDB chat history
- Create, open, and delete conversation threads
- Groq-powered AI responses
- Markdown and syntax-highlighted code rendering
- React and Vite frontend
- Render deployment configuration

## Stack

React, Vite, Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, and Groq API.

## Local Setup

Create `Backend/.env` with:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_development_secret
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:5173
```

Run the backend:

```bash
cd Backend
npm install
npm run dev
```

Run the frontend in a second terminal:

```bash
cd Frontend
npm install
npm run dev
```

## Live Demo

- Frontend: https://sigmagpt-web-kfya.onrender.com
- Backend health check: https://sigmagpt-api-sj06.onrender.com
