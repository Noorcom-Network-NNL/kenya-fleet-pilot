import { telematicsService, VehicleData as TelematicsVehicleData } from './telematicsService';

export interface GPSData {
  deviceId: string;
  timestamp: number;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  heading: number;
  satellites: number;
  hdop: number;
  ignition: boolean;
  voltage: number;
  temperature?: number;
  fuelLevel?: number;
}

export interface TeltonikaFMB920Data {
  imei: string;
  timestamp: number;
  priority: number;
  longitude: number;
  latitude: number;
  altitude: number;
  angle: number;
  satellites: number;
  speed: number;
  ioElements: {
    [key: string]: any;
  };
}

class GPSTrackingService {
  private wsConnection: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private subscribers: Map<string, (data: GPSData) => void> = new Map();
  private simulationIntervals: Map<string, NodeJS.Timeout> = new Map();
  private telematicsInterval: NodeJS.Timeout | null = null;

  // Connect to GPS tracking server (you'll need to replace with actual server URL)
  connect(serverUrl: string = 'ws://localhost:8080/gps-tracking') {
    console.log('Attempting to connect to GPS tracking server:', serverUrl);
    try {
      this.wsConnection = new WebSocket(serverUrl);
      
      this.wsConnection.onopen = () => {
        console.log('Connected to GPS tracking server');
        this.reconnectAttempts = 0;
        this.startTelematicsPolling();
      };

      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received GPS data from server:', data);
          this.handleGPSData(data);
        } catch (error) {
          console.error('Error parsing GPS data:', error);
        }
      };

      this.wsConnection.onclose = () => {
        console.log('GPS tracking connection closed');
        this.stopTelematicsPolling();
        this.attemptReconnect(serverUrl);
      };

      this.wsConnection.onerror = (error) => {
        console.error('GPS tracking connection error:', error);
      };
    } catch (error) {
      console.error('Failed to connect to GPS tracking server:', error);
      console.log('Falling back to simulation mode');
      this.startTelematicsPolling();
    }
  }

  // Start polling telematics service for real data
  private startTelematicsPolling() {
    const telematicsStatus = telematicsService.getStatus();
    
    if (telematicsStatus.enabled && telematicsStatus.configured) {
      console.log('Starting telematics polling for provider:', telematicsStatus.provider);
      
      this.telematicsInterval = setInterval(async () => {
        try {
          const vehicleData = await telematicsService.getVehicleData();
          vehicleData.forEach(vehicle => {
            const gpsData = this.convertTelematicsToGPS(vehicle);
            this.notifySubscribers(gpsData);
          });
        } catch (error) {
          console.error('Error fetching telematics data:', error);
        }
      }, 30000); // Poll every 30 seconds
    }
  }

  // Stop telematics polling
  private stopTelematicsPolling() {
    if (this.telematicsInterval) {
      clearInterval(this.telematicsInterval);
      this.telematicsInterval = null;
      console.log('Stopped telematics polling');
    }
  }

  // Convert telematics data to GPS format
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

  // Notify subscribers of new GPS data
  private notifySubscribers(gpsData: GPSData) {
    const callback = this.subscribers.get(gpsData.deviceId);
    if (callback) {
      console.log('Sending GPS data to subscriber for device:', gpsData.deviceId);
      callback(gpsData);
    }
  }

  private attemptReconnect(serverUrl: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect(serverUrl);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.log('Max reconnection attempts reached, staying in simulation mode');
      this.startTelematicsPolling();
    }
  }

  private handleGPSData(rawData: TeltonikaFMB920Data) {
    // Convert Teltonika FMB920 data format to our standard GPS data format
    const gpsData: GPSData = {
      deviceId: rawData.imei,
      timestamp: rawData.timestamp,
      latitude: rawData.latitude,
      longitude: rawData.longitude,
      altitude: rawData.altitude,
      speed: rawData.speed,
      heading: rawData.angle,
      satellites: rawData.satellites,
      hdop: rawData.ioElements?.hdop || 0,
      ignition: rawData.ioElements?.ignition || false,
      voltage: rawData.ioElements?.voltage || 0,
      temperature: rawData.ioElements?.temperature,
      fuelLevel: rawData.ioElements?.fuelLevel,
    };

    console.log('Processed GPS data:', gpsData);
    this.notifySubscribers(gpsData);
  }

  // Subscribe to GPS updates for a specific device
  subscribeToDevice(deviceId: string, callback: (data: GPSData) => void) {
    console.log('Subscribing to GPS updates for device:', deviceId);
    this.subscribers.set(deviceId, callback);
    
    // Send subscription message to server
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify({
        action: 'subscribe',
        deviceId: deviceId
      }));
      console.log('Sent subscription message to server for device:', deviceId);
    } else {
      console.log('WebSocket not connected, subscription will be handled by simulation or telematics');
    }
  }

  // Unsubscribe from GPS updates for a specific device
  unsubscribeFromDevice(deviceId: string) {
    console.log('Unsubscribing from GPS updates for device:', deviceId);
    this.subscribers.delete(deviceId);
    
    // Stop simulation if running
    const interval = this.simulationIntervals.get(deviceId);
    if (interval) {
      clearInterval(interval);
      this.simulationIntervals.delete(deviceId);
      console.log('Stopped simulation for device:', deviceId);
    }
    
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify({
        action: 'unsubscribe',
        deviceId: deviceId
      }));
    }
  }

  // Get historical GPS data for a device
  async getHistoricalData(deviceId: string, startTime: Date, endTime: Date): Promise<GPSData[]> {
    try {
      // This would typically call your backend API
      const response = await fetch(`/api/gps-history/${deviceId}?start=${startTime.toISOString()}&end=${endTime.toISOString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch historical GPS data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching historical GPS data:', error);
      return [];
    }
  }

  // Simulate GPS data for demo purposes (remove in production)
  simulateGPSData(deviceId: string) {
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
      this.notifySubscribers(gpsData);
    }, 2000);
    
    this.simulationIntervals.set(deviceId, interval);
    
    return () => {
      console.log('Cleaning up simulation for device:', deviceId);
      clearInterval(interval);
      this.simulationIntervals.delete(deviceId);
    };
  }

  disconnect() {
    console.log('Disconnecting GPS tracking service');
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
    
    this.stopTelematicsPolling();
    
    // Clear all simulations
    this.simulationIntervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.simulationIntervals.clear();
    
    this.subscribers.clear();
  }
}

export const gpsTrackingService = new GPSTrackingService();
