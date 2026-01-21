import React from 'react';
import { Video } from '../types/video.types';
import './VideoConcepts.css';

interface VideoConceptsProps {
  video: Video;
}

export const VideoConcepts: React.FC<VideoConceptsProps> = ({ video }) => {
  if (!video) {
    return (
      <div className="video-concepts">
        <div className="concepts-header">
          <i className="fas fa-lightbulb concepts-icon"></i>
          <h3>Conceptos Importantes</h3>
        </div>
        <div className="no-concepts">
          <p>No hay video seleccionado</p>
        </div>
      </div>
    );
  }

  // Asegurar que keyConcepts existe y es un array
  const concepts = Array.isArray(video.keyConcepts) ? video.keyConcepts : [];

  return (
    <div className="video-concepts">
      <div className="concepts-header">
        <i className="fas fa-lightbulb concepts-icon"></i>
        <h3>Conceptos Importantes</h3>
      </div>
      {concepts.length > 0 ? (
        <ul className="concepts-list">
          {concepts.map((concept, index) => (
            <li key={index} className="concept-item">
              <div className="concept-item-content">
                <i className="fas fa-check-circle concept-check"></i>
                <span className="concept-text">{concept}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-concepts">
          <p>No hay conceptos disponibles para este video</p>
        </div>
      )}
    </div>
  );
};

