import React, { useState } from 'react';
import { FabulaQuizQuestion } from '../types/fabula.types';
import { FabulaQuiz } from './FabulaQuiz';

interface QuizSequenceProps {
  quiz: FabulaQuizQuestion[];
  onComplete: (isCorrect: boolean) => void;
}

export const QuizSequence: React.FC<QuizSequenceProps> = ({ quiz, onComplete }) => {
  const [current, setCurrent] = useState(0);
  const [allCorrect, setAllCorrect] = useState(true);

  const handleAnswer = (isCorrect: boolean) => {
    if (!isCorrect) setAllCorrect(false);
    if (current < quiz.length - 1) {
      setCurrent(current + 1);
    } else {
      onComplete(allCorrect && isCorrect);
    }
  };

  return <FabulaQuiz quiz={quiz[current]} onAnswer={handleAnswer} />;
};