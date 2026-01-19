import React from 'react';
import { Question } from '../types/quiz.types';
import './QuestionCard.css';

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: number;
  onAnswerSelect: (answerIndex: number) => void;
  showResult?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  showResult = false,
}) => {
  return (
    <div className="question-card">
      <h3 className="question-text">{question.question}</h3>
      <div className="options-list">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          const isWrong = showResult && isSelected && !isCorrect;

          return (
            <button
              key={index}
              className={`option-button ${isSelected ? 'selected' : ''} ${
                showResult ? (isCorrect ? 'correct' : isWrong ? 'wrong' : '') : ''
              }`}
              onClick={() => onAnswerSelect(index)}
              disabled={showResult}
            >
              {option}
            </button>
          );
        })}
      </div>
      {showResult && question.explanation && (
        <div className="explanation">
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

