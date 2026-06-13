import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Synchronize authentication state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    }
  }, []);

  // Login operation
  const login = async (username, password) => {
    try {
      // In our FastAPI backend, auth accepts Form-data / JSON depending on login route
      const response = await apiClient.post('/api/auth/login', {
        login: username,
        password,
      });

      if (response.data && response.data.status === 'require_change') {
        return {
          success: false,
          requireChange: true,
          tempToken: response.data.temp_token,
          message: response.data.message || 'Default password (12345678) detected. Password change is required.'
        };
      }

      if (response.data && response.data.token) {
        const userData = response.data.user || { firstname: username, surname: '', login: username, right_level: response.data.right_level };
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      const errMsg = error.response?.data?.detail || 'Authentication failed';
      return { success: false, message: errMsg };
    }
  };

  // Change Password operation (for initial password change)
  const changePassword = async (tempToken, newPassword) => {
    try {
      const response = await apiClient.post('/api/auth/change_password', {
        temp_token: tempToken,
        new_password: newPassword
      });

      if (response.data && response.data.status === 'success' && response.data.token) {
        const username = response.data.login || 'user';
        const userData = { firstname: username, surname: '', login: username, right_level: response.data.right_level };
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      const errMsg = error.response?.data?.detail || 'Failed to change password';
      return { success: false, message: errMsg };
    }
  };

  // Logout operation
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return {
    user,
    loading,
    login,
    changePassword,
    logout,
    isAuthenticated: !!user,
  };
}

