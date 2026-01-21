import React, { useState, useEffect } from 'react';
import { Quiz, Question } from '../../../quiz-individual/types/quiz.types';
import { EditQuestionModal } from './EditQuestionModal';
import './EditQuizForm.css';

interface EditQuizFormProps {
  quiz: Quiz | null;
  categoryName: string;
  onSave: (updatedQuiz: Partial<Quiz>) => void;
  onCancel: () => void;
}

export const EditQuizForm: React.FC<EditQuizFormProps> = ({
  quiz,
  categoryName,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(quiz?.title || `Quiz de ${categoryName}`);
  const [questions, setQuestions] = useState<Question[]>(quiz?.questions || []);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  useEffect(() => {
    if (quiz) {
      setTitle(quiz.title || `Quiz de ${categoryName}`);
      setQuestions(quiz.questions || []);
    }
  }, [quiz, categoryName]);

  const handleAddQuestion = () => {
    setEditingQuestionIndex(null);
    setShowQuestionModal(true);
  };

  const handleEditQuestion = (index: number) => {
    setEditingQuestionIndex(index);
    setShowQuestionModal(true);
  };

  const handleSaveQuestion = (questionData: Question) => {
    if (editingQuestionIndex !== null) {
      // Actualizar pregunta existente
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = questionData;
      setQuestions(updatedQuestions);
    } else {
      // Agregar nueva pregunta
      setQuestions([...questions, questionData]);
    }
    setEditingQuestionIndex(null);
    setShowQuestionModal(false);
  };

  const handleCloseQuestionModal = () => {
    setShowQuestionModal(false);
    setEditingQuestionIndex(null);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedQuiz: Partial<Quiz> = {
      title: title.trim(),
      questions,
    };
    onSave(updatedQuiz);
  };

  return (
    <div className="edit-quiz-form">
      <div className="edit-form-header">
        <div className="edit-form-header-content">
          <button className="back-btn" onClick={onCancel}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1>Editar Quiz</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="edit-form-body">
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

          <div className="new-question-section">
            <button type="button" className="btn-add-question" onClick={handleAddQuestion}>
              <i className="fas fa-plus"></i> Agregar Pregunta
            </button>
          </div>
        </div>

        <div className="edit-form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn-save">
            Guardar Quiz
          </button>
        </div>
      </form>

      {showQuestionModal && (
        <EditQuestionModal
          question={editingQuestionIndex !== null ? questions[editingQuestionIndex] : null}
          onSave={handleSaveQuestion}
          onClose={handleCloseQuestionModal}
        />
      )}
    </div>
  );
};

