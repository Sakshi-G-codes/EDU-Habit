import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CheckIn.css';

function CheckIn({ user }) {
  const navigate = useNavigate();
  const [checkins, setCheckins] = useState([]);
  const [note, setNote] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCheckins();
  }, []);

  const fetchCheckins = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/checkins/${user.id}`);
      setCheckins(response.data);
    } catch (err) {
      console.error('Error fetching check-ins:', err);
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/checkins', {
        user_id: user.id,
        note
      });
      setNote('');
      setSuccess(true);
      fetchCheckins();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error checking in:', err);
    }
  };

  const isCheckedIn = (date) => {
    return checkins.some(c => 
      new Date(c.date).toDateString() === new Date(date).toDateString()
    );
  };

  const renderCalendar = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }

    return (
      <div className="calendar-grid">
        {days.map((date, index) => (
          <div 
            key={index} 
            className={`calendar-day ${isCheckedIn(date) ? 'checked' : ''}`}
            title={date.toDateString()}
          >
            <div className="day-number">{date.getDate()}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="checkin-screen">
      <div className="container">
        <div className="header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          <h1>Daily Check-In</h1>
          <div style={{width: '70px'}}></div>
        </div>

        <div className="card">
          <h3>Your 30-Day Progress</h3>
          <p className="calendar-subtitle">Days you've checked in are highlighted</p>
          {renderCalendar()}
        </div>

        {success && (
          <div className="success-message">
            ✓ Check-in recorded successfully!
          </div>
        )}

        <div className="card">
          <h3>Mark Today as Completed</h3>
          <form onSubmit={handleCheckIn}>
            <div className="input-group">
              <label>Daily Note (Optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="How was your learning today?"
                rows="4"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-large">
              ✓ Complete Check-In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckIn;
