
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Fuel, ExternalLink } from 'lucide-react';

export function FuelManagementSettings() {
  return (
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
  );
}
