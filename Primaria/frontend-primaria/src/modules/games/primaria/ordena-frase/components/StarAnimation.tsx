import React, { useEffect, useState } from 'react';
import './StarAnimation.css';

interface StarAnimationProps {
  show: boolean;
  onComplete?: () => void;
}

export const StarAnimation: React.FC<StarAnimationProps> = ({ show, onComplete }) => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (show) {
      // Crear 10 estrellas en posiciones aleatorias
      const newStars = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }));
      setStars(newStars);

      // Limpiar después de la animación
      const timer = setTimeout(() => {
        setStars([]);
        if (onComplete) onComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show || stars.length === 0) return null;

  return (
    <div className="star-animation-container">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.id * 0.1}s`
          }}
        >
          ⭐
        </div>
      ))}
    </div>
  );
};



