import React from 'react';
import './GameStats.css';

interface GameStatsProps {
  score: number;
  lives: number;
  currentCard: number;
  totalCards: number;
}

const GameStats: React.FC<GameStatsProps> = ({ score, lives, currentCard, totalCards }) => {
  return (
    <div className="game-stats-container">
      <div className="stats-card score-card">
        <div className="stats-icon">⭐</div>
        <div className="stats-content">
          <div className="stats-label">Puntaje</div>
          <div className="stats-value">{score}</div>
        </div>
      </div>
      
      <div className="stats-card lives-card">
        <div className="stats-icon">💖</div>
        <div className="stats-content">
          <div className="stats-label">Vidas</div>
          <div className="stats-value hearts">
            {Array.from({ length: 3 }, (_, i) => (
              <span 
                key={i} 
                className={`heart ${i < lives ? 'active' : 'inactive'}`}
              >
                ❤️
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="stats-card progress-card">
        <div className="stats-icon">📋</div>
        <div className="stats-content">
          <div className="stats-label">Caso</div>
          <div className="stats-value">
            {currentCard} / {totalCards}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;















