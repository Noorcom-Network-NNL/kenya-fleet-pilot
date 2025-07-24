
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
import { Button } from "@/components/ui/button";
import { FuelRecord } from "@/hooks/useFirebaseFuel";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

interface FuelRecordsTableProps {
  fuelRecords: FuelRecord[];
  onDeleteRecord: (id: string, vehicleRegNumber: string) => Promise<void>;
}

export function FuelRecordsTable({ fuelRecords, onDeleteRecord }: FuelRecordsTableProps) {
  if (fuelRecords.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No fuel records found. Add your first fuel record to get started.
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <div className="min-w-[800px] px-2 sm:px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Date</TableHead>
                <TableHead className="text-xs sm:text-sm">Vehicle</TableHead>
                <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Driver</TableHead>
                <TableHead className="text-xs sm:text-sm">Fuel Amount</TableHead>
                <TableHead className="text-xs sm:text-sm hidden md:table-cell">Price/L</TableHead>
                <TableHead className="text-xs sm:text-sm">Total Cost</TableHead>
                <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Odometer</TableHead>
                <TableHead className="text-xs sm:text-sm hidden xl:table-cell">Station</TableHead>
                <TableHead className="text-xs sm:text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fuelRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="text-xs sm:text-sm">
                    {format(new Date(record.date), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <div>
                      <div className="font-medium truncate">{record.vehicleRegNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm hidden sm:table-cell truncate">{record.driverName}</TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="secondary" className="text-xs">
                      {record.fuelAmount.toFixed(1)}L
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm hidden md:table-cell">KES {record.pricePerLiter.toFixed(2)}</TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <span className="font-medium text-green-600">
                      KES {record.fuelCost.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{record.odometer.toLocaleString()} km</TableCell>
                  <TableCell className="text-xs sm:text-sm hidden xl:table-cell truncate">{record.fuelStation}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => record.id && onDeleteRecord(record.id, record.vehicleRegNumber)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
