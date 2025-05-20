
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  User, 
  Fuel, 
  Clock, 
  Map as MapIcon, 
  Navigation
} from "lucide-react";
import { format } from "date-fns";

interface VehicleDetailsProps {
  vehicle: any;
  isMoving: boolean;
  lastUpdate: Date;
  currentSpeed: number;
}

export function VehicleDetails({ 
  vehicle,
  isMoving,
  lastUpdate,
  currentSpeed
}: VehicleDetailsProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-noorcom-100 p-2 rounded-md mr-3">
            <Car className="h-6 w-6 text-noorcom-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{vehicle.regNumber}</h3>
            <p className="text-sm text-gray-600">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
          </div>
        </div>
        <Badge 
          className={
            isMoving 
              ? "bg-green-100 text-green-800 border-green-200" 
              : "bg-orange-100 text-orange-800 border-orange-200"
          }
        >
          {isMoving ? "Currently Moving" : "Stationary"}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1.5 rounded">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Driver</p>
            <p className="text-sm font-medium">{vehicle.driver}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1.5 rounded">
            <Navigation className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Current Speed</p>
            <p className="text-sm font-medium">{currentSpeed} km/h</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1.5 rounded">
            <MapIcon className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Location Status</p>
            <p className="text-sm font-medium">
              {isMoving ? "On Route" : "Parked"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1.5 rounded">
            <Clock className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Last Updated</p>
            <p className="text-sm font-medium">
              {format(lastUpdate, "dd MMM yyyy, HH:mm")}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1.5 rounded">
            <Fuel className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Fuel Level</p>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
              <div 
                className={`h-full rounded-full ${
                  vehicle.fuelLevel > 70 ? "bg-green-500" : 
                  vehicle.fuelLevel > 30 ? "bg-amber-500" : "bg-red-500"
                }`}
                style={{ width: `${vehicle.fuelLevel}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
