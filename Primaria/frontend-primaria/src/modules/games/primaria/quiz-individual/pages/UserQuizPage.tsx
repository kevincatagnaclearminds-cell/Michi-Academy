import React from 'react';
import { QuizForm } from '../components/QuizForm';
import './UserQuizPage.css';

export const UserQuizPage: React.FC = () => {
  // TODO: Obtener quizId o videoId de la URL o props cuando react-router-dom esté configurado
  // Por ahora, usando valores undefined (se pueden pasar como props si es necesario)
  const quizId = undefined;
  const videoId = undefined;

  return (
    <div className="user-quiz-page">
      <QuizForm quizId={quizId} videoId={videoId} />
    </div>
  );
};

