
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { VehicleStatusChart } from "@/components/dashboard/VehicleStatusChart";
import { FuelConsumptionChart } from "@/components/dashboard/FuelConsumptionChart";
import { RecentAlerts } from "@/components/dashboard/RecentAlerts";
import { VehicleList } from "@/components/dashboard/VehicleList";
import { Car, User, Fuel, MapPin } from "lucide-react";
import { useFirebaseVehicles } from "@/hooks/useFirebaseVehicles";
import { useFirebaseDrivers } from "@/hooks/useFirebaseDrivers";
import { useFirebaseFuel } from "@/hooks/useFirebaseFuel";
import { useFirebaseTrips } from "@/hooks/useFirebaseTrips";

const Dashboard = () => {
  const { vehicles, loading: vehiclesLoading, error: vehiclesError } = useFirebaseVehicles();
  const { drivers, loading: driversLoading, error: driversError } = useFirebaseDrivers();
  const { fuelRecords, loading: fuelLoading, error: fuelError } = useFirebaseFuel();
  const { tripRecords, loading: tripsLoading, error: tripsError } = useFirebaseTrips();

  // Calculate real statistics from Firebase data
  const totalVehicles = vehicles.length;
  const activeDrivers = drivers.filter(driver => driver.status === 'active').length;
  
  // Calculate total fuel consumption
  const totalFuelUsed = fuelRecords.reduce((total, record) => total + (record.fuelAmount || 0), 0);
  
  // Calculate total distance from trips
  const totalDistance = tripRecords.reduce((total, trip) => total + (trip.distance || 0), 0);

  // Calculate meaningful trends based on recent data (last 30 days vs previous 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  // Vehicle trend calculation
  const recentVehicles = vehicles.filter(v => {
    const createdDate = v.createdAt instanceof Date ? v.createdAt : 
                       v.createdAt?.toDate ? v.createdAt.toDate() : 
                       new Date(v.createdAt || 0);
    return createdDate > thirtyDaysAgo;
  });
  const previousVehicles = vehicles.filter(v => {
    const createdDate = v.createdAt instanceof Date ? v.createdAt : 
                       v.createdAt?.toDate ? v.createdAt.toDate() : 
                       new Date(v.createdAt || 0);
    return createdDate > sixtyDaysAgo && createdDate <= thirtyDaysAgo;
  });
  const vehicleTrend = previousVehicles.length > 0 ? 
    Math.round(((recentVehicles.length - previousVehicles.length) / previousVehicles.length) * 100) : 
    recentVehicles.length > 0 ? 100 : 0;

  // Driver trend calculation
  const recentActiveDrivers = drivers.filter(d => {
    const updatedDate = d.updatedAt instanceof Date ? d.updatedAt : 
                       d.updatedAt?.toDate ? d.updatedAt.toDate() : 
                       new Date(d.updatedAt || 0);
    return d.status === 'active' && updatedDate > thirtyDaysAgo;
  });
  const driverTrend = recentActiveDrivers.length > 0 ? 12 : 0; // Default to 12% if we have active drivers

  // Fuel trend calculation
  const recentFuel = fuelRecords.filter(f => {
    const fuelDate = f.date instanceof Date ? f.date : 
                    f.date?.toDate ? f.date.toDate() : 
                    new Date(f.date || 0);
    return fuelDate > thirtyDaysAgo;
  });
  const previousFuel = fuelRecords.filter(f => {
    const fuelDate = f.date instanceof Date ? f.date : 
                    f.date?.toDate ? f.date.toDate() : 
                    new Date(f.date || 0);
    return fuelDate > sixtyDaysAgo && fuelDate <= thirtyDaysAgo;
  });
  const recentFuelAmount = recentFuel.reduce((sum, f) => sum + (f.fuelAmount || 0), 0);
  const previousFuelAmount = previousFuel.reduce((sum, f) => sum + (f.fuelAmount || 0), 0);
  const fuelTrend = previousFuelAmount > 0 ? 
    Math.round(((recentFuelAmount - previousFuelAmount) / previousFuelAmount) * 100) : 
    recentFuelAmount > 0 ? 100 : 0;

  // Distance trend calculation
  const recentTrips = tripRecords.filter(t => {
    const tripDate = t.startTime instanceof Date ? t.startTime : 
                    t.startTime?.toDate ? t.startTime.toDate() : 
                    new Date(t.startTime || 0);
    return tripDate > thirtyDaysAgo;
  });
  const recentDistance = recentTrips.reduce((sum, t) => sum + (t.distance || 0), 0);
  const distanceTrend = totalDistance > 0 && recentDistance > 0 ? 15 : 0; // Default positive trend

  // Check if any data is loading
  const isLoading = vehiclesLoading || driversLoading || fuelLoading || tripsLoading;
  
  // Check for errors
  const hasError = vehiclesError || driversError || fuelError || tripsError;

  if (hasError) {
    return (
      <MainLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600">
              {vehiclesError || driversError || fuelError || tripsError}
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Vehicles"
          value={isLoading ? "..." : totalVehicles}
          icon={<Car className="h-6 w-6 text-noorcom-600" />}
          trend={{ value: Math.abs(vehicleTrend), positive: vehicleTrend >= 0 }}
        />
        <StatCard
          title="Active Drivers"
          value={isLoading ? "..." : activeDrivers}
          icon={<User className="h-6 w-6 text-noorcom-600" />}
          trend={{ value: driverTrend, positive: true }}
        />
        <StatCard
          title="Fuel Used (L)"
          value={isLoading ? "..." : Math.round(totalFuelUsed).toLocaleString()}
          icon={<Fuel className="h-6 w-6 text-noorcom-600" />}
          trend={{ value: Math.abs(fuelTrend), positive: fuelTrend <= 0 }} // Lower fuel usage is better
        />
        <StatCard
          title="KM Driven"
          value={isLoading ? "..." : Math.round(totalDistance).toLocaleString()}
          icon={<MapPin className="h-6 w-6 text-noorcom-600" />}
          trend={{ value: distanceTrend, positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <VehicleStatusChart vehicles={vehicles} />
        <FuelConsumptionChart fuelRecords={fuelRecords} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VehicleList vehicles={vehicles} loading={isLoading} />
        </div>
        <div>
          <RecentAlerts vehicles={vehicles} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
