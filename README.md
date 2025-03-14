# Best Todo App

A modern full-stack todo application with React frontend and Node.js backend.

## Prerequisites

- Node.js (v18.x or higher)
- npm (v9.x or higher)

## Local Setup

### Clone the repository

```bash
git clone https://github.com/anandjha8719/best-todo.git
cd best-todo
```

### Install dependencies

```bash
# Install concurrently package
npm install

# Install frontend and backend dependencies simultaneously
npm run install:all
```

### Run the application

```bash
# Start frontend and backend concurrently
npm start
```

The application will be available at:
- Frontend: [http://localhost:5173/](http://localhost:5173/)
- Backend: [http://localhost:5000/](http://localhost:5000/)



### App improvements - 

## 1. Improvement by adding/understanding app Limitations
- a. Set a max number of notes allowed per todo (5 or 10)
- b. Only show limited fields for todos for homepage view - title, status, and others? maybe notes count (so that user can click on it and expand, to view all notes) decide based on required todo card design/interface for homepage)
- c. Allow a certain max number of tags while adding/updating a todo

## 2. UX improvements
- a. While adding tags, show matching tags that are already added by user in other todos
- b. Not allow any duplicate tags in same todo
- c. While adding notes, even if user decides to not click Add note button but have already wrote somthing in note input field, save the note.
- d. Automatically load more todos if user scroll to bottom of the todo list and there are more todos to show

## 3. Database & API improvements
- Handle notes in seperate collection if #1 -> #a is NOT allowed, otherwise make it a nested object in same todo collection
- Limit the note-listing api to only fetch required items as per #1 -> #b
- Maintain a seperate endpoint to select & apply tag filters (if #1 -> #c is not permitted)
- Maintain tags in seperate collection for #2 -> #a



## Features

- Create, read, update and delete todos
- Mark todos as complete
- Filter todos by status
- Responsive design

## Tech Stack

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB

## Project Structure

```
best-todo/
├── frontend/         # React frontend application
├── backend/          # Node.js backend API
├── package.json      # Root package.json for scripts
└── README.md         # Project documentation
```

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
