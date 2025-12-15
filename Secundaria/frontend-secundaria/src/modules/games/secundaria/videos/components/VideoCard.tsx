import React from 'react';
import { Video } from '../types/video.types';
import './VideoCard.css';

interface VideoCardProps {
  video: Video;
  onClick?: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  return (
    <div className="video-card" onClick={onClick}>
      {video.thumbnail ? (
        <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
      ) : (
        <div className="video-thumbnail-placeholder">
          <i className="fas fa-play"></i>
        </div>
      )}
      <div className="video-card-info">
        <h4>{video.title}</h4>
        {video.description && <p>{video.description}</p>}
      </div>
    </div>
  );
};

