import express from 'express';
import Entry from '../models/Entry.js';
import Habit from '../models/Habit.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.use(auth);

function normalizeDate(dateStr) {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
}

router.post('/toggle', async (req, res) => {
  const { habitId, date } = req.body;
  if (!habitId || !date) return res.status(400).json({ message: 'habitId and date are required' });

  const habit = await Habit.findOne({ _id: habitId, user: req.user.id });
  if (!habit) return res.status(404).json({ message: 'Habit not found' });

  const day = normalizeDate(date);
  const existing = await Entry.findOne({ habit: habitId, date: day });

  if (existing) {
    await Entry.deleteOne({ _id: existing._id });
    return res.json({ value: 0 });
  } else {
    const created = await Entry.create({ habit: habitId, date: day, value: 1 });
    return res.status(201).json({ value: created.value });
  }
});

router.post('/set', async (req, res) => {
  const { habitId, date, value } = req.body;
  if (!habitId || !date || typeof value !== 'number')
    return res.status(400).json({ message: 'habitId, date, value required' });

  const habit = await Habit.findOne({ _id: habitId, user: req.user.id });
  if (!habit) return res.status(404).json({ message: 'Habit not found' });

  const day = normalizeDate(date);
  const updated = await Entry.findOneAndUpdate(
    { habit: habitId, date: day },
    { $set: { value } },
    { upsert: true, new: true }
  );
  res.json({ value: updated.value });
});

export default router;
