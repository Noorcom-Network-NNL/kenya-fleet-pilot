
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { VehicleStatusChart } from "@/components/dashboard/VehicleStatusChart";
import { FuelConsumptionChart } from "@/components/dashboard/FuelConsumptionChart";
import { RecentAlerts } from "@/components/dashboard/RecentAlerts";
import { VehicleList } from "@/components/dashboard/VehicleList";
import { Car, User, Fuel, MapPin } from "lucide-react";

const Dashboard = () => {
  return (
    <MainLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Vehicles"
          value={34}
          icon={<Car className="h-6 w-6 text-noorcom-600" />}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Active Drivers"
          value={28}
          icon={<User className="h-6 w-6 text-noorcom-600" />}
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="Fuel Used (L)"
          value="1,860"
          icon={<Fuel className="h-6 w-6 text-noorcom-600" />}
          trend={{ value: 5, positive: false }}
        />
        <StatCard
          title="KM Driven"
          value="24,500"
          icon={<MapPin className="h-6 w-6 text-noorcom-600" />}
          trend={{ value: 10, positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <VehicleStatusChart />
        <FuelConsumptionChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VehicleList />
        </div>
        <div>
          <RecentAlerts />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
