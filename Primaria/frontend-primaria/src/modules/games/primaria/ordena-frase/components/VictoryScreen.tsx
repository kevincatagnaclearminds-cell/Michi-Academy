import React, { useState, useEffect } from 'react';
import './VictoryScreen.css';

interface VictoryScreenProps {
  points: number;
  onNext: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({ points, onNext }) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown === 0) {
      onNext();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onNext]);

  return (
    <div className="victory-screen">
      <div className="victory-content">
        <div className="victory-icon">🎉</div>
        <h2 className="victory-title">¡Muy bien!</h2>
        <p className="victory-message">Ganaste <span className="victory-points">{points} puntos</span></p>
        
        <div className="countdown-container">
          <p className="countdown-text">Prepárate para la siguiente palabra</p>
          <div className="countdown-number">{countdown}</div>
        </div>
      </div>
    </div>
  );
};







