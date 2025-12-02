import React from 'react';
import { LoginForm } from '../components/LoginForm';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const logoSrc = '/images/logo vector.png';

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
                {/* Espacio para la imagen - puedes reemplazar esto con tu imagen */}
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
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
