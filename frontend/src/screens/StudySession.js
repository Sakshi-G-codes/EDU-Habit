import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudySession.css';

function StudySession({ user }) {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSaveSession = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/sessions', {
        user_id: user.id,
        subject,
        duration: parseInt(duration),
        date: new Date().toISOString().split('T')[0]
      });
      setSubject('');
      setDuration('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving session:', err);
    }
  };

  return (
    <div className="study-session-screen">
      <div className="container">
        <div className="header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          <h1>Study Session</h1>
          <div style={{width: '70px'}}></div>
        </div>

        {success && (
          <div className="success-message">
            ✓ Study session saved successfully!
          </div>
        )}

        <div className="card">
          <div className="session-icon">📚</div>
          <h3>Log Your Study Time</h3>
          <p className="session-subtitle">Track your learning progress</p>

          <form onSubmit={handleSaveSession}>
            <div className="input-group">
              <label>Subject / Topic</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              >
                <option value="">Select subject</option>
                <option value="Programming">Programming</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Language">Language</option>
                <option value="History">History</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 30"
                min="1"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-large">
              💾 Save Session
            </button>
          </form>
        </div>

        <div className="card tips-card">
          <h4>💡 Study Tips</h4>
          <ul className="tips-list">
            <li>Take breaks every 25-30 minutes</li>
            <li>Stay hydrated and maintain good posture</li>
            <li>Review your notes after each session</li>
            <li>Set specific goals before starting</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StudySession;
