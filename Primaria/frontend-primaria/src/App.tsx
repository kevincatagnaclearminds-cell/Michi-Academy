import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { LoginPage } from './modules/auth/pages/LoginPage';
import { ActivitiesPage } from './modules/activities/pages/ActivitiesPage';

import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { Navbar } from './shared/components/layout/Navbar';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path='/' element={<Navigate to="/primaria/login" replace />} />
          <Route path='/primaria/login' element={<LoginPage />} />
          <Route 
            path='/primaria/activities' 
            element={
              <ProtectedRoute>
                <Navbar />
                <ActivitiesPage />
              </ProtectedRoute>
            } 
          />
          <Route path='*' element={<Navigate to="/primaria/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>

  );
};

export default App;


