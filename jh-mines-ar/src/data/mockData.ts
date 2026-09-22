import { MiningSite, WorkerCertRecord, IncidentViolationLog, OfflineModuleItem, SafetyScenario } from '../types';

export const safetyScenariosData: SafetyScenario[] = [
  {
    id: 'methane_drill',
    title: {
      en: 'Underground Methane (CH4) & Flame Lamp Inspection',
      hi: 'भूमिगत मीथेन (CH4) एवं फ्लेम लैंप निरीक्षण',
      sat: 'ᱚᱛ ᱞᱟᱛᱟᱨ Methane (CH4) & Safety Lamp ᱧᱮᱞ'
    },
    subtitle: {
      en: 'Jharia Shaft #4 Deep Coal Seam',
      hi: 'झरिया शाफ्ट #4 गहरी कोयला सीम',
      sat: 'Jharia Shaft #4 Deep Coal Seam'
    },
    locationName: {
      en: 'Dhanbad Mining Zone • Depth 420m',
      hi: 'धनबाद खनन क्षेत्र • गहराई 420m',
      sat: 'Dhanbad Mining Zone • Depth 420m'
    },
    difficulty: 'Advanced',
    estimatedTimeMin: 12,
    stepsCount: 4,
    iconName: 'Flame',
    badgeTag: 'HIGH EXPLOSION RISK'
  },
  {
    id: 'loto_conveyor',
    title: {
      en: 'Crusher & Conveyor Lockout / Tagout (LOTO)',
      hi: 'क्रशर एवं कन्वेयर लॉकआउट / टैगआउट (LOTO)',
      sat: 'Crusher & Conveyor Lockout / Tagout (LOTO)'
    },
    subtitle: {
      en: 'Bokaro Steel Coal Preparation Plant #2',
      hi: 'बोकारो स्टील कोल वाशरी प्लांट #2',
      sat: 'Bokaro Steel Coal Washery Plant #2'
    },
    locationName: {
      en: 'Bokaro Industrial Complex',
      hi: 'बोकारो औद्योगिक परिसर',
      sat: 'Bokaro Industrial Complex'
    },
    difficulty: 'Intermediate',
    estimatedTimeMin: 10,
    stepsCount: 5,
    iconName: 'Lock',
    badgeTag: 'MECHANICAL PINCH HAZARD'
  },
  {
    id: 'ppe_scanner',
    title: {
      en: 'AI Computer Vision Hardhat & Dust Respirator Audit',
      hi: 'एआई विज़न हेलमेट एवं डस्ट मास्क जांच',
      sat: 'AI Vision Hardhat & Dust Mask Check'
    },
    subtitle: {
      en: 'Ghatsila Underground Copper Shaft B',
      hi: 'घाटशिला कॉपर भूमिगत शाफ्ट B',
      sat: 'Ghatsila Copper Shaft B'
    },
    locationName: {
      en: 'East Singhbhum Copper Belt',
      hi: 'पूर्वी सिंहभूम कॉपर बेल्ट',
      sat: 'East Singhbhum Copper Belt'
    },
    difficulty: 'Basic',
    estimatedTimeMin: 5,
    stepsCount: 3,
    iconName: 'ShieldAlert',
    badgeTag: 'SILICA DUST PROTECTION'
  },
  {
    id: 'pit_wall_stability',
    title: {
      en: 'Open-Cast Rock Bench Slope Stress AR Scan',
      hi: 'ओपन-कास्ट रॉक बेंच ढलान तनाव एआर स्कैन',
      sat: 'Open-Cast Rock Slope Stress AR Scan'
    },
    subtitle: {
      en: 'West Singhbhum Iron Ore Pit #3',
      hi: 'पश्चिम सिंहभूम लौह अयस्क खदान #3',
      sat: 'West Singhbhum Iron Ore Pit #3'
    },
    locationName: {
      en: 'Noamundi Iron Mine Sector',
      hi: 'नोआमुंडी लौह खदान क्षेत्र',
      sat: 'Noamundi Iron Mine Sector'
    },
    difficulty: 'Intermediate',
    estimatedTimeMin: 8,
    stepsCount: 4,
    iconName: 'Activity',
    badgeTag: 'SLOPE FAILURE WARNING'
  }
];

export const miningSitesData: MiningSite[] = [
  {
    id: 'jh-site-01',
    name: 'Jharia Deep Underground Coal Shaft #4',
    district: 'Dhanbad',
    sector: 'Underground Coal',
    overallSafetyScore: 94,
    activeWorkers: 342,
    urgentHazards: 1,
    meshSyncStatus: 'Offline Ready',
    coordinates: { lat: 23.7486, lng: 86.4172 },
    lastInspectorAudit: '2026-09-21'
  },
  {
    id: 'jh-site-02',
    name: 'Bokaro Steel Coal Washing & Crusher Plant',
    district: 'Bokaro',
    sector: 'Heavy Manufacturing',
    overallSafetyScore: 98,
    activeWorkers: 510,
    urgentHazards: 0,
    meshSyncStatus: 'Online',
    coordinates: { lat: 23.6693, lng: 86.1511 },
    lastInspectorAudit: '2026-09-22'
  },
  {
    id: 'jh-site-03',
    name: 'Noamundi Opencast Iron Ore Quarry',
    district: 'West Singhbhum',
    sector: 'Opencast Iron Ore',
    overallSafetyScore: 91,
    activeWorkers: 280,
    urgentHazards: 2,
    meshSyncStatus: 'Offline Ready',
    coordinates: { lat: 22.1528, lng: 85.5342 },
    lastInspectorAudit: '2026-09-19'
  },
  {
    id: 'jh-site-04',
    name: 'Ghatsila Underground Copper Shaft B',
    district: 'East Singhbhum',
    sector: 'Copper Underground',
    overallSafetyScore: 96,
    activeWorkers: 195,
    urgentHazards: 0,
    meshSyncStatus: 'Online',
    coordinates: { lat: 22.5833, lng: 86.4833 },
    lastInspectorAudit: '2026-09-20'
  }
];

export const workerCertRecordsData: WorkerCertRecord[] = [
  {
    id: 'w-101',
    name: 'Budheshwar Marandi (ᱵᱩᱫᱷᱮᱥᱣᱚᱨ ᱢᱟᱨᱟᱱᱰᱤ)',
    employeeId: 'JH-MIN-8821',
    mineSite: 'Jharia Coal Shaft #4',
    role: 'Underground Timber & Bolt Technician',
    languagePref: 'sat',
    overallScore: 98,
    completedModulesCount: 14,
    lastDrillDate: '2026-09-22',
    certificationStatus: 'Certified Safety Expert',
    certBadgeId: 'JH-CERT-2026-0941'
  },
  {
    id: 'w-102',
    name: 'Rajesh Kumar Mahato',
    employeeId: 'JH-MIN-7492',
    mineSite: 'Bokaro Steel Washery',
    role: 'Heavy Conveyor Mechanic',
    languagePref: 'hi',
    overallScore: 95,
    completedModulesCount: 14,
    lastDrillDate: '2026-09-21',
    certificationStatus: 'Certified Safety Expert',
    certBadgeId: 'JH-CERT-2026-0812'
  },
  {
    id: 'w-103',
    name: 'Sombari Tudu (ᱥᱳᱢᱵᱟᱨᱤ ᱴᱩᱰᱩ)',
    employeeId: 'JH-MIN-6301',
    mineSite: 'Noamundi Opencast Quarry',
    role: 'Heavy Excavator Operator',
    languagePref: 'sat',
    overallScore: 89,
    completedModulesCount: 11,
    lastDrillDate: '2026-09-18',
    certificationStatus: 'Recertification Due',
    certBadgeId: 'JH-CERT-2025-4410'
  },
  {
    id: 'w-104',
    name: 'Anil Soren',
    employeeId: 'JH-MIN-9104',
    mineSite: 'Ghatsila Copper Shaft B',
    role: 'Subterranean Electrician',
    languagePref: 'en',
    overallScore: 92,
    completedModulesCount: 13,
    lastDrillDate: '2026-09-20',
    certificationStatus: 'Certified Safety Expert',
    certBadgeId: 'JH-CERT-2026-0773'
  },
  {
    id: 'w-105',
    name: 'Vikram Singh Munda',
    employeeId: 'JH-MIN-3319',
    mineSite: 'Jharia Coal Shaft #4',
    role: 'Safety Gas Inspector Trainee',
    languagePref: 'hi',
    overallScore: 78,
    completedModulesCount: 8,
    lastDrillDate: '2026-09-15',
    certificationStatus: 'In Training',
    certBadgeId: 'JH-TRAIN-2026-009'
  }
];

export const incidentViolationLogsData: IncidentViolationLog[] = [
  {
    id: 'log-801',
    timestamp: '2026-09-22 14:23',
    mineSite: 'Jharia Coal Shaft #4',
    type: 'CH4 Methane Spike',
    severity: 'Critical',
    reportedBy: 'AR Gas Sensor HUD #4',
    aiRiskScore: 88,
    status: 'Mitigated',
    offlineSynced: true
  },
  {
    id: 'log-802',
    timestamp: '2026-09-22 11:05',
    mineSite: 'Bokaro Crusher Plant',
    type: 'LOTO Violation',
    severity: 'Warning',
    reportedBy: 'AI Vision Camera Cam-02',
    aiRiskScore: 65,
    status: 'Open',
    offlineSynced: true
  },
  {
    id: 'log-803',
    timestamp: '2026-09-21 16:40',
    mineSite: 'Noamundi Iron Mine',
    type: 'Rockfall Wall Creep',
    severity: 'Warning',
    reportedBy: 'LiDAR Bench Scanner #3',
    aiRiskScore: 72,
    status: 'Under Investigation',
    offlineSynced: true
  },
  {
    id: 'log-804',
    timestamp: '2026-09-21 09:15',
    mineSite: 'Ghatsila Copper Shaft B',
    type: 'Unfitted PPE',
    severity: 'Info',
    reportedBy: 'Mobile AR Checkpoint #1',
    aiRiskScore: 24,
    status: 'Mitigated',
    offlineSynced: true
  }
];

export const offlineModulesData: OfflineModuleItem[] = [
  {
    id: 'mod-1',
    title: {
      en: 'Underground Methane & Inflammable Gas Evacuation',
      hi: 'भूमिगत मीथेन एवं दहनशील गैस निकासी',
      sat: 'ᱚᱛ ᱞᱟᱛᱟᱨ Methane & ᱜᱮᱥ ᱚᱰᱳᱠᱚᱜ'
    },
    sizeMB: 48.2,
    version: 'v3.4 (Offline Verified)',
    lastUpdated: '2026-09-20',
    status: 'Cached & Verified',
    meshPeers: 14
  },
  {
    id: 'mod-2',
    title: {
      en: 'Heavy Machine LOTO & Breaker Panel Tagging',
      hi: 'भारी मशीन LOTO एवं ब्रेकर पैनल टैगिंग',
      sat: 'Heavy Machine LOTO & Breaker Tagging'
    },
    sizeMB: 36.8,
    version: 'v2.9',
    lastUpdated: '2026-09-19',
    status: 'Cached & Verified',
    meshPeers: 14
  },
  {
    id: 'mod-3',
    title: {
      en: 'AI Hardhat & Respirator Computer Vision Models',
      hi: 'एआई हेलमेट एवं मास्क विज़न मॉडल',
      sat: 'AI Hardhat & Respirator Vision Models'
    },
    sizeMB: 62.1,
    version: 'v4.1',
    lastUpdated: '2026-09-22',
    status: 'Cached & Verified',
    meshPeers: 14
  },
  {
    id: 'mod-4',
    title: {
      en: 'Open-Cast Bench Rock Wall Stress LiDAR Pointclouds',
      hi: 'ओपन-कास्ट बेंच रॉकवॉल तनाव बिंदु क्लाउड',
      sat: 'Open-Cast Rock Wall LiDAR Pointclouds'
    },
    sizeMB: 84.5,
    version: 'v2.1',
    lastUpdated: '2026-09-18',
    status: 'Cached & Verified',
    meshPeers: 12
  }
];
