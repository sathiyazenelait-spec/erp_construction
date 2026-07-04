"use client";
import React, { useState, useEffect } from "react";
import { Box, ToggleLeft, ToggleRight, Sliders } from "lucide-react";

interface ERPModule {
  id: number;
  name: string;
  key: string;
  description: string;
  status: "Global Enable" | "Global Disable";
  tierRequired: "Growth" | "Premium" | "Enterprise";
  activeOrgs: number;
}

export default function ConfigureModules() {
  const [modules, setModules] = useState<ERPModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadModules = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("buildcon_token") : null;
      const res = await fetch("https://erp-construction.onrender.com/api/super-admin/modules", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error("Failed to load global modules.");
      const json = await res.json();
      const mapped = json.map((x: any) => ({
        id: x.id,
        name: x.name,
        key: x.moduleKey,
        description: x.description,
        status: x.status,
        tierRequired: x.tierRequired,
        activeOrgs: x.activeOrgs
      }));
      setModules(mapped);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  const toggleModuleStatus = async (id: number) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("buildcon_token") : null;
      const res = await fetch(`https://erp-construction.onrender.com/api/super-admin/modules/${id}/toggle`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error("Failed to toggle module activation.");
      loadModules();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
        <p className="text-xs text-slate-400">Loading module configuration...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl text-center">
        <p className="text-sm text-red-400 font-semibold">{error}</p>
        <button
          onClick={loadModules}
          className="mt-3 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">ERP MODULE SYSTEM</h2>
        <p className="text-xs text-slate-400">Configure global activation of application features and tier eligibility matrices</p>
      </div>

      {/* Modules Table */}
      <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Sliders className="h-4 w-4 text-emerald-400" />
          Global Modules Configuration
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {modules.map((m) => (
            <div key={m.id} className="bg-[#080d18] border border-slate-800/80 p-5 rounded-xl flex flex-col justify-between hover:border-slate-700/60 transition">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Box className="h-5 w-5 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">{m.name}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    m.tierRequired === "Enterprise" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                    m.tierRequired === "Premium" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                    "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  }`}>
                    {m.tierRequired}+
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{m.description}</p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-850 text-xs">
                <span className="text-slate-500 font-medium">{m.activeOrgs} tenant organizations active</span>
                <button
                  onClick={() => toggleModuleStatus(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    m.status === "Global Enable"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                  }`}
                >
                  {m.status === "Global Enable" ? (
                    <>
                      <ToggleRight className="h-4 w-4" />
                      Active (Enabled)
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-4 w-4 text-red-400" />
                      Deactivated
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
