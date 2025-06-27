
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ReportFilters } from './reports/ReportFilters';
import { ReportSummary } from './reports/ReportSummary';
import { ReportEmptyState } from './reports/ReportEmptyState';
import { useReportFilters } from './reports/useReportFilters';
import { exportToCSV, exportToPDF } from './reports/exportUtils';

interface TrackingReportsProps {
  tripRecords: any[];
}

export function TrackingReports({ tripRecords }: TrackingReportsProps) {
  const {
    dateFrom,
    dateTo,
    selectedVehicle,
    selectedDriver,
    selectedStatus,
    selectedPurpose,
    filterOptions,
    filteredRecords,
    hasActiveFilters,
    setDateFrom,
    setDateTo,
    setSelectedVehicle,
    setSelectedDriver,
    setSelectedStatus,
    setSelectedPurpose,
    clearFilters
  } = useReportFilters(tripRecords);

  console.log('TrackingReports - tripRecords:', tripRecords);
  console.log('Filter options:', filterOptions);
  console.log('Filtered records count:', filteredRecords.length);

  const handleExportCSV = () => {
    exportToCSV(filteredRecords);
  };

  const handleExportPDF = () => {
    const activeFilters = [];
    if (dateFrom) activeFilters.push(`From: ${format(dateFrom, 'PPP')}`);
    if (dateTo) activeFilters.push(`To: ${format(dateTo, 'PPP')}`);
    if (selectedVehicle !== 'all') activeFilters.push(`Vehicle: ${selectedVehicle}`);
    if (selectedDriver !== 'all') activeFilters.push(`Driver: ${selectedDriver}`);
    if (selectedStatus !== 'all') activeFilters.push(`Status: ${selectedStatus}`);
    if (selectedPurpose !== 'all') activeFilters.push(`Purpose: ${selectedPurpose}`);

    exportToPDF(filteredRecords, activeFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Trip Reports & Analytics
        </CardTitle>
        <CardDescription>
          Filter and export detailed trip records for analysis and reporting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters Section */}
        <ReportFilters
          dateFrom={dateFrom}
          dateTo={dateTo}
          selectedVehicle={selectedVehicle}
          selectedDriver={selectedDriver}
          selectedStatus={selectedStatus}
          selectedPurpose={selectedPurpose}
          vehicles={filterOptions.vehicles}
          drivers={filterOptions.drivers}
          statuses={filterOptions.statuses}
          purposes={filterOptions.purposes}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onVehicleChange={setSelectedVehicle}
          onDriverChange={setSelectedDriver}
          onStatusChange={setSelectedStatus}
          onPurposeChange={setSelectedPurpose}
          onClearFilters={clearFilters}
        />

        <Separator />

        {/* Results Summary */}
        <ReportSummary
          filteredCount={filteredRecords.length}
          totalCount={tripRecords.length}
          filteredRecords={filteredRecords}
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
        />

        {/* Empty States */}
        <ReportEmptyState
          hasRecords={tripRecords.length > 0}
          hasFilters={filteredRecords.length === 0 && tripRecords.length > 0}
          onClearFilters={clearFilters}
        />
      </CardContent>
    </Card>
  );
}
