
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Car, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleSelectorProps {
  vehicles: any[];
  selectedVehicleId?: number;
  onSelect: (vehicle: any) => void;
}

export function VehicleSelector({ 
  vehicles, 
  selectedVehicleId, 
  onSelect 
}: VehicleSelectorProps) {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-2">
        {vehicles.map((vehicle) => (
          <button
            key={vehicle.id}
            className={cn(
              "w-full p-3 rounded-md text-left flex items-start hover:bg-gray-100 transition-colors",
              selectedVehicleId === vehicle.id ? "bg-noorcom-50 border border-noorcom-200" : "bg-white border border-gray-200"
            )}
            onClick={() => onSelect(vehicle)}
          >
            <div className={cn(
              "mt-0.5 mr-3 w-8 h-8 rounded-md flex items-center justify-center",
              selectedVehicleId === vehicle.id ? "bg-noorcom-100" : "bg-gray-100"
            )}>
              <Car className={cn(
                "h-4 w-4",
                selectedVehicleId === vehicle.id ? "text-noorcom-600" : "text-gray-600"
              )} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium">{vehicle.regNumber}</p>
                {selectedVehicleId === vehicle.id && (
                  <Check className="h-4 w-4 text-noorcom-500" />
                )}
              </div>
              <p className="text-xs text-gray-600">{vehicle.driver}</p>
              <div className="mt-2 flex items-center gap-2">
                <span 
                  className={cn(
                    "w-2 h-2 rounded-full",
                    vehicle.status === "active" ? "bg-green-500" :
                    vehicle.status === "idle" ? "bg-amber-500" : 
                    "bg-red-500"
                  )} 
                />
                <span className="text-xs text-gray-600 capitalize">{vehicle.status}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
