import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setUser } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      setToken(data.token);
      setUser(data.user);
      navigate(location.state?.from?.pathname || '/');
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>Sign in</h1>
        <form onSubmit={onSubmit}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="error">{error}</div>}
          <button type="submit">Login</button>
        </form>
        <p className="muted">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
