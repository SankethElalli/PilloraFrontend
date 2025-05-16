import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';
import API_BASE_URL from '../api';

function CustomerRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/customers/register`, formData);
      navigate('/customer-login');
    } catch (error) {
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <div className="auth-box">
            <div className="text-center mb-4">
              <i className="bi bi-person-circle display-4 text-primary"></i>
              <h2 className="mt-3">Create Customer Account</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="row g-3">
                <div className="col-12">
                  <div className="form-floating">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <label>Full Name</label>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-floating">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <label>Email Address</label>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-floating">
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    <label>Phone Number</label>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-floating">
                    <textarea
                      name="address"
                      className="form-control"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      style={{ height: '100px' }}
                    />
                    <label>Address</label>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-floating">
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <label>Password</label>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-floating">
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <label>Confirm Password</label>
                  </div>
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-primary w-100 py-3">
                    Create Account
                  </button>
                </div>

                <div className="col-12 text-center">
                  <p className="mb-0">
                    Already have an account? <Link to="/customer-login" className="text-primary text-decoration-none">Login here</Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerRegister;
