import React from 'react';
import { Language, RoleMode, ViewportMode } from '../types';
import { translations } from '../data/translations';
import { JharkhandCrest } from './JharkhandCrest';
import { WifiOff, Smartphone, Monitor, UserCheck, ShieldAlert, Globe, Award, FileCheck } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  role: RoleMode;
  onRoleChange: (role: RoleMode) => void;
  viewport: ViewportMode;
  onViewportChange: (vp: ViewportMode) => void;
  onOpenOfflineModal: () => void;
  onOpenAssessmentModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  role,
  onRoleChange,
  viewport,
  onViewportChange,
  onOpenOfflineModal,
  onOpenAssessmentModal
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl text-slate-100 select-none">
      
      {/* Top Govt Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Crest */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onRoleChange('trainee')}>
          <JharkhandCrest size={44} className="group-hover:scale-105 transition-transform duration-200" />
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-100 text-sm md:text-base tracking-wide uppercase font-sans">
                {t.govtDept}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold font-mono bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded">
                SIH26041
              </span>
            </div>
            <p className="text-xs text-amber-500/90 font-mono font-medium tracking-tight">
              {t.subTitleHeader}
            </p>
          </div>
        </div>

        {/* Right Section: Assessment & Certs, Language Switcher, Offline Badge */}
        <div className="flex flex-wrap items-center space-x-2 sm:space-x-3">
          
          {/* Assessment & Certificate Trigger Button */}
          <button
            onClick={onOpenAssessmentModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-lg transition duration-200 shadow-md shadow-amber-500/20"
            title="Launch DGMS Competency Assessment & Tamper-Evident Certificate Engine"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Assessment & Certs</span>
          </button>

          {/* Offline Sync Badge */}
          <button
            onClick={onOpenOfflineModal}
            className="flex items-center space-x-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-700/80 hover:border-amber-500/50 rounded-lg text-xs transition duration-200 shadow-inner group"
            title="Click to view offline cached modules and subterranean mesh telemetry"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <WifiOff className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <div className="flex flex-col text-left hidden md:flex">
              <span className="font-bold text-slate-200 leading-none">{t.offlineReadyBadge}</span>
              <span className="text-[10px] text-slate-400 font-mono leading-tight">14 Modules Cached</span>
            </div>
          </button>

          {/* Multi-lingual Language Switcher Toggle */}
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <Globe className="w-3.5 h-3.5 text-amber-400 ml-2 mr-1" />
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
                lang === 'en'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
                lang === 'hi'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => onLanguageChange('sat')}
              className={`px-2 py-1 text-xs font-bold rounded-md transition tracking-wide ${
                lang === 'sat'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-300 hover:text-amber-400'
              }`}
              title="Santali Ol Chiki Script (ᱚᱞ ᱪᱤᱠᱤ)"
            >
              সংताली (ᱚᱞ ᱪᱤᱠᱤ)
            </button>
          </div>

        </div>
      </div>

      {/* Sub-Header: Role & Viewport Switchers Bar */}
      <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Dual Role Switcher Toggle */}
          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-lg p-1">
            <span className="text-[11px] font-mono text-slate-400 px-2 font-bold uppercase tracking-wider hidden md:inline-block">
              Role:
            </span>
            <button
              onClick={() => {
                onRoleChange('trainee');
                if (viewport === 'desktop') onViewportChange('mobile');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-semibold transition ${
                role === 'trainee'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{t.roleTrainee}</span>
            </button>

            <button
              onClick={() => {
                onRoleChange('inspector');
                if (viewport === 'mobile') onViewportChange('desktop');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-semibold transition ${
                role === 'inspector'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{t.roleInspector}</span>
            </button>
          </div>

          {/* Viewport Simulator Switcher */}
          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-lg p-1">
            <span className="text-[11px] font-mono text-slate-400 px-2 font-bold uppercase tracking-wider hidden sm:inline-block">
              Viewport Mode:
            </span>
            
            <button
              onClick={() => onViewportChange('mobile')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-semibold transition ${
                viewport === 'mobile'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="View app as a ruggedized mid-range Android phone simulator"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Rugged Mobile Simulator</span>
            </button>

            <button
              onClick={() => onViewportChange('desktop')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-semibold transition ${
                viewport === 'desktop'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Full Desktop view for compliance command center"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop View</span>
            </button>
          </div>

        </div>
      </div>

    </header>
  );
};
