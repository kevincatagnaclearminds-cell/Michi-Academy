import React, { useState } from 'react';
import { Quiz } from '../../../quiz-individual/types/quiz.types';
import './QuizItemAdmin.css';

interface QuizItemAdminProps {
  quiz: Quiz;
  onEdit: () => void;
  onDelete: () => void;
}

export const QuizItemAdmin: React.FC<QuizItemAdminProps> = ({ quiz, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mostrar máximo 3 preguntas en el preview
  const previewQuestions = quiz.questions.slice(0, 3);
  const hasMoreQuestions = quiz.questions.length > 3;

  return (
    <div className="quiz-item-admin">
      <div className="quiz-main-content">
        <div className="quiz-icon">
          <i className="fas fa-question-circle"></i>
        </div>
        <div className="quiz-info">
          <div className="quiz-header">
            <h3 className="quiz-title">{quiz.title}</h3>
            <p className="quiz-questions-count">
              <i className="fas fa-list-ul"></i> {quiz.questions.length} {quiz.questions.length === 1 ? 'pregunta' : 'preguntas'}
            </p>
          </div>
          {quiz.questions.length > 0 && (
            <div className="quiz-preview">
              <div className="quiz-preview-questions">
                {previewQuestions.map((question, index) => (
                  <div key={question.id} className="quiz-preview-question">
                    <span className="question-number">{index + 1}.</span>
                    <span className="question-text">{question.question}</span>
                  </div>
                ))}
                {hasMoreQuestions && (
                  <div className="quiz-more-questions">
                    <i className="fas fa-ellipsis-h"></i>
                    <span>y {quiz.questions.length - 3} más...</span>
                  </div>
                )}
              </div>
              <button
                className="quiz-expand-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                aria-label={isExpanded ? 'Colapsar' : 'Expandir'}
              >
                <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                {isExpanded ? 'Ver menos' : 'Ver todas las preguntas'}
              </button>
            </div>
          )}
          {isExpanded && (
            <div className="quiz-all-questions">
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="quiz-full-question">
                  <div className="full-question-header">
                    <span className="full-question-number">{index + 1}.</span>
                    <span className="full-question-text">{question.question}</span>
                  </div>
                  <div className="full-question-options">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`full-question-option ${optIndex === question.correctAnswer ? 'correct' : ''}`}
                      >
                        <i className={`fas fa-${optIndex === question.correctAnswer ? 'check-circle' : 'circle'}`}></i>
                        <span>{option}</span>
                        {optIndex === question.correctAnswer && (
                          <span className="correct-badge">Correcta</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="quiz-actions">
        <button className="action-btn edit-btn" onClick={onEdit} aria-label="Editar quiz">
          <i className="fas fa-pencil-alt"></i>
        </button>
        <button className="action-btn delete-btn" onClick={onDelete} aria-label="Eliminar quiz">
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

