import express from 'express';
import cors from 'cors';

const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Temporary in-memory store for notes
const notes: string[] = [];

// Root route (/) to show a basic message
app.get('/', (req, res) => {
  res.send('Welcome to the Notes App!');
});

// GET route for notes
app.get('/notes', (req, res) => {
  res.json(notes);  // Returning an empty array as a placeholder for notes
});

// Route to add a new note
app.post('/notes', (req, res) => {
  const { note } = req.body;  // Extract the note from the request body
  if (note) {
    notes.push(note);  // Add the new note to the array
    res.json({ message: 'Note added!' });
  } else {
    res.status(400).json({ message: 'Note content is required!' });
  }
});


// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});