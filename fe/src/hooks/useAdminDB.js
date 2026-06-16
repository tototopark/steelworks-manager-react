"use client";

import { useState, useCallback } from 'react';
import apiClient from '../services/apiClient';

export function useAdminDB() {
  const [tables, setTables] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get('/api/admin/db_inspect/tables');
      if (response.data && response.data.status === 'success') {
        // Map the table objects to table_name strings
        const tableNames = (response.data.data || []).map(t => t.table_name);
        setTables(tableNames);
      } else {
        setError('Failed to fetch database tables.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while fetching tables.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTableData = useCallback(async (tableName, limit = 10, offset = 0, sortOrder = 'desc') => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get(
        `/api/admin/db_inspect/${tableName}?limit=${limit}&offset=${offset}&sort_order=${sortOrder}`
      );
      if (response.data && response.data.status === 'success') {
        setTableData(response.data.data || []);
        setTotalCount(response.data.total_count || response.data.data?.length || 0);
      } else {
        setError(`Failed to fetch data for table ${tableName}.`);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while fetching table records.');
    } finally {
      setLoading(false);
    }
  }, []);

  const runIntegrityCheck = async (fix = false) => {
    try {
      setError('');
      const response = await apiClient.post('/api/admin/db_integrity', { fix });
      return { 
        success: response.data?.status === 'success', 
        message: response.data?.message || 'Integrity check completed.',
        details: response.data?.details || response.data
      };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to complete database integrity check.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const seedDatabase = async () => {
    try {
      setError('');
      const response = await apiClient.post('/api/admin/db_seed');
      return { success: response.data?.status === 'success', message: response.data?.message || 'Database seeded.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to seed database.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const cleanDatabase = async () => {
    try {
      setError('');
      const response = await apiClient.post('/api/admin/clean-data');
      return { success: response.data?.status === 'success', message: response.data?.message || 'Database cleaned.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to clean database.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const resetAllPasswords = async () => {
    try {
      setError('');
      const response = await apiClient.post('/api/admin/reset_passwords');
      return { success: response.data?.status === 'success', message: response.data?.message || 'Passwords reset.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to reset passwords.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const resetAllPasswordsHashed = async () => {
    try {
      setError('');
      const response = await apiClient.post('/api/admin/reset_passwords_hashed');
      return { success: response.data?.status === 'success', message: response.data?.message || 'Passwords reset.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to reset passwords.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const migrateLegacyData = async () => {
    try {
      setError('');
      const response = await apiClient.post('/api/admin/migrate_legacy');
      return { success: response.data?.status === 'success', message: response.data?.message || 'Migration completed.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to migrate legacy data.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const randomizeNames = async () => {
    try {
      setError('');
      const response = await apiClient.post('/api/admin/randomize_names');
      return { success: response.data?.status === 'success', message: response.data?.message || 'Names randomized.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to randomize names.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  return {
    tables,
    tableData,
    totalCount,
    loading,
    error,
    fetchTables,
    fetchTableData,
    runIntegrityCheck,
    seedDatabase,
    cleanDatabase,
    resetAllPasswords,
    resetAllPasswordsHashed,
    migrateLegacyData,
    randomizeNames
  };
}
