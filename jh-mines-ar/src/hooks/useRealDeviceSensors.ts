import { useState, useEffect, useRef, useCallback } from 'react';

export type TrackingQuality = 'OPTIMAL' | 'LOW_LIGHT' | 'UNSTABLE_MOTION';

export interface IMUData {
  pitch: number;    // Beta: [-180, 180]
  roll: number;     // Gamma: [-90, 90]
  heading: number;  // Alpha: [0, 360]
  accelX: number;   // m/s²
  accelY: number;   // m/s²
  accelZ: number;   // m/s²
  motionIntensity: number; // m/s² (Magnitude of linear acceleration)
  hasHardwareIMU: boolean;
}

export interface RealDeviceSensorsResult {
  isCameraActive: boolean;
  cameraStream: MediaStream | null;
  cameraError: string | null;
  luxValue: number;
  trackingQuality: TrackingQuality;
  imuData: IMUData;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  toggleCamera: () => Promise<void>;
  requestSensorPermissions: () => Promise<void>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const useRealDeviceSensors = (): RealDeviceSensorsResult => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const [luxValue, setLuxValue] = useState<number>(420);

  const [imuData, setImuData] = useState<IMUData>({
    pitch: 12,
    roll: -4,
    heading: 184,
    accelX: 0,
    accelY: 0,
    accelZ: 0,
    motionIntensity: 0,
    hasHardwareIMU: false
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const samplingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const samplingCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Initialize offscreen sampling canvas (64 x 48 px)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 48;
      samplingCanvasRef.current = canvas;
      samplingCtxRef.current = canvas.getContext('2d', { willReadFrequently: true });
    }
  }, []);

  // Sensor Permission Request (iOS & Android compatibility)
  const requestSensorPermissions = useCallback(async () => {
    try {
      if (
        typeof window !== 'undefined' &&
        'DeviceOrientationEvent' in window &&
        typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function'
      ) {
        const orientationPermission = await (
          DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }
        ).requestPermission();
        if (orientationPermission !== 'granted') {
          console.warn('DeviceOrientation permission not granted');
        }
      }

      if (
        typeof window !== 'undefined' &&
        'DeviceMotionEvent' in window &&
        typeof (DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function'
      ) {
        const motionPermission = await (
          DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }
        ).requestPermission();
        if (motionPermission !== 'granted') {
          console.warn('DeviceMotion permission not granted');
        }
      }
    } catch (err) {
      console.error('Error requesting sensor permissions:', err);
    }
  }, []);

  // Camera Management Functions
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      await requestSensorPermissions();

      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Webcam / Rear Camera API is not supported in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setCameraStream(stream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Camera permission denied or no camera device connected.';
      console.error('Camera access error:', err);
      setCameraError(errorMsg);
      setIsCameraActive(false);
    }
  }, [requestSensorPermissions]);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, [cameraStream]);

  const toggleCamera = useCallback(async () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      await startCamera();
    }
  }, [isCameraActive, startCamera, stopCamera]);

  // Bind video element srcObject whenever cameraStream changes
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraStream]);

  // Clean camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Device IMU Orientation Listener
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null || e.gamma !== null || e.alpha !== null) {
        setImuData((prev) => ({
          ...prev,
          pitch: Math.round(e.beta ?? 0),
          roll: Math.round(e.gamma ?? 0),
          heading: Math.round(e.alpha ?? 0),
          hasHardwareIMU: true
        }));
      }
    };

    const handleMotion = (e: DeviceMotionEvent) => {
      const accel = e.acceleration || e.accelerationIncludingGravity;
      if (accel) {
        const x = accel.x ?? 0;
        const y = accel.y ?? 0;
        const z = accel.z ?? 0;
        // If acceleration includes gravity, subtract baseline (~9.81) if needed or use net magnitude
        const rawMagnitude = Math.sqrt(x * x + y * y + z * z);
        const motionIntensity = e.acceleration
          ? rawMagnitude
          : Math.max(0, Math.abs(rawMagnitude - 9.81));

        setImuData((prev) => ({
          ...prev,
          accelX: parseFloat(x.toFixed(2)),
          accelY: parseFloat(y.toFixed(2)),
          accelZ: parseFloat(z.toFixed(2)),
          motionIntensity: parseFloat(motionIntensity.toFixed(2)),
          hasHardwareIMU: true
        }));
      }
    };

    if (typeof window !== 'undefined') {
      if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', handleOrientation);
      }
      if ('DeviceMotionEvent' in window) {
        window.addEventListener('devicemotion', handleMotion);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, []);

  // Desktop Fallback IMU Motion Tick (if no hardware gyroscope)
  useEffect(() => {
    if (imuData.hasHardwareIMU) return;
    const interval = setInterval(() => {
      const t = Date.now() / 1000;
      setImuData((prev) => ({
        ...prev,
        pitch: Math.round(12 + Math.sin(t * 1.5) * 5),
        roll: Math.round(-4 + Math.cos(t * 2) * 4),
        heading: Math.round((184 + Math.sin(t * 0.8) * 12) % 360),
        accelX: parseFloat((Math.sin(t * 3) * 1.2).toFixed(2)),
        accelY: parseFloat((Math.cos(t * 2.5) * 1.5).toFixed(2)),
        accelZ: parseFloat((Math.sin(t * 4) * 0.8).toFixed(2)),
        motionIntensity: parseFloat((Math.abs(Math.sin(t * 3)) * 2.5).toFixed(2)),
        hasHardwareIMU: false
      }));
    }, 200);

    return () => clearInterval(interval);
  }, [imuData.hasHardwareIMU]);

  // Optical Lux Estimation from live video stream (offscreen 64x48 sampling canvas every 200ms)
  useEffect(() => {
    if (!isCameraActive || !cameraStream) {
      return;
    }

    const sampleInterval = setInterval(() => {
      const video = videoRef.current;
      const canvas = samplingCanvasRef.current;
      const ctx = samplingCtxRef.current;

      if (!video || !canvas || !ctx || video.readyState < 2 || video.videoWidth === 0) {
        return;
      }

      try {
        ctx.drawImage(video, 0, 0, 64, 48);
        const imageData = ctx.getImageData(0, 0, 64, 48);
        const data = imageData.data;

        let totalLuminance = 0;
        const numPixels = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Photometric luminance formula: 0.299*R + 0.587*G + 0.114*B
          totalLuminance += 0.299 * r + 0.587 * g + 0.114 * b;
        }

        const avgLuminance = totalLuminance / numPixels; // [0, 255]
        // Scale luminance [0, 255] to Lux range [0, 650 Lux]
        const calculatedLux = Math.min(650, Math.max(0, Math.round((avgLuminance / 255) * 650)));

        setLuxValue(calculatedLux);
      } catch (e) {
        console.error('Error computing optical lux estimation:', e);
      }
    }, 200);

    return () => clearInterval(sampleInterval);
  }, [isCameraActive, cameraStream]);

  // Dynamically calculate SLAM tracking status based on Lux and motion intensity
  const trackingQuality: TrackingQuality =
    imuData.motionIntensity > 15
      ? 'UNSTABLE_MOTION'
      : luxValue < 45
      ? 'LOW_LIGHT'
      : 'OPTIMAL';

  return {
    isCameraActive,
    cameraStream,
    cameraError,
    luxValue,
    trackingQuality,
    imuData,
    startCamera,
    stopCamera,
    toggleCamera,
    requestSensorPermissions,
    videoRef
  };
};
