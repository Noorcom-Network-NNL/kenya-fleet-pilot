
import { useState, useEffect, useCallback } from "react";

// Demo vehicle data
const demoVehicles = [
  {
    id: 1,
    regNumber: "KBZ 123A",
    make: "Toyota",
    model: "Hilux",
    year: 2021,
    status: "active",
    driver: "John Mwangi",
    fuelLevel: 75,
  },
  {
    id: 2,
    regNumber: "KCY 456B",
    make: "Isuzu",
    model: "D-Max",
    year: 2020,
    status: "maintenance",
    driver: "Sarah Wanjiku",
    fuelLevel: 45,
  },
  {
    id: 3,
    regNumber: "KDA 789C",
    make: "Mitsubishi",
    model: "Pajero",
    year: 2022,
    status: "active",
    driver: "David Kariuki",
    fuelLevel: 90,
  },
  {
    id: 4,
    regNumber: "KBD 321D",
    make: "Nissan",
    model: "Navara",
    year: 2019,
    status: "idle",
    driver: "Mary Akinyi",
    fuelLevel: 60,
  },
  {
    id: 5,
    regNumber: "KCA 654E",
    make: "Toyota",
    model: "Land Cruiser",
    year: 2018,
    status: "issue",
    driver: "Peter Omondi",
    fuelLevel: 20,
  }
];

// Nairobi area coordinates for demo
const nairobiCoords = {
  center: [-1.2921, 36.8219], // Nairobi City Center
  radius: 0.05, // Roughly 5km radius
};

// Generate random coordinate within Nairobi area
const getRandomCoordinate = () => {
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * nairobiCoords.radius;
  
  const lat = nairobiCoords.center[0] + distance * Math.cos(angle);
  const lng = nairobiCoords.center[1] + distance * Math.sin(angle);
  
  return [lat, lng] as [number, number];
};

// Generate path history
const generatePathHistory = (count: number) => {
  const now = new Date();
  const path = [];
  
  for (let i = count; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 5 * 60000); // 5 min intervals
    
    path.push({
      position: getRandomCoordinate(),
      timestamp: timestamp.toISOString()
    });
  }
  
  return path;
};

export function useVehicleTracking() {
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([-1.2921, 36.8219]);
  const [vehicleHistory, setVehicleHistory] = useState<any[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Select a vehicle
  const selectVehicle = useCallback((vehicle: any) => {
    setSelectedVehicle(vehicle);
    
    // Generate initial position for the vehicle
    const initialPosition = getRandomCoordinate();
    setCurrentPosition(initialPosition);
    
    // Generate path history
    const history = generatePathHistory(8);
    setVehicleHistory(history);
    
    // Random speed based on status
    if (vehicle.status === "active") {
      setIsMoving(true);
      setCurrentSpeed(Math.floor(Math.random() * 40) + 30); // 30-70 km/h
    } else {
      setIsMoving(false);
      setCurrentSpeed(0);
    }
    
    setLastUpdate(new Date());
  }, []);
  
  // Simulate vehicle movement for the demo
  useEffect(() => {
    if (!selectedVehicle || !isMoving) return;
    
    const interval = setInterval(() => {
      // Move the vehicle slightly in a random direction
      setCurrentPosition(prev => {
        const latChange = (Math.random() - 0.5) * 0.001;
        const lngChange = (Math.random() - 0.5) * 0.001;
        return [prev[0] + latChange, prev[1] + lngChange];
      });
      
      // Randomly vary the speed a bit
      setCurrentSpeed(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newSpeed = prev + change;
        return newSpeed >= 20 && newSpeed <= 80 ? newSpeed : prev;
      });
      
      setLastUpdate(new Date());
      
      // Occasionally add to history
      if (Math.random() > 0.7) {
        setVehicleHistory(prev => [
          ...prev,
          {
            position: currentPosition,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [selectedVehicle, isMoving, currentPosition]);
  
  return {
    selectedVehicle,
    vehicleData: demoVehicles,
    currentPosition,
    vehicleHistory,
    selectVehicle,
    isMoving,
    lastUpdate,
    currentSpeed
  };
}
