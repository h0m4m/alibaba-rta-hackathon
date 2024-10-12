import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SignupPage from './pages/SignupPage';
import 'leaflet/dist/leaflet.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ firstName: '', lastName: '' });

  useEffect(() => {
    const savedIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const savedUser = JSON.parse(localStorage.getItem('user'));

    if (savedIsAuthenticated && savedUser) {
      setIsAuthenticated(true);
      setUser(savedUser);
    }
  }, []);

  const handleLogin = (firstName, lastName) => {
    setIsAuthenticated(true);
    setUser({ firstName, lastName });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser({ firstName: '', lastName: '' });
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <SignupPage />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DashboardPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
