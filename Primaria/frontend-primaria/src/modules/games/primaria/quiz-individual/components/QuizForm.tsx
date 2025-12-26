import React from 'react';
import { QuestionCard } from './QuestionCard';
import { useQuiz } from '../hooks/useQuiz';
import './QuizForm.css';

interface QuizFormProps {
  quizId?: string;
  videoId?: string;
}

export const QuizForm: React.FC<QuizFormProps> = ({ quizId, videoId }) => {
  const {
    quiz,
    isLoading,
    error,
    currentQuestionIndex,
    answers,
    result,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    finishQuiz,
  } = useQuiz(quizId, videoId);

  if (isLoading) {
    return <div className="quiz-form">Cargando quiz...</div>;
  }

  if (error) {
    return <div className="quiz-form">Error: {error}</div>;
  }

  if (!quiz) {
    return <div className="quiz-form">No hay quiz disponible</div>;
  }

  if (result) {
    return (
      <div className="quiz-result">
        <h2>Resultados del Quiz</h2>
        <div className="score-display">
          <p>Puntuación: {result.score} / {result.totalQuestions}</p>
          <p>Porcentaje: {result.percentage.toFixed(1)}%</p>
        </div>
        <button onClick={() => window.location.reload()}>Volver a Intentar</button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id);
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="quiz-form">
      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        <p>Pregunta {currentQuestionIndex + 1} de {quiz.questions.length}</p>
      </div>

      <QuestionCard
        question={currentQuestion}
        selectedAnswer={currentAnswer?.selectedAnswer}
        onAnswerSelect={(index) => submitAnswer(currentQuestion.id, index)}
      />

      <div className="quiz-navigation">
        <button onClick={previousQuestion} disabled={currentQuestionIndex === 0}>
          Anterior
        </button>
        {isLastQuestion ? (
          <button onClick={finishQuiz} disabled={!currentAnswer}>
            Finalizar Quiz
          </button>
        ) : (
          <button onClick={nextQuestion} disabled={!currentAnswer}>
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
};

