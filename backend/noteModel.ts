import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  content: { type: String, required: true },
  category: { type: String }, // New field for category/tag
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Note', noteSchema);

