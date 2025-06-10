
import { GPSData, TeltonikaFMB920Data, GPSDataCallback } from '@/types/gps';

export class WebSocketConnection {
  private wsConnection: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private subscribers: Map<string, GPSDataCallback> = new Map();

  constructor(private onDataReceived: (data: GPSData) => void) {}

  connect(serverUrl: string = 'ws://localhost:8080/gps-tracking') {
    console.log('Attempting to connect to GPS tracking server:', serverUrl);
    try {
      this.wsConnection = new WebSocket(serverUrl);
      
      this.wsConnection.onopen = () => {
        console.log('Connected to GPS tracking server');
        this.reconnectAttempts = 0;
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
        this.attemptReconnect(serverUrl);
      };

      this.wsConnection.onerror = (error) => {
        console.error('GPS tracking connection error:', error);
      };
    } catch (error) {
      console.error('Failed to connect to GPS tracking server:', error);
      throw error;
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
      console.log('Max reconnection attempts reached');
    }
  }

  private handleGPSData(rawData: TeltonikaFMB920Data) {
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
    this.onDataReceived(gpsData);
  }

  sendSubscription(deviceId: string) {
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify({
        action: 'subscribe',
        deviceId: deviceId
      }));
      console.log('Sent subscription message to server for device:', deviceId);
    }
  }

  sendUnsubscription(deviceId: string) {
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify({
        action: 'unsubscribe',
        deviceId: deviceId
      }));
    }
  }

  disconnect() {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  isConnected(): boolean {
    return this.wsConnection?.readyState === WebSocket.OPEN;
  }
}
