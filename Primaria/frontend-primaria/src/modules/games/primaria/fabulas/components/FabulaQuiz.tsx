import React, { useState } from 'react';
import { FabulaQuizQuestion } from '../types/fabula.types';
import './FabulaQuiz.css';

interface FabulaQuizProps {
  quiz: FabulaQuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export const FabulaQuiz: React.FC<FabulaQuizProps> = ({ quiz, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectAnswer = (index: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === quiz.correctAnswer;
    setIsCorrect(correct);
    setHasAnswered(true);
    onAnswer(correct);
  };

  return (
    <div className="fabula-quiz">
      <div className="fabula-quiz-header">
        <h3 className="fabula-quiz-title">🧩 ¿Qué aprendiste?</h3>
        <p className="fabula-quiz-subtitle">Responde la siguiente pregunta sobre la fábula</p>
      </div>

      <div className="fabula-quiz-question">
        <p className="question-text">{quiz.question}</p>
      </div>

      <div className="fabula-quiz-options">
        {quiz.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption = index === quiz.correctAnswer;
          let optionClass = 'fabula-quiz-option';

          if (hasAnswered) {
            if (isCorrectOption) {
              optionClass += ' correct';
            } else if (isSelected && !isCorrect) {
              optionClass += ' incorrect';
            }
          } else if (isSelected) {
            optionClass += ' selected';
          }

          return (
            <button
              key={index}
              className={optionClass}
              onClick={() => handleSelectAnswer(index)}
              disabled={hasAnswered}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{option}</span>
              {hasAnswered && isCorrectOption && (
                <span className="option-check">✓</span>
              )}
              {hasAnswered && isSelected && !isCorrect && (
                <span className="option-cross">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {!hasAnswered && (
        <button
          className="fabula-quiz-submit"
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
        >
          Enviar Respuesta
        </button>
      )}

      {hasAnswered && (
        <div className={`fabula-quiz-result ${isCorrect ? 'success' : 'error'}`}>
          <div className="result-icon">
            {isCorrect ? '🎉' : '😔'}
          </div>
          <div className="result-message">
            {isCorrect ? (
              <>
                <h4>¡Excelente!</h4>
                <p>Has entendido muy bien la lección de la fábula.</p>
              </>
            ) : (
              <>
                <h4>No te preocupes</h4>
                <p>La respuesta correcta es: <strong>{quiz.options[quiz.correctAnswer]}</strong></p>
                <p>¡Vuelve a escuchar la fábula para aprender mejor!</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};






