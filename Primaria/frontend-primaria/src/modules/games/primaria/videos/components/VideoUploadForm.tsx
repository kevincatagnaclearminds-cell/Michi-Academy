import React, { useState } from 'react';
import { useVideoUpload } from '../hooks/useVideoUpload';
import './VideoUploadForm.css';

export const VideoUploadForm: React.FC = () => {
  const { uploadVideo, isUploading, error, isSuccess } = useVideoUpload();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      return;
    }
    await uploadVideo({ title, description, file });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <form className="video-upload-form" onSubmit={handleSubmit}>
      <h2>Subir Nuevo Video</h2>
      
      {error && <div className="error-message">{error}</div>}
      {isSuccess && <div className="success-message">Video subido exitosamente</div>}

      <div className="form-group">
        <label htmlFor="title">Título del Video</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción (opcional)</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div className="form-group">
        <label htmlFor="file">Archivo de Video</label>
        <input
          type="file"
          id="file"
          accept="video/*"
          onChange={handleFileChange}
          required
        />
      </div>

      <button type="submit" disabled={isUploading}>
        {isUploading ? 'Subiendo...' : 'Subir Video'}
      </button>
    </form>
  );
};

