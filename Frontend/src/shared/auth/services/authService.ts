import { LoginResponse, User, LoginCredentials, RegisterCredentials, UserLevel, ApiResponse, getFrontendType } from '../../types/auth.types';
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
          
          // Determinar el tipo de frontend según level y account_type
          const frontendType = getFrontendType(loginData.user);
          localStorage.setItem('frontendType', frontendType);
          
          // Guardar datos adicionales del usuario
          if (loginData.user.level) {
            localStorage.setItem('userLevel', loginData.user.level);
          }
          if (loginData.user.grade) {
            localStorage.setItem('userGrade', String(loginData.user.grade));
          }
          if (loginData.user.account_type) {
            localStorage.setItem('accountType', loginData.user.account_type);
          }
          
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
          
          // Determinar el tipo de frontend según level y account_type
          const frontendType = getFrontendType(registerData.user);
          localStorage.setItem('frontendType', frontendType);
          
          // Guardar datos adicionales del usuario
          if (registerData.user.level) {
            localStorage.setItem('userLevel', registerData.user.level);
          }
          if (registerData.user.grade) {
            localStorage.setItem('userGrade', String(registerData.user.grade));
          }
          if (registerData.user.account_type) {
            localStorage.setItem('accountType', registerData.user.account_type);
          }
          
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
      localStorage.removeItem('userGrade');
      localStorage.removeItem('accountType');
      localStorage.removeItem('frontendType');
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

  getFrontendType(): 'primaria' | 'secundaria' | 'admin' | null {
    const frontendType = localStorage.getItem('frontendType');
    return (frontendType === 'primaria' || frontendType === 'secundaria' || frontendType === 'admin') 
      ? frontendType 
      : null;
  }

  getUserGrade(): number | null {
    const grade = localStorage.getItem('userGrade');
    return grade ? parseInt(grade, 10) : null;
  }

  getAccountType(): string | null {
    return localStorage.getItem('accountType');
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
