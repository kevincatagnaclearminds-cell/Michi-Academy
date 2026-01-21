export interface Question {
  id: string;
  videoId?: string;
  question: string;
  options: string[];
  correctAnswer: number; // índice de la respuesta correcta
  explanation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Quiz {
  id: string;
  videoId?: string;
  title: string;
  questions: Question[];
  createdAt?: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: QuizAnswer[];
}

export interface QuestionFormData {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  videoId?: string;
}

