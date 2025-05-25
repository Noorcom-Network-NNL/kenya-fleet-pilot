
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FuelConsumptionChart } from "@/components/dashboard/FuelConsumptionChart";
import { AddFuelRecordForm } from "@/components/fuel/AddFuelRecordForm";
import { FuelRecordsTable } from "@/components/fuel/FuelRecordsTable";
import { useFirebaseFuel } from "@/hooks/useFirebaseFuel";
import { Fuel as FuelIcon, Plus, BarChart3 } from "lucide-react";

const Fuel = () => {
  const { fuelRecords, loading, error } = useFirebaseFuel();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <MainLayout title="Fuel Management">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="add-record" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Record
          </TabsTrigger>
          <TabsTrigger value="all-records" className="flex items-center gap-2">
            <FuelIcon className="h-4 w-4" />
            All Records
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FuelIcon className="h-5 w-5" />
                  Fuel Consumption Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Track and manage fuel consumption for your fleet vehicles.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900">Total Records</h3>
                    <p className="text-2xl font-bold text-blue-600">{fuelRecords.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900">Total Fuel</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {fuelRecords.reduce((sum, record) => sum + (record.fuelAmount || 0), 0).toFixed(1)}L
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900">Total Cost</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      ${fuelRecords.reduce((sum, record) => sum + (record.fuelCost || 0), 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <FuelConsumptionChart fuelRecords={fuelRecords} />
        </TabsContent>

        <TabsContent value="add-record">
          <Card>
            <CardHeader>
              <CardTitle>Add New Fuel Record</CardTitle>
            </CardHeader>
            <CardContent>
              <AddFuelRecordForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-records">
          <Card>
            <CardHeader>
              <CardTitle>All Fuel Records</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading fuel records...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">{error}</div>
              ) : (
                <FuelRecordsTable fuelRecords={fuelRecords} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Fuel;
