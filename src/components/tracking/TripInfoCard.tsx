
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TripInfoCardProps {
  tripRecord: any;
}

export function TripInfoCard({ tripRecord }: TripInfoCardProps) {
  return (
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
  );
}
