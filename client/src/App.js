import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserProvider from "./UserContext"; // Ensure this import points to UserContext.js
import Layout from "./Layout";
import NavBar from "./NavBar";

function App() {
  return (
    <div style={componentStyle()}>
      <UserProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Layout />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

function componentStyle() {
  return {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    backgroundColor: "#000000",
  };
}

export default App;