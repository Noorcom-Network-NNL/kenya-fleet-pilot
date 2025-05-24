
import React from 'react';
import { Info } from 'lucide-react';

interface DemoNoticeProps {
  deviceId: string;
}

export function DemoNotice({ deviceId }: DemoNoticeProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
      <div className="flex items-center gap-2">
        <Info className="h-4 w-4 text-blue-600" />
        <p className="text-sm text-blue-800">
          <strong>Demo Mode:</strong> This is a demonstration using simulated GPS data from device {deviceId}
        </p>
      </div>
    </div>
  );
}
