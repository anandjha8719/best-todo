import { FaTimes } from 'react-icons/fa';

const AddTodoModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Todo</h3>
          <button onClick={onClose} className="close-btn">
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          <form>
            <div className="form-group">
              <label>Title</label>
              <input type="text" placeholder="Enter todo title" />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Add Todo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTodoModal;