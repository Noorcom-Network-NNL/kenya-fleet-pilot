
import { useState, useEffect, useCallback } from 'react';
import { gpsTrackingService, GPSData } from '@/services/gpsTrackingService';

export function useGPSTracking(vehicleId?: string) {
  const [gpsData, setGpsData] = useState<GPSData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [pathHistory, setPathHistory] = useState<GPSData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Start tracking a specific vehicle
  const startTracking = useCallback((deviceId: string) => {
    try {
      setIsTracking(true);
      setError(null);
      
      // Subscribe to GPS updates for this device
      gpsTrackingService.subscribeToDevice(deviceId, (data: GPSData) => {
        setGpsData(data);
        setPathHistory(prev => [...prev.slice(-50), data]); // Keep last 50 points
      });

      // For demo purposes, simulate GPS data
      // Remove this in production when connected to real GPS server
      const cleanup = gpsTrackingService.simulateGPSData(deviceId);
      
      return cleanup;
    } catch (err) {
      setError('Failed to start GPS tracking');
      setIsTracking(false);
      console.error('GPS tracking error:', err);
    }
  }, []);

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (vehicleId) {
      gpsTrackingService.unsubscribeFromDevice(vehicleId);
    }
    setIsTracking(false);
    setGpsData(null);
    setPathHistory([]);
  }, [vehicleId]);

  // Get historical GPS data
  const getHistoricalData = useCallback(async (deviceId: string, startTime: Date, endTime: Date) => {
    try {
      const historicalData = await gpsTrackingService.getHistoricalData(deviceId, startTime, endTime);
      setPathHistory(historicalData);
      return historicalData;
    } catch (err) {
      setError('Failed to fetch historical GPS data');
      console.error('Historical GPS data error:', err);
      return [];
    }
  }, []);

  // Initialize connection on mount
  useEffect(() => {
    // Connect to GPS tracking server
    gpsTrackingService.connect();
    setIsConnected(true);

    return () => {
      gpsTrackingService.disconnect();
      setIsConnected(false);
    };
  }, []);

  // Auto-start tracking if vehicleId is provided
  useEffect(() => {
    if (vehicleId && isConnected) {
      const cleanup = startTracking(vehicleId);
      return cleanup;
    }
  }, [vehicleId, isConnected, startTracking]);

  return {
    gpsData,
    isConnected,
    isTracking,
    pathHistory,
    error,
    startTracking,
    stopTracking,
    getHistoricalData
  };
}
