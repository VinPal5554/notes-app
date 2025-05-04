import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import Note from './noteModel'; 
import Category from './categoryModel'; 

mongoose.connect('mongodb://127.0.0.1:27017/notes-app')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();

// Middleware to enable CORS and parse JSON requests
app.use(cors());
app.use(express.json());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Get all categories
app.get('/categories', async (_req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// Create a new category
app.post('/categories', async (req, res) => {
  const { name, color } = req.body;
  try {
    const newCategory = await Category.create({ name, color });
    res.json(newCategory);
  } catch (err) {
    res.status(400).json({ message: 'Category creation failed', error: err });
  }
})

// GET route for notes
app.get('/notes', async (req: Request, res: Response) => {
  const { category, sortBy } = req.query;

  let filter: any = {};
  
  // Filter by category if provided
  if (category) {
    filter.category = category;
  }

  // Sort by recently added (createdAt) if specified
  const sortOptions: any = {};
  if (sortBy === 'recent') {
    sortOptions.createdAt = -1;  // Descending order for most recent first
  } else if (sortBy === 'oldest') {
    sortOptions.createdAt = 1;  // Ascending order for oldest first
  }

  const notes = await Note.find(filter).sort(sortOptions);
  res.json(notes);
});

// Route to add a new note
app.post('/notes', async (req: Request, res: Response): Promise<void> => {
  const { note, category } = req.body;
  if (!note) {
    res.status(400).json({ message: 'Note content is required!' });
    return;
  }

  await Note.create({ content: note, category });
  res.json({ message: 'Note added!' });
});


// Fallback to index.html for root route
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

app.delete('/notes/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedNote = await Note.findByIdAndDelete(id);
    if (deletedNote) {
      res.json({ message: 'Note deleted!' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to update a note
app.put('/notes/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content, category } = req.body;

    if (!content) {
      res.status(400).json({ message: 'Updated content is required!' });
      return;
    }

    const updatedNote = await Note.findByIdAndUpdate(id, { content, category }, { new: true });

    if (updatedNote) {
      res.json({ message: 'Note updated!', note: updatedNote });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});