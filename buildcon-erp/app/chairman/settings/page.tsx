"use client";
import React, { useState, useEffect } from "react";
import { User, Bell, Database, Save, Check, AlertTriangle, Shield, KeyRound } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { getSession } from "@/lib/auth";

export default function Settings() {
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "notifications" | "integrations" | "org_credentials">("profile");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Profile fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarInitials, setAvatarInitials] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  // Organization credentials fields
  const [orgName, setOrgName] = useState("");
  const [orgUsername, setOrgUsername] = useState("");
  const [orgPassword, setOrgPassword] = useState("");

  // Customizations
  const [sidebarMenus, setSidebarMenus] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState("");

  // Notifications fields
  const [notifications, setNotifications] = useState({
    notifyCuringDelay: true,
    notifyBudgetDeficit: true,
    notifyMaterialDelay: true,
    notifyFrequency: "INSTANT",
  });

  const [warningsLog, setWarningsLog] = useState<any[]>([]);

  // Integrations fields
  const [integrations, setIntegrations] = useState({
    fastapiUrl: "http://localhost:8000",
    smsGatewayKey: "",
    smtpHost: "",
    smtpPort: "",
  });

  // Fetch settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        setErrorMsg(null);
        const token = localStorage.getItem("buildcon_token");
        const s = getSession();
        if (!token || !s) {
          setErrorMsg("Session expired. Please log in again.");
          setLoading(false);
          return;
        }
        const orgId = s.organizationId || 1;

        // Fetch settings from Settings Endpoint
        const settingsRes = await fetch("http://localhost:8081/api/chairman/settings", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        // Fetch configs from Dashboard Config Endpoint
        const dashboardRes = await fetch(`http://localhost:8081/api/chairman/dashboard/org/${orgId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (settingsRes.ok && dashboardRes.ok) {
          const settingsData = await settingsRes.json();
          const dashboardData = await dashboardRes.json();

          setUsername(settingsData.username || s.name || "");
          setName(settingsData.name || dashboardData.profileName || s.name || "");
          setEmail(settingsData.email || dashboardData.profileEmail || "");
          setPhone(settingsData.phone || "");

          setOrgName(settingsData.orgName || "");
          setOrgUsername(settingsData.orgUsername || "");
          setOrgPassword(settingsData.orgPassword || "");

          setAvatarInitials(dashboardData.avatarInitials || "CH");
          setSidebarMenus(dashboardData.sidebar_menus || "");
          setAiSuggestions(dashboardData.ai_suggestions || "");

          setNotifications({
            notifyCuringDelay: settingsData.notifyCuringDelay !== false,
            notifyBudgetDeficit: settingsData.notifyBudgetDeficit !== false,
            notifyMaterialDelay: settingsData.notifyMaterialDelay !== false,
            notifyFrequency: settingsData.notifyFrequency || "INSTANT",
          });
          setIntegrations({
            fastapiUrl: settingsData.fastapiUrl || "http://localhost:8000",
            smsGatewayKey: settingsData.smsGatewayKey || "",
            smtpHost: settingsData.smtpHost || "",
            smtpPort: settingsData.smtpPort !== null && settingsData.smtpPort !== undefined ? String(settingsData.smtpPort) : "",
          });

          // Fetch project alerts
          const alertsRes = await fetch(`http://localhost:8081/api/alerts/org/${orgId}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (alertsRes.ok) {
            const alertsData = await alertsRes.json();
            setWarningsLog(alertsData);
          }
        } else {
          setErrorMsg("Failed to retrieve system settings.");
        }
      } catch (err) {
        console.error("Error loading settings:", err);
        setErrorMsg("Connection failure connecting to settings API.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  // Show status toasts
  const triggerToast = (success: boolean, msg: string) => {
    if (success) {
      setSuccessMsg(msg);
      setErrorMsg(null);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(msg);
      setSuccessMsg(null);
      setTimeout(() => setErrorMsg(null), 5000);
    }
  };

  // Save Handlers
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("buildcon_token");
      const s = getSession();
      const orgId = s?.organizationId || 1;

      // 1. Save standard profile fields
      const resProfile = await fetch("http://localhost:8081/api/chairman/settings/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
        }),
      });

      // 2. Save dashboard config & initials overrides
      const resConfig = await fetch("http://localhost:8081/api/chairman/profile/update", {
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
        })
      });

      if (resProfile.ok && resConfig.ok) {
        triggerToast(true, "Profile and system configs updated successfully!");
        const sessionStr = localStorage.getItem("buildcon_session");
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          session.name = name;
          localStorage.setItem("buildcon_session", JSON.stringify(session));
          window.dispatchEvent(new Event("storage"));
        }
      } else {
        triggerToast(false, "Failed to update profile configurations.");
      }
    } catch (err) {
      triggerToast(false, "Connection error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("http://localhost:8081/api/chairman/settings/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(notifications),
      });

      const data = await res.json();
      if (res.ok) {
        triggerToast(true, "Alert & Notification rules updated successfully!");
      } else {
        triggerToast(false, data.message || "Failed to update notification rules.");
      }
    } catch (err) {
      triggerToast(false, "Connection error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveIntegrations = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("http://localhost:8081/api/chairman/settings/integrations", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(integrations),
      });

      const data = await res.json();
      if (res.ok) {
        triggerToast(true, "System API integrations updated successfully!");
      } else {
        triggerToast(false, data.message || "Failed to update API integrations.");
      }
    } catch (err) {
      triggerToast(false, "Connection error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOrgCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgUsername.trim() || !orgPassword.trim()) {
      triggerToast(false, "Username and Password cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("http://localhost:8081/api/chairman/settings/org-credentials", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          orgUsername: orgUsername.trim(),
          orgPassword: orgPassword.trim()
        }),
      });

      const data = await res.json();
      if (res.ok) {
        triggerToast(true, "Organization credentials updated successfully!");
      } else {
        triggerToast(false, data.message || "Failed to update organization credentials.");
      }
    } catch (err) {
      triggerToast(false, "Connection error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleResolveAlert = async (alertId: number) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch(`http://localhost:8081/api/alerts/${alertId}/resolve`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        setWarningsLog(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true } : a));
        const alertObj = warningsLog.find(a => a.id === alertId);
        const noticeMsg = `Chairman noticed progress warning: Project '${alertObj?.projectName || ""}' delay alert has been acknowledged and dismissed.`;
        localStorage.setItem("chairman_noticed_alert_msg", noticeMsg);
        window.dispatchEvent(new Event("storage"));
        triggerToast(true, "Alert resolved successfully!");
      } else {
        triggerToast(false, "Failed to resolve alert.");
      }
    } catch (e) {
      console.error(e);
      triggerToast(false, "Connection failure resolving alert.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">13. SETTINGS</h2>
        <p className="text-xs text-slate-400 font-sans">Manage your profile, credentials, notifications, and FastAPI/SMTP system settings</p>
      </div>

      {/* Toast Notification Panel */}
      {successMsg && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs animate-fadeIn shadow-lg shadow-emerald-900/10">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-950/80 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs animate-fadeIn shadow-lg shadow-red-900/10">
          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-10 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-xs text-slate-400">Retrieving system configuration from server...</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Settings Navigation Tabs */}
          <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4 h-fit space-y-1">
            <button
              onClick={() => setActiveSubTab("profile")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                activeSubTab === "profile"
                  ? "bg-blue-600/90 text-white shadow-md shadow-blue-500/10"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <User className="h-4 w-4 shrink-0" />
              Profile Settings
            </button>

            <button
              onClick={() => setActiveSubTab("notifications")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                activeSubTab === "notifications"
                  ? "bg-blue-600/90 text-white shadow-md shadow-blue-500/10"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Bell className="h-4 w-4 shrink-0" />
              Notifications
            </button>
            <button
              onClick={() => setActiveSubTab("integrations")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                activeSubTab === "integrations"
                  ? "bg-blue-600/90 text-white shadow-md shadow-blue-500/10"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Database className="h-4 w-4 shrink-0" />
              System Integrations
            </button>
            <button
              onClick={() => setActiveSubTab("org_credentials")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                activeSubTab === "org_credentials"
                  ? "bg-blue-600/90 text-white shadow-md shadow-blue-500/10"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <KeyRound className="h-4 w-4 shrink-0" />
              Organization Credentials
            </button>
          </div>

          {/* Form details wrapper */}
          <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5 lg:col-span-3">
            
            {/* PROFILE SETTINGS FORM */}
            {activeSubTab === "profile" && (
              <div>
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">Profile Settings</h3>
                    <p className="text-[11px] text-slate-400">Update your account information and contact particulars</p>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">ID: {username}</span>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
                  <div className="grid md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition-colors"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition-colors"
                        placeholder="chairman@buildcon.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Avatar Initials</label>
                      <input
                        type="text"
                        required
                        value={avatarInitials}
                        onChange={(e) => setAvatarInitials(e.target.value)}
                        className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition-colors"
                        placeholder="CH"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition-colors"
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Access Role</label>
                      <input
                        type="text"
                        value="Chairman"
                        disabled
                        className="w-full bg-[#0D1424] border border-slate-800/60 text-slate-500 rounded-lg px-3 py-2 text-xs outline-none cursor-not-allowed font-semibold"
                      />
                    </div>
                  </div>

                  {/* Layout Customizations */}
                  <div className="border-t border-slate-800/80 pt-4 space-y-4">
                    <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-400" />
                      Dashboard Layout & Custom Shell Settings
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-400">Sidebar navigation items (split by pipe |)</label>
                        <input
                          type="text"
                          value={sidebarMenus}
                          onChange={(e) => setSidebarMenus(e.target.value)}
                          className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400">AI Assistant suggestion chips (split by pipe |)</label>
                        <input
                          type="text"
                          value={aiSuggestions}
                          onChange={(e) => setAiSuggestions(e.target.value)}
                          className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg px-5 py-2.5 text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
                    >
                      {saving ? (
                        <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></span>
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {saving ? "Saving Changes..." : "Save Preferences"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* NOTIFICATIONS SETTINGS FORM */}
            {activeSubTab === "notifications" && (
              <div>
                <div className="mb-4 pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-semibold text-slate-200">Alerts & Notifications</h3>
                  <p className="text-[11px] text-slate-400 font-sans">Configure real-time delays triggers and digest notification settings</p>
                </div>

                <form onSubmit={handleSaveNotifications} className="space-y-6 max-w-2xl">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Live Delay Alert Triggers</h4>
                    
                    <div className="space-y-2">
                      <label className="flex items-start gap-3 bg-[#0E1726] hover:bg-[#131F33] p-3 rounded-lg border border-slate-800 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={notifications.notifyCuringDelay}
                          onChange={(e) => setNotifications({ ...notifications, notifyCuringDelay: e.target.checked })}
                          className="mt-1 h-3.5 w-3.5 rounded border-slate-800 bg-slate-900 text-blue-600 accent-blue-500 outline-none"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-200">Concrete Curing Delay Alerts</div>
                          <p className="text-[10px] text-slate-400 mt-0.5">Trigger alert if concrete curing hydration scheduling drifts from plan.</p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 bg-[#0E1726] hover:bg-[#131F33] p-3 rounded-lg border border-slate-800 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={notifications.notifyBudgetDeficit}
                          onChange={(e) => setNotifications({ ...notifications, notifyBudgetDeficit: e.target.checked })}
                          className="mt-1 h-3.5 w-3.5 rounded border-slate-800 bg-slate-900 text-blue-600 accent-blue-500 outline-none"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-200">Budget Deficit Warnings</div>
                          <p className="text-[10px] text-slate-400 mt-0.5">Trigger alert if project cost estimates or subcontractor claims exceed thresholds.</p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 bg-[#0E1726] hover:bg-[#131F33] p-3 rounded-lg border border-slate-800 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={notifications.notifyMaterialDelay}
                          onChange={(e) => setNotifications({ ...notifications, notifyMaterialDelay: e.target.checked })}
                          className="mt-1 h-3.5 w-3.5 rounded border-slate-800 bg-slate-900 text-blue-600 accent-blue-500 outline-none"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-200">Material Delivery Delays</div>
                          <p className="text-[10px] text-slate-400 mt-0.5">Trigger alerts for delayed steel, cement, or core aggregate shipments.</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/85 pt-4">
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Digest Transmission Frequency</label>
                    <select
                      value={notifications.notifyFrequency}
                      onChange={(e) => setNotifications({ ...notifications, notifyFrequency: e.target.value })}
                      className="w-full md:w-64 bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="INSTANT">Instant Real-Time Alerts</option>
                      <option value="DAILY">Daily Compiled Summary (08:00 AM)</option>
                      <option value="WEEKLY">Weekly Planning Digest (Mondays)</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg px-4 py-2 text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
                    >
                      {saving ? (
                        <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></span>
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {saving ? "Saving..." : "Save Notification Preferences"}
                    </button>
                  </div>
                </form>

                {/* Warning Notifications History Log */}
                <div className="border-t border-slate-800/80 pt-5 mt-6 space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    Received Alerts & Warnings History Log
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Historical log of AI-inspected progress alerts dispatched by the Site Engineer.
                  </p>

                  <div className="space-y-3">
                    {warningsLog.length === 0 ? (
                      <div className="text-slate-500 italic text-xs py-2">No alerts or warnings recorded in this organization.</div>
                    ) : (
                      warningsLog.map((alertItem: any) => (
                        <div key={alertItem.id} className="bg-[#0E1726]/60 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2.5 relative">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${alertItem.resolved ? "bg-slate-500" : "bg-red-500 animate-pulse"}`}></span>
                              <span className="font-bold text-xs text-slate-200">Warning: Project '{alertItem.projectName}' is lagging!</span>
                            </div>
                            <span className="text-[9px] text-slate-500 font-mono">{alertItem.alertTime ? alertItem.alertTime.replace('T', ' ').substring(0, 16) : ""}</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2.5 text-[10px] bg-[#090F1B]/40 p-2.5 rounded border border-slate-800/40 font-mono">
                            <div>
                              <span className="text-slate-500 font-semibold uppercase block text-[8px] font-sans">Expected / Actual</span>
                              <span className="text-slate-300">{alertItem.expectedProgress}% / {alertItem.actualProgress}%</span>
                            </div>
                            <div>
                              <span className="text-slate-500 font-semibold uppercase block text-[8px] font-sans">Timeline Delay</span>
                              <span className="text-amber-500 font-semibold">{alertItem.delayDays} Days</span>
                            </div>
                            <div>
                              <span className="text-slate-500 font-semibold uppercase block text-[8px] font-sans">Status</span>
                              <span className={`font-semibold ${alertItem.resolved ? "text-slate-400" : "text-red-400"}`}>
                                {alertItem.resolved ? "Acknowledged" : "Active / Unresolved"}
                              </span>
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-400 space-y-1">
                            <div><span className="font-semibold text-slate-300">Detected Issues:</span> {alertItem.detectedIssues}</div>
                            {alertItem.siteEngineerJustification && (
                              <div className="bg-slate-900/30 p-2 rounded border border-slate-800/60 text-[10px] text-emerald-300 italic">
                                &ldquo;{alertItem.siteEngineerJustification}&rdquo;
                              </div>
                            )}
                          </div>

                          {!alertItem.resolved && (
                            <div className="flex justify-end pt-1 border-t border-slate-800/50">
                              <button
                                type="button"
                                onClick={() => handleResolveAlert(alertItem.id)}
                                className="bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-500/20 px-2.5 py-1 rounded text-[9px] font-bold uppercase transition-colors"
                              >
                                Dismiss & Acknowledge
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SYSTEM INTEGRATIONS FORM */}
            {activeSubTab === "integrations" && (
              <div>
                <div className="mb-4 pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-semibold text-slate-200">System API & Server Integrations</h3>
                  <p className="text-[11px] text-slate-400 font-sans">Configure connection details for FastAPI AI Services, SMS gateways, and SMTP mail servers</p>
                </div>

                <form onSubmit={handleSaveIntegrations} className="space-y-6 max-w-2xl">
                  {/* AI & Gateways */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Endpoint Services</h4>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">FastAPI AI Services URL</label>
                        <input
                          type="url"
                          required
                          value={integrations.fastapiUrl}
                          onChange={(e) => setIntegrations({ ...integrations, fastapiUrl: e.target.value })}
                          className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 font-mono"
                          placeholder="http://localhost:8000"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">SMS Gateway API Key</label>
                        <input
                          type="password"
                          value={integrations.smsGatewayKey}
                          onChange={(e) => setIntegrations({ ...integrations, smsGatewayKey: e.target.value })}
                          className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 font-mono"
                          placeholder="SMS_SECRET_TOKEN"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mail configurations */}
                  <div className="border-t border-slate-800/80 pt-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">SMTP Mailer Settings</h4>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">SMTP Server Host</label>
                        <input
                          type="text"
                          value={integrations.smtpHost}
                          onChange={(e) => setIntegrations({ ...integrations, smtpHost: e.target.value })}
                          className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 font-mono"
                          placeholder="smtp.example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">SMTP Port</label>
                        <input
                          type="text"
                          value={integrations.smtpPort}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setIntegrations({ ...integrations, smtpPort: val });
                          }}
                          className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 font-mono"
                          placeholder="587"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg px-4 py-2 text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
                    >
                      {saving ? (
                        <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></span>
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {saving ? "Saving..." : "Save Integrations"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ORGANIZATION CREDENTIALS FORM */}
            {activeSubTab === "org_credentials" && (
              <div>
                <div className="mb-4 pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-semibold text-slate-200">Organization Login Credentials</h3>
                  <p className="text-[11px] text-slate-400 font-sans">Manage credentials used by external partners to access portals for {orgName}</p>
                </div>
                <form onSubmit={handleSaveOrgCredentials} className="space-y-6 max-w-2xl">
                  <div className="grid md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Organization Username</label>
                      <input
                        type="text"
                        required
                        value={orgUsername}
                        onChange={(e) => setOrgUsername(e.target.value)}
                        className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition-colors font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Organization Password</label>
                      <input
                        type="text"
                        required
                        value={orgPassword}
                        onChange={(e) => setOrgPassword(e.target.value)}
                        className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition-colors font-mono"
                      />
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg px-4 py-2 text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
                    >
                      {saving ? <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></span> : <Save className="h-4 w-4" />}
                      {saving ? "Saving..." : "Save Credentials"}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

      <AIAssistantBar suggestions={["Profile settings", "System preferences", "Theme customization settings", "Notification alerts settings"]} />
    </div>
  );
}
