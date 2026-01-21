import React from 'react';
import { Video } from '../types/video.types';
import './VideoPlayer.css';

interface VideoPlayerProps {
  video: Video;
  onVideoEnd?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onVideoEnd }) => {
  return (
    <div className="video-player">
      <video
        src={video.url}
        controls
        className="video-element"
        onEnded={onVideoEnd}
      >
        Tu navegador no soporta la reproducción de videos.
      </video>
      <div className="video-info">
        <h3>{video.title}</h3>
        {video.description && <p>{video.description}</p>}
      </div>
    </div>
  );
};

