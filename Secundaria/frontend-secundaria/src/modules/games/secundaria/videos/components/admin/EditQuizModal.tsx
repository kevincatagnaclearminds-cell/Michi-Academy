import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Quiz, Question } from '../../../quiz-individual/types/quiz.types';
import './Modal.css';

interface EditQuizModalProps {
  quiz: Quiz | null;
  categoryName: string;
  onSave: (updatedQuiz: Partial<Quiz>) => void;
  onClose: () => void;
}

export const EditQuizModal: React.FC<EditQuizModalProps> = ({
  quiz,
  categoryName,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(quiz?.title || `Quiz de ${categoryName}`);
  const [questions, setQuestions] = useState<Question[]>(quiz?.questions || []);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
  });

  useEffect(() => {
    setMounted(true);
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleAddQuestion = () => {
    if (newQuestion.question.trim() && newQuestion.options.every((opt) => opt.trim())) {
      const question: Question = {
        id: `q-${Date.now()}`,
        question: newQuestion.question.trim(),
        options: newQuestion.options.map((opt) => opt.trim()),
        correctAnswer: newQuestion.correctAnswer,
        explanation: newQuestion.explanation.trim() || undefined,
      };
      setQuestions([...questions, question]);
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
      });
    }
  };

  const handleEditQuestion = (index: number) => {
    const question = questions[index];
    setNewQuestion({
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || '',
    });
    setEditingQuestionIndex(index);
  };

  const handleUpdateQuestion = () => {
    if (editingQuestionIndex !== null && newQuestion.question.trim()) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = {
        ...updatedQuestions[editingQuestionIndex],
        question: newQuestion.question.trim(),
        options: newQuestion.options.map((opt) => opt.trim()),
        correctAnswer: newQuestion.correctAnswer,
        explanation: newQuestion.explanation.trim() || undefined,
      };
      setQuestions(updatedQuestions);
      setEditingQuestionIndex(null);
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
      });
    }
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    const newOptions = [...newQuestion.options];
    newOptions[optionIndex] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedQuiz: Partial<Quiz> = {
      title: title.trim(),
      questions,
    };
    onSave(updatedQuiz);
  };

  if (!mounted) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-extra-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Quiz</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="quiz-title">Título del Quiz</label>
            <input
              id="quiz-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="questions-section">
            <h3>Preguntas ({questions.length})</h3>
            {questions.map((q, index) => (
              <div key={q.id} className="question-card">
                <div className="question-header">
                  <span className="question-number">Pregunta {index + 1}</span>
                  <div className="question-actions">
                    <button
                      type="button"
                      className="btn-edit-question"
                      onClick={() => handleEditQuestion(index)}
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button
                      type="button"
                      className="btn-delete-question"
                      onClick={() => handleDeleteQuestion(index)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                <p className="question-text">{q.question}</p>
                <div className="options-list">
                  {q.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`option-item ${optIndex === q.correctAnswer ? 'correct' : ''}`}
                    >
                      <span className="option-label">{String.fromCharCode(65 + optIndex)}.</span>
                      <span className="option-text">{option}</span>
                      {optIndex === q.correctAnswer && (
                        <i className="fas fa-check-circle correct-icon"></i>
                      )}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <div className="question-explanation">
                    <strong>Explicación:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}

            <div className="new-question-form">
              <h4>{editingQuestionIndex !== null ? 'Editar Pregunta' : 'Nueva Pregunta'}</h4>
              <div className="form-group">
                <label>Pregunta</label>
                <input
                  type="text"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  placeholder="Escribe la pregunta..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Opciones (marca la respuesta correcta)</label>
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="option-input-group">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={newQuestion.correctAnswer === index}
                      onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
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
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  placeholder="Explicación de por qué esta es la respuesta correcta..."
                  rows={2}
                />
              </div>

              {editingQuestionIndex !== null ? (
                <div className="question-form-actions">
                  <button
                    type="button"
                    className="btn-update-question"
                    onClick={handleUpdateQuestion}
                  >
                    Actualizar Pregunta
                  </button>
                  <button
                    type="button"
                    className="btn-cancel-edit"
                    onClick={() => {
                      setEditingQuestionIndex(null);
                      setNewQuestion({
                        question: '',
                        options: ['', '', '', ''],
                        correctAnswer: 0,
                        explanation: '',
                      });
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button type="button" className="btn-add-question" onClick={handleAddQuestion}>
                  <i className="fas fa-plus"></i> Agregar Pregunta
                </button>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              Guardar Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};




