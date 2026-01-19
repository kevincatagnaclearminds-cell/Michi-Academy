import React from 'react';
import './ExitQuizModal.css';

interface ExitQuizModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ExitQuizModal: React.FC<ExitQuizModalProps> = ({ 
  isOpen, 
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  return (
    <div className="exit-quiz-modal-overlay" onClick={onCancel}>
      <div className="exit-quiz-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">⚠️</div>
        <h3 className="modal-title">¿Salir del Quiz?</h3>
        <p className="modal-message">
          Si sales ahora, perderás todo el progreso que has hecho en el quiz.
        </p>
        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onCancel}>
            Continuar en el Quiz
          </button>
          <button className="modal-btn confirm" onClick={onConfirm}>
            Salir y Perder Progreso
          </button>
        </div>
      </div>
    </div>
  );
};

