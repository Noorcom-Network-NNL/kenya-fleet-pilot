
export interface TelematicsConfig {
  provider: 'safaricom' | 'wialon';
  apiKey: string;
  endpoint: string;
  enabled: boolean;
}

export interface VehicleData {
  deviceId: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: number;
  engineStatus: boolean;
  fuelLevel?: number;
  odometer?: number;
  temperature?: number;
}

export interface SafaricomM2MResponse {
  status: string;
  data: {
    devices: Array<{
      deviceId: string;
      location: {
        lat: number;
        lng: number;
      };
      speed: number;
      direction: number;
      timestamp: string;
      ignition: boolean;
      fuel?: number;
    }>;
  };
}

export interface WialonResponse {
  items: Array<{
    id: string;
    nm: string;
    pos: {
      x: number;
      y: number;
      s: number;
      c: number;
      t: number;
    };
    prms: {
      [key: string]: any;
    };
  }>;
}

class TelematicsService {
  private config: TelematicsConfig | null = null;

  // Initialize with configuration
  configure(config: TelematicsConfig) {
    this.config = config;
    console.log('Telematics service configured for provider:', config.provider);
  }

  // Get vehicle data from Safaricom M2M API
  private async fetchFromSafaricom(vehicleIds?: string[]): Promise<VehicleData[]> {
    if (!this.config) throw new Error('Telematics service not configured');

    const url = `${this.config.endpoint}/vehicles/location`;
    const headers = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`Safaricom API error: ${response.status}`);
      }

      const data: SafaricomM2MResponse = await response.json();
      
      return data.data.devices.map(device => ({
        deviceId: device.deviceId,
        vehicleId: device.deviceId,
        latitude: device.location.lat,
        longitude: device.location.lng,
        speed: device.speed,
        heading: device.direction,
        timestamp: new Date(device.timestamp).getTime(),
        engineStatus: device.ignition,
        fuelLevel: device.fuel
      }));
    } catch (error) {
      console.error('Error fetching from Safaricom M2M:', error);
      throw error;
    }
  }

  // Get vehicle data from Wialon API
  private async fetchFromWialon(vehicleIds?: string[]): Promise<VehicleData[]> {
    if (!this.config) throw new Error('Telematics service not configured');

    const url = `${this.config.endpoint}/wialon/ajax.html`;
    const params = {
      svc: 'core/search_items',
      params: JSON.stringify({
        spec: {
          itemsType: 'avl_unit',
          propName: 'sys_name',
          propValueMask: '*',
          sortType: 'sys_name'
        },
        force: 1,
        flags: 1025,
        from: 0,
        to: 0
      }),
      sid: this.config.apiKey
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(params)
      });

      if (!response.ok) {
        throw new Error(`Wialon API error: ${response.status}`);
      }

      const data: WialonResponse = await response.json();
      
      return data.items.map(item => ({
        deviceId: item.id,
        vehicleId: item.nm,
        latitude: item.pos.y,
        longitude: item.pos.x,
        speed: item.pos.s,
        heading: item.pos.c,
        timestamp: item.pos.t * 1000, // Wialon uses seconds
        engineStatus: item.prms?.engine_hours ? true : false,
        fuelLevel: item.prms?.fuel_level,
        odometer: item.prms?.mileage
      }));
    } catch (error) {
      console.error('Error fetching from Wialon:', error);
      throw error;
    }
  }

  // Get vehicle data based on configured provider
  async getVehicleData(vehicleIds?: string[]): Promise<VehicleData[]> {
    if (!this.config || !this.config.enabled) {
      console.log('Telematics service disabled or not configured');
      return [];
    }

    try {
      switch (this.config.provider) {
        case 'safaricom':
          return await this.fetchFromSafaricom(vehicleIds);
        case 'wialon':
          return await this.fetchFromWialon(vehicleIds);
        default:
          throw new Error(`Unsupported telematics provider: ${this.config.provider}`);
      }
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      return [];
    }
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    if (!this.config) {
      throw new Error('Telematics service not configured');
    }

    try {
      const data = await this.getVehicleData();
      console.log('Connection test successful, received data for', data.length, 'vehicles');
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Get service status
  getStatus(): { provider: string | null; enabled: boolean; configured: boolean } {
    return {
      provider: this.config?.provider || null,
      enabled: this.config?.enabled || false,
      configured: this.config !== null
    };
  }
}

export const telematicsService = new TelematicsService();
