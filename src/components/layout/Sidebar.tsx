
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Car,
  User,
  Fuel,
  MapPin,
  ChartBar,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
};

const NavItem = ({ to, icon, label, active }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
      active
        ? "bg-noorcom-700 text-white"
        : "text-gray-300 hover:bg-noorcom-700/50 hover:text-white"
    )}
  >
    <div className="w-5 h-5">{icon}</div>
    <span>{label}</span>
  </Link>
);

export function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { to: "/", icon: <ChartBar size={18} />, label: "Dashboard" },
    { to: "/vehicles", icon: <Car size={18} />, label: "Vehicles" },
    { to: "/drivers", icon: <User size={18} />, label: "Drivers" },
    { to: "/fuel", icon: <Fuel size={18} />, label: "Fuel" },
    { to: "/tracking", icon: <MapPin size={18} />, label: "Tracking" },
    { to: "/settings", icon: <Settings size={18} />, label: "Settings" },
  ];

  return (
    <div className="min-h-screen w-64 bg-noorcom-800 text-white flex flex-col border-r border-noorcom-700">
      <div className="p-4 border-b border-noorcom-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-noorcom-500 flex items-center justify-center text-white font-bold">
            N
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Noorcom</h1>
            <p className="text-xs text-gray-400">Fleet Management</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.to}
          />
        ))}
      </nav>
      
      <div className="p-4 border-t border-noorcom-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-noorcom-500 flex items-center justify-center">
            <User size={16} />
          </div>
          <div>
            <p className="text-sm font-medium">John Kamau</p>
            <p className="text-xs text-gray-400">Fleet Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
