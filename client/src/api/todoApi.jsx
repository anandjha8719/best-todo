// api/todoApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch todos with optional query parameters
export const fetchTodos = async (queryParams) => {
  try {
    const response = await apiClient.get(
      `/todos${queryParams ? "?" + queryParams.toString() : ""}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
};

// Get a single todo by ID
export const fetchTodoById = async (id, username) => {
  try {
    const response = await apiClient.get(`/todos/${id}?user=${username}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching todo ${id}:`, error);
    throw error;
  }
};

// Create a new todo
export const createTodo = async (todoData) => {
  try {
    const response = await apiClient.post(`/todos?user=${todoData.user}`, todoData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating todo:", error);
    throw error;
  }
};

// Update an existing todo
export const updateTodoById = async (id, todoData, username) => {
  try {
    const response = await apiClient.put(
      `/todos/${id}?user=${username}`,
      todoData
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error updating todo ${id}:`, error);
    throw error;
  }
};

// Delete a todo
export const deleteTodoById = async (id, username) => {
  try {
    const response = await apiClient.delete(`/todos/${id}?user=${username}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting todo ${id}:`, error);
    throw error;
  }
};

// Add a note to a todo
export const addNoteToTodo = async (todoId, noteData, username) => {
  try {
    const response = await apiClient.post(
      `/todos/${todoId}/notes?user=${username}`,
      noteData
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding note to todo ${todoId}:`, error);
    throw error;
  }
};

// Export todos
export const exportTodos = async (format = "json", username) => {
  try {
    const response = await apiClient.get(
      `/todos/export?format=${format}&user=${username}`
    );
    return response.data;
  } catch (error) {
    console.error("Error exporting todos:", error);
    throw error;
  }
};
