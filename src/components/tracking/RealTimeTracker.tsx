
import React, { useState, useEffect } from 'react';
import { useGPSTracking } from '@/hooks/useGPSTracking';
import { DemoNotice } from './DemoNotice';
import { TrackingHeader } from './TrackingHeader';
import { MapCard } from './MapCard';
import { VehicleStatusCard } from './VehicleStatusCard';
import { TripInfoCard } from './TripInfoCard';

interface RealTimeTrackerProps {
  tripRecord: any;
  onClose: () => void;
}

export function RealTimeTracker({ tripRecord, onClose }: RealTimeTrackerProps) {
  const [showPath, setShowPath] = useState(true);
  
  // Use demo device ID for demonstration purposes
  const demoDeviceId = 'FMB920_DEMO_001';
  
  const { 
    gpsData, 
    isConnected, 
    isTracking, 
    pathHistory, 
    error,
    startTracking,
    stopTracking 
  } = useGPSTracking(demoDeviceId);

  // Convert GPS data to map format
  const currentPosition = gpsData ? [gpsData.latitude, gpsData.longitude] as [number, number] : undefined;
  const pathData = pathHistory.map(point => ({
    position: [point.latitude, point.longitude] as [number, number],
    timestamp: new Date(point.timestamp).toISOString()
  }));

  const handleStartTracking = () => {
    console.log('Starting GPS tracking for demo device:', demoDeviceId);
    startTracking(demoDeviceId);
  };

  const handleStopTracking = () => {
    console.log('Stopping GPS tracking for demo device:', demoDeviceId);
    stopTracking();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isTracking) {
        handleStopTracking();
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <DemoNotice deviceId={demoDeviceId} />

      <TrackingHeader 
        tripRecord={tripRecord}
        deviceId={demoDeviceId}
        isConnected={isConnected}
        isTracking={isTracking}
        onClose={onClose}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <MapCard
            currentPosition={currentPosition}
            tripRecord={tripRecord}
            gpsData={gpsData}
            showPath={showPath}
            pathData={pathData}
            isTracking={isTracking}
            onShowPathToggle={() => setShowPath(!showPath)}
            onStartTracking={handleStartTracking}
            onStopTracking={handleStopTracking}
          />
        </div>

        {/* Vehicle Status and Trip Info */}
        <div className="space-y-4">
          <VehicleStatusCard
            gpsData={gpsData}
            isTracking={isTracking}
            isConnected={isConnected}
            deviceId={demoDeviceId}
            onStartTracking={handleStartTracking}
          />

          <TripInfoCard tripRecord={tripRecord} />
        </div>
      </div>
    </div>
  );
}
