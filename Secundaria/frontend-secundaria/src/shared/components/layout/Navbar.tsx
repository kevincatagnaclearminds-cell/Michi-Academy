import React from "react";
import { useNavigate } from "react-router-dom";

export const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/secundaria/login');
    }

    return <nav style={{
        padding: '1rem',
        display: 'flex',
        justifyContent: 'flex-end',
        background: 'rgba(255, 255, 255, 0.8)'
    }}>
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
}