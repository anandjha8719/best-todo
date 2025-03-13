import React, { useState, useEffect } from "react";
import styles from "./UserTagger.module.css";

const UserTagger = ({ users, selectedUsernames, onChange }) => {
  const [userSearch, setUserSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [noUsersFound, setNoUsersFound] = useState(false);

  useEffect(() => {
    if (!users) return;

    // by default, when search is empty, show selected users
    if (userSearch.trim() === "") {
      const selectedUsers = users.filter((user) =>
        selectedUsernames.includes(user.username)
      );
      setFilteredUsers(selectedUsers);
      setNoUsersFound(false);
      return;
    }

    const searchMatches = users.filter((user) =>
      user.username.toLowerCase().includes(userSearch.toLowerCase())
    );

    setFilteredUsers(searchMatches);
    setNoUsersFound(searchMatches.length === 0);
  }, [userSearch, users, selectedUsernames]);

  const handleUserSearch = (e) => {
    setUserSearch(e.target.value);
  };

  const handleUserSelection = (username) => {
    let newSelectedUsers;

    if (selectedUsernames.includes(username)) {
      newSelectedUsers = selectedUsernames.filter((u) => u !== username);
    } else {
      newSelectedUsers = [...selectedUsernames, username];
    }

    onChange(newSelectedUsers);
  };

  if (!users || users.length === 0) {
    return null;
  }

  const selectedUsersCount = selectedUsernames.length;

  return (
    <div className={styles.userTaggerContainer}>
      <label className={styles.taggerLabel}>Mention Users</label>

      <div className={styles.userSearchContainer}>
        <input
          type="text"
          placeholder="Search users to mention..."
          value={userSearch}
          onChange={handleUserSearch}
          className={styles.userSearchInput}
        />
      </div>

      <div className={styles.selectionInfo}>
        {selectedUsersCount > 0 ? (
          <span>
            {selectedUsersCount} user{selectedUsersCount !== 1 ? "s" : ""}{" "}
            mentioned
          </span>
        ) : (
          <span>Search to find users to mention</span>
        )}
      </div>

      {userSearch && noUsersFound && (
        <div className={styles.noUsersFound}>
          No users found matching "{userSearch}"
        </div>
      )}

      {filteredUsers.length > 0 && (
        <div className={styles.userGrid}>
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`${styles.userCard} ${
                selectedUsernames.includes(user.username)
                  ? styles.selectedUser
                  : ""
              }`}
              onClick={() => handleUserSelection(user.username)}
            >
              <div className={styles.userAvatar}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className={styles.userName}>{user.username}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTagger;
