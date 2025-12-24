import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema(
  {
    habit: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true, index: true },
    date: { type: Date, required: true, index: true },
    value: { type: Number, default: 1 },
  },
  { timestamps: true }
);

entrySchema.index({ habit: 1, date: 1 }, { unique: true });

export default mongoose.model('Entry', entrySchema);
