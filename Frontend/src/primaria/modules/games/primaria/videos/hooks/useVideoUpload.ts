import { useState } from 'react';
import { VideoUploadData } from '../types/video.types';

export const useVideoUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const uploadVideo = async (data: VideoUploadData) => {
    setIsUploading(true);
    setError(null);
    setIsSuccess(false);

    try {
      // TODO: Implementar subida de video
      // const formData = new FormData();
      // formData.append('title', data.title);
      // formData.append('description', data.description || '');
      // formData.append('file', data.file);
      // await apiService.post('/api/videos/upload', formData);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir video');
      setIsSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadVideo,
    isUploading,
    error,
    isSuccess,
  };
};

