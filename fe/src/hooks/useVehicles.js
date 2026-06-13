"use client";

import { useState, useCallback } from 'react';
import apiClient from '../services/apiClient';

export function useVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [expiryAlerts, setExpiryAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get('/api/reminders/vehicles');
      if (response.data && response.data.status === 'success') {
        setVehicles(response.data.data || []);
      } else {
        setError('Failed to fetch vehicles.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load vehicles list.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchExpiryAlerts = useCallback(async () => {
    try {
      const response = await apiClient.get('/api/reminders/vehicles/expiry-check');
      if (response.data && response.data.status === 'success') {
        setExpiryAlerts(response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch vehicle expiry alerts', err);
    }
  }, []);

  const createVehicle = async (vehicleName, plate, wof = null, rego = null, service = null, ruc = null, currentOdo = null) => {
    try {
      setError('');
      const response = await apiClient.post('/api/reminders/vehicles', {
        vehicle: vehicleName,
        plate,
        wof,
        rego,
        service: service ? parseInt(service) : null,
        ruc: ruc ? parseInt(ruc) : null,
        current_odo: currentOdo ? parseInt(currentOdo) : null
      });
      return { success: true, message: response.data?.message || 'Vehicle registered successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to register vehicle.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const updateVehicle = async (vId, vehicleName, plate, wof = null, rego = null, service = null, ruc = null, currentOdo = null) => {
    try {
      setError('');
      const response = await apiClient.put(`/api/reminders/vehicles/${vId}`, {
        vehicle: vehicleName,
        plate,
        wof,
        rego,
        service: service ? parseInt(service) : null,
        ruc: ruc ? parseInt(ruc) : null,
        current_odo: currentOdo ? parseInt(currentOdo) : null
      });
      return { success: true, message: response.data?.message || 'Vehicle updated successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update vehicle.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const deleteVehicle = async (vId) => {
    try {
      setError('');
      const response = await apiClient.delete(`/api/reminders/vehicles/${vId}`);
      return { success: true, message: response.data?.message || 'Vehicle deleted successfully.' };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete vehicle.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  return {
    vehicles,
    expiryAlerts,
    loading,
    error,
    fetchVehicles,
    fetchExpiryAlerts,
    createVehicle,
    updateVehicle,
    deleteVehicle
  };
}
