"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Users, Hammer, Users2, AlertTriangle, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface HeadcountItem {
  group: string;
  count: number;
}

interface WorkforceStats {
  staffHeadcount: number;
  siteWorkers: number;
  totalWorkforce: number;
  headcountData: HeadcountItem[];
}

export default function WorkforceOverview() {
  const [stats, setStats] = useState<WorkforceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function loadWorkforce() {
    try {
      setLoading(true);
      setErrorMsg(null);
      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) {
        setErrorMsg("Session expired or missing authentication.");
        setLoading(false);
        return;
      }
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;
      if (!orgId) {
        setErrorMsg("No organization associated with this session.");
        setLoading(false);
        return;
      }

      const res = await fetch(`https://erp-construction.onrender.com/api/hr-manager/workforce/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        setErrorMsg("Failed to retrieve workforce metrics.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkforce();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#111C30]/50 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs italic flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        <span>Synchronizing workforce metrics with database...</span>
      </div>
    );
  }

  if (errorMsg || !stats) {
    return (
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs">
        <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
        <p className="font-semibold text-rose-400 mb-2">{errorMsg || "Unable to load workforce stats."}</p>
        <button onClick={loadWorkforce} className="px-3 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition">
          Retry Load
        </button>
      </div>
    );
  }

  const headcountData = stats.headcountData || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">WORKFORCE OVERVIEW</h2>
          <p className="text-xs text-slate-400">Detailed overview of company headcount, active project roles, staff distributions, and site labor forces.</p>
        </div>
        <button
          onClick={loadWorkforce}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111C30] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Total Staff Headcount</div>
            <div className="text-xl font-bold text-white mt-1">{stats.staffHeadcount} Staff</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Hammer className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Active Workers On-Site</div>
            <div className="text-xl font-bold text-white mt-1">{stats.siteWorkers} Workers</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <Users2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Total Managed Workforce</div>
            <div className="text-xl font-bold text-purple-400 mt-1">{stats.totalWorkforce} Total</div>
          </div>
        </div>
      </div>

      {/* Headcount Bar Chart */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Workforce Headcount Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={headcountData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="group" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
              <Bar name="Headcount" dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <AIAssistantBar suggestions={["Export complete staff listing", "Filter workforce by Chennai site", "Check supervisor allocations"]} />
    </div>
  );
}
