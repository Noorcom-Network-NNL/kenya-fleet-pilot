
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

const data = [
  { name: "Jan", consumption: 350 },
  { name: "Feb", consumption: 300 },
  { name: "Mar", consumption: 420 },
  { name: "Apr", consumption: 380 },
  { name: "May", consumption: 410 },
  { name: "Jun", consumption: 390 },
];

export function FuelConsumptionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fuel Consumption (Liters)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
