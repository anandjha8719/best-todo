import React, { useState, useEffect } from "react";
import styles from "./TodoModal.module.css";
import { useTodo } from "../../contexts/todoContext";
import { useUser } from "../../contexts/userContext";
import UserTagger from "../UserTagger/UserTagger"; // Import the new component

const AddTodoModal = ({ todo = null, onClose }) => {
  const { addTodo, updateTodo } = useTodo();
  const { users } = useUser();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    tags: "",
    mentionedUsernames: [],
    status: "pending",
  });

  // If a todo is provided, populate the form for editing
  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || "",
        description: todo.description || "",
        priority: todo.priority || "Medium",
        tags: todo.tags ? todo.tags.join(", ") : "",
        mentionedUsernames: todo.mentionedUsers
          ? todo.mentionedUsers.map((user) => user.username)
          : [],
        status: todo.status || "pending",
      });
    }
  }, [todo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for when selected users change in the UserTagger component
  const handleUserSelectionChange = (selectedUsers) => {
    setFormData((prev) => ({
      ...prev,
      mentionedUsernames: selectedUsers,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert tags string to array
    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    const todoData = {
      ...formData,
      tags: tagsArray,
    };

    if (todo) {
      updateTodo(todo._id, todoData);
    } else {
      addTodo(todoData);
    }

    onClose();
  };

  const handleClickOutside = (e) => {
    if (e.target.className === styles.modalOverlay) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClickOutside}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{todo ? "View/Edit Todo" : "Add New Todo"}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="work, personal, urgent"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <UserTagger
              users={users}
              selectedUsernames={formData.mentionedUsernames}
              onChange={handleUserSelectionChange}
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {todo ? "Update" : "Create"} Todo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTodoModal;
