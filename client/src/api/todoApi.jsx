import axios from "axios";

const API_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// get todos with optional query parameters
export const fetchTodos = async (params = {}) => {
  try {
    const {
      limit = 10,
      cursor,
      status,
      priority,
      tags,
      search,
      sort = "createdAt",
      order = "desc",
      user,
    } = params;

    // building query parameters
    const queryParams = new URLSearchParams();

    // must include user and limit
    queryParams.append("user", user);
    queryParams.append("limit", limit);

    // optional parameters
    if (cursor) queryParams.append("cursor", cursor);
    if (status) queryParams.append("status", status);
    if (sort) queryParams.append("sort", sort);
    if (order) queryParams.append("order", order);
    if (search) queryParams.append("search", search);

    // array parameters --
    if (priority && Array.isArray(priority) && priority.length > 0) {
      priority.forEach((p) => queryParams.append("priority", p));
    }

    if (tags && Array.isArray(tags) && tags.length > 0) {
      tags.forEach((tag) => queryParams.append("tags", tag));
    }

    const response = await apiClient.get(`/todos?${queryParams.toString()}`);
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

// create new todo
export const createTodo = async (todoData) => {
  try {
    const response = await apiClient.post(
      `/todos?user=${todoData.user}`,
      todoData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating todo:", error);
    throw error;
  }
};

// update existing todo
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

// Add note
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

// Export todos //TODO:
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
