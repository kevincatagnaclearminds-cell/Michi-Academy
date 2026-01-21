import React, { useState } from 'react';
import { Quiz, Question, QuizAnswer, QuizResult } from '../../../quiz-individual/types/quiz.types';
import './CategoryQuiz.css';

interface CategoryQuizProps {
  quiz: Quiz;
  onBack: () => void;
}

export const CategoryQuiz: React.FC<CategoryQuizProps> = ({ quiz, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id);
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const allQuestionsAnswered = answers.length === quiz.questions.length;

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId ? { ...a, selectedAnswer: answerIndex } : a
        );
      }
      return [...prev, { questionId, selectedAnswer: answerIndex }];
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!allQuestionsAnswered) {
      alert('Por favor responde todas las preguntas antes de enviar el quiz.');
      return;
    }

    let score = 0;
    quiz.questions.forEach((question) => {
      const answer = answers.find((a) => a.questionId === question.id);
      if (answer && answer.selectedAnswer === question.correctAnswer) {
        score++;
      }
    });

    const percentage = (score / quiz.questions.length) * 100;
    setResult({
      score,
      totalQuestions: quiz.questions.length,
      percentage,
      answers,
    });
    setIsSubmitted(true);
  };

  if (isSubmitted && result) {
    return (
      <div className="category-quiz">
        <div className="quiz-result-container">
          <div className="quiz-result-header">
            <i className="fas fa-trophy result-icon"></i>
            <h2>¡Quiz Completado!</h2>
          </div>
          <div className="quiz-result-content">
            <div className="score-circle">
              <div className="score-value">{result.score}</div>
              <div className="score-total">/ {result.totalQuestions}</div>
            </div>
            <div className="percentage-display">
              <span className="percentage-value">{result.percentage.toFixed(0)}%</span>
              <span className="percentage-label">de aciertos</span>
            </div>
            <div className="result-message">
              {result.percentage >= 80 ? (
                <p className="success-message">¡Excelente trabajo! 🎉</p>
              ) : result.percentage >= 60 ? (
                <p className="good-message">¡Buen trabajo! Sigue practicando 💪</p>
              ) : (
                <p className="encourage-message">Sigue practicando, puedes mejorar 📚</p>
              )}
            </div>
            <div className="result-actions">
              <button className="btn-back" onClick={onBack}>
                <i className="fas fa-arrow-left"></i>
                Volver a Videos
              </button>
              <button
                className="btn-retry"
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setAnswers([]);
                  setResult(null);
                  setIsSubmitted(false);
                }}
              >
                <i className="fas fa-redo"></i>
                Intentar de Nuevo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-quiz">
      <div className="quiz-header">
        <button className="btn-back-header" onClick={onBack}>
          <i className="fas fa-arrow-left"></i>
          Volver
        </button>
        <div className="quiz-title-section">
          <h2>{quiz.title}</h2>
          <div className="quiz-progress">
            <span className="progress-text">
              Pregunta {currentQuestionIndex + 1} de {quiz.questions.length}
            </span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="quiz-content">
        <div className="question-card">
          <h3 className="question-text">{currentQuestion.question}</h3>
          <div className="options-list">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${
                  currentAnswer?.selectedAnswer === index ? 'selected' : ''
                }`}
                onClick={() => handleAnswerSelect(currentQuestion.id, index)}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
                {currentAnswer?.selectedAnswer === index && (
                  <i className="fas fa-check option-check"></i>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-navigation">
          <button
            className="btn-nav btn-prev"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <i className="fas fa-chevron-left"></i>
            Anterior
          </button>
          {isLastQuestion ? (
            <button
              className="btn-nav btn-submit"
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered}
            >
              <i className="fas fa-paper-plane"></i>
              Enviar Quiz
            </button>
          ) : (
            <button
              className="btn-nav btn-next"
              onClick={handleNext}
              disabled={!currentAnswer}
            >
              Siguiente
              <i className="fas fa-chevron-right"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

