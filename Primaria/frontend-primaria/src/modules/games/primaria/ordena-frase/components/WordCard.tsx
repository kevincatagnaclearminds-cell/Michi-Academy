import React from 'react';
import './WordCard.css';

interface WordCardProps {
  word: string;
  isSelected: boolean;
  isDragging?: boolean;
  isCorrect?: boolean;
  onClick: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

export const WordCard: React.FC<WordCardProps> = ({ 
  word, 
  isSelected, 
  isDragging = false,
  isCorrect = false,
  onClick,
  onDragStart,
  onDragEnd
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(e);
    }
  };

  const handleDragEnd = () => {
    if (onDragEnd) {
      onDragEnd();
    }
  };

  return (
    <button
      className={`word-card ${isSelected ? 'selected' : 'available'} ${isDragging ? 'dragging' : ''} ${isCorrect ? 'correct' : ''}`}
      onClick={onClick}
      draggable={onDragStart !== undefined}
      onDragStart={onDragStart ? handleDragStart : undefined}
      onDragEnd={handleDragEnd}
    >
      {word}
    </button>
  );
};

