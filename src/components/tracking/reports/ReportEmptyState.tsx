
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface ReportEmptyStateProps {
  hasRecords: boolean;
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function ReportEmptyState({ hasRecords, hasFilters, onClearFilters }: ReportEmptyStateProps) {
  if (!hasRecords) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">No trip records available</p>
        <p className="text-gray-500 text-sm">Start tracking trips to see reports and analytics</p>
      </div>
    );
  }

  if (hasFilters) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">No trip records match your current filters</p>
        <p className="text-gray-500 text-sm">Try adjusting your filter criteria or clearing all filters</p>
        <Button variant="outline" onClick={onClearFilters} className="mt-4">
          Clear All Filters
        </Button>
      </div>
    );
  }

  return null;
}
