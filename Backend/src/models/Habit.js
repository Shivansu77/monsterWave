import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    name: { type: String, required: true },
    color: { type: String, default: '#22c55e' },
    group: { type: String, default: null },
    order: { type: Number, default: 0 },
    type: { type: String, enum: ['build', 'break'], default: 'build' },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Habit', habitSchema);
