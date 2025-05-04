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
      
        const noteHeader = document.createElement('div');
        noteHeader.className = "flex justify-between items-center";
      
        const noteContent = document.createElement('p');
        noteContent.textContent = note.content;
        noteContent.className = "flex-grow";
      
        const categoryTag = document.createElement('span');
        if (note.category) {
          categoryTag.textContent = note.category.name;
          categoryTag.className = "text-white text-sm font-semibold px-2 py-1 rounded ml-2";
          categoryTag.style.backgroundColor = note.category.color || '#999';
        }
      
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
              body: JSON.stringify({ content: updatedContent, category: note.category?._id })
            })
              .then(() => fetchNotes());
          }
        };
      
        const buttonGroup = document.createElement('div');
        buttonGroup.className = "flex gap-2 ml-4";
        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(saveButton);
        buttonGroup.appendChild(deleteButton);
      
        noteHeader.appendChild(noteContent);
        if (note.category) noteHeader.appendChild(categoryTag);
      
        noteElement.appendChild(noteHeader);
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
    const categorySelect = document.getElementById('category-select');
    
    const noteText = noteInput.value.trim();
    const categoryId = categorySelect.value;
  
    if (noteText) {
      fetch('http://localhost:3001/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteText, category: categoryId })
      })
        .then(response => response.json())
        .then(() => {
          noteInput.value = '';
          fetchNotes();
        })
        .catch(error => console.error('Error adding note:', error));
    }
  }

  function addCategory() {
    const categoryNameInput = document.getElementById('category-name');
    const categoryColorInput = document.getElementById('category-color');
    
    const categoryName = categoryNameInput.value.trim();
    const categoryColor = categoryColorInput.value;
  
    if (categoryName) {
      fetch('http://localhost:3001/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName, color: categoryColor })
      })
        .then(response => response.json())
        .then(() => {
          // Reset the input fields and reload the categories
          categoryNameInput.value = '';
          categoryColorInput.value = '#000000';  // Default color
          loadCategories();
        })
        .catch(error => console.error('Error adding category:', error));
    }
  }
  

  function loadCategories() {
    fetch('http://localhost:3001/categories')
      .then(res => res.json())
      .then(data => {
        const categorySelect = document.getElementById('category-select');
        categorySelect.innerHTML = '<option value="">Select Category</option>';  // Clear and add default option
  
        // Populate categories from the backend
        data.forEach(cat => {
          const option = document.createElement('option');
          option.value = cat._id;  // Use category ID as the value
          option.textContent = cat.name;  // Display category name
          categorySelect.appendChild(option);
        });
      })
      .catch(err => console.error('Error loading categories:', err));
  }
  
  // Fetch notes when the page loads
  window.onload = () => {
    fetchNotes();
    loadCategories();
  }