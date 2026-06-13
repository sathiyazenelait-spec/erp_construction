"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Calendar, UserCheck, AlertCircle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const weeklyAttendance = [
  { day: "Mon", Present: 580, Absent: 45 },
  { day: "Tue", Present: 590, Absent: 35 },
  { day: "Wed", Present: 602, Absent: 23 },
  { day: "Thu", Present: 595, Absent: 30 },
  { day: "Fri", Present: 588, Absent: 37 },
];

export default function AttendanceManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">ATTENDANCE MANAGEMENT</h2>
        <p className="text-xs text-slate-400">Track daily workforce presence logs, monitor absent rates, safety shifts checklists, and evaluate compliance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Present Today</div>
            <div className="text-xl font-bold text-white mt-1">590 / 635 Active</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-400 grid place-items-center">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Absent Count</div>
            <div className="text-xl font-bold text-rose-455 text-rose-450 text-rose-400 mt-1">35 Cases</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Approved Leaves</div>
            <div className="text-xl font-bold text-white mt-1">10 Cases</div>
          </div>
        </div>
      </div>

      {/* Weekly Attendance Bar Chart */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Weekly Present vs Absent Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyAttendance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
              <Bar name="Present" dataKey="Present" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar name="Absent" dataKey="Absent" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <AIAssistantBar suggestions={["Export weekly shift attendance sheets", "Identify highest absent site", "Verify approved leave requests log"]} />
    </div>
  );
}
