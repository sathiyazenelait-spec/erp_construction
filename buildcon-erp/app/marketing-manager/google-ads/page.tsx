"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Search, Compass, ShieldAlert } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const googleAdPerformance = [
  { campaign: "Brand Search", spend: 0.8, conversions: 350 },
  { campaign: "Residential Display", spend: 0.9, conversions: 280 },
  { campaign: "Coimbatore Local Search", spend: 0.3, conversions: 90 },
  { campaign: "Video Bumper Ads", spend: 0.2, conversions: 30 },
];

export default function GoogleAdsConsole() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">GOOGLE ADS PERFORMANCE</h2>
        <p className="text-xs text-slate-400">Track real-time search campaign metrics, search impression shares, click costs, and keyword conversion goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Google Ads Spend MTD</div>
          <div className="text-xl font-bold text-white mt-1">₹2.2 Lakhs</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Conversions Generated</div>
          <div className="text-xl font-bold text-emerald-450 text-emerald-400 mt-1">750 Leads</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Avg CTR</div>
          <div className="text-xl font-bold text-white mt-1">3.1%</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Avg Cost Per Lead (CPL)</div>
          <div className="text-xl font-bold text-purple-400 mt-1">₹293</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Campaigns Bar Chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Conversions vs Spend (in Lakhs) by Campaign</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={googleAdPerformance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="campaign" stroke="#64748B" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Bar name="Spend (₹ L)" dataKey="spend" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar name="Conversions" dataKey="conversions" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ad groups status */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Top Keywords in Focus</h3>
          <div className="space-y-4 text-xs">
            {[
              { keyword: "chennai flats purchase", searchVolume: "15k", cpc: "₹45.00", status: "Active" },
              { keyword: "best villas in coimbatore", searchVolume: "8k", cpc: "₹38.50", status: "Active" },
              { keyword: "luxury residential builders", searchVolume: "5k", cpc: "₹62.00", status: "Active" },
              { keyword: "construction project updates", searchVolume: "2k", cpc: "₹18.00", status: "Paused" }
            ].map((kw, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 rounded bg-[#0e1628] border border-slate-800">
                <div>
                  <div className="font-semibold text-slate-200">{kw.keyword}</div>
                  <div className="text-[10px] text-slate-400">CPC: {kw.cpc} • Vol: {kw.searchVolume}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                  kw.status === "Active" 
                    ? "bg-emerald-500/10 text-emerald-450 text-emerald-400 border-emerald-500/20" 
                    : "bg-rose-500/10 text-rose-455 text-rose-450 text-rose-400 border-rose-500/20"
                }`}>
                  {kw.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Adjust keyword match types", "Show google search term reports", "Calculate optimal keyword bids"]} />
    </div>
  );
}
