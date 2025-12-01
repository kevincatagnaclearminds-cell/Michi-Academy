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
        {/* Left Section - Login Form */}
        <div className="login-section">
          <div className="login-panel">
            <div className="login-content">
              <LoginForm />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-left">
          <i className="fas fa-brain footer-icon"></i>
        </div>
        <div className="footer-center">
          <a href="#" className="social-icon">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-discord"></i>
          </a>
        </div>
        <div className="footer-right">
        </div>
      </footer>
    </div>
  );
};
