
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

// Kenya's center point (Nairobi)
const KENYA_CENTER = { lat: -1.2921, lng: 36.8219 };

interface PathPoint {
  position: [number, number];
  timestamp: string;
}

interface GoogleMapProps {
  position?: [number, number];
  vehicle?: any;
  isMoving?: boolean;
  showPath?: boolean;
  pathData?: PathPoint[];
}

export function GoogleMap({ 
  position, 
  vehicle, 
  isMoving = false,
  showPath = false,
  pathData = []
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [path, setPath] = useState<google.maps.Polyline | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        console.log('Initializing Google Maps...');
        
        const loader = new Loader({
          apiKey: "AIzaSyC4bCyXAlxBNvH97y9edw6_3MFvxiXz0Hw",
          version: "weekly",
          libraries: ["places"]
        });

        await loader.load();
        console.log('Google Maps API loaded successfully');

        if (!mapRef.current) return;

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: position ? { lat: position[0], lng: position[1] } : KENYA_CENTER,
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        });

        setMap(mapInstance);
        setIsLoading(false);
        console.log('Map initialized successfully');
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps. Please check your API key.');
        setIsLoading(false);
      }
    };

    initializeMap();
  }, []);

  // Update marker position when position changes
  useEffect(() => {
    if (!map || !position) return;

    console.log('Updating marker position:', position);

    // Remove existing marker
    if (marker) {
      marker.setMap(null);
    }

    // Create new marker
    const newMarker = new google.maps.Marker({
      position: { lat: position[0], lng: position[1] },
      map: map,
      title: vehicle ? `${vehicle.regNumber} - ${vehicle.driver}` : 'Vehicle',
      icon: {
        url: `data:image/svg+xml;base64,${btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="${isMoving ? '#22c55e' : '#f97316'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.5 6.5a2.5 2.5 0 0 0-5 0v6a2.5 2.5 0 0 0 5 0z"></path>
            <path d="M7.5 12.5h9M16.5 8.5a2 2 0 0 0 0-3H12a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h1a3 3 0 0 0 6 0h4a2 2 0 0 0 2-2v-3a4 4 0 0 0-4-4z"></path>
            <circle cx="9.5" cy="17.5" r="2.5"></circle>
            <circle cx="15.5" cy="17.5" r="2.5"></circle>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 16)
      }
    });

    // Add info window if vehicle data exists
    if (vehicle) {
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold;">${vehicle.regNumber}</h3>
            <p style="margin: 0; font-size: 14px; color: #666;">Driver: ${vehicle.driver}</p>
            <div style="margin-top: 8px;">
              <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; background-color: ${isMoving ? '#dcfce7' : '#fed7aa'}; color: ${isMoving ? '#166534' : '#9a3412'};">
                ${isMoving ? 'Moving' : 'Stationary'}
              </span>
            </div>
          </div>
        `
      });

      newMarker.addListener('click', () => {
        infoWindow.open(map, newMarker);
      });
    }

    setMarker(newMarker);

    // Center map on new position
    map.setCenter({ lat: position[0], lng: position[1] });
  }, [map, position, vehicle, isMoving]);

  // Update path when pathData changes
  useEffect(() => {
    if (!map || !showPath || pathData.length === 0) {
      if (path) {
        path.setMap(null);
        setPath(null);
      }
      return;
    }

    console.log('Updating path with points:', pathData.length);

    // Remove existing path
    if (path) {
      path.setMap(null);
    }

    // Create new path
    const pathCoordinates = pathData.map(point => ({
      lat: point.position[0],
      lng: point.position[1]
    }));

    const newPath = new google.maps.Polyline({
      path: pathCoordinates,
      geodesic: true,
      strokeColor: '#4f46e5',
      strokeOpacity: 0.7,
      strokeWeight: 3,
      map: map
    });

    setPath(newPath);
  }, [map, showPath, pathData]);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-4">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-sm text-gray-500">Please check your Google Maps API configuration.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  );
}
