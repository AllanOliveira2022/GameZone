// src/routes/ProtectedRouteAdmin.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

// Verifica se o usuário é ADMIN
const ProtectedRouteAdmin = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

// Verifica se o usuário está LOGADO (qualquer papel)
const ProtectedRouteUser = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export { ProtectedRouteAdmin, ProtectedRouteUser };
