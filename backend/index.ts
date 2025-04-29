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
  const { note } = req.body;
  if (!note) {
    res.status(400).json({ message: 'Note content is required!' });
    return;
  }

  await Note.create({ content: note });
  res.json({ message: 'Note added!' });
});


// Fallback to index.html for root route
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});


// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});