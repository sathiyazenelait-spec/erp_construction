"use client";
import React, { useState, useEffect } from "react";
import { UserPlus, Star, CheckSquare, AlertTriangle, RefreshCw, Plus, X } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface RecruitmentOpening {
  id: number;
  title: string;
  department: string;
  targetHires: string;
  applicationsCount: string;
  status: string;
}

export default function RecruitmentCenter() {
  const [openings, setOpenings] = useState<RecruitmentOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form and Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDept, setNewDept] = useState("Projects / Engineering");
  const [newTargetHires, setNewTargetHires] = useState("1 Position");
  const [newStatus, setNewStatus] = useState("Screening");

  async function loadRecruitment() {
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

      const res = await fetch(`https://erp-construction.onrender.com/api/hr-manager/recruitment/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOpenings(data);
      } else {
        setErrorMsg("Failed to retrieve recruitment openings.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOpening(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) {
        alert("Session expired or missing authentication.");
        return;
      }
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;
      if (!orgId) {
        alert("No organization associated with this session.");
        return;
      }

      const newOp = {
        title: newTitle,
        department: newDept,
        targetHires: newTargetHires,
        applicationsCount: "0 Applied",
        status: newStatus,
        organizationId: orgId
      };

      const res = await fetch("https://erp-construction.onrender.com/api/hr-manager/recruitment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newOp)
      });

      if (res.ok) {
        const savedOp = await res.json();
        setOpenings(prev => [...prev, savedOp]);
        setShowAddModal(false);
        setNewTitle("");
        setNewTargetHires("1 Position");
      } else {
        alert("Failed to save the job opening to the database.");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating recruitment opening.");
    }
  }

  useEffect(() => {
    loadRecruitment();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#111C30]/50 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs italic flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        <span>Synchronizing recruitment openings with database...</span>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs">
        <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
        <p className="font-semibold text-rose-400 mb-2">{errorMsg}</p>
        <button onClick={loadRecruitment} className="px-3 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition">
          Retry Load
        </button>
      </div>
    );
  }

  // Calculate stats dynamically
  let openRoles = 0;
  let totalApps = 0;
  openings.forEach(op => {
    try {
      const hires = parseInt(op.targetHires.replaceAll("[^0-9]", "").trim(), 10);
      if (!isNaN(hires)) openRoles += hires;
      else openRoles += 1;
    } catch (e) {
      openRoles += 1;
    }

    try {
      const apps = parseInt(op.applicationsCount.replaceAll("[^0-9]", "").trim(), 10);
      if (!isNaN(apps)) totalApps += apps;
    } catch (e) {}
  });

  if (openRoles === 0) openRoles = openings.length;
  if (totalApps === 0) totalApps = 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">RECRUITMENT CENTER</h2>
          <p className="text-xs text-slate-400">Manage open recruitment applications, candidate stages from screening to selected, and onboarding checklists.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-650 hover:bg-purple-600 bg-purple-600 text-white rounded-lg text-xs font-semibold shadow-md shadow-purple-500/15 transition-all duration-200"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Job Opening</span>
          </button>
          <button
            onClick={loadRecruitment}
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
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Open Positions</div>
            <div className="text-xl font-bold text-white mt-1">{openRoles} Open Roles</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Active Applications</div>
            <div className="text-xl font-bold text-white mt-1">{totalApps} Received (MTD)</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Joined This Month</div>
            <div className="text-xl font-bold text-purple-400 mt-1">{openings.filter(op => op.status.includes("Selected")).length} Onboarded</div>
          </div>
        </div>
      </div>

      {/* Hiring Table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Hiring Pipeline & Active Openings</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Job Designation</th>
                <th className="pb-2">Department</th>
                <th className="pb-2">Target Hires</th>
                <th className="pb-2">Applications</th>
                <th className="pb-2">Pipeline Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {openings.map((op) => (
                <tr key={op.id}>
                  <td className="py-3 font-semibold text-slate-200">{op.title}</td>
                  <td className="text-slate-350">{op.department}</td>
                  <td className="text-slate-400">{op.targetHires}</td>
                  <td className="text-white font-bold">{op.applicationsCount}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      op.status.includes("Selected") 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}>
                      {op.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Create job description for Site Safety Inspector", "Compare cost per hire metrics", "Draft offer letter template"]} />

      {/* ADD JOB OPENING MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-gradient-to-br from-[#111C30] via-[#0E1628] to-[#0A1120] border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-purple-400" /> Add Recruitment Opening
              </h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-slate-400 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOpening} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Job Designation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Site Supervisor"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0a1120] text-slate-100 border border-slate-850 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Department</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full bg-[#0a1120] text-slate-100 border border-slate-850 rounded-lg p-2.5 outline-none cursor-pointer"
                >
                  <option value="Projects / Engineering">Projects / Engineering</option>
                  <option value="Finance / Accounts">Finance / Accounts</option>
                  <option value="EHS / Quality">EHS / Quality</option>
                  <option value="Procurement / Purchase">Procurement / Purchase</option>
                  <option value="HR / Operations">HR / Operations</option>
                  <option value="Sales / Marketing">Sales / Marketing</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Target Hires</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2 Positions"
                    value={newTargetHires}
                    onChange={(e) => setNewTargetHires(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-850 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pipeline Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-850 rounded-lg p-2.5 outline-none cursor-pointer"
                  >
                    <option value="Screening">Screening</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Selected (Offer Sent)">Selected (Offer Sent)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-800 text-slate-300 hover:bg-slate-800 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition shadow-md shadow-purple-500/10"
                >
                  Create Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
