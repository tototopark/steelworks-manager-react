"use client";

import { useState, useCallback } from 'react';
import apiClient from '../services/apiClient';

export function useQA() {
  const [qaJobs, setQaJobs] = useState([]);
  const [wipItems, setWipItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchQAJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get('/api/qa/jobs');
      if (response.data && response.data.status === 'success') {
        setQaJobs(response.data.data || []);
      } else {
        setError('Failed to fetch pending QA jobs.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load pending QA jobs.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWIPItems = useCallback(async (jobNumber) => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get(`/api/qa/wip/${jobNumber}`);
      if (response.data && response.data.status === 'success') {
        setWipItems(response.data.data || []);
      } else {
        setError('Failed to fetch WIP items.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load WIP items.');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitQAInspection = async (wipId, isPass, comment = '') => {
    try {
      setError('');
      const response = await apiClient.post('/api/qa/inspect', {
        wip_id: parseInt(wipId),
        is_pass: isPass,
        comment
      });
      return { success: true, message: response.data?.message || 'QA inspection result saved.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to save QA inspection result.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // WIP Complete 상태 조회 (legacy 41.php)
  const fetchWIPCompleteStatus = useCallback(async (jobNumber) => {
    try {
      const response = await apiClient.get(`/api/qa/wip-complete/${jobNumber}`);
      if (response.data?.status === 'success') {
        return {
          success: true,
          wip_completed: response.data.wip_completed,
          wip_completed_date: response.data.wip_completed_date
        };
      }
      return { success: false };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Failed to fetch WIP complete status.' };
    }
  }, []);

  // WIP Complete 토글 (legacy 41.php)
  const toggleWIPComplete = useCallback(async (jobNumber) => {
    try {
      const response = await apiClient.post(`/api/qa/wip-complete/${jobNumber}/toggle`);
      if (response.data?.status === 'success') {
        return {
          success: true,
          new_state: response.data.new_state,
          wip_completed_date: response.data.wip_completed_date,
          message: response.data.message
        };
      }
      return { success: false, message: 'Toggle failed' };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Failed to toggle WIP complete status.' };
    }
  }, []);

  return {
    qaJobs,
    wipItems,
    loading,
    error,
    fetchQAJobs,
    fetchWIPItems,
    submitQAInspection,
    fetchWIPCompleteStatus,
    toggleWIPComplete
  };
}
