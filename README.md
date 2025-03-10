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
