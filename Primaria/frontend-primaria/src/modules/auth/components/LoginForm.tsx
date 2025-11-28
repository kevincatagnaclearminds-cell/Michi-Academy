import React, { useState, FormEvent } from 'react';
import { useLogin } from '../hooks/useLogin';
import './LoginForm.css';

export const LoginForm: React.FC = () => {
  const { handleSubmit, isLoading, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSubmit(email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <p className="start-free">START FOR FREE</p>
      <h1 className="sign-in-title">SIGN IN</h1>
      <p className="account-question">
        Don't have an Account? <a href="#" className="create-link">Create Account</a>
      </p>

      <form className="login-form" onSubmit={onSubmit}>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="input-group">
          <label htmlFor="email">Email or Username</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="email"
              name="email"
              placeholder="vivek_sharma_hotmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <i className="fas fa-envelope input-icon"></i>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="password">password</label>
          <div className="input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i className="fas fa-lock input-icon"></i>
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        <button type="submit" className="btn-login" disabled={isLoading}>
          {isLoading ? 'LOGGING IN...' : 'LOGIN'}
        </button>
      </form>
    </>
  );
};

