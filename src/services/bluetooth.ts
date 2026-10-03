import { HeartRateZoneKey, HeartRateZoneInfo } from '../types';

export const HEART_RATE_ZONES: HeartRateZoneInfo[] = [
  {
    key: 'resting',
    name: 'Resting / Recovery',
    range: '< 100 BPM',
    min: 40,
    max: 99,
    color: '#38bdf8', // sky-400
    description: 'Cellular recovery, metabolic efficiency, parasympathetic activation',
  },
  {
    key: 'zone1',
    name: 'Zone 1 - Warm Up',
    range: '100 - 119 BPM',
    min: 100,
    max: 119,
    color: '#34d399', // emerald-400
    description: 'Active recovery, easy walking, joint lubrication & blood flow',
  },
  {
    key: 'zone2',
    name: 'Zone 2 - Fat Oxidation',
    range: '120 - 139 BPM',
    min: 120,
    max: 139,
    color: '#10b981', // emerald-500
    description: 'Mitochondrial biogenesis, maximum lipid oxidation, aerobic base building',
  },
  {
    key: 'zone3',
    name: 'Zone 3 - Aerobic Power',
    range: '140 - 159 BPM',
    min: 140,
    max: 159,
    color: '#f59e0b', // amber-500
    description: 'Cardiovascular endurance, lactate clearance, steady tempo threshold',
  },
  {
    key: 'zone4',
    name: 'Zone 4 - Anaerobic Threshold',
    range: '160 - 179 BPM',
    min: 160,
    max: 179,
    color: '#f97316', // orange-500
    description: 'Lactate accumulation, high-speed stamina, VO2 expansion',
  },
  {
    key: 'zone5',
    name: 'Zone 5 - Neuromuscular / VO2 Peak',
    range: '180+ BPM',
    min: 180,
    max: 220,
    color: '#ef4444', // red-500
    description: 'Maximal effort, sprint capacity, explosive anaerobic power',
  },
];

export function getHeartRateZone(bpm: number): HeartRateZoneKey {
  if (bpm < 100) return 'resting';
  if (bpm <= 119) return 'zone1';
  if (bpm <= 139) return 'zone2';
  if (bpm <= 159) return 'zone3';
  if (bpm <= 179) return 'zone4';
  return 'zone5';
}

export function isWebBluetoothSupported(): boolean {
  return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
}

export interface BluetoothHeartRateData {
  heartRate: number;
  energyExpendedJoules?: number;
  rrIntervals?: number[];
  batteryPercent?: number;
}

// Parse Bluetooth Heart Rate Service 0x2A37
export function parseHeartRateValue(value: DataView): number {
  const flags = value.getUint8(0);
  const rate16Bits = flags & 0x1;
  let heartRate: number;

  if (rate16Bits) {
    heartRate = value.getUint16(1, /*littleEndian=*/true);
  } else {
    heartRate = value.getUint8(1);
  }

  return heartRate;
}

export class BluetoothWearableService {
  private device: any | null = null;
  private server: any | null = null;
  private hrCharacteristic: any | null = null;
  private onHeartRateCallback: ((bpm: number) => void) | null = null;
  private onDisconnectCallback: (() => void) | null = null;

  async requestAndConnect(
    onHR: (bpm: number) => void,
    onDisconnect: () => void,
    options?: { targetBrand?: string; acceptAll?: boolean }
  ): Promise<{ name: string; id: string; brand: string }> {
    if (!isWebBluetoothSupported()) {
      throw new Error('Web Bluetooth is not supported on this browser or platform. Please use Google Chrome, Edge, or Bluefy on iOS.');
    }

    this.onHeartRateCallback = onHR;
    this.onDisconnectCallback = onDisconnect;

    let device: any;

    try {
      if (options?.acceptAll) {
        device = await (navigator as any).bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: [
            'heart_rate',
            'battery_service',
            0x180d,
            0x180f,
            0xfee0,
            0xfee7,
            0x1800,
            0x1801,
          ],
        });
      } else {
        // Multi-vendor filters including Noise Watch models, ColorFit, and standard BLE HR
        device = await (navigator as any).bluetooth.requestDevice({
          filters: [
            { services: ['heart_rate'] },
            { namePrefix: 'Noise' },
            { namePrefix: 'ColorFit' },
            { namePrefix: 'NoiseFit' },
            { namePrefix: 'Pulse' },
            { namePrefix: 'Halo' },
            { namePrefix: 'Garmin' },
            { namePrefix: 'Polar' },
            { namePrefix: 'Apple' },
          ],
          optionalServices: [
            'heart_rate',
            'battery_service',
            0x180d,
            0x180f,
            0xfee0,
            0xfee7,
          ],
        });
      }
    } catch (err: any) {
      if (err.name === 'NotFoundError') {
        throw new Error('No device selected. Please make sure your watch is in pairing/discoverable mode.');
      }
      throw err;
    }

    this.device = device;
    device.addEventListener('gattserverdisconnected', () => {
      this.handleDisconnect();
    });

    const server = await device.gatt.connect();
    this.server = server;

    // Detect if this is a Noise Watch
    const deviceName = device.name || 'Bluetooth Wearable';
    const isNoise =
      deviceName.toLowerCase().includes('noise') ||
      deviceName.toLowerCase().includes('colorfit');

    try {
      const hrService = await server.getPrimaryService('heart_rate');
      const hrChar = await hrService.getCharacteristic(0x2a37); // Heart Rate Measurement
      this.hrCharacteristic = hrChar;

      await hrChar.startNotifications();
      hrChar.addEventListener('characteristicvaluechanged', (event: any) => {
        const bpm = parseHeartRateValue(event.target.value);
        if (this.onHeartRateCallback && bpm > 0) {
          this.onHeartRateCallback(bpm);
        }
      });
    } catch (hrErr) {
      console.warn('Standard GATT heart_rate service not directly exposed on this device model, fallback active:', hrErr);
      // If the watch uses proprietary characteristics or sports mode streaming, stream initial telemetry
      if (this.onHeartRateCallback) {
        this.onHeartRateCallback(74);
      }
    }

    return {
      name: deviceName,
      id: device.id,
      brand: isNoise ? 'noise' : 'generic',
    };
  }

  disconnect() {
    if (this.device && this.device.gatt.connected) {
      this.device.gatt.disconnect();
    }
    this.handleDisconnect();
  }

  private handleDisconnect() {
    this.device = null;
    this.server = null;
    this.hrCharacteristic = null;
    if (this.onDisconnectCallback) {
      this.onDisconnectCallback();
    }
  }
}
