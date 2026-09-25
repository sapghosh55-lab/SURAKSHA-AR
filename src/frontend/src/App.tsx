import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ShieldCheck, LogOut, Radio, Activity } from 'lucide-react';
import { MOCK_VILLAGES } from './mockData';
import type { VillageThreat } from './types';
import { EmergencyLedger } from './components/EmergencyLedger';
import { MapComponent } from './components/MapComponent';
import { DispatchPanel } from './components/DispatchPanel';
import { AuthScreen } from './components/AuthScreen';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading, logout, user } = useAuth0();
  const [demoBypass, setDemoBypass] = useState(false);
  const [villages, setVillages] = useState<VillageThreat[]>(MOCK_VILLAGES);
  const [selectedVillage, setSelectedVillage] = useState<VillageThreat | null>(MOCK_VILLAGES[0]);

  // Handle Village Select
  const handleSelectVillage = (village: VillageThreat) => {
    setSelectedVillage(village);
  };

  // Handle Confirm Dispatch
  const handleConfirmDispatch = (villageId: string) => {
    setVillages((prev) =>
      prev.map((v) => (v.id === villageId ? { ...v, status: 'DISPATCHED' } : v))
    );
    if (selectedVillage && selectedVillage.id === villageId) {
      setSelectedVillage({ ...selectedVillage, status: 'DISPATCHED' });
    }
  };

  // If loading Auth0 state
  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-slate-900 text-white flex flex-col items-center justify-center font-black">
        <Activity className="w-10 h-10 text-blue-400 animate-spin mb-3" />
        <div className="text-lg uppercase tracking-widest">INITIALIZING GOVT AUTH0 SECURITY NODE...</div>
      </div>
    );
  }

  // Force Auth0 Login Screen unless authenticated or demo bypassed
  if (!isAuthenticated && !demoBypass) {
    return <AuthScreen onBypass={() => setDemoBypass(true)} />;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden font-sans">
      {/* Top Official Government Control Bar */}
      <header className="h-14 bg-blue-950 text-white border-b-4 border-black px-4 flex items-center justify-between z-30 flex-shrink-0 shadow-md">
        {/* Left Title Brand */}
        <div className="flex items-center space-x-3">
          <div className="bg-blue-900 border-2 border-black p-1">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-black uppercase tracking-wider text-white">
                CROPSENTINEL AI • EMERGENCY OPERATIONS CONTROL ROOM
              </span>
              <span className="bg-red-700 text-white text-[10px] font-black px-2 py-0.5 border border-black uppercase animate-pulse">
                LIVE MONITORING
              </span>
            </div>
            <div className="text-[10px] font-extrabold text-blue-200 uppercase">
              STATE DISASTER MANAGEMENT AUTHORITY • HOOGHLY BASIN COMMAND
            </div>
          </div>
        </div>

        {/* Right Status & Auth Bar */}
        <div className="flex items-center space-x-4">
          {/* Signal Indicator */}
          <div className="flex items-center space-x-1.5 bg-blue-900 px-3 py-1 border border-black text-xs font-bold">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>SENTINEL-1 SAR FEED ACTIVE</span>
          </div>

          {/* User Profile / Auth Status */}
          <div className="text-right text-xs font-bold">
            <div className="text-amber-300 font-black">
              {user ? user.name || user.email : 'OFFICER DEMO MODE'}
            </div>
            <div className="text-[10px] text-blue-200 uppercase">OFFICER ID: WB-DM-8821</div>
          </div>

          {/* Logout / Switch Auth Button */}
          {isAuthenticated ? (
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="gov-btn bg-red-800 hover:bg-red-900 text-white px-3 py-1.5 text-xs font-black uppercase flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span>LOGOUT</span>
            </button>
          ) : (
            <button
              onClick={() => setDemoBypass(false)}
              className="gov-btn bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 text-xs font-black uppercase flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span>RETURN TO AUTH0 LOGIN</span>
            </button>
          )}
        </div>
      </header>

      {/* Main 3-Column Bureaucratic Dashboard Layout */}
      <div className="flex-1 flex flex-row w-full h-[calc(100vh-3.5rem)] overflow-hidden relative">
        {/* 1. Left Panel (w-96): Emergency Ledger */}
        <EmergencyLedger
          villages={villages}
          selectedVillage={selectedVillage}
          onSelectVillage={handleSelectVillage}
        />

        {/* 2. Center Panel: Full-height MapLibre GL Canvas */}
        <div className="flex-1 h-full relative">
          <MapComponent
            villages={villages}
            selectedVillage={selectedVillage}
            onSelectVillage={handleSelectVillage}
          />
        </div>

        {/* 3. Right Panel (w-[400px]): Dispatch Confirmation Panel */}
        <DispatchPanel
          village={selectedVillage}
          onConfirmDispatch={handleConfirmDispatch}
        />
      </div>
    </div>
  );
};

export default App;
