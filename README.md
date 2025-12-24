# Everyday-like Habit Tracker (MERN)

This project is a clean-room implementation inspired by a calendar-style habit tracker UI. It does not copy any brand assets or proprietary code. Built with: MongoDB, Express, React, Node.js (MERN).

## Features
- Email/password auth with JWT
- Create habits and mark daily completion (click squares)
- Calendar-like grid per habit for the last 21 days
- Simple streak stats and daily totals
- Minimal, responsive UI similar in spirit to the provided screenshot

## Quick Start (macOS)

1) Backend

```bash
cd Backend
cp .env.sample .env
# Edit .env → set MONGODB_URI, JWT_SECRET
npm install
npm run dev
```

2) Frontend

```bash
# In a new terminal
cd Frontend
cp .env.sample .env
npm install
npm run dev
```

- Frontend runs on http://localhost:5173
- Backend runs on http://localhost:5000

## How to Use
1. Register a user (or login if already created).
2. Add habits in the left sidebar.
3. Click any square in the grid to toggle completion for that day.
4. Streak and totals appear in the right panel.

## Notes
- The grid shows the last 21 days ending today. You can extend this easily in `src/pages/Dashboard.jsx` by changing `daysRange(21)`.
- The backend stores one entry per habit per day (value 1 or absent). You can adapt `/api/entries/set` to support counts > 1 if needed.

## Tech Details
- Backend: Express, Mongoose, JWT, bcryptjs, express-validator
- Frontend: Vite, React, React Router, Axios, date-fns

## License
You may use and modify this implementation freely. Avoid reusing any third-party brand names, logos, or trademarks from the reference screenshot.
