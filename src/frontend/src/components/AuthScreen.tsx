import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Lock, ShieldCheck, KeyRound, ArrowRight, UserCheck } from 'lucide-react';

interface AuthScreenProps {
  onBypass: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onBypass }) => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="w-screen h-screen bg-slate-200 flex flex-col justify-center items-center p-4">
      {/* High-Contrast Government Header Card */}
      <div className="w-full max-w-xl bg-white border-4 border-blue-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Top Official Banner */}
        <div className="bg-blue-900 text-white p-6 border-b-4 border-black">
          <div className="flex items-center space-x-3 mb-2">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-blue-200">
                GOVERNMENT OF WEST BENGAL • DISASTER MANAGEMENT
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white leading-tight">
                CropSentinel AI Portal
              </h1>
            </div>
          </div>
          <div className="text-xs font-bold text-blue-100 uppercase border-t border-blue-800/80 pt-2 mt-2">
            SECURE ACCESS CONTROL POINT • AUTH0 VERIFIED OFFICER LOGIN
          </div>
        </div>

        {/* Security Warning Body */}
        <div className="p-6 space-y-6">
          <div className="bg-amber-50 border-2 border-black p-4 text-slate-950 font-bold text-xs leading-relaxed">
            <div className="flex items-center space-x-2 text-amber-900 font-black text-sm uppercase mb-1">
              <Lock className="w-4 h-4" />
              <span>OFFICIAL RESTRICTED SYSTEM</span>
            </div>
            This system is reserved exclusively for authorized Agriculture Officers, Block Development Officers, and Emergency Control Staff. All login attempts and satellite dispatch operations are logged.
          </div>

          <div className="space-y-4">
            {/* Primary Auth0 Login Button */}
            <button
              onClick={() => loginWithRedirect()}
              className="w-full gov-btn flex items-center justify-center space-x-3 p-4 bg-blue-900 hover:bg-blue-950 text-white font-black text-base uppercase tracking-wider"
            >
              <KeyRound className="w-5 h-5 text-amber-400" />
              <span>LOGIN VIA AUTH0 SECURE GATEWAY</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Quick Demo Bypass Button */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t-2 border-slate-400"></div>
              <span className="flex-shrink mx-4 text-slate-700 font-extrabold text-xs uppercase">
                FIELD OFFICER DEMO / BYPASS
              </span>
              <div className="flex-grow border-t-2 border-slate-400"></div>
            </div>

            <button
              onClick={onBypass}
              className="w-full gov-btn flex items-center justify-center space-x-2 p-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs uppercase tracking-wider"
            >
              <UserCheck className="w-4 h-4" />
              <span>ENTER FIELD OFFICER CONTROL ROOM (DEMO OVERRIDE)</span>
            </button>
          </div>
        </div>

        {/* Card Footer */}
        <div className="bg-slate-100 p-3 border-t-2 border-black text-center text-[11px] font-black text-slate-700 uppercase">
          NATIONAL INFORMATICS CENTRE • DISASTER OPERATIONS SECURITY V2.4
        </div>
      </div>
    </div>
  );
};
