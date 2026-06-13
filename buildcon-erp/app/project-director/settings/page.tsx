"use client";
import React, { useState } from "react";
import { User, Shield, Bell, Save, Check } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function Settings() {
  const [profile, setProfile] = useState({
    name: "Arvind Menon",
    email: "pd@buildcon.com",
    phone: "+91 9876543211",
    role: "Project Director",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">SETTINGS</h2>
        <p className="text-xs text-slate-400">Manage your profile, system settings and integrations</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 h-fit space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-600/90 text-white transition-all text-left">
            <User className="h-4 w-4" />
            Profile Settings
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left">
            <Shield className="h-4 w-4" />
            Security & MFA
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left">
            <Bell className="h-4 w-4" />
            Notifications
          </button>
        </div>

        {/* Profile Settings Form */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-3">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 pb-2 border-b border-slate-800">Profile Information</h3>
          <form onSubmit={handleSave} className="space-y-4 max-w-xl">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Access Role</label>
                <input
                  type="text"
                  value={profile.role}
                  disabled
                  className="w-full bg-[#0D1424] border border-slate-800/60 text-slate-500 rounded-lg px-3 py-2 text-xs outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
              >
                {saved ? (
                  <>
                    <Check className="h-4 w-4" />
                    Changes Saved!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
