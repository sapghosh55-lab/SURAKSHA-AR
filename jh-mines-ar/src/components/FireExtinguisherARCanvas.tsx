import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Language } from '../types';
import { translations } from '../data/translations';
import {
  Flame,
  Volume2,
  VolumeX,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Award,
  Zap,
  Target,
  Sparkles,
  ShieldCheck,
  Compass,
  Eye,
  Crosshair,
  Sliders,
  Video
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FireExtinguisherARProps {
  lang: Language;
  onDrillComplete?: () => void;
  cameraStream?: MediaStream | null;
  customBgUrl?: string | null;
  isCameraActive?: boolean;
  pitch?: number;
  roll?: number;
  heading?: number;
  luxValue?: number;
}

export const FireExtinguisherARCanvas: React.FC<FireExtinguisherARProps> = ({
  lang,
  onDrillComplete,
  cameraStream,
  customBgUrl,
  isCameraActive,
  pitch = 0,
  roll = 0,
  heading = 0,
  luxValue = 420
}) => {
  const t = translations[lang];

  // DOM & Three.js Camera Refs
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // State variables for P-A-S-S Drill Steps
  const [currentPassStep, setCurrentPassStep] = useState<number>(1); // 1: Pin, 2: Aim, 3: Squeeze, 4: Sweep
  const [isPinPulled, setIsPinPulled] = useState<boolean>(false);
  const [isAimAligned, setIsAimAligned] = useState<boolean>(false);
  const [isTriggerSqueezed, setIsTriggerSqueezed] = useState<boolean>(false);
  const [sweepProgress, setSweepProgress] = useState<number>(0); // 0 to 100%
  const [fireHealth, setFireHealth] = useState<number>(100); // 100% to 0%
  const [timerSeconds, setTimerSeconds] = useState<number>(20);
  const [distanceMeters, setDistanceMeters] = useState<number>(2.1);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [bgBackdrop, setBgBackdrop] = useState<'shaft' | 'camera'>('shaft');
  const [isDrillFinished, setIsDrillFinished] = useState<boolean>(false);

  // Bind camera stream to video ref
  useEffect(() => {
    if (bgVideoRef.current && cameraStream) {
      bgVideoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream, bgBackdrop]);

  // Dynamically orient Three.js camera based on live IMU pitch, roll & heading
  useEffect(() => {
    if (cameraRef.current) {
      const pitchRad = THREE.MathUtils.degToRad(pitch * 0.4);
      const rollRad = THREE.MathUtils.degToRad(-roll * 0.4);
      const yawRad = THREE.MathUtils.degToRad(heading * 0.1);
      cameraRef.current.rotation.x = pitchRad;
      cameraRef.current.rotation.z = rollRad;
      cameraRef.current.rotation.y = yawRad;
    }
  }, [pitch, roll, heading]);

  // Three.js internal refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const flameMeshGroupRef = useRef<THREE.Group | null>(null);
  const fireLightRef = useRef<THREE.PointLight | null>(null);
  const co2ParticlesRef = useRef<THREE.Points | null>(null);
  const extinguisherGroupRef = useRef<THREE.Group | null>(null);
  const safetyPinMeshRef = useRef<THREE.Mesh | null>(null);

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
    if (isDrillFinished || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isDrillFinished, timerSeconds]);

  // Main Three.js Scene Setup & Animation Loop
  useEffect(() => {
    if (!canvasContainerRef.current) return;
    const width = canvasContainerRef.current.clientWidth;
    const height = canvasContainerRef.current.clientHeight;

    // 1. Create Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null; // transparent for overlay on CSS backdrop

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3.2);
    camera.lookAt(0, 0.5, 0);
    cameraRef.current = camera;

    // 2. Create WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    // Clear previous canvas elements if re-mounted
    while (canvasContainerRef.current.firstChild) {
      canvasContainerRef.current.removeChild(canvasContainerRef.current.firstChild);
    }
    canvasContainerRef.current.appendChild(renderer.domElement);

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xf59e0b, 1.2);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    // Dynamic Flame Point Light (flickering orange/red)
    const fireLight = new THREE.PointLight(0xff5500, 3, 6);
    fireLight.position.set(0, 0.5, 0);
    scene.add(fireLight);
    fireLightRef.current = fireLight;

    // 4. AR LiDAR Floor Surface Plane Grid
    const gridHelper = new THREE.GridHelper(6, 20, 0x00f0ff, 0x334155);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // 5. Build Procedural 3D Low-Poly Fire Mesh & Embers
    const flameGroup = new THREE.Group();

    // Flame Core Cone
    const flameGeo = new THREE.ConeGeometry(0.4, 1.1, 8);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xff3300,
      wireframe: false,
      transparent: true,
      opacity: 0.85
    });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.set(0, 0.55, 0);
    flameGroup.add(flameMesh);

    // Flame Inner Core (Yellow)
    const innerFlameGeo = new THREE.ConeGeometry(0.22, 0.7, 6);
    const innerFlameMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    const innerFlameMesh = new THREE.Mesh(innerFlameGeo, innerFlameMat);
    innerFlameMesh.position.set(0, 0.4, 0);
    flameGroup.add(innerFlameMesh);

    // Industrial Coal Base Log/Tray
    const trayGeo = new THREE.CylinderGeometry(0.6, 0.7, 0.15, 12);
    const trayMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const trayMesh = new THREE.Mesh(trayGeo, trayMat);
    trayMesh.position.set(0, 0.07, 0);
    flameGroup.add(trayMesh);

    flameGroup.position.set(0, 0, 0);
    scene.add(flameGroup);
    flameMeshGroupRef.current = flameGroup;

    // 6. Build Procedural 3D CO2 Fire Extinguisher Model
    const extGroup = new THREE.Group();

    // Cylinder Body (Red)
    const bodyGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.7, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.4, roughness: 0.3 });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.set(0, 0.35, 0);
    extGroup.add(bodyMesh);

    // Valve Top (Brass)
    const valveGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.15, 12);
    const valveMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.2 });
    const valveMesh = new THREE.Mesh(valveGeo, valveMat);
    valveMesh.position.set(0, 0.75, 0);
    extGroup.add(valveMesh);

    // Safety Pin Ring (Yellow)
    const pinGeo = new THREE.TorusGeometry(0.05, 0.012, 8, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.set(0.1, 0.78, 0);
    extGroup.add(pinMesh);
    safetyPinMeshRef.current = pinMesh;

    // Hose Nozzle
    const hoseGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.35, 8);
    const hoseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const hoseMesh = new THREE.Mesh(hoseGeo, hoseMat);
    hoseMesh.rotation.z = -Math.PI / 3;
    hoseMesh.position.set(-0.15, 0.65, 0);
    extGroup.add(hoseMesh);

    extGroup.position.set(0.7, 0, 1.2);
    scene.add(extGroup);
    extinguisherGroupRef.current = extGroup;

    // 7. CO2 Fog Spray Particle System
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 0.1;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0
    });
    const co2Particles = new THREE.Points(particleGeo, particleMat);
    co2Particles.position.set(0, 0.5, 0.8);
    scene.add(co2Particles);
    co2ParticlesRef.current = co2Particles;

    // 8. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Flame Flickering effect
      if (flameMeshGroupRef.current && fireLightRef.current) {
        const scaleY = 1 + Math.sin(elapsedTime * 12) * 0.12;
        flameMeshGroupRef.current.scale.set(1, scaleY, 1);
        fireLightRef.current.intensity = 2.5 + Math.sin(elapsedTime * 15) * 0.8;
      }

      // CO2 particle fog animation when trigger squeezed
      if (co2ParticlesRef.current && isTriggerSqueezed) {
        (co2ParticlesRef.current.material as THREE.PointsMaterial).opacity = 0.85;
        const posAttr = co2ParticlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          let z = posAttr.getZ(i);
          z -= 0.04;
          if (z < -1.2) z = 0;
          posAttr.setZ(i, z);
        }
        posAttr.needsUpdate = true;
      } else if (co2ParticlesRef.current) {
        (co2ParticlesRef.current.material as THREE.PointsMaterial).opacity = 0;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update Three.js objects based on React state changes
  useEffect(() => {
    // Pin pull animation
    if (isPinPulled && safetyPinMeshRef.current) {
      safetyPinMeshRef.current.position.x = 0.4;
      safetyPinMeshRef.current.rotation.y = Math.PI / 2;
    }

    // Flame size scaling down based on fire health
    if (flameMeshGroupRef.current) {
      const targetScale = Math.max(0, fireHealth / 100);
      flameMeshGroupRef.current.scale.set(targetScale, targetScale, targetScale);
    }
  }, [isPinPulled, fireHealth]);

  // Step 1: Pull Pin Handler
  const handlePullPin = () => {
    if (!isPinPulled) {
      setIsPinPulled(true);
      setCurrentPassStep(2);
      speakVoiceCue("Safety pin removed! Step 2: Aim nozzle at the base of the flame.");
    }
  };

  // Step 2: Aim Nozzle Handler
  const handleAimNozzle = () => {
    if (isPinPulled && !isAimAligned) {
      setIsAimAligned(true);
      setCurrentPassStep(3);
      speakVoiceCue("Nozzle aimed at fire base. Step 3: Press and hold trigger to discharge CO2.");
    }
  };

  // Step 3 & 4: Trigger & Sweep Action
  const handleSqueezeDown = () => {
    if (!isPinPulled || !isAimAligned) return;
    setIsTriggerSqueezed(true);
    if (currentPassStep === 3) {
      setCurrentPassStep(4);
      speakVoiceCue("Discharging CO2. Step 4: Sweep side to side horizontally across base.");
    }
  };

  const handleSqueezeUp = () => {
    setIsTriggerSqueezed(false);
  };

  const handleSweepAction = () => {
    if (isTriggerSqueezed || currentPassStep >= 3) {
      setSweepProgress((prev) => {
        const next = Math.min(100, prev + 20);
        const newHealth = Math.max(0, 100 - next);
        setFireHealth(newHealth);

        if (newHealth === 0 && !isDrillFinished) {
          setIsDrillFinished(true);
          speakVoiceCue("Fire completely extinguished! P-A-S-S Drill successfully passed.");
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          if (onDrillComplete) onDrillComplete();
        }
        return next;
      });
    }
  };

  const resetDrillState = () => {
    setCurrentPassStep(1);
    setIsPinPulled(false);
    setIsAimAligned(false);
    setIsTriggerSqueezed(false);
    setSweepProgress(0);
    setFireHealth(100);
    setTimerSeconds(20);
    setIsDrillFinished(false);
    if (safetyPinMeshRef.current) {
      safetyPinMeshRef.current.position.set(0.1, 0.78, 0);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-4">
      
      {/* P-A-S-S Drill Header Info Bar */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Flame className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 flex items-center gap-2">
              {t.passDrillTitle}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                WebGL 3D Core
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Industrial CO2 Fire Suppression Protocol • Jharkhand Vocational Standard
            </p>
          </div>
        </div>

        {/* Backdrop Switcher Toggle */}
        <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-lg p-1 text-[11px]">
          <button
            onClick={() => setBgBackdrop('shaft')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              bgBackdrop === 'shaft' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Subterranean Mine Shaft
          </button>
          <button
            onClick={() => setBgBackdrop('camera')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              bgBackdrop === 'camera' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Live Camera Feed
          </button>
        </div>
      </div>

      {/* Main 3D Canvas AR HUD Frame Container */}
      <div className="relative w-full max-w-2xl h-[480px] bg-slate-950 border-4 border-slate-700 rounded-2xl shadow-2xl overflow-hidden select-none">
        
        {/* Dynamic Background Image / Pattern */}
        {bgBackdrop === 'shaft' && !isCameraActive ? (
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0b1120] to-[#050811] opacity-95">
            {/* Mine Tunnel Timber Beams Graphic Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_2px,transparent_2px),linear-gradient(to_bottom,#1e293b15_2px,transparent_2px)] bg-[size:32px_32px]" />
          </div>
        ) : customBgUrl ? (
          <img src={customBgUrl} alt="Live AR Photo Backdrop" className="absolute inset-0 z-0 w-full h-full object-cover" />
        ) : cameraStream ? (
          <video
            ref={bgVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 z-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 z-0 bg-slate-900 flex items-center justify-center">
            <Video className="w-16 h-16 text-slate-700 opacity-20 animate-pulse" />
            <p className="absolute bottom-4 text-xs font-mono text-slate-500">
              Live Camera Feed AR Camera Viewfinder
            </p>
          </div>
        )}

        {/* Three.js Canvas Injection Container */}
        <div ref={canvasContainerRef} className="absolute inset-0 z-10 w-full h-full" />

        {/* AR Overlay HUD Graphics */}
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-4">
          
          {/* Top Telemetry & Proximity Alerts */}
          <div className="flex items-center justify-between text-[11px] font-mono">
            
            {/* Proximity / LiDAR Distance Status */}
            <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-1.5 flex items-center space-x-2 text-slate-200 pointer-events-auto">
              <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Distance: {distanceMeters.toFixed(1)}m</span>
              {distanceMeters < 1.8 ? (
                <span className="text-red-400 font-bold animate-pulse">⚠️ TOO CLOSE</span>
              ) : (
                <span className="text-emerald-400 font-bold">✅ OPTIMAL</span>
              )}
            </div>

            {/* Timer & LUX Meter */}
            <div className="flex items-center space-x-2">
              <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-1.5 text-amber-400 font-bold">
                ⏱️ {timerSeconds}s Remaining
              </div>
              <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-400">
                LUX: {luxValue}
              </div>
            </div>
          </div>

          {/* Center Target Crosshair & LiDAR Grid Overlay */}
          <div className="relative flex flex-col items-center justify-center my-auto">
            <div className="relative w-48 h-48 border border-dashed border-amber-500/60 rounded-full flex items-center justify-center">
              <Crosshair className="w-12 h-12 text-amber-400 opacity-80 animate-pulse" />
              
              {/* Dynamic Health Bar Gauge */}
              <div className="absolute -bottom-8 w-36 bg-slate-950/90 border border-slate-800 rounded-lg p-1.5 text-center">
                <div className="flex justify-between text-[10px] font-mono mb-1 text-slate-300">
                  <span>Flame Size</span>
                  <span className="font-bold text-amber-400">{fireHealth}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-red-500 via-amber-500 to-emerald-400 h-2 transition-all duration-300"
                    style={{ width: `${fireHealth}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Interactive Workflow Action Controls */}
          <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 space-y-3 pointer-events-auto">
            
            {/* P-A-S-S Step Indicator */}
            <div className="grid grid-cols-4 gap-1 text-[11px] font-mono text-center">
              {[
                { step: 1, label: 'P - Pull Pin', ok: isPinPulled },
                { step: 2, label: 'A - Aim Nozzle', ok: isAimAligned },
                { step: 3, label: 'S - Squeeze', ok: isTriggerSqueezed },
                { step: 4, label: 'S - Sweep', ok: sweepProgress > 0 }
              ].map((item) => (
                <div
                  key={item.step}
                  className={`p-1.5 rounded border transition ${
                    currentPassStep === item.step
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : item.ok
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </div>

            {/* Interactive Control Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              
              {/* Step 1: Pull Pin */}
              <button
                onClick={handlePullPin}
                disabled={isPinPulled}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
                  !isPinPulled
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{t.pullPinBtn}</span>
              </button>

              {/* Step 2: Aim Nozzle */}
              <button
                onClick={handleAimNozzle}
                disabled={!isPinPulled || isAimAligned}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
                  isPinPulled && !isAimAligned
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>{t.aimNozzleBtn}</span>
              </button>

              {/* Step 3: Squeeze Trigger */}
              <button
                onMouseDown={handleSqueezeDown}
                onMouseUp={handleSqueezeUp}
                onTouchStart={handleSqueezeDown}
                onTouchEnd={handleSqueezeUp}
                disabled={!isAimAligned}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
                  isAimAligned
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>{t.squeezeTriggerBtn}</span>
              </button>

              {/* Step 4: Sweep Gesture Trigger */}
              <button
                onClick={handleSweepAction}
                disabled={!isAimAligned}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
                  isAimAligned
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{t.sweepSideBtn}</span>
              </button>

            </div>

            {/* Distance Slider Control */}
            <div className="flex items-center space-x-3 pt-1 text-[11px] font-mono text-slate-400">
              <span>Adjust Distance (LiDAR):</span>
              <input
                type="range"
                min="1.0"
                max="3.5"
                step="0.1"
                value={distanceMeters}
                onChange={(e) => setDistanceMeters(parseFloat(e.target.value))}
                className="flex-1 accent-amber-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
              <button
                onClick={resetDrillState}
                className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Completion Pass Modal */}
      {isDrillFinished && (
        <div className="w-full max-w-2xl bg-emerald-500/10 border-2 border-emerald-500 rounded-xl p-4 text-center space-y-2 animate-in fade-in">
          <div className="w-10 h-10 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center mx-auto font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-extrabold text-emerald-400">
            {t.flameExtinguished}
          </h4>
          <p className="text-xs text-slate-300 font-mono">
            P-A-S-S Fire Extinguisher Vocational Certification Drill Verified (100% Compliant)
          </p>
        </div>
      )}

    </div>
  );
};
