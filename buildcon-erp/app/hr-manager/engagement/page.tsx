"use client";
import React, { useState } from "react";
import { 
  Heart, Smile, Calendar, AlertCircle, Plus, Send, 
  MessageSquare, User, CheckCircle2, ShieldAlert
} from "lucide-react";

interface FeedbackEvent {
  id: string;
  title: string;
  type: "Townhall" | "Team Outing" | "Training" | "Celebration";
  date: string;
  location: string;
  status: "Scheduled" | "Completed";
  registered: number;
}

interface Grievance {
  id: string;
  employee: string;
  type: string;
  date: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Investigation" | "Resolved";
  summary: string;
}

export default function EngagementPage() {
  const [activeTab, setActiveTab] = useState<"survey" | "events" | "grievances">("survey");
  
  // States
  const [events, setEvents] = useState<FeedbackEvent[]>([
    { id: "EVT-01", title: "Q2 Townhall & Performance Rewards", type: "Townhall", date: "2025-06-20", location: "Main Headquarters / Zoom", status: "Scheduled", registered: 145 },
    { id: "EVT-02", title: "Annual Inter-Site Cricket Tournament", type: "Team Outing", date: "2025-07-02", location: "Decathlon Sports Arena", status: "Scheduled", registered: 85 },
    { id: "EVT-03", title: "Safety Awareness & First Aid Workshop", type: "Training", date: "2025-05-18", status: "Completed", location: "Site Office B", registered: 45 },
    { id: "EVT-04", title: "Labour Day Celebrations & Buffet", type: "Celebration", date: "2025-05-01", status: "Completed", location: "All Site Locations", registered: 420 },
  ]);

  const [grievances, setGrievances] = useState<Grievance[]>([
    { id: "GRV-302", employee: "Ramesh Pawar", type: "Site Facilities", date: "2025-06-02", priority: "High", status: "Open", summary: "Drinking water dispenser filter malfunction at site office C." },
    { id: "GRV-303", employee: "Anita Kulkarni", type: "Payroll Query", date: "2025-06-04", priority: "Medium", status: "In Investigation", summary: "Overtime allowance calculation error for May attendance." },
    { id: "GRV-304", employee: "Vikram Rathore", type: "Workplace Safety", date: "2025-05-28", priority: "High", status: "Resolved", summary: "Required urgent replacement of worn-out safety harnesses for structural workers." }
  ]);

  // Survey data
  const categories = [
    { name: "Work Environment", score: "4.3 / 5", percentage: 86 },
    { name: "Management Transparency", score: "4.0 / 5", percentage: 80 },
    { name: "Compensation & Benefits", score: "3.9 / 5", percentage: 78 },
    { name: "Career Growth", score: "4.1 / 5", percentage: 82 },
    { name: "Work-Life Balance", score: "4.4 / 5", percentage: 88 },
  ];

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Employee Engagement & Welfare</h2>
          <p className="text-xs text-slate-400">Monitor work satisfaction scores, organise employee activities, and resolve grievance requests.</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Satisfaction Survey</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Smile className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">4.2 / 5.0</span>
            <span className="text-xs font-medium text-emerald-400">Excellent</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Based on Q1 Quarterly survey</p>
        </div>

        <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Participation Rate</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Heart className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">88%</span>
            <span className="text-xs font-medium text-blue-400">High Engagement</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">190 responses received</p>
        </div>

        <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upcoming Events</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">2 Scheduled</span>
            <span className="text-xs font-medium text-indigo-400">This Month</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Townhall & Sports tournament</p>
        </div>

        <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Grievances</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">2 Open</span>
            <span className="text-xs font-medium text-rose-400">1 Urgent</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Grievance SLA target: 48h</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab("survey")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "survey"
              ? "border-emerald-500 text-white"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Satisfaction Survey
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "events"
              ? "border-emerald-500 text-white"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Engagement Events
        </button>
        <button
          onClick={() => setActiveTab("grievances")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "grievances"
              ? "border-emerald-500 text-white"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Grievance Redressal
        </button>
      </div>

      {/* Satisfaction Tab */}
      {activeTab === "survey" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Survey Scoring Breakdown</h3>
            <div className="space-y-4">
              {categories.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{cat.name}</span>
                    <span className="font-bold text-white">{cat.score}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Anonymous Sentiment Analysis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aggregated comments point towards high satisfaction with project clarity and safety equipment availability. Major room for improvement centers around remote site drinking water systems, transit scheduling for late-shift workers, and quick turnaround on PF reimbursement claims.
              </p>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-[#111C30]/50 border border-slate-850 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                Latest Survey Insight
              </div>
              <p className="text-xs italic text-slate-300">
                &ldquo;Site supervisors communicate targets clearly, but payroll inquiries take up to 4 days to resolve. Need a faster helpdesk channel.&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === "events" && (
        <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Upcoming & Recent Events</h3>
            <button className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#111C30] border border-slate-800 text-xs font-semibold text-slate-200 hover:border-slate-700 transition-colors">
              <Plus className="h-3.5 w-3.5" /> Plan Event
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {events.map((evt) => (
              <div key={evt.id} className="p-4 rounded-xl bg-[#111C30] border border-slate-800 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wide">{evt.type}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      evt.status === "Scheduled" 
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                        : "bg-slate-500/10 text-slate-400 border border-slate-700"
                    }`}>
                      {evt.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5">{evt.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Where: {evt.location}</p>
                </div>

                <div className="flex justify-between items-center border-t border-slate-800 pt-2.5">
                  <span className="text-[10px] text-slate-500">Scheduled: {evt.date}</span>
                  <span className="text-[10px] font-semibold text-white">{evt.registered} Attendees</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grievance Tab */}
      {activeTab === "grievances" && (
        <div className="bg-[#0F182A] border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Grievance logs & Redressal Desk</h3>
            <span className="text-xs text-rose-400 font-semibold">SLA Limit: 48 Hours Response</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#111C30]/50 text-slate-400 text-xs font-semibold">
                  <th className="p-4">Ticket</th>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date Logged</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-800/50">
                {grievances.map((gri) => (
                  <tr key={gri.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-medium text-emerald-400">{gri.id}</td>
                    <td className="p-4 text-white font-semibold flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-emerald-400">
                        {gri.employee[0]}
                      </div>
                      {gri.employee}
                    </td>
                    <td className="p-4 text-slate-300">{gri.type}</td>
                    <td className="p-4 text-slate-400">{gri.date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        gri.priority === "High" 
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                          : gri.priority === "Medium"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-slate-500/10 text-slate-400 border border-slate-700"
                      }`}>
                        {gri.priority}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 max-w-xs truncate">{gri.summary}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        gri.status === "Resolved"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : gri.status === "In Investigation"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {gri.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="px-2 py-1 rounded bg-[#111C30] border border-slate-800 text-[10px] font-semibold text-slate-300 hover:border-slate-700">
                        Update Ticket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
