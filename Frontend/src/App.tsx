import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Login compartido
import { LoginPage } from '@shared/auth/pages/LoginPage';

// Componentes de Primaria
import { ActivitiesPage as PrimariaActivitiesPage } from '@primaria/modules/activities/pages/ActivitiesPage';
import { Navbar as PrimariaNavbar } from '@primaria/shared/components/layout/Navbar';
import { ProtectedRoute } from '@shared/components/ProtectedRoute';

// Componentes de Secundaria
import { ActivitiesPage as SecundariaActivitiesPage } from '@secundaria/modules/activities/pages/ActivitiesPage';
import { Navbar as SecundariaNavbar } from '@secundaria/shared/components/layout/Navbar';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {/* Ruta raíz - redirigir a primaria por defecto */}
          <Route path="/" element={<Navigate to="/primaria/login" replace />} />

          {/* Rutas de Primaria */}
          <Route path="/primaria/login" element={<LoginPage />} />
          <Route
            path="/primaria/activities"
            element={
              <ProtectedRoute>
                <PrimariaNavbar />
                <PrimariaActivitiesPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Secundaria */}
          <Route path="/secundaria/login" element={<LoginPage />} />
          <Route
            path="/secundaria/activities"
            element={
              <ProtectedRoute>
                <SecundariaNavbar />
                <SecundariaActivitiesPage />
              </ProtectedRoute>
            }
          />

          {/* Ruta catch-all - redirigir a primaria/login */}
          <Route path="*" element={<Navigate to="/primaria/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
