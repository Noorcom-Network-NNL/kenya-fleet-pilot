
import { GPSData, GPSDataCallback } from '@/types/gps';
import { WebSocketConnection } from './gps/websocketConnection';
import { TelematicsIntegration } from './gps/telematicsIntegration';
import { GPSSimulator } from './gps/gpsSimulator';

class GPSTrackingService {
  private wsConnection: WebSocketConnection;
  private telematicsIntegration: TelematicsIntegration;
  private gpsSimulator: GPSSimulator;
  private subscribers: Map<string, GPSDataCallback> = new Map();

  constructor() {
    this.wsConnection = new WebSocketConnection(this.notifySubscribers.bind(this));
    this.telematicsIntegration = new TelematicsIntegration(this.notifySubscribers.bind(this));
    this.gpsSimulator = new GPSSimulator(this.notifySubscribers.bind(this));
  }

  // Connect to GPS tracking server
  connect(serverUrl: string = 'ws://localhost:8080/gps-tracking') {
    console.log('Attempting to connect to GPS tracking server:', serverUrl);
    try {
      this.wsConnection.connect(serverUrl);
      this.telematicsIntegration.startPolling();
    } catch (error) {
      console.error('Failed to connect to GPS tracking server:', error);
      console.log('Falling back to simulation mode');
      this.telematicsIntegration.startPolling();
    }
  }

  // Notify subscribers of new GPS data
  private notifySubscribers(gpsData: GPSData) {
    const callback = this.subscribers.get(gpsData.deviceId);
    if (callback) {
      console.log('Sending GPS data to subscriber for device:', gpsData.deviceId);
      callback(gpsData);
    }
  }

  // Subscribe to GPS updates for a specific device
  subscribeToDevice(deviceId: string, callback: GPSDataCallback) {
    console.log('Subscribing to GPS updates for device:', deviceId);
    this.subscribers.set(deviceId, callback);
    
    // Send subscription message to server
    if (this.wsConnection.isConnected()) {
      this.wsConnection.sendSubscription(deviceId);
    } else {
      console.log('WebSocket not connected, subscription will be handled by simulation or telematics');
    }
  }

  // Unsubscribe from GPS updates for a specific device
  unsubscribeFromDevice(deviceId: string) {
    console.log('Unsubscribing from GPS updates for device:', deviceId);
    this.subscribers.delete(deviceId);
    
    // Stop simulation if running
    this.gpsSimulator.stopSimulation(deviceId);
    
    if (this.wsConnection.isConnected()) {
      this.wsConnection.sendUnsubscription(deviceId);
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

  // Simulate GPS data for demo purposes
  simulateGPSData(deviceId: string) {
    return this.gpsSimulator.startSimulation(deviceId);
  }

  disconnect() {
    console.log('Disconnecting GPS tracking service');
    this.wsConnection.disconnect();
    this.telematicsIntegration.stopPolling();
    this.gpsSimulator.stopAllSimulations();
    this.subscribers.clear();
  }
}

export const gpsTrackingService = new GPSTrackingService();
