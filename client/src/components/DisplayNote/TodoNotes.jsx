import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from "./TodoNotes.module.css";

const TodoNotes = ({ notes }) => {
  const [expanded, setExpanded] = useState(false);

  if (!notes || notes.length === 0) {
    return null;
  }

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
