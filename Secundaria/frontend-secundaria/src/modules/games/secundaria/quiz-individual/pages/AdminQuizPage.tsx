import React, { useState } from 'react';
import { useQuestions } from '../hooks/useQuestions';
import { QuestionForm } from '../components/QuestionForm';
import { Question } from '../types/quiz.types';
import './AdminQuizPage.css';

export const AdminQuizPage: React.FC = () => {
  const { questions, isLoading, error, fetchQuestions, deleteQuestion } = useQuestions();
  const [selectedVideoId, setSelectedVideoId] = useState<string | undefined>();

  // TODO: Obtener videoId de props o contexto
  React.useEffect(() => {
    if (selectedVideoId) {
      fetchQuestions(selectedVideoId);
    } else {
      fetchQuestions();
    }
  }, [selectedVideoId]);

  const handleQuestionCreated = () => {
    if (selectedVideoId) {
      fetchQuestions(selectedVideoId);
    } else {
      fetchQuestions();
    }
  };

  return (
    <div className="admin-quiz-page">
      <h1>Administración de Preguntas</h1>

      <div className="admin-content">
        <section className="create-section">
          <QuestionForm videoId={selectedVideoId} onSuccess={handleQuestionCreated} />
        </section>

        <section className="questions-list-section">
          <h2>Preguntas Existentes</h2>
          {isLoading ? (
            <p>Cargando preguntas...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <div className="questions-list">
              {questions.length === 0 ? (
                <p>No hay preguntas creadas aún</p>
              ) : (
                questions.map((question) => (
                  <div key={question.id} className="question-item">
                    <h4>{question.question}</h4>
                    <ul>
                      {question.options.map((option, index) => (
                        <li key={index}>
                          {option} {index === question.correctAnswer && '(Correcta)'}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => deleteQuestion(question.id)}>Eliminar</button>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

