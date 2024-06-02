import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  const login = async (userData) => {
    try {
      const response = await axios.post("http://localhost:8000/user/login", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        setLoggedInUser(response.data.user);
        localStorage.setItem("loggedInUser", JSON.stringify(response.data.user));
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Failed to login.");
    }
  };

  const signUp = async (userData) => {
    try {
      const response = await axios.post("http://localhost:8000/user/create", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        setLoggedInUser(response.data.user);
        localStorage.setItem("loggedInUser", JSON.stringify(response.data.user));
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Failed to sign up.");
    }
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
  };

  return (
    <UserContext.Provider value={{ loggedInUser, login, signUp, logout, error }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;