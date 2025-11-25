import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './screens/Onboarding';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Dashboard from './screens/Dashboard';
import Goals from './screens/Goals';
import GoalDetails from './screens/GoalDetails';
import CheckIn from './screens/CheckIn';
import StudySession from './screens/StudySession';
import Badges from './screens/Badges';
import Notifications from './screens/Notifications';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (hasSeenOnboarding) {
      setShowOnboarding(false);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            showOnboarding ? <Onboarding onComplete={completeOnboarding} /> : 
            user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          } />
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
          } />
          <Route path="/signup" element={
            user ? <Navigate to="/dashboard" /> : <Signup onSignup={handleLogin} />
          } />
          <Route path="/dashboard" element={
            user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
          } />
          <Route path="/goals" element={
            user ? <Goals user={user} /> : <Navigate to="/login" />
          } />
          <Route path="/goals/:id" element={
            user ? <GoalDetails user={user} /> : <Navigate to="/login" />
          } />
          <Route path="/checkin" element={
            user ? <CheckIn user={user} /> : <Navigate to="/login" />
          } />
          <Route path="/study" element={
            user ? <StudySession user={user} /> : <Navigate to="/login" />
          } />
          <Route path="/badges" element={
            user ? <Badges user={user} /> : <Navigate to="/login" />
          } />
          <Route path="/notifications" element={
            user ? <Notifications user={user} /> : <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
