import React, { useRef, useState, useEffect } from 'react';
import './MediaPlayer.css';

interface MediaPlayerProps {
  audioUrl?: string;
  videoUrl?: string;
  title: string;
  text?: string;
  onEnd?: () => void;
}

export const MediaPlayer: React.FC<MediaPlayerProps> = ({ 
  audioUrl, 
  videoUrl, 
  title,
  text,
  onEnd 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const media = audioRef.current || videoRef.current;
    if (!media) return;

    const updateTime = () => setCurrentTime(media.currentTime);
    const updateDuration = () => setDuration(media.duration);
    const handleEnd = () => {
      setIsPlaying(false);
      if (onEnd) onEnd();
    };

    media.addEventListener('timeupdate', updateTime);
    media.addEventListener('loadedmetadata', updateDuration);
    media.addEventListener('ended', handleEnd);

    return () => {
      media.removeEventListener('timeupdate', updateTime);
      media.removeEventListener('loadedmetadata', updateDuration);
      media.removeEventListener('ended', handleEnd);
    };
  }, [onEnd]);

  const togglePlay = () => {
    // Si hay texto, siempre usar TextToSpeech para reproducir la frase
    if (text) {
      handleTextToSpeech();
    } else {
      // Si no hay texto pero hay audio o video, reproducir/pausar media
      const media = audioRef.current || videoRef.current;
      if (media) {
        if (isPlaying) {
          media.pause();
        } else {
          media.play();
        }
        setIsPlaying(!isPlaying);
      }
    }
  };

  const handleTextToSpeech = () => {
    if (!text) return;

    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        // Detener si está hablando
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        // Cancelar cualquier síntesis anterior
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 0.9; // Velocidad ligeramente más lenta para niños
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert('Tu navegador no soporta la función de dictado por voz.');
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Si hay video, mostrar reproductor de video
  if (videoUrl) {
    return (
      <div className="media-player">
        <div className="media-player-video">
          <video
            ref={videoRef}
            src={videoUrl}
            className="media-video-element"
            onClick={togglePlay}
          />
          {!isPlaying && (
            <button className="media-play-overlay" onClick={togglePlay}>
              ▶
            </button>
          )}
        </div>
      </div>
    );
  }

  // Si hay audio o texto, mostrar reproductor de audio con botón de play
  // El botón siempre reproducirá el texto si está disponible
  if (audioUrl || text) {
    return (
      <div className="media-player">
        <div className="media-player-audio">
          <div className="audio-icon">🔊</div>
          <div className="audio-info">
            <h3>{title}</h3>
          </div>
          <div className="audio-controls">
            <button className="media-play-btn" onClick={togglePlay}>
              {isSpeaking ? '⏸' : '▶'}
            </button>
            {audioUrl && (
              <div className="audio-progress">
                <span className="audio-time">{formatTime(currentTime)}</span>
                <div className="audio-progress-bar">
                  <div 
                    className="audio-progress-fill" 
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <span className="audio-time">{formatTime(duration)}</span>
              </div>
            )}
          </div>
          {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}
        </div>
      </div>
    );
  }

  return null;
};


