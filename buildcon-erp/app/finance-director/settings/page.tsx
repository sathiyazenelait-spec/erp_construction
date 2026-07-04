"use client";
import React, { useState, useEffect } from "react";
import { User, Bell, Shield, Save } from "lucide-react";
import { getSession } from "@/lib/auth";

export default function ProfileSettings() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  // Configuration States
  const [name, setName] = useState("Suresh Kumar");
  const [email, setEmail] = useState("fd@buildcon.com");
  const [avatarInitials, setAvatarInitials] = useState("SK");
  const [sidebarMenus, setSidebarMenus] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [revenueMtd, setRevenueMtd] = useState("₹24.5 Cr");
  const [grossProfit, setGrossProfit] = useState("₹7.6 Cr");
  const [netProfit, setNetProfit] = useState("₹5.8 Cr");
  const [cashPosition, setCashPosition] = useState("₹12.1 Cr");
  const [cash30Days, setCash30Days] = useState("₹14.3 Cr");
  const [cash60Days, setCash60Days] = useState("₹16.8 Cr");

  const [notifications, setNotifications] = useState({ email: true, alerts: true, reports: false });

  useEffect(() => {
    const s = getSession();
    setSession(s);
    const orgId = s?.organizationId || 1;
    const token = typeof window !== "undefined" ? localStorage.getItem("buildcon_token") : null;
    fetch(`https://erp-construction.onrender.com/api/finance-director/dashboard/org/${orgId}`, {
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    })
      .then((res) => res.json())
      .then((d) => {
        setName(d.profileName || "Suresh Kumar");
        setEmail(d.profileEmail || "fd@buildcon.com");
        setAvatarInitials(d.avatarInitials || "SK");
        setSidebarMenus(d.sidebar_menus || "");
        setAiSuggestions(d.ai_suggestions || "");
        setRevenueMtd(d.revenue_mtd || "₹24.5 Cr");
        setGrossProfit(d.gross_profit || "₹7.6 Cr");
        setNetProfit(d.net_profit || "₹5.8 Cr");
        setCashPosition(d.cash_position || "₹12.1 Cr");
        setCash30Days(d.cash_30_days || "₹14.3 Cr");
        setCash60Days(d.cash_60_days || "₹16.8 Cr");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching FD profile configurations:", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const orgId = session?.organizationId || 1;
    const token = typeof window !== "undefined" ? localStorage.getItem("buildcon_token") : null;
    try {
      const res = await fetch("https://erp-construction.onrender.com/api/finance-director/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          username: name,
          email: email,
          avatarInitials: avatarInitials,
          organizationId: String(orgId),
          sidebar_menus: sidebarMenus,
          ai_suggestions: aiSuggestions,
          revenue_mtd: revenueMtd,
          gross_profit: grossProfit,
          net_profit: netProfit,
          cash_position: cashPosition,
          cash_30_days: cash30Days,
          cash_60_days: cash60Days,
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
        <h2 className="text-xl font-bold text-white tracking-wide font-sans">PROFILE SETTINGS</h2>
        <p className="text-xs text-slate-400">Manage profile credentials, notification settings, security configurations, and active sessions.</p>
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
            <User className="h-4 w-4 text-emerald-450 text-emerald-400" />
            Account Information
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Corporate Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Avatar Initials</label>
              <input
                type="text"
                value={avatarInitials}
                onChange={(e) => setAvatarInitials(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>
        </div>

        {/* KPI Configurations */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-400" />
            Dashboard Metric Parameters
          </h3>
          <div className="grid md:grid-cols-4 gap-4 text-xs">
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
              <label className="text-slate-400">Gross Profit Margin</label>
              <input
                type="text"
                value={grossProfit}
                onChange={(e) => setGrossProfit(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Net Profit</label>
              <input
                type="text"
                value={netProfit}
                onChange={(e) => setNetProfit(e.target.value)}
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
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Forecasted Balance (30 Days)</label>
              <input
                type="text"
                value={cash30Days}
                onChange={(e) => setCash30Days(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Forecasted Balance (60 Days)</label>
              <input
                type="text"
                value={cash60Days}
                onChange={(e) => setCash60Days(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Layout & Shell Customizations */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Bell className="h-4 w-4 text-emerald-400" />
            Shell & AI Suggestions
          </h3>
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Sidebar navigation items (split by pipe |)</label>
              <input
                type="text"
                value={sidebarMenus}
                onChange={(e) => setSidebarMenus(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">AI Assistant suggestion chips (split by pipe |)</label>
              <input
                type="text"
                value={aiSuggestions}
                onChange={(e) => setAiSuggestions(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition shadow-md shadow-emerald-500/15"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
