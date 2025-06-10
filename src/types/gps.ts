
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

export type GPSDataCallback = (data: GPSData) => void;
