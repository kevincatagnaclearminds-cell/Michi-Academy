import { useState } from 'react';
import { authService } from '../../../shared/services/authService';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    setIsSuccess(false);

    try {
      await authService.login(email, password);
      setIsSuccess(true);
      // Redirect or handle success (you can add navigation here)
      // Example: navigate('/dashboard');
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
