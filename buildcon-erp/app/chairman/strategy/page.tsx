"use client";
import React, { useState, useEffect } from "react";
import { Target, TrendingUp, ShieldAlert, Award, ArrowUpRight, BarChart2, Plus, X, Pencil, Trash2 } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface StrategicGoal {
  id?: number;
  name: string;
  target: string;
  progress: number;
  color: string;
  organizationId?: number;
}

interface SwotItem {
  id?: number;
  type: "STRENGTH" | "WEAKNESS" | "OPPORTUNITY" | "THREAT";
  value: string;
  organizationId?: number;
}

interface StrategicInitiative {
  id?: number;
  name: string;
  owner: string;
  timeline: string;
  progress: number;
  status: string;
  organizationId?: number;
}

export default function StrategicPlanning() {
  const [goals, setGoals] = useState<StrategicGoal[]>([]);
  const [swotItems, setSwotItems] = useState<SwotItem[]>([]);
  const [initiatives, setInitiatives] = useState<StrategicInitiative[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth / session states
  const [orgId, setOrgId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Modal & form states for Goals
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StrategicGoal | null>(null);
  const [goalForm, setGoalForm] = useState({
    name: "",
    target: "",
    progress: 0,
    color: "bg-blue-500",
  });

  // Inline SWOT input states
  const [activeSwotInputType, setActiveSwotInputType] = useState<string | null>(null);
  const [newSwotValue, setNewSwotValue] = useState("");

  // Modal & form states for Initiatives
  const [showInitiativeModal, setShowInitiativeModal] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState<StrategicInitiative | null>(null);
  const [initiativeForm, setInitiativeForm] = useState({
    name: "",
    owner: "",
    timeline: "",
    progress: 0,
    status: "On Track",
  });

  // Resolve session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionStr = localStorage.getItem("buildcon_session");
      const storedToken = localStorage.getItem("buildcon_token");
      if (sessionStr && storedToken) {
        const session = JSON.parse(sessionStr);
        setOrgId(session.organizationId || 1);
        setToken(storedToken);
      } else {
        setLoading(false);
      }
    }
  }, []);

  // Fetch all strategy data once session is ready
  useEffect(() => {
    if (orgId && token) {
      fetchData();
    }
  }, [orgId, token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Goals
      const goalsRes = await fetch(`https://erp-construction.onrender.com/api/chairman/strategy/goals/${orgId}`, { headers });
      const goalsData = await goalsRes.json();
      setGoals(goalsData);

      // Fetch SWOT
      const swotRes = await fetch(`https://erp-construction.onrender.com/api/chairman/strategy/swot/${orgId}`, { headers });
      const swotData = await swotRes.json();
      setSwotItems(swotData);

      // Fetch Initiatives
      const initRes = await fetch(`https://erp-construction.onrender.com/api/chairman/strategy/initiatives/${orgId}`, { headers });
      const initData = await initRes.json();
      setInitiatives(initData);
    } catch (e) {
      console.error("Error fetching strategy data", e);
    } finally {
      setLoading(false);
    }
  };

  // --- GOAL ACTIONS ---
  const openGoalModal = (goal: StrategicGoal | null = null) => {
    if (goal) {
      setEditingGoal(goal);
      setGoalForm({
        name: goal.name,
        target: goal.target,
        progress: goal.progress,
        color: goal.color,
      });
    } else {
      setEditingGoal(null);
      setGoalForm({
        name: "",
        target: "",
        progress: 0,
        color: "bg-blue-500",
      });
    }
    setShowGoalModal(true);
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalForm.name || !orgId || !token) return;

    try {
      const url = editingGoal 
        ? `https://erp-construction.onrender.com/api/chairman/strategy/goals/${editingGoal.id}`
        : `https://erp-construction.onrender.com/api/chairman/strategy/goals`;
      
      const method = editingGoal ? "PUT" : "POST";
      
      const payload = editingGoal 
        ? { ...editingGoal, ...goalForm }
        : { ...goalForm, organizationId: orgId };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowGoalModal(false);
        fetchData();
      } else {
        alert("Failed to save goal");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    if (!confirm("Are you sure you want to delete this goal?") || !token) return;
    try {
      const res = await fetch(`https://erp-construction.onrender.com/api/chairman/strategy/goals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- SWOT ACTIONS ---
  const handleAddSwotItem = async (type: "STRENGTH" | "WEAKNESS" | "OPPORTUNITY" | "THREAT") => {
    if (!newSwotValue.trim() || !orgId || !token) return;

    try {
      const res = await fetch(`https://erp-construction.onrender.com/api/chairman/strategy/swot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          value: newSwotValue.trim(),
          organizationId: orgId,
        }),
      });

      if (res.ok) {
        setNewSwotValue("");
        setActiveSwotInputType(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSwotItem = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`https://erp-construction.onrender.com/api/chairman/strategy/swot/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- INITIATIVE ACTIONS ---
  const openInitiativeModal = (init: StrategicInitiative | null = null) => {
    if (init) {
      setEditingInitiative(init);
      setInitiativeForm({
        name: init.name,
        owner: init.owner,
        timeline: init.timeline,
        progress: init.progress,
        status: init.status,
      });
    } else {
      setEditingInitiative(null);
      setInitiativeForm({
        name: "",
        owner: "",
        timeline: "",
        progress: 0,
        status: "On Track",
      });
    }
    setShowInitiativeModal(true);
  };

  const handleSaveInitiative = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initiativeForm.name || !orgId || !token) return;

    try {
      const url = editingInitiative
        ? `https://erp-construction.onrender.com/api/chairman/strategy/initiatives/${editingInitiative.id}`
        : `https://erp-construction.onrender.com/api/chairman/strategy/initiatives`;

      const method = editingInitiative ? "PUT" : "POST";

      const payload = editingInitiative
        ? { ...editingInitiative, ...initiativeForm }
        : { ...initiativeForm, organizationId: orgId };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowInitiativeModal(false);
        fetchData();
      } else {
        alert("Failed to save initiative");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInitiative = async (id: number) => {
    if (!confirm("Are you sure you want to delete this initiative?") || !token) return;
    try {
      const res = await fetch(`https://erp-construction.onrender.com/api/chairman/strategy/initiatives/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400 text-sm">
        Loading strategy matrix...
      </div>
    );
  }

  // Filter SWOT categories
  const filterSwot = (type: "STRENGTH" | "WEAKNESS" | "OPPORTUNITY" | "THREAT") => {
    return swotItems.filter((item) => item.type === type);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">11. STRATEGIC PLANNING</h2>
          <p className="text-xs text-slate-400">Plan, track and execute strategy goals</p>
        </div>
      </div>

      {/* Row 1: SWOT and Goals */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Goals */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5 lg:col-span-2 space-y-4 relative">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-200">Strategic Goals (2025-2026)</h3>
            <button 
              onClick={() => openGoalModal(null)}
              className="flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Plus className="h-3 w-3" /> Add Goal
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {goals.map((g, idx) => (
              <div key={g.id || idx} className="p-4 bg-[#0E1726]/60 border border-slate-800/80 rounded-lg space-y-3 relative group">
                {/* Edit & Delete hover controls */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity duration-200">
                  <button onClick={() => openGoalModal(g)} className="text-slate-400 hover:text-white">
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button onClick={() => g.id && handleDeleteGoal(g.id)} className="text-slate-400 hover:text-red-400">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>

                <div className="flex justify-between items-start pr-12">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Goal #{idx+1}</div>
                    <div className="text-xs font-bold text-white mt-0.5">{g.name}</div>
                  </div>
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-bold">{g.target}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>Progress</span>
                    <span className="text-white">{g.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-850 rounded overflow-hidden">
                    <div className={`h-full rounded ${g.color || "bg-blue-500"}`} style={{ width: `${g.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SWOT Analysis */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-200">SWOT Analysis</h3>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            
            {/* Strengths */}
            <div className="p-2.5 rounded bg-[#0f1d18]/40 border border-emerald-900/30 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-400 uppercase tracking-wide">Strengths</span>
                  <button onClick={() => setActiveSwotInputType(activeSwotInputType === "STRENGTH" ? null : "STRENGTH")} className="text-emerald-400 hover:text-white">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                {activeSwotInputType === "STRENGTH" && (
                  <div className="flex gap-1 mt-1">
                    <input 
                      type="text" 
                      placeholder="Add strength" 
                      value={newSwotValue} 
                      onChange={(e) => setNewSwotValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSwotItem("STRENGTH")}
                      className="bg-slate-900 border border-slate-700 text-white text-[9px] rounded px-1 py-0.5 w-full focus:outline-none"
                    />
                  </div>
                )}
                <ul className="list-inside text-slate-350 mt-1 space-y-1">
                  {filterSwot("STRENGTH").map((item) => (
                    <li key={item.id} className="flex justify-between items-center gap-1 group">
                      <span className="truncate">• {item.value}</span>
                      <button onClick={() => item.id && handleDeleteSwotItem(item.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Weaknesses */}
            <div className="p-2.5 rounded bg-[#200f12]/40 border border-red-900/30 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-red-400 uppercase tracking-wide">Weaknesses</span>
                  <button onClick={() => setActiveSwotInputType(activeSwotInputType === "WEAKNESS" ? null : "WEAKNESS")} className="text-red-400 hover:text-white">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                {activeSwotInputType === "WEAKNESS" && (
                  <div className="flex gap-1 mt-1">
                    <input 
                      type="text" 
                      placeholder="Add weakness" 
                      value={newSwotValue} 
                      onChange={(e) => setNewSwotValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSwotItem("WEAKNESS")}
                      className="bg-slate-900 border border-slate-700 text-white text-[9px] rounded px-1 py-0.5 w-full focus:outline-none"
                    />
                  </div>
                )}
                <ul className="list-inside text-slate-350 mt-1 space-y-1">
                  {filterSwot("WEAKNESS").map((item) => (
                    <li key={item.id} className="flex justify-between items-center gap-1 group">
                      <span className="truncate">• {item.value}</span>
                      <button onClick={() => item.id && handleDeleteSwotItem(item.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Opportunities */}
            <div className="p-2.5 rounded bg-[#0f182c]/40 border border-blue-900/30 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-400 uppercase tracking-wide">Opportunities</span>
                  <button onClick={() => setActiveSwotInputType(activeSwotInputType === "OPPORTUNITY" ? null : "OPPORTUNITY")} className="text-blue-400 hover:text-white">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                {activeSwotInputType === "OPPORTUNITY" && (
                  <div className="flex gap-1 mt-1">
                    <input 
                      type="text" 
                      placeholder="Add opportunity" 
                      value={newSwotValue} 
                      onChange={(e) => setNewSwotValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSwotItem("OPPORTUNITY")}
                      className="bg-slate-900 border border-slate-700 text-white text-[9px] rounded px-1 py-0.5 w-full focus:outline-none"
                    />
                  </div>
                )}
                <ul className="list-inside text-slate-350 mt-1 space-y-1">
                  {filterSwot("OPPORTUNITY").map((item) => (
                    <li key={item.id} className="flex justify-between items-center gap-1 group">
                      <span className="truncate">• {item.value}</span>
                      <button onClick={() => item.id && handleDeleteSwotItem(item.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Threats */}
            <div className="p-2.5 rounded bg-[#20170f]/40 border border-amber-900/30 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-400 uppercase tracking-wide">Threats</span>
                  <button onClick={() => setActiveSwotInputType(activeSwotInputType === "THREAT" ? null : "THREAT")} className="text-amber-400 hover:text-white">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                {activeSwotInputType === "THREAT" && (
                  <div className="flex gap-1 mt-1">
                    <input 
                      type="text" 
                      placeholder="Add threat" 
                      value={newSwotValue} 
                      onChange={(e) => setNewSwotValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSwotItem("THREAT")}
                      className="bg-slate-900 border border-slate-700 text-white text-[9px] rounded px-1 py-0.5 w-full focus:outline-none"
                    />
                  </div>
                )}
                <ul className="list-inside text-slate-350 mt-1 space-y-1">
                  {filterSwot("THREAT").map((item) => (
                    <li key={item.id} className="flex justify-between items-center gap-1 group">
                      <span className="truncate">• {item.value}</span>
                      <button onClick={() => item.id && handleDeleteSwotItem(item.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Row 2: Initiatives table */}
      <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-200">Strategic Initiatives</h3>
          <button 
            onClick={() => openInitiativeModal(null)}
            className="flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Plus className="h-3 w-3" /> Add Initiative
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-[#0E1726]/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Initiative Name</th>
                <th className="p-3 font-semibold">Owner</th>
                <th className="p-3 font-semibold">Timeline</th>
                <th className="p-3 font-semibold">Progress</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {initiatives.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="p-3 font-bold text-white">{item.name}</td>
                  <td className="p-3">{item.owner}</td>
                  <td className="p-3 text-slate-400">{item.timeline}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 bg-slate-850 rounded-full w-24 overflow-hidden border border-slate-700/50">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] w-6 text-right">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === "Delayed" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="opacity-0 group-hover:opacity-100 flex justify-end gap-3 transition-opacity duration-200">
                      <button onClick={() => openInitiativeModal(item)} className="text-slate-400 hover:text-white" title="Edit">
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button onClick={() => item.id && handleDeleteInitiative(item.id)} className="text-slate-400 hover:text-red-400" title="Delete">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- GOAL MODAL --- */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="font-bold text-white text-sm">{editingGoal ? "Edit Strategic Goal" : "Add New Strategic Goal"}</h4>
              <button onClick={() => setShowGoalModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSaveGoal} className="space-y-4 text-xs text-slate-200">
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Goal Name</label>
                <input 
                  type="text" 
                  value={goalForm.name} 
                  onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                  placeholder="e.g. Market Expansion" 
                  required
                  className="w-full bg-[#1A263E] border border-slate-850 text-white rounded-lg p-2.5 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Target Description</label>
                  <input 
                    type="text" 
                    value={goalForm.target} 
                    onChange={(e) => setGoalForm({ ...goalForm, target: e.target.value })}
                    placeholder="e.g. Open 2 branches" 
                    required
                    className="w-full bg-[#1A263E] border border-slate-850 text-white rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Progress %</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={goalForm.progress} 
                    onChange={(e) => setGoalForm({ ...goalForm, progress: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full bg-[#1A263E] border border-slate-850 text-white rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Theme Color</label>
                <select 
                  value={goalForm.color} 
                  onChange={(e) => setGoalForm({ ...goalForm, color: e.target.value })}
                  className="w-full bg-[#1A263E] border border-slate-850 text-white rounded-lg p-2.5 focus:outline-none"
                >
                  <option value="bg-blue-500">Blue Theme</option>
                  <option value="bg-emerald-500">Green Theme</option>
                  <option value="bg-amber-500">Orange Theme</option>
                  <option value="bg-pink-500">Pink Theme</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowGoalModal(false)} className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- INITIATIVE MODAL --- */}
      {showInitiativeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="font-bold text-white text-sm">{editingInitiative ? "Edit Strategic Initiative" : "Add New Initiative"}</h4>
              <button onClick={() => setShowInitiativeModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSaveInitiative} className="space-y-4 text-xs text-slate-200">
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Initiative Name</label>
                <input 
                  type="text" 
                  value={initiativeForm.name} 
                  onChange={(e) => setInitiativeForm({ ...initiativeForm, name: e.target.value })}
                  placeholder="e.g. Digital Transformation" 
                  required
                  className="w-full bg-[#1A263E] border border-slate-850 text-white rounded-lg p-2.5 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Owner</label>
                  <input 
                    type="text" 
                    value={initiativeForm.owner} 
                    onChange={(e) => setInitiativeForm({ ...initiativeForm, owner: e.target.value })}
                    placeholder="e.g. Karthik R" 
                    required
                    className="w-full bg-[#1A263E] border border-slate-850 text-white rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Timeline</label>
                  <input 
                    type="text" 
                    value={initiativeForm.timeline} 
                    onChange={(e) => setInitiativeForm({ ...initiativeForm, timeline: e.target.value })}
                    placeholder="e.g. Dec 2025" 
                    required
                    className="w-full bg-[#1A263E] border border-slate-850 text-white rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Progress %</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={initiativeForm.progress} 
                    onChange={(e) => setInitiativeForm({ ...initiativeForm, progress: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full bg-[#1A263E] border border-slate-850 text-white rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Status</label>
                  <select 
                    value={initiativeForm.status} 
                    onChange={(e) => setInitiativeForm({ ...initiativeForm, status: e.target.value })}
                    className="w-full bg-[#1A263E] border border-slate-850 text-white rounded-lg p-2.5 focus:outline-none"
                  >
                    <option value="On Track">On Track</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowInitiativeModal(false)} className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AIAssistantBar suggestions={["Q4 milestone timeline", "Modify strategic targets", "Initiative budget utilization", "SWOT updates"]} />
    </div>
  );
}
