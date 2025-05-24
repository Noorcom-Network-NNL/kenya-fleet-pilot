
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GoogleMap } from './GoogleMap';
import { MapPin, Play, Pause } from 'lucide-react';

interface PathPoint {
  position: [number, number];
  timestamp: string;
}

interface MapCardProps {
  currentPosition: [number, number] | undefined;
  tripRecord: any;
  gpsData: any;
  showPath: boolean;
  pathData: PathPoint[];
  isTracking: boolean;
  onShowPathToggle: () => void;
  onStartTracking: () => void;
  onStopTracking: () => void;
}

export function MapCard({ 
  currentPosition, 
  tripRecord, 
  gpsData, 
  showPath, 
  pathData, 
  isTracking,
  onShowPathToggle,
  onStartTracking,
  onStopTracking
}: MapCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Live Map (Google Maps)
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={showPath ? "default" : "outline"}
              size="sm"
              onClick={onShowPathToggle}
            >
              Show Path
            </Button>
            {isTracking ? (
              <Button size="sm" onClick={onStopTracking} className="bg-red-600 hover:bg-red-700">
                <Pause className="h-4 w-4 mr-1" />
                Stop Demo
              </Button>
            ) : (
              <Button size="sm" onClick={onStartTracking}>
                <Play className="h-4 w-4 mr-1" />
                Start Demo
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96 rounded-lg overflow-hidden">
          <GoogleMap
            position={currentPosition}
            vehicle={{
              regNumber: tripRecord.vehicleRegNumber,
              driver: tripRecord.driverName
            }}
            isMoving={gpsData?.speed ? gpsData.speed > 5 : false}
            showPath={showPath}
            pathData={pathData}
          />
        </div>
      </CardContent>
    </Card>
  );
}
