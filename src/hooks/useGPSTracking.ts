
import { useState, useEffect, useCallback } from 'react';
import { gpsTrackingService } from '@/services/gpsTrackingService';
import { telematicsService } from '@/services/telematicsService';
import { GPSData } from '@/types/gps';

export function useGPSTracking(vehicleId?: string) {
  const [gpsData, setGpsData] = useState<GPSData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [pathHistory, setPathHistory] = useState<GPSData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Start tracking a specific vehicle
  const startTracking = useCallback(async (deviceId: string) => {
    try {
      console.log('Starting live Wialon tracking for device:', deviceId);
      setIsTracking(true);
      setError(null);
      
      // Check if telematics (Wialon) is configured
      const telematicsStatus = telematicsService.getStatus();
      
      if (telematicsStatus.enabled && telematicsStatus.configured) {
        console.log('Using Wialon telematics for live tracking');
        
        // Subscribe to GPS updates for this device
        gpsTrackingService.subscribeToDevice(deviceId, (data: GPSData) => {
          console.log('Received live Wialon GPS data:', data);
          setGpsData(data);
          setPathHistory(prev => [...prev.slice(-50), data]); // Keep last 50 points
          setIsConnected(true);
        });

        // Get initial position from Wialon
        const vehicleData = await telematicsService.getVehicleData([deviceId]);
        if (vehicleData.length > 0) {
          const initialData = vehicleData[0];
          const gpsData: GPSData = {
            deviceId: initialData.deviceId,
            timestamp: initialData.timestamp,
            latitude: initialData.latitude,
            longitude: initialData.longitude,
            altitude: 0,
            speed: initialData.speed,
            heading: initialData.heading,
            satellites: 8,
            hdop: 1.0,
            ignition: initialData.engineStatus,
            voltage: 12.0,
            fuelLevel: initialData.fuelLevel,
            temperature: initialData.temperature
          };
          setGpsData(gpsData);
          setPathHistory([gpsData]);
          console.log('Set initial Wialon position:', gpsData);
        }
        
      } else {
        console.log('Wialon not configured, using demo simulation');
        setError('Wialon integration not configured. Please configure it in Settings -> Integrations.');
        
        // Fallback to simulation for demo
        gpsTrackingService.subscribeToDevice(deviceId, (data: GPSData) => {
          console.log('Received demo GPS data:', data);
          setGpsData(data);
          setPathHistory(prev => [...prev.slice(-50), data]);
        });
        
        const cleanup = gpsTrackingService.simulateGPSData(deviceId);
        return cleanup;
      }
      
    } catch (err) {
      console.error('GPS tracking error:', err);
      setError('Failed to start live tracking from Wialon');
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
    const integrationSettings = settings ? JSON.parse(settings) : { 
      gpsTrackingEnabled: true,
      telematicsEnabled: false 
    };
    
    // Configure telematics service if enabled
    if (integrationSettings.telematicsEnabled) {
      telematicsService.configure({
        provider: integrationSettings.telematicsProvider || 'safaricom',
        apiKey: integrationSettings.telematicsApiKey || '',
        endpoint: integrationSettings.telematicsEndpoint || '',
        enabled: true
      });
      console.log('Telematics service configured');
    }
    
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
