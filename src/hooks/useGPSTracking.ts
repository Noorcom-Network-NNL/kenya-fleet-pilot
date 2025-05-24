
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
      console.log('Starting tracking for device:', deviceId);
      setIsTracking(true);
      setError(null);
      
      // Subscribe to GPS updates for this device
      gpsTrackingService.subscribeToDevice(deviceId, (data: GPSData) => {
        console.log('Received GPS data in hook:', data);
        setGpsData(data);
        setPathHistory(prev => [...prev.slice(-50), data]); // Keep last 50 points
      });

      // For demo purposes, simulate GPS data
      const cleanup = gpsTrackingService.simulateGPSData(deviceId);
      
      return cleanup;
    } catch (err) {
      console.error('GPS tracking error:', err);
      setError('Failed to start GPS tracking');
      setIsTracking(false);
    }
  }, []);

  // Stop tracking
  const stopTracking = useCallback(() => {
    console.log('Stopping tracking');
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
    console.log('Initializing GPS tracking service connection');
    
    // Check if GPS tracking is enabled in settings
    const settings = localStorage.getItem('integrationSettings');
    const integrationSettings = settings ? JSON.parse(settings) : { gpsTrackingEnabled: true };
    
    if (integrationSettings.gpsTrackingEnabled) {
      // Connect to GPS tracking server using saved endpoint
      const endpoint = integrationSettings.gpsEndpoint || 'wss://api.gpstrack.demo/v1/websocket';
      gpsTrackingService.connect(endpoint);
      setIsConnected(true);
    } else {
      console.log('GPS tracking disabled in settings');
      setIsConnected(false);
    }

    return () => {
      console.log('Cleaning up GPS tracking service connection');
      gpsTrackingService.disconnect();
      setIsConnected(false);
    };
  }, []);

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
