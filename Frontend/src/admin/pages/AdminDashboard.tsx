import React from 'react';
import { authService } from '../../shared/auth/services/authService';

export const AdminDashboard: React.FC = () => {
  const user = authService.getCurrentUser();

  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center',
      minHeight: '100vh',
      backgroundColor: '#f4f4f4',
      color: '#040201'
    }}>
      <h1>Panel de Administración</h1>
      <p>Bienvenido, {user?.email || 'Administrador'}</p>
      <p style={{ marginTop: '20px', color: '#666' }}>
        El contenido del panel de administración estará disponible próximamente.
      </p>
    </div>
  );
};
