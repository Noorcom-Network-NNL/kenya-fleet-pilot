
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Wrench } from 'lucide-react';

export function MaintenanceServiceSettings() {
  return (
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
  );
}
