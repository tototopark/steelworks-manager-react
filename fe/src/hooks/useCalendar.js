"use client";

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';

export function useCalendar() {
  const [scheduleData, setScheduleData] = useState(null);
  const [employeesData, setEmployeesData] = useState([]);
  const [holidaysData, setHolidaysData] = useState([]);
  const [jobOptions, setJobOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSchedule = useCallback(async (startDate, endDate) => {
    try {
      setLoading(true);
      setError('');
      
      // Load schedule, employees, and holidays in parallel
      const [scheduleRes, employeesRes, holidaysRes] = await Promise.all([
        apiClient.get(`/api/schedule/weekly?start_date=${startDate}&end_date=${endDate}`),
        apiClient.get('/api/employees'),
        apiClient.get('/api/holidays')
      ]);

      if (scheduleRes.data && scheduleRes.data.status !== 'error') {
        setScheduleData(scheduleRes.data.data || scheduleRes.data);
      } else {
        setError('Failed to fetch schedule data.');
      }

      if (employeesRes.data && employeesRes.data.status === 'success') {
        setEmployeesData(employeesRes.data.data || []);
      }
      if (holidaysRes.data && holidaysRes.data.status === 'success') {
        setHolidaysData(holidaysRes.data.data || []);
      }

    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while fetching the schedule.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJobOptions = useCallback(async () => {
    try {
      const response = await apiClient.get('/api/schedule/job-options');
      if (response.data) {
        setJobOptions(response.data.data || response.data);
      }
    } catch (err) {
      console.error('Failed to fetch job options', err);
    }
  }, []);

  const updateNote = async (date, note, note2 = '') => {
    try {
      setError('');
      const response = await apiClient.post('/api/schedule/notes', {
        date,
        note,
        note2
      });
      return { success: true, message: response.data?.message || 'Note updated successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update note.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const assignPlan = async (date, employeeId, jobNumber, lot, priority) => {
    try {
      setError('');
      const response = await apiClient.post('/api/schedule/plan', {
        date,
        employee_id: parseInt(employeeId),
        job_number: parseInt(jobNumber),
        lot: parseInt(lot),
        priority: parseInt(priority)
      });
      return { success: true, message: response.data?.message || 'Plan assigned successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to assign plan.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  useEffect(() => {
    fetchJobOptions();
  }, [fetchJobOptions]);

  return {
    scheduleData,
    employeesData,
    holidaysData,
    jobOptions,
    loading,
    error,
    fetchSchedule,
    updateNote,
    assignPlan,
  };
}
