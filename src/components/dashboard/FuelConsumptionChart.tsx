
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FuelRecord } from "@/hooks/useFirebaseFuel";

interface FuelConsumptionChartProps {
  fuelRecords: FuelRecord[];
}

export function FuelConsumptionChart({ fuelRecords }: FuelConsumptionChartProps) {
  // Group fuel records by month for the last 6 months
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const last6Months = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    last6Months.push({
      month: date.getMonth(),
      year: date.getFullYear(),
      name: monthNames[date.getMonth()],
      consumption: 0
    });
  }

  // Calculate consumption per month
  fuelRecords.forEach(record => {
    const recordDate = new Date(record.date);
    const monthData = last6Months.find(month => 
      month.month === recordDate.getMonth() && 
      month.year === recordDate.getFullYear()
    );
    if (monthData) {
      monthData.consumption += record.fuelAmount;
    }
  });

  if (fuelRecords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fuel Consumption (Liters)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center text-gray-500">
            No fuel data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fuel Consumption (Liters)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last6Months}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="consumption" fill="#9b87f5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
