
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TrackingHeaderProps {
  tripRecord: any;
  deviceId: string;
  isConnected: boolean;
  isTracking: boolean;
  onClose: () => void;
}

export function TrackingHeader({ 
  tripRecord, 
  deviceId, 
  isConnected, 
  isTracking, 
  onClose 
}: TrackingHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">Real-Time Tracking</h3>
        <p className="text-sm text-gray-600">
          Vehicle: {tripRecord.vehicleRegNumber} | Driver: {tripRecord.driverName}
        </p>
        <p className="text-xs text-gray-500">Demo Device ID: {deviceId}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>
        <Badge className={isTracking ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
          {isTracking ? "Demo Tracking" : "Stopped"}
        </Badge>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
