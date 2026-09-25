import React, { useState } from 'react';
import { ShieldAlert, Search, AlertTriangle, ChevronRight, Filter } from 'lucide-react';
import type { VillageThreat, ThreatLevel } from '../types';

interface EmergencyLedgerProps {
  villages: VillageThreat[];
  selectedVillage: VillageThreat | null;
  onSelectVillage: (village: VillageThreat) => void;
}

export const EmergencyLedger: React.FC<EmergencyLedgerProps> = ({
  villages,
  selectedVillage,
  onSelectVillage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  const filteredVillages = villages.filter((village) => {
    const matchesSearch =
      village.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      village.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
      village.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterLevel === 'ALL' || village.threatLevel === filterLevel;
    return matchesSearch && matchesFilter;
  });

  const getBadgeStyle = (level: ThreatLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-700 text-white border-2 border-black font-extrabold';
      case 'HIGH':
        return 'bg-amber-600 text-white border-2 border-black font-bold';
      case 'MODERATE':
        return 'bg-blue-700 text-white border-2 border-black font-bold';
      default:
        return 'bg-slate-700 text-white border-2 border-black font-bold';
    }
  };

  return (
    <div className="w-96 h-full bg-white border-r-4 border-blue-900 flex flex-col z-20 shadow-xl overflow-hidden">
      {/* Panel Top Banner */}
      <div className="bg-blue-900 text-white p-4 border-b-4 border-black">
        <div className="flex items-center space-x-2 mb-1">
          <ShieldAlert className="w-6 h-6 text-red-400" />
          <span className="text-xs font-black uppercase tracking-widest text-blue-200">
            DISASTER MANAGEMENT CELL
          </span>
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-white leading-none">
          Emergency Ledger
        </h1>
        <p className="text-xs font-bold text-blue-100 mt-1">
          HOOGHLY BASIN SECTOR SATELLITE RADAR DISPATCH
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-slate-100 border-b-2 border-slate-900 space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-700" />
          <input
            type="text"
            placeholder="Search Village, Block, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border-2 border-slate-900 text-xs font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
          <div className="flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-slate-900" />
            <span>LEVEL:</span>
          </div>
          <div className="flex space-x-1">
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-2 py-0.5 text-[10px] font-black border border-black uppercase ${
                  filterLevel === level
                    ? 'bg-blue-900 text-white'
                    : 'bg-white text-slate-900 hover:bg-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Village List Ledger */}
      <div className="flex-1 overflow-y-auto divide-y-2 divide-slate-900 p-2 space-y-2">
        {filteredVillages.length === 0 ? (
          <div className="p-6 text-center font-bold text-sm text-slate-700">
            No village threat records match your filter criteria.
          </div>
        ) : (
          filteredVillages.map((village) => {
            const isSelected = selectedVillage?.id === village.id;
            return (
              <div
                key={village.id}
                onClick={() => onSelectVillage(village)}
                className={`p-3 border-2 border-slate-900 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50 border-4 border-blue-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {/* Header Line */}
                <div className="flex justify-between items-start mb-1.5">
                  <div>
                    <span className="text-[10px] font-black tracking-wider text-slate-600 uppercase">
                      [{village.id}] • {village.block}
                    </span>
                    <h3 className="text-base font-black text-slate-950 leading-tight">
                      {village.name}
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] uppercase ${getBadgeStyle(village.threatLevel)}`}>
                    {village.threatLevel}
                  </span>
                </div>

                {/* Threat Stats Grid */}
                <div className="grid grid-cols-2 gap-2 my-2 bg-slate-100 p-2 border border-slate-400 text-xs font-bold text-slate-900">
                  <div>
                    <div className="text-[10px] font-extrabold text-slate-600 uppercase">AFFECTED AREA</div>
                    <div className="text-sm font-black text-slate-950">{village.affectedAreaHa} Ha</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold text-slate-600 uppercase">SAR INUNDATION</div>
                    <div className="text-sm font-black text-red-700">+{village.inundationChangePct}%</div>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-800 pt-1">
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>STATUS: {village.status}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-900" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Left Panel Footer Summary */}
      <div className="p-3 bg-blue-950 text-white border-t-4 border-black text-xs font-bold flex justify-between items-center">
        <span>TOTAL RECORDED: {villages.length} VILLAGES</span>
        <span className="text-red-400 font-black">
          CRITICAL: {villages.filter((v) => v.threatLevel === 'CRITICAL').length}
        </span>
      </div>
    </div>
  );
};
