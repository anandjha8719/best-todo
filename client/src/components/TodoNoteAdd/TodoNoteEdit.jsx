import React, { useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import { useTodo } from "../../contexts/todoContext";
import styles from "./TodoNoteAdd.module.css"; // Reuse existing styles

const TodoNoteEdit = ({ todoId, noteIndex, initialContent, onClose }) => {
  const [noteContent, setNoteContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { editNote } = useTodo();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!noteContent.trim()) return;

    setIsSubmitting(true);
    try {
      await editNote(todoId, noteIndex, noteContent);
      onClose();
    } catch (error) {
      console.error("Failed to edit note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.noteAddContainer}>
      <div className={styles.noteAddHeader}>
        <h4>Edit Note</h4>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          className={styles.noteInput}
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Edit your note here..."
          rows={3}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className={styles.addNoteButton}
          disabled={isSubmitting || !noteContent.trim()}
        >
          <FaSave /> Save
        </button>
      </form>
    </div>
  );
};

export default TodoNoteEdit;
