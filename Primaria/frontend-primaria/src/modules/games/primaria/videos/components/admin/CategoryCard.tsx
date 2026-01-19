import React, { useState } from 'react';
import { VideoCategory } from '../../types/video.types';
import { Quiz } from '../../../quiz-individual/types/quiz.types';
import { VideoItemAdmin } from './VideoItemAdmin';
import { QuizItemAdmin } from './QuizItemAdmin';
import './CategoryCard.css';

interface CategoryCardProps {
  category: VideoCategory;
  quiz: Quiz | null;
  index: number;
  totalCategories: number;
  onCategoryNameEdit: () => void;
  onVideoEdit: (videoId: string) => void;
  onVideoAdd: () => void;
  onVideoDelete: (videoId: string, title: string) => void;
  onVideoReorder: (categoryName: string, videoId: string, newIndex: number) => void;
  onVideoMoveUp: (categoryName: string, videoId: string) => void;
  onVideoMoveDown: (categoryName: string, videoId: string) => void;
  onCategoryReorder: (categoryName: string, newIndex: number) => void;
  onCategoryMoveUp: (categoryName: string) => void;
  onCategoryMoveDown: (categoryName: string) => void;
  onCategoryDelete: () => void;
  onQuizEdit: () => void;
  onQuizDelete: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  quiz,
  index,
  totalCategories,
  onCategoryNameEdit,
  onVideoEdit,
  onVideoAdd,
  onVideoDelete,
  onVideoReorder,
  onVideoMoveUp,
  onVideoMoveDown,
  onCategoryReorder,
  onCategoryMoveUp,
  onCategoryMoveDown,
  onCategoryDelete,
  onQuizEdit,
  onQuizDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDraggingCategory, setIsDraggingCategory] = useState(false);
  const [draggedVideoId, setDraggedVideoId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleCategoryDragStart = (e: React.DragEvent) => {
    setIsDraggingCategory(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', category.name);
    e.dataTransfer.setData('category-index', index.toString());
  };

  const handleCategoryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleCategoryDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('category-index'));
    if (!isNaN(sourceIndex) && sourceIndex !== index) {
      onCategoryReorder(category.name, index);
    }
    setIsDraggingCategory(false);
  };

  const handleCategoryDragEnd = () => {
    setIsDraggingCategory(false);
  };

  const handleVideoDragStart = (e: React.DragEvent, videoId: string) => {
    setDraggedVideoId(videoId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', videoId);
  };

  const handleVideoDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleVideoDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const videoId = e.dataTransfer.getData('text/plain');
    if (videoId && draggedVideoId) {
      onVideoReorder(category.name, videoId, targetIndex);
    }
    setDraggedVideoId(null);
    setDragOverIndex(null);
  };

  const handleVideoDragEnd = () => {
    setDraggedVideoId(null);
    setDragOverIndex(null);
  };

  return (
    <div
      className={`category-card ${isDraggingCategory ? 'dragging' : ''}`}
      draggable
      onDragStart={handleCategoryDragStart}
      onDragOver={handleCategoryDragOver}
      onDrop={handleCategoryDrop}
      onDragEnd={handleCategoryDragEnd}
    >
      <div className="category-card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="category-header-content">
          <button
            className="category-toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            aria-label={isExpanded ? 'Colapsar' : 'Expandir'}
          >
            <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
          </button>
          <div
            className="category-name-wrapper"
            onMouseEnter={(e) => {
              const editBtn = e.currentTarget.querySelector('.category-edit-btn');
              if (editBtn) (editBtn as HTMLElement).style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              const editBtn = e.currentTarget.querySelector('.category-edit-btn');
              if (editBtn) (editBtn as HTMLElement).style.opacity = '0';
            }}
          >
            <h2 className="category-name">{category.name}</h2>
            <button
              className="category-edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                onCategoryNameEdit();
              }}
              aria-label="Editar categoría"
            >
              <i className="fas fa-pencil-alt"></i>
            </button>
          </div>
          <div className="category-order-buttons">
            <button
              className="order-btn"
              onClick={(e) => {
                e.stopPropagation();
                onCategoryMoveUp(category.name);
              }}
              disabled={index === 0}
              aria-label="Mover arriba"
            >
              <i className="fas fa-arrow-up"></i>
            </button>
            <button
              className="order-btn"
              onClick={(e) => {
                e.stopPropagation();
                onCategoryMoveDown(category.name);
              }}
              disabled={index === totalCategories - 1}
              aria-label="Mover abajo"
            >
              <i className="fas fa-arrow-down"></i>
            </button>
          </div>
        </div>
        <button
          className="category-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onCategoryDelete();
          }}
          aria-label="Eliminar categoría"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>

      {isExpanded && (
        <div className="category-content">
        <div className="category-items">
          {category.videos.map((video, videoIndex) => (
            <div
              key={video.id}
              className={`video-item-wrapper ${draggedVideoId === video.id ? 'dragging' : ''} ${
                dragOverIndex === videoIndex ? 'drag-over' : ''
              }`}
              draggable
              onDragStart={(e) => handleVideoDragStart(e, video.id)}
              onDragOver={(e) => handleVideoDragOver(e, videoIndex)}
              onDrop={(e) => handleVideoDrop(e, videoIndex)}
              onDragEnd={handleVideoDragEnd}
            >
              <VideoItemAdmin
                video={video}
                videoIndex={videoIndex}
                totalVideos={category.videos.length}
                onEdit={() => onVideoEdit(video.id)}
                onDelete={() => onVideoDelete(video.id, video.title)}
                onMoveUp={() => onVideoMoveUp(category.name, video.id)}
                onMoveDown={() => onVideoMoveDown(category.name, video.id)}
              />
            </div>
          ))}
          <button className="add-video-btn" onClick={onVideoAdd}>
            <i className="fas fa-plus"></i>
            Añadir otro video corto
          </button>
          {quiz && (
            <div className="quiz-item-wrapper">
              <QuizItemAdmin quiz={quiz} onEdit={onQuizEdit} onDelete={onQuizDelete} />
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};

