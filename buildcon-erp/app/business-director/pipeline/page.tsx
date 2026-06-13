"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { TrendingUp, DollarSign, Award, Target } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { funnel } from "@/lib/data";

const pipelineData = [
  { name: "IT Park Project", value: 25.0, stage: "Proposal", prob: "70%" },
  { name: "Commercial Complex", value: 12.0, stage: "Negotiation", prob: "80%" },
  { name: "Apartment Project", value: 18.0, stage: "Qualification", prob: "50%" },
];

export default function SalesPipeline() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">07. SALES PIPELINE</h2>
        <p className="text-xs text-slate-400">Stages analysis, deals in pipeline, and weighted forecasts</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Pipeline</div>
          <div className="text-2xl font-bold text-white mt-1">₹ 68.5 Cr</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Weighted Value</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">₹ 28.4 Cr</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Active Deals</div>
          <div className="text-2xl font-bold text-emerald-450 text-emerald-400 mt-1">42</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Target Value</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">₹ 15.0 Cr</div>
        </div>
      </div>

      {/* Pipeline Stages Funnel */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Pipeline by Owner</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#0e1628] border border-slate-800">
              <span className="text-slate-350">Arun Kumar</span>
              <span className="text-white font-bold">₹22.5 Cr</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#0e1628] border border-slate-800">
              <span className="text-slate-350">Priya Sharma</span>
              <span className="text-white font-bold">₹18.0 Cr</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#0e1628] border border-slate-800">
              <span className="text-slate-350">Vijay Prakash</span>
              <span className="text-white font-bold">₹16.5 Cr</span>
            </div>
          </div>
        </div>

        {/* Funnel chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Pipeline Conversion</h3>
          <div className="space-y-2 text-xs">
            {funnel.map((f, i) => (
              <div key={i} className="p-2 bg-[#0e1628] rounded border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">{f.stage}</span>
                <span className="text-white font-bold font-mono">{f.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Detailed deals lists", "Conversion probabilities matrix", "Quarterly sales review"]} />
    </div>
  );
}
