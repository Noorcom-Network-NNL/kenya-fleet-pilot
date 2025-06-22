
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Car,
  User,
  Fuel,
  MapPin,
  ChartBar,
  Settings,
  LogOut,
  Building,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
};

const NavItem = ({ to, icon, label, active, onClick }: NavItemProps) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
      active
        ? "bg-noorcom-700 text-white"
        : "text-gray-300 hover:bg-noorcom-700/50 hover:text-white"
    )}
  >
    <div className="w-5 h-5 flex-shrink-0">{icon}</div>
    <span className="truncate">{label}</span>
  </Link>
);

const SUPER_ADMIN_EMAIL = 'admin@noorcomfleet.co.ke';

export function Sidebar() {
  const location = useLocation();
  const { logout, currentUser } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Base navigation items for all users
  const baseNavItems = [
    { to: "/", icon: <ChartBar size={18} />, label: "Dashboard" },
    { to: "/vehicles", icon: <Car size={18} />, label: "Vehicles" },
    { to: "/drivers", icon: <User size={18} />, label: "Drivers" },
    { to: "/fuel", icon: <Fuel size={18} />, label: "Fuel" },
    { to: "/tracking", icon: <MapPin size={18} />, label: "Tracking" },
    { to: "/settings", icon: <Settings size={18} />, label: "Settings" },
  ];

  // Add Organizations tab only for super admin
  const navItems = currentUser?.email === SUPER_ADMIN_EMAIL 
    ? [
        ...baseNavItems.slice(0, 5), // Dashboard through Tracking
        { to: "/organizations", icon: <Building size={18} />, label: "Organizations" },
        ...baseNavItems.slice(5) // Settings
      ]
    : baseNavItems;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Mobile toggle button
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-noorcom-800 text-white hover:bg-noorcom-700 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>

        {/* Mobile Sidebar Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div className={cn(
          "fixed left-0 top-0 h-full w-64 bg-noorcom-800 text-white transform transition-transform duration-300 ease-in-out z-50 md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-noorcom-700 mt-12">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-noorcom-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  N
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-white truncate">Noorcom</h1>
                  <p className="text-xs text-gray-400 truncate">Fleet Management</p>
                </div>
              </div>
            </div>
            
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname === item.to}
                  onClick={closeSidebar}
                />
              ))}
            </nav>
            
            <div className="p-4 border-t border-noorcom-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-noorcom-500 flex items-center justify-center flex-shrink-0">
                  <User size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {currentUser?.email || "User"}
                  </p>
                  <p className="text-xs text-gray-400">Fleet Admin</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-noorcom-700/50"
              >
                <LogOut size={16} className="mr-2 flex-shrink-0" />
                <span className="truncate">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className="hidden md:flex min-h-screen w-64 bg-noorcom-800 text-white flex-col border-r border-noorcom-700">
      <div className="p-4 border-b border-noorcom-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-noorcom-500 flex items-center justify-center text-white font-bold flex-shrink-0">
            N
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-white truncate">Noorcom</h1>
            <p className="text-xs text-gray-400 truncate">Fleet Management</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-noorcom-500 flex items-center justify-center flex-shrink-0">
            <User size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {currentUser?.email || "User"}
            </p>
            <p className="text-xs text-gray-400">Fleet Admin</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-noorcom-700/50"
        >
          <LogOut size={16} className="mr-2 flex-shrink-0" />
          <span className="truncate">Logout</span>
        </Button>
      </div>
    </div>
  );
}
