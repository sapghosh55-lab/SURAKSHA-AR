export type Language = 'en' | 'hi' | 'sat'; // English, Hindi, Santali (Ol Chiki)

export type ViewportMode = 'mobile' | 'desktop';

export type RoleMode = 'trainee' | 'inspector';

export type SafetyScenarioId = 
  | 'methane_drill' 
  | 'loto_conveyor' 
  | 'ppe_scanner' 
  | 'pit_wall_stability';

export interface SafetyScenario {
  id: SafetyScenarioId;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  locationName: Record<Language, string>;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  estimatedTimeMin: number;
  stepsCount: number;
  iconName: string;
  badgeTag: string;
}

export interface MiningSite {
  id: string;
  name: string;
  district: string;
  sector: 'Underground Coal' | 'Opencast Iron Ore' | 'Copper Underground' | 'Heavy Manufacturing';
  overallSafetyScore: number;
  activeWorkers: number;
  urgentHazards: number;
  meshSyncStatus: 'Online' | 'Offline Ready' | 'Syncing';
  coordinates: { lat: number; lng: number };
  lastInspectorAudit: string;
}

export interface WorkerCertRecord {
  id: string;
  name: string;
  employeeId: string;
  mineSite: string;
  role: string;
  languagePref: Language;
  overallScore: number;
  completedModulesCount: number;
  lastDrillDate: string;
  certificationStatus: 'Certified Safety Expert' | 'Recertification Due' | 'In Training';
  certBadgeId: string;
}

export interface IncidentViolationLog {
  id: string;
  timestamp: string;
  mineSite: string;
  type: 'CH4 Methane Spike' | 'LOTO Violation' | 'Unfitted PPE' | 'Rockfall Wall Creep';
  severity: 'Critical' | 'Warning' | 'Info';
  reportedBy: string;
  aiRiskScore: number; // 1-100
  status: 'Open' | 'Mitigated' | 'Under Investigation';
  offlineSynced: boolean;
}

export interface OfflineModuleItem {
  id: string;
  title: Record<Language, string>;
  sizeMB: number;
  version: string;
  lastUpdated: string;
  status: 'Cached & Verified' | 'Downloading' | 'Update Available';
  meshPeers: number;
}
