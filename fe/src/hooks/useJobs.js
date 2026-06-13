"use client";

import { useState, useCallback } from 'react';
import apiClient from '../services/apiClient';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [currentJobDetails, setCurrentJobDetails] = useState([]);
  const [currentJobPhotos, setCurrentJobPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchJobs = useCallback(async (status = 'active', limit = 50, offset = 0) => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get(`/api/jobs?status=${status}&limit=${limit}&offset=${offset}`);
      if (response.data && response.data.status === 'success') {
        setJobs(response.data.data || []);
      } else {
        setError('Failed to fetch jobs.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load jobs list.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJobDetails = useCallback(async (jobNumber) => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get(`/api/jobs/${jobNumber}/details`);
      if (response.data && response.data.status === 'success') {
        setCurrentJobDetails(response.data.data || []);
      } else {
        setError('Failed to fetch job details.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load job details.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createJob = async (jobNumber, companyName, siteAddress, otherData = {}) => {
    try {
      setError('');
      const response = await apiClient.post('/api/jobs', {
        job_number: parseInt(jobNumber),
        company_name: companyName,
        site_address: siteAddress,
        ...otherData
      });
      return { success: true, message: response.data?.message || 'Job created successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to create job.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const updateJob = async (jobNumber, companyName, siteAddress) => {
    try {
      setError('');
      const response = await apiClient.put(`/api/jobs/${jobNumber}`, {
        company_name: companyName,
        site_address: siteAddress
      });
      return { success: true, message: response.data?.message || 'Job updated successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update job.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const deleteJob = async (jobNumber) => {
    try {
      setError('');
      const response = await apiClient.delete(`/api/jobs/${jobNumber}`);
      return { success: true, message: response.data?.message || 'Job deleted successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete job.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const ingestJob = async (jobNumber, companyName, siteAddress, rawExcelData) => {
    try {
      setError('');
      const response = await apiClient.post('/api/jobs/ingest', {
        job_number: parseInt(jobNumber),
        company_name: companyName,
        site_address: siteAddress,
        raw_excel_data: rawExcelData
      });
      return { success: true, message: response.data?.message || 'Excel data ingested successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to ingest Excel data.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const fetchJobPhotos = useCallback(async (jobNumber) => {
    try {
      const response = await apiClient.get(`/api/jobs/${jobNumber}/photos`);
      if (response.data && response.data.status === 'success') {
        setCurrentJobPhotos(response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch job photos', err);
    }
  }, []);

  const uploadJobPhoto = async (jobNumber, file) => {
    try {
      setError('');
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post(`/api/jobs/${jobNumber}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return { success: true, photoName: response.data?.photo_name, message: response.data?.message || 'File uploaded successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to upload photo.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const [jobInstallDates, setJobInstallDates] = useState([]);

  const fetchJobInstallDates = useCallback(async (jobNumber) => {
    try {
      const response = await apiClient.get(`/api/jobs/${jobNumber}/install-dates`);
      if (response.data && response.data.status === 'success') {
        setJobInstallDates(response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch job install dates', err);
    }
  }, []);

  const updateJobInstallDate = async (jobNumber, lot, dateInstall, statusInstall) => {
    try {
      setError('');
      const response = await apiClient.put(`/api/jobs/${jobNumber}/install-dates/${lot}`, {
        date_install: dateInstall || null,
        status_install: statusInstall
      });
      fetchJobInstallDates(jobNumber);
      return { success: true, message: response.data?.message || 'Install date updated successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update install date.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const deleteJobInstallDate = async (jobNumber, lot) => {
    try {
      setError('');
      const response = await apiClient.delete(`/api/jobs/${jobNumber}/install-dates/${lot}`);
      fetchJobInstallDates(jobNumber);
      return { success: true, message: response.data?.message || 'Install date deleted successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete install date.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  return {
    jobs,
    currentJobDetails,
    currentJobPhotos,
    jobInstallDates,
    loading,
    error,
    fetchJobs,
    fetchJobDetails,
    createJob,
    updateJob,
    deleteJob,
    ingestJob,
    fetchJobPhotos,
    uploadJobPhoto,
    fetchJobInstallDates,
    updateJobInstallDate,
    deleteJobInstallDate
  };
}

