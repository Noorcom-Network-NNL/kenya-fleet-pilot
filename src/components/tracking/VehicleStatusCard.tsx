
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Navigation, 
  Satellite, 
  Zap, 
  Thermometer, 
  Fuel 
} from 'lucide-react';
import { format } from 'date-fns';
import { GPSData } from '@/services/gpsTrackingService';

interface VehicleStatusCardProps {
  gpsData: GPSData | null;
  isTracking: boolean;
  isConnected: boolean;
  deviceId: string;
  onStartTracking: () => void;
}

export function VehicleStatusCard({ 
  gpsData, 
  isTracking, 
  isConnected, 
  deviceId, 
  onStartTracking 
}: VehicleStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Vehicle Status (Demo Data)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {gpsData ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{gpsData.speed}</p>
                <p className="text-xs text-gray-500">km/h</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{gpsData.heading}°</p>
                <p className="text-xs text-gray-500">Heading</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ignition</span>
                <Badge className={gpsData.ignition ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {gpsData.ignition ? "ON" : "OFF"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <Satellite className="h-3 w-3" />
                  Satellites
                </span>
                <span className="text-sm font-medium">{gpsData.satellites}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Voltage
                </span>
                <span className="text-sm font-medium">{gpsData.voltage.toFixed(1)}V</span>
              </div>
              
              {gpsData.temperature && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Thermometer className="h-3 w-3" />
                    Temperature
                  </span>
                  <span className="text-sm font-medium">{gpsData.temperature.toFixed(1)}°C</span>
                </div>
              )}
              
              {gpsData.fuelLevel && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Fuel className="h-3 w-3" />
                    Fuel Level
                  </span>
                  <span className="text-sm font-medium">{gpsData.fuelLevel}%</span>
                </div>
              )}
            </div>
            
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500">
                Last Update: {format(new Date(gpsData.timestamp), 'HH:mm:ss')}
              </p>
              <p className="text-xs text-gray-500">
                Location: {gpsData.latitude.toFixed(6)}, {gpsData.longitude.toFixed(6)}
              </p>
              <p className="text-xs text-blue-500 font-medium">Demo Device: {deviceId}</p>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Navigation className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              {isTracking ? "Generating demo GPS data..." : "Click 'Start Demo' to begin simulation"}
            </p>
            {isConnected && !isTracking && (
              <Button size="sm" onClick={onStartTracking} className="mt-2">
                Start Demo Tracking
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
