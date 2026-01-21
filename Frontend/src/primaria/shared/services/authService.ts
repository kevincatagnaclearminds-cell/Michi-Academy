import { LoginResponse, User, LoginCredentials, RegisterCredentials } from '../types/auth.types';
import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const credentials: LoginCredentials = { email, password };
      const response = await apiService.post<LoginResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      
      // Guardar token en localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(email: string, password: string, nombre?: string): Promise<LoginResponse> {
    try {
      const credentials: RegisterCredentials = {
        email,
        password,
        nombre: nombre || email.split('@')[0],
      };
      
      const response = await apiService.post<LoginResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        credentials
      );
      
      // Guardar token en localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  async fetchCurrentUser(): Promise<User | null> {
    try {
      const response = await apiService.get<{ user: User }>(
        API_CONFIG.ENDPOINTS.AUTH.ME
      );
      return response.user;
    } catch (error) {
      // Si falla, limpiar el token
      this.logout();
      return null;
    }
  }
}

export const authService = new AuthService();
