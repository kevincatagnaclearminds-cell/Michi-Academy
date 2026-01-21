import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../auth/services/authService';

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const token = authService.isAuthenticated();

  if (!token) {
    // Detectar el nivel desde la ruta actual
    const path = location.pathname.toLowerCase();
    const loginPath = path.includes('/primaria') 
      ? '/primaria/login' 
      : '/secundaria/login';
    
    return <Navigate to={loginPath} replace />;
  }

  return <>{children}</>;
};
