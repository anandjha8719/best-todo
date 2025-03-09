import React, { useEffect, useState } from 'react';
import { useTodo } from '../contexts/todoContext';

const Sidebar = () => {
  const { todos, updateFilters, filters } = useTodo();
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    if (todos.length > 0) {
      const tagsSet = new Set();
      todos.forEach(todo => {
        if (todo.tags && Array.isArray(todo.tags)) {
          todo.tags.forEach(tag => tagsSet.add(tag));
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
      newPriorities = newPriorities.filter(p => p !== value);
    }
    
    updateFilters({ priority: newPriorities });
  };

  const handleTagFilter = (tag) => {
    let newTags = [...filters.tags];
    
    if (newTags.includes(tag)) {
      newTags = newTags.filter(t => t !== tag);
    } else {
      newTags.push(tag);
    }
    
    updateFilters({ tags: newTags });
  };

  return (
    <aside className="app-sidebar">
      <div className="filter-section">
        <h3>Filters</h3>
        <div className="filter-group">
          <h4>Priority</h4>
          <div className="filter-options">
            <label>
              <input 
                type="checkbox" 
                value="High" 
                checked={filters.priority.includes('High')}
                onChange={handlePriorityFilter}
              /> High
            </label>
            <label>
              <input 
                type="checkbox" 
                value="Medium" 
                checked={filters.priority.includes('Medium')}
                onChange={handlePriorityFilter}
              /> Medium
            </label>
            <label>
              <input 
                type="checkbox" 
                value="Low" 
                checked={filters.priority.includes('Low')}
                onChange={handlePriorityFilter}
              /> Low
            </label>
          </div>
        </div>
        <div className="filter-group">
          <h4>Tags</h4>
          <div className="filter-options tags-filter">
            {availableTags.length > 0 ? (
              availableTags.map(tag => (
                <div 
                  key={tag} 
                  className={`tag ${filters.tags.includes(tag) ? 'selected' : ''}`}
                  onClick={() => handleTagFilter(tag)}
                >
                  {tag}
                </div>
              ))
            ) : (
              <>
                <div className="tag-placeholder"></div>
                <div className="tag-placeholder"></div>
                <div className="tag-placeholder"></div>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;