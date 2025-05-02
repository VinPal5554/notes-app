// Function to fetch notes from the backend and display them
function fetchNotes() {
  fetch('http://localhost:3001/notes')
    .then(response => response.json())
    .then(data => {
      const notesList = document.getElementById('notes-list');
      notesList.innerHTML = '';
      data.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = "bg-white p-3 border rounded mb-2 flex justify-between items-center";
      
        const noteContent = document.createElement('p');
        noteContent.textContent = note.content;
        noteContent.className = "flex-grow";
      
        const editInput = document.createElement('input');
        editInput.value = note.content;
        editInput.style.display = 'none';
        editInput.className = "flex-grow border p-1 mr-2";
      
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
      
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.display = 'none';
      
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteNote(note._id);
      
        editButton.onclick = () => {
          noteContent.style.display = 'none';
          editInput.style.display = 'block';
          editButton.style.display = 'none';
          saveButton.style.display = 'inline';
        };
      
        saveButton.onclick = () => {
          const updatedContent = editInput.value.trim();
          if (updatedContent) {
            fetch(`http://localhost:3001/notes/${note._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content: updatedContent })
            })
              .then(() => fetchNotes());
          }
        };
      
        const buttonGroup = document.createElement('div');
        buttonGroup.className = "flex gap-2 ml-4";
        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(saveButton);
        buttonGroup.appendChild(deleteButton);
      
        noteElement.appendChild(noteContent);
        noteElement.appendChild(editInput);
        noteElement.appendChild(buttonGroup);
      
        notesList.appendChild(noteElement);
      });
    });
}

function deleteNote(id) {
  fetch(`http://localhost:3001/notes/${id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(() => fetchNotes())
    .catch(error => console.error('Error deleting note:', error));
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