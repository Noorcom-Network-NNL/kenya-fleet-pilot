
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, FileSpreadsheet } from 'lucide-react';
import { FuelRecord } from '@/hooks/useFirebaseFuel';
import { format } from 'date-fns';

interface FuelExportProps {
  fuelRecords: FuelRecord[];
}

export const FuelExport: React.FC<FuelExportProps> = ({ fuelRecords }) => {
  const exportToPDF = () => {
    const headers = ['Date', 'Vehicle', 'Driver', 'Fuel Amount (L)', 'Price/L', 'Total Cost', 'Odometer (km)', 'Station'];
    const rows = fuelRecords.map(record => [
      format(new Date(record.date), 'dd MMM yyyy'),
      record.vehicleRegNumber,
      record.driverName,
      record.fuelAmount.toFixed(1),
      `KES ${record.pricePerLiter.toFixed(2)}`,
      `KES ${record.fuelCost.toFixed(2)}`,
      record.odometer.toLocaleString(),
      record.fuelStation
    ]);

    const htmlContent = `
      <html>
        <head>
          <title>Fuel Records Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .summary { background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Fuel Management Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Records:</strong> ${fuelRecords.length}</p>
            <p><strong>Total Fuel:</strong> ${fuelRecords.reduce((sum, record) => sum + record.fuelAmount, 0).toFixed(1)}L</p>
            <p><strong>Total Cost:</strong> KES ${fuelRecords.reduce((sum, record) => sum + record.fuelCost, 0).toFixed(2)}</p>
          </div>
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
    const headers = ['Date', 'Vehicle', 'Driver', 'Fuel Amount (L)', 'Price/L', 'Total Cost', 'Odometer (km)', 'Station', 'Receipt Number'];
    const csvContent = [
      headers.join(','),
      ...fuelRecords.map(record => [
        format(new Date(record.date), 'dd MMM yyyy'),
        `"${record.vehicleRegNumber}"`,
        `"${record.driverName}"`,
        record.fuelAmount.toFixed(1),
        record.pricePerLiter.toFixed(2),
        record.fuelCost.toFixed(2),
        record.odometer,
        `"${record.fuelStation}"`,
        `"${record.receiptNumber || 'N/A'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `fuel_records_export_${new Date().toISOString().split('T')[0]}.csv`);
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
