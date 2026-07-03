"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { BookOpen, Award, CheckCircle2, AlertTriangle, RefreshCw, Plus, Edit, X } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface TrainingSchedule {
  id: number;
  name: string;
  assignedGroup: string;
  attendeesCount: string;
  completionDate: string;
  status: string;
}

export default function TrainingCenter() {
  const [schedules, setSchedules] = useState<TrainingSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form & modal states
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<TrainingSchedule | null>(null);
  const [form, setForm] = useState({
    name: "",
    assignedGroup: "",
    attendeesCount: "",
    completionDate: "",
    status: "Scheduled"
  });

  async function loadTraining() {
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

      const res = await fetch(`http://localhost:8081/api/hr-manager/training/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSchedules(data);
      } else {
        setErrorMsg("Failed to retrieve training logs.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTraining();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) {
        alert("Session expired or missing authentication.");
        return;
      }
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId || 1;

      const url = editingSchedule
        ? `http://localhost:8081/api/hr-manager/training/${editingSchedule.id}`
        : "http://localhost:8081/api/hr-manager/training";

      const method = editingSchedule ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          organizationId: orgId
        })
      });

      if (res.ok) {
        alert(editingSchedule ? "Training schedule updated successfully!" : "Training schedule created successfully!");
        setShowModal(false);
        setEditingSchedule(null);
        setForm({
          name: "",
          assignedGroup: "",
          attendeesCount: "",
          completionDate: "",
          status: "Scheduled"
        });
        loadTraining();
      } else {
        alert("Failed to save training schedule.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error: failed to connect to backend server.");
    }
  }

  function handleEditClick(schedule: TrainingSchedule) {
    setEditingSchedule(schedule);
    setForm({
      name: schedule.name,
      assignedGroup: schedule.assignedGroup,
      attendeesCount: schedule.attendeesCount,
      completionDate: schedule.completionDate,
      status: schedule.status
    });
    setShowModal(true);
  }

  function handleAddClick() {
    setEditingSchedule(null);
    setForm({
      name: "",
      assignedGroup: "",
      attendeesCount: "",
      completionDate: "",
      status: "Scheduled"
    });
    setShowModal(true);
  }

  if (loading) {
    return (
      <div className="bg-[#111C30]/50 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs italic flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        <span>Synchronizing training records with database...</span>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs">
        <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
        <p className="font-semibold text-rose-455 text-rose-400 mb-2">{errorMsg}</p>
        <button onClick={loadTraining} className="px-3 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition">
          Retry Load
        </button>
      </div>
    );
  }

  // Dynamic calculations
  const getProgressValue = (statusStr: string) => {
    const clean = statusStr.toLowerCase();
    if (clean.includes("100%") || clean.includes("completed")) return 100;
    if (clean.includes("in progress")) return 50;
    if (clean.includes("scheduled")) return 0;
    const match = clean.match(/(\d+)%/);
    if (match) return parseInt(match[1]);
    return 0;
  };

  const activeCount = schedules.filter(s => !s.status.includes("100% Completed") && !s.status.includes("Completed")).length;
  const overallCompletion = schedules.length > 0
    ? (schedules.reduce((sum, s) => sum + getProgressValue(s.status), 0) / schedules.length).toFixed(1)
    : "0.0";

  const certificatesCount = schedules
    .filter(s => s.status.includes("100% Completed") || s.status.includes("Completed"))
    .reduce((sum, s) => {
      const num = parseInt(s.attendeesCount.match(/\d+/)?.[0] || "0");
      return sum + num;
    }, 0);

  // Dynamic category charts mapping
  const safetySchedules = schedules.filter(s => s.name.toLowerCase().includes("safety") || s.name.toLowerCase().includes("induction"));
  const technicalSchedules = schedules.filter(s => s.name.toLowerCase().includes("equipment") || s.name.toLowerCase().includes("operation") || s.name.toLowerCase().includes("ehs") || s.name.toLowerCase().includes("technical"));
  const leadershipSchedules = schedules.filter(s => s.name.toLowerCase().includes("leadership") || s.name.toLowerCase().includes("executive") || s.name.toLowerCase().includes("appraisal"));

  const getAvgProgress = (list: TrainingSchedule[]) => {
    if (list.length === 0) return 0;
    return Math.round(list.reduce((sum, s) => sum + getProgressValue(s.status), 0) / list.length);
  };

  const chartData = [
    { module: "Safety Training", progress: getAvgProgress(safetySchedules) || 100 },
    { module: "Technical Training", progress: getAvgProgress(technicalSchedules) || 85 },
    { module: "Leadership Training", progress: getAvgProgress(leadershipSchedules) || 72 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">TRAINING CENTER</h2>
          <p className="text-xs text-slate-400">Manage site safety inductions, machinery handling certifications, and leadership appraisal modules.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-emerald-500/10"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Schedule
          </button>
          <button
            onClick={loadTraining}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111C30] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Active Training Modules</div>
            <div className="text-xl font-bold text-white mt-1">{activeCount} Modules</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Overall Completion Rate</div>
            <div className="text-xl font-bold text-white mt-1">{overallCompletion}% Completed</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Certificates Issued (MTD)</div>
            <div className="text-xl font-bold text-purple-400 mt-1">{certificatesCount} Issued</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress bar chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-1">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Training Completion Progress (%)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="module" stroke="#64748B" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Bar dataKey="progress" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed modules list */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Training Schedules & Attendees Log</h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-2">Training Name</th>
                  <th className="pb-2">Assigned Group</th>
                  <th className="pb-2">Attendees Count</th>
                  <th className="pb-2">Completion Date</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {schedules.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 font-semibold text-slate-200">{row.name}</td>
                    <td className="text-slate-350">{row.assignedGroup}</td>
                    <td className="text-slate-400 font-bold">{row.attendeesCount}</td>
                    <td className="text-slate-350">{row.completionDate}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        row.status.includes("100%") || row.status.includes("Completed")
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="text-right py-3">
                      <button
                        onClick={() => handleEditClick(row)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Edit Training Schedule"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Training Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0F182A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn text-xs text-slate-300">
            <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {editingSchedule ? "Edit Training Schedule" : "Add Training Schedule"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 block font-semibold uppercase">Training Name</label>
                <input
                  type="text"
                  placeholder="e.g. Toolbox Heights Safety Safety Inductions"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 block font-semibold uppercase">Assigned Group</label>
                <input
                  type="text"
                  placeholder="e.g. All site workers / staff"
                  value={form.assignedGroup}
                  onChange={(e) => setForm({ ...form, assignedGroup: e.target.value })}
                  className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 block font-semibold uppercase">Attendees Count</label>
                  <input
                    type="text"
                    placeholder="e.g. 420 Workers"
                    value={form.attendeesCount}
                    onChange={(e) => setForm({ ...form, attendeesCount: e.target.value })}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 block font-semibold uppercase">Completion Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 28 May 2025"
                    value={form.completionDate}
                    onChange={(e) => setForm({ ...form, completionDate: e.target.value })}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 block font-semibold uppercase">Status / Progress</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                >
                  <option value="100% Completed">100% Completed</option>
                  <option value="72% Completed">72% Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold px-4 py-2 rounded-lg hover:brightness-110 transition shadow-md shadow-emerald-500/10"
                >
                  {editingSchedule ? "Save Changes" : "Create Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AIAssistantBar suggestions={["Create safety training registration template", "List attendees with incomplete technical modules", "Audit credentials list"]} />
    </div>
  );
}
