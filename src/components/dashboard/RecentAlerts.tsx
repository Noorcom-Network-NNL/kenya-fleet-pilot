
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Fuel, Car, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type Alert = {
  id: number;
  type: "fuel" | "maintenance" | "geofence" | "speeding";
  vehicle: string;
  message: string;
  time: string;
};

const alerts: Alert[] = [
  {
    id: 1,
    type: "fuel",
    vehicle: "KBZ 123A",
    message: "Unusual fuel consumption detected",
    time: "10 min ago",
  },
  {
    id: 2,
    type: "maintenance",
    vehicle: "KCY 456B",
    message: "Service schedule overdue by 3 days",
    time: "2 hours ago",
  },
  {
    id: 3,
    type: "geofence",
    vehicle: "KDA 789C",
    message: "Vehicle left assigned route",
    time: "3 hours ago",
  },
  {
    id: 4,
    type: "speeding",
    vehicle: "KBD 321D",
    message: "Speed violation: 90km/h in 50km/h zone",
    time: "5 hours ago",
  },
];

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

export function RecentAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
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
      </CardContent>
    </Card>
  );
}
