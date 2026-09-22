import { Language } from '../types';

export interface TranslationDictionary {
  // Branding & Header
  govtDept: string;
  subTitleHeader: string;
  offlineReadyBadge: string;
  offlineSubText: string;
  roleTrainee: string;
  roleInspector: string;
  viewportMobile: string;
  viewportDesktop: string;
  languageName: string;
  
  // Trainee AR HUD
  traineeHeaderTitle: string;
  traineeHeaderSub: string;
  arCameraView: string;
  arSensorsActive: string;
  meshSignal: string;
  batteryTelemetry: string;
  selectScenario: string;
  startDrill: string;
  resetDrill: string;
  stepProgress: string;
  targetReticle: string;
  audioGuideActive: string;
  aiScannerRunning: string;
  hazardDetected: string;
  complianceSuccess: string;
  generateCertificate: string;

  // PASS Drill Specific
  passDrillTitle: string;
  passStep1: string;
  passStep2: string;
  passStep3: string;
  passStep4: string;
  pullPinBtn: string;
  aimNozzleBtn: string;
  squeezeTriggerBtn: string;
  sweepSideBtn: string;
  tooCloseAlert: string;
  optimalDistanceAlert: string;
  flameExtinguished: string;

  // Gas & Confined Space Specific
  gasDrillTitle: string;
  scbaEquipped: string;
  mshaHelmetEquipped: string;
  safeHeadlampEquipped: string;
  gasDetectorEquipped: string;
  ppeSelectPrompt: string;
  buddyChecklistTitle: string;
  buddyCheckOk: string;
  ch4PpmMeter: string;
  coPpmMeter: string;
  escapeArrowSign: string;
  exhaustActivated: string;
  
  // Scenarios
  methaneTitle: string;
  methaneDesc: string;
  methaneWarning: string;
  lotoTitle: string;
  lotoDesc: string;
  lotoWarning: string;
  ppeTitle: string;
  ppeDesc: string;
  ppeWarning: string;
  slopeTitle: string;
  slopeDesc: string;
  slopeWarning: string;

  // Inspector Dashboard
  adminTitle: string;
  adminSub: string;
  totalMineSites: string;
  overallCompliance: string;
  activeWorkersCount: string;
  highRiskHazards: string;
  dhanbadJhariaRegion: string;
  workerRoster: string;
  searchWorker: string;
  certificationStatus: string;
  incidentLogs: string;
  aiRiskForecast: string;
  syncDesk: string;
  exportAuditReport: string;
  
  // Common
  close: string;
  confirm: string;
  syncNow: string;
  statusVerified: string;
  jharkhandStateTag: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    govtDept: "Govt of Jharkhand — Dept of Mines & Safety",
    subTitleHeader: "Subterranean AR Vocational & Safety Compliance Portal (SIH26041)",
    offlineReadyBadge: "Status: Offline Ready",
    offlineSubText: "14 Modules Cached • Underground Mesh Active",
    roleTrainee: "Trainee Mode (Mobile AR)",
    roleInspector: "Inspector / Admin Dashboard",
    viewportMobile: "Rugged Mobile View",
    viewportDesktop: "Desktop Command Center",
    languageName: "English",

    traineeHeaderTitle: "Subterranean WebAR Training Simulator",
    traineeHeaderSub: "Augmented Reality Field Drill for Mining & Heavy Industry",
    arCameraView: "AR Viewfinder Camera Live",
    arSensorsActive: "LiDAR & Gas Sensors Calibrated",
    meshSignal: "Subterranean Mesh Node #JH-09",
    batteryTelemetry: "Battery 94% • Rugged IP68 Device",
    selectScenario: "Select Hazardous Drill Scenario",
    startDrill: "Launch AR Drill",
    resetDrill: "Reset Simulation",
    stepProgress: "Task Checklist Progress",
    targetReticle: "Align Camera Lens with Target Equipment",
    audioGuideActive: "Voice Assistant Active (Multilingual Audio)",
    aiScannerRunning: "AI Safety Vision Engine Scanning...",
    hazardDetected: "DANGER HAZARD DETECTED",
    complianceSuccess: "DRILL COMPLETED: 100% COMPLIANT",
    generateCertificate: "View State Certification Badge",

    passDrillTitle: "Industrial CO2 Fire Extinguisher P-A-S-S Drill",
    passStep1: "P — Pull Safety Pin (Remove locking ring)",
    passStep2: "A — Aim Nozzle (Align reticle at base of fire)",
    passStep3: "S — Squeeze Trigger (Press & hold handle lever)",
    passStep4: "S — Sweep Side to Side (Horizontal extinguishing motion)",
    pullPinBtn: "1. Pull Safety Pin",
    aimNozzleBtn: "2. Aim at Base of Flame",
    squeezeTriggerBtn: "3. Hold to Squeeze Trigger",
    sweepSideBtn: "4. Sweep Side to Side",
    tooCloseAlert: "⚠️ DANGER: Too Close! Maintain 2.0m Distance",
    optimalDistanceAlert: "✅ Safe Distance: 2.1m (LiDAR Plane Locked)",
    flameExtinguished: "🔥 FIRE EXTINGUISHED! PASS DRILL COMPLETE",

    gasDrillTitle: "Gas Leak & Confined Space SCBA Protocol",
    scbaEquipped: "SCBA Air Respirator (Sealed 300 Bar)",
    mshaHelmetEquipped: "MSHA-Rated Hardhat with Visor",
    safeHeadlampEquipped: "Intrinsically Safe Headlamp (Ex-Proof)",
    gasDetectorEquipped: "Multi-Gas Sensor Unit (CH4/CO/H2S)",
    ppeSelectPrompt: "Select All 4 Mandatory Safety Gear Items Before Entry",
    buddyChecklistTitle: "Buddy-System Safety Protocol (Budheshwar Marandi)",
    buddyCheckOk: "Buddy Verification OK • Pressure Sealed",
    ch4PpmMeter: "CH4 Methane: 2.4% (Explosion Limit Warning)",
    coPpmMeter: "CO Carbon Monoxide: 85 PPM (Toxic)",
    escapeArrowSign: "EMERGENCY ESCAPE ROUTE SHAFT B ➔",
    exhaustActivated: "Exhaust Fan & Leak Flange Valve Sealed",

    methaneTitle: "Subterranean Methane (CH4) Gas & Escape Drill",
    methaneDesc: "Detect CH4 leaks in Jharia Deep Underground Shaft #4, test flame safety lamp, and verify ventilation routes.",
    methaneWarning: "CRITICAL: CH4 Methane level at 2.4 PPM! Immediate ventilation check required.",

    lotoTitle: "Heavy Machinery Lockout / Tagout (LOTO)",
    lotoDesc: "Apply safety padlocks on Bokaro Steel Coal Crusher Conveyor Belt before maintenance routine.",
    lotoWarning: "WARNING: High mechanical pinch point risk! Verify breaker panel isolation tag.",

    ppeTitle: "AI PPE & Respirator Compliance Scanner",
    ppeDesc: "Real-time AI camera detection for helmet, dust respirator mask, safety goggles, and high-vis boots.",
    ppeWarning: "ATTENTION: Dust Respirator Mask missing or unsealed for Silica dust zone.",

    slopeTitle: "Open-Cast Slope Stability & Rockfall AR Map",
    slopeDesc: "Inspect bench rockwall vector displacement in West Singhbhum Iron Ore Pit #2.",
    slopeWarning: "ALERT: Micro-fissure expansion detected on upper bench overhang wall.",

    adminTitle: "Jharkhand Mines Inspector Command Center",
    adminSub: "State-wide Vocational Safety Monitoring, Live Audits & AI Risk Analytics",
    totalMineSites: "Active Monitored Mines",
    overallCompliance: "State Compliance Score",
    activeWorkersCount: "Underground Trainees",
    highRiskHazards: "Active Critical Warnings",
    dhanbadJhariaRegion: "Dhanbad - Jharia Coalfield Operations",
    workerRoster: "Vocationally Certified Worker Roster",
    searchWorker: "Filter by Worker Name, Mining Site, or ID...",
    certificationStatus: "Certification Status",
    incidentLogs: "Live Near-Miss & Violation Logs",
    aiRiskForecast: "AI Risk Prediction Engine",
    syncDesk: "Underground Mesh Sync Hub",
    exportAuditReport: "Export State Audit Report (PDF/CSV)",

    close: "Close",
    confirm: "Confirm Action",
    syncNow: "Force Sync Local Queue",
    statusVerified: "Verified Offline Cache",
    jharkhandStateTag: "Department of Mines & Geology • State of Jharkhand"
  },
  hi: {
    govtDept: "झारखंड सरकार — खान एवं सुरक्षा विभाग",
    subTitleHeader: "भूमिगत एआर व्यावसायिक एवं सुरक्षा अनुपालन पोर्टल (SIH26041)",
    offlineReadyBadge: "स्थिति: ऑफ़लाइन तैयार",
    offlineSubText: "14 मॉड्यूल कैश्ड • भूमिगत मेश सक्रिय",
    roleTrainee: "प्रशिक्षु मोड (मोबाइल AR)",
    roleInspector: "निरीक्षक / एडमिन डैशबोर्ड",
    viewportMobile: "रग्ड मोबाइल व्यू",
    viewportDesktop: "डेस्कटॉप कमांड सेंटर",
    languageName: "हिंदी",

    traineeHeaderTitle: "भूमिगत वेब-एआर प्रशिक्षण सिम्युलेटर",
    traineeHeaderSub: "खनन एवं भारी उद्योग हेतु संवर्धित वास्तविकता (AR) फ़ील्ड अभ्यास",
    arCameraView: "एआर व्यूफ़ाइंडर कैमरा लाइव",
    arSensorsActive: "लिडार एवं गैस सेंसर कैलिब्रेटेड",
    meshSignal: "भूमिगत मेश नोड #JH-09",
    batteryTelemetry: "बैटरी 94% • रग्ड IP68 उपकरण",
    selectScenario: "सुरक्षा ड्रिल परिदृश्य चुनें",
    startDrill: "AR ड्रिल प्रारंभ करें",
    resetDrill: "सिम्युलेशन रीसेट करें",
    stepProgress: "कार्य सूची प्रगति",
    targetReticle: "लक्ष्य उपकरण पर कैमरा संरेखित करें",
    audioGuideActive: "वॉयस असिस्टेंट सक्रिय (बहुभाषी ऑडियो)",
    aiScannerRunning: "एआई सुरक्षा विज़न इंजन स्कैन कर रहा है...",
    hazardDetected: "खतरा: जोखिम का पता चला!",
    complianceSuccess: "अभ्यास पूर्ण: 100% सुरक्षा अनुपालन",
    generateCertificate: "राज्य प्रमाण पत्र बैज देखें",

    passDrillTitle: "औद्योगिक CO2 अग्निशामक P-A-S-S अभ्यास",
    passStep1: "P — सुरक्षा पिन खींचें (सुरक्षा रिंग निकालें)",
    passStep2: "A — नोजल को आग के आधार पर लक्षित करें",
    passStep3: "S — ट्रिगर दबाएं (हैंडल लीवर दबाकर रखें)",
    passStep4: "S — दाएं-बाएं झाड़ू की तरह घुमाएं (स्वीप गति)",
    pullPinBtn: "1. सुरक्षा पिन खींचें",
    aimNozzleBtn: "2. आग के आधार पर निशाना लगाएं",
    squeezeTriggerBtn: "3. ट्रिगर दबाकर रखें",
    sweepSideBtn: "4. दाएं-बाएं स्वीप करें",
    tooCloseAlert: "⚠️ खतरा: बहुत पास हैं! 2.0 मीटर की दूरी बनाएं",
    optimalDistanceAlert: "✅ सुरक्षित दूरी: 2.1m (लिडार प्लेन लॉक)",
    flameExtinguished: "🔥 आग बुझ गई! PASS अभ्यास पूर्ण",

    gasDrillTitle: "गैस लीक एवं सीमित स्थान SCBA प्रोटोकॉल",
    scbaEquipped: "SCBA एयर श्वास यंत्र (सीलबंद 300 बार)",
    mshaHelmetEquipped: "MSHA हेलमेट वाइज़र के साथ",
    safeHeadlampEquipped: "विस्फोट-रोधी हेडलैंप (Ex-Proof)",
    gasDetectorEquipped: "मल्टी-गैस सेंसर यूनिट (CH4/CO)",
    ppeSelectPrompt: "प्रवेश से पूर्व सभी 4 अनिवार्य सुरक्षा उपकरण चुनें",
    buddyChecklistTitle: "बडी-सिस्टम सुरक्षा चेकलिस्ट (बुधेश्वर मरांडी)",
    buddyCheckOk: "बडी सत्यापन ठीक • दबाव सील",
    ch4PpmMeter: "CH4 मीथेन: 2.4% (विस्फोट जोखिम)",
    coPpmMeter: "CO कार्बन मोनोऑक्साइड: 85 PPM (विषैला)",
    escapeArrowSign: "आपातकालीन निकासी मार्ग शाफ्ट B ➔",
    exhaustActivated: "एक्स्टॉस्ट फैन एवं लीक वाल्व सील किया गया",

    methaneTitle: "भूमिगत मीथेन (CH4) गैस एवं निकासी अभ्यास",
    methaneDesc: "झरिया गहरे कोयला खदान shaft #4 में मीथेन लीक का पता लगाएं और वेंटिलेशन मार्ग सत्यापित करें।",
    methaneWarning: "गंभीर: CH4 मीथेन स्तर 2.4 PPM! तत्काल वेंटिलेशन जांच आवश्यक है।",

    lotoTitle: "भारी मशीनरी लॉकआउट / टैगआउट (LOTO)",
    lotoDesc: "बोकारो स्टील कोल क्रशर कन्वेयर बेल्ट पर रखरखाव से पूर्व सुरक्षा पैडलॉक लगाएं।",
    lotoWarning: "चेतावनी: यांत्रिक पिंच बिंदु जोखिम! ब्रेकर पैनल आइसोलेशन टैग जांचें।",

    ppeTitle: "एआई पीपीई एवं श्वसन यंत्र अनुपालन स्कैनर",
    ppeDesc: "हेलमेट, डस्ट मास्क, सुरक्षा चश्मे और बूट्स का रियल-टाइम एआई कैमरा द्वारा सत्यापन।",
    ppeWarning: "ध्यान दें: सिलिका धूल क्षेत्र के लिए डस्ट मास्क गायब या अनुचित है।",

    slopeTitle: "ओपन-कास्ट ढलान स्थिरता एवं चट्टान गिरना AR मानचित्र",
    slopeDesc: "पश्चिम सिंहभूम लौह अयस्क खदान #2 में रॉकवॉल वेक्टर विस्थापन का निरीक्षण करें।",
    slopeWarning: "अलर्ट: ऊपरी बेंच ओवरहैंग दीवार पर सूक्ष्म दरार विस्तार पाया गया।",

    adminTitle: "झारखंड खदान निरीक्षक कमांड सेंटर",
    adminSub: "राज्यव्यापी व्यावसायिक सुरक्षा निगरानी, लाइव ऑडिट एवं एआई जोखिम विश्लेषण",
    totalMineSites: "सक्रिय निगरानी खदानें",
    overallCompliance: "राज्य अनुपालन स्कोर",
    activeWorkersCount: "भूमिगत प्रशिक्षु",
    highRiskHazards: "सक्रिय गंभीर चेतावनियां",
    dhanbadJhariaRegion: "धनबाद - झरिया कोयला क्षेत्र संचालन",
    workerRoster: "प्रमाणित खदान कर्मचारियों की सूची",
    searchWorker: "कर्मचारी नाम, खदान स्थल या आईडी द्वारा खोजें...",
    certificationStatus: "प्रमाणन स्थिति",
    incidentLogs: "लाइव नियर-मिस एवं उल्लंघन लॉग",
    aiRiskForecast: "एआई जोखिम पूर्वानुमान इंजन",
    syncDesk: "भूमिगत मेश सिंक हब",
    exportAuditReport: "राज्य ऑडिट रिपोर्ट निर्यात करें (PDF)",

    close: "बंद करें",
    confirm: "पुष्टि करें",
    syncNow: "स्थानीय डेटा तुरंत सिंक करें",
    statusVerified: "सत्यापित ऑफ़लाइन कैश",
    jharkhandStateTag: "खान एवं भूतत्व विभाग • झारखंड सरकार"
  },
  sat: {
    govtDept: "ᱡᱷᱟᱨᱠᱷᱸᱰ ᱥᱚᱨᱠᱟᱨ — ᱠᱷᱟᱫᱟᱱ ᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱵᱤᱵᱷᱟᱜᱽ",
    subTitleHeader: "ᱚᱛ ᱞᱟᱛᱟᱨ AR ᱨᱩᱠᱷᱤᱭᱟᱹ ᱪᱮᱫᱚᱜ ᱯᱳᱨᱴᱟᱞ (SIH26041)",
    offlineReadyBadge: "ᱛᱟᱦᱮᱸᱱ: ᱚᱯᱷᱞᱟᱭᱤᱱ ᱨᱮᱰᱤ",
    offlineSubText: "᱑᱔ Module Cached • ᱚᱛ ᱞᱟᱛᱟᱨ Mesh Active",
    roleTrainee: "ᱪᱮᱫᱚᱜᱤᱡ Mode (Mobile AR)",
    roleInspector: "ᱤᱱᱥᱯᱮᱠᱴᱚᱨ / ᱮᱰᱢᱤᱱ Dashboard",
    viewportMobile: "Rugged ᱢᱳᱵᱟᱭᱤᱞ View",
    viewportDesktop: "Desktop Command Center",
    languageName: "ᱥᱚᱱᱛᱟᱲᱤ (ᱚᱞ ᱪᱤᱠᱤ)",

    traineeHeaderTitle: "ᱚᱛ ᱞᱟᱛᱟᱨ WebAR ᱪᱮᱫᱚᱜ ᱥᱤᱢᱩᱞᱮᱴᱚᱨ",
    traineeHeaderSub: "ᱠᱷᱟᱫᱟᱱ ᱟᱨ ᱢᱟᱨᱟᱝ ᱠᱟᱹᱨᱜᱟᱹᱲ ᱞᱟᱹᱜᱤᱫ ᱚᱞ ᱪᱤᱠᱤ AR ᱨᱩᱠᱷᱤᱭᱟᱹ ᱠᱟᱹᱢᱤ",
    arCameraView: "AR Camera Live View finder",
    arSensorsActive: "LiDAR & Gas Sensors Calibrated",
    meshSignal: "Subterranean Mesh Node #JH-09",
    batteryTelemetry: "Battery 94% • Rugged IP68 Device",
    selectScenario: "ᱨᱩᱠᱷᱤᱭᱟᱹ ᱠᱟᱹᱢᱤ Scenario ᱪᱷᱟᱹ touch ᱢᱮ",
    startDrill: "AR Drill ᱮᱦᱚᱵᱽ ᱢᱮ",
    resetDrill: "Simulation ᱫᱩᱨᱩᱲ ᱢᱮ",
    stepProgress: "ᱠᱟᱹᱢᱤ List Progress",
    targetReticle: "ᱠᱮᱢᱨᱟ Machine ᱥᱮᱫ point ᱢᱮ",
    audioGuideActive: "ᱚᱞ ᱪᱤᱠᱤ ᱨᱚᱲ Voice Assistant Active",
    aiScannerRunning: "AI Safety Vision Engine Scan ᱮᱫᱟ...",
    hazardDetected: "ᱵᱚᱛᱚᱨ: ᱵᱚᱛᱚᱨᱟᱱ ᱡᱤᱱᱤᱥ ᱧᱟᱢ ᱮᱱᱟ!",
    complianceSuccess: "Drill complete: 100% ᱨᱩᱠᱷᱤᱭᱟᱹ Compliant",
    generateCertificate: "State Certificate Badge ᱧᱮᱞ ᱢᱮ",

    passDrillTitle: "CO2 Fire Extinguisher P-A-S-S ᱪᱮᱫᱚᱜ Drill",
    passStep1: "P — ᱨᱩᱠᱷᱤᱭᱟᱹ Pin ᱚᱨ ᱚᱰᱳᱠ ᱢᱮ (Safety ring)",
    passStep2: "A — ᱥᱮᱸᱜᱮᱞ ᱞᱟᱛᱟᱨ ᱥᱮᱫ Aim ᱢᱮ",
    passStep3: "S — Trigger ᱞᱤ align ᱢᱮ (Handle ᱞᱤᱱ ᱛᱟᱦᱮᱸᱱ ᱢᱮ)",
    passStep4: "S — ᱡᱚᱡᱚᱢ-ᱞᱮᱸᱜᱟ Sweep ᱢᱮ",
    pullPinBtn: "᱑. Safety Pin ᱚᱨ ᱚᱰᱳᱠ ᱢᱮ",
    aimNozzleBtn: "᱒. ᱥᱮᱸᱜᱮᱞ ᱞᱟᱛᱟᱨ ᱥᱮᱫ Aim ᱢᱮ",
    squeezeTriggerBtn: "᱓. Trigger ᱞᱤᱱ ᱛᱟᱦᱮᱸᱱ ᱢᱮ",
    sweepSideBtn: "᱔. Sweep ᱡᱚᱡᱚᱢ-ᱞᱮᱸᱜᱟ ᱢᱮ",
    tooCloseAlert: "⚠️ ᱵᱚᱛᱚᱨ: ᱟᱹᱰᱤ ᱥᱩᱨ! ᱒.᱐m ᱥᱟᱹᱜᱤᱧ ᱛᱟᱦᱮᱸᱱ ᱢᱮ",
    optimalDistanceAlert: "✅ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱹᱜᱤᱧ: ᱒.᱑m (LiDAR Locked)",
    flameExtinguished: "🔥 ᱥᱮᱸᱜᱮᱞ ᱵᱟᱸᱫᱚ ᱮᱱᱟ! PASS Drill Complete",

    gasDrillTitle: "Gas Leak & SCBA ᱨᱩᱠᱷᱤᱭᱟᱹ Protocol",
    scbaEquipped: "SCBA Air Respirator (300 Bar)",
    mshaHelmetEquipped: "MSHA Helmet Visor ᱥᱟᱶ",
    safeHeadlampEquipped: "Ex-Proof Headlamp",
    gasDetectorEquipped: "Multi-Gas Detector Unit",
    ppeSelectPrompt: "ᱵᱚᱞᱚᱱ ᱞᱟᱦᱟ ᱔ ᱜᱚᱴᱟᱝ Safety Gear ᱪᱷᱟ touch ᱢᱮ",
    buddyChecklistTitle: "Buddy-System Safety Protocol (ᱵᱩᱫᱷᱮᱥᱣᱚᱨ ᱢᱟᱨᱟᱱᱰᱤ)",
    buddyCheckOk: "Buddy Verification OK • Air Pressure Locked",
    ch4PpmMeter: "CH4 Methane: 2.4% (Explosion Warning)",
    coPpmMeter: "CO Carbon Monoxide: 85 PPM (Toxic)",
    escapeArrowSign: "EMERGENCY ESCAPE ROUTE SHAFT B ➔",
    exhaustActivated: "Exhaust Fan & Gas Valve Sealed",

    methaneTitle: "ᱚᱛ ᱞᱟᱛᱟᱨ Methane (CH4) ᱜᱮᱥ & ᱚᱰᱳᱠᱚᱜ Drill",
    methaneDesc: "ᱡᱷᱟᱨᱤᱭᱟ ᱜᱟᱹᱦᱤᱨ ᱠᱳᱭᱞᱟ ᱠᱷᱟᱫᱟᱱ Shaft #4 ᱨᱮ CH4 ᱜᱮᱥ ᱞᱤᱠ ᱧᱟᱢ ᱢᱮ ᱟᱨ air flow ᱧᱮᱞ ᱢᱮ।",
    methaneWarning: "CRITICAL: CH4 Methane Level 2.4 PPM! Immediate ventilation check ᱞᱟᱹᱠᱛᱤᱭᱟ।",

    lotoTitle: "Heavy Machinery Lockout / Tagout (LOTO)",
    lotoDesc: "ᱵᱳᱠᱟᱨᱳ Steel Coal Crusher Conveyor Belt ᱨᱮ safety padlock ᱞᱟᱜᱟᱣ ᱢᱮ।",
    lotoWarning: "WARNING: High mechanical pinch point hazard! Breaker isolation ᱧᱮᱞ ᱢᱮ।",

    ppeTitle: "AI PPE & Dust Mask compliance Scanner",
    ppeDesc: "Helmet, Dust Mask, Goggles ᱟᱨ Boots AI Camera ᱛᱮ Scan ᱢᱮ।",
    ppeWarning: "ATTENTION: Silicosis Dust zone ᱞᱟᱹᱜᱤᱫ Dust Mask ᱵᱟᱹᱱᱩᱜ-ᱟ।",

    slopeTitle: "Open-Cast Pit Wall Stability AR Map",
    slopeDesc: "West Singhbhum Iron Ore Pit #2 ᱨᱮ ᱫᱷᱤᱨᱤ ᱯᱟᱥᱱᱟᱣ ᱧᱮᱞ ᱢᱮ।",
    slopeWarning: "ALERT: Overhang rockwall ᱨᱮ hairline crack ᱧᱟᱢ ᱮᱱᱟ।",

    adminTitle: "ᱡᱷᱟᱨᱠᱷᱸᱰ ᱠᱷᱟᱫᱟᱱ Inspector Command Center",
    adminSub: "ᱯᱚᱱᱚᱛ ᱨᱮᱱᱟᱜ ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ Live Audit & AI Risk Analytics",
    totalMineSites: "Active Mines count",
    overallCompliance: "State Compliance Score",
    activeWorkersCount: "ᱚᱛ ᱞᱟᱛᱟᱨ Trainees",
    highRiskHazards: "Active Critical Warnings",
    dhanbadJhariaRegion: "Dhanbad - Jharia Coalfield operations",
    workerRoster: "Certified Worker List",
    searchWorker: "Worker ᱧᱩᱛᱩᱢ, Mine site ᱥᱮ ID ᱛᱮ scan/search ᱢᱮ...",
    certificationStatus: "Certification Status",
    incidentLogs: "Live Near-Miss & Violation Logs",
    aiRiskForecast: "AI Risk Prediction Engine",
    syncDesk: "Underground Mesh Sync Hub",
    exportAuditReport: "State Audit Report Export (PDF)",

    close: "ᱵᱚᱸᱫᱚ ᱢᱮ",
    confirm: "ᱥᱟᱹᱨᱤ ᱢᱮ",
    syncNow: "Local Data Sync ᱢᱮ",
    statusVerified: "Verified Offline Cache",
    jharkhandStateTag: "Department of Mines & Geology • State of Jharkhand"
  }
};
