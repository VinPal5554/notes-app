// Function to fetch notes from the backend and display them
function fetchNotes() {
  fetch('http://localhost:3001/notes')
    .then(response => response.json())
    .then(data => {
      const notesList = document.getElementById('notes-list');
      notesList.innerHTML = '';
      data.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = "bg-white p-3 border rounded mb-2";
      
        const contentWrapper = document.createElement('div');
        contentWrapper.className = "flex justify-between items-center";
      
        const textGroup = document.createElement('div');
        textGroup.className = "flex flex-col flex-grow";
      
        const noteContent = document.createElement('p');
        noteContent.textContent = note.content;
        noteContent.className = "mb-1";
      
        const categoryLabel = document.createElement('span');
        categoryLabel.className = "text-sm text-gray-500";
        categoryLabel.textContent = `Category: ${note.category || 'Uncategorized'}`;
      
        textGroup.appendChild(noteContent);
        textGroup.appendChild(categoryLabel);
      
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
              body: JSON.stringify({ content: updatedContent, category: note.category }) // optional
            })
              .then(() => fetchNotes());
          }
        };
      
        const buttonGroup = document.createElement('div');
        buttonGroup.className = "flex gap-2 ml-4";
        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(saveButton);
        buttonGroup.appendChild(deleteButton);
      
        contentWrapper.appendChild(textGroup);
        contentWrapper.appendChild(editInput);
        contentWrapper.appendChild(buttonGroup);
      
        noteElement.appendChild(contentWrapper);
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
    const categoryInput = document.getElementById('note-category');
    const noteText = noteInput.value.trim();
    const categoryText = categoryInput ? categoryInput.value.trim() : '';
  
    if (noteText) {
      fetch('http://localhost:3001/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteText, category: categoryText })
      })
        .then(response => response.json())
        .then(() => {
          noteInput.value = '';
          if (categoryInput) categoryInput.value = '';
          fetchNotes();
        })
        .catch(error => console.error('Error adding note:', error));
    }
  }
  
  // Fetch notes when the page loads
  window.onload = fetchNotes;