import React, { useState, useRef, useEffect } from 'react';
import { Fabula } from '../types/fabula.types';
import './AudioPlayer.css';

interface AudioPlayerProps {
  fabula: Fabula;
  onComplete?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ fabula, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) onComplete();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onComplete]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="audio-player">
      <div className="audio-player-cover">
        {fabula.coverImage ? (
          <img src={fabula.coverImage} alt={fabula.title} />
        ) : (
          <div className="audio-player-placeholder">
            <span className="audio-icon">📖</span>
          </div>
        )}
      </div>

      <div className="audio-player-info">
        <h3 className="audio-player-title">{fabula.title}</h3>
        <p className="audio-player-description">{fabula.description}</p>
      </div>

      <div className="audio-player-controls">
        <button 
          className="audio-player-play-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>

        <div className="audio-player-progress">
          <span className="audio-player-time">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="audio-player-slider"
          />
          <span className="audio-player-time">{formatTime(duration)}</span>
        </div>

        <div className="audio-player-volume">
          <span className="volume-icon">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="audio-player-volume-slider"
          />
        </div>
      </div>

      <audio ref={audioRef} src={fabula.audioUrl} preload="metadata" />

      {fabula.characters && fabula.characters.length > 0 && (
        <div className="audio-player-characters">
          <span className="characters-label">Personajes:</span>
          <div className="characters-list">
            {fabula.characters.map((character, index) => (
              <span key={index} className="character-tag">
                {character}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};






