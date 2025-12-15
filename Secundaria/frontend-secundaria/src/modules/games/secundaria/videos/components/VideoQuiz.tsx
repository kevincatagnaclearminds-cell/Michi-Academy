import React, { useState, useEffect } from 'react';
import './VideoQuiz.css';

interface VideoQuizProps {
  question: string;
  options: string[];
  correctAnswer: number;
  onAnswer?: (isCorrect: boolean) => void;
}

export const VideoQuiz: React.FC<VideoQuizProps> = ({ 
  question, 
  options, 
  correctAnswer,
  onAnswer 
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Resetear el estado cuando cambia la pregunta (nuevo video)
  useEffect(() => {
    setSelectedOption(null);
    setShowResult(false);
  }, [question]);

  const handleOptionClick = (index: number) => {
    if (showResult) return; // No permitir cambios después de responder
    
    setSelectedOption(index);
    setShowResult(true);
    
    const isCorrect = index === correctAnswer;
    if (onAnswer) {
      onAnswer(isCorrect);
    }
  };

  const getOptionClass = (index: number) => {
    if (!showResult) {
      return selectedOption === index ? 'selected' : '';
    }
    
    if (index === correctAnswer) {
      return 'correct';
    }
    
    if (selectedOption === index && index !== correctAnswer) {
      return 'incorrect';
    }
    
    return '';
  };

  return (
    <div className="video-quiz">
      <div className="quiz-header">
        <i className="fas fa-question-circle quiz-icon"></i>
        <h3>Quiz del Video</h3>
      </div>
      
      <div className="quiz-content">
        <p className="quiz-question">{question}</p>
        
        <div className="quiz-options">
          {options.map((option, index) => (
            <button
              key={index}
              className={`quiz-option ${getOptionClass(index)}`}
              onClick={() => handleOptionClick(index)}
              disabled={showResult}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
              {showResult && index === correctAnswer && (
                <i className="fas fa-check-circle option-icon"></i>
              )}
              {showResult && selectedOption === index && index !== correctAnswer && (
                <i className="fas fa-times-circle option-icon"></i>
              )}
            </button>
          ))}
        </div>
        
        {showResult && (
          <div className={`quiz-feedback ${selectedOption === correctAnswer ? 'success' : 'error'}`}>
            <i className={`fas ${selectedOption === correctAnswer ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
            <p>
              {selectedOption === correctAnswer 
                ? '¡Correcto! Excelente trabajo.' 
                : `Incorrecto. La respuesta correcta es la opción ${String.fromCharCode(65 + correctAnswer)}.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
