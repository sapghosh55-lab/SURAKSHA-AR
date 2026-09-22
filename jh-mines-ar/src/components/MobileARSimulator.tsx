import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Language, SafetyScenarioId } from '../types';
import { translations } from '../data/translations';
import { safetyScenariosData } from '../data/mockData';
import { FireExtinguisherARCanvas } from './FireExtinguisherARCanvas';
import { ToxicGasARCanvas } from './ToxicGasARCanvas';
import { useRealDeviceSensors } from '../hooks/useRealDeviceSensors';
import {
  Flame,
  Lock,
  ShieldAlert,
  Activity,
  Volume2,
  VolumeX,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Award,
  Radio,
  Zap,
  Maximize2,
  Minimize2,
  Sparkles,
  Eye,
  Check,
  Box,
  Wind,
  Camera,
  CameraOff,
  Upload,
  Sun,
  Moon,
  Compass,
  Layers,
  Gauge
} from 'lucide-react';

interface MobileARSimulatorProps {
  lang: Language;
  onOpenOfflineModal: () => void;
}

export const MobileARSimulator: React.FC<MobileARSimulatorProps> = ({ lang, onOpenOfflineModal }) => {
  const t = translations[lang];
  const [activeScenarioId, setActiveScenarioId] = useState<SafetyScenarioId | 'pass_fire_drill' | 'toxic_gas_drill'>('toxic_gas_drill');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [methanePpm, setMethanePpm] = useState<number>(2.4);
  const [isHazardResolved, setIsHazardResolved] = useState<boolean>(false);
  const [lotoPadlocksPlaced, setLotoPadlocksPlaced] = useState<number>(0);
  const [ppeItemsVerified, setPpeItemsVerified] = useState<string[]>(['hardhat', 'goggles']);
  const [slopeCrackScanned, setSlopeCrackScanned] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [isFullScreenPhone, setIsFullScreenPhone] = useState<boolean>(false);

  // Custom Background Photo state & File Upload Ref
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Real Hardware Sensors Telemetry Hook
  const {
    isCameraActive,
    cameraStream,
    cameraError,
    luxValue,
    trackingQuality,
    imuData,
    toggleCamera,
    stopCamera,
    videoRef
  } = useRealDeviceSensors();

  const activeScenario = safetyScenariosData.find((s) => s.id === activeScenarioId) || safetyScenariosData[0];

  // Dynamic Audio Speech Voice Synthesis Simulation
  const triggerAudioVoicePrompt = (textPrompt: string) => {
    if (isAudioMuted) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textPrompt);
      if (lang === 'hi') utterance.lang = 'hi-IN';
      else if (lang === 'sat') utterance.lang = 'bn-IN';
      else utterance.lang = 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Reset scenario state on scenario selection change
  const handleScenarioChange = (scenarioId: SafetyScenarioId | 'pass_fire_drill' | 'toxic_gas_drill') => {
    setActiveScenarioId(scenarioId);
    setCurrentStep(1);
    setIsHazardResolved(false);
    setMethanePpm(2.4);
    setLotoPadlocksPlaced(0);
    setPpeItemsVerified(['hardhat', 'goggles']);
    setSlopeCrackScanned(false);
    setShowCertificate(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      const url = URL.createObjectURL(file);
      setCustomBgUrl(url);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Step resolution triggers
  const handleMethaneInspect = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      triggerAudioVoicePrompt("Methane gas level detected at 2.4 PPM. High explosion warning!");
    } else if (currentStep === 2) {
      setMethanePpm(0.4);
      setCurrentStep(3);
      triggerAudioVoicePrompt("Ventilation fan activated. CH4 level reduced to safe 0.4 PPM.");
    } else if (currentStep === 3) {
      setCurrentStep(4);
      setIsHazardResolved(true);
      triggerAudioVoicePrompt("Evacuation route cleared and verified safe.");
    }
  };

  const handleLotoStep = () => {
    if (lotoPadlocksPlaced < 3) {
      const next = lotoPadlocksPlaced + 1;
      setLotoPadlocksPlaced(next);
      if (next === 3) {
        setCurrentStep(4);
        setIsHazardResolved(true);
        triggerAudioVoicePrompt("Lockout Tagout complete. Breaker panel secured.");
      } else {
        setCurrentStep(next + 1);
      }
    }
  };

  const handlePpeItemToggle = (item: string) => {
    if (!ppeItemsVerified.includes(item)) {
      const updated = [...ppeItemsVerified, item];
      setPpeItemsVerified(updated);
      if (updated.length === 4) {
        setCurrentStep(3);
        setIsHazardResolved(true);
        triggerAudioVoicePrompt("PPE compliance 100 percent verified.");
      }
    }
  };

  const handleSlopeScan = () => {
    setSlopeCrackScanned(true);
    setCurrentStep(4);
    setIsHazardResolved(true);
    triggerAudioVoicePrompt("Rock wall slope strain sensor installed. Bench wall stability verified.");
  };

  const triggerCertificateModal = () => {
    setShowCertificate(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6">
      
      {/* Top Scenario Selector Bar */}
      <div className="w-full max-w-5xl bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs text-amber-400 font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{t.selectScenario}:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 w-full sm:w-auto">
          
          {/* WebGL 3D Gas Dispersion SCBA Protocol Option */}
          <button
            onClick={() => handleScenarioChange('toxic_gas_drill')}
            className={`px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
              activeScenarioId === 'toxic_gas_drill'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 border border-amber-400 ring-2 ring-amber-400/30'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">3D Gas Cloud & SCBA</span>
          </button>

          {/* Featured WebGL 3D Fire Extinguisher P-A-S-S Drill Option */}
          <button
            onClick={() => handleScenarioChange('pass_fire_drill')}
            className={`px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
              activeScenarioId === 'pass_fire_drill'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 border border-amber-400'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">3D CO2 Fire Drill</span>
          </button>

          {safetyScenariosData.map((s) => {
            const isSelected = s.id === activeScenarioId;
            return (
              <button
                key={s.id}
                onClick={() => handleScenarioChange(s.id)}
                className={`px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 border border-amber-400'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {s.id === 'methane_drill' && <Flame className="w-3.5 h-3.5" />}
                {s.id === 'loto_conveyor' && <Lock className="w-3.5 h-3.5" />}
                {s.id === 'ppe_scanner' && <ShieldAlert className="w-3.5 h-3.5" />}
                {s.id === 'pit_wall_stability' && <Activity className="w-3.5 h-3.5" />}
                <span className="truncate">{s.title[lang] || s.title.en}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AR Sensor HUD & Real Camera Control Panel Bar */}
      <div className="w-full max-w-5xl bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg space-y-3">
        
        {/* Prominent Action Button for Real Camera & Hardware Sensors */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleCamera}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition shadow-lg ${
                isCameraActive
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
              }`}
            >
              {isCameraActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
              <span>
                {isCameraActive ? 'Disable Real Camera & Sensors' : 'Enable Real Camera & IMU Sensors'}
              </span>
            </button>

            <button
              onClick={triggerFileUpload}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition border ${
                customBgUrl
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>{customBgUrl ? 'Custom Photo Loaded' : 'Upload Background Photo'}</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800 px-2 py-1 rounded">
              Hardware Telemetry: {imuData.hasHardwareIMU ? 'HARDWARE IMU' : 'HYBRID FALLBACK'}
            </span>
          </div>

        </div>

        {/* Top AR HUD Sensor Strip (Real-Time Telemetry Badges) */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          
          {/* 1. Optical Tracking Quality Badge */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className={`p-1.5 rounded-md border ${
                  trackingQuality === 'OPTIMAL'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : trackingQuality === 'LOW_LIGHT'
                    ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-bounce'
                }`}
              >
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Optical Tracking Quality
                </span>
                {trackingQuality === 'OPTIMAL' ? (
                  <span className="font-bold text-emerald-400 flex items-center gap-1 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                    OPTIMAL
                  </span>
                ) : trackingQuality === 'LOW_LIGHT' ? (
                  <span className="font-bold text-red-400 flex items-center gap-1 text-[10px]">
                    <AlertTriangle className="w-3 h-3 animate-pulse" />
                    Low Light: Switch to Marker Mode
                  </span>
                ) : (
                  <span className="font-bold text-amber-400 flex items-center gap-1 text-[10px]">
                    <AlertTriangle className="w-3 h-3 animate-pulse" />
                    Unstable Motion: Hold Device Steady
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 2. Ambient Light Level */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className={`p-1.5 rounded-md border ${
                  luxValue < 45
                    ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}
              >
                {luxValue < 45 ? <Moon className="w-4 h-4 text-red-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Ambient Light Level
                </span>
                <span className="font-mono font-bold text-amber-300 text-[11px]">
                  {luxValue} Lux
                </span>
              </div>
            </div>
          </div>

          {/* 3. IMU Gyroscope (Pitch / Roll / Heading) */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Compass className="w-4 h-4 animate-spin" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  IMU Gyroscope
                </span>
                <span className="font-mono font-bold text-amber-300 text-[10px]">
                  Pitch: {imuData.pitch}° | Roll: {imuData.roll}° | Heading: {imuData.heading}°
                </span>
              </div>
            </div>
          </div>

          {/* 4. Device Acceleration */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Gauge className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Device Acceleration
                </span>
                <span className="font-mono font-bold text-cyan-300 text-[11px]">
                  {imuData.motionIntensity} m/s²
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Render Featured WebGL 3D Gas Leak SCBA Drill or 3D Fire Drill or 2D AR Viewfinder */}
      {activeScenarioId === 'toxic_gas_drill' ? (
        <div className="w-full max-w-4xl space-y-4">
          <ToxicGasARCanvas
            lang={lang}
            onDrillComplete={() => setIsHazardResolved(true)}
            cameraStream={cameraStream}
            customBgUrl={customBgUrl}
            isCameraActive={isCameraActive}
            pitch={imuData.pitch}
            roll={imuData.roll}
            heading={imuData.heading}
            luxValue={luxValue}
          />
          {isHazardResolved && (
            <div className="flex justify-center">
              <button
                onClick={triggerCertificateModal}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center space-x-2 animate-bounce"
              >
                <Award className="w-5 h-5" />
                <span>{t.generateCertificate}</span>
              </button>
            </div>
          )}
        </div>
      ) : activeScenarioId === 'pass_fire_drill' ? (
        <div className="w-full max-w-4xl space-y-4">
          <FireExtinguisherARCanvas
            lang={lang}
            onDrillComplete={() => setIsHazardResolved(true)}
            cameraStream={cameraStream}
            customBgUrl={customBgUrl}
            isCameraActive={isCameraActive}
            pitch={imuData.pitch}
            roll={imuData.roll}
            heading={imuData.heading}
            luxValue={luxValue}
          />
          {isHazardResolved && (
            <div className="flex justify-center">
              <button
                onClick={triggerCertificateModal}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center space-x-2 animate-bounce"
              >
                <Award className="w-5 h-5" />
                <span>{t.generateCertificate}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Main Mobile Device Simulator Container */
        <div
          className={`relative transition-all duration-300 ${
            isFullScreenPhone ? 'w-full max-w-xl' : 'w-full max-w-md'
          }`}
        >
          {/* Rugged Phone Frame Casing (IP68 Industrial Grade Styling) */}
          <div className="relative bg-slate-950 border-4 border-slate-700 rounded-[2.5rem] p-3.5 shadow-2xl shadow-slate-950/90 overflow-hidden ring-1 ring-slate-600">
            
            {/* Ruggedized Corner Bumpers */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-500 rounded-tl-[2rem] pointer-events-none z-30" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-500 rounded-tr-[2rem] pointer-events-none z-30" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-500 rounded-bl-[2rem] pointer-events-none z-30" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-500 rounded-br-[2rem] pointer-events-none z-30" />

            {/* Top Notch & Camera Bezel Bar */}
            <div className="w-full bg-slate-900 rounded-t-[1.8rem] px-6 py-2 flex items-center justify-between text-[11px] text-slate-400 font-mono border-b border-slate-800 z-20">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-emerald-400 font-bold">5G / MESH ACTIVE</span>
              </div>
              
              <div className="w-20 h-4 bg-slate-950 rounded-full flex items-center justify-center space-x-1 border border-slate-800">
                <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700" />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              </div>

              <div className="flex items-center space-x-2">
                <span>32°C Shaft</span>
                <span className="text-amber-400 font-bold">94% ⚡</span>
              </div>
            </div>

            {/* AR Camera Viewfinder Display */}
            <div className="relative w-full h-[460px] bg-slate-900 rounded-b-[1.8rem] overflow-hidden flex flex-col justify-between p-3 select-none">
              
              {/* Background Video Passthrough / Uploaded Photo / Mine Shader */}
              {isCameraActive && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="object-cover absolute inset-0 w-full h-full pointer-events-none z-0"
                />
              )}

              {customBgUrl ? (
                <img
                  src={customBgUrl}
                  alt="Custom AR Backdrop"
                  className="absolute inset-0 z-0 w-full h-full object-cover"
                />
              ) : !isCameraActive ? (
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 opacity-90">
                  {activeScenarioId === 'methane_drill' && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-40">
                      <div className="w-72 h-72 rounded-full border-2 border-dashed border-amber-500/40 animate-[spin_20s_linear_infinite] flex items-center justify-center">
                        <div className="w-48 h-48 rounded-full border border-red-500/30 animate-pulse" />
                      </div>
                      <div className="absolute w-40 h-40 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
                    </div>
                  )}

                  {activeScenarioId === 'loto_conveyor' && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-40">
                      <div className="w-64 h-64 border-4 border-slate-700 rotate-45 flex items-center justify-center">
                        <div className="w-32 h-32 border-2 border-amber-500 rounded-full animate-[spin_6s_linear_infinite]" />
                      </div>
                    </div>
                  )}

                  {activeScenarioId === 'ppe_scanner' && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                      <div className="w-56 h-72 border-2 border-cyan-500 rounded-2xl flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border border-emerald-400 animate-ping" />
                      </div>
                    </div>
                  )}

                  {activeScenarioId === 'pit_wall_stability' && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-40">
                      <div className="w-full h-full bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
                      <div className="w-72 h-40 border-t-2 border-b-2 border-amber-500/60 skew-y-6" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415515_1px,transparent_1px),linear-gradient(to_bottom,#33415515_1px,transparent_1px)] bg-[size:24px_24px]" />
                </div>
              ) : null}

              {/* Camera Error / Permission Warning Overlay */}
              {cameraError && (
                <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md p-4 flex flex-col items-center justify-center text-center space-y-3">
                  <AlertTriangle className="w-10 h-10 text-amber-400 animate-pulse" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-100">Camera Access Error</h4>
                    <p className="text-[11px] text-slate-400 font-mono max-w-xs">{cameraError}</p>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={triggerFileUpload}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                    >
                      Simulated Mine
                    </button>
                  </div>
                </div>
              )}

              {/* AR HUD Header Bar */}
              <div className="relative z-10 flex items-center justify-between bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl p-2.5">
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      {activeScenario.title[lang] || activeScenario.title.en}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {activeScenario.locationName[lang] || activeScenario.locationName.en}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setIsAudioMuted(!isAudioMuted)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
                    title="Toggle Audio Cues"
                  >
                    {isAudioMuted ? (
                      <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    )}
                  </button>
                </div>
              </div>

              {/* Central AR Viewport Interactive Zone */}
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-2 text-center">
                <div className="relative w-64 h-64 border-2 border-dashed border-amber-500/80 rounded-2xl p-2 flex flex-col items-center justify-between shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
                  <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400" />

                  <div className="w-full flex items-center justify-between text-[10px] font-mono text-amber-400 px-2 pt-1 bg-slate-950/60 rounded">
                    <span>LiDAR Reticle #4</span>
                    <span>Dist: 1.2m</span>
                  </div>

                  {activeScenarioId === 'methane_drill' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-950/90 border border-amber-500/50 rounded-xl flex flex-col items-center">
                        <Flame className="w-8 h-8 text-amber-400 animate-bounce mb-1" />
                        <span className="text-xs font-mono font-bold text-amber-300">
                          CH4 Concentration: {methanePpm.toFixed(1)} PPM
                        </span>
                        <span className="text-[10px] text-red-400 font-semibold mt-0.5">
                          {methanePpm > 1.0 ? '⚠️ EXPLOSION THRESHOLD' : '✅ SAFE VENTILATION'}
                        </span>
                      </div>

                      {!isHazardResolved ? (
                        <button
                          onClick={handleMethaneInspect}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-lg shadow-lg shadow-amber-500/30 transition transform active:scale-95 flex items-center space-x-1.5"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>
                            {currentStep === 1
                              ? 'Spot Methane Leak Spot'
                              : currentStep === 2
                              ? 'Activate Exhaust Fan'
                              : 'Verify Escape Route'}
                          </span>
                        </button>
                      ) : (
                        <div className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-400 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Ventilation Cleared!</span>
                        </div>
                      )}
                    </div>
                  )}

                  {activeScenarioId === 'loto_conveyor' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-950/90 border border-slate-700 rounded-xl">
                        <Lock className="w-7 h-7 text-amber-400 mx-auto mb-1" />
                        <span className="text-xs font-mono font-bold text-slate-200">
                          Safety Padlocks Placed: {lotoPadlocksPlaced} / 3
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">Conveyor Breaker #B-04 Isolated</p>
                      </div>

                      {!isHazardResolved ? (
                        <button
                          onClick={handleLotoStep}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-lg shadow-lg shadow-amber-500/30 transition transform active:scale-95"
                        >
                          {lotoPadlocksPlaced === 0
                            ? 'Apply Padlock #1 (Breaker)'
                            : lotoPadlocksPlaced === 1
                            ? 'Apply Padlock #2 (Switch)'
                            : 'Attach Isolation Tag #3'}
                        </button>
                      ) : (
                        <div className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-400 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>LOTO Padlocks Secured!</span>
                        </div>
                      )}
                    </div>
                  )}

                  {activeScenarioId === 'ppe_scanner' && (
                    <div className="space-y-2 w-full px-2">
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                        {[
                          { id: 'hardhat', label: 'Hardhat' },
                          { id: 'goggles', label: 'Goggles' },
                          { id: 'respirator', label: 'Dust Mask' },
                          { id: 'boots', label: 'Steel Boots' }
                        ].map((item) => {
                          const isOk = ppeItemsVerified.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              onClick={() => handlePpeItemToggle(item.id)}
                              className={`p-1.5 rounded flex items-center justify-between border transition ${
                                isOk
                                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                                  : 'bg-red-500/20 border-red-500/50 text-red-300 animate-pulse'
                              }`}
                            >
                              <span>{item.label}</span>
                              {isOk ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeScenarioId === 'pit_wall_stability' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-950/90 border border-slate-700 rounded-xl">
                        <Activity className="w-7 h-7 text-amber-400 mx-auto mb-1 animate-pulse" />
                        <span className="text-xs font-mono font-bold text-slate-200">
                          LiDAR Wall Strain: {slopeCrackScanned ? '0.02 mm (Normal)' : '1.45 mm (High Creep)'}
                        </span>
                      </div>

                      {!isHazardResolved ? (
                        <button
                          onClick={handleSlopeScan}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-lg shadow-lg shadow-amber-500/30 transition transform active:scale-95"
                        >
                          Install AR Strain Sensor
                        </button>
                      ) : (
                        <div className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-400 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Slope Verified Safe!</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 px-2 pb-1 bg-slate-950/60 rounded">
                    <span>FPS: 60 • AR Core</span>
                    <span>Mesh Node #09</span>
                  </div>
                </div>
              </div>

              {/* AR HUD Footer Control Card */}
              <div className="relative z-10 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    {t.stepProgress}: Step {currentStep} of {activeScenario.stepsCount}
                  </span>

                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      setIsHazardResolved(false);
                      setMethanePpm(2.4);
                      setLotoPadlocksPlaced(0);
                      setPpeItemsVerified(['hardhat', 'goggles']);
                    }}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{t.resetDrill}</span>
                  </button>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / activeScenario.stepsCount) * 100}%` }}
                  />
                </div>

                {isHazardResolved && (
                  <button
                    onClick={triggerCertificateModal}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-lg shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-1.5 animate-bounce"
                  >
                    <Award className="w-4 h-4" />
                    <span>{t.generateCertificate}</span>
                  </button>
                )}
              </div>

            </div>

            {/* Bottom Device Home Bar */}
            <div className="w-full bg-slate-950 px-6 py-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 rounded-b-[1.8rem]">
              <span>IP68 Waterproof • Subterranean Ready</span>
              <button
                onClick={() => setIsFullScreenPhone(!isFullScreenPhone)}
                className="text-amber-400 hover:text-amber-300 font-mono text-[10px] flex items-center gap-1"
              >
                {isFullScreenPhone ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                <span>{isFullScreenPhone ? 'Standard View' : 'Expand Phone'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* State Certificate Generator Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-500 rounded-2xl p-6 shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 bg-amber-500/20 border border-amber-500 rounded-full flex items-center justify-center mx-auto text-amber-400">
              <Award className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                Govt of Jharkhand — Dept of Mines & Safety
              </span>
              <h3 className="text-xl font-extrabold text-slate-100">
                Vocational AR Safety Certification
              </h3>
              <p className="text-xs text-slate-400 font-mono">Certificate ID: JH-CERT-2026-0941</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Certified Trainee:</span>
                <span className="font-bold text-slate-200">Budheshwar Marandi (ᱵᱩᱫᱷᱮᱥᱣᱚᱨ ᱢᱟᱨᱟᱱᱰᱤ)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Drill Completed:</span>
                <span className="font-bold text-amber-400">
                  {activeScenarioId === 'toxic_gas_drill'
                    ? '3D Volumetric Gas Cloud & SCBA Buddy Protocol'
                    : activeScenarioId === 'pass_fire_drill'
                    ? '3D WebGL CO2 Fire Extinguisher (P-A-S-S)'
                    : activeScenario.title[lang] || activeScenario.title.en}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Safety Compliance Score:</span>
                <span className="font-mono font-bold text-emerald-400">100% (Grade A+)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Verification Ledger:</span>
                <span className="font-mono text-cyan-400">Offline Subterranean Mesh Verified</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowCertificate(false)}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-amber-500/20"
              >
                Done & Return to Drills
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
