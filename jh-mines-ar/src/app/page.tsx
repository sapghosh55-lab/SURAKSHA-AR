'use client';

import React, { useState } from 'react';
import { Language, RoleMode, ViewportMode } from '../types';
import { translations } from '../data/translations';
import { Header } from '../components/Header';
import { MobileARSimulator } from '../components/MobileARSimulator';
import { InspectorDashboard } from '../components/InspectorDashboard';
import { OfflineSyncModal } from '../components/OfflineSyncModal';
import { AssessmentEngineModal } from '../components/AssessmentEngineModal';
import { ShieldCheck, Cpu, Sparkles } from 'lucide-react';

export default function Home() {
  const [lang, setLang] = useState<Language>('en');
  const [role, setRole] = useState<RoleMode>('trainee');
  const [viewport, setViewport] = useState<ViewportMode>('mobile');
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState<boolean>(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState<boolean>(false);

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Header Navigation Bar */}
      <Header
        lang={lang}
        onLanguageChange={setLang}
        role={role}
        onRoleChange={setRole}
        viewport={viewport}
        onViewportChange={setViewport}
        onOpenOfflineModal={() => setIsOfflineModalOpen(true)}
        onOpenAssessmentModal={() => setIsAssessmentModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start space-y-6">
        
        {/* Banner Alert Bar */}
        <div className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="font-bold text-amber-400 font-mono">SIH PROBLEM STATEMENT SIH26041:</span>
            <span>AR Industrial Safety & Vocational Training Platform (Jharkhand Sector)</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% PWA Offline Capable
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Cpu className="w-3.5 h-3.5" />
              Ol Chiki Script Native
            </span>
          </div>
        </div>

        {/* Viewport & Role Rendering */}
        {role === 'trainee' ? (
          <div className="w-full flex flex-col items-center justify-center">
            {viewport === 'mobile' ? (
              <MobileARSimulator lang={lang} onOpenOfflineModal={() => setIsOfflineModalOpen(true)} />
            ) : (
              <div className="w-full space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center text-xs text-amber-400 font-mono flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Desktop View Enabled for Trainee AR Simulator Mode</span>
                </div>
                <MobileARSimulator lang={lang} onOpenOfflineModal={() => setIsOfflineModalOpen(true)} />
              </div>
            )}
          </div>
        ) : (
          <div className="w-full">
            <InspectorDashboard lang={lang} onOpenOfflineModal={() => setIsOfflineModalOpen(true)} />
          </div>
        )}

      </main>

      {/* Footer Bar */}
      <footer className="w-full bg-slate-950 border-t border-slate-800 py-6 px-4 text-xs text-slate-400 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          <div className="space-y-1">
            <p className="font-bold text-slate-200 uppercase tracking-wider">
              {t.govtDept}
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Designed for SIH26041 • Jharia, Bokaro, Noamundi & Ghatsila Mining Sectors
            </p>
          </div>

          <div className="flex items-center space-x-4 font-mono text-[11px] text-slate-400">
            <span>Offline Mesh: Active</span>
            <span>•</span>
            <span>Ol Chiki Unicode (ᱚᱞ ᱪᱤᱠᱤ): Supported</span>
            <span>•</span>
            <span className="text-amber-400 font-bold">State Ver. 2026.4</span>
          </div>

        </div>
      </footer>

      {/* Offline Sync Drawer Modal */}
      <OfflineSyncModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        lang={lang}
      />

      {/* Assessment & Tamper-Evident Certification Engine Modal */}
      <AssessmentEngineModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        lang={lang}
      />

    </div>
  );
}
