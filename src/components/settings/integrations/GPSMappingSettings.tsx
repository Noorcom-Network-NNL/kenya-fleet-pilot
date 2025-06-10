
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { MapPin, Key } from 'lucide-react';
import { gpsTrackingService } from '@/services/gpsTrackingService';
import { useToast } from '@/hooks/use-toast';

interface GPSMappingSettingsProps {
  googleMapsEnabled: boolean;
  setGoogleMapsEnabled: (enabled: boolean) => void;
  gpsTrackingEnabled: boolean;
  setGpsTrackingEnabled: (enabled: boolean) => void;
  googleApiKey: string;
  setGoogleApiKey: (key: string) => void;
  gpsEndpoint: string;
  setGpsEndpoint: (endpoint: string) => void;
  isConnecting: boolean;
  setIsConnecting: (connecting: boolean) => void;
}

export function GPSMappingSettings({
  googleMapsEnabled,
  setGoogleMapsEnabled,
  gpsTrackingEnabled,
  setGpsTrackingEnabled,
  googleApiKey,
  setGoogleApiKey,
  gpsEndpoint,
  setGpsEndpoint,
  isConnecting,
  setIsConnecting
}: GPSMappingSettingsProps) {
  const { toast } = useToast();

  const handleGpsTrackingToggle = async (enabled: boolean) => {
    setGpsTrackingEnabled(enabled);
    setIsConnecting(true);

    try {
      if (enabled) {
        // Connect to GPS tracking service
        gpsTrackingService.connect(gpsEndpoint);
        toast({
          title: "GPS Tracking Enabled",
          description: "Connected to GPS tracking service successfully.",
        });
      } else {
        // Disconnect from GPS tracking service
        gpsTrackingService.disconnect();
        toast({
          title: "GPS Tracking Disabled",
          description: "Disconnected from GPS tracking service.",
        });
      }
    } catch (error) {
      console.error('GPS tracking error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to GPS tracking service. Running in demo mode.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const testGpsConnection = async () => {
    setIsConnecting(true);
    try {
      gpsTrackingService.connect(gpsEndpoint);
      toast({
        title: "Connection Test",
        description: "GPS tracking service connection test completed.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to GPS tracking service.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          GPS & Mapping Services
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              Google Maps API
              <Badge variant={googleMapsEnabled ? "default" : "secondary"}>
                {googleMapsEnabled ? "Connected" : "Disconnected"}
              </Badge>
            </Label>
            <p className="text-sm text-gray-500">Real-time tracking and route optimization</p>
          </div>
          <Switch 
            checked={googleMapsEnabled}
            onCheckedChange={setGoogleMapsEnabled}
          />
        </div>
        
        {googleMapsEnabled && (
          <div className="ml-6 space-y-2">
            <Label htmlFor="google-api-key">API Key</Label>
            <div className="flex gap-2">
              <Input 
                id="google-api-key" 
                type="password" 
                value={googleApiKey}
                onChange={(e) => setGoogleApiKey(e.target.value)}
                className="font-mono"
              />
              <Button variant="outline" size="icon">
                <Key className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              GPS Tracking Service
              <Badge variant={gpsTrackingEnabled ? "default" : "outline"}>
                {gpsTrackingEnabled ? "Demo Mode" : "Disabled"}
              </Badge>
            </Label>
            <p className="text-sm text-gray-500">Real-time vehicle location tracking</p>
          </div>
          <Switch 
            checked={gpsTrackingEnabled}
            onCheckedChange={handleGpsTrackingToggle}
            disabled={isConnecting}
          />
        </div>
        
        {gpsTrackingEnabled && (
          <div className="ml-6 space-y-2">
            <Label htmlFor="gps-endpoint">Service Endpoint</Label>
            <div className="flex gap-2">
              <Input 
                id="gps-endpoint" 
                value={gpsEndpoint}
                onChange={(e) => setGpsEndpoint(e.target.value)}
                className="font-mono"
              />
              <Button 
                variant="outline" 
                onClick={testGpsConnection}
                disabled={isConnecting}
              >
                Test
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
