
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Check, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Vehicle } from "@/hooks/useFirebaseVehicles";
import { formatDistanceToNow } from "date-fns";

interface VehicleListProps {
  vehicles: Vehicle[];
  loading: boolean;
}

const getStatusBadge = (status: Vehicle["status"]) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 flex items-center gap-1">
          <Check className="h-3 w-3" /> Active
        </Badge>
      );
    case "maintenance":
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 flex items-center gap-1">
          <Car className="h-3 w-3" /> Maintenance
        </Badge>
      );
    case "idle":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 flex items-center gap-1">
          <Clock className="h-3 w-3" /> Idle
        </Badge>
      );
    case "issue":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" /> Issue
        </Badge>
      );
  }
};

export function VehicleList({ vehicles, loading }: VehicleListProps) {
  // Show only the most recent 5 vehicles
  const recentVehicles = vehicles.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Vehicles</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-noorcom-600"></div>
          </div>
        ) : recentVehicles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No vehicles found. Add your first vehicle to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left text-sm font-medium text-gray-500 pb-2">Reg. Number</th>
                  <th className="text-left text-sm font-medium text-gray-500 pb-2">Driver</th>
                  <th className="text-left text-sm font-medium text-gray-500 pb-2">Status</th>
                  <th className="text-left text-sm font-medium text-gray-500 pb-2">Fuel</th>
                  <th className="text-left text-sm font-medium text-gray-500 pb-2">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-noorcom-100 rounded-md p-1">
                          <Car className="h-4 w-4 text-noorcom-600" />
                        </div>
                        <span className="font-medium">{vehicle.regNumber}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm">{vehicle.driver}</td>
                    <td className="py-3 text-sm">{getStatusBadge(vehicle.status)}</td>
                    <td className="py-3">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            vehicle.fuelLevel > 70 ? "bg-green-500" : 
                            vehicle.fuelLevel > 30 ? "bg-amber-500" : "bg-red-500"
                          )}
                          style={{ width: `${vehicle.fuelLevel}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-500">
                      {vehicle.updatedAt ? formatDistanceToNow(vehicle.updatedAt, { addSuffix: true }) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
