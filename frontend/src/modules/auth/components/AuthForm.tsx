import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface AuthFormProps {
  onSubmit: (credentials: { email: string; password: string }) => void | Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

// Esquema de validación con Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .required('Email o usuario es requerido')
    .trim()
    .min(3, 'Debe tener al menos 3 caracteres')
    .max(100, 'No puede tener más de 100 caracteres')
    .test(
      'has-at-symbol',
      'El email debe contener un símbolo @',
      (value) => value ? value.includes('@') : false
    )
    .test(
      'valid-email-format',
      'El formato del email no es válido (ejemplo: usuario@dominio.com)',
      (value) => {
        if (!value || !value.includes('@')) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      }
    )
    .test(
      'no-spaces',
      'El email no puede contener espacios',
      (value) => value ? !value.includes(' ') : false
    ),
  password: Yup.string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(50, 'La contraseña no puede tener más de 50 caracteres')
    .test(
      'no-leading-trailing-spaces',
      'La contraseña no puede tener espacios al inicio o final',
      (value) => value ? value === value.trim() : false
    ),
});

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, isLoading = false, error = null }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const initialValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values: { email: string; password: string }) => {
    await onSubmit({ 
      email: values.email.trim(), 
      password: values.password 
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="login-form">
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <div className="input-wrapper">
              <Field
                type="text"
                id="email"
                name="email"
                placeholder="usuario@ejemplo.com"
                disabled={isLoading || isSubmitting}
                autoComplete="username"
                className={errors.email && touched.email ? 'input-error' : ''}
              />
              <i className="fas fa-envelope input-icon"></i>
            </div>
            <ErrorMessage name="email" component="div" className="field-error" />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña </label>
            <div className="input-wrapper">
              <Field
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Ingrese su contraseña"
                disabled={isLoading || isSubmitting}
                autoComplete="current-password"
                className={errors.password && touched.password ? 'input-error' : ''}
              />
              <i className="fas fa-lock input-icon"></i>
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
              </button>
            </div>
            <ErrorMessage name="password" component="div" className="field-error" />
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-login" 
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default AuthForm;
