/**
 * Obtiene el ID de video de YouTube desde diferentes formatos de URL
 */
export const getYouTubeVideoId = (url: string): string | null => {
  // YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) {
    return shortsMatch[1];
  }

  // YouTube normal: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) {
    return watchMatch[1];
  }

  // YouTube short URL: https://youtu.be/VIDEO_ID
  const youtuBeMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (youtuBeMatch) {
    return youtuBeMatch[1];
  }

  return null;
};

/**
 * Obtiene el thumbnail de YouTube para un video
 */
export const getYouTubeThumbnail = (url: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'medium'): string | null => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  const qualityMap = {
    default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
    medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
  };

  return qualityMap[quality];
};

/**
 * Verifica si una URL es de YouTube
 */
export const isYouTubeUrl = (url: string): boolean => {
  return /youtube\.com|youtu\.be/.test(url);
};

