const Sidebar = () => {
    return (
      <aside className="app-sidebar">
        <div className="filter-section">
          <h3>Filters</h3>
          <div className="filter-group">
            <h4>Priority</h4>
            <div className="filter-options">
              <label><input type="checkbox" value="high" /> High</label>
              <label><input type="checkbox" value="medium" /> Medium</label>
              <label><input type="checkbox" value="low" /> Low</label>
            </div>
          </div>
          <div className="filter-group">
            <h4>Tags</h4>
            <div className="filter-options tags-filter">
              <div className="tag-placeholder" />
              <div className="tag-placeholder" />
              <div className="tag-placeholder" />
            </div>
          </div>
        </div>
      </aside>
    );
  };
  
  export default Sidebar;