import React from 'react';
import './PointsProgress.css';

interface PointsProgressProps {
  points: number;
  maxPoints: number;
}

export const PointsProgress: React.FC<PointsProgressProps> = ({ points, maxPoints }) => {
  const percentage = maxPoints > 0 ? Math.min((points / maxPoints) * 100, 100) : 0;
  
  // Determinar emoji según el progreso
  const getEmoji = () => {
    if (percentage >= 100) return '🏆';
    if (percentage >= 75) return '⭐';
    if (percentage >= 50) return '🌟';
    if (percentage >= 25) return '✨';
    return '🌱';
  };

  return (
    <div className="points-progress">
      <div className="points-header">
        <div className="points-emoji">{getEmoji()}</div>
        <div className="points-info">
          <h3 className="points-title">Mis Puntos</h3>
          <div className="points-count">
            <span className="current-points">{points}</span>
            <span className="max-points">/ {maxPoints}</span>
          </div>
        </div>
      </div>

      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        >
          {percentage > 10 && (
            <span className="progress-percentage">{Math.round(percentage)}%</span>
          )}
        </div>
        {percentage <= 10 && percentage > 0 && (
          <span className="progress-percentage-outside">{Math.round(percentage)}%</span>
        )}
      </div>
    </div>
  );
};
