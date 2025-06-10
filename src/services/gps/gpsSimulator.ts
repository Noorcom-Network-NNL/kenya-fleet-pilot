
import { GPSData } from '@/types/gps';

export class GPSSimulator {
  private simulationIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(private onDataReceived: (data: GPSData) => void) {}

  startSimulation(deviceId: string): () => void {
    console.log('Starting GPS simulation for device:', deviceId);
    
    // Clear any existing simulation for this device
    const existingInterval = this.simulationIntervals.get(deviceId);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    const nairobiCenter = [-1.2921, 36.8219];
    let currentLat = nairobiCenter[0];
    let currentLng = nairobiCenter[1];
    
    const interval = setInterval(() => {
      // Simulate slight movement
      currentLat += (Math.random() - 0.5) * 0.001;
      currentLng += (Math.random() - 0.5) * 0.001;
      
      const gpsData: GPSData = {
        deviceId,
        timestamp: Date.now(),
        latitude: currentLat,
        longitude: currentLng,
        altitude: 1650 + Math.random() * 50,
        speed: Math.floor(Math.random() * 60) + 20,
        heading: Math.floor(Math.random() * 360),
        satellites: Math.floor(Math.random() * 4) + 8,
        hdop: Math.random() * 2 + 1,
        ignition: Math.random() > 0.3,
        voltage: 12.0 + Math.random() * 2,
        temperature: 25 + Math.random() * 10,
        fuelLevel: Math.floor(Math.random() * 100)
      };
      
      console.log('Generated simulated GPS data:', gpsData);
      this.onDataReceived(gpsData);
    }, 2000);
    
    this.simulationIntervals.set(deviceId, interval);
    
    return () => {
      console.log('Cleaning up simulation for device:', deviceId);
      clearInterval(interval);
      this.simulationIntervals.delete(deviceId);
    };
  }

  stopSimulation(deviceId: string) {
    const interval = this.simulationIntervals.get(deviceId);
    if (interval) {
      clearInterval(interval);
      this.simulationIntervals.delete(deviceId);
      console.log('Stopped simulation for device:', deviceId);
    }
  }

  stopAllSimulations() {
    this.simulationIntervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.simulationIntervals.clear();
  }
}
