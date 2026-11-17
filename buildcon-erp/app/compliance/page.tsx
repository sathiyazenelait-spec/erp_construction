"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Scale, AlertTriangle, CheckCircle, Clock, ShieldCheck,
  FileText, Plus, Search, Filter, ArrowLeft, RefreshCw,
  Building, Calendar, AlertOctagon, X, ExternalLink
} from "lucide-react";

interface ComplianceRecord {
  id?: number;
  licenseName: string;
  licenseNumber: string;
  category: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  renewalReminderDays: number;
  status: string; // ACTIVE, EXPIRING_SOON, EXPIRED, RENEWAL_SUBMITTED
  penaltyRiskClause: string;
  documentRef: string;
  assignedOfficer: string;
  organizationId?: number;
}

const DEFAULT_COMPLIANCE: ComplianceRecord[] = [
  {
    id: 1,
    licenseName: "Consent to Establish (CTE) & Operate (CTO)",
    licenseNumber: "TNPCB/CTO/IND-2024-8891",
    category: "ENVIRONMENTAL",
    issuingAuthority: "State Pollution Control Board",
    issueDate: "2024-12-01",
    expiryDate: "2026-12-05",
    renewalReminderDays: 30,
    status: "EXPIRING_SOON",
    penaltyRiskClause: "Stop work order & fine of $5,000/day under Water & Air Acts",
    documentRef: "DOC-LEGAL-ENV-01.pdf",
    assignedOfficer: "P. Sundaram (Legal Officer)"
  },
  {
    id: 2,
    licenseName: "Principal Employer Registration & Labour Licence",
    licenseNumber: "CLA/PE/CHN-2023-412",
    category: "LABOUR_SAFETY",
    issuingAuthority: "Department of Labour Welfare",
    issueDate: "2025-01-15",
    expiryDate: "2027-01-15",
    renewalReminderDays: 60,
    status: "ACTIVE",
    penaltyRiskClause: "Non-compliance halts inter-state migrant labor deployment",
    documentRef: "DOC-LEGAL-LABOUR-04.pdf",
    assignedOfficer: "V. Krishnan (HR Compliance)"
  },
  {
    id: 3,
    licenseName: "Provisional Fire NOC & Fire Fighting Scheme",
    licenseNumber: "DFRS/NOC/PROV-901",
    category: "FIRE_NOC",
    issuingAuthority: "Directorate of Fire & Rescue Services",
    issueDate: "2025-06-10",
    expiryDate: "2027-04-12",
    renewalReminderDays: 45,
    status: "ACTIVE",
    penaltyRiskClause: "High-rise tower height clearance suspension",
    documentRef: "DOC-LEGAL-FIRE-10.pdf",
    assignedOfficer: "R. Senthil Nathan (QA/QC Head)"
  },
  {
    id: 4,
    licenseName: "RERA Project Registration Certificate",
    licenseNumber: "RERA/PRJ/TN/2023/108",
    category: "RERA",
    issuingAuthority: "Real Estate Regulatory Authority",
    issueDate: "2024-05-20",
    expiryDate: "2027-08-30",
    renewalReminderDays: 90,
    status: "ACTIVE",
    penaltyRiskClause: "Prohibition of marketing, booking, and allotment",
    documentRef: "DOC-LEGAL-RERA-01.pdf",
    assignedOfficer: "Legal Directorate"
  },
  {
    id: 5,
    licenseName: "Municipal High-Rise Building Planning Permit",
    licenseNumber: "CMDA/PP/MSB/2023/044",
    category: "MUNICIPAL_PERMIT",
    issuingAuthority: "Metropolitan Development Authority",
    issueDate: "2024-02-14",
    expiryDate: "2026-11-01",
    renewalReminderDays: 60,
    status: "EXPIRED",
    penaltyRiskClause: "Occupancy certificate (OC) denial risk",
    documentRef: "DOC-LEGAL-CMDA-08.pdf",
    assignedOfficer: "Chief Liaison Officer"
  }
];

export default function CompliancePage() {
  const router = useRouter();
  const [records, setRecords] = useState<ComplianceRecord[]>(DEFAULT_COMPLIANCE);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [showModal, setShowModal] = useState(false);

  // New License Form State
  const [newLicense, setNewLicense] = useState({
    licenseName: "",
    licenseNumber: "",
    category: "MUNICIPAL_PERMIT",
    issuingAuthority: "",
    issueDate: "",
    expiryDate: "",
    renewalReminderDays: 30,
    penaltyRiskClause: "",
    assignedOfficer: ""
  });

  useEffect(() => {
    fetchCompliance();
  }, []);

  const fetchCompliance = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8081/api/compliance/org/1");
      if (res.ok) {
        const data = await res.json();
        if (data.records && Array.isArray(data.records)) {
          setRecords(data.records);
        }
      }
    } catch {
      // Fallback to default
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLicense.licenseName || !newLicense.expiryDate) {
      alert("Please provide at least a License Name and Expiry Date.");
      return;
    }

    const payload = {
      ...newLicense,
      status: "ACTIVE",
      documentRef: `DOC-LIC-${Date.now().toString().slice(-4)}.pdf`,
      organizationId: 1
    };

    try {
      const res = await fetch("http://localhost:8081/api/compliance/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const saved = await res.json();
        setRecords([saved, ...records]);
      } else {
        setRecords([payload as ComplianceRecord, ...records]);
      }
    } catch {
      setRecords([payload as ComplianceRecord, ...records]);
    }

    setShowModal(false);
    setNewLicense({
      licenseName: "",
      licenseNumber: "",
      category: "MUNICIPAL_PERMIT",
      issuingAuthority: "",
      issueDate: "",
      expiryDate: "",
      renewalReminderDays: 30,
      penaltyRiskClause: "",
      assignedOfficer: ""
    });
  };

  const handleUpdateStatus = async (id: number | undefined, nextStatus: string) => {
    if (!id) return;
    try {
      await fetch(`http://localhost:8081/api/compliance/records/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
    } catch {
      // ignore
    }
    setRecords(records.map(r => r.id === id ? { ...r, status: nextStatus } : r));
  };

  const filteredRecords = records.filter(r => {
    const matchesSearch =
      r.licenseName.toLowerCase().includes(search.toLowerCase()) ||
      r.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.issuingAuthority.toLowerCase().includes(search.toLowerCase()) ||
      r.assignedOfficer.toLowerCase().includes(search.toLowerCase());

    const matchesCat = selectedCategory === "ALL" || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const activeCount = records.filter(r => r.status === "ACTIVE").length;
  const expiringSoonCount = records.filter(r => r.status === "EXPIRING_SOON").length;
  const expiredCount = records.filter(r => r.status === "EXPIRED").length;
  const renewalSubmittedCount = records.filter(r => r.status === "RENEWAL_SUBMITTED").length;
  const complianceScore = Math.round(((activeCount + renewalSubmittedCount) / (records.length || 1)) * 100);

  return (
    <div className="min-h-screen bg-[#080E1A] text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0C1527] px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-wide">
                  Legal, Regulatory & Statutory Compliance Hub
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  STATUTORY REGISTRY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pollution Control, Labour Licences, Fire NOC, RERA & Municipal Permits
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCompliance}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            Register New License
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* KPI Scorecard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-[#0F192E] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Compliance Score</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{complianceScore}%</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F192E] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Licences</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">{activeCount}</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F192E] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Expiring Soon (30d)</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">{expiringSoonCount}</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F192E] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Expired / Action Due</div>
              <div className="text-2xl font-bold text-rose-400 mt-1">{expiredCount}</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertOctagon className="h-5 w-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F192E] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Renewal In Progress</div>
              <div className="text-2xl font-bold text-blue-400 mt-1">{renewalSubmittedCount}</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <RefreshCw className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 rounded-xl bg-[#0F192E] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search licenses by authority, permit number, or legal officer..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="ENVIRONMENTAL">Environmental (PCB)</option>
              <option value="LABOUR_SAFETY">Labour & Safety</option>
              <option value="FIRE_NOC">Fire Department</option>
              <option value="RERA">RERA Regulatory</option>
              <option value="MUNICIPAL_PERMIT">Municipal Planning</option>
            </select>
          </div>
        </div>

        {/* License Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecords.map((r, i) => (
            <div
              key={r.id || i}
              className={`p-5 rounded-xl border transition-all ${
                r.status === "EXPIRED"
                  ? "bg-rose-950/20 border-rose-800/60 shadow-lg shadow-rose-900/10"
                  : r.status === "EXPIRING_SOON"
                  ? "bg-amber-950/20 border-amber-800/60 shadow-lg shadow-amber-900/10"
                  : "bg-[#0F192E] border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {r.category}
                  </span>
                  <h3 className="font-semibold text-white mt-2 text-sm">{r.licenseName}</h3>
                  <div className="text-xs text-cyan-400 font-mono mt-0.5">{r.licenseNumber}</div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${
                    r.status === "ACTIVE"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : r.status === "EXPIRING_SOON"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse"
                      : r.status === "RENEWAL_SUBMITTED"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/30 font-extrabold"
                  }`}
                >
                  {r.status.replace("_", " ")}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Authority:</span>
                  <div className="text-slate-200 font-medium truncate">{r.issuingAuthority}</div>
                </div>
                <div>
                  <span className="text-slate-400">Expiry Date:</span>
                  <div className="text-white font-mono font-semibold flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" /> {r.expiryDate}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Assigned Officer:</span>
                  <div className="text-slate-200 truncate">{r.assignedOfficer}</div>
                </div>
                <div>
                  <span className="text-slate-400">Document Ref:</span>
                  <div className="text-cyan-400 font-mono flex items-center gap-1 truncate cursor-pointer hover:underline">
                    <FileText className="h-3 w-3" /> {r.documentRef}
                  </div>
                </div>
              </div>

              {/* Penalty Risk Notice */}
              <div className="mt-3 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-300">
                <span className="font-semibold text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Penalty & Non-Compliance Risk:
                </span>
                <p className="mt-0.5 text-slate-400">{r.penaltyRiskClause}</p>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-end gap-2">
                {r.status !== "RENEWAL_SUBMITTED" && (
                  <button
                    onClick={() => handleUpdateStatus(r.id, "RENEWAL_SUBMITTED")}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-medium transition-colors"
                  >
                    Submit Renewal Application
                  </button>
                )}
                {r.status === "RENEWAL_SUBMITTED" && (
                  <button
                    onClick={() => handleUpdateStatus(r.id, "ACTIVE")}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-colors"
                  >
                    Mark Renewed (Active)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* New License Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C1527] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
              <div className="h-8 w-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Scale className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-white">Register Statutory License</h2>
            </div>

            <form onSubmit={handleCreateLicense} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">License / Statutory Clearance Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ground Water Extraction Permit"
                  value={newLicense.licenseName}
                  onChange={(e) => setNewLicense({ ...newLicense, licenseName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Permit Number</label>
                  <input
                    type="text"
                    placeholder="e.g. GW/CHN/2026/09"
                    value={newLicense.licenseNumber}
                    onChange={(e) => setNewLicense({ ...newLicense, licenseNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select
                    value={newLicense.category}
                    onChange={(e) => setNewLicense({ ...newLicense, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="ENVIRONMENTAL">ENVIRONMENTAL</option>
                    <option value="LABOUR_SAFETY">LABOUR_SAFETY</option>
                    <option value="FIRE_NOC">FIRE_NOC</option>
                    <option value="RERA">RERA</option>
                    <option value="MUNICIPAL_PERMIT">MUNICIPAL_PERMIT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Issuing Authority</label>
                  <input
                    type="text"
                    placeholder="e.g. Central Ground Water Authority"
                    value={newLicense.issuingAuthority}
                    onChange={(e) => setNewLicense({ ...newLicense, issuingAuthority: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={newLicense.expiryDate}
                    onChange={(e) => setNewLicense({ ...newLicense, expiryDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Penalty / Stop-Work Risk Clause</label>
                <input
                  type="text"
                  placeholder="e.g. $10,000 fine & borehole sealing"
                  value={newLicense.penaltyRiskClause}
                  onChange={(e) => setNewLicense({ ...newLicense, penaltyRiskClause: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Assigned Legal / Compliance Officer</label>
                <input
                  type="text"
                  placeholder="e.g. Legal Counsel S. Raghavan"
                  value={newLicense.assignedOfficer}
                  onChange={(e) => setNewLicense({ ...newLicense, assignedOfficer: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Save Compliance Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
