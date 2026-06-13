"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Target, Award, Users, FileText, CheckCircle2, TrendingUp } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const pipelineFunnel = [
  { stage: "Website Visitors", value: 12000, color: "#3B82F6" },
  { stage: "Leads", value: 1250, color: "#10B981" },
  { stage: "Qualified", value: 520, color: "#8B5CF6" },
  { stage: "Proposals", value: 180, color: "#F59E0B" },
  { stage: "Won", value: 42, color: "#EF4444" },
];

const pipelineValue = [
  { stage: "Qualification", value: 35.5, color: "#3B82F6" },
  { stage: "Proposal", value: 28.0, color: "#8B5CF6" },
  { stage: "Negotiation", value: 20.5, color: "#F59E0B" },
  { stage: "Closed Won", value: 14.5, color: "#10B981" },
];

const topOpportunities = [
  { name: "IT Park - Phase II", value: 22.0, stage: "Qualification" },
  { name: "Villa Community", value: 15.0, stage: "Proposal" },
  { name: "Government School", value: 6.0, stage: "Negotiation" },
  { name: "Hospital Project", value: 12.0, stage: "Proposal" },
  { name: "Commercial Tower", value: 10.5, stage: "Qualification" },
];

const salesPerformance = [
  { name: "Amit Kumar", value: 3.5, projects: 5 },
  { name: "Priya Raj", value: 2.9, projects: 3 },
  { name: "Vijay Kumar", value: 2.4, projects: 4 },
  { name: "Karthik R", value: 2.1, projects: 2 },
];

export default function SalesOpportunities() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">04. SALES & OPPORTUNITIES</h2>
        <p className="text-xs text-slate-400">Track leads, pipeline and business opportunities</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">New Leads (MTD)</div>
          <div className="text-2xl font-bold text-white mt-1">1,250</div>
          <div className="text-[10px] text-emerald-400 mt-1">↑ 18% vs last month</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Qualified Leads</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">520</div>
          <div className="text-[10px] text-slate-500 mt-1">41.6% Qualification rate</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Proposals Sent</div>
          <div className="text-2xl font-bold text-white mt-1">180</div>
          <div className="text-[10px] text-slate-500 mt-1">Avg turnaround: 3 days</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Won Projects</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">42</div>
          <div className="text-[10px] text-emerald-400 mt-1">↑ 10% vs target</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Conversion Rate</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">23.3%</div>
          <div className="text-[10px] text-emerald-400 mt-1">Target: 20.0%</div>
        </div>
      </div>

      {/* Row 2: Funnel & Pipeline Value */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lead Funnel */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Sales Pipeline (Funnel)</h3>
          <div className="space-y-3 mt-4">
            {pipelineFunnel.map((f, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>{f.stage}</span>
                  <span className="text-white font-bold">{f.value.toLocaleString()}</span>
                </div>
                <div className="h-4 bg-[#0E1726] rounded overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-500"
                    style={{
                      width: `${100 - i * 15}%`,
                      backgroundColor: f.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Pipeline Value</h3>
            <span className="text-xs text-emerald-400 font-bold">Total: ₹98.5 Cr</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineValue} margin={{ left: -20, right: 10, top: 10, bottom: 5 }}>
                <XAxis dataKey="stage" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={25}>
                  {pipelineValue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Opportunities */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-200">Top Opportunities</h3>
            <button className="text-xs text-blue-400 hover:underline">View All Opportunities</button>
          </div>
          <div className="space-y-3">
            {topOpportunities.map((op, idx) => (
              <div key={idx} className="flex justify-between items-center p-2.5 rounded bg-[#0E1726]/60 border border-slate-800/80">
                <div>
                  <div className="text-xs font-bold text-white">{op.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{op.stage}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-blue-400">₹ {op.value} Cr</div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold mt-1 inline-block">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Team Performance */}
      <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Sales Performance (This Month)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {salesPerformance.map((item, idx) => (
            <div key={idx} className="bg-[#0E1726] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-600/10 text-blue-400 font-bold text-xs flex items-center justify-center">
                  {item.name[0]}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{item.name}</div>
                  <div className="text-[10px] text-slate-500">{item.projects} Deals Closed</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-xs text-slate-400">Value Closed</div>
                <div className="text-base font-bold text-emerald-400">₹ {item.value} Cr</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AIAssistantBar suggestions={["Top leads this week", "Funnel conversion rates", "Pipeline projection", "Performance analysis"]} />
    </div>
  );
}
