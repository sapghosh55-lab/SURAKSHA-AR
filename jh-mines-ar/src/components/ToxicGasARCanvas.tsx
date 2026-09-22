import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Language } from '../types';
import { translations } from '../data/translations';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Award,
  Zap,
  Wind,
  Compass,
  Users,
  Check,
  ArrowRight,
  ShieldCheck,
  Activity,
  Flame,
  Radio,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ToxicGasARProps {
  lang: Language;
  onDrillComplete?: () => void;
  cameraStream?: MediaStream | null;
  customBgUrl?: string | null;
  isCameraActive?: boolean;
}

export const ToxicGasARCanvas: React.FC<ToxicGasARProps> = ({
  lang,
  onDrillComplete,
  cameraStream,
  customBgUrl,
  isCameraActive
}) => {
  const t = translations[lang];

  // DOM Refs
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  // Bind camera stream to video ref
  useEffect(() => {
    if (bgVideoRef.current && cameraStream) {
      bgVideoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  // PPE Selection State
  const [selectedGear, setSelectedGear] = useState<{
    scba: boolean;
    helmet: boolean;
    headlamp: boolean;
    detector: boolean;
  }>({
    scba: false,
    helmet: false,
    headlamp: false,
    detector: false
  });

  // Drill Step Workflow:
  // Step 1: Gear Selection -> Step 2: Buddy Verification -> Step 3: Gas Flange Valve Seal -> Step 4: Escape Route
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isBuddyVerified, setIsBuddyVerified] = useState<boolean>(false);
  const [isFlangeSealed, setIsFlangeSealed] = useState<boolean>(false);
  const [isEvacuated, setIsEvacuated] = useState<boolean>(false);

  // Gas PPM Sensor Telemetry
  const [ch4Ppm, setCh4Ppm] = useState<number>(2.4); // 2.4% PPM
  const [coPpm, setCoPpm] = useState<number>(85);   // 85 PPM
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(25);

  // Three.js Scene Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const gasParticleSystemRef = useRef<THREE.Points | null>(null);
  const escapeSignArrowRef = useRef<THREE.Group | null>(null);

  const isAllGearEquipped = selectedGear.scba && selectedGear.helmet && selectedGear.headlamp && selectedGear.detector;

  // Audio prompt voice generator
  const speakVoiceCue = (text: string) => {
    if (isAudioMuted) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (lang === 'hi') utterance.lang = 'hi-IN';
      else if (lang === 'sat') utterance.lang = 'bn-IN';
      else utterance.lang = 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Timer countdown hook
  useEffect(() => {
    if (isEvacuated || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isEvacuated, timerSeconds]);

  // Main Three.js Scene Setup (Volumetric Gas Cloud & Spatial Arrows)
  useEffect(() => {
    if (!canvasContainerRef.current) return;
    const width = canvasContainerRef.current.clientWidth;
    const height = canvasContainerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3.2);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    while (canvasContainerRef.current.firstChild) {
      canvasContainerRef.current.removeChild(canvasContainerRef.current.firstChild);
    }
    canvasContainerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x00f0ff, 1.0);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

    // Ground Plane Grid
    const grid = new THREE.GridHelper(6, 20, 0x10b981, 0x334155);
    grid.position.y = 0;
    scene.add(grid);

    // 1. Subterranean Flange Pipe Leaking Gas
    const pipeGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.2, 12);
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(-0.8, 0.6, -0.5);
    scene.add(pipe);

    // 2. Volumetric Gas Cloud Particle Shader Simulation
    const particleCount = 400;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = -0.8 + (Math.random() - 0.5) * 1.2;
      positions[i * 3 + 1] = 0.6 + (Math.random() - 0.5) * 0.8;
      positions[i * 3 + 2] = -0.5 + (Math.random() - 0.5) * 1.2;

      // Color-coded gas particles (Toxic Amber/Greenish Methane Fog)
      colors[i * 3] = 0.96;     // R
      colors[i * 3 + 1] = 0.62; // G
      colors[i * 3 + 2] = 0.07; // B
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });

    const gasParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(gasParticles);
    gasParticleSystemRef.current = gasParticles;

    // 3. Spatial 3D Directional Escape Sign Arrow Group
    const arrowGroup = new THREE.Group();
    const arrowGeo = new THREE.ConeGeometry(0.15, 0.4, 4);
    const arrowMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);
    arrowMesh.rotation.z = -Math.PI / 2;
    arrowGroup.add(arrowMesh);

    arrowGroup.position.set(1.2, 0.8, -0.2);
    scene.add(arrowGroup);
    escapeSignArrowRef.current = arrowGroup;

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Animate Gas Cloud Dispersal
      if (gasParticleSystemRef.current) {
        const posAttr = gasParticleSystemRef.current.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          let y = posAttr.getY(i);
          y += Math.sin(elapsedTime * 3 + i) * 0.003;
          posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
      }

      // Animate Spatial Direction Arrow Pulse
      if (escapeSignArrowRef.current) {
        escapeSignArrowRef.current.position.x = 1.2 + Math.sin(elapsedTime * 6) * 0.08;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Reduce gas cloud opacity when flange valve is sealed
  useEffect(() => {
    if (isFlangeSealed && gasParticleSystemRef.current) {
      (gasParticleSystemRef.current.material as THREE.PointsMaterial).opacity = 0.15;
      setCh4Ppm(0.3);
      setCoPpm(12);
    }
  }, [isFlangeSealed]);

  // Gear Toggle Handler
  const toggleGear = (item: keyof typeof selectedGear) => {
    const updated = { ...selectedGear, [item]: !selectedGear[item] };
    setSelectedGear(updated);
    if (updated.scba && updated.helmet && updated.headlamp && updated.detector) {
      setCurrentStep(2);
      speakVoiceCue("All mandatory SCBA safety gear equipped! Step 2: Perform Buddy Verification check with Budheshwar Marandi.");
    }
  };

  // Buddy verification handler
  const handleBuddyCheck = () => {
    setIsBuddyVerified(true);
    setCurrentStep(3);
    speakVoiceCue("Buddy system check complete. SCBA pressure sealed at 300 Bar. Step 3: Seal gas leak flange.");
  };

  // Seal Flange Handler
  const handleSealFlange = () => {
    setIsFlangeSealed(true);
    setCurrentStep(4);
    speakVoiceCue("Gas leak flange sealed! CH4 levels dropping. Step 4: Follow spatial green escape arrows to Shaft B.");
  };

  // Evacuate & Finish Handler
  const handleEvacuate = () => {
    setIsEvacuated(true);
    speakVoiceCue("Evacuation complete! Gas Leak SCBA Protocol passed.");
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    if (onDrillComplete) onDrillComplete();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-4">
      
      {/* Top Protocol Header Bar */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Wind className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 flex items-center gap-2">
              {t.gasDrillTitle}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                SCBA 300 Bar
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Jharia Deep Shaft #4 • Confined Space Volumetric Shader Gas Map
            </p>
          </div>
        </div>

        {/* Dynamic Toxicity Telemetry Pills */}
        <div className="flex items-center space-x-2 font-mono text-[11px]">
          <div
            className={`px-2.5 py-1 rounded border font-bold flex items-center gap-1 ${
              ch4Ppm > 1.0
                ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>CH4: {ch4Ppm.toFixed(1)}%</span>
          </div>

          <div
            className={`px-2.5 py-1 rounded border font-bold flex items-center gap-1 ${
              coPpm > 30
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>CO: {coPpm} PPM</span>
          </div>
        </div>
      </div>

      {/* Main 3D WebGL Gas Cloud Canvas HUD */}
      <div className="relative w-full max-w-2xl h-[480px] bg-slate-950 border-4 border-slate-700 rounded-2xl shadow-2xl overflow-hidden select-none">
        
        {/* Dynamic Live Camera / Uploaded Photo Backdrop */}
        {customBgUrl ? (
          <img src={customBgUrl} alt="Live AR Photo Backdrop" className="absolute inset-0 z-0 w-full h-full object-cover" />
        ) : cameraStream ? (
          <video
            ref={bgVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 z-0 w-full h-full object-cover"
          />
        ) : null}

        {/* Three.js Canvas Container */}
        <div ref={canvasContainerRef} className="absolute inset-0 z-10 w-full h-full" />

        {/* AR Overlay HUD Controls */}
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-4">
          
          {/* Top Telemetry & Spatial Signage Banner */}
          <div className="flex items-center justify-between text-[11px] font-mono">
            <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-1.5 flex items-center space-x-2 text-emerald-400 font-bold pointer-events-auto">
              <Compass className="w-3.5 h-3.5 animate-spin" />
              <span>{t.escapeArrowSign}</span>
            </div>

            <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-1.5 text-amber-400 font-bold pointer-events-auto">
              ⏱️ {timerSeconds}s Evac Time
            </div>
          </div>

          {/* Interactive PPE Gear Selector Overlay (Step 1) */}
          {currentStep === 1 && (
            <div className="bg-slate-950/95 backdrop-blur-md border-2 border-amber-500 rounded-2xl p-4 space-y-3 pointer-events-auto shadow-2xl animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  {t.ppeSelectPrompt}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {Object.values(selectedGear).filter(Boolean).length} / 4 Equipped
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { key: 'scba', label: t.scbaEquipped },
                  { key: 'helmet', label: t.mshaHelmetEquipped },
                  { key: 'headlamp', label: t.safeHeadlampEquipped },
                  { key: 'detector', label: t.gasDetectorEquipped }
                ].map((item) => {
                  const isOk = selectedGear[item.key as keyof typeof selectedGear];
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleGear(item.key as keyof typeof selectedGear)}
                      className={`p-2.5 rounded-xl border font-semibold flex items-center justify-between transition ${
                        isOk
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-500'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      {isOk ? <Check className="w-4 h-4 text-emerald-400" /> : <ShieldCheck className="w-4 h-4 text-slate-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Buddy System Checklist (Step 2) */}
          {currentStep === 2 && (
            <div className="bg-slate-950/95 backdrop-blur-md border-2 border-cyan-500 rounded-2xl p-4 space-y-3 pointer-events-auto shadow-2xl animate-in fade-in">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center font-bold text-cyan-300">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{t.buddyChecklistTitle}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">SCBA Pressure Check • Vernacular Audio Beacon</p>
                </div>
              </div>

              <button
                onClick={handleBuddyCheck}
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Buddy SCBA Seal & Enter Shaft</span>
              </button>
            </div>
          )}

          {/* Bottom Workflow Action Controls (Steps 3 & 4) */}
          <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 space-y-2 pointer-events-auto">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">
                Protocol Step {currentStep} of 4: {currentStep === 3 ? 'Seal Gas Pipe Flange' : currentStep === 4 ? 'Evacuate to Shaft B' : 'PPE Preparation'}
              </span>

              <button
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedGear({ scba: false, helmet: false, headlamp: false, detector: false });
                  setIsBuddyVerified(false);
                  setIsFlangeSealed(false);
                  setIsEvacuated(false);
                  setCh4Ppm(2.4);
                  setCoPpm(85);
                }}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="flex space-x-2">
              {currentStep === 3 && (
                <button
                  onClick={handleSealFlange}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-1.5"
                >
                  <Zap className="w-4 h-4" />
                  <span>Turn Emergency Gas Isolation Flange Valve</span>
                </button>
              )}

              {currentStep === 4 && !isEvacuated && (
                <button
                  onClick={handleEvacuate}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-1.5"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Follow Spatial Green Arrow to Evacuation Exit</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Completion Pass Banner */}
      {isEvacuated && (
        <div className="w-full max-w-2xl bg-emerald-500/10 border-2 border-emerald-500 rounded-xl p-4 text-center space-y-2 animate-in fade-in">
          <div className="w-10 h-10 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center mx-auto font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-extrabold text-emerald-400">
            GAS LEAK SCBA EVACUATION PROTOCOL PASSED!
          </h4>
          <p className="text-xs text-slate-300 font-mono">
            Buddy Verification & SCBA Seal Confirmed • 100% Jharkhand Vocational Compliance
          </p>
        </div>
      )}

    </div>
  );
};
