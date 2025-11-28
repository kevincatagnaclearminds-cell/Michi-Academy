import React, { useRef, useEffect, useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const characterImageRef = useRef<HTMLImageElement>(null);
  const characterGifRef = useRef<HTMLImageElement>(null);
  const [showGif, setShowGif] = useState(false);

  const gifSrc = '/images/gato sin fondo.gif';
  const staticImageSrc = '/images/Michimovil vista frontal (1).png';

  useEffect(() => {
    // Load GIF on component mount
    if (characterGifRef.current) {
      const gifElement = characterGifRef.current;
      const gifSource = gifElement.getAttribute('data-gif-src') || gifSrc;
      
      // Preload the GIF
      const img = new Image();
      img.src = gifSource;
      img.onload = () => {
        if (gifElement) {
          gifElement.src = gifSource;
        }
      };
    }

    // Toggle between static image and GIF on hover/interaction
    const handleCharacterInteraction = () => {
      setShowGif(true);
      if (characterImageRef.current) {
        characterImageRef.current.style.opacity = '0';
      }
      if (characterGifRef.current) {
        characterGifRef.current.classList.add('active');
      }
    };

    const handleCharacterLeave = () => {
      setShowGif(false);
      if (characterImageRef.current) {
        characterImageRef.current.style.opacity = '1';
      }
      if (characterGifRef.current) {
        characterGifRef.current.classList.remove('active');
      }
    };

    const characterSection = document.querySelector('.character-section');
    if (characterSection) {
      characterSection.addEventListener('mouseenter', handleCharacterInteraction);
      characterSection.addEventListener('mouseleave', handleCharacterLeave);
    }

    return () => {
      if (characterSection) {
        characterSection.removeEventListener('mouseenter', handleCharacterInteraction);
        characterSection.removeEventListener('mouseleave', handleCharacterLeave);
      }
    };
  }, []);

  const handleRefresh = () => {
    // Reload the page or refresh character animation
    if (characterImageRef.current && characterGifRef.current) {
      characterImageRef.current.style.opacity = '1';
      characterGifRef.current.classList.remove('active');
      setShowGif(false);
      
      // Force reload of GIF
      const gifElement = characterGifRef.current;
      const currentSrc = gifElement.src;
      gifElement.src = '';
      setTimeout(() => {
        gifElement.src = currentSrc || gifSrc;
      }, 100);
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
          <div className="controller-icon">
            <div className="d-pad">
              <div className="d-pad-up"></div>
              <div className="d-pad-down"></div>
              <div className="d-pad-left"></div>
              <div className="d-pad-right"></div>
            </div>
            <div className="buttons">
              <div className="button button-a"></div>
              <div className="button button-b"></div>
            </div>
          </div>
          <span className="logo-text">game boy</span>
        </div>
        <nav className="nav">
          <a href="#" className="nav-link">HOME</a>
          <button className="btn-join">JOIN</button>
          <a href="#" className="nav-link">COMMUNITY</a>
        </nav>
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

        {/* Right Section - Character Image/GIF */}
        <div className="character-section">
          <img 
            ref={characterImageRef}
            src={staticImageSrc} 
            alt="Character" 
            className="character-image" 
          />
          <img 
            ref={characterGifRef}
            src="" 
            alt="Character" 
            className="character-gif" 
            data-gif-src={gifSrc}
          />
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
          <button className="refresh-btn" onClick={handleRefresh}>
            <i className="fas fa-redo footer-icon"></i>
          </button>
        </div>
      </footer>
    </div>
  );
};
