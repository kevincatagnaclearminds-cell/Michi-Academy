import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useLogin } from "../hooks/useLogin";
import './LoginForm.css'

const loginSchema = Yup.object().shape({
    email: Yup.string()
        .required('El correo electrónico o usuario es requerido')
        .test(
            'email-format',
            'Por favor ingresa un correo electrónico válido (ej: usuario@ejemplo.com)',
            (value) => {
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
        password: ''
    }

    const onSubmit = async (values: LoginFormValues) => {
        await handleSubmit(values.email, values.password);
    }

    useEffect(() => {
        if(isSuccess && onLoginSuccess) {
            onLoginSuccess();
        }
    }, [isSuccess, onLoginSuccess]);

    const togglePasswordVisiBility = () => {
        setShowPassword(!showPassword);
    }
    
    return (
        <>
            <p className="start-free">Comienza tu futuro</p>
            <p className="sign-in-title">Inicia tu camino financiero</p>

            <Formik
                initialValues={initialValues}
                validationSchema={loginSchema}
                onSubmit={onSubmit}
            >
                {({ errors, touched, values, isSubmitting}) => (
                    <Form className="login-form">
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        <div className="input-group">
                            <label htmlFor="email">Correo electronico o usuario</label>
                            <div className="input-wrapper">
                                <i className=""></i>
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
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <div className="input-wrapper">
                                <i className=""></i>
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
                                    onClick={togglePasswordVisiBility}
                                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    <i className=""></i>
                                </button>
                            </div>
                        </div>

                        <div className="forgot-password-container">
                            <a href="#" className="forgot-password-link">¿Olvidaste tu Contraseña?</a>
                        </div>

                        <button
                            type="submit"
                            className="btn-login"
                            disabled={ isLoading || isSubmitting }
                        >
                            {isLoading || isSubmitting ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                        </button>
                    </Form>
                )}
            </Formik>
        </>
    );
}