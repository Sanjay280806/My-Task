// --- 1. Live Clock & Date ---
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    document.getElementById('live-time').textContent = `${hours}:${minutes}:${seconds} ${ampm}`;

    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    document.getElementById('live-date').textContent = now.toLocaleDateString(undefined, options);
}
setInterval(updateClock, 1000);
updateClock();


// --- 2. Quote of the Day (Online Fetch) ---
const quoteText = document.getElementById("quote-text");

function fetchDailyQuote() {
    quoteText.textContent = "Loading quote...";
    fetch("https://raw.githubusercontent.com/JamesFT/Database-Quotes-JSON/master/quotes.json")
        .then((res) => {
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json();
        })
        .then((data) => {
            const random = data[Math.floor(Math.random() * data.length)];
            const author = random.quoteAuthor ? random.quoteAuthor.trim() : "Unknown";
            quoteText.textContent = `"${random.quoteText.trim()}" — ${author}`;
        })
        .catch((err) => {
            console.error("Error fetching quote:", err);
            quoteText.textContent = '"Freedom is not worth having if it does not connote freedom to err." — Mohandas Gandhi';
        });
}
fetchDailyQuote();


// --- 3. Sticky Notes ---
const noteInput = document.getElementById('note-input');
const addNoteBtn = document.getElementById('add-note-btn');
const notesList = document.getElementById('notes-list');

let notes = JSON.parse(localStorage.getItem('my_space_notes')) || ['Welcome to notes!'];

function renderNotes() {
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        const li = document.createElement('li');
        li.className = 'item';
        li.innerHTML = `
      <span>${note}</span>
      <button class="del-btn" onclick="deleteNote(${index})">&times;</button>
    `;
        notesList.appendChild(li);
    });
    localStorage.setItem('my_space_notes', JSON.stringify(notes));
}

function addNote() {
    const text = noteInput.value.trim();
    if (text) {
        notes.push(text);
        noteInput.value = '';
        renderNotes();
    }
}

function deleteNote(index) {
    notes.splice(index, 1);
    renderNotes();
}

function clearNotes() {
    if (confirm("Clear all sticky notes?")) {
        notes = [];
        renderNotes();
    }
}

addNoteBtn.addEventListener('click', addNote);
noteInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addNote(); });
renderNotes();


// --- 4. To-Do List ---
const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('my_space_todos')) || [
    { text: 'Plan tomorrow’s goals', completed: false }
];

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
      <div class="todo-left">
        <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${index})">
        <span>${todo.text}</span>
      </div>
      <button class="del-btn" onclick="deleteTodo(${index})">&times;</button>
    `;
        todoList.appendChild(li);
    });
    localStorage.setItem('my_space_todos', JSON.stringify(todos));
}

function addTodo() {
    const text = todoInput.value.trim();
    if (text) {
        todos.push({ text: text, completed: false });
        todoInput.value = '';
        renderTodos();
    }
}

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    renderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
}

function clearTodos() {
    if (confirm("Clear all tasks?")) {
        todos = [];
        renderTodos();
    }
}

addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTodo(); });
renderTodos();


// --- 5. Bookmarks Manager ---
const bmTitleInput = document.getElementById('bm-title');
const bmUrlInput = document.getElementById('bm-url');
const addBmBtn = document.getElementById('add-bm-btn');
const bookmarksList = document.getElementById('bookmarks-list');

let bookmarks = JSON.parse(localStorage.getItem('my_space_bookmarks')) || [
    { title: 'Google', url: 'https://google.com' }
];

function renderBookmarks() {
    bookmarksList.innerHTML = '';
    bookmarks.forEach((bm, index) => {
        const li = document.createElement('li');
        li.className = 'item';
        li.innerHTML = `
      <a href="${bm.url}" target="_blank" rel="noopener noreferrer">${bm.title}</a>
      <button class="del-btn" onclick="deleteBookmark(${index})">&times;</button>
    `;
        bookmarksList.appendChild(li);
    });
    localStorage.setItem('my_space_bookmarks', JSON.stringify(bookmarks));
}

function addBookmark() {
    const title = bmTitleInput.value.trim();
    let url = bmUrlInput.value.trim();

    if (title && url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        bookmarks.push({ title, url });
        bmTitleInput.value = '';
        bmUrlInput.value = '';
        renderBookmarks();
    }
}

function deleteBookmark(index) {
    bookmarks.splice(index, 1);
    renderBookmarks();
}

function clearBookmarks() {
    if (confirm("Clear all bookmarks?")) {
        bookmarks = [];
        renderBookmarks();
    }
}

addBmBtn.addEventListener('click', addBookmark);
renderBookmarks();


// --- 6. Global Clear All Data ---
document.getElementById('clear-all-btn').addEventListener('click', () => {
    if (confirm("Are you sure you want to reset and clear ALL notes, tasks, and bookmarks?")) {
        localStorage.removeItem('my_space_notes');
        localStorage.removeItem('my_space_todos');
        localStorage.removeItem('my_space_bookmarks');

        notes = [];
        todos = [];
        bookmarks = [];

        renderNotes();
        renderTodos();
        renderBookmarks();
    }
});