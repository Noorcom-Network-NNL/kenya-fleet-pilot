
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
  const { vehicles, loading: vehiclesLoading } = useFirebaseVehicles();
  const { drivers, loading: driversLoading } = useFirebaseDrivers();
  const { fuelRecords, loading: fuelLoading } = useFirebaseFuel();
  const { tripRecords, loading: tripsLoading } = useFirebaseTrips();

  // Calculate statistics from real data
  const totalVehicles = vehicles.length;
  const activeDrivers = drivers.filter(driver => driver.status === 'active').length;
  const totalFuelUsed = fuelRecords.reduce((total, record) => total + record.fuelAmount, 0);
  const totalDistance = tripRecords.reduce((total, trip) => total + (trip.distance || 0), 0);

  // Calculate trends (simplified - comparing with previous period would need more complex logic)
  const recentVehicles = vehicles.filter(v => v.createdAt && v.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const vehicleTrend = vehicles.length > 0 ? Math.round((recentVehicles.length / vehicles.length) * 100) : 0;

  return (
    <MainLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Vehicles"
          value={vehiclesLoading ? "..." : totalVehicles}
          icon={<Car className="h-6 w-6 text-noorcom-600" />}
          trend={{ value: vehicleTrend, positive: true }}
        />
        <StatCard
          title="Active Drivers"
          value={driversLoading ? "..." : activeDrivers}
          icon={<User className="h-6 w-6 text-noorcom-600" />}
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="Fuel Used (L)"
          value={fuelLoading ? "..." : Math.round(totalFuelUsed).toLocaleString()}
          icon={<Fuel className="h-6 w-6 text-noorcom-600" />}
          trend={{ value: 5, positive: false }}
        />
        <StatCard
          title="KM Driven"
          value={tripsLoading ? "..." : Math.round(totalDistance).toLocaleString()}
          icon={<MapPin className="h-6 w-6 text-noorcom-600" />}
          trend={{ value: 10, positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <VehicleStatusChart vehicles={vehicles} />
        <FuelConsumptionChart fuelRecords={fuelRecords} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VehicleList vehicles={vehicles} loading={vehiclesLoading} />
        </div>
        <div>
          <RecentAlerts vehicles={vehicles} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
