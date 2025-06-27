
import { telematicsService, VehicleData as TelematicsVehicleData } from '../telematicsService';
import { GPSData } from '@/types/gps';

export class TelematicsIntegration {
  private telematicsInterval: NodeJS.Timeout | null = null;
  private isPolling: boolean = false;

  constructor(private onDataReceived: (data: GPSData) => void) {}

  startPolling() {
    const telematicsStatus = telematicsService.getStatus();
    
    if (telematicsStatus.enabled && telematicsStatus.configured && !this.isPolling) {
      console.log('Starting telematics polling for provider:', telematicsStatus.provider);
      this.isPolling = true;
      
      // Initial fetch
      this.fetchTelematicsData();
      
      // Set up periodic polling
      this.telematicsInterval = setInterval(async () => {
        await this.fetchTelematicsData();
      }, 30000); // Poll every 30 seconds
    } else {
      console.log('Telematics not enabled or configured, skipping polling');
    }
  }

  private async fetchTelematicsData() {
    try {
      console.log('Fetching telematics data...');
      const vehicleData = await telematicsService.getVehicleData();
      
      if (vehicleData && vehicleData.length > 0) {
        console.log(`Received data for ${vehicleData.length} vehicles from telematics`);
        vehicleData.forEach(vehicle => {
          const gpsData = this.convertTelematicsToGPS(vehicle);
          this.onDataReceived(gpsData);
        });
      } else {
        console.log('No vehicle data received from telematics service');
      }
    } catch (error) {
      console.error('Error fetching telematics data:', error);
    }
  }

  stopPolling() {
    if (this.telematicsInterval) {
      clearInterval(this.telematicsInterval);
      this.telematicsInterval = null;
      this.isPolling = false;
      console.log('Stopped telematics polling');
    }
  }

  private convertTelematicsToGPS(telematicsData: TelematicsVehicleData): GPSData {
    return {
      deviceId: telematicsData.deviceId,
      timestamp: telematicsData.timestamp,
      latitude: telematicsData.latitude,
      longitude: telematicsData.longitude,
      altitude: 0, // Not typically provided by telematics
      speed: telematicsData.speed,
      heading: telematicsData.heading,
      satellites: 8, // Default value since not provided
      hdop: 1.0, // Default value since not provided
      ignition: telematicsData.engineStatus,
      voltage: 12.0, // Default value since not provided
      fuelLevel: telematicsData.fuelLevel,
      temperature: telematicsData.temperature
    };
  }

  // Method to get current vehicle data synchronously
  async getCurrentVehicleData(): Promise<GPSData[]> {
    try {
      const vehicleData = await telematicsService.getVehicleData();
      return vehicleData.map(vehicle => this.convertTelematicsToGPS(vehicle));
    } catch (error) {
      console.error('Error getting current vehicle data:', error);
      return [];
    }
  }
}
