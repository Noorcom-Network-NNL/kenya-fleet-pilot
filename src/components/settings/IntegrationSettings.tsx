
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Key, MapPin, Fuel, Wrench, Database } from 'lucide-react';

export function IntegrationSettings() {
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
                <Badge variant="default">Connected</Badge>
              </Label>
              <p className="text-sm text-gray-500">Real-time tracking and route optimization</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="ml-6 space-y-2">
            <Label htmlFor="google-api-key">API Key</Label>
            <div className="flex gap-2">
              <Input 
                id="google-api-key" 
                type="password" 
                defaultValue="AIzaSyC***************" 
                className="font-mono"
              />
              <Button variant="outline" size="icon">
                <Key className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                GPS Tracking Service
                <Badge variant="outline">Demo Mode</Badge>
              </Label>
              <p className="text-sm text-gray-500">Real-time vehicle location tracking</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="ml-6 space-y-2">
            <Label htmlFor="gps-endpoint">Service Endpoint</Label>
            <Input 
              id="gps-endpoint" 
              defaultValue="wss://api.gpstrack.demo/v1/websocket"
              className="font-mono"
            />
          </div>
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
        <Button variant="outline">Test Connections</Button>
        <Button>Save Integration Settings</Button>
      </div>
    </div>
  );
}
