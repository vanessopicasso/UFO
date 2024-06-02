import React, { createContext, useState, useEffect } from "react";

// Create the context
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Load user from local storage if available
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log("User loaded from local storage:", user);
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  const login = async (userData) => {
    try {
      console.log("Logging in with:", userData);
      const response = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        setLoggedInUser(data.user);
        console.log("User logged in successfully:", data.user);
      } else {
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out user:", loggedInUser);
      // Perform logout logic
      localStorage.removeItem("loggedInUser");
      setLoggedInUser(null);
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  const signUp = async (userData) => {
    try {
      console.log("Signing up:", userData);
      const response = await fetch("http://localhost:8000/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        setLoggedInUser(data.user);
        console.log("User signed up successfully:", data.user);
      } else {
        console.error("Sign up failed:", data.message);
      }
    } catch (error) {
      console.error("Error during sign up:", error.message);
    }
  };

  return (
    <UserContext.Provider value={{ loggedInUser, login, logout, signUp }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;