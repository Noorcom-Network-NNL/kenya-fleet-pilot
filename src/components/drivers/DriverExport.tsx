
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, FileSpreadsheet } from 'lucide-react';
import { Driver } from '@/hooks/useFirebaseDrivers';

interface DriverExportProps {
  drivers: Driver[];
}

export const DriverExport: React.FC<DriverExportProps> = ({ drivers }) => {
  const exportToPDF = () => {
    const headers = ['Name', 'Phone', 'License', 'License Expiry', 'Status', 'Performance', 'Assigned Vehicle'];
    const rows = drivers.map(driver => [
      driver.name,
      driver.phone,
      driver.license,
      driver.licenseExpiry,
      driver.status,
      driver.performance,
      driver.assignedVehicle || 'Not assigned'
    ]);

    const htmlContent = `
      <html>
        <head>
          <title>Drivers Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Drivers Management Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
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

  const exportToExcel = () => {
    const headers = ['Name', 'Phone', 'License', 'License Expiry', 'Status', 'Performance', 'Assigned Vehicle'];
    const csvContent = [
      headers.join(','),
      ...drivers.map(driver => [
        `"${driver.name}"`,
        `"${driver.phone}"`,
        `"${driver.license}"`,
        `"${driver.licenseExpiry}"`,
        `"${driver.status}"`,
        `"${driver.performance}"`,
        `"${driver.assignedVehicle || 'Not assigned'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `drivers_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={exportToPDF}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Export PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportToExcel}
        className="flex items-center gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Export Excel
      </Button>
    </div>
  );
};
