import React from 'react';
import './VideoCompletion.css';

interface VideoCompletionProps {
  onRepeat: () => void;
  onGoToQuiz: () => void;
}

export const VideoCompletion: React.FC<VideoCompletionProps> = ({
  onRepeat,
  onGoToQuiz,
}) => {
  return (
    <div className="video-completion">
      <div className="completion-content">
        <div className="completion-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <h2>¡Has completado todos los videos!</h2>
        <p>¿Qué te gustaría hacer ahora?</p>
        <div className="completion-actions">
          <button className="btn-repeat" onClick={onRepeat}>
            <i className="fas fa-redo"></i>
            Repetir Videos
          </button>
          <button className="btn-quiz" onClick={onGoToQuiz}>
            <i className="fas fa-question-circle"></i>
            Ir al Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

