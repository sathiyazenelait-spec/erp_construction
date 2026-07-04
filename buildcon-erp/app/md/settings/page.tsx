"use client";
import React, { useState, useEffect } from "react";
import { User, Bell, Shield, Save, Check } from "lucide-react";
import { getSession } from "@/lib/auth";

export default function Settings() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // Configuration States
  const [name, setName] = useState("Rajesh Kumar");
  const [email, setEmail] = useState("md@buildcon.com");
  const [avatarInitials, setAvatarInitials] = useState("RK");
  const [sidebarMenus, setSidebarMenus] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState("");
  
  const [revenueMtd, setRevenueMtd] = useState("₹ 24.5 Cr");
  const [netProfitMtd, setNetProfitMtd] = useState("₹ 5.8 Cr");
  const [activeProjectsCount, setActiveProjectsCount] = useState("18");
  const [leadsGenerated, setLeadsGenerated] = useState("1,250");
  const [cashPosition, setCashPosition] = useState("₹ 12.1 Cr");

  useEffect(() => {
    const s = getSession();
    setSession(s);
    const orgId = s?.organizationId || 1;
    const token = localStorage.getItem("buildcon_token");
    fetch(`https://erp-construction.onrender.com/api/md/dashboard/org/${orgId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((d) => {
        setName(d.profileName || "Rajesh Kumar");
        setEmail(d.profileEmail || "md@buildcon.com");
        setAvatarInitials(d.avatarInitials || "RK");
        setSidebarMenus(d.sidebar_menus || "");
        setAiSuggestions(d.ai_suggestions || "");
        setRevenueMtd(d.revenue_mtd || "₹ 24.5 Cr");
        setNetProfitMtd(d.net_profit_mtd || "₹ 5.8 Cr");
        setActiveProjectsCount(d.active_projects_count || "18");
        setLeadsGenerated(d.leads_generated || "1,250");
        setCashPosition(d.cash_position || "₹ 12.1 Cr");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading MD settings configurations:", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const orgId = session?.organizationId || 1;
    const token = localStorage.getItem("buildcon_token");
    try {
      const res = await fetch("https://erp-construction.onrender.com/api/md/profile/update", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username: name,
          email: email,
          avatarInitials: avatarInitials,
          organizationId: String(orgId),
          sidebar_menus: sidebarMenus,
          ai_suggestions: aiSuggestions,
          revenue_mtd: revenueMtd,
          net_profit_mtd: netProfitMtd,
          active_projects_count: activeProjectsCount,
          leads_generated: leadsGenerated,
          cash_position: cashPosition,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        if (session) {
          const newSession = { ...session, name: name };
          localStorage.setItem("buildcon_session", JSON.stringify(newSession));
        }
      }
    } catch (err) {
      console.error("Error saving MD profile preferences:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-slate-350 text-xs font-semibold bg-[#0A1120]">
        Loading settings module...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">SETTINGS</h2>
        <p className="text-xs text-slate-400 font-sans">Manage your profile, system settings, KPI metric overrides, and integrations</p>
      </div>

      {saved && (
        <div className="bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 p-3 rounded-lg text-xs font-semibold text-emerald-400">
          ✓ Changes and preferences saved successfully in MySQL.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Account Info */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <User className="h-4 w-4 text-blue-450 text-blue-400" />
            Profile Information
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Corporate Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Avatar Initials</label>
              <input
                type="text"
                value={avatarInitials}
                onChange={(e) => setAvatarInitials(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>
        </div>

        {/* KPI Parameters Override */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-400" />
            Dashboard Metric Parameters
          </h3>
          <div className="grid md:grid-cols-5 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Revenue (MTD)</label>
              <input
                type="text"
                value={revenueMtd}
                onChange={(e) => setRevenueMtd(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Net Profit (MTD)</label>
              <input
                type="text"
                value={netProfitMtd}
                onChange={(e) => setNetProfitMtd(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Active Projects</label>
              <input
                type="text"
                value={activeProjectsCount}
                onChange={(e) => setActiveProjectsCount(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Leads Generated</label>
              <input
                type="text"
                value={leadsGenerated}
                onChange={(e) => setLeadsGenerated(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Cash Position</label>
              <input
                type="text"
                value={cashPosition}
                onChange={(e) => setCashPosition(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Layout & Shell Customizations */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Bell className="h-4 w-4 text-blue-400" />
            Shell & AI Suggestions
          </h3>
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Sidebar navigation items (split by pipe |)</label>
              <input
                type="text"
                value={sidebarMenus}
                onChange={(e) => setSidebarMenus(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">AI Assistant suggestion chips (split by pipe |)</label>
              <input
                type="text"
                value={aiSuggestions}
                onChange={(e) => setAiSuggestions(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition shadow-md shadow-blue-500/15"
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved Changes
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
