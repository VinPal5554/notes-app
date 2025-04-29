// Function to fetch notes from the backend and display them
function fetchNotes() {
  fetch('http://localhost:3001/notes')
    .then(response => response.json())
    .then(data => {
      const notesList = document.getElementById('notes-list');
      notesList.innerHTML = ''; // Clear existing notes
      data.forEach(note => {
        const noteElement = document.createElement('p');
        noteElement.textContent = note.content; // Access the 'content' property
        notesList.appendChild(noteElement);
      });
    });
}
  
  // Function to add a new note to the backend
  function addNote() {
    const noteInput = document.getElementById('note-input');
    const noteText = noteInput.value.trim();
    if (noteText) {
      // Send POST request to add the new note
      fetch('http://localhost:3001/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteText })
      })
        .then(response => response.json())
        .then(() => {
          noteInput.value = '';  // Clear the input field
          fetchNotes();  // Refresh the notes list
        })
        .catch(error => console.error('Error adding note:', error));
    }
  }
  
  // Fetch notes when the page loads
  window.onload = fetchNotes;