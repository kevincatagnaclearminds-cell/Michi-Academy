import React, { useState } from 'react';
import { Fabula } from '../types/fabula.types';
import './VideoPlayer.css';

interface VideoPlayerProps {
  fabula: Fabula;
  onComplete?: () => void;
  onQuizClick?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ fabula, onComplete, onQuizClick }) => {
  const [videoWatched, setVideoWatched] = useState(false);
  
  // Convertir URL de YouTube a embed format
  const getYouTubeEmbedUrl = (url: string): string => {
    let videoId = '';
    
    // Manejar diferentes formatos de URL de YouTube
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/watch')) {
      videoId = url.split('v=')[1]?.split('&')[0] || '';
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0] || '';
    }
    
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleComplete = () => {
    setVideoWatched(true);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="video-player">
      <div className="video-player-container">
        {fabula.videoUrl && (
          <iframe
            className="video-player-iframe"
            src={getYouTubeEmbedUrl(fabula.videoUrl)}
            title={fabula.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      <div className="video-player-controls">
        <button 
          className="video-complete-btn"
          onClick={handleComplete}
        >
          ✓ Marcar como visto
        </button>
        {videoWatched && fabula.quiz && fabula.quiz.length > 0 && onQuizClick && (
          <button 
            className="video-quiz-btn"
            onClick={onQuizClick}
          >
            📝 Ir al Quiz
          </button>
        )}
      </div>
    </div>
  );
};
