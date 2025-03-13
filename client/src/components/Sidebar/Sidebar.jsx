import React from "react";
import { useTodo } from "../../contexts/todoContext";
import TagSearch from "../TagSearch/TagSearch"; // send all details via prop only for UX, all state updates still here in parent/sidebar
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const { availableTags, updateFilters, filters } = useTodo();

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

  const handleStatusFilter = (e) => {
    const { value } = e.target;
    updateFilters({ status: value });
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.filterSection}>
        <h3>Filters</h3>
        <div className={styles.filterGroup}>
          <h4>Status</h4>
          <div className={styles.filterOptions}>
            <label>
              <input
                type="radio"
                name="status"
                value=""
                checked={filters.status === ""}
                onChange={handleStatusFilter}
              />{" "}
              All
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="pending"
                checked={filters.status === "pending"}
                onChange={handleStatusFilter}
              />{" "}
              Pending
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="completed"
                checked={filters.status === "completed"}
                onChange={handleStatusFilter}
              />{" "}
              Completed
            </label>
          </div>
        </div>
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
          <TagSearch
            availableTags={availableTags}
            selectedTags={filters.tags}
            onTagSelect={handleTagFilter}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
