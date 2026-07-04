"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2, Crown, Users, Wrench, ShieldCheck,
  ArrowRight, Landmark, Info, KeyRound, Timer, AlertCircle, Sparkles,
  Sun, Moon, User, Lock
} from "lucide-react";

// Curated high-resolution construction & modern enterprise backgrounds
const HERO_BG_IMAGES = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600", // Skyscraper
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600", // Construction site
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600", // Modern crane
  "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=1600", // Modern architecture
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600"  // Design structural view
];

interface Organization {
  id: number;
  name: string;
  subscriptionTier?: string;
}

export default function Home() {
  const [bgImage, setBgImage] = useState("");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("buildcon_theme") || "dark";
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("buildcon_theme", nextTheme);
    }
  };
  const [organizations, setOrganizations] = useState<Organization[]>([
    { id: 1, name: "Zenelait Infotech", subscriptionTier: "Enterprise" },
    { id: 2, name: "BuildCon Constructions", subscriptionTier: "Premium" },
    { id: 3, name: "Global Builders Ltd", subscriptionTier: "Growth" },
    { id: 4, name: "Vender Structural", subscriptionTier: "Enterprise" }
  ]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showOrgSuggestions, setShowOrgSuggestions] = useState(false);
  
  // Organization Login Credentials States
  const [orgUsername, setOrgUsername] = useState("");
  const [orgPassword, setOrgPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Set random background image on mount
  useEffect(() => {
    const randomImg = HERO_BG_IMAGES[Math.floor(Math.random() * HERO_BG_IMAGES.length)];
    setBgImage(randomImg);

    // Fetch organizations from the backend
    fetch("https://erp-construction.onrender.com/api/organizations")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setOrganizations(data);
        }
      })
      .catch(err => console.log("Backend not reachable, using fallback organizations.", err));
  }, []);

  // Get current tier of selected organization
  const getSelectedOrgTier = () => {
    const org = organizations.find(o => o.name.toLowerCase() === selectedOrg.trim().toLowerCase());
    return org && org.subscriptionTier ? org.subscriptionTier : "Enterprise";
  };

  // Get current ID of selected organization
  const getSelectedOrgId = () => {
    const org = organizations.find(o => o.name.toLowerCase() === selectedOrg.trim().toLowerCase());
    return org ? org.id.toString() : "";
  };

  // Automatically sync selected organization and tier to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selected_login_org", selectedOrg);
      localStorage.setItem("selected_login_tier", getSelectedOrgTier());
      localStorage.setItem("selected_login_org_id", getSelectedOrgId());
    }
  }, [selectedOrg, organizations]);

  // Helper to determine role lists based on portal type and organization tier
  const getRolesForPortal = (portalType: 'chairman' | 'director' | 'manager') => {
    const tier = getSelectedOrgTier().toLowerCase();

    if (portalType === 'chairman') {
      return ["Chairman"];
    }

    if (portalType === 'director') {
      if (tier === 'growth') {
        return []; // hidden entirely
      }
      if (tier === 'premium') {
        return ["Managing Director", "Project Director"];
      }
      // Enterprise or default
      return ["Managing Director", "Project Director", "Business Development Director", "Finance Director"];
    }

    if (portalType === 'manager') {
      if (tier === 'growth') {
        return [
          "Project Manager", "Senior Site Engineer", "Site Engineer",
          "Contractor", "Subcontractor", "Workforce Supervisor", "Labour"
        ];
      }
      if (tier === 'premium') {
        return [
          "Project Manager", "Construction Manager", "Quantity Surveyor",
          "Procurement Manager", "Finance Manager", "HR Manager",
          "Business Development Manager", "Site Engineer", "Contractor", "Labour"
        ];
      }
      // Enterprise or default
      return [
        "Project Manager", "Construction Manager", "Quantity Surveyor", "Procurement Manager",
        "Finance Manager", "HR Manager", "Business Development Manager", "Site Engineer",
        "Contractor", "Subcontractor", "Workforce Supervisor", "Labour",
        "Digital Marketing TL", "Digital Marketing Executive", "Sales Executive", "Marketing Manager"
      ];
    }
    return [];
  };

  const handleOrgLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg) return;

    try {
      const res = await fetch("https://erp-construction.onrender.com/api/organizations/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedOrg,
          username: orgUsername.trim(),
          password: orgPassword.trim()
        })
      });

      if (res.ok) {
        const orgData = await res.json();
        setIsUnlocked(true);
        setShowOtpModal(false);
        setAuthError("");
        if (typeof window !== "undefined") {
          localStorage.setItem("selected_login_org", orgData.name);
          localStorage.setItem("selected_login_tier", orgData.subscriptionTier || "Enterprise");
          localStorage.setItem("selected_login_org_id", orgData.id.toString());
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setAuthError(errData.message || "Invalid organization credentials. Check the credentials guide below.");
      }
    } catch (err) {
      setAuthError("Error connecting to organization authentication server.");
    }
  };

  return (
    <main className={`min-h-screen bg-[#070b13] text-white overflow-x-hidden relative font-sans transition-colors duration-300 ${theme === "light" ? "light-theme" : ""}`}>
      {/* NAVBAR */}
      {!isUnlocked && (
        <nav className="border-b border-white/10 bg-[#070b13]/80 backdrop-blur-md sticky top-0 z-40 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl overflow-hidden bg-gradient-to-br from-[#FF2E93] to-[#0A2540] flex items-center justify-center shadow-lg shadow-pink-500/20">
                <img 
                  src="/logo.jpeg" 
                  alt="logo" 
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-110" 
                />
              </div>
              <div>
                <div className="font-extrabold tracking-wide text-lg text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#FF2E93]">
                  Zenelait Infotech
                </div>
                <div className="text-[9px] text-[#FF2E93] tracking-widest uppercase font-mono font-bold">
                  Private Limited Corporations
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href="#about" className="text-slate-300 hover:text-white text-xs font-semibold tracking-wider uppercase transition">
                About
              </a>
              
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition duration-300 flex items-center justify-center shadow-md shadow-black/10 active:scale-95"
                title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
              >
                {theme === "dark" ? (
                  <Sun className="h-3.5 w-3.5 text-yellow-400" />
                ) : (
                  <Moon className="h-3.5 w-3.5 text-[#FF2E93]" />
                )}
              </button>

              {!isUnlocked ? (
                <button
                  onClick={() => setShowOtpModal(true)}
                  className="relative group overflow-hidden px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 bg-gradient-to-r from-[#FF2E93] to-[#FF4E6B] shadow-lg shadow-pink-500/30 hover:shadow-[#FF2E93]/50 hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Into <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setIsUnlocked(false)}
                  className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold uppercase transition"
                >
                  Lock Portals
                </button>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* HERO SECTION */}
      {!isUnlocked && (
        <section className="relative min-h-[75vh] flex items-center justify-center bg-cover bg-center overflow-hidden py-20 px-6" style={{ backgroundImage: bgImage ? `linear-gradient(to bottom, rgba(7, 11, 19, 0.85), rgba(7, 11, 19, 0.95)), url(${bgImage})` : 'none' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b13]/90 via-transparent to-[#070b13]/90 pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#FF2E93] mb-6 tracking-wide">
              <Sparkles className="h-3.5 w-3.5" /> Next-Generation Construction ERP
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Zenelait Infotech <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E93] via-[#ff657d] to-[#0A2540] drop-shadow-md">
                Private Limited Corporations
              </span>
            </h1>
            <p className="text-base md:text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Revolutionizing project controls, real-time site engineering data, subcontractor billing, progress claims, concrete compression tests, and generative AI execution tools on a unified workspace.
            </p>

            {!isUnlocked ? (
              <button
                onClick={() => setShowOtpModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-[#FF2E93] to-[#FF4E6B] rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:scale-[1.05] shadow-xl shadow-[#FF2E93]/20 hover:shadow-[#FF2E93]/40 active:scale-[0.98]"
              >
                Get Into Portal
              </button>
            ) : (
              <a
                href="#portals"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-650 rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:scale-[1.05] shadow-xl shadow-blue-500/20 active:scale-[0.98] inline-flex items-center gap-2"
              >
                Enter Portals <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </section>
      )}

      {/* STATS COUNT BAR */}
      {!isUnlocked && (
        <section className="border-y border-white/5 bg-slate-950/40 py-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-extrabold text-[#FF2E93] mb-1">50+</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Enterprise Clients</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-blue-400 mb-1">120+</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Active Projects</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#FF2E93] mb-1">15,000+</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Workforce Tracked</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#00E5FF] mb-1">99.9%</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Platform Uptime</div>
            </div>
          </div>
        </section>
      )}

      {/* ABOUT SECTION */}
      {!isUnlocked && (
        <section id="about" className="py-24 max-w-5xl mx-auto px-6 scroll-mt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">About Zenelait Infotech</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              A leader in designing premium, enterprise-grade cloud software specialized in complex construction site execution, tracking raw material workflows, planning budgets, and managing multi-tenant operations.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition">
              <ShieldCheck className="h-8 w-8 text-[#FF2E93] mb-4" />
              <h3 className="text-lg font-bold mb-2">Premium Security</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Equipped with role-based JWT authentications, enterprise encryption, and dynamic, time-based OTP protection layers.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition">
              <Landmark className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">Operational Scalability</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Supporting over 15 unique operational flows tailored specifically for executives, subcontractors, project managers, and boards.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition">
              <Sparkles className="h-8 w-8 text-[#00E5FF] mb-4" />
              <h3 className="text-lg font-bold mb-2">AI Operations</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Integrated with LLM context capabilities to handle site execution logs, clash reports, and supply chains efficiently.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* PORTALS SECTION (UNLOCKED STATE) */}
      {isUnlocked && (
        <section id="portals" className="py-20 bg-slate-950/60 border-t border-white/5 px-6 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 mb-4 font-bold">
                ✓ Authentication Gate Unlocked
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">Select Your Sign In Portal</h2>
              <p className="text-xs text-slate-400 mt-2">
                Active Organization: <span className="font-bold text-white">{selectedOrg}</span> ({getSelectedOrgTier()} Tier)
              </p>
              
              {/* Sleek premium back button to lock portals and return to organization selection */}
              <div className="mt-4">
                <button
                  onClick={() => {
                    setIsUnlocked(false);
                    setShowOtpModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-white/10 hover:border-[#FF2E93]/40 bg-white/5 hover:bg-[#FF2E93]/15 text-[10px] uppercase font-bold tracking-wider text-slate-300 hover:text-white rounded-lg transition duration-300 active:scale-95 shadow-md shadow-black/10"
                >
                  ← Back to Organization Login
                </button>
              </div>
            </div>

            <div className={`grid gap-6 ${getRolesForPortal('director').length === 0 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'}`}>

              {/* Chairman Portal */}
              <Link href="/login/chairman" className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 p-8 transition flex flex-col justify-between h-full hover:-translate-y-1 duration-300">
                <div>
                  <Crown className="h-10 w-10 text-yellow-400 mb-4" />
                  <h3 className="text-xl font-bold mb-1">Chairman Portal</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6">
                    Strategic command center — revenue, profit, growth, and board-level approvals.
                  </p>
                  <div className="border-t border-white/5 pt-4">
                    <span className="text-[10px] uppercase tracking-wider text-yellow-400 font-bold block mb-2">Allowed Roles:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {getRolesForPortal('chairman').map(role => (
                        <span key={role} className="text-[10px] bg-yellow-400/10 text-yellow-300 border border-yellow-400/20 px-2 py-0.5 rounded-md">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="inline-block mt-6 text-yellow-400 text-xs font-bold tracking-wider uppercase group-hover:translate-x-1 transition">Sign in →</span>
              </Link>

              {/* Directors Portal (Hidden for Growth Tier) */}
              {getRolesForPortal('director').length > 0 && (
                <Link href="/login/director" className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 p-8 transition flex flex-col justify-between h-full hover:-translate-y-1 duration-300">
                  <div>
                    <Users className="h-10 w-10 text-blue-400 mb-4" />
                    <h3 className="text-xl font-bold mb-1">Directors Portal</h3>
                    <p className="text-slate-400 text-xs leading-relaxed mb-6">
                      Centralized login for managing director, project directors, business, and finance directors.
                    </p>
                    <div className="border-t border-white/5 pt-4">
                      <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold block mb-2">Allowed Roles:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {getRolesForPortal('director').map(role => (
                          <span key={role} className="text-[10px] bg-blue-400/10 text-blue-300 border border-blue-400/20 px-2 py-0.5 rounded-md">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="inline-block mt-6 text-blue-400 text-xs font-bold tracking-wider uppercase group-hover:translate-x-1 transition">Sign in →</span>
                </Link>
              )}

              {/* Teams & Staff Portal */}
              <Link href="/login/manager" className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 p-8 transition flex flex-col justify-between h-full hover:-translate-y-1 duration-300">
                <div>
                  <Wrench className="h-10 w-10 text-amber-400 mb-4" />
                  <h3 className="text-xl font-bold mb-1">Teams & Staff Portal</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6">
                    Centralized login for construction, engineering, quantity surveyors, subcontractor claims, and site operations.
                  </p>
                  <div className="border-t border-white/5 pt-4">
                    <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block mb-2">Allowed Roles:</span>
                    <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {getRolesForPortal('manager').map(role => (
                        <span key={role} className="text-[10px] bg-amber-400/10 text-amber-300 border border-amber-400/20 px-2 py-0.5 rounded-md">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="inline-block mt-6 text-amber-400 text-xs font-bold tracking-wider uppercase group-hover:translate-x-1 transition">Sign in →</span>
              </Link>
            </div>

            <div className="text-center mt-12">
              <Link href="/signup" className="text-xs text-slate-400 hover:text-white transition underline">
                Need to register an account? Create an account here
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ORGANIZATION LOGIN MODAL GATE (Reddish-Pink & Navy-Blue Classic Style) */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-gradient-to-br from-[#0A2540]/95 via-[#0c1b30]/98 to-[#130E20]/95 border-2 border-[#FF2E93]/70 rounded-3xl p-8 shadow-2xl shadow-[#FF2E93]/20 overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 h-40 w-40 bg-[#FF2E93]/10 blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-40 w-40 bg-blue-600/10 blur-[60px] rounded-full pointer-events-none" />

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold tracking-tight flex items-center gap-2 text-[#FF2E93]">
                <KeyRound className="h-5 w-5 text-white" /> Get Into Portal
              </h3>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOrgUsername("");
                  setOrgPassword("");
                  setAuthError("");
                }}
                className="text-slate-400 hover:text-white transition font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Verify your organizational access. Select your organization and enter your organization credentials to unlock role-based sign in portals.
            </p>

            <form onSubmit={handleOrgLoginSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#FF2E93] uppercase tracking-wider block mb-2">
                  Organization Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. BuildWell Constructions Ltd"
                    className="w-full bg-[#071321] border border-blue-900/40 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#FF2E93]"
                    value={selectedOrg}
                    onChange={(e) => {
                      setSelectedOrg(e.target.value);
                      setAuthError("");
                    }}
                    onFocus={() => setShowOrgSuggestions(true)}
                    onBlur={() => setShowOrgSuggestions(false)}
                  />
                  {showOrgSuggestions && selectedOrg && (() => {
                    const filtered = organizations.filter(o => o.name.toLowerCase().includes(selectedOrg.toLowerCase()));
                    if (filtered.length === 0) return null;
                    return (
                      <div className="absolute left-0 right-0 mt-1 bg-[#071321] border border-blue-900/60 rounded-xl max-h-40 overflow-y-auto z-50 shadow-2xl divide-y divide-blue-950">
                        {filtered.map((org) => (
                          <div
                            key={org.id}
                            className="px-4 py-2.5 text-xs text-slate-200 hover:bg-[#FF2E93]/20 hover:text-white cursor-pointer transition-colors duration-200 text-left"
                            onMouseDown={() => {
                              setSelectedOrg(org.name);
                              setShowOrgSuggestions(false);
                              setAuthError("");
                            }}
                          >
                            {org.name}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Organization Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. venderstructural&0123"
                    className="w-full bg-[#071321] border border-blue-900/40 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#FF2E93]"
                    value={orgUsername}
                    onChange={(e) => {
                      setOrgUsername(e.target.value);
                      setAuthError("");
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-405 uppercase tracking-wider block mb-2">
                  Organization Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#071321] border border-blue-900/40 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#FF2E93]"
                    value={orgPassword}
                    onChange={(e) => {
                      setOrgPassword(e.target.value);
                      setAuthError("");
                    }}
                  />
                </div>
              </div>

              {authError && (
                <div className="text-xs text-rose-400 bg-rose-950/20 border border-rose-900/40 p-3 rounded-xl flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#FF2E93] to-[#FF4E6B] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition duration-300 hover:brightness-110 active:scale-[0.98] shadow-md shadow-pink-600/20"
              >
                Verify & Enter Portals
              </button>
            </form>

            {/* Premium Credentials Help Box */}
            <div className="mt-5 bg-[#071321]/80 border border-blue-900/30 rounded-xl p-3.5 text-[11px] text-slate-400 space-y-1.5">
              <div className="font-bold text-[#FF2E93] uppercase tracking-wider text-[9px] flex items-center gap-1">
                <Info className="h-3.5 w-3.5" /> Credentials Guide
              </div>
              <p className="text-[10px] text-slate-400">
                To login, use the organization credentials pattern:
              </p>
              <div className="grid grid-cols-3 gap-1 py-1 font-mono text-[10px]">
                <span className="text-slate-500">Username:</span>
                <span className="col-span-2 text-white">[org_name_no_spaces]&0123</span>
                <span className="text-slate-500">Password:</span>
                <span className="col-span-2 text-white">[first_word_lowercase]@123</span>
              </div>
              <div className="border-t border-blue-900/20 pt-1.5 text-[9px] text-slate-500 italic">
                Example ("Vender Structural"): <span className="text-pink-400">venderstructural&0123</span> / <span className="text-pink-400">vender@123</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* FOOTER */}
      {!isUnlocked && (
        <footer className="border-t border-white/10 bg-[#040810]/95 backdrop-blur-md pt-16 pb-12 text-slate-400">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
              {/* Column 1: Logo & Brand Description */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl overflow-hidden bg-gradient-to-br from-[#FF2E93] to-[#0A2540] flex items-center justify-center shadow-lg shadow-pink-500/20">
                    <img 
                      src="/logo.jpeg" 
                      alt="logo" 
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-110" 
                    />
                  </div>
                  <div>
                    <div className="font-extrabold tracking-wide text-base text-white">
                      Zenelait Infotech
                    </div>
                    <div className="text-[8px] text-[#FF2E93] tracking-widest uppercase font-mono font-bold">
                      Private Limited Corporations
                    </div>
                  </div>
                </div>
                <p className="text-xs leading-relaxed mt-2 text-slate-500">
                  Delivering next-generation construction ERP systems. Streamlining real-time site engineering, progress claims, workforce audits, and intelligent AI-driven operation analysis.
                </p>
              </div>

              {/* Column 2: Quick Links */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Links</h4>
                <ul className="flex flex-col gap-2.5 text-xs">
                  <li>
                    <a href="#about" className="hover:text-white transition">About Us</a>
                  </li>
                  <li>
                    <a href="#features" className="hover:text-white transition text-slate-400">Platform Features</a>
                  </li>
                  <li>
                    <a href="#portals" className="hover:text-white transition text-slate-400">Portals Selection</a>
                  </li>
                </ul>
              </div>

              {/* Column 3: Corporate Portals */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Corporate Portals</h4>
                <ul className="flex flex-col gap-2.5 text-xs">
                  <li>
                    <Link href="/login/chairman" className="hover:text-white transition text-slate-400">Chairman Dashboard</Link>
                  </li>
                  <li>
                    <Link href="/login/director" className="hover:text-white transition text-slate-400">Directors Portal</Link>
                  </li>
                  <li>
                    <Link href="/login/manager" className="hover:text-white transition text-slate-400">Teams & Staff Login</Link>
                  </li>
                </ul>
              </div>

              {/* Column 4: Contact & Info */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Contact Info</h4>
                <ul className="flex flex-col gap-2.5 text-xs text-slate-500">
                  <li className="leading-relaxed">
                    <span className="text-slate-400 font-semibold">Address:</span> Chennai, Tamil Nadu, India
                  </li>
                  <li>
                    <span className="text-slate-400 font-semibold">Email:</span> info@zenelait.com
                  </li>
                  <li>
                    <span className="text-slate-400 font-semibold">Support:</span> support@zenelait.com
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <span>Developed by</span>
                <span className="font-bold text-white">Zenelait</span>
              </div>
              <div className="text-center md:text-right">
                <p className="text-slate-500">© 2026 Zenelait Infotech. All rights reserved.</p>
                <p className="text-[10px] text-slate-600 mt-1">Secure Enterprise Portal Platform — Integrated ERP & Intelligent AI Systems</p>
              </div>
            </div>
          </div>
        </footer>
      )}
    </main>
  );
}
