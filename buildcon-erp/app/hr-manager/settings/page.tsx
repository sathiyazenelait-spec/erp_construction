"use client";
import React, { useState } from "react";
import { 
  User, Bell, Shield, Key, Check, AlertCircle, Save 
} from "lucide-react";
import { getSession } from "@/lib/auth";

export default function HrSettingsPage() {
  const [name, setName] = useState(() => getSession()?.name || "Meenakshi Iyer");
  const [email, setEmail] = useState("meenakshi.iyer@buildcon.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    complianceAlerts: true,
    leaveRequests: true,
    payrollCycle: true,
    newApplications: false,
    whatsappAlerts: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Portal Settings</h2>
        <p className="text-xs text-slate-400">Manage your profile details, notification preferences, and system parameters.</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
          <Check className="h-4 w-4" />
          Settings updated and saved successfully.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation Sidebar inside Settings page */}
        <div className="space-y-2">
          <div className="p-4 bg-[#0F182A] border border-slate-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-lg">
                {name[0]}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{name}</h4>
                <p className="text-[10px] text-slate-400 font-medium capitalize">HR Manager</p>
              </div>
            </div>
          </div>
          <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-3 text-xs space-y-1">
            <span className="block px-3 py-2 text-slate-400 font-bold uppercase tracking-widest text-[9px]">Sections</span>
            <button className="w-full text-left px-3 py-2 rounded bg-white/5 font-semibold text-emerald-400 flex items-center gap-2">
              <User className="h-3.5 w-3.5" /> Profile Settings
            </button>
          </div>
        </div>

        {/* Configurations Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile form */}
          <form onSubmit={handleSave} className="bg-[#0F182A] border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Profile Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#111C30] border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Role Access Privilege</label>
                <input 
                  type="text" 
                  disabled 
                  value="HR Manager (Full Access)" 
                  className="w-full bg-[#111C30]/50 border border-slate-800/80 rounded px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Official Email ID</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111C30] border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Mobile Number</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#111C30] border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                />
              </div>
            </div>

            {/* Notification settings */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Alert Notification Preferences</h3>
              
              <div className="space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Compliance & Audit Warnings</span>
                    <span className="text-[10px] text-slate-400">Trigger warnings for pending labour audits or filings.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.complianceAlerts}
                    onChange={(e) => setNotifications({...notifications, complianceAlerts: e.target.checked})}
                    className="accent-emerald-500 h-4 w-4"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Leave Application Alerts</span>
                    <span className="text-[10px] text-slate-400">Get notified when engineers or office staff apply for leave.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.leaveRequests}
                    onChange={(e) => setNotifications({...notifications, leaveRequests: e.target.checked})}
                    className="accent-emerald-500 h-4 w-4"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Payroll Release Confirmation</span>
                    <span className="text-[10px] text-slate-400">Send confirmation logs on payroll process cycles.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.payrollCycle}
                    onChange={(e) => setNotifications({...notifications, payrollCycle: e.target.checked})}
                    className="accent-emerald-500 h-4 w-4"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">WhatsApp Worker Alerts</span>
                    <span className="text-[10px] text-slate-400">Ping site workers on active shifts / emergency alerts via WhatsApp.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.whatsappAlerts}
                    onChange={(e) => setNotifications({...notifications, whatsappAlerts: e.target.checked})}
                    className="accent-emerald-500 h-4 w-4"
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                className="flex items-center gap-1.5 px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
              >
                <Save className="h-4 w-4" /> Save Configuration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
