"use client";
import React, { useState, useEffect } from "react";
import {
  Star, Smile, Heart, Award, ArrowUpRight, MessageSquare,
  Search, Filter, Building2, Calendar, CheckCircle2, Clock,
  AlertTriangle, DollarSign, FileText, ChevronRight, X,
  ShieldCheck, Layers, Activity, Users, HardHat
} from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface SiteMilestone {
  name: string;
  progress: number;
  status: string;
  verifiedBy: string;
}

interface ClientHistoryItem {
  date: string;
  title: string;
  details: string;
}

interface ClientDirectoryRecord {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  clientType: string;
  onboardingDate: string;
  contractValueINR: string;
  receivedValueINR: string;
  outstandingValueINR: string;
  status: string;
  overallRating: number;
  npsCategory: string;
  review: string;
  reviewDate: string;
  ratingBreakdown: {
    workmanship: number;
    speed: number;
    transparency: number;
    safety: number;
  };
  projectProgress: {
    projectName: string;
    location: string;
    builtupSqft: string;
    plannedProgress: number;
    actualProgress: number;
    delayStatus: string;
    delayDays: number;
    targetHandover: string;
    projectedCompletion: string;
    milestones: SiteMilestone[];
  };
  historyTimeline: ClientHistoryItem[];
}

const FALLBACK_CLIENTS: ClientDirectoryRecord[] = [
  {
    id: 1,
    name: "ABC Developers Pvt Ltd",
    contactPerson: "Suresh Menon (VP Infrastructure)",
    email: "suresh.menon@abcdev.com",
    phone: "+91 98401 23456",
    clientType: "Commercial Real Estate Developer",
    onboardingDate: "15 Jan 2024",
    contractValueINR: "₹ 78.50 Cr",
    receivedValueINR: "₹ 62.80 Cr",
    outstandingValueINR: "₹ 15.70 Cr",
    status: "Active",
    overallRating: 4.9,
    npsCategory: "Promoter (Score: +88)",
    review: "Exceptional structural engineering and rigorous on-site QA/QC execution. Milestone billings and transparent digital twin updates have given our board complete confidence. Ready to award Phase 3.",
    reviewDate: "12 Oct 2026",
    ratingBreakdown: { workmanship: 5.0, speed: 4.8, transparency: 5.0, safety: 4.9 },
    projectProgress: {
      projectName: "Skyline Tech Park - Tower B & Commercial Wing",
      location: "Chennai ECR Road IT Corridor",
      builtupSqft: "215,000 sq.ft",
      plannedProgress: 90,
      actualProgress: 88,
      delayStatus: "On Track (Minor 2-day monsoon buffer absorbed)",
      delayDays: 0,
      targetHandover: "31 Dec 2026",
      projectedCompletion: "28 Dec 2026",
      milestones: [
        { name: "M1: Deep Foundation & Raft Slab", progress: 100, status: "Completed", verifiedBy: "Chief QA/QC" },
        { name: "M2: 7-Story RCC Moment Frame Columns", progress: 100, status: "Completed", verifiedBy: "Senior Site Engineer" },
        { name: "M3: Double-Glazed Blue Curtain Wall Facade", progress: 92, status: "Active Execution", verifiedBy: "Facade Specialist" },
        { name: "M4: Central Chiller HVAC & Dual Wet Risers", progress: 84, status: "In Progress", verifiedBy: "MEP Consultant" },
        { name: "M5: Final Acoustic Drywalls & Occupancy Snagging", progress: 65, status: "Scheduled Next", verifiedBy: "Site PM" }
      ]
    },
    historyTimeline: [
      { date: "15 Jan 2024", title: "Master Turnkey EPC Agreement Executed", details: "Agreement signed for 215,000 sq.ft IT Commercial Park at ₹78.5 Cr." },
      { date: "18 Aug 2024", title: "Foundation Stage Handover Signoff", details: "All 182 bored cast-in-situ piles passed ultrasonic integrity testing." },
      { date: "20 May 2025", title: "7-Story Superstructure Topping-Out", details: "Slab 7 cast completed 14 days ahead of scheduled baseline." },
      { date: "15 Oct 2026", title: "Milestone 4 Progress Claim Approved", details: "Client certified ₹14.2 Cr claim with zero deduction." }
    ]
  },
  {
    id: 2,
    name: "XYZ Constructions & Hospitality",
    contactPerson: "Meenakshi Sundaram (Director of Projects)",
    email: "m.sundaram@xyzconstructions.com",
    phone: "+91 98840 98765",
    clientType: "Luxury Hospitality & Mixed Use",
    onboardingDate: "10 Mar 2024",
    contractValueINR: "₹ 52.00 Cr",
    receivedValueINR: "₹ 38.50 Cr",
    outstandingValueINR: "₹ 13.50 Cr",
    status: "Active",
    overallRating: 4.7,
    npsCategory: "Promoter (Score: +79)",
    review: "Great communication and adaptive problem solving. Material test certificates and weekly drone progress reports keep our executive team fully informed.",
    reviewDate: "05 Nov 2026",
    ratingBreakdown: { workmanship: 4.8, speed: 4.5, transparency: 4.9, safety: 4.7 },
    projectProgress: {
      projectName: "Grand Horizon Luxury Resort & Suites",
      location: "Oravakal Industrial Hub",
      builtupSqft: "145,000 sq.ft",
      plannedProgress: 82,
      actualProgress: 78,
      delayStatus: "Delayed by 7 Days (Supply chain rebar transit hold; double shifts deployed)",
      delayDays: 7,
      targetHandover: "28 Feb 2027",
      projectedCompletion: "05 Mar 2027",
      milestones: [
        { name: "M1: Earthwork & Retaining Shear Wall", progress: 100, status: "Completed", verifiedBy: "Geotech Consultant" },
        { name: "M2: Podium Deck & Banquet Structure", progress: 100, status: "Completed", verifiedBy: "Senior Site Engineer" },
        { name: "M3: Resort Block 1 & 2 Concrete Slabs", progress: 90, status: "Active", verifiedBy: "Structural Auditor" },
        { name: "M4: Infinity Pool Hydraulic Plumbing", progress: 70, status: "Active", verifiedBy: "MEP Consultant" },
        { name: "M5: Italian Marble & Landscape Decks", progress: 45, status: "Pending Slab Release", verifiedBy: "Interior PM" }
      ]
    },
    historyTimeline: [
      { date: "10 Mar 2024", title: "Contract Award & Mobilization Advance", details: "Mobilization advance of ₹5.2 Cr received." },
      { date: "25 Nov 2024", title: "Retaining Wall & Basement Handover", details: "Retaining wall zero-water seepage certification achieved." },
      { date: "12 Jul 2025", title: "Banquet Hall Grand Arch Casting", details: "Special post-tensioned beam casting successfully executed." }
    ]
  },
  {
    id: 3,
    name: "Dr. Rajesh K. (Owner Unit 402)",
    contactPerson: "Dr. Rajesh Kumar (Cardiologist)",
    email: "rajesh.k@customer.com",
    phone: "+91 97100 44556",
    clientType: "Premium High-Rise Apartment Buyer",
    onboardingDate: "22 Aug 2024",
    contractValueINR: "₹ 2.15 Cr",
    receivedValueINR: "₹ 1.83 Cr",
    outstandingValueINR: "₹ 0.32 Cr",
    status: "Active (Near Handover)",
    overallRating: 5.0,
    npsCategory: "Promoter (Score: +100)",
    review: "BuildCon's homeowner portal and transparent milestone alerts have been extraordinary. Every snag raised was resolved within 48 hours by site engineers. High quality vitrified tiling and sanitary fitments!",
    reviewDate: "18 Nov 2026",
    ratingBreakdown: { workmanship: 5.0, speed: 5.0, transparency: 5.0, safety: 5.0 },
    projectProgress: {
      projectName: "Skyline Towers - Tower A, Unit 402 (3BHK Luxury)",
      location: "Chennai ECR Road",
      builtupSqft: "2,400 sq.ft",
      plannedProgress: 96,
      actualProgress: 94,
      delayStatus: "Ahead of Schedule (Possession walk-through scheduled early)",
      delayDays: 0,
      targetHandover: "15 Jan 2027",
      projectedCompletion: "05 Jan 2027",
      milestones: [
        { name: "M1: Superstructure Slab Casting", progress: 100, status: "Completed", verifiedBy: "Senior Site Engineer" },
        { name: "M2: Gypsum Plastering & Electrical Conduiting", progress: 100, status: "Completed", verifiedBy: "QA Inspector" },
        { name: "M3: Vitrified 1200x600 Flooring & Granite Sills", progress: 100, status: "Completed", verifiedBy: "Finishes Lead" },
        { name: "M4: Modular Kitchen & Sanitary Fixtures", progress: 90, status: "Snagging Active", verifiedBy: "Site PM" },
        { name: "M5: Final Key Handover & Occupancy Certificate", progress: 80, status: "Final Signoff", verifiedBy: "Customer Relations" }
      ]
    },
    historyTimeline: [
      { date: "22 Aug 2024", title: "Unit 402 Allotment & Agreement Executed", details: "Agreement executed for 2,400 sq.ft 3BHK flat." },
      { date: "14 May 2025", title: "4th Floor Slab Milestone Cleared", details: "4th floor slab payment installment released." },
      { date: "15 Nov 2026", title: "Pre-Possession Snag Walk-Through", details: "Balcony grouting snag ticket raised and resolved same day." }
    ]
  },
  {
    id: 4,
    name: "PQR Builders & Infrastructure",
    contactPerson: "Gautam Singhania (Head of Procurement)",
    email: "gautam.s@pqrbuilders.com",
    phone: "+91 99200 33221",
    clientType: "Infrastructure Joint Venture Partner",
    onboardingDate: "05 May 2024",
    contractValueINR: "₹ 38.20 Cr",
    receivedValueINR: "₹ 29.80 Cr",
    outstandingValueINR: "₹ 8.40 Cr",
    status: "Active",
    overallRating: 4.6,
    npsCategory: "Promoter (Score: +74)",
    review: "Highly disciplined site operations and adherence to safety protocols. Zero lost-time injury record across 18 months of intensive civil works.",
    reviewDate: "29 Sep 2026",
    ratingBreakdown: { workmanship: 4.7, speed: 4.4, transparency: 4.8, safety: 5.0 },
    projectProgress: {
      projectName: "Urban Logistics Park & Grade-A PEB Hub",
      location: "Sriperumbudur Industrial Corridor",
      builtupSqft: "180,000 sq.ft",
      plannedProgress: 75,
      actualProgress: 72,
      delayStatus: "Delayed by 4 Days (High-wind crane erection advisory; recovered)",
      delayDays: 4,
      targetHandover: "15 Apr 2027",
      projectedCompletion: "19 Apr 2027",
      milestones: [
        { name: "M1: Heavy Industrial Apron Pavement", progress: 100, status: "Completed", verifiedBy: "Civil Lead" },
        { name: "M2: Pre-Engineered Steel Truss Erection", progress: 88, status: "Active", verifiedBy: "PEB Specialist" },
        { name: "M3: Standing Seam Insulated Roof Cladding", progress: 75, status: "Active", verifiedBy: "Safety Head" },
        { name: "M4: Fire Hydrant & Automatic Sprinkler Grid", progress: 60, status: "In Progress", verifiedBy: "Fire Safety Consultant" }
      ]
    },
    historyTimeline: [
      { date: "05 May 2024", title: "Turnkey PEB Warehouse EPC Signed", details: "Project contract of ₹38.2 Cr signed with 12-month delivery target." },
      { date: "14 Feb 2025", title: "Laser-Screed Industrial Flooring Completed", details: "Achieved FM2 floor flatess standards verified by third-party testing." }
    ]
  },
  {
    id: 5,
    name: "L&N Real Estate Assets Ltd",
    contactPerson: "Anand Vardhan (Chief Investment Officer)",
    email: "anand.vardhan@lnproperties.com",
    phone: "+91 98111 66778",
    clientType: "Institutional Real Estate Fund",
    onboardingDate: "12 Nov 2024",
    contractValueINR: "₹ 25.00 Cr",
    receivedValueINR: "₹ 21.00 Cr",
    outstandingValueINR: "₹ 4.00 Cr",
    status: "Active",
    overallRating: 4.8,
    npsCategory: "Promoter (Score: +85)",
    review: "Timely reporting and top-tier financial governance. BuildCon's digital ERP ensures every rupee spent is linked to verifiable site milestones.",
    reviewDate: "14 Nov 2026",
    ratingBreakdown: { workmanship: 4.9, speed: 4.7, transparency: 5.0, safety: 4.8 },
    projectProgress: {
      projectName: "L&N Boutique Executive Suites",
      location: "Anna Nagar West",
      builtupSqft: "65,000 sq.ft",
      plannedProgress: 88,
      actualProgress: 86,
      delayStatus: "On Track",
      delayDays: 0,
      targetHandover: "30 Jan 2027",
      projectedCompletion: "28 Jan 2027",
      milestones: [
        { name: "M1: Bored Piles & Raft Casting", progress: 100, status: "Completed", verifiedBy: "Senior Site Engineer" },
        { name: "M2: 5-Story RCC Superstructure", progress: 100, status: "Completed", verifiedBy: "Structural Auditor" },
        { name: "M3: Terracotta Louvered Exterior Cladding", progress: 85, status: "Active", verifiedBy: "Architect Cell" },
        { name: "M4: VRF Air Conditioning & Smart BMS", progress: 78, status: "In Progress", verifiedBy: "MEP Consultant" }
      ]
    },
    historyTimeline: [
      { date: "12 Nov 2024", title: "EPC Development Agreement Awarded", details: "Agreement valued at ₹25 Cr executed with 14-month completion schedule." },
      { date: "10 Aug 2025", title: "Superstructure Completion Inspection", details: "Passed zero-defect audit by institutional lenders." }
    ]
  }
];

export default function ClientInsights() {
  const [clients, setClients] = useState<ClientDirectoryRecord[]>(FALLBACK_CLIENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const [selectedClient, setSelectedClient] = useState<ClientDirectoryRecord | null>(null);
  const [activeDossierTab, setActiveDossierTab] = useState<"PROGRESS" | "REVIEWS" | "HISTORY" | "FINANCIAL">("PROGRESS");

  const fetchClientDirectory = async () => {
    try {
      const sessionStr = typeof window !== "undefined" ? localStorage.getItem("buildcon_session") : null;
      const token = typeof window !== "undefined" ? localStorage.getItem("buildcon_token") : null;
      let orgId = 1;
      if (sessionStr) {
        try {
          const s = JSON.parse(sessionStr);
          if (s.organizationId) orgId = s.organizationId;
        } catch (e) {}
      }

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`http://localhost:8081/api/chairman/clients/org/${orgId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data && data.clients && data.clients.length > 0) {
          setClients(data.clients);
        }
      }
    } catch (e) {
      console.warn("Using local client directory data", e);
    }
  };

  useEffect(() => {
    fetchClientDirectory();
  }, []);

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.projectProgress.projectName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "DELAYED" && c.projectProgress.delayDays > 0) ||
      (statusFilter === "ON_TRACK" && c.projectProgress.delayDays === 0);

    const matchesRating =
      ratingFilter === "ALL" ||
      (ratingFilter === "5_STARS" && c.overallRating >= 4.9) ||
      (ratingFilter === "4_PLUS" && c.overallRating >= 4.5);

    return matchesSearch && matchesStatus && matchesRating;
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3 h-3 text-blue-400" />
              Executive Client Relationship Governance
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            05. CHAIRMAN CLIENT DIRECTORY & PORTFOLIO 360°
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit every client's satisfaction ratings, complete contract history, assigned site milestone progress, and delay recovery reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-mono font-bold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            <span>₹ 211.85 Cr Active Client Contracts</span>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-4 flex justify-between items-center shadow-lg">
          <div>
            <div className="text-xs text-slate-400">Overall Client Satisfaction</div>
            <div className="text-2xl font-bold text-white mt-1">4.8 / 5.0</div>
            <div className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-slate-400 ml-1 font-mono">(NPS +84)</span>
            </div>
          </div>
          <Heart className="h-8 w-8 text-rose-500/20" />
        </div>

        <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs text-slate-400">Total Enterprise Clients</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{clients.length} Portfolios</div>
          <div className="text-[10px] text-slate-500 mt-1">100% Contract Audited</div>
        </div>

        <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs text-slate-400">Average Milestone Progress</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">83.6%</div>
          <div className="text-[10px] text-emerald-400 mt-1">Across Active Construction Sites</div>
        </div>

        <div className="bg-[#111A2E] border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs text-slate-400">Site Schedule Health</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">3 On Track</div>
          <div className="text-[10px] text-amber-400 mt-1">2 Recovering Supply Buffers</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-[#111A2E] border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by client name, project, or representative..."
              className="w-full bg-slate-900 border border-slate-750 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-400 font-sans"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-750 font-semibold focus:outline-none focus:border-blue-400"
          >
            <option value="ALL">All Site Statuses</option>
            <option value="ON_TRACK">On Track Sites Only</option>
            <option value="DELAYED">Sites with Delays</option>
          </select>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-slate-900 text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-750 font-semibold focus:outline-none focus:border-blue-400"
          >
            <option value="ALL">All Star Ratings</option>
            <option value="5_STARS">5.0 ★ Only</option>
            <option value="4_PLUS">4.5+ ★ and Above</option>
          </select>
        </div>
      </div>

      {/* Client Directory Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredClients.map((client) => {
          const isDelayed = client.projectProgress.delayDays > 0;
          return (
            <div
              key={client.id}
              className="bg-[#111A2E] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition space-y-4"
            >
              {/* Row 1: Client Overview & Star Rating */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white text-base shrink-0 shadow-md">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{client.name}</h3>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold">
                        {client.clientType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Contact: <span className="text-slate-200">{client.contactPerson}</span> • ✉️ {client.email} • 📞 {client.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-sm font-bold text-amber-400 font-mono">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{client.overallRating.toFixed(1)} / 5.0</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">{client.npsCategory}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedClient(client);
                      setActiveDossierTab("PROGRESS");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition shrink-0"
                  >
                    <span>View 360° Dossier</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Row 2: Client Review Testimonial Banner */}
              <div className="p-3 bg-[#0B111E] rounded-xl border border-slate-800/80 text-xs flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold text-slate-300 text-[11px] block">Verified Client Review ({client.reviewDate}):</span>
                  <p className="italic text-slate-200 mt-0.5 font-serif leading-relaxed">
                    &ldquo;{client.review}&rdquo;
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-slate-400 shrink-0 border-l border-slate-800 pl-3">
                  <div>Quality: <span className="text-emerald-400 font-bold">{client.ratingBreakdown.workmanship}★</span></div>
                  <div>Speed: <span className="text-emerald-400 font-bold">{client.ratingBreakdown.speed}★</span></div>
                  <div>Safety: <span className="text-emerald-400 font-bold">{client.ratingBreakdown.safety}★</span></div>
                </div>
              </div>

              {/* Row 3: Linked Project Progress & Delay Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pt-1 text-xs">
                {/* Project Details */}
                <div className="lg:col-span-4 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    Assigned Construction Project
                  </div>
                  <div className="font-bold text-white text-sm">{client.projectProgress.projectName}</div>
                  <div className="text-slate-400 text-[11px]">📍 {client.projectProgress.location} ({client.projectProgress.builtupSqft})</div>
                </div>

                {/* Progress Bar & Schedule Status */}
                <div className="lg:col-span-5 space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">
                      Planned: <span className="text-white font-mono font-bold">{client.projectProgress.plannedProgress}%</span>
                    </span>
                    <span className="text-slate-400">
                      Actual Progress: <span className="text-emerald-400 font-mono font-bold">{client.projectProgress.actualProgress}%</span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
                    <div
                      className="bg-slate-600 h-full absolute top-0 left-0 opacity-40"
                      style={{ width: `${client.projectProgress.plannedProgress}%` }}
                    />
                    <div
                      className={`h-full absolute top-0 left-0 transition-all ${
                        isDelayed ? "bg-amber-500" : "bg-gradient-to-r from-emerald-500 to-teal-400"
                      }`}
                      style={{ width: `${client.projectProgress.actualProgress}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px]">
                    <span
                      className={`font-semibold ${
                        isDelayed ? "text-amber-400" : "text-emerald-400"
                      }`}
                    >
                      {client.projectProgress.delayStatus}
                    </span>
                    <span className="text-slate-400">
                      Target Handover: <span className="text-white font-mono">{client.projectProgress.targetHandover}</span>
                    </span>
                  </div>
                </div>

                {/* Financial Overview */}
                <div className="lg:col-span-3 bg-[#0B111E] p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Contract Value:</span>
                    <span className="font-bold text-white font-mono">{client.contractValueINR}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Received (Paid):</span>
                    <span className="font-bold text-emerald-400 font-mono">{client.receivedValueINR}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Outstanding:</span>
                    <span className="font-bold text-amber-400 font-mono">{client.outstandingValueINR}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Client 360° Dossier Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white text-xl shadow-lg">
                  {selectedClient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {selectedClient.name}
                    <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[10px] font-bold">
                      {selectedClient.clientType}
                    </span>
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Account: <span className="text-slate-200">{selectedClient.contactPerson}</span> • ✉️ {selectedClient.email} • 📞 {selectedClient.phone}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedClient(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveDossierTab("PROGRESS")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeDossierTab === "PROGRESS"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>📊 Site Progress & Milestones</span>
              </button>

              <button
                onClick={() => setActiveDossierTab("REVIEWS")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeDossierTab === "REVIEWS"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-500/20"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>⭐ Reviews & Rating Analysis</span>
              </button>

              <button
                onClick={() => setActiveDossierTab("HISTORY")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeDossierTab === "HISTORY"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>📜 Contract & Milestones History</span>
              </button>

              <button
                onClick={() => setActiveDossierTab("FINANCIAL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeDossierTab === "FINANCIAL"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>💰 Financials & Claims</span>
              </button>
            </div>

            {/* TAB 1: SITE PROGRESS & MILESTONES */}
            {activeDossierTab === "PROGRESS" && (
              <div className="space-y-4 text-xs">
                {/* Project Header Card */}
                <div className="p-4 bg-[#0B111E] rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[10px] text-cyan-400 font-bold uppercase">Linked Active Construction Site</div>
                      <h4 className="text-base font-bold text-white mt-0.5">{selectedClient.projectProgress.projectName}</h4>
                      <p className="text-slate-400 text-xs">📍 {selectedClient.projectProgress.location} ({selectedClient.projectProgress.builtupSqft})</p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        selectedClient.projectProgress.delayDays > 0
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {selectedClient.projectProgress.delayStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Planned Progress</span>
                      <span className="text-sm font-bold text-white font-mono">{selectedClient.projectProgress.plannedProgress}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Actual Progress</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono">{selectedClient.projectProgress.actualProgress}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Target Handover</span>
                      <span className="text-sm font-bold text-white font-mono">{selectedClient.projectProgress.targetHandover}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Forecast Completion</span>
                      <span className="text-sm font-bold text-cyan-400 font-mono">{selectedClient.projectProgress.projectedCompletion}</span>
                    </div>
                  </div>
                </div>

                {/* Milestones Breakdown Table */}
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    Site Execution Milestones Breakdown
                  </h4>

                  <div className="space-y-2">
                    {selectedClient.projectProgress.milestones.map((m, idx) => (
                      <div
                        key={`m-${idx}`}
                        className="p-3 bg-slate-800/60 rounded-xl border border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="font-bold text-white text-xs">{m.name}</div>
                          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden max-w-md">
                            <div
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                              style={{ width: `${m.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 text-right">
                          <span className="font-bold font-mono text-cyan-300">{m.progress}%</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              m.progress === 100
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            }`}
                          >
                            {m.status}
                          </span>
                          <span className="text-[10px] text-slate-400">Signoff: {m.verifiedBy}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: REVIEWS & RATINGS */}
            {activeDossierTab === "REVIEWS" && (
              <div className="space-y-4 text-xs">
                {/* Rating Overview */}
                <div className="p-4 bg-[#0B111E] rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Overall Client Score</div>
                    <div className="text-3xl font-bold text-amber-400 font-mono mt-0.5">
                      {selectedClient.overallRating.toFixed(1)} / 5.0
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs text-slate-400 font-sans ml-2 font-semibold">{selectedClient.npsCategory}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Pillars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Workmanship Quality</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">{selectedClient.ratingBreakdown.workmanship} ★</span>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Schedule Adherence</span>
                    <span className="text-lg font-bold text-cyan-400 font-mono">{selectedClient.ratingBreakdown.speed} ★</span>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Material Transparency</span>
                    <span className="text-lg font-bold text-amber-400 font-mono">{selectedClient.ratingBreakdown.transparency} ★</span>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Site Safety & Compliance</span>
                    <span className="text-lg font-bold text-violet-400 font-mono">{selectedClient.ratingBreakdown.safety} ★</span>
                  </div>
                </div>

                {/* Full Testimonial */}
                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700 space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-[11px]">
                    <span className="font-bold text-white">Full Written Feedback Review</span>
                    <span className="font-mono">Logged on {selectedClient.reviewDate}</span>
                  </div>
                  <p className="text-slate-200 text-sm font-serif italic leading-relaxed">
                    &ldquo;{selectedClient.review}&rdquo;
                  </p>
                  <div className="text-right text-[11px] text-blue-400 font-bold">
                    — {selectedClient.contactPerson}, {selectedClient.name}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CONTRACT & MILESTONE HISTORY */}
            {activeDossierTab === "HISTORY" && (
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                  Contractual Milestone Execution Timeline
                </h4>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                  {selectedClient.historyTimeline.map((item, idx) => (
                    <div key={`hist-${idx}`} className="relative space-y-1">
                      <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-900" />
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-white">{item.title}</span>
                        <span className="text-slate-400 font-mono">{item.date}</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{item.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: FINANCIALS & CLAIMS */}
            {activeDossierTab === "FINANCIAL" && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Total Contract Value</span>
                    <span className="text-xl font-bold text-white font-mono mt-1">{selectedClient.contractValueINR}</span>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Certified & Paid Receipts</span>
                    <span className="text-xl font-bold text-emerald-400 font-mono mt-1">{selectedClient.receivedValueINR}</span>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Outstanding Dues</span>
                    <span className="text-xl font-bold text-amber-400 font-mono mt-1">{selectedClient.outstandingValueINR}</span>
                  </div>
                </div>

                <div className="p-4 bg-[#0B111E] rounded-xl border border-slate-800 text-slate-300 space-y-2">
                  <div className="font-bold text-white text-xs">Billing & Invoicing Governance</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    All payment milestones are cryptographically bound to verified site engineering checklists (IS 456 concrete cube test certificates, MEP hydraulic pressure test logs, and third-party QA signoffs).
                  </p>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      <AIAssistantBar
        suggestions={[
          "NPS score analysis across commercial clients",
          "Sites experiencing concrete delivery delays",
          "Loyal repeat clients contract summary",
          "Outstanding milestone receivable balances"
        ]}
      />
    </div>
  );
}
