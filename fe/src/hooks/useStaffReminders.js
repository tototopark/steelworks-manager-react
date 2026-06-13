"use client";

import { useState, useCallback } from 'react';
import apiClient from '../services/apiClient';

export function useStaffReminders() {
  const [staffAlerts, setStaffAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStaffExpiryAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get('/api/reminders/staff/expiry-check');
      if (response.data && response.data.status === 'success') {
        setStaffAlerts(response.data.data || []);
      } else {
        setError('Failed to fetch staff safety card alerts.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load staff reminders.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    staffAlerts,
    loading,
    error,
    fetchStaffExpiryAlerts
  };
}
