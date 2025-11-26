import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

function Profile({ user, onLogout }) {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'DELETE') {
      alert('Please type DELETE to confirm');
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/users/${user.id}`);
      localStorage.clear();
      alert('Account deleted successfully');
      navigate('/login');
    } catch (err) {
      console.error('Error deleting account:', err);
      alert('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-screen">
      <div className="container">
        <div className="header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          <h1>Profile</h1>
          <div style={{width: '70px'}}></div>
        </div>

        <div className="card profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Member Since</span>
              <span className="stat-value">
                {new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="card actions-card">
          <h3>Account Actions</h3>
          
          <button className="action-btn logout-btn" onClick={onLogout}>
            <span className="action-icon">🚪</span>
            <div className="action-content">
              <span className="action-title">Logout</span>
              <span className="action-desc">Sign out of your account</span>
            </div>
          </button>

          <button 
            className="action-btn delete-btn" 
            onClick={() => setShowDeleteConfirm(true)}
          >
            <span className="action-icon">⚠️</span>
            <div className="action-content">
              <span className="action-title">Delete Account</span>
              <span className="action-desc">Permanently delete your account and all data</span>
            </div>
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>⚠️ Delete Account</h2>
              <p className="warning-text">
                This action cannot be undone. All your goals, tasks, check-ins, 
                and progress will be permanently deleted.
              </p>
              
              <div className="input-group">
                <label>Type <strong>DELETE</strong> to confirm:</label>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder="Type DELETE"
                  autoFocus
                />
              </div>

              <div className="modal-actions">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteInput('');
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={handleDeleteAccount}
                  disabled={loading || deleteInput !== 'DELETE'}
                >
                  {loading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
