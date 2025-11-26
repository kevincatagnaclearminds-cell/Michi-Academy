// Tipos relacionados con autenticación

// Credenciales de login que el usuario ingresa
export interface LoginCredentials {
  email: string; // Email o username del usuario
  password: string; // Contraseña del usuario
}

// Respuesta del servidor después de un login exitoso
export interface AuthResponse {
  token: string; // Token JWT para autenticación
  user: User; // Información del usuario autenticado
  refreshToken?: string; // Token para refrescar la sesión (opcional)
}

// Datos del usuario autenticado
export interface User {
  id: string; // ID único del usuario
  email: string; // Email del usuario
  username?: string; // Nombre de usuario (opcional)
  name?: string; // Nombre completo (opcional)
  avatar?: string; // URL del avatar (opcional)
}

// Estado de autenticación en la aplicación
export interface AuthState {
  isAuthenticated: boolean; // Si el usuario está autenticado
  user: User | null; // Usuario actual o null si no hay sesión
  token: string | null; // Token de autenticación o null
  isLoading: boolean; // Si se está cargando alguna operación de auth
}
