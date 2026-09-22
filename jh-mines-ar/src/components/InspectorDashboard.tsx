import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { miningSitesData, workerCertRecordsData, incidentViolationLogsData } from '../data/mockData';
import {
  ShieldAlert,
  Users,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Search,
  FileText,
  Download,
  Activity,
  MapPin,
  RefreshCw,
  Database,
  Filter,
  Check,
  Zap,
  TrendingUp,
  BarChart3,
  Flame,
  Award,
  Clock,
  Layers
} from 'lucide-react';

interface InspectorDashboardProps {
  lang: Language;
  onOpenOfflineModal: () => void;
}

export const InspectorDashboard: React.FC<InspectorDashboardProps> = ({ lang, onOpenOfflineModal }) => {
  const t = translations[lang];

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);

  // Filtered workers list
  const filteredWorkers = workerCertRecordsData.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.mineSite.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict =
      selectedDistrict === 'All' ||
      (selectedDistrict === 'Dhanbad' && w.mineSite.includes('Jharia')) ||
      (selectedDistrict === 'Bokaro' && w.mineSite.includes('Bokaro')) ||
      (selectedDistrict === 'Singhbhum' && (w.mineSite.includes('Noamundi') || w.mineSite.includes('Ghatsila')));

    const matchesIndustry =
      selectedIndustry === 'All' ||
      (selectedIndustry === 'Coal Mines' && w.mineSite.includes('Coal')) ||
      (selectedIndustry === 'Steel Foundries' && w.mineSite.includes('Washery')) ||
      (selectedIndustry === 'Copper/Iron' && (w.mineSite.includes('Opencast') || w.mineSite.includes('Copper')));

    if (statusFilter === 'certified') return matchesSearch && matchesDistrict && matchesIndustry && w.certificationStatus === 'Certified Safety Expert';
    if (statusFilter === 'recert') return matchesSearch && matchesDistrict && matchesIndustry && w.certificationStatus === 'Recertification Due';
    if (statusFilter === 'training') return matchesSearch && matchesDistrict && matchesIndustry && w.certificationStatus === 'In Training';
    return matchesSearch && matchesDistrict && matchesIndustry;
  });

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("State Mines Directorate Audit Report CSV/PDF Exported (JH-MINES-INSPECTOR-REPORT-2026.pdf)");
    }, 1200);
  };

  const handleDownloadWorkerLog = (workerName: string) => {
    alert(`Downloading Individual Audit Log for ${workerName} (PDF/CSV Log Sealed)`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 select-none animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 mb-1">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span className="uppercase tracking-widest font-bold">Jharkhand State Mines & Safety Command Center</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">
            {t.adminTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-1">{t.adminSub}</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenOfflineModal}
            className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center space-x-2 transition"
          >
            <Database className="w-4 h-4 text-amber-400" />
            <span>{t.syncDesk}</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition disabled:opacity-50"
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
            <span>{isExporting ? 'Exporting...' : t.exportAuditReport}</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Active Recruits */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Active Recruits</p>
            <h3 className="text-2xl font-extrabold text-slate-100 mt-1">1,482 Trainees</h3>
            <span className="text-[11px] text-emerald-400 font-mono mt-0.5 block">Subterranean Shift Active</span>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Certified Under 30 Days */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Certified Under 30 Days</p>
            <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">92.4%</h3>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">Fast-Track DGMS Standard</span>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Critical Incident Simulation Pass Rate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Simulation Pass Rate</p>
            <h3 className="text-2xl font-extrabold text-cyan-300 mt-1">96.8%</h3>
            <span className="text-[11px] text-cyan-400 font-mono mt-0.5 block">P-A-S-S & SCBA Certified</span>
          </div>
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Offline Sync Queue */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Offline Sync Queue</p>
            <h3 className="text-2xl font-extrabold text-amber-400 mt-1">14 Mesh Logs</h3>
            <span className="text-[11px] text-emerald-400 font-mono mt-0.5 block">Zero Network Latency</span>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Database className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Mining Sector Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-2 text-xs text-amber-400 font-bold uppercase tracking-wider">
          <Filter className="w-4 h-4 text-amber-400" />
          <span>Mining Sector Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* District Filter */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-mono">District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-xl focus:outline-none focus:border-amber-500 font-semibold"
            >
              <option value="All">All Districts</option>
              <option value="Dhanbad">Dhanbad (Jharia Belt)</option>
              <option value="Bokaro">Bokaro (Steel Washery)</option>
              <option value="Singhbhum">Singhbhum (Iron & Copper)</option>
              <option value="Ranchi">Ranchi Mining Zone</option>
            </select>
          </div>

          {/* Industry Filter */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-mono">Industry:</span>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-xl focus:outline-none focus:border-amber-500 font-semibold"
            >
              <option value="All">All Industries</option>
              <option value="Coal Mines">Coal Mines (Underground)</option>
              <option value="Steel Foundries">Steel Foundries & Washeries</option>
              <option value="Copper/Iron">Iron Ore & Copper Mines</option>
              <option value="Mica Units">Mica Units</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trainee Roster Table Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              {t.workerRoster}
            </h3>
            <p className="text-xs text-slate-400">Searchable trainee roster with downloadable audit logs</p>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={t.searchWorker}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('certified')}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === 'certified' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Certified
              </button>
              <button
                onClick={() => setStatusFilter('recert')}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === 'recert' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Recert Due
              </button>
            </div>
          </div>
        </div>

        {/* Trainee Roster Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Trainee ID & Name</th>
                <th className="px-4 py-3">Assigned Mine Complex</th>
                <th className="px-4 py-3">Language Chosen</th>
                <th className="px-4 py-3">Safety Score</th>
                <th className="px-4 py-3">Module Completion</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Download Audit Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} className="hover:bg-slate-900/80 transition">
                  <td className="px-4 py-3 font-semibold text-slate-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {worker.name.charAt(0)}
                      </div>
                      <div>
                        <span className="block">{worker.name}</span>
                        <span className="text-[10px] font-mono text-amber-400">{worker.employeeId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{worker.mineSite}</td>
                  <td className="px-4 py-3 font-mono">
                    {worker.languagePref === 'sat' ? (
                      <span className="text-amber-400 font-bold">ᱥᱚᱱᱛᱟᱲᱤ (Ol Chiki)</span>
                    ) : worker.languagePref === 'hi' ? (
                      <span className="text-slate-300 font-bold">हिंदी</span>
                    ) : (
                      <span className="text-slate-400">English</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">{worker.overallScore}%</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{worker.completedModulesCount} / 14 Modules</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        worker.certificationStatus === 'Certified Safety Expert'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : worker.certificationStatus === 'Recertification Due'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      }`}
                    >
                      {worker.certificationStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDownloadWorkerLog(worker.name)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-400 font-mono text-[11px] rounded transition flex items-center gap-1.5 ml-auto"
                    >
                      <Download className="w-3 h-3 text-amber-400" />
                      <span>Audit Log</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AR Incident Risk Heatmap Analytics Chart Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div>
            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              AR Drill Incident Risk Heatmap & Failure Points
            </h3>
            <p className="text-xs text-slate-400">Assists safety officers in targeting specific vocational retraining modules</p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
            AI Retraining Recommendation Engine
          </span>
        </div>

        <div className="space-y-3.5 pt-2">
          {[
            {
              hazard: 'Extinguisher Nozzle Aim Proximity (Too Close to Flame)',
              failureRate: 62,
              recommendation: 'Mandatory Retraining: Retake WebGL P-A-S-S 2.0m Distance Calibration Drill',
              color: 'from-red-500 to-amber-500'
            },
            {
              hazard: 'SCBA Air Mask Pressure Seal Check Delay',
              failureRate: 28,
              recommendation: 'Targeted Drill: Confined Space Toxic Gas Module #2',
              color: 'from-amber-500 to-yellow-500'
            },
            {
              hazard: 'Conveyor Breaker Panel LOTO Tag Placement',
              failureRate: 18,
              recommendation: 'Refresher: Heavy Crusher Machinery Lockout Protocol',
              color: 'from-cyan-500 to-emerald-400'
            },
            {
              hazard: 'Underground Methane Leak Reticle Alignment',
              failureRate: 12,
              recommendation: 'Standard Compliance: Jharia Shaft Gas Sensor Inspection',
              color: 'from-emerald-500 to-emerald-400'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-200">{item.hazard}</span>
                <span className="font-mono font-extrabold text-red-400">{item.failureRate}% Failure Rate</span>
              </div>

              {/* Heatmap Bar */}
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${item.color} h-2.5 rounded-full transition-all duration-500`}
                  style={{ width: `${item.failureRate}%` }}
                />
              </div>

              <p className="text-[11px] text-amber-400/90 font-mono pt-0.5 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span>{item.recommendation}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
