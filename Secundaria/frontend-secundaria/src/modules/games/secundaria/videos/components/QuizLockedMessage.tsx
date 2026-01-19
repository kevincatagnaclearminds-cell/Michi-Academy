import React from 'react';
import './QuizLockedMessage.css';

interface QuizLockedMessageProps {
  watchedCount: number;
  totalVideos: number;
  categoryName: string;
  onBack: () => void;
}

export const QuizLockedMessage: React.FC<QuizLockedMessageProps> = ({
  watchedCount,
  totalVideos,
  categoryName,
  onBack,
}) => {
  const remainingVideos = totalVideos - watchedCount;

  return (
    <div className="quiz-locked-container">
      <div className="quiz-locked-content">
        <div className="lock-icon-wrapper">
          <i className="fas fa-lock lock-icon"></i>
        </div>
        <h2>¡Completa los videos primero!</h2>
        <p className="lock-message">
          Para resolver el quiz de <strong>{categoryName}</strong>, primero debes ver todos los videos de esta categoría.
        </p>
        <div className="progress-info">
          <div className="progress-circle">
            <div className="progress-value">{watchedCount}</div>
            <div className="progress-total">/ {totalVideos}</div>
          </div>
          <p className="progress-text">
            {remainingVideos === 1 
              ? 'Te falta 1 video por ver' 
              : `Te faltan ${remainingVideos} videos por ver`}
          </p>
        </div>
        <div className="lock-actions">
          <button className="btn-back-to-videos" onClick={onBack}>
            <i className="fas fa-arrow-left"></i>
            Volver a Videos
          </button>
        </div>
      </div>
    </div>
  );
};

