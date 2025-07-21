
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
  
  // Use actual vehicle ID from trip record for Wialon tracking
  const vehicleDeviceId = tripRecord.vehicleId || tripRecord.vehicleRegNumber || 'FMB920_DEMO_001';
  
  const { 
    gpsData, 
    isConnected, 
    isTracking, 
    pathHistory, 
    error,
    startTracking,
    stopTracking 
  } = useGPSTracking(vehicleDeviceId);

  // Convert GPS data to map format
  const currentPosition = gpsData ? [gpsData.latitude, gpsData.longitude] as [number, number] : undefined;
  const pathData = pathHistory.map(point => ({
    position: [point.latitude, point.longitude] as [number, number],
    timestamp: new Date(point.timestamp).toISOString()
  }));

  const handleStartTracking = () => {
    console.log('Starting live Wialon tracking for vehicle:', vehicleDeviceId);
    startTracking(vehicleDeviceId);
  };

  const handleStopTracking = () => {
    console.log('Stopping live Wialon tracking for vehicle:', vehicleDeviceId);
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
      <DemoNotice deviceId={vehicleDeviceId} />

      <TrackingHeader 
        tripRecord={tripRecord}
        deviceId={vehicleDeviceId}
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
            deviceId={vehicleDeviceId}
            onStartTracking={handleStartTracking}
          />

          <TripInfoCard tripRecord={tripRecord} />
        </div>
      </div>
    </div>
  );
}
