import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../shared/auth/services/authService";

export const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/primaria/login');
  }

  return (
    <nav style={{
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'rgba(255, 255, 255, 0.9)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h3 style={{ margin: 0, color: '#333' }}>Panel de Administración</h3>
        {user && (
          <span style={{ color: '#666', fontSize: '0.9rem' }}>
            {user.email}
          </span>
        )}
      </div>
      <button
        onClick={handleLogout}
        style={{
          padding: '8px 16px',
          backgroundColor: '#ff4d4d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Logout
      </button>
    </nav>
  );
};
