import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password });
      setToken(data.token);
      setUser(data.user);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>Create account</h1>
        <form onSubmit={onSubmit}>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="error">{error}</div>}
          <button type="submit">Register</button>
        </form>
        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
