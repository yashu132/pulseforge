import React, { useEffect, useRef } from 'react';
import { useFitness } from '../context/FitnessContext';
import { HEART_RATE_ZONES } from '../services/bluetooth';
import { Heart, Activity, Radio, AlertCircle, Zap } from 'lucide-react';

export const HeartRateMonitor: React.FC = () => {
  const {
    biometrics,
    liveHrHistory,
    t,
    isSimulating,
    toggleSimulator,
    simulationIntensity,
    setSimulationIntensity,
    pairWebBluetooth,
    bluetoothError,
    activeDevice,
  } = useFitness();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Smooth ECG waveform canvas renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Dark background with faint telemetry grid
      ctx.fillStyle = '#0b0f19';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 20;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ECG wave generation
      ctx.strokeStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 8;
      ctx.lineWidth = 2.2;
      ctx.beginPath();

      const midY = height / 2;
      const currentBpm = biometrics.heartRate || 72;
      const wavelength = Math.max(70, Math.min(180, Math.floor(6000 / currentBpm)));

      for (let x = 0; x < width; x++) {
        const cycleX = (x + step) % wavelength;
        let offset = 0;

        // P wave
        if (cycleX > wavelength * 0.15 && cycleX < wavelength * 0.25) {
          offset = -Math.sin(((cycleX - wavelength * 0.15) / (wavelength * 0.1)) * Math.PI) * 8;
        }
        // Q dip
        else if (cycleX >= wavelength * 0.28 && cycleX < wavelength * 0.32) {
          offset = 6;
        }
        // R spike (peak)
        else if (cycleX >= wavelength * 0.32 && cycleX < wavelength * 0.38) {
          const progress = (cycleX - wavelength * 0.32) / (wavelength * 0.06);
          offset = -Math.sin(progress * Math.PI) * (height * 0.42);
        }
        // S dip
        else if (cycleX >= wavelength * 0.38 && cycleX < wavelength * 0.44) {
          offset = 12;
        }
        // T wave
        else if (cycleX > wavelength * 0.52 && cycleX < wavelength * 0.68) {
          offset = -Math.sin(((cycleX - wavelength * 0.52) / (wavelength * 0.16)) * Math.PI) * 14;
        }

        const y = midY + offset;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      // Scanning indicator dot
      const leadX = (step * 2) % width;
      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.arc(leadX, midY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Advance step based on BPM speed
      step += Math.max(1.2, currentBpm / 45);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [biometrics.heartRate]);

  const activeZone = HEART_RATE_ZONES.find((z) => z.key === biometrics.zone) || HEART_RATE_ZONES[0];
  const pulseDuration = `${Math.max(0.3, Math.min(1.5, 60 / (biometrics.heartRate || 72)))}s`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Header telemetry info */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-inner"
            style={{ backgroundColor: `${activeZone.color}22` }}
          >
            <Heart
              className="w-6 h-6 transition-transform"
              style={{
                color: activeZone.color,
                animation: `heart-beat ${pulseDuration} ease-in-out infinite`,
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                {t.realtimePulse}
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeDevice ? activeDevice.name : t.simulatorActive} · {activeZone.name}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => pairWebBluetooth()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-blue-500" />
            <span>Pair BLE</span>
          </button>

          <button
            onClick={toggleSimulator}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isSimulating
                ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Stream: On' : 'Stream: Off'}</span>
          </button>
        </div>
      </div>

      {bluetoothError && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{bluetoothError}</span>
        </div>
      )}

      {/* Main Metric & ECG Wave Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* BPM display */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
          <span className="text-xs uppercase tracking-wider text-slate-500 font-mono">
            {t.liveBpm}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {biometrics.heartRate}
            </span>
            <span className="text-sm font-semibold text-slate-500">BPM</span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-2">
            <div>
              <span>HRV: </span>
              <strong className="text-slate-700 dark:text-slate-200 font-mono tabular-nums">{biometrics.hrvMs} ms</strong>
            </div>
            <div>
              <span>Resting: </span>
              <strong className="text-slate-700 dark:text-slate-200 font-mono tabular-nums">62 BPM</strong>
            </div>
            <div>
              <span>SpO2: </span>
              <strong className="text-slate-700 dark:text-slate-200 font-mono tabular-nums">{biometrics.bloodOxygenPercent}%</strong>
            </div>
          </div>
        </div>

        {/* Dynamic Waveform Canvas */}
        <div className="md:col-span-2 relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <canvas
            ref={canvasRef}
            width={600}
            height={130}
            className="w-full h-32 block bg-[#0b0f19]"
          />
          <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[10px] text-slate-400 font-mono bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>25mm/s · Lead II</span>
          </div>
        </div>
      </div>

      {/* Simulator Intensity Adjuster */}
      {isSimulating && (
        <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Simulated Cardiac Effort Level:
            </span>
            <span className="text-xs font-mono text-slate-500 capitalize">{simulationIntensity}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(['rest', 'warmup', 'cardio', 'sprint'] as const).map((intensity) => (
              <button
                key={intensity}
                onClick={() => setSimulationIntensity(intensity)}
                className={`py-1.5 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer whitespace-nowrap ${
                  simulationIntensity === intensity
                    ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                }`}
              >
                {intensity}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zone bars */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span className="font-medium text-slate-900 dark:text-slate-200">{t.heartRateZones}</span>
          <span className="font-mono">{activeZone.range}</span>
        </div>

        <div className="grid grid-cols-6 gap-1 h-3 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 p-0.5">
          {HEART_RATE_ZONES.map((zone) => {
            const isCurrent = zone.key === biometrics.zone;
            return (
              <div
                key={zone.key}
                style={{ backgroundColor: zone.color }}
                className={`h-full rounded-sm transition-all ${
                  isCurrent ? 'ring-2 ring-white dark:ring-slate-950 scale-y-110 shadow-sm' : 'opacity-40'
                }`}
                title={`${zone.name} (${zone.range})`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>{HEART_RATE_ZONES[0].name}</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">{activeZone.description}</span>
          <span>{HEART_RATE_ZONES[5].name}</span>
        </div>
      </div>
    </div>
  );
};
