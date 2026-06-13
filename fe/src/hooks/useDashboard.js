"use client";

import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

export function useDashboard() {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJobProgress = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get('/api/dashboard/job_progress?limit=100');
      if (response.data && response.data.status === 'success') {
        setProgressData(response.data.data || response.data);
      } else {
        setError('Failed to fetch job progress data.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while fetching dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobProgress();
  }, []);

  return {
    progressData,
    loading,
    error,
    refresh: fetchJobProgress,
  };
}
