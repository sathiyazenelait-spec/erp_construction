"use client";
import React, { useState, useEffect } from "react";
import { User, Bell, Shield, Save } from "lucide-react";
import { getSession } from "@/lib/auth";

export default function ProfileSettings() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  // Configuration States
  const [name, setName] = useState("Karthik R.");
  const [email, setEmail] = useState("cm@buildcon.com");
  const [avatarInitials, setAvatarInitials] = useState("KR");
  const [sidebarMenus, setSidebarMenus] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [activeProjects, setActiveProjects] = useState("18");
  const [onTimeProjects, setOnTimeProjects] = useState("14");
  const [delayedProjects, setDelayedProjects] = useState("4");
  const [workforceOnsite, setWorkforceOnsite] = useState("420");
  const [safetyScore, setSafetyScore] = useState("96%");
  const [qcPassRate, setQcPassRate] = useState("98%");

  const [notifications, setNotifications] = useState({ safety: true, daily: true, stock: false });

  useEffect(() => {
    const s = getSession();
    setSession(s);
    const orgId = s?.organizationId || 1;
    const token = localStorage.getItem("buildcon_token");
    fetch(`http://localhost:8081/api/construction-manager/dashboard/org/${orgId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((d) => {
        setName(d.profileName || "Karthik R.");
        setEmail(d.profileEmail || "cm@buildcon.com");
        setAvatarInitials(d.avatarInitials || "KR");
        setSidebarMenus(d.sidebar_menus || "");
        setAiSuggestions(d.ai_suggestions || "");
        setActiveProjects(d.active_projects || "18");
        setOnTimeProjects(d.on_time_projects || "14");
        setDelayedProjects(d.delayed_projects || "4");
        setWorkforceOnsite(d.workforce_onsite || "420");
        setSafetyScore(d.safety_score || "96%");
        setQcPassRate(d.qc_pass_rate || "98%");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching CM profile configurations:", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const orgId = session?.organizationId || 1;
    const token = localStorage.getItem("buildcon_token");
    try {
      const res = await fetch("http://localhost:8081/api/construction-manager/profile/update", {
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
          active_projects: activeProjects,
          on_time_projects: onTimeProjects,
          delayed_projects: delayedProjects,
          workforce_onsite: workforceOnsite,
          safety_score: safetyScore,
          qc_pass_rate: qcPassRate,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        if (session) {
          const newSession = { ...session, name: name };
          localStorage.setItem("buildcon_session", JSON.stringify(newSession));
        }
      }
    } catch (err) {
      console.error("Error saving profile preferences:", err);
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
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide font-sans">SETTINGS</h2>
        <p className="text-xs text-slate-400">Configure construction management settings, profile rules, notification tolerances, and integrations.</p>
      </div>

      {success && (
        <div className="bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 p-3 rounded-lg text-xs font-semibold text-emerald-400">
          ✓ Preferences and account changes saved successfully in MySQL.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Account Info */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <User className="h-4 w-4 text-amber-400" />
            Profile Settings
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Avatar Initials</label>
              <input
                type="text"
                value={avatarInitials}
                onChange={(e) => setAvatarInitials(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>
        </div>

        {/* KPI Configurations */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-400" />
            Dashboard Metric Parameters
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Active Projects</label>
              <input
                type="text"
                value={activeProjects}
                onChange={(e) => setActiveProjects(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">On-Time Projects</label>
              <input
                type="text"
                value={onTimeProjects}
                onChange={(e) => setOnTimeProjects(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Delayed Projects</label>
              <input
                type="text"
                value={delayedProjects}
                onChange={(e) => setDelayedProjects(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Workforce On-Site</label>
              <input
                type="text"
                value={workforceOnsite}
                onChange={(e) => setWorkforceOnsite(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Safety Score</label>
              <input
                type="text"
                value={safetyScore}
                onChange={(e) => setSafetyScore(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">QC Pass Rate</label>
              <input
                type="text"
                value={qcPassRate}
                onChange={(e) => setQcPassRate(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Layout & Shell Customizations */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-400" />
            Shell & AI Suggestions
          </h3>
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Sidebar navigation items (split by pipe |)</label>
              <input
                type="text"
                value={sidebarMenus}
                onChange={(e) => setSidebarMenus(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">AI Assistant suggestion chips (split by pipe |)</label>
              <input
                type="text"
                value={aiSuggestions}
                onChange={(e) => setAiSuggestions(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Save changes */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition shadow-md shadow-amber-500/10"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
