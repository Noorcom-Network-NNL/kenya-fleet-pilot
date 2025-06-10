
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Database } from 'lucide-react';

export function DataExportSettings() {
  return (
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
  );
}
