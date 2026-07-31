# 🗳️ LivePoll

A real-time polling app — create a poll, share it, and watch votes update live across every connected browser via WebSockets.

<img width="1919" height="913" alt="image" src="https://github.com/user-attachments/assets/09a3438b-6491-4ba1-bbf7-c8f5217df72a" />
<img width="1917" height="924" alt="image" src="https://github.com/user-attachments/assets/e97196c5-26ba-4109-a2e6-aa4c534a28f1" />

## Features

- Create polls with 2–5 options
- Vote on a poll and see results update in real time (no refresh needed)
- Live vote counts and percentages, broadcast instantly via Socket.IO
- One vote per poll per browser (tracked via `localStorage`)
- Responsive UI built with React

## Tech Stack

**Frontend**
- React 19
- React Router
- Socket.IO Client
- Bootstrap / custom CSS

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Socket.IO (real-time updates)

## Project Structure

```
Live-Poll/
├── backend/
│   ├── controllers/       # Route handler logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routes
│   ├── db.js                # MongoDB connection
│   └── server.js            # Express + Socket.IO entry point
├── frontend/
│   └── src/
│       ├── components/      # Navbar, PollCard, etc.
│       ├── pages/           # HomePage, CreatePage, PollPage
│       ├── styles/          # CSS per page/component
│       └── socket.js        # Socket.IO client setup
└── package.json              # Root scripts to run both apps together
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repo

```bash
git clone https://github.com/Debocoderoid/Live-Poll.git
cd Live-Poll
```

### 2. Install dependencies

```bash
npm install --prefix backend
npm install --prefix frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside `backend/`:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3001
```

### 4. Run the app

From the project root, start both frontend and backend together:

```bash
npm start
```

This runs:
- Backend on **http://localhost:3001**
- Frontend on **http://localhost:3000**

Or run them separately:

```bash
npm run backend    # starts the Express + Socket.IO server
npm run frontend   # starts the React dev server
```

## API Reference

| Method | Endpoint              | Description                  |
|--------|-----------------------|-------------------------------|
| GET    | `/api/polls`           | Get all polls (newest first)  |
| POST   | `/api/polls`           | Create a new poll              |
| GET    | `/api/polls/:id`       | Get a single poll by ID        |
| POST   | `/api/polls/:id/vote`  | Submit a vote (REST fallback)  |

Votes are primarily submitted over a Socket.IO event (`submitVote`) for real-time broadcasting, with `pollUpdated` emitted to all clients in that poll's room.

## License

ISC
