import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Goals.css';

function Goals({ user }) {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentGoalId, setCurrentGoalId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/goals/${user.id}`);
      setGoals(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError('Failed to load goals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post('http://localhost:5000/api/goals', {
        user_id: user.id,
        ...newGoal
      });
      setShowModal(false);
      setNewGoal({ title: '', category: '', target_date: '', description: '' });
      setSuccessMessage('Goal created successfully! 🎯');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchGoals();
    } catch (err) {
      console.error('Error adding goal:', err);
      setError('Failed to create goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditGoal = (goal) => {
    setEditMode(true);
    setCurrentGoalId(goal.id);
    setNewGoal({
      title: goal.title,
      category: goal.category,
      target_date: goal.target_date.split('T')[0],
      description: goal.description || ''
    });
    setShowModal(true);
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.put(`http://localhost:5000/api/goals/${currentGoalId}`, {
        ...newGoal,
        progress: goals.find(g => g.id === currentGoalId)?.progress || 0
      });
      setShowModal(false);
      setEditMode(false);
      setCurrentGoalId(null);
      setNewGoal({ title: '', category: '', target_date: '', description: '' });
      setSuccessMessage('Goal updated successfully! ✅');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchGoals();
    } catch (err) {
      console.error('Error updating goal:', err);
      setError('Failed to update goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this goal? All associated tasks will also be deleted.')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/goals/${id}`);
        setSuccessMessage('Goal deleted successfully! 🗑️');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchGoals();
      } catch (err) {
        console.error('Error deleting goal:', err);
        setError('Failed to delete goal. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentGoalId(null);
    setNewGoal({ title: '', category: '', target_date: '', description: '' });
    setError('');
  };

  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  return (
    <div className="goals-screen">
      <div className="container">
        <div className="header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          <h1>My Goals</h1>
          <div style={{width: '70px'}}></div>
        </div>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        {loading && goals.length === 0 ? (
          <div className="loading-state card">
            <div className="loading-spinner">⏳</div>
            <p>Loading your goals...</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">🎯</div>
            <h3>No goals yet</h3>
            <p>Start by creating your first learning goal</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{marginTop: '20px'}}>
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="goals-list">
            {goals.map(goal => (
              <div key={goal.id} className="goal-card card" onClick={() => navigate(`/goals/${goal.id}`)}>
                <div className="goal-header">
                  <h3>{goal.title}</h3>
                  <div className="goal-actions">
                    <button 
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditGoal(goal);
                      }}
                      title="Edit goal"
                    >
                      ✏️
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={(e) => handleDeleteGoal(goal.id, e)}
                      title="Delete goal"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="goal-category">{goal.category}</div>
                {goal.description && (
                  <p className="goal-description-preview">{goal.description.substring(0, 80)}{goal.description.length > 80 ? '...' : ''}</p>
                )}
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{
                      width: `${goal.progress || 0}%`,
                      background: '#4caf50',
                      transition: 'width 0.5s ease'
                    }}
                  ></div>
                </div>
                <div className="goal-footer">
                  <span className="progress-text">
                    {goal.progress === 100 ? '✅ Completed!' : `${goal.progress}% Complete`}
                  </span>
                  <span className="date-text">
                    📅 {getDaysRemaining(goal.target_date)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="floating-btn" onClick={() => setShowModal(true)} title="Add new goal">+</button>

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editMode ? '✏️ Edit Goal' : '➕ Add New Goal'}</h2>
              
              {error && <div className="error-message">{error}</div>}
              
              <form onSubmit={editMode ? handleUpdateGoal : handleAddGoal}>
                <div className="input-group">
                  <label>Goal Title *</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    placeholder="e.g., Master React.js"
                    required
                    maxLength="100"
                  />
                  <small>{newGoal.title.length}/100 characters</small>
                </div>
                
                <div className="input-group">
                  <label>Category *</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Programming">💻 Programming</option>
                    <option value="Mathematics">🔢 Mathematics</option>
                    <option value="Language">🗣️ Language</option>
                    <option value="Science">🔬 Science</option>
                    <option value="Business">💼 Business</option>
                    <option value="Design">🎨 Design</option>
                    <option value="Other">📚 Other</option>
                  </select>
                </div>
                
                <div className="input-group">
                  <label>Target Date *</label>
                  <input
                    type="date"
                    value={newGoal.target_date}
                    onChange={(e) => setNewGoal({...newGoal, target_date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <small>Choose a realistic deadline for your goal</small>
                </div>
                
                <div className="input-group">
                  <label>Description (Optional)</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    placeholder="Describe your goal, what you want to achieve, and why it matters to you..."
                    rows="4"
                    maxLength="500"
                  />
                  <small>{newGoal.description.length}/500 characters</small>
                </div>
                
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={closeModal}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : editMode ? 'Update Goal' : 'Create Goal'}
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
