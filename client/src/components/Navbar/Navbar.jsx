import { useState, useRef, useEffect } from "react";
import { FaFileExport, FaChevronDown } from "react-icons/fa";
import { useUser } from "../../contexts/userContext";
import placeholderAvatar from "../../assets/placeholder-avatar.png";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { users, currentUser, switchUser } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [showDropdown]);

  const handleUserSwitch = (username) => {
    switchUser(username);
    setShowDropdown(false);
  };

  return (
    <header className={styles.navbar}>
      <h1 className={styles.title}>Todo List</h1>

      <div className={styles.controls}>
        <button className={styles.exportBtn}>
          <FaFileExport /> Export
        </button>

        {/* user switcher */}
        <div className={styles.userSwitcher} ref={dropdownRef}>
          <button
            className={styles.userSwitcherBtn}
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <span>{currentUser?.username || "Select User"}</span>
            <FaChevronDown />
          </button>

          {showDropdown && (
            <div className={styles.dropdown}>
              {users.map((user) => (
                <div
                  key={user._id}
                  className={styles.dropdownItem}
                  onClick={() => handleUserSwitch(user.username)}
                >
                  <img
                    src={user.avatar || placeholderAvatar}
                    alt={user.username}
                    className={styles.avatarSmall}
                  />
                  <span>{user.username}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* user profile */}
        <div className={styles.profile}>
          <span className={styles.username}>
            {currentUser?.username || "Guest"}
          </span>
          <img
            src={currentUser?.avatar || placeholderAvatar}
            alt="User avatar"
            className={styles.avatar}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
