import React, { useState } from 'react';
import { WifiOff, Database, CheckCircle2, RefreshCw, Cpu, HardDrive, ShieldCheck, X, Zap } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { offlineModulesData } from '../data/mockData';

interface OfflineSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const OfflineSyncModal: React.FC<OfflineSyncModalProps> = ({ isOpen, onClose, lang }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(100);
  const [lastSyncTime, setLastSyncTime] = useState('2026-09-22 22:45:00');
  const t = translations[lang];

  if (!isOpen) return null;

  const handleForceSync = () => {
    setIsSyncing(true);
    setSyncProgress(25);
    setTimeout(() => setSyncProgress(65), 600);
    setTimeout(() => setSyncProgress(90), 1200);
    setTimeout(() => {
      setSyncProgress(100);
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleString());
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <WifiOff className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                {t.offlineReadyBadge}
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  100% PWA
                </span>
              </h3>
              <p className="text-xs text-slate-400">{t.offlineSubText}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Telemetry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex items-center space-x-3">
              <HardDrive className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Local Storage</p>
                <p className="text-sm font-mono font-bold text-slate-200">231.6 MB / 5 GB</p>
                <p className="text-[10px] text-emerald-400">IndexedDB & CacheStorage</p>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex items-center space-x-3">
              <Cpu className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Underground Mesh</p>
                <p className="text-sm font-mono font-bold text-cyan-300">14 Active Peers</p>
                <p className="text-[10px] text-cyan-400/80">Subterranean Lora/BLE Node</p>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex items-center space-x-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Data Integrity</p>
                <p className="text-sm font-mono font-bold text-emerald-300">Sha-256 Verified</p>
                <p className="text-[10px] text-slate-400">Zero Internet Required</p>
              </div>
            </div>
          </div>

          {/* Sync Progress Bar */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-400" />
                Underground Field Sync Status
              </span>
              <span className="font-mono text-slate-400">Last Synced: {lastSyncTime}</span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${syncProgress}%` }}
              />
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-[11px] text-slate-400 font-mono">
                {isSyncing ? `Syncing Local Logs to State Queue (${syncProgress}%)...` : 'All 14 Vocational Training Modules Ready Offline'}
              </span>
              <button
                onClick={handleForceSync}
                disabled={isSyncing}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg flex items-center space-x-1.5 transition shadow-md shadow-amber-500/20"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : t.syncNow}</span>
              </button>
            </div>
          </div>

          {/* Cached Modules List */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Cached Vocational AR Modules (14 Total)</span>
              <span className="text-[11px] text-emerald-400 font-normal">Offline ServiceWorker Ready</span>
            </h4>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {offlineModulesData.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-lg p-3 flex items-center justify-between transition"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div>
                      <h5 className="text-sm font-semibold text-slate-200">
                        {item.title[lang] || item.title.en}
                      </h5>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-mono text-amber-400/90">{item.sizeMB} MB</span>
                        <span>•</span>
                        <span>{item.version}</span>
                        <span>•</span>
                        <span className="text-slate-400">{item.meshPeers} Mesh Peers</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono flex items-center gap-1 border border-slate-700">
                    <Zap className="w-3 h-3 text-amber-400" />
                    Cached
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>{t.jharkhandStateTag}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
};
