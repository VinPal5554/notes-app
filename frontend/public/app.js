// Function to fetch notes from the backend and display them
function fetchNotes() {
  fetch('http://localhost:3001/notes')
    .then(response => response.json())
    .then(data => {
      const notesList = document.getElementById('notes-list');
      notesList.innerHTML = ''; // Clear previous notes

      data.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = "bg-white p-4 border rounded-lg shadow-lg hover:shadow-xl transition ease-in-out mb-4";

        const noteHeader = document.createElement('div');
        noteHeader.className = "flex justify-between items-center mb-2";

        const noteContent = document.createElement('p');
        noteContent.textContent = note.content;
        noteContent.className = "flex-grow text-lg text-gray-700";

        const categoryTag = document.createElement('span');
        if (note.category) {
          categoryTag.textContent = note.category.name;
          categoryTag.className = "text-white text-sm font-semibold px-3 py-1 rounded-full ml-2";
          categoryTag.style.backgroundColor = note.category.color || '#999';
        }

        const buttonGroup = document.createElement('div');
        buttonGroup.className = "flex gap-2 ml-4";

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = "bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none transition ease-in-out";

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.className = "bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 focus:outline-none transition ease-in-out";
        saveButton.style.display = 'none'; // Initially hidden

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = "bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 focus:outline-none transition ease-in-out";
        deleteButton.onclick = () => deleteNote(note._id);

        // Edit functionality
        editButton.onclick = () => {
          // Replace the text with an input field for editing
          const editInput = document.createElement('input');
          editInput.type = 'text';
          editInput.value = note.content;  // pre-fill with the current note content
          editInput.className = "flex-grow p-2 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out";

          // Hide note content and show edit input
          noteContent.style.display = 'none';
          buttonGroup.innerHTML = ''; // Clear the buttons (Edit, Save, Delete)
          
          // Show the input field and save button
          buttonGroup.appendChild(editInput);
          buttonGroup.appendChild(saveButton);
          saveButton.style.display = 'inline-block'; // Show save button

          // Save the edited note
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
        };

        // Append the buttons
        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(deleteButton);

        // Append content and category to the note
        noteHeader.appendChild(noteContent);
        if (note.category) noteHeader.appendChild(categoryTag);
        noteElement.appendChild(noteHeader);
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