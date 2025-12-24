import React, { useState, useEffect } from 'react';
import { Waves, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Topbar() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="topbar">
      <div className="brand" aria-label="MonsterWave logo">
        <div className="brand-icon" aria-hidden="true">
          M
        </div>
        <span className="title">MonsterWave</span>
      </div>
      <div className="top-actions">
        <div className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
          <div className="toggle-track">
            <div className="toggle-thumb" />
          </div>
        </div>
        <span className="user-pill">{user?.name}</span>
        <button className="ghost" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
