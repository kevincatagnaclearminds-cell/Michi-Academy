import React from 'react';
import { Fabula } from '../types/fabula.types';
import './FabulaCard.css';

interface FabulaCardProps {
  fabula: Fabula;
  onClick: () => void;
  isCompleted?: boolean;
  isViewed?: boolean;
  isAudioLibro?: boolean;
}

export const FabulaCard: React.FC<FabulaCardProps> = ({
  fabula,
  onClick,
  isCompleted = false,
  isViewed = false,
  isAudioLibro = false
}) => {
  return (
    <div 
      className={`fabula-card ${isCompleted ? 'completed' : ''} ${isViewed ? 'viewed' : ''}`}
      onClick={onClick}
    >
      <div className="fabula-card-image">
        {fabula.coverImage ? (
          <img src={fabula.coverImage} alt={fabula.title} />
        ) : (
          <div className={`fabula-card-placeholder ${isAudioLibro ? 'audio-libro' : ''}`}>
            {isAudioLibro ? (
              <svg 
                className="audio-libro-icon" 
                width="80" 
                height="80" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Libro */}
                <path 
                  d="M6 4h12v16H6V4z" 
                  fill="#e5e7eb" 
                  stroke="#9ca3af" 
                  strokeWidth="1.5"
                />
                <path 
                  d="M6 4h12v4H6V4z" 
                  fill="#d1d5db"
                />
                {/* Líneas del libro */}
                <line x1="8" y1="10" x2="16" y2="10" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="8" y1="13" x2="14" y2="13" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="8" y1="16" x2="16" y2="16" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
                {/* Ondas de sonido */}
                <path 
                  d="M18 8c0 1.5-1.5 2.5-1.5 2.5s1.5 1 1.5 2.5" 
                  stroke="#9ca3af" 
                  strokeWidth="2" 
                  fill="none" 
                  strokeLinecap="round"
                />
                <path 
                  d="M20 6c0 2-2 3.5-2 3.5s2 1.5 2 3.5" 
                  stroke="#9ca3af" 
                  strokeWidth="2" 
                  fill="none" 
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <span className="fabula-icon">📖</span>
            )}
          </div>
        )}
        {isCompleted && (
          <div className="fabula-card-badge completed-badge">
            <span>✓</span>
          </div>
        )}
        {isViewed && !isCompleted && (
          <div className="fabula-card-badge viewed-badge">
            <span>👁️</span>
          </div>
        )}
      </div>
      <div className="fabula-card-content">
        <h3 className="fabula-card-title">{fabula.title}</h3>
        <p className="fabula-card-description">{fabula.description}</p>
        <div className="fabula-card-footer">
          <span className="fabula-card-duration">
            ⏱️ {Math.floor((fabula.duration || 0) / 60)} min
          </span>
        </div>
        <div className="fabula-card-moral-section">
          <span className="fabula-card-moral-label">💡 Moraleja:</span>
          <p className="fabula-card-moral-text">{fabula.moral}</p>
        </div>
      </div>
    </div>
  );
};

