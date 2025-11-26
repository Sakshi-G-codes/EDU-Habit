import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './GoalDetails.css';

function GoalDetails({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [goal, setGoal] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchGoalDetails();
    fetchTasks();
  }, [id]);

  useEffect(() => {
    if (tasks.length > 0 && goal) {
      // Handle both boolean and integer (MySQL returns 1/0)
      const completedTasks = tasks.filter(t => t.completed === true || t.completed === 1).length;
      const newProgress = Math.round((completedTasks / tasks.length) * 100);
      
      console.log('Progress Update:', {
        totalTasks: tasks.length,
        completedTasks,
        newProgress,
        currentProgress: goal.progress,
        tasks: tasks.map(t => ({ id: t.id, title: t.title, completed: t.completed, type: typeof t.completed }))
      });
      
      if (newProgress !== goal.progress) {
        console.log('Updating progress from', goal.progress, 'to', newProgress);
        updateGoalProgress(newProgress);
      }
    }
  }, [tasks]);

  const fetchGoalDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/goals/${user.id}`);
      const foundGoal = response.data.find(g => g.id === parseInt(id));
      if (!foundGoal) {
        setError('Goal not found');
        setTimeout(() => navigate('/goals'), 2000);
        return;
      }
      setGoal(foundGoal);
      setError('');
    } catch (err) {
      console.error('Error fetching goal:', err);
      setError('Failed to load goal details');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks/${id}`);
      console.log('Fetched tasks:', response.data);
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) {
      setError('Task title cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', {
        goal_id: id,
        title: newTask.trim()
      });
      setTasks([...tasks, response.data]);
      setNewTask('');
      setShowTaskInput(false);
      setSuccessMessage('Task added successfully! ✅');
      setTimeout(() => setSuccessMessage(''), 2000);
      setError('');
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId, completed) => {
    try {
      // Convert to boolean and toggle (handle both 1/0 and true/false)
      const isCompleted = completed === true || completed === 1;
      const newCompletedState = !isCompleted;
      
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
        completed: newCompletedState
      });
      
      // Update local state immediately for better UX
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: newCompletedState } : task
      ));
      
      setSuccessMessage(isCompleted ? 'Task marked incomplete' : 'Task completed! 🎉');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
      fetchTasks(); // Revert on error
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
      setSuccessMessage('Task deleted successfully! 🗑️');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
    }
  };

  const updateGoalProgress = async (newProgress) => {
    if (!goal) {
      console.log('Cannot update progress: goal is null');
      return;
    }
    
    console.log('updateGoalProgress called with:', newProgress);
    console.log('Current goal:', goal);
    
    try {
      const response = await axios.put(`http://localhost:5000/api/goals/${id}`, {
        title: goal.title,
        category: goal.category,
        target_date: goal.target_date,
        description: goal.description,
        progress: newProgress
      });
      
      console.log('Progress update response:', response.data);
      
      // Update local state immediately
      setGoal(prevGoal => {
        const updated = { ...prevGoal, progress: newProgress };
        console.log('Updated goal state:', updated);
        return updated;
      });
      
      // Also refresh from server to ensure sync
      await fetchGoalDetails();
      
      // Auto-delete if 100% complete
      if (newProgress === 100) {
        setTimeout(() => {
          setSuccessMessage('🎉 Goal completed! Redirecting...');
          setTimeout(() => {
            navigate('/goals');
          }, 2000);
        }, 1000);
      }
    } catch (err) {
      console.error('Error updating progress:', err);
      console.error('Error details:', err.response?.data);
    }
  };

  const getProgressColor = (progress) => {
    return '#4caf50'; // Always green
  };

  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: '#f44336' };
    if (diffDays === 0) return { text: 'Due today', color: '#ff9800' };
    if (diffDays <= 7) return { text: `${diffDays} day${diffDays > 1 ? 's' : ''} left`, color: '#ffc107' };
    return { text: `${diffDays} days left`, color: '#4caf50' };
  };

  if (loading && !goal) {
    return (
      <div className="goal-details-screen">
        <div className="container">
          <div className="loading-state card">
            <div className="loading-spinner">⏳</div>
            <p>Loading goal details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!goal) return null;

  const daysInfo = getDaysRemaining(goal.target_date);
  // Handle both boolean and integer (MySQL returns 1/0)
  const completedCount = tasks.filter(t => t.completed === true || t.completed === 1).length;

  return (
    <div className="goal-details-screen">
      <div className="container">
        <div className="header">
          <button className="back-btn" onClick={() => navigate('/goals')}>← Back</button>
          <h1>Goal Details</h1>
          <div style={{width: '70px'}}></div>
        </div>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        <div className="card goal-info-card">
          <h2 className="goal-title">{goal.title}</h2>
          <div className="goal-category">{goal.category}</div>
          
          {goal.description && (
            <p className="goal-description">{goal.description}</p>
          )}
          
          <div className="goal-meta">
            <div className="meta-item">
              <span className="meta-label">Target Date</span>
              <span className="meta-value">📅 {new Date(goal.target_date).toLocaleDateString()}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Time Remaining</span>
              <span className="meta-value" style={{color: daysInfo.color}}>
                ⏰ {daysInfo.text}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Progress</span>
              <span className="meta-value" style={{color: '#4caf50'}}>
                {goal.progress === 100 ? '✅' : '📊'} {goal.progress || 0}%
              </span>
            </div>
          </div>

          <div className="progress-section">
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
            <div className="progress-stats">
              <span className="progress-percentage">{goal.progress || 0}% Complete</span>
              <span className="progress-tasks">{completedCount} of {tasks.length} tasks completed</span>
              {goal.progress === 100 && <span className="completion-badge">🎉 Goal Completed!</span>}
            </div>
          </div>
        </div>

        <div className="card tasks-card">
          <div className="tasks-header">
            <div>
              <h3>Tasks ({tasks.length})</h3>
              <p className="tasks-subtitle">Break down your goal into actionable steps</p>
            </div>
            {!showTaskInput && (
              <button className="btn btn-primary" onClick={() => setShowTaskInput(true)}>
                + Add Task
              </button>
            )}
          </div>

          {showTaskInput && (
            <form onSubmit={handleAddTask} className="task-input-form">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task title..."
                autoFocus
                maxLength="200"
                disabled={loading}
              />
              <div className="task-input-actions">
                <button type="submit" className="btn btn-primary" disabled={loading || !newTask.trim()}>
                  {loading ? 'Adding...' : 'Add Task'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowTaskInput(false);
                    setNewTask('');
                    setError('');
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {tasks.length === 0 ? (
            <div className="no-tasks">
              <div className="no-tasks-icon">📝</div>
              <p>No tasks yet. Add your first task to get started!</p>
            </div>
          ) : (
            <div className="tasks-list">
              {tasks.map(task => (
                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={task.completed === true || task.completed === 1}
                    onChange={() => handleToggleTask(task.id, task.completed)}
                    className="task-checkbox"
                    id={`task-${task.id}`}
                  />
                  <label htmlFor={`task-${task.id}`} className="task-label">
                    <span className={task.completed ? 'task-completed' : ''}>{task.title}</span>
                  </label>
                  <button 
                    className="task-delete-btn"
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GoalDetails;
