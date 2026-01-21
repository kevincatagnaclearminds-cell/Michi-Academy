import { useState } from 'react';
import { authService } from '../services/authService';
import { UserLevel } from '../../types/auth.types';

export const useLogin = (level: UserLevel = 'primaria') => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    setIsSuccess(false);

    try {
      await authService.login(email, password, level);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error al iniciar sesión');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    isLoading,
    error,
    isSuccess,
  };
};
