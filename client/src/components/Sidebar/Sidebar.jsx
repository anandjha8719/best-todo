import React, { useEffect, useState } from "react";
import { useTodo } from "../../contexts/todoContext";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const { todos, updateFilters, filters } = useTodo();
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    if (todos.length > 0) {
      const tagsSet = new Set();
      todos.forEach((todo) => {
        if (todo.tags && Array.isArray(todo.tags)) {
          todo.tags.forEach((tag) => tagsSet.add(tag));
        }
      });
      setAvailableTags(Array.from(tagsSet));
    }
  }, [todos]);

  const handlePriorityFilter = (e) => {
    const { value, checked } = e.target;
    let newPriorities = [...filters.priority];

    if (checked) {
      newPriorities.push(value);
    } else {
      newPriorities = newPriorities.filter((p) => p !== value);
    }

    updateFilters({ priority: newPriorities });
  };

  const handleTagFilter = (tag) => {
    let newTags = [...filters.tags];

    if (newTags.includes(tag)) {
      newTags = newTags.filter((t) => t !== tag);
    } else {
      newTags.push(tag);
    }

    updateFilters({ tags: newTags });
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.filterSection}>
        <h3>Filters</h3>
        <div className={styles.filterGroup}>
          <h4>Priority</h4>
          <div className={styles.filterOptions}>
            <label>
              <input
                type="checkbox"
                value="High"
                checked={filters.priority.includes("High")}
                onChange={handlePriorityFilter}
              />{" "}
              High
            </label>
            <label>
              <input
                type="checkbox"
                value="Medium"
                checked={filters.priority.includes("Medium")}
                onChange={handlePriorityFilter}
              />{" "}
              Medium
            </label>
            <label>
              <input
                type="checkbox"
                value="Low"
                checked={filters.priority.includes("Low")}
                onChange={handlePriorityFilter}
              />{" "}
              Low
            </label>
          </div>
        </div>
        <div className={styles.filterGroup}>
          <h4>Tags</h4>
          <div className={`${styles.filterOptions} ${styles.tagsFilter}`}>
            {availableTags.length > 0 ? (
              availableTags.map((tag) => (
                <div
                  key={tag}
                  className={`${styles.tag} ${
                    filters.tags.includes(tag) ? styles.tagSelected : ""
                  }`}
                  onClick={() => handleTagFilter(tag)}
                >
                  {tag}
                </div>
              ))
            ) : (
              <>
                <div className={styles.tagPlaceholder}></div>
                <div className={styles.tagPlaceholder}></div>
                <div className={styles.tagPlaceholder}></div>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
