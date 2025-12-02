import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useLogin } from '../hooks/useLogin';
import './LoginForm.css';

// Esquema de validación con Yup
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required('El correo electrónico o usuario es requerido')
    .test(
      'email-format',
      'Por favor ingresa un correo electrónico válido (ej: usuario@ejemplo.com)',
      (value) => {
        if (!value) return false;
        // Valida que tenga @ y dominio válido
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      }
    ),
  password: Yup.string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { handleSubmit, isLoading, error, isSuccess } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  const onSubmit = async (values: LoginFormValues) => {
    await handleSubmit(values.email, values.password);
  };

  useEffect(() => {
    if (isSuccess && onLoginSuccess) {
      onLoginSuccess();
    }
  }, [isSuccess, onLoginSuccess]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <p className="start-free">COMENZAR GRATIS</p>
      <h1 className="sign-in-title">INICIAR SESIÓN</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={onSubmit}
      >
        {({ errors, touched, values, isSubmitting }) => (
          <Form className="login-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="input-group">
              <label htmlFor="email">Correo electrónico o usuario</label>
              <div className="input-wrapper">
                <i className="fas fa-envelope input-icon"></i>
                <Field
                  type="text"
                  id="email"
                  name="email"
                  placeholder="usuario@ejemplo.com"
                  className={
                    errors.email && (touched.email || values.email)
                      ? 'input-error'
                      : (touched.email || values.email) && !errors.email
                      ? 'input-valid'
                      : ''
                  }
                />
                {(touched.email || values.email) && errors.email && (
                  <i className="fas fa-exclamation-circle input-icon-error"></i>
                )}
                {(touched.email || values.email) && !errors.email && values.email && (
                  <i className="fas fa-check-circle input-icon-valid"></i>
                )}
              </div>
              {(touched.email || values.email) && errors.email && (
                <div className="error-text">{errors.email}</div>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="password">contraseña</label>
              <div className="input-wrapper">
                <i className="fas fa-globe input-icon"></i>
                <Field
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  className={
                    errors.password && (touched.password || values.password)
                      ? 'input-error'
                      : (touched.password || values.password) && !errors.password
                      ? 'input-valid'
                      : ''
                  }
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
                {(touched.password || values.password) && errors.password && (
                  <i className="fas fa-exclamation-circle input-icon-error"></i>
                )}
                {(touched.password || values.password) && !errors.password && values.password && (
                  <i className="fas fa-check-circle input-icon-valid"></i>
                )}
              </div>
              {(touched.password || values.password) && errors.password && (
                <div className="error-text">{errors.password}</div>
              )}
            </div>

            <div className="forgot-password-container">
              <a href="#" className="forgot-password-link">Recuperar contraseña</a>
            </div>

            <button
              type="submit"
              className="btn-login"
              disabled={isLoading || isSubmitting}
            >
              {isLoading || isSubmitting ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN'}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

