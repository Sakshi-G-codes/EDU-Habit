import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';

function Onboarding({ onComplete }) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    onComplete();
    navigate('/login');
  };

  return (
    <div className="onboarding">
      <div className="onboarding-content">
        <div className="illustration">
          <div className="study-icon">📚</div>
          <div className="sparkles">✨</div>
        </div>
        <h1 className="onboarding-title">Build your learning habit</h1>
        <p className="onboarding-subtitle">Track goals, stay consistent, improve daily</p>
        <button className="btn btn-primary btn-large" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Onboarding;
