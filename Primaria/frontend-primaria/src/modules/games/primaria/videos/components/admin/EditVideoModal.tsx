import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Video } from '../../types/video.types';
import './Modal.css';

interface EditVideoModalProps {
  video: Video | undefined;
  categoryName: string;
  onSave: (updatedVideo: Partial<Video>) => void;
  onClose: () => void;
}

export const EditVideoModal: React.FC<EditVideoModalProps> = ({
  video,
  categoryName,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(video?.title || '');
  const [description, setDescription] = useState(video?.description || '');
  const [url, setUrl] = useState(video?.url || '');
  const [keyConcepts, setKeyConcepts] = useState<string[]>(video?.keyConcepts || []);
  const [newConcept, setNewConcept] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [mounted, setMounted] = useState(false);

  const isNewVideo = !video;

  useEffect(() => {
    setMounted(true);
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleAddConcept = () => {
    if (newConcept.trim()) {
      setKeyConcepts([...keyConcepts, newConcept.trim()]);
      setNewConcept('');
    }
  };

  const handleRemoveConcept = (index: number) => {
    setKeyConcepts(keyConcepts.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedVideo: Partial<Video> = {
      title: title.trim(),
      description: description.trim() || undefined,
      url: url.trim(),
      keyConcepts: keyConcepts.length > 0 ? keyConcepts : undefined,
    };
    onSave(updatedVideo);
  };

  if (!mounted) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isNewVideo ? 'Nuevo Video' : 'Editar Video'}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="video-title">Título del video</label>
            <input
              id="video-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: ¿Qué es el dinero?"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="video-description">Descripción</label>
            <textarea
              id="video-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción del video..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="video-url">URL del video</label>
            <input
              id="video-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="URL de YouTube, YouTube Shorts, o ruta local"
              required
            />
            <small className="form-hint">
              Puedes usar: YouTube, YouTube Shorts, o ruta local (ej: /videos/video.mp4)
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="video-file">O subir nuevo video (reemplazará el actual)</label>
            <input
              id="video-file"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
            />
            {videoFile && (
              <small className="form-hint">Archivo seleccionado: {videoFile.name}</small>
            )}
          </div>

          <div className="form-group">
            <label>Conceptos Clave</label>
            <div className="concepts-input-group">
              <input
                type="text"
                value={newConcept}
                onChange={(e) => setNewConcept(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddConcept();
                  }
                }}
                placeholder="Agregar concepto importante..."
              />
              <button type="button" className="btn-add-concept" onClick={handleAddConcept}>
                <i className="fas fa-plus"></i> Agregar
              </button>
            </div>
            {keyConcepts.length > 0 && (
              <div className="concepts-list">
                {keyConcepts.map((concept, index) => (
                  <div key={index} className="concept-tag">
                    <span>{concept}</span>
                    <button
                      type="button"
                      className="remove-concept-btn"
                      onClick={() => handleRemoveConcept(index)}
                      aria-label="Eliminar concepto"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              {isNewVideo ? 'Crear Video' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

