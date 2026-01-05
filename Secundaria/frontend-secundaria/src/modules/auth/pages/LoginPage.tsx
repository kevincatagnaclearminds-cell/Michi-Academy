import React from 'react';
import './LoginPage.css';
import { LoginForm } from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
    const logoSrc = '/images/logo vector.png';
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        console.log('Login exitoso, redirigiendo...');
        navigate('/secundaria/activities');
    }

    return (
        <div className='login-page'>
            <div className="particles"></div>
            <div className="moss-texture"></div>
            <div className="character-reflection"></div>

            <header className='header'>
                <div className='logo'>
                    <img 
                        src={logoSrc} 
                        alt='Logo Michi Academy' 
                        className='logo-image'
                        onError={() => {
                            console.error('Error al cargar logo:', logoSrc);
                        }}
                    />
                </div>
            </header>

            <main className='main-container'>
                <div className='login-section'>
                    <div className='login-panel'>
                        <div className='login-image-section'>
                            <div className='image-container'>
                                <img 
                                    src="/images/login-illustration.png" 
                                    alt="Login illustration"
                                    className='login-illustration'
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const placeholder = target.nextElementSibling as HTMLElement;
                                        if(placeholder) {
                                            placeholder.style.display = 'flex';
                                        }
                                    }}
                                />
                                <div className='image-placeholder' style={{ display: 'none' }}>
                                    <i className=''></i>
                                    <p>Espacio para la imagen</p>
                                </div>
                            </div>
                        </div>
                        <div className='login-form-section'>
                            <div className='login-content'>
                                <LoginForm onLoginSuccess={handleLoginSuccess} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}