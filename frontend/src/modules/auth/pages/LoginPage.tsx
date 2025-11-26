import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import '../styles/login-styles.css';

/**
 * LoginPage - Página principal de login
 */
const LoginPage: React.FC = () => {
  const [showCharacterGif, setShowCharacterGif] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Aquí irá la llamada real al servicio de autenticación
      // Por ahora simulamos un login exitoso después de 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Login attempt:', credentials);
      
      // Una vez iniciada sesión exitosamente, mostrar el GIF inmediatamente
      setShowCharacterGif(true);
      
      // Aquí normalmente redirigirías a otra página
      // Por ejemplo: navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      setShowCharacterGif(false);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCharacter = () => {
    setShowCharacterGif(!showCharacterGif);
  };

  return (
    <div className="login-page">
      <div className="particles"></div>
      <div className="moss-texture"></div>
      <div className="character-reflection"></div>

      <div className="login-logo-top">
        <img 
          src="/images/logo%20vector.png" 
          alt="Michi Academy Logo" 
          className="login-logo"
        />
      </div>

      <main className="main-container">
        <div className="login-section">
          <div className="login-panel">
            <div className="login-content">
              <h1 className="sign-in-title">Iniciar Sesión</h1>
              <AuthForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
              <div className="forgot-password-container">
                <a href="#" className="forgot-password-link">Recuperar contraseña</a>
              </div>
            </div>
          </div>
        </div>

        <div className="character-section">
          <img
            src="/images/Michimovil%20vista%20frontal%20(1).png"
            alt="Character"
            className={`character-image ${showCharacterGif ? 'hidden' : ''}`}
          />
          <img
            src="/images/gato%20sin%20fondo.gif"
            alt="Character"
            className={`character-gif ${!showCharacterGif ? 'hidden' : ''}`}
            onMouseEnter={() => setShowCharacterGif(true)}
            onMouseLeave={() => setShowCharacterGif(false)}
          />
        </div>
      </main>

      <footer className="footer">
        <div className="footer-left">
          <i className="fas fa-brain footer-icon"></i>
        </div>
        <div className="footer-center">
          <a href="#" className="social-icon" aria-label="Facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="social-icon" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="social-icon" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="social-icon" aria-label="Discord">
            <i className="fab fa-discord"></i>
          </a>
        </div>
        <div className="footer-right">
          <button className="refresh-btn" onClick={toggleCharacter} aria-label="Refresh">
            <i className="fas fa-redo footer-icon"></i>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
