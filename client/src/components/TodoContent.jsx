import {
  FaPlus,
  FaSearch,
  FaStickyNote,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useState } from "react";
import AddTodoModal from "./AddTodoModal";

const TodoContent = () => {
  const [showModal, setShowModal] = useState(false);

  const sampleTodo = {
    id: 1,
    title: "Complete the todo app assignment",
    priority: "high",
    tags: ["work", "coding"],
    users: ["@john_doe"],
  };

  return (
    <section className="todo-content">
      <AddTodoModal show={showModal} onClose={() => setShowModal(false)} />

      <div className="todo-actions">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Todo
        </button>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search todos..."
            className="search-input"
          />
          <button className="search-btn">
            <FaSearch />
          </button>
        </div>
      </div>


      <div className="todo-list">
        <div className="todo-item">
          <div className="todo-checkbox">
            <input type="checkbox" id="todo-1" />
            <label htmlFor="todo-1" />
          </div>
          <div className="todo-content">
            <h3 className="todo-title">{sampleTodo.title}</h3>
            <div className="todo-meta">
              <span className={`todo-priority priority-${sampleTodo.priority}`}>
                {sampleTodo.priority}
              </span>
              <div className="todo-tags">
                {sampleTodo.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="todo-users">
                {sampleTodo.users.map((user) => (
                  <span key={user} className="user-tag">
                    {user}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="todo-actions">
            <button className="todo-note-btn">
              <FaStickyNote />
            </button>
            <button className="todo-edit-btn">
              <FaEdit />
            </button>
            <button className="todo-delete-btn">
              <FaTrash />
            </button>
          </div>
        </div>
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
          Next <FaChevronRight/>
        </button>
      </div> 
    </section>
  );
};

export default TodoContent;
