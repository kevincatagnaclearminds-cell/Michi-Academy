import { useState, useEffect } from 'react';
import { Video } from '../types/video.types';
import { mockVideos } from '../data/mockVideos';

export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implementar llamada a API cuando esté lista
      // const response = await apiService.get<Video[]>('/api/videos');
      // setVideos(response);
      
      // Por ahora usar data quemada
      setVideos(mockVideos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar videos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return {
    videos,
    isLoading,
    error,
    refetch: fetchVideos,
  };
};

