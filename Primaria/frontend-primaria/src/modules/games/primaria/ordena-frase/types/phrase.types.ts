export interface PhraseGame {
  id: string;
  title: string;
  phrase: string; // Frase completa que debe ordenarse
  audioUrl?: string; // URL del audio (recomendado)
  videoUrl?: string; // URL del video (opcional)
  category: string;
  difficulty: 'facil' | 'medio' | 'dificil';
  hint?: string; // Pista opcional
  createdAt?: string;
  updatedAt?: string;
}

export interface PhraseResult {
  isCorrect: boolean;
  attempts: number;
  timeSpent: number; // en segundos
  points: number;
}




