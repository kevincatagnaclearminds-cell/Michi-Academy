import { LoginResponse, User, LoginCredentials, RegisterCredentials, UserLevel, ApiResponse } from '../../types/auth.types';
import { apiService } from '../../services/api.service';
import { API_CONFIG } from '../../config/api.config';

class AuthService {
  async login(email: string, password: string, level: UserLevel = 'primaria'): Promise<LoginResponse> {
    try {
      const credentials: LoginCredentials = { email, password };
      
      // El backend usa una sola ruta /login que determina el nivel desde el usuario en la BD
      const response = await apiService.post<ApiResponse<LoginResponse>>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      
      // El backend devuelve { status, message, data: { user, accessToken, ... } }
      if (response.data) {
        const loginData = response.data;
        
        // Guardar token en localStorage
        if (loginData.accessToken) {
          localStorage.setItem('token', loginData.accessToken);
          localStorage.setItem('user', JSON.stringify(loginData.user));
          
          // Guardar el nivel del usuario desde la respuesta del backend
          // El backend devuelve 'level', mapear a 'primaria'/'secundaria' si es necesario
          const backendLevel = loginData.user.level || loginData.user.nivel;
          const userLevel = backendLevel === 'primaria' || backendLevel === 'secundaria' 
            ? backendLevel 
            : (backendLevel?.includes('elementary') || backendLevel?.includes('middle') ? 'primaria' : 'secundaria') || level;
          localStorage.setItem('userLevel', userLevel);
          
          // Guardar refresh token si existe
          if (loginData.refreshToken) {
            localStorage.setItem('refreshToken', loginData.refreshToken);
          }
        }
        
        return loginData;
      }
      
      throw new Error('Respuesta inválida del servidor');
    } catch (error) {
      throw error;
    }
  }

  async register(email: string, password: string, level: UserLevel = 'primaria', nombre?: string, grade?: number, account_type?: string): Promise<LoginResponse> {
    try {
      // Mapear 'primaria'/'secundaria' a los valores que espera el backend si es necesario
      // Por ahora asumimos que el backend acepta 'primaria' y 'secundaria' directamente
      const credentials: RegisterCredentials = {
        email,
        password,
        level: level, // El backend espera 'level' en el registro
        grade,
        account_type: account_type || 'student',
      };
      
      const response = await apiService.post<ApiResponse<LoginResponse>>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        credentials
      );
      
      // El backend devuelve { status, message, data: { user, accessToken, ... } }
      if (response.data) {
        const registerData = response.data;
        
        // Guardar token en localStorage
        if (registerData.accessToken) {
          localStorage.setItem('token', registerData.accessToken);
          localStorage.setItem('user', JSON.stringify(registerData.user));
          
          // Guardar el nivel del usuario desde la respuesta del backend
          const backendLevel = registerData.user.level || registerData.user.nivel;
          const userLevel = backendLevel === 'primaria' || backendLevel === 'secundaria' 
            ? backendLevel 
            : (backendLevel?.includes('elementary') || backendLevel?.includes('middle') ? 'primaria' : 'secundaria') || level;
          localStorage.setItem('userLevel', userLevel);
          
          if (registerData.refreshToken) {
            localStorage.setItem('refreshToken', registerData.refreshToken);
          }
        }
        
        return registerData;
      }
      
      throw new Error('Respuesta inválida del servidor');
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Intentar hacer logout en el backend si hay token
      const token = localStorage.getItem('token');
      if (token) {
        await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
      }
    } catch (error) {
      // Si falla, continuar con el logout local
      console.error('Error al hacer logout en el servidor:', error);
    } finally {
      // Siempre limpiar el localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userLevel');
      localStorage.removeItem('refreshToken');
    }
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  getUserLevel(): UserLevel | null {
    const level = localStorage.getItem('userLevel');
    return (level === 'primaria' || level === 'secundaria') ? level : null;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  async fetchCurrentUser(): Promise<User | null> {
    try {
      const response = await apiService.get<ApiResponse<{ user: User }>>(
        API_CONFIG.ENDPOINTS.AUTH.ME
      );
      
      if (response.data && response.data.user) {
        return response.data.user;
      }
      
      return null;
    } catch (error) {
      // Si falla, limpiar el token
      this.logout();
      return null;
    }
  }
}

export const authService = new AuthService();
