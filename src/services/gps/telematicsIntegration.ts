
import { telematicsService, VehicleData as TelematicsVehicleData } from '../telematicsService';
import { GPSData } from '@/types/gps';

export class TelematicsIntegration {
  private telematicsInterval: NodeJS.Timeout | null = null;

  constructor(private onDataReceived: (data: GPSData) => void) {}

  startPolling() {
    const telematicsStatus = telematicsService.getStatus();
    
    if (telematicsStatus.enabled && telematicsStatus.configured) {
      console.log('Starting telematics polling for provider:', telematicsStatus.provider);
      
      this.telematicsInterval = setInterval(async () => {
        try {
          const vehicleData = await telematicsService.getVehicleData();
          vehicleData.forEach(vehicle => {
            const gpsData = this.convertTelematicsToGPS(vehicle);
            this.onDataReceived(gpsData);
          });
        } catch (error) {
          console.error('Error fetching telematics data:', error);
        }
      }, 30000); // Poll every 30 seconds
    }
  }

  stopPolling() {
    if (this.telematicsInterval) {
      clearInterval(this.telematicsInterval);
      this.telematicsInterval = null;
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
      satellites: 8, // Default value
      hdop: 1.0, // Default value
      ignition: telematicsData.engineStatus,
      voltage: 12.0, // Default value
      fuelLevel: telematicsData.fuelLevel,
      temperature: telematicsData.temperature
    };
  }
}
