import React from 'react';
import { PhraseGame } from '../types/phrase.types';
import './PhraseCard.css';

interface PhraseCardProps {
  phrase: PhraseGame;
  onClick: () => void;
  isCompleted?: boolean;
}

export const PhraseCard: React.FC<PhraseCardProps> = ({ 
  phrase, 
  onClick, 
  isCompleted = false 
}) => {
  return (
    <div 
      className={`phrase-card ${isCompleted ? 'completed' : ''}`}
      onClick={onClick}
    >
      <div className="phrase-card-header">
        <h3 className="phrase-card-title">{phrase.title}</h3>
        {isCompleted && (
          <span className="phrase-card-badge">✓</span>
        )}
      </div>
      <p className="phrase-card-category">{phrase.category}</p>
      <div className="phrase-card-difficulty">
        <span className={`difficulty-badge ${phrase.difficulty}`}>
          {phrase.difficulty === 'facil' ? 'Fácil' : 
           phrase.difficulty === 'medio' ? 'Medio' : 'Difícil'}
        </span>
      </div>
    </div>
  );
};




