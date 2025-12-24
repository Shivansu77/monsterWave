import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Login from './Login.jsx';
import Register from './Register.jsx';

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(null);

  if (showAuth === 'login') {
    return (
      <div className="home-page">
        <div className="auth-overlay">
          <button className="close-btn" onClick={() => setShowAuth(null)}>×</button>
          <Login />
        </div>
      </div>
    );
  }

  if (showAuth === 'register') {
    return (
      <div className="home-page">
        <div className="auth-overlay">
          <button className="close-btn" onClick={() => setShowAuth(null)}>×</button>
          <Register />
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <div className="pixel-logo">
            <div className="logo-icon">M</div>
            <h1>MONSTERWAVE</h1>
          </div>
          <p className="tagline">BUILD BETTER HABITS, ONE PIXEL AT A TIME</p>
        </div>

        <div className="home-content">
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>TRACK DAILY</h3>
              <p>Mark habits complete with simple clicks</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔥</div>
              <h3>BUILD STREAKS</h3>
              <p>See your progress grow day by day</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>MOBILE READY</h3>
              <p>Track habits anywhere, anytime</p>
            </div>
          </div>

          <div className="home-actions">
            <button onClick={() => setShowAuth('register')} className="pixel-btn primary">START TRACKING</button>
            <button onClick={() => setShowAuth('login')} className="pixel-btn secondary">LOGIN</button>
          </div>
        </div>

        <div className="home-footer">
          <p>© 2025 MONSTERWAVE - PIXEL PERFECT HABITS</p>
        </div>
      </div>
    </div>
  );
}