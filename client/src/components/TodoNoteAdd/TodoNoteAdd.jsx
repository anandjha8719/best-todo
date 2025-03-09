import React, { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useTodo } from "../../contexts/todoContext";
import styles from "./TodoNoteAdd.module.css";

const TodoNoteAdd = ({ todoId, onClose }) => {
  const [noteContent, setNoteContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNote } = useTodo();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!noteContent.trim()) return;

    setIsSubmitting(true);
    try {
      await addNote(todoId, noteContent);
      setNoteContent("");
      onClose();
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.noteAddContainer}>
      <div className={styles.noteAddHeader}>
        <h4>Add Note</h4>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          className={styles.noteInput}
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Type your note here..."
          rows={3}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className={styles.addNoteButton}
          disabled={isSubmitting || !noteContent.trim()}
        >
          <FaPlus /> Add
        </button>
      </form>
    </div>
  );
};

export default TodoNoteAdd;
