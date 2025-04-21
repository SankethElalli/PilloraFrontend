import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../api';

function VendorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email.trim() || !password.trim()) {
        toast.error('Please enter both email and password');
        return;
      }
      
      // Ensure email is lowercased for backend consistency
      await login(email.trim().toLowerCase(), password.trim(), true);
      toast.success('Login successful');
      navigate('/vendor-dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="container">
        <div className="row min-vh-100 align-items-center justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-sm mx-auto">
              <div className="card-body p-4">
                <h3 className="text-center mb-4">Vendor Login</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="Business Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input 
                        type="password" 
                        className="form-control" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 mb-3" disabled={isLoading}>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                  <div className="text-center">
                    <p className="mt-3 mb-0">
                      New vendor? <Link to="/vendor-register" className="text-decoration-none">Register here</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorLogin;
