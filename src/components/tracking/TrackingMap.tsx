
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import { Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define Kenya's center point
const KENYA_CENTER: LatLngExpression = [-1.2921, 36.8219]; // Nairobi

// Custom marker icon for vehicles
const createVehicleIcon = (isMoving: boolean) => {
  const color = isMoving ? "#22c55e" : "#f97316";
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14.5 6.5a2.5 2.5 0 0 0-5 0v6a2.5 2.5 0 0 0 5 0z"></path>
        <path d="M7.5 12.5h9M16.5 8.5a2 2 0 0 0 0-3H12a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h1a3 3 0 0 0 6 0h4a2 2 0 0 0 2-2v-3a4 4 0 0 0-4-4z"></path>
        <circle cx="9.5" cy="17.5" r="2.5"></circle>
        <circle cx="15.5" cy="17.5" r="2.5"></circle>
      </svg>
    `)}`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

// Map recenter component
const MapRecenter = ({ position }: { position: LatLngExpression }) => {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  
  return null;
};

interface PathPoint {
  position: [number, number];
  timestamp: string;
}

interface TrackingMapProps {
  position?: LatLngExpression;
  vehicle?: any;
  isMoving?: boolean;
  showPath?: boolean;
  pathData?: PathPoint[];
}

export function TrackingMap({ 
  position = KENYA_CENTER, 
  vehicle, 
  isMoving = false,
  showPath = false,
  pathData = []
}: TrackingMapProps) {
  // Reference to access map methods
  const mapRef = useRef<any>(null);
  
  // Create path coordinates for polyline if pathData exists
  const pathCoordinates = pathData.map(point => point.position);
  
  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Recenter map when position changes */}
      <MapRecenter position={position} />
      
      {/* Vehicle marker */}
      {vehicle && (
        <Marker 
          position={position} 
          icon={createVehicleIcon(isMoving)}
        >
          <Popup>
            <div className="p-1">
              <p className="font-bold">{vehicle.regNumber}</p>
              <p className="text-sm text-gray-600">Driver: {vehicle.driver}</p>
              <div className="mt-2">
                <Badge className={isMoving ? 
                  "bg-green-100 text-green-800 border-green-200" : 
                  "bg-orange-100 text-orange-800 border-orange-200"
                }>
                  {isMoving ? "Moving" : "Stationary"}
                </Badge>
              </div>
            </div>
          </Popup>
        </Marker>
      )}
      
      {/* Path history line */}
      {showPath && pathCoordinates.length > 0 && (
        <Polyline 
          positions={pathCoordinates} 
          color="#4f46e5" 
          weight={3} 
          opacity={0.7}
          dashArray="5, 10"
        />
      )}
    </MapContainer>
  );
}
