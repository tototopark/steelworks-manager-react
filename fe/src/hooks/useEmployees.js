"use client";

import { useState, useCallback } from 'react';
import apiClient from '../services/apiClient';

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [retiredEmployees, setRetiredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEmployees = useCallback(async (status = 'active') => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get(`/api/employees?status=${status}`);
      if (response.data && response.data.status === 'success') {
        if (status === 'active') {
          setEmployees(response.data.data || []);
        } else {
          setRetiredEmployees(response.data.data || []);
        }
      } else {
        setError('Failed to fetch employees.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load employees list.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEmployee = async (login, password, firstname, surname, role, rightLevel, bay = null, shopLabel = null) => {
    try {
      setError('');
      const response = await apiClient.post('/api/employees', {
        login,
        password,
        firstname,
        surname,
        role,
        right_level: parseInt(rightLevel),
        bay: bay ? parseInt(bay) : null,
        shop_label: shopLabel
      });
      return { success: true, message: response.data?.message || 'Employee registered successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to register employee.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const updateEmployee = async (empId, firstname, surname, role, rightLevel, bay = null, shopLabel = null) => {
    try {
      setError('');
      const response = await apiClient.put(`/api/employees/${empId}`, {
        firstname,
        surname,
        role,
        right_level: parseInt(rightLevel),
        bay: bay ? parseInt(bay) : null,
        shop_label: shopLabel
      });
      return { success: true, message: response.data?.message || 'Employee updated successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update employee.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const deleteEmployee = async (empId) => {
    try {
      setError('');
      const response = await apiClient.delete(`/api/employees/${empId}`);
      return { success: true, message: response.data?.message || 'Employee deactivated successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to deactivate employee.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const generateRandomPassword = async (empId) => {
    try {
      setError('');
      const response = await apiClient.post(`/api/employees/${empId}/random-password`);
      return { 
        success: true, 
        newPassword: response.data?.new_password, 
        message: response.data?.message || 'New password generated.' 
      };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to generate random password.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const uploadAvatar = async (empId, file) => {
    try {
      setError('');
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post(`/api/employees/${empId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return { 
        success: true, 
        avatarUrl: response.data?.avatar_url, 
        message: response.data?.message || 'Avatar uploaded successfully.' 
      };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to upload avatar.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  return {
    employees,
    retiredEmployees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    generateRandomPassword,
    uploadAvatar
  };
}
