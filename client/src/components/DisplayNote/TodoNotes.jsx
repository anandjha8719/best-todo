import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaEdit } from "react-icons/fa";
import styles from "./TodoNotes.module.css";
import TodoNoteEdit from "../TodoNoteAdd/TodoNoteEdit";

const TodoNotes = ({ notes, todoId }) => {
  const [expanded, setExpanded] = useState(false);
  const [editingNoteIndex, setEditingNoteIndex] = useState(null);

  if (!notes || notes.length === 0) {
    return null;
  }

  const handleEditClick = (index) => {
    setEditingNoteIndex(index);
    // Make sure notes are expanded when editing
    if (!expanded) {
      setExpanded(true);
    }
  };

  const closeNoteEdit = () => {
    setEditingNoteIndex(null);
  };

  return (
    <div className={styles.container}>
      <button className={styles.toggle} onClick={() => setExpanded(!expanded)}>
        <span>Notes ({notes.length})</span>
        {expanded ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {expanded && (
        <div className={styles.content}>
          <ul className={styles.list}>
            {notes.map((note, index) => (
              <li key={index} className={styles.item}>
                {editingNoteIndex === index ? (
                  <TodoNoteEdit
                    todoId={todoId}
                    noteIndex={index}
                    initialContent={note}
                    onClose={closeNoteEdit}
                  />
                ) : (
                  <div className={styles.noteContent}>
                    <span>{note}</span>
                    <button
                      className={styles.editNoteButton}
                      onClick={() => handleEditClick(index)}
                      title="Edit Note"
                    >
                      <FaEdit />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TodoNotes;