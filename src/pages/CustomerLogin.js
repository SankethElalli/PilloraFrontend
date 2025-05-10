import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';
import '../styles/Notification.css';

function CustomerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email.trim() || !password.trim()) {
        setSnackbarText('Please enter email and password');
        setShowSnackbar(true);
        setTimeout(() => setShowSnackbar(false), 2000);
        return;
      }
      await login(email.trim(), password.trim());
      navigate('/');
    } catch (error) {
      setSnackbarText('Login failed. Please check your credentials.');
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 2000);
    }
  };

  return (
    <div>
      {/* Snackbar notification */}
      <div
        className={`pillora-snackbar${showSnackbar ? ' show' : ''}`}
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)' }}
      >
        <i className="bi bi-exclamation-triangle me-2"></i>
        {snackbarText}
      </div>
      <div className="auth-bg d-flex align-items-center justify-content-center min-vh-100">
        {/* Desktop card */}
        <div className="auth-card login-wide-card shadow-lg rounded-4 p-0 d-none d-md-flex">
          <div className="row g-0 flex-md-row flex-column w-100">
            <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center login-side-visual">
              {/* Illustration or branding section for desktop */}
              <div className="w-100 text-center px-4">
                <i className="bi bi-person-circle text-primary" style={{ fontSize: '5rem' }}></i>
                <h2 className="fw-bold mt-3 mb-2">Customer Login</h2>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4 d-md-none">
                  <div className="login-logo mb-3">
                    <i className="bi bi-person-circle text-primary" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h3 className="mb-2 fw-bold">Customer Login</h3>
                  <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>Welcome back! Please login to your account.</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <input 
                      type="email" 
                      className="form-control"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="mb-4 position-relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ paddingRight: "2.5rem" }}
                    />
                    <button
                      type="button"
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y px-2"
                      style={{ textDecoration: "none", color: "#64748b" }}
                      tabIndex={-1}
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </button>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 mb-3" disabled={isLoading}>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                  <div className="text-center">
                    <p className="mt-3 mb-0">
                      New customer? <Link to="/customer-register" className="text-decoration-none fw-semibold">Register here</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile card */}
        <div className="mobile-auth-card d-md-none">
          <div className="login-logo mb-3">
            <i className="bi bi-person-circle text-primary" style={{ fontSize: '3rem' }}></i>
          </div>
          <h3 className="mb-2 fw-bold text-center">Customer Login</h3>
          <p className="text-muted mb-4 text-center" style={{ fontSize: '1rem' }}>
            Welcome back! Please login to your account.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                className="form-control"
                placeholder="Email address"
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4 position-relative">
              <input
                className="form-control"
                placeholder="Password"
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                className="btn btn-link position-absolute top-50 end-0 translate-middle-y px-2"
                tabIndex={-1}
                style={{ textDecoration: 'none', color: '#64748b' }}
                onClick={() => setShowPassword(v => !v)}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3" disabled={isLoading}>
              <i className="bi bi-box-arrow-in-right me-2"></i>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <div className="text-center">
              <p className="mt-3 mb-0">
                New customer? <a className="auth-link" href="/customer-register">Register here</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomerLogin;
