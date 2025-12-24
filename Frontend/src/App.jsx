import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import HomePage from './pages/HomePage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import HabitDetail from './pages/HabitDetail.jsx';
import FeaturesPage from './pages/FeaturesPage.jsx';

function RequireAuth({ children }) {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) return <Navigate to="/" replace state={{ from: location }} />;
  return children;
}

function PublicRoute({ children }) {
  const { token } = useAuth();
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/habit/:id"
          element={
            <RequireAuth>
              <HabitDetail />
            </RequireAuth>
          }
        />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
