"use client";
import React, { useState } from "react";
import { User, Bell, Shield, Save } from "lucide-react";

export default function ProfileSettings() {
  const [name, setName] = useState("Ananya Sharma");
  const [email, setEmail] = useState("mm@buildcon.com");
  const [notifications, setNotifications] = useState({ cpl: true, daily: true, reports: false });
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">SETTINGS</h2>
        <p className="text-xs text-slate-400">Configure your marketing management console options, profile settings, and ad alert threshold levels.</p>
      </div>

      {success && (
        <div className="bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 p-3 rounded-lg text-xs font-semibold text-emerald-400">
          ✓ Preferences and account changes saved successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Account Info */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <User className="h-4 w-4 text-purple-400" />
            Profile Settings
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Bell className="h-4 w-4 text-purple-400" />
            Notification Settings
          </h3>
          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.cpl}
                onChange={(e) => setNotifications((prev) => ({ ...prev, cpl: e.target.checked }))}
                className="rounded border-slate-800 bg-[#0e1628] text-purple-500 focus:ring-0"
              />
              <span className="text-slate-300">Trigger immediate alerts for cost-per-lead (CPL) exceeding ₹400</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.daily}
                onChange={(e) => setNotifications((prev) => ({ ...prev, daily: e.target.checked }))}
                className="rounded border-slate-800 bg-[#0e1628] text-purple-500 focus:ring-0"
              />
              <span className="text-slate-300">Send daily lead capture report summaries to email</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.reports}
                onChange={(e) => setNotifications((prev) => ({ ...prev, reports: e.target.checked }))}
                className="rounded border-slate-800 bg-[#0e1628] text-purple-500 focus:ring-0"
              />
              <span className="text-slate-300">Share overall competitor SEO metrics monthly digest</span>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Shield className="h-4 w-4 text-purple-400" />
            Security & Authentication
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Security Credentials</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Confirm Security Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Save changes */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-650 to-indigo-500 bg-gradient-to-r from-purple-600 to-indigo-500 hover:brightness-110 text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition shadow-md shadow-purple-500/10"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
