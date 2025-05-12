import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';
import API_BASE_URL from '../api';

function VendorRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    licenseNumber: '',
    gstin: ''
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
      await axios.post(`${API_BASE_URL}/api/vendors/register`, formData);
      navigate('/vendor-login');
    } catch (error) {
    }
  };

  return (
    <div className="auth-bg">
      {/* Desktop View */}
      <div className="auth-card d-none d-md-block">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="auth-card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="mb-4">Register as a Vendor</h3>
                  <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                      <label className="form-label">Business Name</label>
                      <input
                        type="text"
                        name="businessName"
                        className="form-control"
                        placeholder="Enter business name"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Business Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Enter business email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Business Address</label>
                      <textarea
                        name="address"
                        className="form-control"
                        placeholder="Enter business address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">License Number</label>
                          <input
                            type="text"
                            name="licenseNumber"
                            className="form-control"
                            placeholder="Enter license number"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">GSTIN</label>
                          <input
                            type="text"
                            name="gstin"
                            className="form-control"
                            placeholder="Enter GSTIN"
                            value={formData.gstin}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mb-3">
                      Register
                    </button>

                    <p className="mb-0">
                      Already have an account? <Link to="/vendor-login" className="auth-link">Login here</Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="mobile-auth-card d-md-none">
        <div className="login-logo mb-4">
          <i className="bi bi-capsule fs-1 text-primary"></i>
        </div>
        <h3>Register as Vendor</h3>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Business Name</label>
            <input
              type="text"
              name="businessName"
              className="form-control"
              placeholder="Enter business name"
              value={formData.businessName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Business Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter business email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group"></div>
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Business Address</label>
            <textarea
              name="address"
              className="form-control"
              placeholder="Enter business address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">License Number</label>
            <input
              type="text"
              name="licenseNumber"
              className="form-control"
              placeholder="Enter license number"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">GSTIN</label>
            <input
              type="text"
              name="gstin"
              className="form-control"
              placeholder="Enter GSTIN"
              value={formData.gstin}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Register
          </button>

          <p className="text-center mb-0"></p>
            Already have an account? <Link to="/vendor-login" className="auth-link">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default VendorRegister;
