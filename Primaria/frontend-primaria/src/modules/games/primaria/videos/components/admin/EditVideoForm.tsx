import React, { useState, useEffect } from 'react';
import { Video } from '../../types/video.types';
import './EditVideoForm.css';

interface EditVideoFormProps {
  video: Video | undefined;
  categoryName: string;
  onSave: (updatedVideo: Partial<Video>) => void;
  onCancel: () => void;
}

export const EditVideoForm: React.FC<EditVideoFormProps> = ({
  video,
  categoryName,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(video?.title || '');
  const [description, setDescription] = useState(video?.description || '');
  const [url, setUrl] = useState(video?.url || '');
  const [keyConcepts, setKeyConcepts] = useState<string[]>(video?.keyConcepts || []);
  const [newConcept, setNewConcept] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  // Estados para el quiz del video
  const [hasQuiz, setHasQuiz] = useState(!!video?.quiz);
  const [quizQuestion, setQuizQuestion] = useState(video?.quiz?.question || '');
  const [quizOptions, setQuizOptions] = useState<string[]>(
    video?.quiz?.options || ['', '', '', '']
  );
  const [correctAnswer, setCorrectAnswer] = useState<number>(video?.quiz?.correctAnswer ?? 0);

  const isNewVideo = !video;

  useEffect(() => {
    if (video) {
      setTitle(video.title || '');
      setDescription(video.description || '');
      setUrl(video.url || '');
      setKeyConcepts(video.keyConcepts || []);
      setHasQuiz(!!video.quiz);
      setQuizQuestion(video.quiz?.question || '');
      setQuizOptions(video.quiz?.options || ['', '', '', '']);
      setCorrectAnswer(video.quiz?.correctAnswer ?? 0);
    }
  }, [video]);

  const handleAddConcept = () => {
    if (newConcept.trim()) {
      setKeyConcepts([...keyConcepts, newConcept.trim()]);
      setNewConcept('');
    }
  };

  const handleRemoveConcept = (index: number) => {
    setKeyConcepts(keyConcepts.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleQuizOptionChange = (index: number, value: string) => {
    const newOptions = [...quizOptions];
    newOptions[index] = value;
    setQuizOptions(newOptions);
  };

  const handleAddQuiz = () => {
    setHasQuiz(true);
    setQuizQuestion('');
    setQuizOptions(['', '', '', '']);
    setCorrectAnswer(0);
  };

  const handleRemoveQuiz = () => {
    setHasQuiz(false);
    setQuizQuestion('');
    setQuizOptions(['', '', '', '']);
    setCorrectAnswer(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que si hay pregunta, también haya al menos 2 opciones con texto
    const filledOptions = quizOptions.filter(opt => opt.trim() !== '');
    if (hasQuiz && quizQuestion.trim() && filledOptions.length < 2) {
      alert('Si agregas una pregunta del quiz, debes proporcionar al menos 2 opciones.');
      return;
    }
    
    if (hasQuiz && !quizQuestion.trim()) {
      alert('Por favor, escribe la pregunta del quiz.');
      return;
    }
    
    const updatedVideo: Partial<Video> = {
      title: title.trim(),
      description: description.trim() || undefined,
      url: url.trim(),
      keyConcepts: keyConcepts.length > 0 ? keyConcepts : undefined,
      quiz: hasQuiz && quizQuestion.trim() && filledOptions.length >= 2 
        ? {
            question: quizQuestion.trim(),
            options: quizOptions.filter(opt => opt.trim() !== ''),
            correctAnswer: correctAnswer
          }
        : undefined,
    };
    onSave(updatedVideo);
  };

  return (
    <div className="edit-video-form">
      <div className="edit-form-header">
        <div className="edit-form-header-content">
          <button className="back-btn" onClick={onCancel}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1>{isNewVideo ? 'Nuevo Video' : 'Editar Video'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="edit-form-body">
        <div className="form-group">
          <label htmlFor="video-title">Título del video</label>
          <input
            id="video-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: ¿Qué es el dinero?"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="video-description">Descripción</label>
          <textarea
            id="video-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Breve descripción del video..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="video-url">URL del video</label>
          <input
            id="video-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL de YouTube, YouTube Shorts, o ruta local"
            required
          />
          <small className="form-hint">
            Puedes usar: YouTube, YouTube Shorts, o ruta local (ej: /videos/video.mp4)
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="video-file">O subir nuevo video (reemplazará el actual)</label>
          <input
            id="video-file"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
          />
          {videoFile && (
            <small className="form-hint">Archivo seleccionado: {videoFile.name}</small>
          )}
        </div>

        <div className="form-group">
          <label>Conceptos Clave</label>
          <div className="concepts-input-group">
            <input
              type="text"
              value={newConcept}
              onChange={(e) => setNewConcept(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddConcept();
                }
              }}
              placeholder="Agregar concepto importante..."
            />
            <button type="button" className="btn-add-concept" onClick={handleAddConcept}>
              <i className="fas fa-plus"></i> Agregar
            </button>
          </div>
          {keyConcepts.length > 0 && (
            <div className="concepts-list">
              {keyConcepts.map((concept, index) => (
                <div key={index} className="concept-tag">
                  <span>{concept}</span>
                  <button
                    type="button"
                    className="remove-concept-btn"
                    onClick={() => handleRemoveConcept(index)}
                    aria-label="Eliminar concepto"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección del Quiz del Video */}
        <div className="form-section-divider">
          <div className="divider-line"></div>
          <span className="divider-text">Quiz del Video</span>
          <div className="divider-line"></div>
        </div>

        {!hasQuiz ? (
          <div className="quiz-empty-state">
            <div className="empty-state-icon">
              <i className="fas fa-question-circle"></i>
            </div>
            <p className="empty-state-text">
              Este video no tiene quiz. Agrega una pregunta para reforzar el aprendizaje.
            </p>
            <button type="button" className="btn-add-quiz" onClick={handleAddQuiz}>
              <i className="fas fa-plus-circle"></i> Agregar Pregunta del Quiz
            </button>
          </div>
        ) : (
          <div className="quiz-form-container">
            <div className="quiz-form-header">
              <h3>
                <i className="fas fa-question-circle"></i> Pregunta del Quiz
              </h3>
              <button type="button" className="btn-remove-quiz" onClick={handleRemoveQuiz} title="Eliminar pregunta">
                <i className="fas fa-trash-alt"></i> Eliminar Pregunta
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="quiz-question">Pregunta</label>
              <input
                id="quiz-question"
                type="text"
                value={quizQuestion}
                onChange={(e) => setQuizQuestion(e.target.value)}
                placeholder="Ej: ¿Qué es el dinero?"
                required={hasQuiz}
              />
              <small className="form-hint">
                Escribe una pregunta sobre la idea principal del video
              </small>
            </div>

            <div className="form-group">
              <label>Opciones de Respuesta (Mínimo 2)</label>
              {quizOptions.map((option, index) => (
                <div key={index} className="quiz-option-input">
                  <div className="option-header">
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleQuizOptionChange(index, e.target.value)}
                      placeholder={`Opción ${String.fromCharCode(65 + index)}`}
                    />
                  </div>
                  <label className="correct-answer-radio">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={correctAnswer === index}
                      onChange={() => setCorrectAnswer(index)}
                    />
                    <span>Respuesta correcta</span>
                  </label>
                </div>
              ))}
              <small className="form-hint">
                <i className="fas fa-info-circle"></i> Marca la opción que sea la respuesta correcta
              </small>
            </div>
          </div>
        )}

        <div className="edit-form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn-save">
            {isNewVideo ? 'Crear Video' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

