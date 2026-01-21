export type UserLevel = 'primaria' | 'secundaria';

export interface User {
  id: string;
  email: string;
  username?: string;
  name?: string;
  level?: string; // El backend devuelve 'level' no 'nivel'
  nivel?: UserLevel; // Mantener para compatibilidad
  grade?: number;
  account_type?: string;
  active?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username?: string;
  nombre?: string;
  name?: string;
  level?: string; // 'elementary' | 'middle_school' | 'junior_high' | 'high_school' o 'primaria' | 'secundaria'
  grade?: number;
  account_type?: string; // 'student' | 'teacher' | 'admin'
  confirmPassword?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  refreshExpiresIn?: number;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
  timestamp: string;
}

export interface AuthError {
  message: string;
  code?: string;
}
