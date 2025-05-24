
import React, { useState, useEffect } from 'react';
import { TrackingMap } from './TrackingMap';
import { VehicleDetails } from './VehicleDetails';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGPSTracking } from '@/hooks/useGPSTracking';
import { 
  Play, 
  Pause, 
  MapPin, 
  Clock, 
  Navigation, 
  Satellite,
  Fuel,
  Thermometer,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';

interface RealTimeTrackerProps {
  tripRecord: any;
  onClose: () => void;
}

export function RealTimeTracker({ tripRecord, onClose }: RealTimeTrackerProps) {
  const [showPath, setShowPath] = useState(true);
  
  // Generate device ID based on trip record
  const deviceId = `FMB920_${tripRecord.vehicleId || tripRecord.id}`;
  
  const { 
    gpsData, 
    isConnected, 
    isTracking, 
    pathHistory, 
    error,
    startTracking,
    stopTracking 
  } = useGPSTracking();

  // Convert GPS data to map format
  const currentPosition = gpsData ? [gpsData.latitude, gpsData.longitude] as [number, number] : undefined;
  const pathData = pathHistory.map(point => ({
    position: [point.latitude, point.longitude] as [number, number],
    timestamp: new Date(point.timestamp).toISOString()
  }));

  const handleStartTracking = () => {
    console.log('Starting GPS tracking for device:', deviceId);
    startTracking(deviceId);
  };

  const handleStopTracking = () => {
    console.log('Stopping GPS tracking for device:', deviceId);
    stopTracking();
  };

  // Auto-start tracking when component mounts
  useEffect(() => {
    if (isConnected && !isTracking) {
      console.log('Auto-starting GPS tracking on component mount');
      handleStartTracking();
    }

    // Cleanup on unmount
    return () => {
      if (isTracking) {
        handleStopTracking();
      }
    };
  }, [isConnected]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Real-Time Tracking</h3>
          <p className="text-sm text-gray-600">
            Vehicle: {tripRecord.vehicleRegNumber} | Driver: {tripRecord.driverName}
          </p>
          <p className="text-xs text-gray-500">Device ID: {deviceId}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
          <Badge className={isTracking ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
            {isTracking ? "Tracking" : "Stopped"}
          </Badge>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Live Map
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={showPath ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowPath(!showPath)}
                  >
                    Show Path
                  </Button>
                  {isTracking ? (
                    <Button size="sm" onClick={handleStopTracking} className="bg-red-600 hover:bg-red-700">
                      <Pause className="h-4 w-4 mr-1" />
                      Stop
                    </Button>
                  ) : (
                    <Button size="sm" onClick={handleStartTracking}>
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96 rounded-lg overflow-hidden">
                <TrackingMap
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
        </div>

        {/* Vehicle Status */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Vehicle Status
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
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Navigation className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    {isTracking ? "Waiting for GPS data..." : "Start tracking to view data"}
                  </p>
                  {isConnected && !isTracking && (
                    <Button size="sm" onClick={handleStartTracking} className="mt-2">
                      Start GPS Tracking
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Trip Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Route</span>
                <span className="text-sm font-medium">{tripRecord.startLocation} → {tripRecord.endLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Purpose</span>
                <Badge variant="outline">{tripRecord.purpose}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Started</span>
                <span className="text-sm font-medium">
                  {format(tripRecord.startTime, 'dd/MM/yyyy HH:mm')}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
