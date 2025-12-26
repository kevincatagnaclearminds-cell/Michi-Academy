import { useState, useEffect } from 'react';
import { Quiz, QuizAnswer, QuizResult } from '../types/quiz.types';

export const useQuiz = (quizId?: string, videoId?: string) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);

  const fetchQuiz = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implementar llamada a API
      // const endpoint = quizId ? `/api/quiz/${quizId}` : `/api/quiz/video/${videoId}`;
      // const response = await apiService.get<Quiz>(endpoint);
      // setQuiz(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = (questionId: string, selectedAnswer: number) => {
    setAnswers((prev) => [...prev, { questionId, selectedAnswer }]);
  };

  const nextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const finishQuiz = () => {
    if (!quiz) return;

    let score = 0;
    quiz.questions.forEach((question, index) => {
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
  };

  useEffect(() => {
    if (quizId || videoId) {
      fetchQuiz();
    }
  }, [quizId, videoId]);

  return {
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
    refetch: fetchQuiz,
  };
};

