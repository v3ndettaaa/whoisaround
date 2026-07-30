export type DeviceType = 'router' | 'smartphone' | 'laptop' | 'desktop' | 'unknown';

export interface NetworkDevice {
  id: string;
  ssid: string;
  mac: string;
  signalStrength: number; // dBm
  type: DeviceType;
  x: number;
  y: number;
}
