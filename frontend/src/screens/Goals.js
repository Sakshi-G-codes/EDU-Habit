import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Goals.css';

function Goals({ user }) {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    category: '',
    target_date: '',
    description: ''
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/goals/${user.id}`);
      setGoals(response.data);
    } catch (err) {
      console.error('Error fetching goals:', err);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/goals', {
        user_id: user.id,
        ...newGoal
      });
      setShowModal(false);
      setNewGoal({ title: '', category: '', target_date: '', description: '' });
      fetchGoals();
    } catch (err) {
      console.error('Error adding goal:', err);
    }
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await axios.delete(`http://localhost:5000/api/goals/${id}`);
        fetchGoals();
      } catch (err) {
        console.error('Error deleting goal:', err);
      }
    }
  };

  return (
    <div className="goals-screen">
      <div className="container">
        <div className="header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          <h1>My Goals</h1>
          <div style={{width: '70px'}}></div>
        </div>

        {goals.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">🎯</div>
            <h3>No goals yet</h3>
            <p>Start by creating your first learning goal</p>
          </div>
        ) : (
          <div className="goals-list">
            {goals.map(goal => (
              <div key={goal.id} className="goal-card card" onClick={() => navigate(`/goals/${goal.id}`)}>
                <div className="goal-header">
                  <h3>{goal.title}</h3>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGoal(goal.id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
                <div className="goal-category">{goal.category}</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: `${goal.progress}%`}}></div>
                </div>
                <div className="goal-footer">
                  <span>{goal.progress}% Complete</span>
                  <span>📅 {new Date(goal.target_date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="floating-btn" onClick={() => setShowModal(true)}>+</button>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Add New Goal</h2>
              <form onSubmit={handleAddGoal}>
                <div className="input-group">
                  <label>Goal Title</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    placeholder="e.g., Master React.js"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Programming">Programming</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Language">Language</option>
                    <option value="Science">Science</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Target Date</label>
                  <input
                    type="date"
                    value={newGoal.target_date}
                    onChange={(e) => setNewGoal({...newGoal, target_date: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    placeholder="Describe your goal..."
                    rows="3"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Goals;
