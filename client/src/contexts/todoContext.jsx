import React, { createContext, useState, useEffect, useContext } from "react";
import { useUser } from "./userContext";
import {
  fetchTodos,
  createTodo,
  updateTodoById,
  deleteTodoById,
  addNoteToTodo,
} from "../api/todoApi";

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const { currentUser } = useUser();
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priority: [],
    tags: [],
    search: "",
    status: "",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    if (currentUser) {
      loadTodos();
    }
  }, [currentUser, filters.page, filters.limit]);

  // Apply filters when todos or filters change
  useEffect(() => {
    applyFilters();
  }, [todos, filters.priority, filters.tags, filters.search, filters.status]);

  const loadTodos = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      // Build query params
      const queryParams = new URLSearchParams({
        page: filters.page,
        limit: filters.limit,
        user: currentUser.username,
      });

      if (filters.status) queryParams.append("status", filters.status);

      const data = await fetchTodos(queryParams);
      setTodos(data.data);
    } catch (err) {
      setError("Failed to load todos. Please try again later.");
      console.error("Error loading todos:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...todos];

    // Apply priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter((todo) =>
        filters.priority.includes(todo.priority)
      );
    }

    // Apply tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(
        (todo) =>
          todo.tags && todo.tags.some((tag) => filters.tags.includes(tag))
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchTerm) ||
          (todo.description &&
            todo.description.toLowerCase().includes(searchTerm))
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter((todo) => todo.status === filters.status);
    }

    setFilteredTodos(filtered);
  };

  const addTodo = async (todoData) => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      // Add user to the request
      const newTodo = await createTodo({
        ...todoData,
        user: currentUser.username,
      });

      setTodos((prevTodos) => [newTodo, ...prevTodos]);
      return newTodo;
    } catch (err) {
      setError("Failed to add todo. Please try again.");
      console.error("Error adding todo:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id, todoData) => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      // Include user in query parameters
      const updatedTodo = await updateTodoById(
        id,
        todoData,
        currentUser.username
      );

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
      return updatedTodo;
    } catch (err) {
      setError("Failed to update todo. Please try again.");
      console.error("Error updating todo:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      // Include user in query parameters
      await deleteTodoById(id, currentUser.username);

      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      return true;
    } catch (err) {
      setError("Failed to delete todo. Please try again.");
      console.error("Error deleting todo:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (todoId, noteContent) => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      // Include user in query parameters
      const updatedTodo = await addNoteToTodo(
        todoId,
        { content: noteContent },
        currentUser.username
      );

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === todoId ? updatedTodo : todo))
      );
      return updatedTodo;
    } catch (err) {
      setError("Failed to add note. Please try again.");
      console.error("Error adding note:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const exportTodos = async (format = "json") => {
    if (!currentUser) return;

    try {
      // Implementation for export will depend on how your API works
      // For now, we'll just return a placeholder
      return `Exporting todos in ${format} format for user ${currentUser.username}`;
    } catch (err) {
      console.error("Error exporting todos:", err);
      return null;
    }
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const nextPage = () => {
    setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const prevPage = () => {
    if (filters.page > 1) {
      setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos: filteredTodos,
        loading,
        error,
        filters,
        totalPages: Math.ceil(todos.length / filters.limit),
        currentPage: filters.page,
        addTodo,
        updateTodo,
        deleteTodo,
        addNote,
        exportTodos,
        updateFilters,
        nextPage,
        prevPage,
        refreshTodos: loadTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => useContext(TodoContext);
