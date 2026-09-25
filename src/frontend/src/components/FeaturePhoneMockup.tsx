import React from 'react';
import { Signal, Battery, Smartphone, MessageSquare } from 'lucide-react';
import type { VillageThreat } from '../types';

interface FeaturePhoneMockupProps {
  village: VillageThreat | null;
}

export const FeaturePhoneMockup: React.FC<FeaturePhoneMockupProps> = ({ village }) => {
  return (
    <div className="w-full bg-slate-900 border-4 border-slate-950 p-4 rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
      {/* Phone Brand / Earpiece Slot */}
      <div className="w-full flex flex-col items-center mb-2">
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mb-1"></div>
        <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
          SENTINEL CELL - GOVT DISPATCH
        </div>
      </div>

      {/* Retro LCD Screen Outer Frame */}
      <div className="w-full bg-slate-950 p-3 rounded-md border-2 border-slate-700">
        {/* LCD Screen Inner (Retro Monochromatic Green Display) */}
        <div className="lcd-screen p-3 rounded text-slate-950 min-h-[190px] flex flex-col justify-between">
          {/* LCD Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800/40 pb-1 text-[11px] font-bold">
            <div className="flex items-center space-x-1">
              <Signal className="w-3 h-3 text-emerald-900" />
              <span>BSNL 2G</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-3 h-3" />
              <span>SMS 1/1</span>
            </div>
            <div className="flex items-center space-x-1">
              <Battery className="w-3.5 h-3.5 text-emerald-900" />
              <span>100%</span>
            </div>
          </div>

          {/* LCD Content Body */}
          <div className="my-2">
            <div className="text-[11px] font-black uppercase text-emerald-950 mb-1 border-b border-emerald-800/30 pb-0.5">
              TO: {village ? village.contactPhone : 'NO SELECTION'}
            </div>
            <div className="text-xs font-semibold leading-relaxed font-sans text-slate-950">
              {village
                ? village.bengaliAlertText
                : 'জরুরি বার্তা প্রদর্শন করার জন্য বাম প্যানেল থেকে কোনো গ্রাম নির্বাচন করুন।'}
            </div>
          </div>

          {/* LCD Status Footer */}
          <div className="text-[10px] font-black text-emerald-900 flex justify-between pt-1 border-t border-slate-800/40">
            <span>[GEMINI AI GENERATED]</span>
            <span>CHAR: {village ? village.bengaliAlertText.length : 0}/160</span>
          </div>
        </div>
      </div>

      {/* Feature Phone Keypad Chassis */}
      <div className="w-full mt-3 flex flex-col items-center space-y-2">
        {/* Soft Keys & D-Pad */}
        <div className="grid grid-cols-3 gap-2 w-full px-2">
          <button className="bg-slate-800 text-slate-200 text-xs font-bold py-1 px-2 border border-slate-600 active:bg-slate-700">
            SELECT
          </button>
          <div className="bg-slate-950 border border-slate-700 rounded flex items-center justify-center py-1">
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </div>
          <button className="bg-slate-800 text-slate-200 text-xs font-bold py-1 px-2 border border-slate-600 active:bg-slate-700">
            CLEAR
          </button>
        </div>

        {/* Numeric Keypad Grid */}
        <div className="grid grid-cols-3 gap-1.5 w-full px-2 text-[11px] font-bold text-slate-300 text-center">
          {['1 .@', '2 ABC', '3 DEF', '4 GHI', '5 JKL', '6 MNO', '7 PQRS', '8 TUV', '9 WXYZ', '* Shift', '0 Space', '# Option'].map(
            (key, idx) => (
              <div
                key={idx}
                className="bg-slate-800 border border-slate-700 py-1.5 rounded active:bg-slate-700 cursor-pointer shadow-sm select-none"
              >
                {key}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
