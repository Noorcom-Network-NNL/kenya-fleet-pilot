
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
  const { vehicles } = useFirebaseVehicles();
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
            change="+100% vs last month"
            changeType="positive"
            icon={<Car className="h-4 w-4" />}
          />
          <StatCard
            title="Active Drivers"
            value={activeDrivers.toString()}
            change="+12% vs last month"
            changeType="positive"
            icon={<User className="h-4 w-4" />}
          />
          <StatCard
            title="Fuel Used (L)"
            value={totalFuelUsed.toLocaleString()}
            change="-100% vs last month"
            changeType="negative"
            icon={<Fuel className="h-4 w-4" />}
          />
          <StatCard
            title="KM Driven"
            value={totalKmDriven.toString()}
            change="+0% vs last month"
            changeType="neutral"
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
          <VehicleList vehicles={vehicles} />
          <RecentAlerts />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
