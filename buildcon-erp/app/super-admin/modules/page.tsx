"use client";
import React, { useState } from "react";
import { Box, Check, X, ToggleLeft, ToggleRight, Sparkles, Sliders, Settings } from "lucide-react";

interface ERPModule {
  id: string;
  name: string;
  key: string;
  description: string;
  status: "Global Enable" | "Global Disable";
  tierRequired: "Growth" | "Premium" | "Enterprise";
  activeOrgs: number;
}

const INITIAL_MODULES: ERPModule[] = [
  { id: "mod-1", name: "Financial Command Center", key: "finance", description: "Expense tracking, balance sheets, profit forecasting, and accounts payable/receivable automation.", status: "Global Enable", tierRequired: "Premium", activeOrgs: 36 },
  { id: "mod-2", name: "Company Portfolio Tracker", key: "portfolio", description: "Multi-site construction progress visualization, budget performance, and contract value logging.", status: "Global Enable", tierRequired: "Growth", activeOrgs: 42 },
  { id: "mod-3", name: "Workforce & Payroll Analysis", key: "workforce", description: "Employee register, department structures, manager hierarchy alignment, and site timeclock reports.", status: "Global Enable", tierRequired: "Growth", activeOrgs: 40 },
  { id: "mod-4", name: "Safety & Compliance Audit", key: "safety", description: "Site incident reports, safety scorecard audits, and compliance checklist certifications.", status: "Global Enable", tierRequired: "Premium", activeOrgs: 28 },
  { id: "mod-5", name: "AI Executive Assistant Bot", key: "ai_bot", description: "Natural language query interface, automated summary generator, and contextual risk prediction model.", status: "Global Enable", tierRequired: "Enterprise", activeOrgs: 12 },
  { id: "mod-6", name: "Sales & CRM Pipeline", key: "sales", description: "Lead funnels, proposal generators, and client win/loss ratio calculators.", status: "Global Enable", tierRequired: "Premium", activeOrgs: 30 },
];

export default function ConfigureModules() {
  const [modules, setModules] = useState<ERPModule[]>(INITIAL_MODULES);

  const toggleModuleStatus = (id: string) => {
    setModules(modules.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: m.status === "Global Enable" ? "Global Disable" : "Global Enable"
        };
      }
      return m;
    }));
  };

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
