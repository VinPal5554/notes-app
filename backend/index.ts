import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import Note from './noteModel'; // assuming same folder

mongoose.connect('mongodb://127.0.0.1:27017/notes-app')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();

// Middleware to enable CORS and parse JSON requests
app.use(cors());
app.use(express.json());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, '../frontend/public')));

//const notes: string[] = [];

// API ROUTES

// GET route for notes
app.get('/notes', async (_req: Request, res: Response): Promise<void> => {
  const notes = await Note.find();
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