
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Fuel = () => {
  return (
    <MainLayout title="Fuel Management">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 lg:col-span-3">
          <h2 className="text-lg font-medium mb-4">Fuel Consumption Overview</h2>
          <p className="text-gray-500">
            Track and manage fuel consumption for your fleet vehicles.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Fuel Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px] flex items-center justify-center text-gray-500">
            Fuel management data will be displayed here.
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Fuel;
