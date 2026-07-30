import { NetworkDevice } from './types';

// Map -30 (close) to -95 (far) to distance (pixels)
function getDistance(signal: number): number {
  const minSignal = -30;
  const maxSignal = -95;
  const minDistance = 120;
  const maxDistance = 650;
  
  const clamped = Math.max(maxSignal, Math.min(minSignal, signal));
  const ratio = (clamped - minSignal) / (maxSignal - minSignal);
  
  return minDistance + ratio * (maxDistance - minDistance);
}

// Generate deterministic x,y coordinates
function generatePosition(signal: number, angleDegrees: number) {
  const distance = getDistance(signal);
  const angle = (angleDegrees * Math.PI) / 180;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
  };
}

export const dummyDevices: NetworkDevice[] = [
  {
    id: 'dev-1',
    ssid: 'Home_Net_5G',
    mac: '1A:2B:3C:4D:5E:6F',
    signalStrength: -40,
    type: 'router',
    ...generatePosition(-40, 45) // Closer, Top-Right
  },
  {
    id: 'dev-2',
    ssid: 'Johns_iPhone',
    mac: 'FF:EE:DD:CC:BB:AA',
    signalStrength: -55,
    type: 'smartphone',
    ...generatePosition(-55, 120) // Bottom-Right
  },
  {
    id: 'dev-3',
    ssid: 'Work_MacBook',
    mac: '11:22:33:44:55:66',
    signalStrength: -65,
    type: 'laptop',
    ...generatePosition(-65, -30) // Top-Left
  },
  {
    id: 'dev-4',
    ssid: 'Gaming-PC',
    mac: '99:88:77:66:55:44',
    signalStrength: -32,
    type: 'desktop',
    ...generatePosition(-32, -150) // Very close, Bottom-Left
  },
  {
    id: 'dev-5',
    ssid: 'Hidden Network',
    mac: 'FE:DC:BA:98:76:54',
    signalStrength: -85,
    type: 'unknown',
    ...generatePosition(-85, 210) // Far, Bottom
  },
  {
    id: 'dev-6',
    ssid: 'Neighbor_WiFi',
    mac: '01:23:45:67:89:AB',
    signalStrength: -92,
    type: 'router',
    ...generatePosition(-92, -60) // Very Far, Top
  },
];
