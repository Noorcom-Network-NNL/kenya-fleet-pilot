
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { TrackingMap } from "@/components/tracking/TrackingMap";
import { VehicleSelector } from "@/components/tracking/VehicleSelector";
import { VehicleDetails } from "@/components/tracking/VehicleDetails";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVehicleTracking } from "@/hooks/useVehicleTracking";
import "leaflet/dist/leaflet.css";

const Tracking = () => {
  const { 
    selectedVehicle, 
    vehicleData, 
    currentPosition, 
    vehicleHistory, 
    selectVehicle,
    isMoving,
    lastUpdate,
    currentSpeed
  } = useVehicleTracking();

  return (
    <MainLayout title="Vehicle Tracking">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 lg:col-span-1">
          <h2 className="text-lg font-medium mb-4">Fleet Vehicles</h2>
          <VehicleSelector 
            vehicles={vehicleData} 
            selectedVehicleId={selectedVehicle?.id} 
            onSelect={selectVehicle}
          />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 lg:col-span-2">
          {selectedVehicle ? (
            <VehicleDetails 
              vehicle={selectedVehicle} 
              isMoving={isMoving}
              lastUpdate={lastUpdate}
              currentSpeed={currentSpeed}
            />
          ) : (
            <div className="text-center py-6 text-gray-500">
              Select a vehicle to view details
            </div>
          )}
        </div>
      </div>

      <Card className="mb-6">
        <Tabs defaultValue="live">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-medium">Vehicle Tracking</h2>
            <TabsList>
              <TabsTrigger value="live">Live Tracking</TabsTrigger>
              <TabsTrigger value="history">Trip History</TabsTrigger>
            </TabsList>
          </div>
          <CardContent className="p-0">
            <TabsContent value="live" className="m-0">
              <div className="h-[600px] relative">
                <TrackingMap 
                  position={currentPosition}
                  vehicle={selectedVehicle}
                  isMoving={isMoving}
                />
              </div>
            </TabsContent>
            <TabsContent value="history" className="m-0">
              <div className="h-[600px] relative">
                <TrackingMap 
                  position={currentPosition}
                  vehicle={selectedVehicle}
                  isMoving={false}
                  showPath={true}
                  pathData={vehicleHistory}
                />
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </MainLayout>
  );
};

export default Tracking;
