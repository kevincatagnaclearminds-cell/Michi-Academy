import { useState } from 'react';
import { Question, QuestionFormData } from '../types/quiz.types';

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchQuestions = async (videoId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implementar llamada a API
      // const endpoint = videoId ? `/api/questions/video/${videoId}` : '/api/questions';
      // const response = await apiService.get<Question[]>(endpoint);
      // setQuestions(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar preguntas');
    } finally {
      setIsLoading(false);
    }
  };

  const createQuestion = async (data: QuestionFormData) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    try {
      // TODO: Implementar creación de pregunta
      // const response = await apiService.post<Question>('/api/questions', data);
      // setQuestions((prev) => [...prev, response]);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear pregunta');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuestion = async (questionId: string, data: Partial<QuestionFormData>) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    try {
      // TODO: Implementar actualización de pregunta
      // const response = await apiService.put<Question>(`/api/questions/${questionId}`, data);
      // setQuestions((prev) => prev.map((q) => (q.id === questionId ? response : q)));
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar pregunta');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteQuestion = async (questionId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implementar eliminación de pregunta
      // await apiService.delete(`/api/questions/${questionId}`);
      // setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar pregunta');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    questions,
    isLoading,
    error,
    isSuccess,
    fetchQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  };
};

