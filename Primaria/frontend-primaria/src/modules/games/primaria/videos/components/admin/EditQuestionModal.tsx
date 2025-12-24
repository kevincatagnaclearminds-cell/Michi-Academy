import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Question } from '../../../quiz-individual/types/quiz.types';
import './Modal.css';

interface EditQuestionModalProps {
  question: Question | null; // null para nueva pregunta
  onSave: (question: Question) => void;
  onClose: () => void;
}

export const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  question,
  onSave,
  onClose,
}) => {
  const [questionText, setQuestionText] = useState(question?.question || '');
  const [options, setOptions] = useState<string[]>(question?.options || ['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(question?.correctAnswer || 0);
  const [explanation, setExplanation] = useState(question?.explanation || '');
  const [mounted, setMounted] = useState(false);

  const isNewQuestion = !question;

  useEffect(() => {
    setMounted(true);
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  useEffect(() => {
    if (question) {
      setQuestionText(question.question);
      setOptions([...question.options]);
      setCorrectAnswer(question.correctAnswer);
      setExplanation(question.explanation || '');
    }
  }, [question]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionText.trim() && options.every((opt) => opt.trim())) {
      const questionData: Question = {
        id: question?.id || `q-${Date.now()}`,
        question: questionText.trim(),
        options: options.map((opt) => opt.trim()),
        correctAnswer,
        explanation: explanation.trim() || undefined,
      };
      onSave(questionData);
      onClose();
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isNewQuestion ? 'Nueva Pregunta' : 'Editar Pregunta'}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="question-text">Pregunta</label>
            <input
              id="question-text"
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Escribe la pregunta..."
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Opciones (marca la respuesta correcta)</label>
            {options.map((option, index) => (
              <div key={index} className="option-input-group">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={correctAnswer === index}
                  onChange={() => setCorrectAnswer(index)}
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Opción ${String.fromCharCode(65 + index)}`}
                  required
                />
              </div>
            ))}
          </div>

          <div className="form-group">
            <label htmlFor="explanation">Explicación (opcional)</label>
            <textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explicación de por qué esta es la respuesta correcta..."
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              {isNewQuestion ? 'Agregar Pregunta' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};




















