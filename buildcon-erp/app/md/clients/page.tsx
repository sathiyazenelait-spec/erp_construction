"use client";
import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Star, Smile, Heart, Award, ArrowUpRight, MessageSquare } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const satisfactionTrend = [
  { m: "Jan", rating: 4.5 },
  { m: "Feb", rating: 4.6 },
  { m: "Mar", rating: 4.6 },
  { m: "Apr", rating: 4.7 },
  { m: "May", rating: 4.8 },
  { m: "Jun", rating: 4.8 },
];

const feedbackSummary = [
  { name: "Positive", value: 128, color: "#10B981" },
  { name: "Neutral", value: 12, color: "#F59E0B" },
  { name: "Negative", value: 4, color: "#EF4444" },
];

const topClients = [
  { name: "ABC Developers", value: 78.5, activeProjects: 3 },
  { name: "XYZ Constructions", value: 52.0, activeProjects: 2 },
  { name: "PQR Builders", value: 38.2, activeProjects: 1 },
  { name: "L&N Properties", value: 25.0, activeProjects: 1 },
  { name: "Individual Homeowners", value: 18.5, activeProjects: 5 },
];

const recentFeedback = [
  { text: "Excellent quality and on-time delivery. Very transparent process.", author: "ABC Developers" },
  { text: "Great communication and project management.", author: "XYZ Constructions" },
  { text: "Highly satisfied with BuildCon team.", author: "PQR Builders" },
];

export default function ClientManagement() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">05. CLIENT INSIGHTS</h2>
        <p className="text-xs text-slate-400">Understand client satisfaction and feedback</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex justify-between items-center">
          <div>
            <div className="text-xs text-slate-400">Overall Satisfaction</div>
            <div className="text-2xl font-bold text-white mt-1">4.8 / 5</div>
            <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
          <Heart className="h-8 w-8 text-red-500/20" />
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Clients</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">128</div>
          <div className="text-[10px] text-slate-500 mt-1">Active + Historical</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Repeat Clients</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">78</div>
          <div className="text-[10px] text-emerald-400 mt-1">61% Loyalty rate</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Client Retention Rate</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">85%</div>
          <div className="text-[10px] text-emerald-400 mt-1">Industry benchmark: 75%</div>
        </div>
      </div>

      {/* Row 2: Trend & Feedback Summary */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Trend */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Client Satisfaction Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={satisfactionTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis domain={[4, 5]} stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Line type="monotone" dataKey="rating" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feedback Summary */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Feedback Summary</h3>
          <div className="flex items-center justify-around h-48">
            <div className="h-32 w-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={feedbackSummary} dataKey="value" innerRadius={28} outerRadius={46} paddingAngle={2}>
                    {feedbackSummary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white">144</span>
                <span className="text-[8px] text-slate-400">Total Feedbacks</span>
              </div>
            </div>
            <div className="space-y-1.5">
              {feedbackSummary.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] text-slate-350">{item.name}</span>
                  <span className="text-[10px] font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Clients & Quotes */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Clients by Revenue */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Top Clients by Revenue</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-350">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                  <th className="py-2">Client Name</th>
                  <th className="py-2 text-right">Revenue Contributed</th>
                  <th className="py-2 text-right">Active Projects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {topClients.map((client, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/20">
                    <td className="py-2.5 font-medium text-white flex items-center gap-1.5">
                      <Smile className="h-3.5 w-3.5 text-blue-400" />
                      {client.name}
                    </td>
                    <td className="py-2.5 text-right font-bold text-emerald-400">₹ {client.value} Cr</td>
                    <td className="py-2.5 text-right text-white font-semibold">{client.activeProjects}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Client Feedback */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Recent Client Feedback</h3>
          <div className="space-y-4">
            {recentFeedback.map((feedback, idx) => (
              <div key={idx} className="p-3 bg-[#0E1726]/60 border border-slate-800/80 rounded-lg flex flex-col justify-between">
                <p className="text-xs text-slate-300 italic">"{feedback.text}"</p>
                <div className="text-[10px] text-blue-400 font-bold text-right mt-2">— {feedback.author}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["NPS score analysis", "Loyal repeat clients list", "Recent negative reviews", "Client billing statuses"]} />
    </div>
  );
}
