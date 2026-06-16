"use client";

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';

export function useWhiteboard() {
  const [tasksData, setTasksData] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async (date = '', buffer = 3) => {
    try {
      setLoading(true);
      setError('');
      const url = date ? `/api/tasks/active?date=${date}&buffer=${buffer}` : '/api/tasks/active';
      const response = await apiClient.get(url);
      if (response.data && response.data.status === 'success') {
        setTasksData(response.data.data || []);
      } else {
        setError('Failed to fetch active tasks.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while fetching whiteboard tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await apiClient.get('/api/employees');
      if (response.data && response.data.status === 'success') {
        setEmployeesData(response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch employees list', err);
    }
  }, []);

  const createTask = async (employeeId, site, taskInstruction) => {
    try {
      setError('');
      const response = await apiClient.post('/api/tasks', {
        employee_id: parseInt(employeeId),
        site,
        task_instruction: taskInstruction,
      });
      return { success: true, message: response.data?.message || 'Task created successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to create task.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const updateTask = async (taskId, employeeId, site, taskInstruction) => {
    try {
      setError('');
      const response = await apiClient.put(`/api/tasks/${taskId}`, {
        employee_id: parseInt(employeeId),
        site,
        task_instruction: taskInstruction,
      });
      return { success: true, message: response.data?.message || 'Task updated successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update task.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setError('');
      const response = await apiClient.delete(`/api/tasks/${taskId}`);
      return { success: true, message: response.data?.message || 'Task deleted successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete task.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    tasksData,
    employeesData,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
