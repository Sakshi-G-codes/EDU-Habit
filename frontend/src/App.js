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
import Profile from './screens/Profile';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage on mount
    const savedUser = localStorage.getItem('eduhabit_user');
    const hasSeenOnboarding = localStorage.getItem('eduhabit_onboarding');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('eduhabit_user');
      }
    }
    
    if (hasSeenOnboarding === 'true') {
      setShowOnboarding(false);
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('eduhabit_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('eduhabit_user');
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('eduhabit_onboarding', 'true');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>📚</div>
          <h2>Loading EDU-HABIT...</h2>
        </div>
      </div>
    );
  }

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
          <Route path="/profile" element={
            user ? <Profile user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
