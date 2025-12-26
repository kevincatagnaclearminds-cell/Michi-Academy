export interface VideoQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  duration?: number;
  category: string;
  keyConcepts?: string[];
  quiz?: VideoQuizQuestion;
  createdAt?: string;
  updatedAt?: string;
}

export interface VideoCategory {
  name: string;
  videos: Video[];
}

export interface VideoUploadData {
  title: string;
  description?: string;
  file: File;
}

