"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Calendar, UserCheck, AlertCircle, AlertTriangle, RefreshCw, Plus, Edit2, X } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface AttendanceRecord {
  id: number;
  day: string;
  presentCount: number;
  absentCount: number;
  organizationId?: number;
}

interface LabourAttendance {
  id: number;
  skilledMasons: number;
  carpenters: number;
  generalLabor: number;
  date: string;
  organizationId?: number;
  subcontractorId?: number;
}

export default function AttendanceManagement() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [labourRecords, setLabourRecords] = useState<LabourAttendance[]>([]);
  const [activeTab, setActiveTab] = useState<"staff" | "labour">("staff");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals state
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showLabourModal, setShowLabourModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<AttendanceRecord | null>(null);
  const [editingLabour, setEditingLabour] = useState<LabourAttendance | null>(null);

  // Forms state
  const [staffForm, setStaffForm] = useState({
    day: "",
    presentCount: 0,
    absentCount: 0
  });

  const [labourForm, setLabourForm] = useState({
    date: "",
    skilledMasons: 0,
    carpenters: 0,
    generalLabor: 0
  });

  async function loadAttendance() {
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

      // Fetch Staff records
      const staffRes = await fetch(`http://localhost:8081/api/hr-manager/attendance/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      // Fetch Labour records
      const labourRes = await fetch(`http://localhost:8081/api/hr-manager/labour-attendance/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (staffRes.ok && labourRes.ok) {
        const staffData = await staffRes.json();
        const labourData = await labourRes.json();
        setRecords(staffData);
        setLabourRecords(labourData);
      } else {
        setErrorMsg("Failed to retrieve attendance logs.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAttendance();
  }, []);

  const openStaffModal = (record: AttendanceRecord | null = null) => {
    if (record) {
      setEditingStaff(record);
      setStaffForm({
        day: record.day,
        presentCount: record.presentCount,
        absentCount: record.absentCount
      });
    } else {
      setEditingStaff(null);
      setStaffForm({
        day: "",
        presentCount: 0,
        absentCount: 0
      });
    }
    setShowStaffModal(true);
  };

  const openLabourModal = (record: LabourAttendance | null = null) => {
    if (record) {
      setEditingLabour(record);
      setLabourForm({
        date: record.date,
        skilledMasons: record.skilledMasons,
        carpenters: record.carpenters,
        generalLabor: record.generalLabor
      });
    } else {
      setEditingLabour(null);
      setLabourForm({
        date: "",
        skilledMasons: 0,
        carpenters: 0,
        generalLabor: 0
      });
    }
    setShowLabourModal(true);
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) return;
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;

      const payload = {
        ...staffForm,
        organizationId: orgId
      };

      let url = "http://localhost:8081/api/hr-manager/attendance";
      let method = "POST";
      if (editingStaff) {
        url = `http://localhost:8081/api/hr-manager/attendance/${editingStaff.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        loadAttendance();
        setShowStaffModal(false);
      } else {
        alert("Failed to save staff attendance.");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting server.");
    }
  };

  const handleLabourSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) return;
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;

      const payload = {
        ...labourForm,
        organizationId: orgId
      };

      let url = "http://localhost:8081/api/hr-manager/labour-attendance";
      let method = "POST";
      if (editingLabour) {
        url = `http://localhost:8081/api/hr-manager/labour-attendance/${editingLabour.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        loadAttendance();
        setShowLabourModal(false);
      } else {
        alert("Failed to save labour attendance.");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting server.");
    }
  };

  // Staff summary calculations
  const lastStaffRecord = records[records.length - 1];
  const presentTodayStaff = lastStaffRecord ? lastStaffRecord.presentCount : 590;
  const absentTodayStaff = lastStaffRecord ? lastStaffRecord.absentCount : 35;

  // Labour summary calculations
  const lastLabourRecord = labourRecords[labourRecords.length - 1];
  const masonsToday = lastLabourRecord ? lastLabourRecord.skilledMasons : 25;
  const carpentersToday = lastLabourRecord ? lastLabourRecord.carpenters : 15;
  const generalLaborToday = lastLabourRecord ? lastLabourRecord.generalLabor : 42;
  const totalLabourToday = masonsToday + carpentersToday + generalLaborToday;

  const staffChartData = records.map(r => ({
    day: r.day,
    Present: r.presentCount,
    Absent: r.absentCount
  }));

  const labourChartData = labourRecords.map(r => ({
    day: r.date,
    masons: r.skilledMasons,
    carpenters: r.carpenters,
    generalLabor: r.generalLabor
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">ATTENDANCE MANAGEMENT</h2>
          <p className="text-xs text-slate-400">Track daily workforce presence logs, monitor absent rates, safety shifts checklists, and evaluate compliance.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadAttendance}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111C30] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-800 pb-px">
        <button
          onClick={() => setActiveTab("staff")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "staff"
              ? "text-emerald-400 border-emerald-400"
              : "text-slate-400 border-transparent hover:text-slate-200"
          }`}
        >
          Staff & Managers
        </button>
        <button
          onClick={() => setActiveTab("labour")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "labour"
              ? "text-emerald-400 border-emerald-400"
              : "text-slate-400 border-transparent hover:text-slate-200"
          }`}
        >
          Labour Workforce
        </button>
      </div>

      {/* Staff & Manager Dashboard View */}
      {activeTab === "staff" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Present Today</div>
                <div className="text-xl font-bold text-white mt-1">{presentTodayStaff} / {presentTodayStaff + absentTodayStaff} Active</div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-400 grid place-items-center">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Absent Count</div>
                <div className="text-xl font-bold text-rose-400 mt-1">{absentTodayStaff} Cases</div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Approved Leaves</div>
                <div className="text-xl font-bold text-white mt-1">{records.reduce((acc, r) => acc + (r.absentCount > 0 ? 1 : 0), 0)} Cases</div>
              </div>
            </div>
          </div>

          {/* Table & Chart layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Weekly Present vs Absent Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={staffChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-200">Daily Logs</h3>
                  <button
                    onClick={() => openStaffModal()}
                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold transition"
                  >
                    <Plus className="h-3 w-3" /> Add Log
                  </button>
                </div>
                <div className="space-y-3 overflow-y-auto max-h-64 pr-1 text-xs">
                  {records.map((rec) => (
                    <div key={rec.id} className="flex items-center justify-between p-3 bg-slate-900/40 border border-slate-800/80 rounded-lg">
                      <div>
                        <span className="font-bold text-slate-200 block">{rec.day}</span>
                        <span className="text-slate-400">Present: <strong className="text-emerald-400 font-semibold">{rec.presentCount}</strong> | Absent: <strong className="text-rose-400 font-semibold">{rec.absentCount}</strong></span>
                      </div>
                      <button
                        onClick={() => openStaffModal(rec)}
                        className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded transition"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {records.length === 0 && (
                    <p className="text-slate-500 italic text-center py-6">No staff attendance logs found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Labour Workforce View */}
      {activeTab === "labour" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Total Labour Present</div>
                <div className="text-xl font-bold text-white mt-1">{totalLabourToday} active on-site</div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Skilled Masons</div>
                <div className="text-xl font-bold text-white mt-1">{masonsToday} masons</div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 text-yellow-400 grid place-items-center">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Carpenters & Labourers</div>
                <div className="text-xl font-bold text-white mt-1">{carpentersToday} carp / {generalLaborToday} gen</div>
              </div>
            </div>
          </div>

          {/* Table & Chart layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#111C30] border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Weekly Labour Strength Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={labourChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
                    <Bar name="Masons" dataKey="masons" fill="#3B82F6" stackId="a" />
                    <Bar name="Carpenters" dataKey="carpenters" fill="#F59E0B" stackId="a" />
                    <Bar name="General Labor" dataKey="generalLabor" fill="#8B5CF6" stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-200">Labour Daily Logs</h3>
                  <button
                    onClick={() => openLabourModal()}
                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold transition"
                  >
                    <Plus className="h-3 w-3" /> Add Log
                  </button>
                </div>
                <div className="space-y-3 overflow-y-auto max-h-64 pr-1 text-xs">
                  {labourRecords.map((rec) => (
                    <div key={rec.id} className="flex items-center justify-between p-3 bg-slate-900/40 border border-slate-800/80 rounded-lg">
                      <div>
                        <span className="font-bold text-slate-200 block">{rec.date}</span>
                        <span className="text-slate-400">
                          Masons: <strong className="text-blue-400 font-semibold">{rec.skilledMasons}</strong> | 
                          Carpenters: <strong className="text-yellow-400 font-semibold">{rec.carpenters}</strong> | 
                          Gen: <strong className="text-purple-400 font-semibold">{rec.generalLabor}</strong>
                        </span>
                      </div>
                      <button
                        onClick={() => openLabourModal(rec)}
                        className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded transition"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {labourRecords.length === 0 && (
                    <p className="text-slate-500 italic text-center py-6">No labour attendance logs found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Staff modal dialog */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#111C30] border border-slate-800 rounded-xl p-6 relative shadow-2xl">
            <button
              onClick={() => setShowStaffModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-base font-bold text-white mb-4">
              {editingStaff ? "Edit Staff Attendance Record" : "Add Staff Attendance Record"}
            </h3>
            <form onSubmit={handleStaffSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">Day / Date of Month</label>
                <input
                  type="text"
                  placeholder="e.g., 15 Jun or 2025-06-15"
                  value={staffForm.day}
                  onChange={(e) => setStaffForm({ ...staffForm, day: e.target.value })}
                  className="w-full bg-[#0A1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5">Present Count</label>
                  <input
                    type="number"
                    min="0"
                    value={staffForm.presentCount}
                    onChange={(e) => setStaffForm({ ...staffForm, presentCount: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#0A1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5">Absent Count</label>
                  <input
                    type="number"
                    min="0"
                    value={staffForm.absentCount}
                    onChange={(e) => setStaffForm({ ...staffForm, absentCount: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#0A1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold rounded-lg transition"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Labour modal dialog */}
      {showLabourModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#111C30] border border-slate-800 rounded-xl p-6 relative shadow-2xl">
            <button
              onClick={() => setShowLabourModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-base font-bold text-white mb-4">
              {editingLabour ? "Edit Labour Attendance Record" : "Add Labour Attendance Record"}
            </h3>
            <form onSubmit={handleLabourSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">Day / Date of Month</label>
                <input
                  type="text"
                  placeholder="e.g., 15 Jun or 2025-06-15"
                  value={labourForm.date}
                  onChange={(e) => setLabourForm({ ...labourForm, date: e.target.value })}
                  className="w-full bg-[#0A1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5">Masons</label>
                  <input
                    type="number"
                    min="0"
                    value={labourForm.skilledMasons}
                    onChange={(e) => setLabourForm({ ...labourForm, skilledMasons: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#0A1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5">Carpenters</label>
                  <input
                    type="number"
                    min="0"
                    value={labourForm.carpenters}
                    onChange={(e) => setLabourForm({ ...labourForm, carpenters: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#0A1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5">Gen Labor</label>
                  <input
                    type="number"
                    min="0"
                    value={labourForm.generalLabor}
                    onChange={(e) => setLabourForm({ ...labourForm, generalLabor: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#0A1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLabourModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold rounded-lg transition"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AIAssistantBar suggestions={["Export weekly shift attendance sheets", "Identify highest absent site", "Verify approved leave requests log"]} />
    </div>
  );
}
