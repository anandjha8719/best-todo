
import { useState } from 'react';
import { FaFileExport, FaChevronDown } from 'react-icons/fa';
import placeholderAvatar from '../../assets/placeholder-avatar.png';

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState('Current User');
  const [showDropdown, setShowDropdown] = useState(false);
  
  const users = [
    { username: 'john_doe', displayName: 'John Doe' },
    { username: 'jane_smith', displayName: 'Jane Smith' },
    { username: 'bob_brown', displayName: 'Bob Brown' },
  ];

  return (
    <header className="app-header">
      <h1>Todo List</h1>
      <div className="user-controls">
        <button className="btn btn-secondary">
          <FaFileExport /> Export
        </button>

        <div className="user-switcher">
          <button 
            className="user-switcher-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="current-username">{currentUser}</span>
            <FaChevronDown />
          </button>
          
          {showDropdown && (
            <div className="user-dropdown">
              {users.map(user => (
                <div 
                  key={user.username}
                  className="user-dropdown-item"
                  onClick={() => {
                    setCurrentUser(user.displayName);
                    setShowDropdown(false);
                  }}
                >
                  <img src={placeholderAvatar} alt={user.displayName} className="avatar-small" />
                  <span>{user.displayName}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="user-profile">
          <span className="username">{currentUser}</span>
          <img src={placeholderAvatar} alt="User avatar" className="avatar" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;