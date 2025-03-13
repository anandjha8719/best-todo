import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaStickyNote,
  FaEye,
} from "react-icons/fa";
import { useState } from "react";
import AddTodoModal from "../TodoModal/AddTodoModal";
import TodoNotes from "../DisplayNote/TodoNotes";
import TodoNoteAdd from "../TodoNoteAdd/TodoNoteAdd";
import { useTodo } from "../../contexts/todoContext";
import styles from "./TodoContent.module.css";

const TodoContent = () => {
  const {
    todos,
    loading,
    hasMore,
    loadMoreTodos,
    deleteTodo,
    updateFilters,
    filters,
    updateTodo,
  } = useTodo();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState(null);

  const handleAddNewClick = () => {
    setSelectedTodo(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (todo) => {
    setSelectedTodo(todo);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      deleteTodo(id);
    }
  };

  const handleStatusChange = async (todo) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newStatus = todo.status === "completed" ? "pending" : "completed";
      await updateTodo(todo._id, { status: newStatus });
    } catch (error) {
      console.error("Failed to update todo status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNoteButtonClick = (id) => {
    setActiveNoteId(activeNoteId === id ? null : id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeNoteAdd = () => {
    setActiveNoteId(null);
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    updateFilters({ search: searchValue });
  };

  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return styles.priorityHigh;
      case "medium":
        return styles.priorityMedium;
      case "low":
        return styles.priorityLow;
      default:
        return "";
    }
  };

  return (
    <section className={styles.todoContent}>
      <div className={styles.todoActions}>
        <button className={styles.addButton} onClick={handleAddNewClick}>
          <FaPlus /> Add Todo
        </button>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search todos..."
            className={styles.searchInput}
            value={filters.search}
            onChange={handleSearch}
          />
          <FaSearch className={styles.searchIcon} />
        </div>
      </div>

      <div className={styles.todoList}>
        {todos.length === 0 && !loading ? (
          <div className={styles.noTodos}>
            No todos found. Add a new todo to get started!
          </div>
        ) : (
          todos.map((item) => (
            <div
              className={`${styles.todoItem} ${
                item.status === "completed" ? styles.todoCompleted : ""
              }`}
              key={item._id}
            >
              <div className={styles.todoItemHeader}>
                <div className={styles.todoCheckboxContainer}>
                  <input
                    type="checkbox"
                    id={`todo-${item._id}`}
                    className={styles.todoCheckbox}
                    checked={item.status === "completed"}
                    onChange={() => handleStatusChange(item)}
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor={`todo-${item._id}`}
                    className={styles.todoCheckboxLabel}
                  />
                </div>
                <h3 className={styles.todoTitle}>{item.title}</h3>
                <div className={styles.todoActionButtons}>
                  <button
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => handleEditClick(item)}
                    title="View"
                  >
                    <FaEye />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => handleEditClick(item)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDeleteClick(item._id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.noteButton}`}
                    onClick={() => handleNoteButtonClick(item._id)}
                    title="Add Note"
                  >
                    <FaStickyNote />
                  </button>
                </div>
              </div>

              <div
                className={styles.todoMeta}
                onClick={() => handleEditClick(item)}
              >
                <span
                  className={`${styles.todoPriority} ${getPriorityClass(
                    item.priority
                  )}`}
                >
                  {item.priority}
                </span>

                <div className={styles.todoTags}>
                  {item.tags &&
                    item.tags.length > 0 &&
                    item.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                </div>

                <div className={styles.todoUsers}>
                  {item.mentionedUsers &&
                    item.mentionedUsers.length > 0 &&
                    item.mentionedUsers.map((user) => (
                      <span key={user._id} className={styles.userTag}>
                        @{user.username}
                      </span>
                    ))}
                </div>
              </div>

              {activeNoteId === item._id && (
                <TodoNoteAdd todoId={item._id} onClose={closeNoteAdd} />
              )}

              <TodoNotes notes={item.notes} todoId={item._id} />
            </div>
          ))
        )}
      </div>

      {todos.length > 0 && (
        <div className={styles.loadMoreContainer}>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : (
            hasMore && (
              <button className={styles.loadMoreButton} onClick={loadMoreTodos}>
                Load More
              </button>
            )
          )}
        </div>
      )}

      {isModalOpen && <AddTodoModal todo={selectedTodo} onClose={closeModal} />}
    </section>
  );
};

export default TodoContent;
