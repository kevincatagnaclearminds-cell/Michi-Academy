import React from 'react';
import { VideoCategory } from '../../types/video.types';
import { Quiz } from '../../../quiz-individual/types/quiz.types';
import { VideoItemAdmin } from './VideoItemAdmin';
import { QuizItemAdmin } from './QuizItemAdmin';
import { EditVideoForm } from './EditVideoForm';
import { EditQuizForm } from './EditQuizForm';
import { getYouTubeThumbnail, isYouTubeUrl } from '../../utils/videoUtils';
import './AdminContentArea.css';

interface AdminContentAreaProps {
  selectedItem: {
    type: 'category' | 'video' | 'quiz' | null;
    categoryName: string | null;
    videoId: string | null;
  };
  editingVideo: { id: string; category: string } | null;
  addingVideo: string | null;
  editingQuiz: string | null;
  categories: VideoCategory[];
  quizzes: Map<string, Quiz | null>;
  onSelectCategory: (categoryName: string) => void;
  onVideoEdit: (categoryName: string, videoId: string) => void;
  onVideoSave: (categoryName: string, videoId: string | null, updatedVideo: any) => void;
  onVideoCancel: () => void;
  onVideoDelete: (categoryName: string, videoId: string, title: string) => void;
  onVideoAdd: (categoryName: string) => void;
  onVideoMoveUp: (categoryName: string, videoId: string) => void;
  onVideoMoveDown: (categoryName: string, videoId: string) => void;
  onQuizEdit: (categoryName: string) => void;
  onQuizSave: (categoryName: string, updatedQuiz: any) => void;
  onQuizCancel: () => void;
  onQuizDelete: (categoryName: string) => void;
  onCategoryNameEdit: (categoryName: string) => void;
}

export const AdminContentArea: React.FC<AdminContentAreaProps> = ({
  selectedItem,
  editingVideo,
  addingVideo,
  editingQuiz,
  categories,
  quizzes,
  onSelectCategory,
  onVideoEdit,
  onVideoSave,
  onVideoCancel,
  onVideoDelete,
  onVideoAdd,
  onVideoMoveUp,
  onVideoMoveDown,
  onQuizEdit,
  onQuizSave,
  onQuizCancel,
  onQuizDelete,
  onCategoryNameEdit,
}) => {
  const selectedCategory = selectedItem.categoryName
    ? categories.find((c) => c.name === selectedItem.categoryName)
    : null;

  const selectedVideo =
    selectedItem.type === 'video' && selectedCategory
      ? selectedCategory.videos.find((v) => v.id === selectedItem.videoId)
      : null;

  const selectedQuiz =
    selectedItem.type === 'quiz' && selectedItem.categoryName
      ? quizzes.get(selectedItem.categoryName)
      : null;

  // Si se está editando un video, mostrar el formulario de edición
  if (editingVideo) {
    const video = categories
      .find((c) => c.name === editingVideo.category)
      ?.videos.find((v) => v.id === editingVideo.id);
    return (
      <div className="admin-content-area">
        <EditVideoForm
          video={video}
          categoryName={editingVideo.category}
          onSave={(updatedVideo) => onVideoSave(editingVideo.category, editingVideo.id, updatedVideo)}
          onCancel={onVideoCancel}
        />
      </div>
    );
  }

  // Si se está agregando un video, mostrar el formulario de edición
  if (addingVideo) {
    return (
      <div className="admin-content-area">
        <EditVideoForm
          video={undefined}
          categoryName={addingVideo}
          onSave={(newVideo) => onVideoSave(addingVideo, null, newVideo)}
          onCancel={onVideoCancel}
        />
      </div>
    );
  }

  // Si se está editando un quiz, mostrar el formulario de edición
  if (editingQuiz) {
    const quiz = quizzes.get(editingQuiz);
    return (
      <div className="admin-content-area">
        <EditQuizForm
          quiz={quiz || null}
          categoryName={editingQuiz}
          onSave={(updatedQuiz) => onQuizSave(editingQuiz, updatedQuiz)}
          onCancel={onQuizCancel}
        />
      </div>
    );
  }

  if (!selectedItem.type) {
    return (
      <div className="admin-content-area">
        <div className="admin-content-empty">
          <i className="fas fa-mouse-pointer"></i>
          <h2>Selecciona una categoría, video o quiz</h2>
          <p>Elige un elemento del menú izquierdo para comenzar a editar</p>
        </div>
      </div>
    );
  }

  if (selectedItem.type === 'category' && selectedCategory) {
    return (
      <div className="admin-content-area">
        <div className="admin-content-header">
          <div className="content-header-main">
            <h1>{selectedCategory.name}</h1>
            <button
              className="edit-category-name-btn"
              onClick={() => onCategoryNameEdit(selectedCategory.name)}
              aria-label="Editar nombre de categoría"
            >
              <i className="fas fa-pencil-alt"></i>
              Editar nombre
            </button>
          </div>
          <p className="content-header-subtitle">
            {selectedCategory.videos.length} video{selectedCategory.videos.length !== 1 ? 's' : ''} •{' '}
            {quizzes.get(selectedCategory.name) ? '1 quiz' : 'Sin quiz'}
          </p>
        </div>

        <div className="admin-content-body">
          <div className="content-section">
            <div className="content-section-header">
              <h3>Videos</h3>
              <button className="add-item-btn" onClick={() => onVideoAdd(selectedCategory.name)}>
                <i className="fas fa-plus"></i>
                Agregar Video
              </button>
            </div>

            {selectedCategory.videos.length === 0 ? (
              <div className="content-empty-state">
                <i className="fas fa-video"></i>
                <p>No hay videos en esta categoría</p>
                <button className="add-item-btn-primary" onClick={() => onVideoAdd(selectedCategory.name)}>
                  <i className="fas fa-plus"></i>
                  Agregar primer video
                </button>
              </div>
            ) : (
              <div className="content-items-list">
                {selectedCategory.videos.map((video, index) => (
                  <VideoItemAdmin
                    key={video.id}
                    video={video}
                    videoIndex={index}
                    totalVideos={selectedCategory.videos.length}
                    onEdit={() => onVideoEdit(selectedCategory.name, video.id)}
                    onDelete={() => onVideoDelete(selectedCategory.name, video.id, video.title)}
                    onMoveUp={() => onVideoMoveUp(selectedCategory.name, video.id)}
                    onMoveDown={() => onVideoMoveDown(selectedCategory.name, video.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="content-section">
            <div className="content-section-header">
              <h3>Quiz</h3>
              {quizzes.get(selectedCategory.name) ? (
                <button className="add-item-btn" onClick={() => onQuizEdit(selectedCategory.name)}>
                  <i className="fas fa-pencil-alt"></i>
                  Editar Quiz
                </button>
              ) : (
                <button className="add-item-btn" onClick={() => onQuizEdit(selectedCategory.name)}>
                  <i className="fas fa-plus"></i>
                  Crear Quiz
                </button>
              )}
            </div>

            {quizzes.get(selectedCategory.name) ? (
              <div className="content-items-list">
                <QuizItemAdmin
                  quiz={quizzes.get(selectedCategory.name)!}
                  onEdit={() => onQuizEdit(selectedCategory.name)}
                  onDelete={() => onQuizDelete(selectedCategory.name)}
                />
              </div>
            ) : (
              <div className="content-empty-state">
                <i className="fas fa-question-circle"></i>
                <p>Esta categoría aún no tiene un quiz</p>
                <button className="add-item-btn-primary" onClick={() => onQuizEdit(selectedCategory.name)}>
                  <i className="fas fa-plus"></i>
                  Crear quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (selectedItem.type === 'video' && selectedVideo && selectedCategory) {
    const getVideoThumbnail = (): string | null => {
      if (selectedVideo.thumbnail) {
        return selectedVideo.thumbnail;
      }
      if (isYouTubeUrl(selectedVideo.url)) {
        return getYouTubeThumbnail(selectedVideo.url, 'high');
      }
      return null;
    };

    const thumbnail = getVideoThumbnail();

    return (
      <div className="admin-content-area">
        <div className="admin-content-header">
          <div className="content-header-main">
            <button
              className="back-btn"
              onClick={() => {
                if (selectedCategory) {
                  onSelectCategory(selectedCategory.name);
                }
              }}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <h1>Preview</h1>
          </div>
          <p className="content-header-subtitle">Categoría: {selectedCategory.name}</p>
        </div>

        <div className="admin-content-body">
          <div className="video-preview-view">
            <div className="video-preview-section">
              <h2 className="preview-section-title">{selectedVideo.title}</h2>
              
              <div className="video-preview-container-large">
                {thumbnail ? (
                  <div className="video-preview-large">
                    <img src={thumbnail} alt={selectedVideo.title} className="video-thumbnail-large" />
                    <div className="video-play-overlay-large">
                      <i className="fas fa-play"></i>
                    </div>
                  </div>
                ) : (
                  <div className="video-preview-placeholder-large">
                    <i className="fas fa-video"></i>
                    <p>Video: {selectedVideo.url}</p>
                  </div>
                )}
              </div>

              {selectedVideo.description && (
                <div className="video-description-preview">
                  <h3>Descripción</h3>
                  <p>{selectedVideo.description}</p>
                </div>
              )}

              {selectedVideo.keyConcepts && selectedVideo.keyConcepts.length > 0 && (
                <div className="video-concepts-preview">
                  <h3>Conceptos Clave</h3>
                  <div className="concepts-list-preview">
                    {selectedVideo.keyConcepts.map((concept, index) => (
                      <div key={index} className="concept-tag-preview">
                        <i className="fas fa-lightbulb"></i>
                        <span>{concept}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="video-preview-actions">
                <button
                  className="action-btn-primary"
                  onClick={() => onVideoEdit(selectedCategory.name, selectedVideo.id)}
                >
                  <i className="fas fa-pencil-alt"></i>
                  Editar Video
                </button>
                <button
                  className="action-btn-danger"
                  onClick={() => onVideoDelete(selectedCategory.name, selectedVideo.id, selectedVideo.title)}
                >
                  <i className="fas fa-trash"></i>
                  Eliminar Video
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedItem.type === 'quiz' && selectedQuiz && selectedItem.categoryName) {
    const selectedCategoryForQuiz = categories.find((c) => c.name === selectedItem.categoryName);

    return (
      <div className="admin-content-area">
        <div className="admin-content-header">
          <div className="content-header-main">
            <button
              className="back-btn"
              onClick={() => {
                if (selectedCategoryForQuiz) {
                  onSelectCategory(selectedCategoryForQuiz.name);
                }
              }}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <h1>Preview</h1>
          </div>
          <p className="content-header-subtitle">Categoría: {selectedItem.categoryName}</p>
        </div>

        <div className="admin-content-body">
          <div className="quiz-preview-view">
            <div className="quiz-preview-section">
              <h2 className="preview-section-title">{selectedQuiz.title}</h2>
              
              <div className="quiz-preview-info">
                <div className="quiz-info-badge">
                  <i className="fas fa-question-circle"></i>
                  <span>{selectedQuiz.questions.length} pregunta{selectedQuiz.questions.length !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="quiz-questions-preview">
                {selectedQuiz.questions.map((question, index) => (
                  <div key={question.id} className="question-preview-card">
                    <div className="question-preview-header">
                      <span className="question-preview-number">Pregunta {index + 1}</span>
                    </div>
                    <p className="question-preview-text">{question.question}</p>
                    <div className="question-preview-options">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`question-preview-option ${optIndex === question.correctAnswer ? 'correct' : ''}`}
                        >
                          <span className="option-label-preview">{String.fromCharCode(65 + optIndex)}.</span>
                          <span className="option-text-preview">{option}</span>
                          {optIndex === question.correctAnswer && (
                            <i className="fas fa-check-circle correct-icon-preview"></i>
                          )}
                        </div>
                      ))}
                    </div>
                    {question.explanation && (
                      <div className="question-preview-explanation">
                        <strong>Explicación:</strong> {question.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="quiz-preview-actions">
                <button
                  className="action-btn-primary"
                  onClick={() => onQuizEdit(selectedItem.categoryName!)}
                >
                  <i className="fas fa-pencil-alt"></i>
                  Editar Quiz
                </button>
                <button
                  className="action-btn-danger"
                  onClick={() => onQuizDelete(selectedItem.categoryName!)}
                >
                  <i className="fas fa-trash"></i>
                  Eliminar Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

