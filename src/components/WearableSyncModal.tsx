import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { APP_IMAGES } from '../assets/images';
import {
  X,
  Watch,
  BatteryCharging,
  Radio,
  Check,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface WearableSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WearableSyncModal: React.FC<WearableSyncModalProps> = ({ isOpen, onClose }) => {
  const {
    wearables,
    activeDevice,
    connectWearable,
    disconnectWearable,
    pairWebBluetooth,
    bluetoothError,
    t,
  } = useFitness();

  const [showNoiseGuide, setShowNoiseGuide] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="relative h-32 bg-slate-950 overflow-hidden shrink-0">
          <img
            src={APP_IMAGES.wearableHero}
            alt="Wearable Device Studio"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <div>
              <h3 className="font-display text-lg font-bold">Wearable Synchronization Hub</h3>
              <p className="text-xs text-slate-300">Direct Web Bluetooth pairing for Noise, Apple, Garmin & Polar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {bluetoothError && (
            <div className="p-3 text-xs rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-900">
              {bluetoothError}
            </div>
          )}

          {/* Noise Watch Dedicated Real-Time Connect Spotlight */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  NOISE
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    Connect Your Noise Watch
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded font-semibold">
                      Real-Time BLE
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Supports ColorFit Pulse, Pro, Ultra, Halo, and Force series
                  </p>
                </div>
              </div>

              <button
                onClick={() => pairWebBluetooth({ targetBrand: 'noise' })}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Pair Noise Watch</span>
              </button>
            </div>

            {/* Noise Pairing Instructions Collapsible */}
            <div className="border-t border-emerald-500/20 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setShowNoiseGuide((v) => !v)}
                className="flex items-center justify-between w-full text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <span className="flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  How to broadcast live telemetry from your Noise Watch
                </span>
                {showNoiseGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showNoiseGuide && (
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-300 mt-2 pl-1 leading-relaxed">
                  <li>
                    On your Noise Watch (or in the <strong>NoiseFit App</strong>), turn on <strong>"Continuous Heart Rate"</strong> or start a workout mode (e.g. Outdoor Walk / Run).
                  </li>
                  <li>
                    Ensure Bluetooth is active on your device and the watch is within 5 meters.
                  </li>
                  <li>
                    Click <strong>"Pair Noise Watch"</strong> above. When the browser prompt opens, choose your <strong>Noise ColorFit / NoiseFit</strong> device to stream real-time cardiac BPM!
                  </li>
                </ol>
              )}
            </div>
          </div>

          {/* General Web Bluetooth GATT Pair */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-blue-500" />
                Generic BLE Heart Rate Device Scan
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Scan for any chest strap or smartwatch broadcasting standard BLE GATT (0x180D).
              </p>
            </div>
            <button
              onClick={() => pairWebBluetooth({ acceptAll: true })}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-white dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors shadow-sm cursor-pointer whitespace-nowrap shrink-0"
            >
              Scan All BLE
            </button>
          </div>

          {/* Linked Devices List */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
              Saved & Ready Wearables
            </span>

            <div className="space-y-2">
              {wearables.map((device) => {
                const isSelected = device.isConnected;
                const isNoise = device.brand === 'noise' || device.name.toLowerCase().includes('noise');

                return (
                  <div
                    key={device.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-emerald-500/80 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? 'bg-emerald-500 text-white'
                            : isNoise
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <Watch className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                            {device.name}
                          </h4>
                          {isNoise && (
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded font-mono font-medium">
                              NoiseFit
                            </span>
                          )}
                          {isSelected && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <Check className="w-3 h-3" />
                              Active
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <BatteryCharging className="w-3 h-3 text-emerald-500" />
                            {device.batteryLevel}%
                          </span>
                          <span>·</span>
                          <span className="capitalize">{device.connectionType}</span>
                          <span>·</span>
                          <span>Synced {device.lastSyncTime}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {isSelected ? (
                        <button
                          onClick={() => disconnectWearable(device.id)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                        >
                          {t.disconnect}
                        </button>
                      ) : (
                        <button
                          onClick={() => connectWearable(device.id)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors cursor-pointer"
                        >
                          {t.connectWearable}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-xs text-slate-500">
          <span>Active Real-Time Feed: <strong className="text-slate-800 dark:text-slate-200">{activeDevice ? activeDevice.name : 'Wearable Simulator'}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
