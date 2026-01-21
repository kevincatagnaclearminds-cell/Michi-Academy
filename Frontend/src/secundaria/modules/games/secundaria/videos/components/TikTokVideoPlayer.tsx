import React, { useState, useRef, useEffect } from 'react';
import { Video } from '../types/video.types';
import './TikTokVideoPlayer.css';

interface TikTokVideoPlayerProps {
  video: Video;
  videoIndex: number;
  totalVideos: number;
  onVideoEnd: () => void;
  onPreviousVideo?: () => void;
  onNextVideo?: () => void;
  onVideoWatched?: (videoId: string) => void;
}

// Función para detectar si es una URL de YouTube y convertirla a embed
const getYouTubeEmbedUrl = (url: string): string | null => {
  // YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=0&controls=1&rel=0`;
  }

  // YouTube normal: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=0&controls=1&rel=0`;
  }

  // YouTube short URL: https://youtu.be/VIDEO_ID
  const youtuBeMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (youtuBeMatch) {
    return `https://www.youtube.com/embed/${youtuBeMatch[1]}?autoplay=0&controls=1&rel=0`;
  }

  // Ya está en formato embed
  if (url.includes('youtube.com/embed/')) {
    return url;
  }

  return null;
};

// Función para detectar si es una URL de YouTube
const isYouTubeUrl = (url: string): boolean => {
  return /youtube\.com|youtu\.be/.test(url);
};

export const TikTokVideoPlayer: React.FC<TikTokVideoPlayerProps> = ({
  video,
  videoIndex,
  totalVideos,
  onVideoEnd,
  onPreviousVideo,
  onNextVideo,
  onVideoWatched,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLeftNav, setShowLeftNav] = useState(false);
  const [showRightNav, setShowRightNav] = useState(false);
  const [hasBeenWatched, setHasBeenWatched] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const watchTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const isYouTube = isYouTubeUrl(video.url);
  const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(video.url) : null;

  const handlePlayPause = () => {
    if (isYouTube) {
      // Para YouTube, no podemos controlar play/pause directamente desde fuera del iframe
      // El usuario debe usar los controles del iframe
      return;
    }
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    // Marcar como visto cuando termina
    if (!hasBeenWatched && onVideoWatched) {
      onVideoWatched(video.id);
      setHasBeenWatched(true);
    }
    onVideoEnd();
  };

  // Resetear el estado cuando cambia el video
  useEffect(() => {
    setHasBeenWatched(false);
    if (watchTimerRef.current) {
      clearTimeout(watchTimerRef.current);
      watchTimerRef.current = null;
    }
  }, [video.id]);

  // Marcar video como visto cuando se reproduce por un tiempo mínimo
  useEffect(() => {
    if (hasBeenWatched || !onVideoWatched) return;

    if (isYouTube) {
      // Para YouTube, marcamos como visto después de 3 segundos de estar cargado
      watchTimerRef.current = setTimeout(() => {
        onVideoWatched(video.id);
        setHasBeenWatched(true);
      }, 3000);
      
      return () => {
        if (watchTimerRef.current) {
          clearTimeout(watchTimerRef.current);
          watchTimerRef.current = null;
        }
      };
    } else {
      // Para videos normales, marcar como visto después de reproducir 5 segundos
      const handleTimeUpdate = () => {
        if (videoRef.current && videoRef.current.currentTime >= 5) {
          onVideoWatched(video.id);
          setHasBeenWatched(true);
        }
      };

      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.addEventListener('timeupdate', handleTimeUpdate);
        return () => {
          videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        };
      }
    }
  }, [isYouTube, video.id, hasBeenWatched, onVideoWatched]);

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPreviousVideo && videoIndex > 0) {
      onPreviousVideo();
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNextVideo && videoIndex < totalVideos - 1) {
      onNextVideo();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const leftZone = width * 0.3; // 30% izquierdo
    const rightZone = width * 0.7; // 70% derecho

    setShowLeftNav(x < leftZone && videoIndex > 0);
    setShowRightNav(x > rightZone && videoIndex < totalVideos - 1);
  };

  const handleMouseLeave = () => {
    setShowLeftNav(false);
    setShowRightNav(false);
  };

  return (
    <div className="tiktok-video-container">
      <div className="video-counter">
        Video {videoIndex + 1} de {totalVideos}
      </div>
      <div
        ref={wrapperRef}
        className="tiktok-video-wrapper"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {isYouTube && youtubeEmbedUrl ? (
          <iframe
            ref={iframeRef}
            src={youtubeEmbedUrl}
            className="tiktok-video youtube-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            frameBorder="0"
          ></iframe>
        ) : (
          <>
            <video
              ref={videoRef}
              src={video.url}
              className="tiktok-video"
              onEnded={handleVideoEnd}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              playsInline
            >
              Tu navegador no soporta la reproducción de videos.
            </video>
            {!isPlaying && (
              <div className="play-overlay" onClick={handlePlayPause}>
                <i className="fas fa-play play-icon"></i>
              </div>
            )}
          </>
        )}
        
        {showLeftNav && (
          <div className="nav-button nav-button-left" onClick={handlePrevious}>
            <i className="fas fa-chevron-left"></i>
          </div>
        )}
        
        {showRightNav && (
          <div className="nav-button nav-button-right" onClick={handleNext}>
            <i className="fas fa-chevron-right"></i>
          </div>
        )}

        <div className="video-info-overlay">
          <h3 className="video-title">{video.title}</h3>
          {video.description && (
            <p className="video-description">{video.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

