
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Vehicle } from "@/hooks/useFirebaseVehicles";

const COLORS = ["#9b87f5", "#22c55e", "#eab308", "#ef4444"];

interface VehicleStatusChartProps {
  vehicles: Vehicle[];
}

export function VehicleStatusChart({ vehicles }: VehicleStatusChartProps) {
  // Calculate status counts from real data
  const statusCounts = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = [
    { name: "Active", value: statusCounts.active || 0 },
    { name: "Maintenance", value: statusCounts.maintenance || 0 },
    { name: "Idle", value: statusCounts.idle || 0 },
    { name: "Issues", value: statusCounts.issue || 0 },
  ].filter(item => item.value > 0); // Only show statuses that have vehicles

  if (vehicles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center text-gray-500">
            No vehicles data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
