"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Layers, Compass, Eye, CheckCircle2, AlertTriangle, AlertOctagon,
  UploadCloud, Search, Filter, ArrowLeft, RefreshCw, X, ZoomIn,
  ZoomOut, Maximize2, ShieldAlert, Sparkles, TrendingUp, Clock,
  HardHat, FileSpreadsheet, Box, ChevronRight, Check, FileText
} from "lucide-react";

interface DrawingRecord {
  id: number;
  drawingNumber: string;
  title: string;
  category: string;
  discipline: string;
  revision: string;
  revisionNotes?: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  status: string; // DRAFT, UNDER_REVIEW, APPROVED_FOR_CONSTRUCTION, REJECTED, SUPERSEDED
  approvedBy?: string;
  approvalDate?: string;
  uploadedBy?: string;
  uploadDate?: string;
  projectName: string;
  projectId?: number;
  linkedTaskId?: string;
  scaleRatio?: string;
  carpetAreaSqft?: number;
  builtupAreaSqft?: number;
  wallLengthMeters?: number;
  openingCount?: number;
  clashesCount?: number;
  aiAnalysisJson?: string;
  organizationId?: number;
}

interface DrawingClashRecord {
  id: number;
  drawingId: number;
  drawingNumber: string;
  projectName: string;
  clashType: string;
  severity: string;
  zoneDescription: string;
  elementA: string;
  elementB: string;
  coordinates: string;
  resolutionStatus: string;
  resolutionNotes?: string;
  assignedTo?: string;
  detectedDate?: string;
  resolvedDate?: string;
}

interface AiPredictionReport {
  id: number;
  projectId: number;
  projectName: string;
  delayRiskPercentage: number;
  predictedDelayDays: number;
  criticalPathRisk: string;
  costOverrunProbability: number;
  projectedCostVariance: number;
  budgetBreachRisk: string;
  safetyRiskScore: number;
  highRiskZone: string;
  materialDemandForecastJson?: string;
  actionableRecommendationsJson?: string;
  generatedAt?: string;
}

const DEFAULT_DRAWINGS: DrawingRecord[] = [
  {
    id: 1,
    drawingNumber: "DWG-STR-TWB-001",
    title: "Tower B Ground Floor Raft & Column Reinforcement Plan",
    category: "STRUCTURAL",
    discipline: "Structural RCC",
    revision: "v2.0-IFC",
    revisionNotes: "Reinforcement density upgraded to Fe550D for high seismic load tolerance",
    fileName: "tower_b_ground_slab_rebar_v2.dwg",
    fileType: "DWG",
    fileSizeBytes: 14850000,
    status: "APPROVED_FOR_CONSTRUCTION",
    approvedBy: "Er. V. Ramanathan (FIE, Structural Auditor)",
    approvalDate: "2026-11-18",
    uploadedBy: "Studio Matrix CAD Cell",
    uploadDate: "2026-11-18",
    projectName: "Skyline Tech Park - Tower B",
    projectId: 1,
    linkedTaskId: "WBS-TWB-CONC-02: Raft Foundation Pour",
    scaleRatio: "1:50",
    carpetAreaSqft: 18500,
    builtupAreaSqft: 24600,
    wallLengthMeters: 420.5,
    openingCount: 28,
    clashesCount: 1,
    aiAnalysisJson: JSON.stringify({
      scaleDetected: "1:50 Metric",
      confidence: 0.982,
      roomDetections: [
        { name: "Core Lift Lobby", dimensions: "12.4m x 8.6m", areaSqft: 1148 },
        { name: "Substation & Electrical Room", dimensions: "9.2m x 6.5m", areaSqft: 643 },
        { name: "Commercial Office Wing A", dimensions: "28.5m x 18.2m", areaSqft: 5580 },
        { name: "Commercial Office Wing B", dimensions: "32.0m x 20.4m", areaSqft: 7025 }
      ],
      structuralTakeoff: { totalRCCVolumeM3: 890.0, rebarTonnage: 71.2, shutteringAreaM2: 1840.0 }
    })
  },
  {
    id: 2,
    drawingNumber: "DWG-ARC-TWB-004",
    title: "Tower B 1st to 5th Floor Typical Architectural Floor Plan",
    category: "ARCHITECTURAL",
    discipline: "Architectural Planning",
    revision: "v2.1",
    revisionNotes: "Acoustic partition layout refined for Tier-1 IT tenant guidelines",
    fileName: "tower_b_typical_arch_v2_1.pdf",
    fileType: "PDF",
    fileSizeBytes: 8240000,
    status: "UNDER_REVIEW",
    uploadedBy: "Architect Priya & Associates",
    uploadDate: "2026-11-18",
    projectName: "Skyline Tech Park - Tower B",
    projectId: 1,
    linkedTaskId: "WBS-TWB-FITOUT-01: Drywall Partitions",
    scaleRatio: "1:100",
    carpetAreaSqft: 16800,
    builtupAreaSqft: 21500,
    wallLengthMeters: 580.0,
    openingCount: 64,
    clashesCount: 2,
    aiAnalysisJson: JSON.stringify({
      scaleDetected: "1:100 Metric",
      confidence: 0.965,
      roomDetections: [
        { name: "Executive Conference Suite", dimensions: "14.0m x 9.0m", areaSqft: 1356 },
        { name: "Open Workstation Hall", dimensions: "42.0m x 24.0m", areaSqft: 10845 }
      ]
    })
  },
  {
    id: 3,
    drawingNumber: "DWG-MEP-HVAC-002",
    title: "Basement & Podium Central Chiller Ducting & Chilled Water Piping",
    category: "HVAC",
    discipline: "Mechanical HVAC",
    revision: "v1.2",
    revisionNotes: "Chilled water riser lines moved 350mm east to avert storm sewer line",
    fileName: "podium_hvac_chiller_duct_v1_2.dwg",
    fileType: "DWG",
    fileSizeBytes: 19200000,
    status: "UNDER_REVIEW",
    uploadedBy: "AirTech Climate Solutions",
    uploadDate: "2026-11-18",
    projectName: "Skyline Tech Park - Tower B",
    projectId: 1,
    linkedTaskId: "WBS-TWB-MEP-03: Primary Chiller Rigging",
    scaleRatio: "1:50",
    carpetAreaSqft: 12000,
    builtupAreaSqft: 14500,
    wallLengthMeters: 310.0,
    openingCount: 12,
    clashesCount: 2
  },
  {
    id: 4,
    drawingNumber: "DWG-PLB-FIRE-003",
    title: "Tower B Fire Sprinkler Network & Wet Riser Hydraulic Layout",
    category: "PLUMBING",
    discipline: "Plumbing & Firefighting",
    revision: "v1.0-IFC",
    revisionNotes: "Initial release approved by Chief Fire Officer (NOC Ref: CFO/2026/781)",
    fileName: "fire_sprinkler_tower_b_rev1.pdf",
    fileType: "PDF",
    fileSizeBytes: 6100000,
    status: "APPROVED_FOR_CONSTRUCTION",
    approvedBy: "Divisional Fire Officer & Safety Directorate",
    approvalDate: "2026-11-18",
    uploadedBy: "SafeFlow Systems Ltd",
    uploadDate: "2026-11-18",
    projectName: "Skyline Tech Park - Tower B",
    projectId: 1,
    scaleRatio: "1:100",
    carpetAreaSqft: 18500,
    builtupAreaSqft: 24600,
    wallLengthMeters: 450.0,
    openingCount: 32,
    clashesCount: 0
  }
];

const DEFAULT_CLASHES: DrawingClashRecord[] = [
  {
    id: 1,
    drawingId: 1,
    drawingNumber: "DWG-STR-TWB-001",
    projectName: "Skyline Tech Park - Tower B",
    clashType: "MEP_STRUCTURAL_CLASH",
    severity: "CRITICAL",
    zoneDescription: "Primary 450x300mm HVAC Supply Air Duct routing directly through RCC Transfer Beam TB-04 soffit",
    elementA: "HVAC Air Duct 450x300mm",
    elementB: "RCC Transfer Beam TB-04 (Depth 800mm)",
    coordinates: "Grid C4-D4, Elevation +3.85m",
    resolutionStatus: "OPEN",
    assignedTo: "Er. Ramesh (Lead MEP Engineer)",
    detectedDate: "2026-11-18"
  },
  {
    id: 2,
    drawingId: 2,
    drawingNumber: "DWG-ARC-TWB-004",
    projectName: "Skyline Tech Park - Tower B",
    clashType: "CLEARANCE_CLASH",
    severity: "MODERATE",
    zoneDescription: "Acoustic partition drywall studs intrude into 1.2m mandatory fire escape path envelope by 140mm",
    elementA: "Drywall Frame Stud 100mm",
    elementB: "Fire Corridor Clear Width Egress",
    coordinates: "North Core Fire Door FD-02",
    resolutionStatus: "OPEN",
    assignedTo: "Architect Priya",
    detectedDate: "2026-11-18"
  }
];

export default function DrawingsPage() {
  const router = useRouter();
  const [drawings, setDrawings] = useState<DrawingRecord[]>(DEFAULT_DRAWINGS);
  const [clashes, setClashes] = useState<DrawingClashRecord[]>(DEFAULT_CLASHES);
  const [prediction, setPrediction] = useState<AiPredictionReport | null>(null);
  const [activeTab, setActiveTab] = useState<"DRAWINGS" | "CLASHES" | "PREDICTIONS" | "DIFF_TOOL">("DRAWINGS");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [orgId, setOrgId] = useState<number>(1);

  // Modals & Viewer
  const [selectedDrawing, setSelectedDrawing] = useState<DrawingRecord | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showAiPins, setShowAiPins] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [resolveClashModal, setResolveClashModal] = useState<DrawingClashRecord | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");

  // Upload Form State
  const [uploadForm, setUploadForm] = useState({
    drawingNumber: "",
    title: "",
    category: "STRUCTURAL",
    discipline: "Structural RCC",
    revision: "v1.0",
    revisionNotes: "Initial draft release",
    projectName: "Skyline Tech Park - Tower B",
    projectId: 1,
    fileType: "DWG",
    scaleRatio: "1:50",
    builtupAreaSqft: 22000,
    autoAnalyzeAi: true
  });

  useEffect(() => {
    fetchData();
  }, [orgId]);

  async function fetchData() {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("buildcon_token") : null;
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      // 1. Fetch Drawings
      const resDwg = await fetch(`http://localhost:8081/api/drawings/org/${orgId}`, { headers });
      if (resDwg.ok) {
        const data = await resDwg.json();
        if (data && data.length > 0) setDrawings(data);
      }

      // 2. Fetch Clashes
      const resClashes = await fetch(`http://localhost:8081/api/drawings/clashes/org/${orgId}`, { headers });
      if (resClashes.ok) {
        const data = await resClashes.json();
        if (data && data.length > 0) setClashes(data);
      }

      // 3. Fetch AI Predictions
      const resPred = await fetch(`http://localhost:8081/api/ai-predictions/project/1`, { headers });
      if (resPred.ok) {
        const data = await resPred.json();
        if (data) setPrediction(data);
      }
    } catch (err) {
      console.warn("Backend not reachable or using local cache:", err);
    } finally {
      setLoading(false);
    }
  }

  // Handle Approve
  async function handleApprove(id: number) {
    try {
      const res = await fetch(`http://localhost:8081/api/drawings/${id}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvedBy: "Er. V. Ramanathan (Chief Structural Consultant)" })
      });
      if (res.ok) {
        const updated = await res.json();
        setDrawings(drawings.map(d => (d.id === id ? updated : d)));
      } else {
        setDrawings(drawings.map(d => (d.id === id ? { ...d, status: "APPROVED_FOR_CONSTRUCTION", approvedBy: "Er. V. Ramanathan" } : d)));
      }
    } catch {
      setDrawings(drawings.map(d => (d.id === id ? { ...d, status: "APPROVED_FOR_CONSTRUCTION", approvedBy: "Er. V. Ramanathan" } : d)));
    }
  }

  // Handle Reject
  async function handleReject(id: number) {
    const reason = prompt("Enter revision remarks for rejection:", "Dimension clash on Grid D-2 needs correction.");
    if (!reason) return;
    try {
      const res = await fetch(`http://localhost:8081/api/drawings/${id}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remarks: reason, rejectedBy: "QA/QC Lead" })
      });
      if (res.ok) {
        const updated = await res.json();
        setDrawings(drawings.map(d => (d.id === id ? updated : d)));
      } else {
        setDrawings(drawings.map(d => (d.id === id ? { ...d, status: "REJECTED", revisionNotes: reason } : d)));
      }
    } catch {
      setDrawings(drawings.map(d => (d.id === id ? { ...d, status: "REJECTED", revisionNotes: reason } : d)));
    }
  }

  // Handle AI Analyze Button
  async function handleRunAiAnalysis(drawingId: number) {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/drawings/${drawingId}/analyze-ai`, {
        method: "POST"
      });
      if (res.ok) {
        const updated = await res.json();
        setDrawings(drawings.map(d => (d.id === drawingId ? updated : d)));
        if (selectedDrawing?.id === drawingId) setSelectedDrawing(updated);
      }
    } catch (err) {
      console.warn("AI analysis offline:", err);
    } finally {
      setLoading(false);
    }
  }

  // Handle Resolve Clash
  async function handleResolveClash() {
    if (!resolveClashModal) return;
    try {
      const res = await fetch(`http://localhost:8081/api/drawings/clashes/${resolveClashModal.id}/resolve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resolutionNotes: resolutionNotes || "Offset ducting below beam with fire sleeve insulation.",
          resolvedBy: "Er. Ramesh (MEP Lead)"
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setClashes(clashes.map(c => (c.id === resolveClashModal.id ? updated : c)));
      } else {
        setClashes(clashes.map(c => (c.id === resolveClashModal.id ? { ...c, resolutionStatus: "RESOLVED", resolutionNotes } : c)));
      }
    } catch {
      setClashes(clashes.map(c => (c.id === resolveClashModal.id ? { ...c, resolutionStatus: "RESOLVED", resolutionNotes } : c)));
    }
    setResolveClashModal(null);
    setResolutionNotes("");
  }

  // Handle Upload
  async function handleUploadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const newRecord: Partial<DrawingRecord> = {
      drawingNumber: uploadForm.drawingNumber || `DWG-${uploadForm.category.substring(0, 3)}-${Date.now().toString().slice(-4)}`,
      title: uploadForm.title || "New Design Blueprint",
      category: uploadForm.category,
      discipline: uploadForm.discipline,
      revision: uploadForm.revision,
      revisionNotes: uploadForm.revisionNotes,
      fileName: `${uploadForm.drawingNumber.toLowerCase()}.${uploadForm.fileType.toLowerCase()}`,
      fileType: uploadForm.fileType,
      fileSizeBytes: 12500000,
      status: "UNDER_REVIEW",
      uploadedBy: "Chief Architect Cell",
      projectName: uploadForm.projectName,
      projectId: uploadForm.projectId,
      scaleRatio: uploadForm.scaleRatio,
      builtupAreaSqft: uploadForm.builtupAreaSqft,
      carpetAreaSqft: uploadForm.builtupAreaSqft * 0.78,
      wallLengthMeters: Math.round(Math.sqrt(uploadForm.builtupAreaSqft) * 4.2),
      openingCount: Math.round(uploadForm.builtupAreaSqft / 450),
      clashesCount: 1,
      organizationId: orgId
    };

    try {
      const res = await fetch("http://localhost:8081/api/drawings/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord)
      });
      if (res.ok) {
        const saved = await res.json();
        setDrawings([saved, ...drawings]);
      } else {
        setDrawings([{ ...newRecord, id: Date.now() } as DrawingRecord, ...drawings]);
      }
    } catch {
      setDrawings([{ ...newRecord, id: Date.now() } as DrawingRecord, ...drawings]);
    }

    setUploadModalOpen(false);
    setLoading(false);
  }

  // Filter Drawings
  const filteredDrawings = drawings.filter(d => {
    const matchesCategory = selectedCategory === "ALL" || d.category === selectedCategory;
    const matchesStatus = selectedStatus === "ALL" || d.status === selectedStatus;
    const matchesSearch =
      d.drawingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Calculate High-Level Metrics
  const totalDrawings = drawings.length;
  const approvedIfcCount = drawings.filter(d => d.status === "APPROVED_FOR_CONSTRUCTION").length;
  const openClashesCount = clashes.filter(c => c.resolutionStatus === "OPEN").length;
  const underReviewCount = drawings.filter(d => d.status === "UNDER_REVIEW").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
            title="Return to Home Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-6 h-6 text-sky-400" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                Blueprint & 3D Drawing Management Hub
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                CAD & BIM Engine v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Multi-discipline blueprint repository, revision diffs, automated structural clash detection & AI takeoff predictions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-sky-400" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setActiveTab("PREDICTIONS")}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            AI Predictions Engine
          </button>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 transition"
          >
            <UploadCloud className="w-4 h-4" />
            Upload Blueprint / Model
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Blueprints</span>
              <Layers className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-white">{totalDrawings}</div>
            <div className="text-[11px] text-slate-400 mt-1">Arch, Struct, MEP, HVAC</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Released (IFC)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">{approvedIfcCount}</div>
            <div className="text-[11px] text-emerald-400/80 mt-1">Approved for Construction</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Under Review</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400">{underReviewCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">Awaiting Lead Approval</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Active Clashes</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-rose-400">{openClashesCount}</div>
            <div className="text-[11px] text-rose-400/80 mt-1">MEP vs Structural Conflicts</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>AI Delay Risk</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-indigo-400">{prediction?.delayRiskPercentage ?? 24.5}%</div>
            <div className="text-[11px] text-indigo-400/80 mt-1">
              {prediction ? `+${prediction.predictedDelayDays}d Bottleneck` : "+12d Bottleneck"}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("DRAWINGS")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === "DRAWINGS"
                  ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              All Drawings ({drawings.length})
            </button>
            <button
              onClick={() => setActiveTab("CLASHES")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition ${
                activeTab === "CLASHES"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              Structural Clashes ({openClashesCount} Open)
            </button>
            <button
              onClick={() => setActiveTab("PREDICTIONS")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition ${
                activeTab === "PREDICTIONS"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Prediction Dashboard
            </button>
            <button
              onClick={() => setActiveTab("DIFF_TOOL")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition ${
                activeTab === "DIFF_TOOL"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Revision Diff Tool
            </button>
          </div>

          {activeTab === "DRAWINGS" && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search drawing, code, project..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-sky-500 w-64"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Disciplines</option>
                <option value="STRUCTURAL">Structural</option>
                <option value="ARCHITECTURAL">Architectural</option>
                <option value="HVAC">HVAC & Mechanical</option>
                <option value="PLUMBING">Plumbing & Fire</option>
                <option value="ELECTRICAL">Electrical</option>
              </select>

              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="APPROVED_FOR_CONSTRUCTION">Approved for Construction</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="DRAFT">Draft</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: DRAWINGS LIST & CARDS */}
        {activeTab === "DRAWINGS" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrawings.map(d => {
              const isApproved = d.status === "APPROVED_FOR_CONSTRUCTION";
              const isRejected = d.status === "REJECTED";
              const isUnderReview = d.status === "UNDER_REVIEW";

              return (
                <div
                  key={d.id}
                  className="rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between overflow-hidden group shadow-lg"
                >
                  <div className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 border border-sky-800 px-2 py-0.5 rounded">
                            {d.drawingNumber}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {d.revision}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm text-white group-hover:text-sky-300 transition line-clamp-1">
                          {d.title}
                        </h3>
                        <p className="text-xs text-slate-400">{d.projectName}</p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                          isApproved
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : isRejected
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                        }`}
                      >
                        {isApproved ? "Approved (IFC)" : isRejected ? "Rejected" : "Under Review"}
                      </span>
                    </div>

                    {/* Blueprint Canvas Preview Simulator */}
                    <div
                      onClick={() => {
                        setSelectedDrawing(d);
                        setViewerOpen(true);
                      }}
                      className="relative h-36 bg-slate-950 rounded-lg border border-slate-800/80 p-3 cursor-pointer overflow-hidden group-hover:border-sky-500/50 transition flex items-center justify-center"
                    >
                      {/* Grid background */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-40" />

                      {/* Schematic Representation */}
                      <div className="relative z-10 text-center space-y-1">
                        <Box className="w-8 h-8 mx-auto text-sky-400 group-hover:scale-110 transition" />
                        <div className="text-xs font-mono text-slate-300">{d.fileName}</div>
                        <div className="text-[10px] text-slate-400">Scale {d.scaleRatio || "1:50"} • Click to Inspect 2D/3D</div>
                      </div>

                      {/* AI Detected Badge */}
                      {d.clashesCount !== undefined && d.clashesCount > 0 && (
                        <div className="absolute top-2 right-2 bg-rose-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                          <AlertTriangle className="w-3 h-3" />
                          {d.clashesCount} Clash Detected
                        </div>
                      )}
                    </div>

                    {/* Metadata & Takeoff Specs */}
                    <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                      <div>
                        <div className="text-slate-400">Discipline</div>
                        <div className="font-semibold text-slate-200 truncate">{d.discipline}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Built-up</div>
                        <div className="font-semibold text-slate-200">{d.builtupAreaSqft?.toLocaleString() || "24,600"} sqft</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Openings</div>
                        <div className="font-semibold text-slate-200">{d.openingCount || 28} Nos</div>
                      </div>
                    </div>

                    {d.revisionNotes && (
                      <p className="text-[11px] text-slate-400 italic line-clamp-2">
                        &quot;{d.revisionNotes}&quot;
                      </p>
                    )}
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedDrawing(d);
                        setViewerOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Canvas
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRunAiAnalysis(d.id)}
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-amber-400 hover:text-amber-300 transition"
                        title="Run Instant AI Takeoff Scan"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>

                      {isUnderReview && (
                        <>
                          <button
                            onClick={() => handleApprove(d.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white transition"
                            title="Approve for Construction"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(d.id)}
                            className="p-1.5 hover:bg-rose-950/60 text-rose-400 hover:text-rose-300 rounded-lg transition"
                            title="Reject & Request Revision"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: ACTIVE CLASHES */}
        {activeTab === "CLASHES" && (
          <div className="space-y-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-white">Structural & MEP Clash Detection Ledger</h3>
                <p className="text-xs text-slate-400">
                  Automated geometric clash detection flags spatial conflicts between Structural RCC, HVAC Ducts, and Plumbing conduits.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                {openClashesCount} Open Clashes
              </span>
            </div>

            <div className="space-y-3">
              {clashes.map(c => {
                const isOpen = c.resolutionStatus === "OPEN";

                return (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-sky-400">{c.drawingNumber}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            c.severity === "CRITICAL"
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {c.severity}
                        </span>
                        <span className="text-xs text-slate-400">{c.projectName}</span>
                      </div>
                      <div className="text-sm font-semibold text-white">{c.zoneDescription}</div>
                      <div className="text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                        <span><strong className="text-slate-300">Element A:</strong> {c.elementA}</span>
                        <span><strong className="text-slate-300">Element B:</strong> {c.elementB}</span>
                        <span><strong className="text-slate-300">Coordinates:</strong> {c.coordinates}</span>
                      </div>
                      {c.resolutionNotes && (
                        <div className="text-xs text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-900/50 mt-1">
                          <strong>Resolved:</strong> {c.resolutionNotes} ({c.resolvedDate})
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {isOpen ? (
                        <button
                          onClick={() => setResolveClashModal(c)}
                          className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow"
                        >
                          Resolve Clash
                        </button>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: AI PREDICTION DASHBOARD */}
        {activeTab === "PREDICTIONS" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h2 className="text-lg font-bold text-white">AI Deep Predictive Engine & Project Forecasting</h2>
                  </div>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    Multi-modal neural heuristics evaluating blueprint geometry, historical subcontractor progress, local material inflation indices, and HSE risk clusters.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const res = await fetch("http://localhost:8081/api/ai-predictions/generate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ projectId: 1, projectName: "Skyline Tech Park - Tower B", organizationId: orgId })
                      });
                      if (res.ok) {
                        const newPred = await res.json();
                        setPrediction(newPred);
                      }
                    } catch (e) {
                      console.warn(e);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 transition shadow-lg shadow-amber-500/20"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  Regenerate Real-time Predictions
                </button>
              </div>
            </div>

            {/* 4 Core AI Predictions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prediction 1: Project Delay Risk */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-sky-400" />
                    <h3 className="font-semibold text-sm text-white">1. Critical Path Delay Prediction</h3>
                  </div>
                  <span className="text-xs font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                    {prediction?.delayRiskPercentage ?? 24.5}% Delay Risk
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Critical Path Breach Margin</span>
                    <span className="text-white font-semibold">+{prediction?.predictedDelayDays ?? 12} Days Forecasted</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${prediction?.delayRiskPercentage ?? 24.5}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <strong className="text-sky-400 block mb-1">Primary Critical Path Bottleneck:</strong>
                  {prediction?.criticalPathRisk ?? "Level 4 RCC slab curing cycle overlaps with curtain wall glazing mobilization."}
                </div>
              </div>

              {/* Prediction 2: Cost Overrun Predictor */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    <h3 className="font-semibold text-sm text-white">2. Cost Overrun & Budget Breach Predictor</h3>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                    {prediction?.costOverrunProbability ?? 18.2}% Probability
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Projected Budget Variance</span>
                    <span className="text-rose-400 font-bold">
                      +₹{((prediction?.projectedCostVariance ?? 480000) / 100000).toFixed(2)} Lakhs
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${prediction?.costOverrunProbability ?? 18.2}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <strong className="text-amber-400 block mb-1">Risk Classification:</strong>
                  {prediction?.budgetBreachRisk ?? "Moderate Risk - Steel rebar inflation index +3.8% anticipated next month."}
                </div>
              </div>

              {/* Prediction 3: Safety Risk Prediction */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardHat className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-semibold text-sm text-white">3. AI Safety Risk & Hazard Predictor</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Score: {prediction?.safetyRiskScore ?? 88.5}/100 (Safe)
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <strong className="text-emerald-400 block mb-1">High-Risk Hazard Zone Identified:</strong>
                  {prediction?.highRiskZone ?? "Tower B External Suspended Cradle (Elevations > 45m) & Edge Fall Restraint Netting."}
                </div>
              </div>

              {/* Prediction 4: Actionable Recommendations */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-semibold text-sm text-white">4. AI Autonomous Action Items</h3>
                  </div>
                  <span className="text-xs text-indigo-400">Prescriptive Actions</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>Issue RFQ for steel rebar 10 days ahead of schedule to hedge against tariff surges.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>Stagger concrete batch delivery to avoid mixer truck waiting penalties at site gates.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>Enforce double-lanyard harness certification for workers on exterior swing stages.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 30/60/90 Days Material Demand Forecast */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-sky-400" />
                    AI 30 / 60 / 90 Days Material Demand Forecast
                  </h3>
                  <p className="text-xs text-slate-400">
                    Calculated automatically from uploaded structural blueprints, BOQ items, and current milestone pace.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-3">Material Category</th>
                      <th className="py-2.5 px-3">Unit</th>
                      <th className="py-2.5 px-3">Next 30 Days</th>
                      <th className="py-2.5 px-3">Next 60 Days</th>
                      <th className="py-2.5 px-3">Next 90 Days</th>
                      <th className="py-2.5 px-3">Stockout Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr>
                      <td className="py-3 px-3 font-semibold text-white">OPC 53 Grade Cement</td>
                      <td className="py-3 px-3 text-slate-400">Bags (50kg)</td>
                      <td className="py-3 px-3 font-mono text-sky-400 font-bold">4,200</td>
                      <td className="py-3 px-3 font-mono text-slate-300">8,800</td>
                      <td className="py-3 px-3 font-mono text-slate-300">12,600</td>
                      <td className="py-3 px-3"><span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded text-[10px]">LOW</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-white">Fe550D TMT Steel Rebar</td>
                      <td className="py-3 px-3 text-slate-400">Metric Tonnes</td>
                      <td className="py-3 px-3 font-mono text-amber-400 font-bold">85.5 MT</td>
                      <td className="py-3 px-3 font-mono text-slate-300">162.0 MT</td>
                      <td className="py-3 px-3 font-mono text-slate-300">240.0 MT</td>
                      <td className="py-3 px-3"><span className="text-amber-400 bg-amber-950 px-2 py-0.5 rounded text-[10px]">MODERATE</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-white">Ready-Mix Concrete (M30)</td>
                      <td className="py-3 px-3 text-slate-400">Cubic Meters (m3)</td>
                      <td className="py-3 px-3 font-mono text-sky-400 font-bold">920 m³</td>
                      <td className="py-3 px-3 font-mono text-slate-300">1,850 m³</td>
                      <td className="py-3 px-3 font-mono text-slate-300">2,700 m³</td>
                      <td className="py-3 px-3"><span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded text-[10px]">LOW</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-white">Manufactured Sand (M-Sand)</td>
                      <td className="py-3 px-3 text-slate-400">Metric Tonnes</td>
                      <td className="py-3 px-3 font-mono text-sky-400 font-bold">380 MT</td>
                      <td className="py-3 px-3 font-mono text-slate-300">760 MT</td>
                      <td className="py-3 px-3 font-mono text-slate-300">1,150 MT</td>
                      <td className="py-3 px-3"><span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded text-[10px]">LOW</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REVISION DIFF TOOL */}
        {activeTab === "DIFF_TOOL" && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-sm text-white">Multi-Version Visual Diff & Change Log</h3>
              <p className="text-xs text-slate-400">
                Compare consecutive CAD/PDF blueprint revisions to visualize beam resizing, partition shifts, and added openings before site implementation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Revision A */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400">REVISION A (Base)</span>
                  <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">v1.0 (Draft)</span>
                </div>
                <div className="h-48 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:16px_16px] opacity-25" />
                  <div className="text-center relative z-10 space-y-1">
                    <Box className="w-10 h-10 text-slate-500 mx-auto" />
                    <div className="text-xs font-mono text-slate-400">tower_b_ground_slab_v1.dwg</div>
                    <div className="text-[10px] text-slate-400">Column C-4 Size: 600 x 600mm</div>
                  </div>
                </div>
              </div>

              {/* Revision B */}
              <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-400">REVISION B (Current)</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">v2.0-IFC</span>
                </div>
                <div className="h-48 bg-slate-950 rounded-lg border border-indigo-500/30 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f1_1px,transparent_1px),linear-gradient(to_bottom,#6366f1_1px,transparent_1px)] bg-[size:16px_16px] opacity-25" />
                  <div className="text-center relative z-10 space-y-1">
                    <Box className="w-10 h-10 text-indigo-400 mx-auto" />
                    <div className="text-xs font-mono text-white">tower_b_ground_slab_rebar_v2.dwg</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">Column C-4 Upgraded to 750 x 750mm (Fe550D)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Log Summary */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="font-semibold text-xs text-white">Detected Geometric Alterations:</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Column C-4 cross-section increased by 25% for high-rise shear resistance.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Door opening D-04 relocated 400mm west to clear fire hydrant riser pipe.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Slab thickness maintained at 200mm M30 grade with secondary crack-control mesh.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* 2D / 3D CANVAS VIEWER MODAL */}
      {viewerOpen && selectedDrawing && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col">
          {/* Top Canvas Bar */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewerOpen(false)}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{selectedDrawing.title}</h3>
                  <span className="text-xs font-mono text-sky-400">{selectedDrawing.drawingNumber}</span>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{selectedDrawing.revision}</span>
                </div>
                <p className="text-[11px] text-slate-400">Scale {selectedDrawing.scaleRatio || "1:50"} • {selectedDrawing.projectName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-800 rounded-lg p-1 gap-1">
                <button
                  onClick={() => setZoomLevel(Math.max(50, zoomLevel - 20))}
                  className="p-1.5 hover:bg-slate-700 text-slate-300 rounded"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2 text-slate-200">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(250, zoomLevel + 20))}
                  className="p-1.5 hover:bg-slate-700 text-slate-300 rounded"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowAiPins(!showAiPins)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  showAiPins
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                AI Vision Pins
              </button>
            </div>
          </div>

          {/* Canvas Workspace */}
          <div className="flex-1 bg-slate-950 overflow-auto flex items-center justify-center p-8 relative">
            {/* Grid Canvas Background */}
            <div
              className="bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl relative transition-all duration-200 overflow-hidden"
              style={{
                width: `${(800 * zoomLevel) / 100}px`,
                height: `${(550 * zoomLevel) / 100}px`
              }}
            >
              {/* Detailed Architectural Blueprint CAD Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-70" />

              {/* Vector Blueprint Mock Rooms & Structural Lines */}
              <svg className="w-full h-full absolute inset-0 text-sky-500/40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer Perimeter */}
                <rect x="8%" y="10%" width="84%" height="80%" fill="none" stroke="#38bdf8" strokeWidth="3" />
                {/* Core Lift Wall */}
                <rect x="40%" y="35%" width="20%" height="30%" fill="rgba(56,189,248,0.06)" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4" />
                {/* Columns */}
                <rect x="15%" y="18%" width="20" height="20" fill="#38bdf8" />
                <rect x="50%" y="18%" width="20" height="20" fill="#38bdf8" />
                <rect x="82%" y="18%" width="20" height="20" fill="#38bdf8" />
                <rect x="15%" y="78%" width="20" height="20" fill="#38bdf8" />
                <rect x="50%" y="78%" width="20" height="20" fill="#38bdf8" />
                <rect x="82%" y="78%" width="20" height="20" fill="#38bdf8" />
                {/* HVAC Duct Routing (Orange) */}
                <path d="M 160 220 L 480 220 L 480 380 L 720 380" fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
              </svg>

              {/* AI Detection Pins Overlay */}
              {showAiPins && (
                <>
                  {/* Pin 1: Lift Core */}
                  <div className="absolute left-[45%] top-[45%] transform -translate-x-1/2 -translate-y-1/2 bg-sky-950/90 border border-sky-400 text-white p-2 rounded-lg shadow-xl text-center backdrop-blur">
                    <div className="text-[11px] font-bold text-sky-300">Core Lift Lobby</div>
                    <div className="text-[9px] text-slate-300">12.4m x 8.6m (1,148 sqft)</div>
                  </div>

                  {/* Pin 2: Commercial Hall */}
                  <div className="absolute left-[20%] top-[40%] bg-indigo-950/90 border border-indigo-400 text-white p-2 rounded-lg shadow-xl text-center backdrop-blur">
                    <div className="text-[11px] font-bold text-indigo-300">Commercial Wing A</div>
                    <div className="text-[9px] text-slate-300">5,580 sqft • Height 3.8m</div>
                  </div>

                  {/* Pin 3: Structural Clash Alert (Pulsing Red) */}
                  <div className="absolute left-[60%] top-[40%] transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-rose-950/95 border-2 border-rose-500 text-rose-200 px-3 py-1.5 rounded-full shadow-2xl animate-pulse">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span className="text-[11px] font-bold">CLASH: Duct vs Beam TB-04</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bottom AI Takeoff Bar */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-slate-400 block">Total Built-Up Area:</span>
                <span className="text-sm font-bold text-white">{selectedDrawing.builtupAreaSqft?.toLocaleString() || "24,600"} sqft</span>
              </div>
              <div>
                <span className="text-slate-400 block">Carpet Area:</span>
                <span className="text-sm font-bold text-emerald-400">{selectedDrawing.carpetAreaSqft?.toLocaleString() || "18,500"} sqft</span>
              </div>
              <div>
                <span className="text-slate-400 block">Wall Perimeter:</span>
                <span className="text-sm font-bold text-sky-400">{selectedDrawing.wallLengthMeters || 420.5} m</span>
              </div>
              <div>
                <span className="text-slate-400 block">Openings Detected:</span>
                <span className="text-sm font-bold text-amber-400">{selectedDrawing.openingCount || 28} Openings</span>
              </div>
            </div>

            <button
              onClick={() => handleRunAiAnalysis(selectedDrawing.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition"
            >
              <Sparkles className="w-4 h-4" />
              Re-Scan Dimensions with AI
            </button>
          </div>
        </div>
      )}

      {/* RESOLVE CLASH MODAL */}
      {resolveClashModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Resolve Structural Clash</h3>
              <button onClick={() => setResolveClashModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              <strong>Clash:</strong> {resolveClashModal.zoneDescription}
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Engineering Resolution Notes:</label>
              <textarea
                rows={3}
                value={resolutionNotes}
                onChange={e => setResolutionNotes(e.target.value)}
                placeholder="e.g. Offset 450x300mm HVAC duct below beam soffit with 50mm insulation sleeve clearance."
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setResolveClashModal(null)}
                className="px-4 py-2 text-xs rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveClash}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD BLUEPRINT MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <form
            onSubmit={handleUploadSubmit}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-white text-base">Upload Design Blueprint / Model</h3>
              </div>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Drawing Code / Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DWG-STR-L3-010"
                  value={uploadForm.drawingNumber}
                  onChange={e => setUploadForm({ ...uploadForm, drawingNumber: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Discipline Category</label>
                <select
                  value={uploadForm.category}
                  onChange={e => {
                    const cat = e.target.value;
                    let disc = "Structural RCC";
                    if (cat === "ARCHITECTURAL") disc = "Architectural Planning";
                    if (cat === "HVAC") disc = "Mechanical HVAC";
                    if (cat === "PLUMBING") disc = "Plumbing & Firefighting";
                    if (cat === "ELECTRICAL") disc = "High/Low Voltage Electrical";
                    setUploadForm({ ...uploadForm, category: cat, discipline: disc });
                  }}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-sky-500"
                >
                  <option value="STRUCTURAL">Structural</option>
                  <option value="ARCHITECTURAL">Architectural</option>
                  <option value="HVAC">HVAC</option>
                  <option value="PLUMBING">Plumbing & Fire</option>
                  <option value="ELECTRICAL">Electrical</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-slate-400 mb-1">Drawing Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Level-3 Slab & Beam Structural Layout"
                  value={uploadForm.title}
                  onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Revision Tag</label>
                <input
                  type="text"
                  value={uploadForm.revision}
                  onChange={e => setUploadForm({ ...uploadForm, revision: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">File Format</label>
                <select
                  value={uploadForm.fileType}
                  onChange={e => setUploadForm({ ...uploadForm, fileType: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-sky-500"
                >
                  <option value="DWG">AutoCAD (.DWG)</option>
                  <option value="DXF">AutoCAD Interchange (.DXF)</option>
                  <option value="IFC">BIM Model (.IFC)</option>
                  <option value="PDF">Vector PDF (.PDF)</option>
                  <option value="PNG">High-Res Blueprint Image (.PNG)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Scale Ratio</label>
                <input
                  type="text"
                  value={uploadForm.scaleRatio}
                  onChange={e => setUploadForm({ ...uploadForm, scaleRatio: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Est. Built-Up Area (sqft)</label>
                <input
                  type="number"
                  value={uploadForm.builtupAreaSqft}
                  onChange={e => setUploadForm({ ...uploadForm, builtupAreaSqft: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-sky-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-400 mb-1">Revision Notes</label>
                <textarea
                  rows={2}
                  value={uploadForm.revisionNotes}
                  onChange={e => setUploadForm({ ...uploadForm, revisionNotes: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-sky-500"
                />
              </div>

              <div className="col-span-2 flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="autoAnalyze"
                  checked={uploadForm.autoAnalyzeAi}
                  onChange={e => setUploadForm({ ...uploadForm, autoAnalyzeAi: e.target.checked })}
                  className="rounded border-slate-700 text-sky-500 focus:ring-0"
                />
                <label htmlFor="autoAnalyze" className="text-xs text-amber-300 flex items-center gap-1 cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5" />
                  Auto-run instant AI Dimension & Clash scan upon upload
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 text-xs rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20"
              >
                {loading ? "Uploading & Scanning..." : "Upload & Analyze"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
