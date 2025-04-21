import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api'; // <-- Import the shared API base URL

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Changed to true initially

  // Check for existing token and user data on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = JSON.parse(localStorage.getItem('user'));
    
    if (token && savedUser) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password, isVendor = false) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    setIsLoading(true);
    try {
      // Use different endpoints for vendor and customer login
      const endpoint = isVendor ? 
        `${API_BASE_URL}/api/vendors/login` : 
        `${API_BASE_URL}/api/customers/login`;

      const response = await axios.post(endpoint, { email, password });

      const { user, token } = response.data;
      
      if (!user || !token) {
        throw new Error('Invalid credentials');
      }

      // Store auth data with user type
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        ...user,
        isVendor
      }));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({...user, isVendor});

    } catch (error) {
      console.error('Login error details:', error.response?.data || error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/';  // Changed from customer-login to root
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
