import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import habitRoutes from './routes/habits.js';
import entryRoutes from './routes/entries.js';

dotenv.config();

const app = express();
// Allow prod and local frontends; prepend env override if provided
const defaultOrigins = [
  'https://monsterwave.netlify.app',
  'https://polite-kashata-33482d.netlify.app',
  'https://monster-wave-dej8.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174'
];
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, ...defaultOrigins]
  : defaultOrigins;

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// Auth rate limiting disabled for now to avoid 429s behind shared IPs

app.get('/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'Habit Tracker API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/entries', entryRoutes);

// Prepare DB connection once per cold start; awaited per request
const dbReady = connectDB().catch((err) => {
  console.error('DB connection failed', err);
  throw err;
});

// Vercel serverless handler: ensure DB is ready, then pass to Express
export default async function handler(req, res) {
  await dbReady;
  return app(req, res);
}
