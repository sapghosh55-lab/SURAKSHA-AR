export type ThreatLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export interface VillageThreat {
  id: string;
  name: string;
  block: string;
  district: string;
  threatLevel: ThreatLevel;
  affectedAreaHa: number;
  inundationChangePct: number;
  lat: number;
  lng: number;
  status: 'PENDING' | 'DISPATCHED' | 'MONITORING';
  contactPerson: string;
  contactPhone: string;
  bengaliAlertText: string;
  audioUrl: string;
  lastUpdated: string;
}

export interface DispatchStatus {
  villageId: string;
  sentAt?: string;
  twilioSid?: string;
  audioStatus: 'READY' | 'PLAYING' | 'PAUSED';
}

export const THREAT_LEVELS = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MODERATE: 'MODERATE',
  LOW: 'LOW'
} as const;
