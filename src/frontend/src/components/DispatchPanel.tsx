import React, { useState } from 'react';
import { Send, CheckCircle2, AlertOctagon, MapPin } from 'lucide-react';
import type { VillageThreat } from '../types';
import { FeaturePhoneMockup } from './FeaturePhoneMockup';
import { AudioPlayer } from './AudioPlayer';

interface DispatchPanelProps {
  village: VillageThreat | null;
  onConfirmDispatch: (villageId: string) => void;
}

export const DispatchPanel: React.FC<DispatchPanelProps> = ({ village, onConfirmDispatch }) => {
  const [dispatchSuccess, setDispatchSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleDispatch = () => {
    if (!village) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setDispatchSuccess(true);
      onConfirmDispatch(village.id);
      setTimeout(() => setDispatchSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="w-[400px] h-full bg-white border-l-4 border-blue-900 flex flex-col z-20 shadow-xl overflow-y-auto">
      {/* Panel Top Header */}
      <div className="bg-blue-900 text-white p-4 border-b-4 border-black">
        <div className="text-xs font-black uppercase tracking-widest text-blue-200">
          COMMUNICATION DISPATCH
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight text-white leading-none mt-1">
          Dispatch Control Panel
        </h2>
      </div>

      {/* Content Body */}
      <div className="p-4 space-y-4 flex-1">
        {/* Selected Village Info Summary Card */}
        {village ? (
          <div className="bg-slate-100 border-2 border-black p-3.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                TARGET RECIPIENT
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-black uppercase border border-black ${
                  village.status === 'DISPATCHED'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-amber-500 text-black'
                }`}
              >
                {village.status}
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-950 flex items-center space-x-1.5">
              <MapPin className="w-5 h-5 text-blue-900" />
              <span>{village.name}</span>
            </h3>

            <div className="mt-2 space-y-1 text-xs font-bold text-slate-900">
              <div className="flex justify-between border-b border-slate-300 pb-1">
                <span className="text-slate-600">Block / District:</span>
                <span>{village.block}, {village.district}</span>
              </div>
              <div className="flex justify-between border-b border-slate-300 pb-1">
                <span className="text-slate-600">Contact Officer:</span>
                <span className="text-right font-black">{village.contactPerson}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Mobile Number:</span>
                <span className="font-black text-blue-900">{village.contactPhone}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 border-2 border-black text-xs font-bold text-amber-950">
            ⚠️ Select a village from the Emergency Ledger on the left panel to review message and dispatch alerts.
          </div>
        )}

        {/* Feature Phone Bengali SMS Mockup */}
        <div>
          <div className="text-xs font-black text-slate-900 uppercase mb-1 flex items-center justify-between">
            <span>[1] Feature Phone SMS Preview</span>
            <span className="text-[10px] font-extrabold text-blue-900">GEMINI BENGALI AI</span>
          </div>
          <FeaturePhoneMockup village={village} />
        </div>

        {/* ElevenLabs Voice Audio Player Component */}
        <div>
          <div className="text-xs font-black text-slate-900 uppercase mb-1">
            [2] Voice Broadcast Audio Stream
          </div>
          <AudioPlayer village={village} />
        </div>

        {/* Success Alert Notification Banner */}
        {dispatchSuccess && (
          <div className="bg-emerald-700 text-white p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center space-x-2 animate-bounce">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <div className="text-xs font-black uppercase">DISPATCH BROADCAST SUCCESSFUL</div>
              <div className="text-[11px] font-bold">
                Twilio Voice Call & SMS Sent to {village?.contactPerson}
              </div>
            </div>
          </div>
        )}

        {/* High-Contrast Action Buttons */}
        <div className="pt-2 space-y-2.5">
          <button
            onClick={handleDispatch}
            disabled={!village || isSending}
            className={`w-full gov-btn flex items-center justify-center space-x-2 p-3 font-black text-sm uppercase tracking-wider text-white bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50`}
          >
            {isSending ? (
              <span>TRANSMITTING DISPATCH...</span>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>CONFIRM & DISPATCH VIA TWILIO</span>
              </>
            )}
          </button>

          <button
            onClick={() => alert('Escalated to State Disaster Management Headquarters!')}
            className="w-full gov-btn flex items-center justify-center space-x-2 p-2.5 font-bold text-xs uppercase tracking-wider text-white bg-red-800 hover:bg-red-900"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>ELEVATE TO STATE CONTROL ROOM</span>
          </button>
        </div>
      </div>

      {/* Right Panel Footer Status */}
      <div className="p-3 bg-slate-100 border-t-2 border-black text-[10px] font-extrabold text-slate-700 text-center uppercase">
        ENCRYPTED GOVERNMENT DISPATCH NODE • STATE OF WEST BENGAL
      </div>
    </div>
  );
};
