"use client";

import { useState, useCallback } from 'react';
import apiClient from '../services/apiClient';

export function useActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchActivity = useCallback(async (limit = 100) => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get(`/api/activity?limit=${limit}`);
      if (response.data && response.data.status === 'success') {
        setActivities(response.data.data || []);
      } else {
        setError('Failed to fetch activity logs.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load activity logs.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    activities,
    loading,
    error,
    fetchActivity
  };
}
