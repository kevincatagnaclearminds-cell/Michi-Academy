import React from 'react';
import './PointsDisplay.css';

interface PointsDisplayProps {
  points: number;
}

export const PointsDisplay: React.FC<PointsDisplayProps> = ({ points }) => {
  return (
    <div className="points-display">
      <span className="points-icon">⭐</span>
      <span className="points-label">Puntos:</span>
      <span className="points-value">{points}</span>
    </div>
  );
};

