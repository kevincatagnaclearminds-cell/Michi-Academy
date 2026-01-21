import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../../shared/auth/services/authService";

export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const userGrade = authService.getUserGrade();
    const accountType = authService.getAccountType();

    const handleLogout = async () => {
        await authService.logout();
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
                <h3 style={{ margin: 0, color: '#333' }}>Primaria</h3>
                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>
                            {user.email}
                        </span>
                        {userGrade && (
                            <span style={{
                                padding: '4px 8px',
                                backgroundColor: '#e3f2fd',
                                color: '#1976d2',
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                                fontWeight: 'bold'
                            }}>
                                Grado {userGrade}
                            </span>
                        )}
                        {accountType && accountType !== 'student' && (
                            <span style={{
                                padding: '4px 8px',
                                backgroundColor: '#fff3e0',
                                color: '#f57c00',
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                                fontWeight: 'bold'
                            }}>
                                {accountType === 'teacher' ? 'Profesor' : accountType}
                            </span>
                        )}
                    </div>
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
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e53935';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ff4d4d';
                }}
            >
                Logout
            </button>
        </nav>
    );
}