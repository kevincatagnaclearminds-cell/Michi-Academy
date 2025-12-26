import React from 'react';
import { Video } from '../../types/video.types';
import { getYouTubeThumbnail, isYouTubeUrl } from '../../utils/videoUtils';
import './VideoItemAdmin.css';

interface VideoItemAdminProps {
  video: Video;
  videoIndex: number;
  totalVideos: number;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const VideoItemAdmin: React.FC<VideoItemAdminProps> = ({
  video,
  videoIndex,
  totalVideos,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  // Obtener thumbnail del video
  const getVideoThumbnail = (): string | null => {
    if (video.thumbnail) {
      return video.thumbnail;
    }
    if (isYouTubeUrl(video.url)) {
      return getYouTubeThumbnail(video.url, 'medium');
    }
    return null;
  };

  const thumbnail = getVideoThumbnail();

  return (
    <div className="video-item-admin">
      <div className="video-drag-handle">
        <i className="fas fa-grip-vertical"></i>
      </div>
      <div className="video-preview-container">
        {thumbnail ? (
          <div className="video-preview">
            <img src={thumbnail} alt={video.title} className="video-thumbnail" />
            <div className="video-play-overlay">
              <i className="fas fa-play"></i>
            </div>
          </div>
        ) : (
          <div className="video-preview video-preview-placeholder">
            <i className="fas fa-play-circle"></i>
          </div>
        )}
      </div>
      <div className="video-info">
        <div className="video-details">
          <h3 className="video-title">{video.title}</h3>
          {video.description && <p className="video-description">{video.description}</p>}
          {video.duration && (
            <span className="video-duration">
              <i className="fas fa-clock"></i> {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>
      </div>
      <div className="video-actions">
        <div className="video-order-buttons">
          <button
            className="order-btn"
            onClick={onMoveUp}
            disabled={videoIndex === 0}
            aria-label="Mover arriba"
          >
            <i className="fas fa-arrow-up"></i>
          </button>
          <button
            className="order-btn"
            onClick={onMoveDown}
            disabled={videoIndex === totalVideos - 1}
            aria-label="Mover abajo"
          >
            <i className="fas fa-arrow-down"></i>
          </button>
        </div>
        <button className="action-btn edit-btn" onClick={onEdit} aria-label="Editar video">
          <i className="fas fa-pencil-alt"></i>
        </button>
        <button className="action-btn delete-btn" onClick={onDelete} aria-label="Eliminar video">
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

