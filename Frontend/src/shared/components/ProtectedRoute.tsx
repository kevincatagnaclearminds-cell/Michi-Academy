import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../auth/services/authService';
import { getFrontendType } from '../types/auth.types';

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const token = authService.isAuthenticated();

  if (!token) {
    // Detectar el nivel desde la ruta actual para redirigir al login correcto
    const path = location.pathname.toLowerCase();
    let loginPath = '/primaria/login'; // Por defecto
    
    if (path.includes('/admin')) {
      loginPath = '/primaria/login'; // Admin puede usar cualquier login
    } else if (path.includes('/secundaria')) {
      loginPath = '/secundaria/login';
    } else if (path.includes('/primaria')) {
      loginPath = '/primaria/login';
    }
    
    return <Navigate to={loginPath} replace />;
  }

  // Verificar que el usuario esté en la ruta correcta según su tipo de frontend
  const user = authService.getCurrentUser();
  const currentPath = location.pathname.toLowerCase();
  
  if (user) {
    const frontendType = getFrontendType(user);
    
    // Admin puede acceder a cualquier ruta
    if (frontendType === 'admin') {
      return <>{children}</>;
    }
    
    // Para primaria y secundaria, verificar que la ruta empiece con el prefijo correcto
    if (frontendType === 'primaria') {
      // Usuario de primaria solo puede acceder a rutas /primaria/*
      if (!currentPath.startsWith('/primaria')) {
        return <Navigate to="/primaria/activities" replace />;
      }
    } else if (frontendType === 'secundaria') {
      // Usuario de secundaria solo puede acceder a rutas /secundaria/*
      if (!currentPath.startsWith('/secundaria')) {
        return <Navigate to="/secundaria/activities" replace />;
      }
    }
  }

  return <>{children}</>;
};
