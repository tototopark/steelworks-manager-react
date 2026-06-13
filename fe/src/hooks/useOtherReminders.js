"use client";

import { useState, useCallback } from 'react';
import apiClient from '../services/apiClient';

export function useOtherReminders() {
  const [reminders, setReminders] = useState([]);
  const [expiryAlerts, setExpiryAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/api/reminders/others');
      if (res.data?.status === 'success') {
        setReminders(res.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load other reminders');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchExpiryAlerts = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/reminders/others/expiry-check');
      if (res.data?.status === 'success') {
        setExpiryAlerts(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch other reminder expiry alerts', err);
    }
  }, []);

  const createReminder = useCallback(async (name, comment, expiry_date) => {
    try {
      const res = await apiClient.post('/api/reminders/others', {
        name,
        comment: comment || null,
        expiry_date: expiry_date || null
      });
      if (res.data?.status === 'success') {
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data?.message || 'Unknown error' };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Failed to create reminder' };
    }
  }, []);

  const updateReminder = useCallback(async (id, name, comment, expiry_date) => {
    try {
      const res = await apiClient.put(`/api/reminders/others/${id}`, {
        name,
        comment: comment || null,
        expiry_date: expiry_date || null
      });
      if (res.data?.status === 'success') {
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data?.message || 'Unknown error' };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Failed to update reminder' };
    }
  }, []);

  const deleteReminder = useCallback(async (id) => {
    try {
      const res = await apiClient.delete(`/api/reminders/others/${id}`);
      if (res.data?.status === 'success') {
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data?.message || 'Unknown error' };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Failed to delete reminder' };
    }
  }, []);

  return {
    reminders,
    expiryAlerts,
    loading,
    error,
    fetchReminders,
    fetchExpiryAlerts,
    createReminder,
    updateReminder,
    deleteReminder
  };
}
