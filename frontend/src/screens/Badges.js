import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Badges.css';

function Badges({ user }) {
  const navigate = useNavigate();
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/badges/${user.id}`);
      setBadges(response.data);
    } catch (err) {
      console.error('Error fetching badges:', err);
      // Set default badges if none exist
      setBadges([
        { id: 1, name: 'First Step', description: 'Complete your first check-in', icon: '🎯', unlocked: false },
        { id: 2, name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', unlocked: false },
        { id: 3, name: 'Study Master', description: 'Complete 10 study sessions', icon: '📚', unlocked: false },
        { id: 4, name: 'Goal Getter', description: 'Complete your first goal', icon: '🏆', unlocked: false },
        { id: 5, name: 'Consistency King', description: 'Maintain a 30-day streak', icon: '👑', unlocked: false },
        { id: 6, name: 'Task Champion', description: 'Complete 50 tasks', icon: '✅', unlocked: false }
      ]);
    }
  };

  return (
    <div className="badges-screen">
      <div className="container">
        <div className="header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          <h1>Badges</h1>
          <div style={{width: '70px'}}></div>
        </div>

        <div className="card">
          <h3>Your Achievements</h3>
          <p className="badges-subtitle">Unlock badges by completing challenges</p>
        </div>

        <div className="badges-grid">
          {badges.map(badge => (
            <div key={badge.id} className={`badge-card card ${badge.unlocked ? 'unlocked' : 'locked'}`}>
              <div className="badge-icon">{badge.icon}</div>
              <h4 className="badge-name">{badge.name}</h4>
              <p className="badge-description">{badge.description}</p>
              {badge.unlocked && badge.unlocked_at && (
                <p className="badge-date">
                  Unlocked: {new Date(badge.unlocked_at).toLocaleDateString()}
                </p>
              )}
              {!badge.unlocked && (
                <div className="badge-lock">🔒</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Badges;
