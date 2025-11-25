import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ streak: 0, todayStudyTime: 0, tasksCompleted: 0 });
  const [quote] = useState("The secret of getting ahead is getting started.");
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/stats/${user.id}`);
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleCheckIn = async () => {
    try {
      await axios.post('http://localhost:5000/api/checkins', {
        user_id: user.id,
        note: 'Daily check-in'
      });
      setCheckedIn(true);
      fetchStats();
    } catch (err) {
      console.error('Error checking in:', err);
    }
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Hello, {user.name}! 👋</h1>
            <p className="date">{today}</p>
          </div>
          <button className="btn-logout" onClick={onLogout}>Logout</button>
        </div>

        <div className="streak-card card">
          <div className="streak-content">
            <div className="streak-icon">🔥</div>
            <div>
              <h2 style={{ color: "black" }}>{stats.streak}-day streak</h2>
              <p style={{ color: "black" }}>Keep it going!</p>
            </div>
          </div>
        </div>

        {!checkedIn && (
          <button className="checkin-btn btn btn-primary" onClick={handleCheckIn}>
            ✓ Mark Today as Completed
          </button>
        )}

        {checkedIn && (
          <div className="success-message">
            ✓ Great job! You've checked in today
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card card">
            <div className="stat-icon">✅</div>
            <h3>{stats.tasksCompleted}</h3>
            <p>Tasks Completed</p>
          </div>
          <div className="stat-card card">
            <div className="stat-icon">⏱️</div>
            <h3>{stats.todayStudyTime}m</h3>
            <p>Today's Study Time</p>
          </div>
        </div>

        <div className="quote-card card">
          <div className="quote-icon">💡</div>
          <p className="quote-text">"{quote}"</p>
        </div>

        <div className="nav-grid">
          <div className="nav-card card" onClick={() => navigate('/goals')}>
            <div className="nav-icon">🎯</div>
            <h3>Goals</h3>
          </div>
          <div className="nav-card card" onClick={() => navigate('/study')}>
            <div className="nav-icon">📚</div>
            <h3>Study Session</h3>
          </div>
          <div className="nav-card card" onClick={() => navigate('/checkin')}>
            <div className="nav-icon">📅</div>
            <h3>Check-In</h3>
          </div>
          <div className="nav-card card" onClick={() => navigate('/badges')}>
            <div className="nav-icon">🏆</div>
            <h3>Badges</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
