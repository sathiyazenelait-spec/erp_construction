"use client";
import React, { useState } from "react";
import { User, Bell, Shield, Save } from "lucide-react";

export default function ProfileSettings() {
  const [name, setName] = useState("Suresh Kumar");
  const [email, setEmail] = useState("fd@buildcon.com");
  const [notifications, setNotifications] = useState({ email: true, alerts: true, reports: false });
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">PROFILE SETTINGS</h2>
        <p className="text-xs text-slate-400">Manage your profile credentials, notification settings, security configurations, and active sessions.</p>
      </div>

      {success && (
        <div className="bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 p-3 rounded-lg text-xs font-semibold text-emerald-400">
          ✓ Settings and preferences saved successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Account Info */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-400" />
            Account Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-xs">
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
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Bell className="h-4 w-4 text-emerald-400" />
            Notification Preferences
          </h3>
          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications((prev) => ({ ...prev, email: e.target.checked }))}
                className="rounded border-slate-800 bg-[#0e1628] text-emerald-500 focus:ring-0"
              />
              <span className="text-slate-300">Receive Daily Ledger Summary Digests</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.alerts}
                onChange={(e) => setNotifications((prev) => ({ ...prev, alerts: e.target.checked }))}
                className="rounded border-slate-800 bg-[#0e1628] text-emerald-500 focus:ring-0"
              />
              <span className="text-slate-300">Trigger Real-time budget threshold limit warnings</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.reports}
                onChange={(e) => setNotifications((prev) => ({ ...prev, reports: e.target.checked }))}
                className="rounded border-slate-800 bg-[#0e1628] text-emerald-500 focus:ring-0"
              />
              <span className="text-slate-300">CC on all statutory submission reports approvals</span>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-400" />
            Security & Authentication
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
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
