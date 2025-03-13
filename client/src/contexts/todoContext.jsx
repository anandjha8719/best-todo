import React, { createContext, useState, useEffect, useContext } from "react";
import { useUser } from "./userContext";
import {
  fetchTodos,
  createTodo,
  updateTodoById,
  deleteTodoById,
  addNoteToTodo,
  editNoteInTodo,
} from "../api/todoApi";

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const { currentUser } = useUser();
  const [todos, setTodos] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priority: [],
    tags: [],
    search: "",
    status: "",
    limit: 10,
    cursor: null,
  });
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadTodos();
    }
  }, [
    currentUser,
    filters.status,
    filters.search,
    filters.priority,
    filters.tags,
  ]);

  const loadTodos = async (refreshData = true) => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      // all necessery params
      const params = {
        limit: filters.limit,
        cursor: refreshData ? null : filters.cursor, // Don't use cursor if refreshing data
        status: filters.status,
        priority: filters.priority.length > 0 ? filters.priority : undefined,
        tags: filters.tags.length > 0 ? filters.tags : undefined,
        search: filters.search,
        user: currentUser.username,
      };

      const response = await fetchTodos(params);

      if (refreshData) {
        setTodos(response.data);
      } else {
        setTodos((prevTodos) => [...prevTodos, ...response.data]);
      }

      setHasMore(response.hasMore);
      setFilters((prev) => ({
        ...prev,
        cursor: response.nextCursor,
      }));

      if (response.availableTags) {
        setAvailableTags(response.availableTags);
      }
    } catch (err) {
      setError("Failed to load todos. Please try again later.");
      console.error("Error loading todos:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTodos = () => {
    if (hasMore && !loading) {
      loadTodos(false);
    }
  };

  const addTodo = async (todoData) => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const newTodo = await createTodo({
        ...todoData,
        user: currentUser.username,
      });

      loadTodos();
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
      const updatedTodo = await updateTodoById(
        id,
        todoData,
        currentUser.username
      );

      loadTodos();
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
      await deleteTodoById(id, currentUser.username);

      loadTodos();
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
      const updatedTodo = await addNoteToTodo(
        todoId,
        { content: noteContent },
        currentUser.username
      );
      loadTodos();
      return updatedTodo;
    } catch (err) {
      setError("Failed to add note. Please try again.");
      console.error("Error adding note:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const editNote = async (todoId, noteIndex, noteContent) => {
    if (!currentUser) return;
  
    setLoading(true);
    setError(null);
  
    try {
      const updatedTodo = await editNoteInTodo(
        todoId,
        { noteIndex, content: noteContent },
        currentUser.username
      );
      loadTodos();
      return updatedTodo;
    } catch (err) {
      setError("Failed to edit note. Please try again.");
      console.error("Error editing note:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      cursor: null,
    }));
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        availableTags,
        loading,
        error,
        filters,
        hasMore,
        addTodo,
        updateTodo,
        deleteTodo,
        addNote,
        editNote,
        updateFilters,
        loadMoreTodos,
        refreshTodos: () => loadTodos(true),
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => useContext(TodoContext);
