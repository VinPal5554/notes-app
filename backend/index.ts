import express from 'express';
import cors from 'cors';

const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Root route (/) to show a basic message
app.get('/', (req, res) => {
  res.send('Welcome to the Notes App!');
});


// Sample GET route for notes
app.get('/notes', (req, res) => {
  res.json([]);  // Returning an empty array as a placeholder for notes
});

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});