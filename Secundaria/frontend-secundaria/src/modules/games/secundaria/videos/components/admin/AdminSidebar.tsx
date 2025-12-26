import React, { useState } from 'react';
import { VideoCategory } from '../../types/video.types';
import { Quiz } from '../../../quiz-individual/types/quiz.types';
import './AdminSidebar.css';

interface AdminSidebarProps {
  categories: VideoCategory[];
  selectedItem: {
    type: 'category' | 'video' | 'quiz' | null;
    categoryName: string | null;
    videoId: string | null;
  };
  quizzes: Map<string, Quiz | null>;
  isOpen: boolean;
  onToggle: () => void;
  onSelectCategory: (categoryName: string) => void;
  onSelectVideo: (categoryName: string, videoId: string) => void;
  onSelectQuiz: (categoryName: string) => void;
  onAddCategory: () => void;
  onCategoryDelete: (categoryName: string) => void;
  onVideoDelete: (categoryName: string, videoId: string, title: string) => void;
  onQuizDelete: (categoryName: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  categories,
  selectedItem,
  quizzes,
  isOpen,
  onToggle,
  onSelectCategory,
  onSelectVideo,
  onSelectQuiz,
  onAddCategory,
  onCategoryDelete,
  onVideoDelete,
  onQuizDelete,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'category' | 'video' | 'quiz';
    categoryName: string;
    videoId?: string;
    title?: string;
  } | null>(null);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    type: 'category' | 'video' | 'quiz',
    categoryName: string,
    videoId?: string,
    title?: string
  ) => {
    e.stopPropagation();
    setDeleteConfirm({ type, categoryName, videoId, title });
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirm) return;
    
    if (deleteConfirm.type === 'category') {
      onCategoryDelete(deleteConfirm.categoryName);
    } else if (deleteConfirm.type === 'video' && deleteConfirm.videoId && deleteConfirm.title) {
      onVideoDelete(deleteConfirm.categoryName, deleteConfirm.videoId, deleteConfirm.title);
    } else if (deleteConfirm.type === 'quiz') {
      onQuizDelete(deleteConfirm.categoryName);
    }
    
    setDeleteConfirm(null);
  };

  const handleItemClick = (callback: () => void) => {
    callback();
    // Cerrar sidebar en móvil después de seleccionar
    if (window.innerWidth <= 1023) {
      onToggle();
    }
  };

  return (
    <>
      <div className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-header">
          <h2>Administración</h2>
          <button className="sidebar-close-btn" onClick={onToggle} aria-label="Cerrar menú">
            <i className="fas fa-times"></i>
          </button>
        </div>

      <div className="admin-sidebar-content">
        <button className="sidebar-add-category-btn" onClick={onAddCategory}>
          <i className="fas fa-plus"></i>
          <span>Nueva Categoría</span>
        </button>

        <div className="sidebar-categories-list">
          {categories.length === 0 ? (
            <div className="sidebar-empty-state">
              <i className="fas fa-folder-open"></i>
              <p>No hay categorías</p>
            </div>
          ) : (
            categories.map((category) => {
              const isExpanded = expandedCategories.has(category.name);
              const isCategorySelected = selectedItem.type === 'category' && selectedItem.categoryName === category.name;
              const quiz = quizzes.get(category.name);

              return (
                <div key={category.name} className="sidebar-category-item">
                  <div
                    className={`sidebar-category-header ${isCategorySelected ? 'selected' : ''}`}
                    onClick={() => {
                      toggleCategory(category.name);
                      handleItemClick(() => onSelectCategory(category.name));
                    }}
                  >
                    <div className="sidebar-category-header-content">
                      <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
                      <span className="sidebar-category-name">{category.name}</span>
                      <span className="sidebar-category-count">{category.videos.length}</span>
                    </div>
                    <button
                      className="sidebar-category-delete"
                      onClick={(e) => handleDeleteClick(e, 'category', category.name)}
                      aria-label="Eliminar categoría"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="sidebar-category-content">
                      {category.videos.map((video) => {
                        const isVideoSelected =
                          selectedItem.type === 'video' &&
                          selectedItem.categoryName === category.name &&
                          selectedItem.videoId === video.id;

                        return (
                          <div
                            key={video.id}
                            className={`sidebar-video-item ${isVideoSelected ? 'selected' : ''}`}
                            onClick={() => handleItemClick(() => onSelectVideo(category.name, video.id))}
                          >
                            <i className="fas fa-play-circle"></i>
                            <span className="sidebar-video-title">{video.title}</span>
                            <button
                              className="sidebar-item-delete"
                              onClick={(e) => handleDeleteClick(e, 'video', category.name, video.id, video.title)}
                              aria-label="Eliminar video"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        );
                      })}

                      {quiz && (
                        <div
                          className={`sidebar-quiz-item ${selectedItem.type === 'quiz' && selectedItem.categoryName === category.name ? 'selected' : ''}`}
                          onClick={() => handleItemClick(() => onSelectQuiz(category.name))}
                        >
                          <i className="fas fa-question-circle"></i>
                          <span className="sidebar-quiz-title">{quiz.title}</span>
                          <button
                            className="sidebar-item-delete"
                            onClick={(e) => handleDeleteClick(e, 'quiz', category.name)}
                            aria-label="Eliminar quiz"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {deleteConfirm && (
        <div className="sidebar-delete-modal">
          <div className="sidebar-delete-modal-content">
            <p>
              ¿Eliminar {deleteConfirm.type === 'category' ? 'categoría' : deleteConfirm.type === 'video' ? 'video' : 'quiz'}?
            </p>
            <div className="sidebar-delete-modal-actions">
              <button onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button onClick={handleDeleteConfirm} className="confirm-delete">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      {isOpen && (
        <div className="sidebar-overlay-mobile" onClick={onToggle}></div>
      )}
    </>
  );
};

