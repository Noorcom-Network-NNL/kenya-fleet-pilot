
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { VehicleStatusChart } from "@/components/dashboard/VehicleStatusChart";
import { FuelConsumptionChart } from "@/components/dashboard/FuelConsumptionChart";
import { VehicleList } from "@/components/dashboard/VehicleList";
import { RecentAlerts } from "@/components/dashboard/RecentAlerts";
import { useFirebaseVehicles } from "@/hooks/useFirebaseVehicles";
import { useFirebaseDrivers } from "@/hooks/useFirebaseDrivers";
import { useFirebaseFuel } from "@/hooks/useFirebaseFuel";
import { Car, User, Fuel, MapPin } from "lucide-react";

const Dashboard = () => {
  const { vehicles, loading: vehiclesLoading } = useFirebaseVehicles();
  const { drivers } = useFirebaseDrivers();
  const { fuelRecords } = useFirebaseFuel();

  const totalVehicles = vehicles.length;
  const activeDrivers = drivers.filter(driver => driver.status === 'active').length;
  const totalFuelUsed = fuelRecords.reduce((sum, record) => sum + (record.fuelAmount || 0), 0);
  const totalKmDriven = 0; // This would come from trip data

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Vehicles"
            value={totalVehicles.toString()}
            trend={{ value: 100, positive: true }}
            icon={<Car className="h-4 w-4" />}
          />
          <StatCard
            title="Active Drivers"
            value={activeDrivers.toString()}
            trend={{ value: 12, positive: true }}
            icon={<User className="h-4 w-4" />}
          />
          <StatCard
            title="Fuel Used (L)"
            value={totalFuelUsed.toLocaleString()}
            trend={{ value: 100, positive: false }}
            icon={<Fuel className="h-4 w-4" />}
          />
          <StatCard
            title="KM Driven"
            value={totalKmDriven.toString()}
            trend={{ value: 0, positive: true }}
            icon={<MapPin className="h-4 w-4" />}
          />
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VehicleStatusChart vehicles={vehicles} />
          <FuelConsumptionChart fuelRecords={fuelRecords} />
        </div>

        {/* Vehicle List and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VehicleList vehicles={vehicles} loading={vehiclesLoading} />
          <RecentAlerts vehicles={vehicles} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
