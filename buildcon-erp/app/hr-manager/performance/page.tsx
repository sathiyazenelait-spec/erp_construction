"use client";
import React, { useState, useEffect } from "react";
import { Award, Zap, AlertTriangle, RefreshCw, Plus, Edit, X } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface Appraisal {
  id: number;
  employeeName: string;
  role: string;
  department: string;
  selfRating: string;
  managerRating: string;
  category: string;
}

export default function PerformanceManagement() {
  const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form & modal state
  const [showModal, setShowModal] = useState(false);
  const [editingAppraisal, setEditingAppraisal] = useState<Appraisal | null>(null);
  const [form, setForm] = useState({
    employeeName: "",
    role: "",
    department: "",
    selfRating: "4.0",
    managerRating: "4.0",
    category: "Strong Performer"
  });

  async function loadPerformance() {
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

      const res = await fetch(`https://erp-construction.onrender.com/api/hr-manager/performance/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAppraisals(data);
      } else {
        setErrorMsg("Failed to retrieve performance appraisals.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPerformance();
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

      const url = editingAppraisal
        ? `https://erp-construction.onrender.com/api/hr-manager/performance/${editingAppraisal.id}`
        : "https://erp-construction.onrender.com/api/hr-manager/performance";

      const method = editingAppraisal ? "PUT" : "POST";

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
        alert(editingAppraisal ? "Appraisal updated successfully!" : "Appraisal created successfully!");
        setShowModal(false);
        setEditingAppraisal(null);
        setForm({
          employeeName: "",
          role: "",
          department: "",
          selfRating: "4.0",
          managerRating: "4.0",
          category: "Strong Performer"
        });
        loadPerformance();
      } else {
        alert("Failed to save performance appraisal.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error: failed to connect to backend server.");
    }
  }

  function handleEditClick(appraisal: Appraisal) {
    setEditingAppraisal(appraisal);
    setForm({
      employeeName: appraisal.employeeName,
      role: appraisal.role,
      department: appraisal.department,
      selfRating: appraisal.selfRating,
      managerRating: appraisal.managerRating,
      category: appraisal.category
    });
    setShowModal(true);
  }

  function handleAddClick() {
    setEditingAppraisal(null);
    setForm({
      employeeName: "",
      role: "",
      department: "",
      selfRating: "4.0",
      managerRating: "4.0",
      category: "Strong Performer"
    });
    setShowModal(true);
  }

  if (loading) {
    return (
      <div className="bg-[#111C30]/50 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs italic flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        <span>Synchronizing appraisal ratings with database...</span>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs">
        <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
        <p className="font-semibold text-rose-455 text-rose-400 mb-2">{errorMsg}</p>
        <button onClick={loadPerformance} className="px-3 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition">
          Retry Load
        </button>
      </div>
    );
  }

  const topPerformersCount = appraisals.filter(ap => ap.category.includes("Top") || ap.category.includes("Strong")).length;
  const pipCount = appraisals.filter(ap => ap.category.includes("Improvement") || ap.category.includes("PIP")).length;
  const averageRating = appraisals.length > 0
    ? (appraisals.reduce((sum, ap) => sum + parseFloat(ap.managerRating || "0"), 0) / appraisals.length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">PERFORMANCE MANAGEMENT</h2>
          <p className="text-xs text-slate-400">Review employee appraisal ratings, performance metrics feedback, top achievers, and career improvement roadmaps.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-emerald-500/10"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Appraisal
          </button>
          <button
            onClick={loadPerformance}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111C30] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Top Performers (Achievers)</div>
            <div className="text-xl font-bold text-white mt-1">{topPerformersCount} Evaluated</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-455 text-rose-450 text-rose-400 grid place-items-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Needs Improvement (PIP)</div>
            <div className="text-xl font-bold text-rose-400 mt-1">{pipCount} Evaluated</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Average Appraisals Score</div>
            <div className="text-xl font-bold text-white mt-1">{averageRating} / 5.0</div>
          </div>
        </div>
      </div>

      {/* Performers Details */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Employee Appraisal & Ratings Ledger</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Employee Name</th>
                <th className="pb-2">Role / Title</th>
                <th className="pb-2">Department</th>
                <th className="pb-2">Self Rating</th>
                <th className="pb-2">Manager Rating</th>
                <th className="pb-2">Appraisal Category</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {appraisals.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 font-semibold text-slate-200">{row.employeeName}</td>
                  <td className="text-slate-350">{row.role}</td>
                  <td className="text-slate-400">{row.department}</td>
                  <td className="text-slate-350 font-mono">{row.selfRating}</td>
                  <td className="text-white font-mono font-bold">{row.managerRating}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      row.category.includes("Top") 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : row.category.includes("Needs") || row.category.includes("Improvement")
                        ? "bg-rose-500/10 text-rose-455 text-rose-450 text-rose-400 border-rose-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}>
                      {row.category}
                    </span>
                  </td>
                  <td className="text-right py-3">
                    <button
                      onClick={() => handleEditClick(row)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Edit Appraisal"
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

      {/* Add / Edit Appraisal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0F182A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn text-xs text-slate-300">
            <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {editingAppraisal ? "Edit Appraisal" : "Add Performance Appraisal"}
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
                <label className="text-[10px] text-slate-400 block font-semibold uppercase">Employee Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={form.employeeName}
                  onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
                  className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 block font-semibold uppercase">Role / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Civil Engineer"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 block font-semibold uppercase">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Projects"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 block font-semibold uppercase">Self Rating (out of 5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    placeholder="4.0"
                    value={form.selfRating}
                    onChange={(e) => setForm({ ...form, selfRating: e.target.value })}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 block font-semibold uppercase">Manager Rating (out of 5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    placeholder="4.0"
                    value={form.managerRating}
                    onChange={(e) => setForm({ ...form, managerRating: e.target.value })}
                    className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 block font-semibold uppercase">Appraisal Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-[#0a1120] text-slate-100 border border-slate-800 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                >
                  <option value="Top Performer">Top Performer</option>
                  <option value="Strong Performer">Strong Performer</option>
                  <option value="Average Performer">Average Performer</option>
                  <option value="Needs Improvement">Needs Improvement</option>
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
                  {editingAppraisal ? "Save Changes" : "Create Appraisal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AIAssistantBar suggestions={["Suggest PIP roadmap template", "List top performers with pending appraisal reviews", "Export evaluations log"]} />
    </div>
  );
}
