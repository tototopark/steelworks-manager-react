"use client";

import { useState, useCallback } from 'react';
import apiClient from '../services/apiClient';

export function useHolidays() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHolidays = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get('/api/holidays');
      if (response.data && response.data.status === 'success') {
        setHolidays(response.data.data || []);
      } else {
        setError('Failed to fetch holidays.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load holidays.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createHoliday = async (name, dateStart, dateStop) => {
    try {
      setError('');
      const response = await apiClient.post('/api/holidays', {
        name,
        date_start: dateStart,
        date_stop: dateStop
      });
      return { success: true, message: response.data?.message || 'Holiday added successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to add holiday.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const deleteHoliday = async (id) => {
    try {
      setError('');
      const response = await apiClient.delete(`/api/holidays/${id}`);
      return { success: true, message: response.data?.message || 'Holiday deleted successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete holiday.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  return {
    holidays,
    loading,
    error,
    fetchHolidays,
    createHoliday,
    deleteHoliday
  };
}
