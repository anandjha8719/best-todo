import axios from "axios";
import React, { createContext, useState, useEffect, useContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/");
        const data = response.data.data;
        setUsers(data);
        // Check if a user is stored in localStorage
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const validUser = data.find(
            (u) => u.username === parsedUser.username
          );

          // Only set if the stored user still exists in the fetched users
          setCurrentUser(validUser || data[0]);
        } else {
          setCurrentUser(data[0]); // Default to first user if no stored user
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const switchUser = (username) => {
    const user = users.find((u) => u.username === username);
    if (user) {
      setCurrentUser(user);
      // storing in localStorage for quick persistence
      localStorage.setItem("currentUser", JSON.stringify(user));
    }
  };

  return (
    <UserContext.Provider value={{ users, currentUser, loading, switchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
