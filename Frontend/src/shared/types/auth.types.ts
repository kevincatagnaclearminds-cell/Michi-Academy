// Tipos del backend
export type BackendLevel = 'elementary' | 'middle_school' | 'junior_high' | 'high_school';
export type AccountType = 'student' | 'teacher' | 'admin';
export type FrontendType = 'primaria' | 'secundaria' | 'admin';

// Tipo para compatibilidad con frontend
export type UserLevel = 'primaria' | 'secundaria';

export interface User {
  id: string;
  email: string;
  username?: string;
  name?: string;
  level?: BackendLevel | string; // El backend devuelve 'level' del enum
  nivel?: UserLevel; // Mantener para compatibilidad
  grade?: number | null;
  account_type?: AccountType | string | null;
  active?: boolean;
}

/**
 * Determina el tipo de frontend según el level y account_type del usuario
 * Reglas:
 * - elementary/middle_school + student → primaria
 * - junior_high/high_school + student → secundaria
 * - admin (cualquier level) → admin
 * - teacher → según su level (primaria/secundaria)
 */
export function getFrontendType(user: User): FrontendType {
  const accountType = (user.account_type || 'student').toLowerCase();
  const level = (user.level || '').toLowerCase();

  // Admin siempre va a admin
  if (accountType === 'admin') {
    return 'admin';
  }

  // Para estudiantes y profesores, determinar según level
  if (level === 'elementary' || level === 'middle_school') {
    return 'primaria';
  }

  if (level === 'junior_high' || level === 'high_school') {
    return 'secundaria';
  }

  // Fallback: si no se puede determinar, usar nivel del frontend antiguo
  if (user.nivel === 'primaria' || user.nivel === 'secundaria') {
    return user.nivel;
  }

  // Por defecto, primaria
  return 'primaria';
}

/**
 * Obtiene la ruta de redirección después del login según el usuario
 */
export function getLoginRedirectPath(user: User): string {
  const frontendType = getFrontendType(user);
  
  switch (frontendType) {
    case 'admin':
      return '/admin/dashboard';
    case 'secundaria':
      return '/secundaria/activities';
    case 'primaria':
    default:
      return '/primaria/activities';
  }
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
