"use client";
import React, { useState } from "react";
import { User, Bell, Shield, Save } from "lucide-react";

export default function ProfileSettings() {
  const [name, setName] = useState("Karthik R.");
  const [email, setEmail] = useState("cm@buildcon.com");
  const [notifications, setNotifications] = useState({ safety: true, daily: true, stock: false });
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">13. SETTINGS</h2>
        <p className="text-xs text-slate-400">Configure your construction management settings, profile rules, notification tolerances, and integrations.</p>
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
            <User className="h-4 w-4 text-amber-400" />
            Profile Settings
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-xs">
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
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-400" />
            Notification Settings
          </h3>
          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.safety}
                onChange={(e) => setNotifications((prev) => ({ ...prev, safety: e.target.checked }))}
                className="rounded border-slate-800 bg-[#0e1628] text-amber-500 focus:ring-0"
              />
              <span className="text-slate-300">Trigger immediate alerts for major site safety incidents</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.daily}
                onChange={(e) => setNotifications((prev) => ({ ...prev, daily: e.target.checked }))}
                className="rounded border-slate-800 bg-[#0e1628] text-amber-500 focus:ring-0"
              />
              <span className="text-slate-300">Send reminder emails for pending Daily Site Reports (DSR)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.stock}
                onChange={(e) => setNotifications((prev) => ({ ...prev, stock: e.target.checked }))}
                className="rounded border-slate-800 bg-[#0e1628] text-amber-500 focus:ring-0"
              />
              <span className="text-slate-300">Alert for all critical material inventory reorders</span>
            </label>
          </div>
        </div>

        {/* Rules & Roles */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-400" />
            Security & System Rules
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Security Credentials</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">Confirm Security Password</label>
              <input
                type="password"
                placeholder="••••••••"
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
