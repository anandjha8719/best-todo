import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaStickyNote,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useState } from "react";
import AddTodoModal from "./AddTodoModal";
import TodoNotes from "./TodoNotes";
import { useTodo } from "../contexts/todoContext";

const TodoContent = () => {
  const { todos: data, deleteTodo, updateFilters, filters } = useTodo();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const handleAddNewClick = () => {
    setSelectedTodo(null); // Reset selected todo when adding a new one
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

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="todo-content">
      <div className="todo-actions">
        <button className="btn btn-primary" onClick={handleAddNewClick}>
          <FaPlus /> Add Todo
        </button>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search todos..."
            className="search-input"
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />

          <FaSearch />
        </div>
      </div>

      <div className="todo-list">
        {data.map((item, index) => {
          return (
            <div className="todo-item" key={index}>
              <div className="todo-checkbox">
                <input type="checkbox" id="todo-1" />
                <label htmlFor="todo-1" />
              </div>
              <div className="todo-content">
                <h3 className="todo-title">{item.title}</h3>
                <div className="todo-meta">
                  <span className={`todo-priority priority-${item.priority}`}>
                    {item.priority}
                  </span>
                  <div className="todo-tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="todo-users">
                    {item.mentionedUsers.map((user) => (
                      <span key={user._id} className="user-tag">
                        {user.username}
                      </span>
                    ))}
                  </div>
                </div>
                <TodoNotes notes={item.notes} />
              </div>

              <div className="todo-actions">
                <FaStickyNote />
                <FaEdit onClick={() => handleEditClick(item)} />
                <FaTrash onClick={() => handleDeleteClick(item._id)} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pagination-controls">
        <button className="pagination-prev" disabled>
          <FaChevronLeft /> Previous
        </button>
        <div className="pagination-pages">
          <span className="pagination-current">1</span> /
          <span className="pagination-total">10</span>
        </div>
        <button className="pagination-next">
          Next <FaChevronRight />
        </button>
      </div>
      {isModalOpen && <AddTodoModal todo={selectedTodo} onClose={closeModal} />}
    </section>
  );
};

export default TodoContent;
