import React from 'react';
import { useFitness } from '../context/FitnessContext';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export const OfflineStatusBanner: React.FC = () => {
  const { isOnline, offlineQueue, flushOfflineQueue, t } = useFitness();

  if (isOnline && offlineQueue.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 text-white text-xs px-4 py-2 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <>
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong className="text-amber-300">{t.offline}:</strong> {t.offlineNotice}
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Back online. {offlineQueue.length} {t.pendingSync}.
              </span>
            </>
          )}
        </div>

        {offlineQueue.length > 0 && isOnline && (
          <button
            onClick={flushOfflineQueue}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.syncNow}</span>
          </button>
        )}
      </div>
    </div>
  );
};
