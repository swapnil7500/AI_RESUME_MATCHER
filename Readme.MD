# AI Resume Matcher

A full-stack MERN application that lets a user upload a resume (PDF), paste a job description, and get back an AI-generated match score, missing keywords, and actionable suggestions — powered by Google's Gemini API.

## Features

- User authentication with JWT access + refresh tokens (httpOnly cookies)
- PDF resume upload with server-side text extraction
- Per-user resume history
- AI-powered resume-vs-job-description matching (score, missing keywords, suggestions)
- Match history per user
- Protected routes on both frontend and backend

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, Multer (file upload), pdf-parse (text extraction), Google Generative AI SDK (Gemini)

**Frontend:** React (Vite), React Router, Tailwind CSS, Axios, React Context (auth state)

## Architecture

```
User → React Frontend → Express API → MongoDB (data)
                              |
                              └──→ Gemini API (AI scoring)
```

**Match request lifecycle:**
1. User selects an uploaded resume and pastes a job description
2. Frontend sends `{ resumeId, jobDescription }` to the backend
3. Backend verifies the JWT and identifies the user
4. Backend fetches the resume (scoped to the logged-in user)
5. Backend builds a prompt from resume text + job description and calls Gemini
6. Gemini returns a structured JSON result: match score, missing keywords, suggestions
7. Backend validates the result and saves it as a match record
8. Frontend renders the score and suggestions

## Project Structure

```
AI_RESUME_MATCHER/
├── Resume-Matcher-Backend/
│   ├── .env.sample
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── index.js
│       ├── config/constants.js
│       ├── db/index.js
│       ├── models/
│       │   ├── user.model.js
│       │   ├── resume.model.js
│       │   └── jobmatch.model.js
│       ├── middlewares/
│       │   ├── auth.middleware.js
│       │   ├── multer.middleware.js
│       │   └── error.middleware.js
│       ├── controllers/
│       │   ├── user.controller.js
│       │   ├── resume.controller.js
│       │   └── match.controller.js
│       ├── routes/
│       │   ├── user.routes.js
│       │   ├── resume.routes.js
│       │   └── match.routes.js
│       └── utils/
│           ├── ApiError.js
│           ├── ApiResponse.js
│           ├── asyncHandler.js
│           └── aiMatcher.js
└── Resume-Matcher-Frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   ├── axios.js
        │   ├── auth.api.js
        │   ├── resume.api.js
        │   └── match.api.js
        ├── context/AuthContext.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── UploadResume.jsx
            └── MatchResult.jsx
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas cluster (or local MongoDB)
- A Gemini API key ([Google AI Studio](https://aistudio.google.com))

### 1. Clone the repo
```bash
git clone https://github.com/swapnil7500/AI_RESUME_MATCHER.git
cd AI_RESUME_MATCHER
```

### 2. Backend setup
```bash
cd Resume-Matcher-Backend
npm install
cp .env.sample .env
```
Fill in `.env`:
```
PORT=8000
MONGODB_URI=your-mongodb-connection-string
CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your-access-token-secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRY=10d

GEMINI_API_KEY=your-gemini-api-key
```
Run it:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd Resume-Matcher-Frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`, talking to the backend at `http://localhost:8000`.

## API Reference

All routes are prefixed with `/api/v1`.

**Users** (`/users`)
| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/register` | No | Create a new account |
| POST | `/login` | No | Log in, sets access/refresh token cookies |
| POST | `/logout` | Yes | Clears auth cookies |
| POST | `/refresh-token` | No (uses refresh cookie) | Issues a new access token |
| GET | `/current-user` | Yes | Returns the logged-in user |

**Resumes** (`/resumes`) — all routes require auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/upload` | Upload a PDF resume (multipart, field name `resume`) |
| GET | `/` | List the current user's uploaded resumes |
| GET | `/:resumeId` | Get a single resume by ID |

**Matches** (`/match`) — all routes require auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Run a match against a resume + job description |
| GET | `/` | List the current user's match history |
| GET | `/:matchId` | Get a single match result by ID |

## License

ISC