# Todo App (Vanilla JS)

A sleek, responsive Task Management application built with **Vanilla JavaScript**, **HTML5**, and **CSS3**. This project focuses on efficient DOM manipulation and persistent data handling **without the need for a backend**.

## Features

- Create, edit, and delete tasks
- Mark tasks as completed / uncompleted
- Persistent storage (no backend required)
- Responsive UI for desktop and mobile
- Fast, lightweight DOM-driven implementation

## Tech Stack

- **JavaScript** (Vanilla)
- **HTML5**
- **CSS3**

## Getting Started

### 1) Clone the repository
```bash
git clone https://github.com/shahmeerking231/todo_app.git
cd todo_app
```

### 2) Run locally
Because this is a frontend-only app, you can open it directly in a browser:

- Open `index.html` in your browser

For the best experience (and to avoid any browser restrictions), run a simple local server:

#### Option A: VS Code Live Server
- Install the **Live Server** extension
- Right-click `index.html` → **Open with Live Server**

#### Option B: Python (if installed)
```bash
python -m http.server 5500
```
Then visit:
- `http://localhost:5500`

## Project Structure (typical)

> File names may vary depending on your implementation, but most setups look like:

```text
todo_app/
├─ index.html
├─ styles/            # CSS files (or style.css)
├─ scripts/           # JS files (or script.js)
```

## How Data Persistence Works

Tasks are stored locally in the browser (commonly via `localStorage`), so your list remains available after refresh—without any backend or database.

## Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add my feature"`
4. Push to your branch: `git push origin feature/my-feature`
5. Open a Pull Request
