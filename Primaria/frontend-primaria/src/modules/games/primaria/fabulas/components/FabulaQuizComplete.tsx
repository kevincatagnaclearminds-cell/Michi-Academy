import React, { useState } from 'react';
import { FabulaQuizQuestion } from '../types/fabula.types';
import './FabulaQuizComplete.css';

interface FabulaQuizCompleteProps {
  quiz: FabulaQuizQuestion[];
  onAnswer: (questionIndex: number, isCorrect: boolean) => void;
  onComplete: (totalPoints: number) => void;
  onExit?: () => void;
}

export const FabulaQuizComplete: React.FC<FabulaQuizCompleteProps> = ({ 
  quiz, 
  onAnswer, 
  onComplete, 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(quiz.length).fill(-1));
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [questionResults, setQuestionResults] = useState<boolean[]>(new Array(quiz.length).fill(false));
  const [points, setPoints] = useState(0);

  const currentQuestion = quiz[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex];
  const isAnswered = answeredQuestions.has(currentQuestionIndex);
  const isCorrect = isAnswered ? questionResults[currentQuestionIndex] : false;

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = index;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (selectedAnswer === -1) return;

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    const newResults = [...questionResults];
    newResults[currentQuestionIndex] = correct;
    setQuestionResults(newResults);
    
    setAnsweredQuestions(new Set([...answeredQuestions, currentQuestionIndex]));
    
    // Dar puntos si es correcta (10 puntos por respuesta correcta)
    if (correct) {
      const newPoints = points + 10;
      setPoints(newPoints);
      onAnswer(currentQuestionIndex, correct);
    } else {
      onAnswer(currentQuestionIndex, correct);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completado
      onComplete(points);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getProgress = () => {
    return ((currentQuestionIndex + 1) / quiz.length) * 100;
  };

  return (
    <div className="fabula-quiz-complete">
      <div className="quiz-header">
        <div className="quiz-progress-bar">
          <div 
            className="quiz-progress-fill" 
            style={{ width: `${getProgress()}%` }}
          ></div>
        </div>
        <div className="quiz-header-info">
          <span className="quiz-question-counter">
            Pregunta {currentQuestionIndex + 1} de {quiz.length}
          </span>
          <span className="quiz-points">Puntos: {points}</span>
        </div>
      </div>

      <div className="quiz-content">
        <div className="quiz-question">
          <h3 className="question-text">{currentQuestion.question}</h3>
        </div>

        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === currentQuestion.correctAnswer;
            let optionClass = 'quiz-option';

            if (isAnswered) {
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
                disabled={isAnswered}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
                {isAnswered && isCorrectOption && (
                  <span className="option-check">✓</span>
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <span className="option-cross">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {!isAnswered && (
          <button
            className="quiz-submit-btn"
            onClick={handleSubmit}
            disabled={selectedAnswer === -1}
          >
            Enviar Respuesta
          </button>
        )}

        {isAnswered && (
          <div className={`quiz-result ${isCorrect ? 'success' : 'error'}`}>
            <div className="result-icon">
              {isCorrect ? '🎉' : '😔'}
            </div>
            <div className="result-message">
              {isCorrect ? (
                <>
                  <h4>¡Correcto!</h4>
                  <p>¡Ganaste 10 puntos!</p>
                </>
              ) : (
                <>
                  <h4>Incorrecto</h4>
                  <p>La respuesta correcta es: <strong>{currentQuestion.options[currentQuestion.correctAnswer]}</strong></p>
                </>
              )}
            </div>
          </div>
        )}

        {isAnswered && (
          <div className="quiz-navigation">
            {currentQuestionIndex > 0 && (
              <button className="quiz-nav-btn prev" onClick={handlePrevious}>
                ← Anterior
              </button>
            )}
            <button className="quiz-nav-btn next" onClick={handleNext}>
              {currentQuestionIndex < quiz.length - 1 ? 'Siguiente →' : 'Finalizar Quiz'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

