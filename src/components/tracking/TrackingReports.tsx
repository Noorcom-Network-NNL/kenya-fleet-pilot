import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { FileText, FileSpreadsheet, Download, CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TrackingReportsProps {
  tripRecords: any[];
}

export function TrackingReports({ tripRecords }: TrackingReportsProps) {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');
  const [selectedDriver, setSelectedDriver] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('all');

  // Get unique values for filters
  const vehicles = [...new Set(tripRecords.map(trip => trip.vehicleRegNumber))];
  const drivers = [...new Set(tripRecords.map(trip => trip.driverName))];
  const statuses = [...new Set(tripRecords.map(trip => trip.status))];
  const purposes = [...new Set(tripRecords.map(trip => trip.purpose))];

  // Filter trip records based on selected criteria
  const getFilteredRecords = () => {
    return tripRecords.filter(trip => {
      const tripDate = trip.startTime.toDate();
      
      // Date range filter
      if (dateFrom && tripDate < dateFrom) return false;
      if (dateTo && tripDate > dateTo) return false;
      
      // Other filters
      if (selectedVehicle !== 'all' && trip.vehicleRegNumber !== selectedVehicle) return false;
      if (selectedDriver !== 'all' && trip.driverName !== selectedDriver) return false;
      if (selectedStatus !== 'all' && trip.status !== selectedStatus) return false;
      if (selectedPurpose !== 'all' && trip.purpose !== selectedPurpose) return false;
      
      return true;
    });
  };

  const filteredRecords = getFilteredRecords();

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Vehicle Registration',
      'Driver Name',
      'Start Location',
      'End Location', 
      'Purpose',
      'Status',
      'Start Time',
      'End Time',
      'Start Mileage',
      'End Mileage',
      'Distance (km)',
      'Fuel Used (L)',
      'Fuel Cost',
      'Notes'
    ];

    const csvData = filteredRecords.map(trip => [
      `"${trip.vehicleRegNumber}"`,
      `"${trip.driverName}"`,
      `"${trip.startLocation}"`,
      `"${trip.endLocation}"`,
      `"${trip.purpose}"`,
      `"${trip.status}"`,
      `"${trip.startTime.toDate().toLocaleString()}"`,
      `"${trip.endTime ? trip.endTime.toDate().toLocaleString() : 'Ongoing'}"`,
      trip.startMileage || 0,
      trip.endMileage || 0,
      trip.distance || 0,
      trip.fuelUsed || 0,
      trip.fuelCost || 0,
      `"${trip.notes || ''}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `trip_records_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF
  const exportToPDF = () => {
    const htmlContent = `
      <html>
        <head>
          <title>Trip Records Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
            h1 { color: #333; text-align: center; margin-bottom: 10px; }
            .header-info { text-align: center; margin-bottom: 20px; color: #666; }
            .filters { background: #f5f5f5; padding: 10px; margin-bottom: 20px; border-radius: 5px; }
            .filters h3 { margin: 0 0 10px 0; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .status-ongoing { color: #0066cc; font-weight: bold; }
            .status-completed { color: #009900; font-weight: bold; }
            .status-cancelled { color: #cc0000; font-weight: bold; }
            .summary { margin-top: 20px; background: #f0f8ff; padding: 15px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>Vehicle Trip Records Report</h1>
          <div class="header-info">
            <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>Total Records: ${filteredRecords.length}</p>
          </div>
          
          <div class="filters">
            <h3>Applied Filters:</h3>
            ${dateFrom ? `<p><strong>From:</strong> ${format(dateFrom, 'PPP')}</p>` : ''}
            ${dateTo ? `<p><strong>To:</strong> ${format(dateTo, 'PPP')}</p>` : ''}
            ${selectedVehicle !== 'all' ? `<p><strong>Vehicle:</strong> ${selectedVehicle}</p>` : ''}
            ${selectedDriver !== 'all' ? `<p><strong>Driver:</strong> ${selectedDriver}</p>` : ''}
            ${selectedStatus !== 'all' ? `<p><strong>Status:</strong> ${selectedStatus}</p>` : ''}
            ${selectedPurpose !== 'all' ? `<p><strong>Purpose:</strong> ${selectedPurpose}</p>` : ''}
          </div>

          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Route</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Start Time</th>
                <th>Distance</th>
                <th>Fuel Cost</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRecords.map(trip => `
                <tr>
                  <td>${trip.vehicleRegNumber}</td>
                  <td>${trip.driverName}</td>
                  <td>${trip.startLocation} → ${trip.endLocation}</td>
                  <td>${trip.purpose}</td>
                  <td class="status-${trip.status}">${trip.status}</td>
                  <td>${trip.startTime.toDate().toLocaleString()}</td>
                  <td>${trip.distance || 0} km</td>
                  <td>KES ${trip.fuelCost || 0}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Distance:</strong> ${filteredRecords.reduce((sum, trip) => sum + (trip.distance || 0), 0).toFixed(1)} km</p>
            <p><strong>Total Fuel Cost:</strong> KES ${filteredRecords.reduce((sum, trip) => sum + (trip.fuelCost || 0), 0).toFixed(2)}</p>
            <p><strong>Ongoing Trips:</strong> ${filteredRecords.filter(trip => trip.status === 'ongoing').length}</p>
            <p><strong>Completed Trips:</strong> ${filteredRecords.filter(trip => trip.status === 'completed').length}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const clearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setSelectedVehicle('all');
    setSelectedDriver('all');
    setSelectedStatus('all');
    setSelectedPurpose('all');
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Filter Options</Label>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Date To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Vehicle Filter */}
            <div className="space-y-2">
              <Label>Vehicle</Label>
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger>
                  <SelectValue placeholder="All vehicles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  {vehicles.map(vehicle => (
                    <SelectItem key={vehicle} value={vehicle}>{vehicle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Driver Filter */}
            <div className="space-y-2">
              <Label>Driver</Label>
              <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                <SelectTrigger>
                  <SelectValue placeholder="All drivers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Drivers</SelectItem>
                  {drivers.map(driver => (
                    <SelectItem key={driver} value={driver}>{driver}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Purpose Filter */}
            <div className="space-y-2">
              <Label>Purpose</Label>
              <Select value={selectedPurpose} onValueChange={setSelectedPurpose}>
                <SelectTrigger>
                  <SelectValue placeholder="All purposes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Purposes</SelectItem>
                  {purposes.map(purpose => (
                    <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Showing {filteredRecords.length} of {tripRecords.length} trip records
            </p>
            {filteredRecords.length > 0 && (
              <div className="flex gap-2">
                <Badge variant="outline">
                  Total Distance: {filteredRecords.reduce((sum, trip) => sum + (trip.distance || 0), 0).toFixed(1)} km
                </Badge>
                <Badge variant="outline">
                  Total Cost: KES {filteredRecords.reduce((sum, trip) => sum + (trip.fuelCost || 0), 0).toFixed(2)}
                </Badge>
              </div>
            )}
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              disabled={filteredRecords.length === 0}
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPDF}
              disabled={filteredRecords.length === 0}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
