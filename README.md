<h1 align="center">✅ Taskmaster Pro</h1>

<p align="center">A kanban-style task board with due dates, drag-and-drop and automatic saving.</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&amp;logo=html5&amp;logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&amp;logo=css&amp;logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&amp;logo=javascript&amp;logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&amp;logo=jquery&amp;logoColor=white" alt="jQuery">
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&amp;logo=bootstrap&amp;logoColor=white" alt="Bootstrap">
</p>

<p align="center"><img src="docs/screenshot.png" alt="Taskmaster Pro showing a To Do list of tasks with due-date badges" width="850"></p>

## Features

- Four columns: **To Do**, **In Progress**, **In Review** and **Done**
- Add tasks with a description and due date (date picker) from a pop-up form
- Drag and drop tasks between columns, or reorder them within a column
- Click a task's text or due date to edit it in place
- Due-date warnings:
  - Yellow for tasks due within 2 days
  - Red for overdue tasks
  - Tasks in Done are never flagged
- Delete a single task, or clear the whole board
- Everything is saved to `localStorage` automatically
- Responsive layout: columns stack on smaller screens

## Built With

- HTML, CSS and JavaScript
- [jQuery](https://jquery.com/) and [jQuery UI Sortable](https://jqueryui.com/sortable/) for drag-and-drop
- [Bootstrap 4](https://getbootstrap.com/docs/4.3/) for layout and the modal

## Running Locally

No build step is needed.

1. Clone the repo:
   ```bash
   git clone https://github.com/ChristianKrantz11/taskmaster-pro.git
   ```
2. Open `index.html` in your browser.

## Project Structure

```
├── index.html
└── assets/
    ├── css/style.css
    └── js/script.js
```

## Author

[ChristianKrantz11](https://github.com/ChristianKrantz11)
