
import { format } from 'date-fns';

// Helper function to safely get date from trip
export const getTripDate = (trip: any) => {
  try {
    if (trip.startTime instanceof Date) {
      return trip.startTime;
    }
    if (trip.startTime && typeof trip.startTime.toDate === 'function') {
      return trip.startTime.toDate();
    }
    if (trip.startTime) {
      return new Date(trip.startTime);
    }
    return new Date();
  } catch (error) {
    console.error('Error parsing trip date:', error);
    return new Date();
  }
};

// Helper function to normalize dates for comparison (removes time component)
export const normalizeDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

// Export to CSV function
export const exportToCSV = (filteredRecords: any[]) => {
  if (filteredRecords.length === 0) {
    alert('No records to export');
    return;
  }

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

  const csvData = filteredRecords.map(trip => {
    const startTime = getTripDate(trip);
    const endTime = trip.endTime ? (trip.endTime instanceof Date ? trip.endTime : trip.endTime.toDate()) : null;
    
    return [
      `"${trip.vehicleRegNumber || ''}"`,
      `"${trip.driverName || ''}"`,
      `"${trip.startLocation || ''}"`,
      `"${trip.endLocation || ''}"`,
      `"${trip.purpose || ''}"`,
      `"${trip.status || ''}"`,
      `"${startTime.toLocaleString()}"`,
      `"${endTime ? endTime.toLocaleString() : 'Ongoing'}"`,
      trip.startMileage || 0,
      trip.endMileage || 0,
      trip.distance || 0,
      trip.fuelUsed || 0,
      trip.fuelCost || 0,
      `"${trip.notes || ''}"`
    ];
  });

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

// Export to PDF function
export const exportToPDF = (filteredRecords: any[], activeFilters: string[]) => {
  if (filteredRecords.length === 0) {
    alert('No records to export');
    return;
  }

  const htmlContent = `
    <html>
      <head>
        <title>Trip Records Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
          h1 { color: #333; text-align: center; margin-bottom: 10px; }
          .header-info { text-align: center; margin-bottom: 20px; color: #666; }
          .filters { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
          .filters h3 { margin: 0 0 10px 0; font-size: 14px; }
          .filter-item { margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .status-ongoing { color: #0066cc; font-weight: bold; }
          .status-completed { color: #009900; font-weight: bold; }
          .status-cancelled { color: #cc0000; font-weight: bold; }
          .summary { margin-top: 20px; background: #f0f8ff; padding: 15px; border-radius: 5px; }
          .summary h3 { margin-top: 0; }
        </style>
      </head>
      <body>
        <h1>Vehicle Trip Records Report</h1>
        <div class="header-info">
          <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>Total Records: ${filteredRecords.length}</p>
        </div>
        
        ${activeFilters.length > 0 ? `
        <div class="filters">
          <h3>Applied Filters:</h3>
          ${activeFilters.map(filter => `<div class="filter-item">${filter}</div>`).join('')}
        </div>
        ` : ''}

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
            ${filteredRecords.map(trip => {
              const startTime = getTripDate(trip);
              return `
                <tr>
                  <td>${trip.vehicleRegNumber || 'N/A'}</td>
                  <td>${trip.driverName || 'N/A'}</td>
                  <td>${trip.startLocation || 'N/A'} → ${trip.endLocation || 'N/A'}</td>
                  <td>${trip.purpose || 'N/A'}</td>
                  <td class="status-${trip.status || 'unknown'}">${trip.status || 'N/A'}</td>
                  <td>${startTime.toLocaleString()}</td>
                  <td>${trip.distance || 0} km</td>
                  <td>KES ${trip.fuelCost || 0}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="summary">
          <h3>Summary</h3>
          <p><strong>Total Distance:</strong> ${filteredRecords.reduce((sum, trip) => sum + (trip.distance || 0), 0).toFixed(1)} km</p>
          <p><strong>Total Fuel Cost:</strong> KES ${filteredRecords.reduce((sum, trip) => sum + (trip.fuelCost || 0), 0).toFixed(2)}</p>
          <p><strong>Ongoing Trips:</strong> ${filteredRecords.filter(trip => trip.status === 'ongoing').length}</p>
          <p><strong>Completed Trips:</strong> ${filteredRecords.filter(trip => trip.status === 'completed').length}</p>
          <p><strong>Cancelled Trips:</strong> ${filteredRecords.filter(trip => trip.status === 'cancelled').length}</p>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};
