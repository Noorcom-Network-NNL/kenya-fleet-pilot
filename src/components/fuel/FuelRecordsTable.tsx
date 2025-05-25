
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FuelRecord } from "@/hooks/useFirebaseFuel";
import { format } from "date-fns";

interface FuelRecordsTableProps {
  fuelRecords: FuelRecord[];
}

export function FuelRecordsTable({ fuelRecords }: FuelRecordsTableProps) {
  if (fuelRecords.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No fuel records found. Add your first fuel record to get started.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Fuel Amount</TableHead>
            <TableHead>Price/L</TableHead>
            <TableHead>Total Cost</TableHead>
            <TableHead>Odometer</TableHead>
            <TableHead>Station</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fuelRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                {format(new Date(record.date), "dd MMM yyyy")}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{record.vehicleRegNumber}</div>
                </div>
              </TableCell>
              <TableCell>{record.driverName}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {record.fuelAmount.toFixed(1)}L
                </Badge>
              </TableCell>
              <TableCell>${record.pricePerLiter.toFixed(2)}</TableCell>
              <TableCell>
                <span className="font-medium text-green-600">
                  ${record.fuelCost.toFixed(2)}
                </span>
              </TableCell>
              <TableCell>{record.odometer.toLocaleString()} km</TableCell>
              <TableCell>{record.fuelStation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
