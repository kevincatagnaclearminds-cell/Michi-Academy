export interface FabulaQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Fabula {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
  videoUrl?: string; // URL de video de YouTube
  coverImage?: string;
  duration?: number; // en segundos
  category: string;
  moral: string; // La moraleja de la fábula
  characters: string[]; // Personajes principales
  keyConcepts?: string[]; // Conceptos clave de educación financiera
  quiz?: FabulaQuizQuestion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FabulaCategory {
  name: string;
  description: string;
  fabulas: Fabula[];
  icon?: string;
}



