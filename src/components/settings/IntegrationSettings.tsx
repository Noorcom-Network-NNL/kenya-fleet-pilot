import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Key, MapPin, Fuel, Wrench, Database } from 'lucide-react';
import { gpsTrackingService } from '@/services/gpsTrackingService';
import { useToast } from '@/hooks/use-toast';

export function IntegrationSettings() {
  const [googleMapsEnabled, setGoogleMapsEnabled] = useState(true);
  const [gpsTrackingEnabled, setGpsTrackingEnabled] = useState(true);
  const [googleApiKey, setGoogleApiKey] = useState('AIzaSyC***************');
  const [gpsEndpoint, setGpsEndpoint] = useState('wss://api.gpstrack.demo/v1/websocket');
  const [isConnecting, setIsConnecting] = useState(false);
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

  const saveIntegrationSettings = () => {
    // Save settings to localStorage or backend
    const settings = {
      googleMapsEnabled,
      gpsTrackingEnabled,
      googleApiKey,
      gpsEndpoint
    };
    
    localStorage.setItem('integrationSettings', JSON.stringify(settings));
    
    toast({
      title: "Settings Saved",
      description: "Integration settings have been saved successfully.",
    });
  };

  // Load settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('integrationSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setGoogleMapsEnabled(settings.googleMapsEnabled ?? true);
      setGpsTrackingEnabled(settings.gpsTrackingEnabled ?? true);
      setGoogleApiKey(settings.googleApiKey ?? 'AIzaSyC***************');
      setGpsEndpoint(settings.gpsEndpoint ?? 'wss://api.gpstrack.demo/v1/websocket');
    }
  }, []);

  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Fuel Management Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                Fuel Card Provider
                <Badge variant="secondary">Not Connected</Badge>
              </Label>
              <p className="text-sm text-gray-500">Automatic fuel transaction import</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                Fuel Price API
                <Badge variant="outline">Available</Badge>
              </Label>
              <p className="text-sm text-gray-500">Real-time fuel price updates</p>
            </div>
            <Switch />
          </div>
          
          <div className="ml-6 space-y-2">
            <Label htmlFor="fuel-api-key">API Key</Label>
            <div className="flex gap-2">
              <Input 
                id="fuel-api-key" 
                placeholder="Enter fuel price API key"
                className="font-mono"
              />
              <Button variant="outline">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Maintenance & Service Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                Service Provider Portal
                <Badge variant="secondary">Not Connected</Badge>
              </Label>
              <p className="text-sm text-gray-500">Auto-schedule maintenance appointments</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Parts Inventory System</Label>
              <p className="text-sm text-gray-500">Track spare parts and inventory</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Export & Backup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Data Backup</Label>
              <p className="text-sm text-gray-500">Daily backup to cloud storage</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Export to Excel/CSV</Label>
              <p className="text-sm text-gray-500">Enable data export functionality</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Third-party Analytics</Label>
              <p className="text-sm text-gray-500">Send data to external analytics platforms</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={testGpsConnection} disabled={isConnecting}>
          Test Connections
        </Button>
        <Button onClick={saveIntegrationSettings}>Save Integration Settings</Button>
      </div>
    </div>
  );
}
