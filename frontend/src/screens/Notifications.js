import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

function Notifications({ user }) {
  const navigate = useNavigate();
  const [notifications] = useState([
    {
      id: 1,
      type: 'reminder',
      title: 'Daily Check-In Reminder',
      message: "Don't forget to mark today as completed!",
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'achievement',
      title: 'New Badge Unlocked!',
      message: 'You earned the "First Step" badge',
      time: '1 day ago',
      read: false
    },
    {
      id: 3,
      type: 'goal',
      title: 'Goal Deadline Approaching',
      message: 'Your goal "Master React.js" is due in 3 days',
      time: '2 days ago',
      read: true
    },
    {
      id: 4,
      type: 'streak',
      title: 'Streak Alert!',
      message: "You're on a 5-day streak! Keep it going!",
      time: '3 days ago',
      read: true
    }
  ]);

  const getIcon = (type) => {
    switch(type) {
      case 'reminder': return '🔔';
      case 'achievement': return '🏆';
      case 'goal': return '🎯';
      case 'streak': return '🔥';
      default: return '📬';
    }
  };

  return (
    <div className="notifications-screen">
      <div className="container">
        <div className="header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          <h1>Notifications</h1>
          <div style={{width: '70px'}}></div>
        </div>

        <div className="notifications-list">
          {notifications.map(notif => (
            <div key={notif.id} className={`notification-card card ${notif.read ? 'read' : 'unread'}`}>
              <div className="notif-icon">{getIcon(notif.type)}</div>
              <div className="notif-content">
                <h4 className="notif-title">{notif.title}</h4>
                <p className="notif-message">{notif.message}</p>
                <span className="notif-time">{notif.time}</span>
              </div>
              {!notif.read && <div className="unread-dot"></div>}
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="empty-state card">
            <div className="empty-icon">📭</div>
            <h3>No notifications</h3>
            <p>You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
