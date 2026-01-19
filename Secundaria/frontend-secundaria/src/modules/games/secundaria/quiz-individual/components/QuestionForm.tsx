import React, { useState } from 'react';
import { useQuestions } from '../hooks/useQuestions';
import { QuestionFormData } from '../types/quiz.types';
import './QuestionForm.css';

interface QuestionFormProps {
  videoId?: string;
  onSuccess?: () => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ videoId, onSuccess }) => {
  const { createQuestion, isLoading, error, isSuccess } = useQuestions();
  const [formData, setFormData] = useState<QuestionFormData>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    videoId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createQuestion(formData);
    if (isSuccess && onSuccess) {
      onSuccess();
      // Reset form
      setFormData({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        videoId,
      });
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <form className="question-form" onSubmit={handleSubmit}>
      <h3>Crear Nueva Pregunta</h3>

      {error && <div className="error-message">{error}</div>}
      {isSuccess && <div className="success-message">Pregunta creada exitosamente</div>}

      <div className="form-group">
        <label htmlFor="question">Pregunta</label>
        <textarea
          id="question"
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          required
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Opciones de Respuesta</label>
        {formData.options.map((option, index) => (
          <div key={index} className="option-input-group">
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Opción ${index + 1}`}
              required
            />
            <input
              type="radio"
              name="correctAnswer"
              checked={formData.correctAnswer === index}
              onChange={() => setFormData({ ...formData, correctAnswer: index })}
            />
            <label>Correcta</label>
          </div>
        ))}
      </div>

      <div className="form-group">
        <label htmlFor="explanation">Explicación (opcional)</label>
        <textarea
          id="explanation"
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          rows={3}
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creando...' : 'Crear Pregunta'}
      </button>
    </form>
  );
};

