"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building2, Crown, Users, Wrench, ShieldCheck, 
  ArrowRight, Landmark, Info, KeyRound, Timer, AlertCircle, Sparkles
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
  const [organizations, setOrganizations] = useState<Organization[]>([
    { id: 1, name: "Zenelait Infotech", subscriptionTier: "Enterprise" },
    { id: 2, name: "BuildCon Constructions", subscriptionTier: "Premium" },
    { id: 3, name: "Global Builders Ltd", subscriptionTier: "Growth" }
  ]);
  const [selectedOrg, setSelectedOrg] = useState("Zenelait Infotech");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [userOtp, setUserOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);

  // Set random background image on mount
  useEffect(() => {
    const randomImg = HERO_BG_IMAGES[Math.floor(Math.random() * HERO_BG_IMAGES.length)];
    setBgImage(randomImg);
    
    // Fetch organizations from the backend
    fetch("http://localhost:8081/api/organizations")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setOrganizations(data);
          setSelectedOrg(data[0].name);
        }
      })
      .catch(err => console.log("Backend not reachable, using fallback organizations.", err));
  }, []);

  // Get current tier of selected organization
  const getSelectedOrgTier = () => {
    const org = organizations.find(o => o.name === selectedOrg);
    return org && org.subscriptionTier ? org.subscriptionTier : "Enterprise";
  };

  // Get current ID of selected organization
  const getSelectedOrgId = () => {
    const org = organizations.find(o => o.name === selectedOrg);
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

  // Time-based dynamic OTP generator
  // Generates a 4-digit deterministic number for an organization that changes every 30 seconds
  const getOtpForTimeWindow = (orgName: string, timeOffsetSeconds = 0) => {
    const timeWindow = Math.floor((Date.now() - timeOffsetSeconds * 1000) / 30000);
    let hash = 0;
    const str = orgName + "_" + timeWindow;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const otp = Math.abs(hash % 9000) + 1000; // 4-digit range
    return otp.toString();
  };

  // Timer loop to update expiry display and generated OTP in popup if visible
  useEffect(() => {
    const interval = setInterval(() => {
      const msSinceEpoch = Date.now();
      const secondsLeftInWindow = 30 - Math.floor((msSinceEpoch % 30000) / 1000);
      setSecondsLeft(secondsLeftInWindow);

      // If OTP popup is currently visible, update the code automatically to match the current window
      if (otpSent && selectedOrg) {
        setGeneratedOtp(getOtpForTimeWindow(selectedOrg, 0));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [otpSent, selectedOrg]);

  const handleSendOtp = () => {
    if (!selectedOrg) return;
    const otp = getOtpForTimeWindow(selectedOrg, 0);
    setGeneratedOtp(otp);
    setOtpSent(true);
    setShowOtpPopup(true);
    setOtpError("");
    setUserOtp("");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg) return;

    // Retrieve active OTP, and the previous two OTPs to compensate for latency
    const currentOtp = getOtpForTimeWindow(selectedOrg, 0);
    const prevOtp1 = getOtpForTimeWindow(selectedOrg, 30);
    const prevOtp2 = getOtpForTimeWindow(selectedOrg, 60);

    if (userOtp === currentOtp || userOtp === prevOtp1 || userOtp === prevOtp2) {
      setIsUnlocked(true);
      setShowOtpModal(false);
      setShowOtpPopup(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("selected_login_org", selectedOrg);
        localStorage.setItem("selected_login_tier", getSelectedOrgTier());
        localStorage.setItem("selected_login_org_id", getSelectedOrgId());
      }
    } else {
      setOtpError("Invalid OTP. Please enter the dynamic OTP generated for the organization.");
    }
  };

  return (
    <main className="min-h-screen bg-[#070b13] text-white overflow-x-hidden relative font-sans">
      {/* NAVBAR */}
      <nav className="border-b border-white/10 bg-[#070b13]/80 backdrop-blur-md sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#FF2E93] to-[#0A2540] grid place-items-center shadow-lg shadow-pink-500/20">
              <Building2 className="text-white h-5 w-5 font-bold" />
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

      {/* HERO SECTION */}
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

      {/* STATS COUNT BAR */}
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

      {/* ABOUT SECTION */}
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

      {/* DYNAMIC OTP MODAL GATE (Reddish-Pink & Navy-Blue Classic Style) */}
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
                onClick={() => { setShowOtpModal(false); setShowOtpPopup(false); }} 
                className="text-slate-400 hover:text-white transition font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Verify your organizational access. Select your organization and request a secure verification OTP.
            </p>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-[#FF2E93] uppercase tracking-wider block mb-2">
                  Select Organization
                </label>
                <select 
                  className="w-full bg-[#071321] border border-blue-900/40 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#FF2E93] cursor-pointer"
                  value={selectedOrg}
                  onChange={(e) => {
                    setSelectedOrg(e.target.value);
                    setOtpSent(false);
                    setShowOtpPopup(false);
                  }}
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.name} className="bg-[#0A2540]">{org.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleSendOtp}
                  className="w-full py-3 bg-gradient-to-r from-[#FF2E93] to-[#FF4E6B] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 hover:brightness-110 active:scale-[0.98] shadow-md shadow-pink-600/20"
                >
                  {otpSent ? "Regenerate OTP" : "Send OTP"}
                </button>
              </div>

              {otpSent && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 pt-4 border-t border-blue-900/30">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Enter Verification OTP
                      </label>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Timer className="h-3 w-3 text-[#FF2E93]" /> Code updates in {secondsLeft}s
                      </span>
                    </div>
                    <input 
                      type="text"
                      maxLength={4}
                      placeholder="e.g. 5678"
                      className="w-full bg-[#071321] border border-blue-900/40 rounded-xl px-4 py-3 text-center text-lg font-bold tracking-widest text-white outline-none focus:ring-2 focus:ring-[#FF2E93]"
                      value={userOtp}
                      onChange={(e) => {
                        setUserOtp(e.target.value.replace(/\D/g, ""));
                        setOtpError("");
                      }}
                      required
                    />
                  </div>

                  {otpError && (
                    <div className="text-xs text-rose-400 bg-rose-950/20 border border-rose-900/40 p-3 rounded-xl flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition duration-300"
                  >
                    Verify & Enter Portals
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OTP POPUP DIALOG */}
      {showOtpPopup && otpSent && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-gradient-to-br from-[#0c1b30] to-[#0d091a] border border-[#FF2E93] rounded-2xl p-5 shadow-2xl shadow-black/80 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#FF2E93]/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-[#FF2E93]" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-widest text-[#FF2E93] font-bold">
                  Dynamic OTP Simulation
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Selected Org: <span className="font-semibold text-white">{selectedOrg}</span>
                </div>
                <div className="text-xl font-extrabold text-white tracking-widest mt-2 flex items-center gap-2">
                  <span>{generatedOtp}</span>
                  <span className="text-[10px] text-slate-400 font-normal normal-case font-sans">
                    (Valid for {secondsLeft}s)
                  </span>
                </div>
                <div className="text-[9px] text-slate-400 mt-2 italic leading-relaxed">
                  * Note: Previous 2 OTP windows are accepted to safeguard against transmission delays.
                </div>
              </div>
              <button 
                onClick={() => setShowOtpPopup(false)} 
                className="text-slate-400 hover:text-white font-bold text-xs shrink-0 self-start"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#03060c] py-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6">
          <p className="mb-2">© 2026 Zenelait Infotech Private Limited Corporation. All rights reserved.</p>
          <p className="text-[10px] text-slate-600">Secure Enterprise Portal Platform — Integrated ERP & Intelligent AI Systems</p>
        </div>
      </footer>
    </main>
  );
}
