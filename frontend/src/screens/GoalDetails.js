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

  useEffect(() => {
    fetchGoalDetails();
    fetchTasks();
  }, [id]);

  const fetchGoalDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/goals/${user.id}`);
      const foundGoal = response.data.find(g => g.id === parseInt(id));
      setGoal(foundGoal);
    } catch (err) {
      console.error('Error fetching goal:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks/${id}`);
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      await axios.post('http://localhost:5000/api/tasks', {
        goal_id: id,
        title: newTask
      });
      setNewTask('');
      setShowTaskInput(false);
      fetchTasks();
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleToggleTask = async (taskId, completed) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
        completed: !completed
      });
      fetchTasks();
      updateGoalProgress();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const updateGoalProgress = async () => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
    
    try {
      await axios.put(`http://localhost:5000/api/goals/${id}`, {
        ...goal,
        progress
      });
      fetchGoalDetails();
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  if (!goal) return <div>Loading...</div>;

  return (
    <div className="goal-details-screen">
      <div className="container">
        <div className="header">
          <button className="back-btn" onClick={() => navigate('/goals')}>← Back</button>
          <h1>Goal Details</h1>
          <div style={{width: '70px'}}></div>
        </div>

        <div className="card">
          <h2 className="goal-title">{goal.title}</h2>
          <div className="goal-category">{goal.category}</div>
          <p className="goal-description">{goal.description}</p>
          
          <div className="goal-meta">
            <div className="meta-item">
              <span className="meta-label">Target Date</span>
              <span className="meta-value">📅 {new Date(goal.target_date).toLocaleDateString()}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Progress</span>
              <span className="meta-value">{goal.progress}%</span>
            </div>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${goal.progress}%`}}></div>
          </div>
        </div>

        <div className="card">
          <div className="tasks-header">
            <h3>Tasks</h3>
            <button className="btn btn-primary" onClick={() => setShowTaskInput(true)}>
              + Add Task
            </button>
          </div>

          {showTaskInput && (
            <form onSubmit={handleAddTask} className="task-input-form">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task title..."
                autoFocus
              />
              <div className="task-input-actions">
                <button type="submit" className="btn btn-primary">Add</button>
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setShowTaskInput(false);
                  setNewTask('');
                }}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet. Add your first task to get started!</p>
          ) : (
            <div className="tasks-list">
              {tasks.map(task => (
                <div key={task.id} className="task-item">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id, task.completed)}
                    className="task-checkbox"
                  />
                  <span className={task.completed ? 'task-completed' : ''}>{task.title}</span>
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
