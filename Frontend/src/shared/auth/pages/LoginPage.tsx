import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { UserLevel, getLoginRedirectPath } from '../../types/auth.types';
import { authService } from '../services/authService';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const logoSrc = '/images/logo vector.png';
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar el nivel desde la URL (solo para mostrar el formulario correcto)
  // La redirección real se hará según los datos del usuario del backend
  const getLevelFromPath = (): UserLevel => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/primaria')) {
      return 'primaria';
    }
    if (path.includes('/secundaria')) {
      return 'secundaria';
    }
    return 'primaria'; // Valor por defecto
  };

  const level = getLevelFromPath();

  const handleLoginSuccess = () => {
    console.log('Login exitoso, redirigiendo...');
    
    // Obtener el usuario del localStorage (ya guardado por authService)
    const user = authService.getCurrentUser();
    
    if (user) {
      // Usar la función helper para determinar la ruta correcta
      const redirectPath = getLoginRedirectPath(user);
      navigate(redirectPath);
    } else {
      // Fallback: redirigir según la URL actual
      const redirectPath = level === 'primaria' 
        ? '/primaria/activities' 
        : '/secundaria/activities';
      navigate(redirectPath);
    }
  };

  return (
    <div className="login-page">
      {/* Background particles */}
      <div className="particles"></div>
      <div className="moss-texture"></div>
      <div className="character-reflection"></div>

      {/* Header */}
      <header className="header">
        <div className="logo">
          <img 
            src={logoSrc} 
            alt="Logo Michi Academy" 
            className="logo-image"
            onError={() => {
              console.error('Error al cargar logo:', logoSrc);
            }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="main-container">
        <div className="login-section">
          <div className="login-panel">
            {/* Left Section - Image Space */}
            <div className="login-image-section">
              <div className="image-container">
                <img 
                  src="/images/login-illustration.png" 
                  alt="Login Illustration" 
                  className="login-illustration"
                  onError={(e) => {
                    // Si la imagen no existe, mostrar un placeholder
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.nextElementSibling as HTMLElement;
                    if (placeholder) {
                      placeholder.style.display = 'flex';
                    }
                  }}
                />
                <div className="image-placeholder" style={{ display: 'none' }}>
                  <i className="fas fa-image"></i>
                  <p>Espacio para imagen</p>
                </div>
              </div>
            </div>

            {/* Right Section - Login Form */}
            <div className="login-form-section">
              <div className="login-content">
                <LoginForm level={level} onLoginSuccess={handleLoginSuccess} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
