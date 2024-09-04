import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login"; // Adjust the path as necessary
import GroupList from "./components/GroupList"; // Add this import if it's in your project

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        // Optionally, verify the token with your backend or decode it to check validity
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    // Check authentication status on initial load
    checkAuthentication();
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        <Route
          path="/dashboard"
          element={isAuthenticated ? <GroupList onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
