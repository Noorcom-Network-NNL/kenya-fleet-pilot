
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, FileText } from 'lucide-react';

interface ReportSummaryProps {
  filteredCount: number;
  totalCount: number;
  filteredRecords: any[];
  onExportCSV: () => void;
  onExportPDF: () => void;
}

export function ReportSummary({
  filteredCount,
  totalCount,
  filteredRecords,
  onExportCSV,
  onExportPDF
}: ReportSummaryProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          Showing {filteredCount} of {totalCount} trip records
        </p>
        {filteredRecords.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">
              Total Distance: {filteredRecords.reduce((sum, trip) => sum + (trip.distance || 0), 0).toFixed(1)} km
            </Badge>
            <Badge variant="outline">
              Total Cost: KES {filteredRecords.reduce((sum, trip) => sum + (trip.fuelCost || 0), 0).toFixed(2)}
            </Badge>
            <Badge variant="outline">
              Ongoing: {filteredRecords.filter(trip => trip.status === 'ongoing').length}
            </Badge>
            <Badge variant="outline">
              Completed: {filteredRecords.filter(trip => trip.status === 'completed').length}
            </Badge>
          </div>
        )}
      </div>

      {/* Export Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExportCSV}
          disabled={filteredRecords.length === 0}
          className="flex items-center gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export CSV
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExportPDF}
          disabled={filteredRecords.length === 0}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Export PDF
        </Button>
      </div>
    </div>
  );
}
