import express from 'express';
import { body, validationResult } from 'express-validator';
import Habit from '../models/Habit.js';
import Entry from '../models/Entry.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  const { from, to } = req.query;
  const query = { user: req.user.id, archived: { $ne: true } };
  const habits = await Habit.find(query).sort({ order: 1, createdAt: 1 });

  if (!from || !to) return res.json({ habits, entries: [] });

  const start = new Date(from);
  const end = new Date(to);
  const entries = await Entry.find({
    habit: { $in: habits.map((h) => h._id) },
    date: { $gte: start, $lte: end },
  });

  res.json({ habits, entries });
});

router.post(
  '/',
  [
    body('name').isString().isLength({ min: 1 }),
    body('color').optional().isString(),
    body('group').optional().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const habit = await Habit.create({
      user: req.user.id,
      name: req.body.name,
      color: req.body.color,
      group: req.body.group || null,
    });
    res.status(201).json(habit);
  }
);

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const update = {};
  if (req.body.name !== undefined) update.name = req.body.name;
  if (req.body.color !== undefined) update.color = req.body.color;
  if (req.body.group !== undefined) update.group = req.body.group;
  if (req.body.order !== undefined) update.order = req.body.order;
  if (req.body.type !== undefined) update.type = req.body.type;
  if (req.body.archived !== undefined) update.archived = req.body.archived;

  const habit = await Habit.findOneAndUpdate({ _id: id, user: req.user.id }, update, { new: true });
  if (!habit) return res.status(404).json({ message: 'Habit not found' });
  res.json(habit);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const habit = await Habit.findOneAndDelete({ _id: id, user: req.user.id });
  if (!habit) return res.status(404).json({ message: 'Habit not found' });
  await Entry.deleteMany({ habit: id });
  res.json({ ok: true });
});

export default router;
