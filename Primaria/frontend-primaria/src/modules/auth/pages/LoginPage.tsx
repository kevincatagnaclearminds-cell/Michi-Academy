import React, { useRef, useEffect, useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const logoSrc = '/images/logo vector.png';
  const initialVideoSrc = '/images/gato3d mocimiento.mp4';
  const afterLoginVideoSrc = '/images/animacion web.mp4';
  const [showSecondVideo, setShowSecondVideo] = useState(false);

  useEffect(() => {
    // Precargar y reproducir el primer video automáticamente
    if (videoRef1.current) {
      videoRef1.current.play().catch((error) => {
        console.error('Error al reproducir video inicial:', error);
      });
    }

    // Precargar y reproducir el segundo video en segundo plano (invisible)
    // Esto permite una transición perfecta sin cortes
    if (videoRef2.current) {
      videoRef2.current.load();
      videoRef2.current.addEventListener('canplaythrough', () => {
        if (videoRef2.current) {
          // Reproducir el segundo video en segundo plano para que esté sincronizado
          videoRef2.current.play().catch(() => {
            // Silenciar error, se mostrará cuando sea necesario
          });
        }
      }, { once: true });
    }
  }, []);

  const switchToSecondVideo = () => {
    // Transición instantánea y natural al segundo video
    if (videoRef1.current && videoRef2.current) {
      // Asegurar que el segundo video esté reproduciéndose
      if (videoRef2.current.paused) {
        videoRef2.current.play().catch((error) => {
          console.error('Error al reproducir segundo video:', error);
        });
      }
      
      // Activar el segundo video (crossfade rápido e imperceptible)
      setShowSecondVideo(true);
      
      // Ocultar el primer video gradualmente
      if (videoRef1.current) {
        videoRef1.current.style.transition = 'opacity 0.3s ease-out';
        videoRef1.current.style.opacity = '0';
        
        // Pausar el primer video después de la transición
        setTimeout(() => {
          if (videoRef1.current) {
            videoRef1.current.pause();
          }
        }, 350);
      }
    }
  };

  const playGif = () => {
    // Cambiar al segundo video cuando el login sea exitoso
    switchToSecondVideo();
  };

  return (
    <div className="login-page">
      {/* Background Video 1 - Video inicial */}
      <video
        ref={videoRef1}
        className="background-video background-video-1"
        src={initialVideoSrc}
        autoPlay
        loop
        muted
        playsInline
      />
      
      {/* Background Video 2 - Video después del login */}
      <video
        ref={videoRef2}
        className={`background-video background-video-2 ${showSecondVideo ? 'active' : ''}`}
        src={afterLoginVideoSrc}
        loop
        muted
        playsInline
      />
      
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
              <LoginForm onLoginSuccess={playGif} />
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
