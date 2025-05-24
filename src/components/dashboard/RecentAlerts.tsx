
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Fuel, Car, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Vehicle } from "@/hooks/useFirebaseVehicles";
import { formatDistanceToNow } from "date-fns";

interface RecentAlertsProps {
  vehicles: Vehicle[];
}

type Alert = {
  id: string;
  type: "fuel" | "maintenance" | "geofence" | "speeding";
  vehicle: string;
  message: string;
  time: string;
};

const getAlertIcon = (type: Alert["type"]) => {
  switch (type) {
    case "fuel":
      return <Fuel className="h-4 w-4 text-amber-500" />;
    case "maintenance":
      return <Car className="h-4 w-4 text-red-500" />;
    case "geofence":
      return <MapPin className="h-4 w-4 text-blue-500" />;
    case "speeding":
      return <Bell className="h-4 w-4 text-purple-500" />;
  }
};

export function RecentAlerts({ vehicles }: RecentAlertsProps) {
  // Generate alerts based on real vehicle data
  const alerts: Alert[] = [];

  vehicles.forEach(vehicle => {
    // Low fuel alert
    if (vehicle.fuelLevel < 30) {
      alerts.push({
        id: `fuel-${vehicle.id}`,
        type: "fuel",
        vehicle: vehicle.regNumber,
        message: `Low fuel level: ${vehicle.fuelLevel}%`,
        time: vehicle.updatedAt ? formatDistanceToNow(vehicle.updatedAt, { addSuffix: true }) : 'Recently'
      });
    }

    // Maintenance alerts
    if (vehicle.status === 'maintenance') {
      alerts.push({
        id: `maintenance-${vehicle.id}`,
        type: "maintenance",
        vehicle: vehicle.regNumber,
        message: "Vehicle in maintenance",
        time: vehicle.updatedAt ? formatDistanceToNow(vehicle.updatedAt, { addSuffix: true }) : 'Recently'
      });
    }

    // Issue alerts
    if (vehicle.status === 'issue') {
      alerts.push({
        id: `issue-${vehicle.id}`,
        type: "speeding",
        vehicle: vehicle.regNumber,
        message: "Vehicle has reported issues",
        time: vehicle.updatedAt ? formatDistanceToNow(vehicle.updatedAt, { addSuffix: true }) : 'Recently'
      });
    }
  });

  // Sort by most recent and take first 4
  const recentAlerts = alerts.slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {recentAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No alerts at the moment. All systems operating normally.
          </div>
        ) : (
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-md">
                <div className="mt-1">{getAlertIcon(alert.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{alert.vehicle}</h4>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
