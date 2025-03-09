import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const TodoNotes = ({ notes }) => {
  const [expanded, setExpanded] = useState(false);

  if (!notes || notes.length === 0) {
    return null;
  }

  return (
    <div className="todo-notes-container">
      <button
        className="todo-notes-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <span>Notes ({notes.length})</span>
        {expanded ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {expanded && (
        <div className="todo-notes-content">
          <ul className="todo-notes-list">
            {notes.map((note, index) => (
              <li key={index} className="todo-note-item">
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TodoNotes;
