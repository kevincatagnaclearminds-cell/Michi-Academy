import React from 'react';
import { UserQuizPage } from './pages/UserQuizPage';
import { AdminQuizPage } from './pages/AdminQuizPage';
import './quiz-individual.css';

// TODO: Reemplazar con lógica real de roles cuando esté implementada
const isAdmin = () => {
  // Temporal: verificar si el usuario es admin
  // Por ahora, puedes usar localStorage o un prop
  const userRole = localStorage.getItem('userRole');
  return userRole === 'admin';
};

const QuizIndividualPrimariaPage = () => {
  // Decidir qué vista mostrar según el rol
  if (isAdmin()) {
    return <AdminQuizPage />;
  }

  return <UserQuizPage />;
};

export default QuizIndividualPrimariaPage;
