"use client";
import React, { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from "recharts";
import { Building, MapPin, DollarSign, Percent, TrendingUp, AlertTriangle, Plus, Sparkles } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface Project {
  name: string;
  type: string;
  location: string;
  value: number;
  progress: number;
  budget: number;
  actual: number;
  profit: number;
  status: string;
}

const INITIAL_PROJECTS: Project[] = [
  { name: "Luxury Villa Project", type: "Residential", location: "Chennai", value: 24.5, progress: 72, budget: 24.5, actual: 21.0, profit: 18.2, status: "On Track" },
  { name: "Skyline Apartments", type: "Residential", location: "Coimbatore", value: 60.0, progress: 48, budget: 60.0, actual: 58.2, profit: 8.0, status: "Delayed" },
  { name: "Commercial Complex", type: "Commercial", location: "Madurai", value: 100.0, progress: 30, budget: 100.0, actual: 110.0, profit: -10.0, status: "Critical" },
  { name: "IT Park Phase - I", type: "Commercial", location: "Bengaluru", value: 75.0, progress: 65, budget: 75.0, actual: 69.5, profit: 12.0, status: "On Track" },
  { name: "School Building", type: "Institutional", location: "Trichy", value: 32.0, progress: 85, budget: 32.0, actual: 28.0, profit: 16.5, status: "On Track" },
  { name: "Hospital Building", type: "Institutional", location: "Chennai", value: 150.0, progress: 20, budget: 150.0, actual: 145.0, profit: 3.5, status: "Delayed" },
];

const progressStatusData = [
  { name: "On Track", value: 12, color: "#10B981" },
  { name: "Delayed", value: 4, color: "#F59E0B" },
  { name: "Critical", value: 2, color: "#EF4444" },
];

export default function CompanyPortfolio() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [type, setType] = useState("Residential");
  const [location, setLocation] = useState("");
  const [value, setValue] = useState("");
  const [budget, setBudget] = useState("");

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !value || !budget) return;

    const newProject: Project = {
      name,
      type,
      location,
      value: parseFloat(value),
      progress: 0,
      budget: parseFloat(budget),
      actual: 0,
      profit: 0,
      status: "On Track",
    };

    setProjects([newProject, ...projects]);
    setName("");
    setLocation("");
    setValue("");
    setBudget("");
    setShowModal(false);
  };

  // Recompute charts based on state
  const projectsByType = [
    { name: "Residential", value: projects.filter(p => p.type === "Residential").reduce((sum, p) => sum + p.value, 0), color: "#3B82F6" },
    { name: "Commercial", value: projects.filter(p => p.type === "Commercial").reduce((sum, p) => sum + p.value, 0), color: "#10B981" },
    { name: "Institutional", value: projects.filter(p => p.type === "Institutional").reduce((sum, p) => sum + p.value, 0), color: "#8B5CF6" },
  ];

  const cityMap: Record<string, number> = {};
  projects.forEach(p => {
    cityMap[p.location] = (cityMap[p.location] || 0) + p.value;
  });
  const topCities = Object.keys(cityMap).map(city => ({
    name: city,
    value: cityMap[city]
  })).sort((a,b) => b.value - a.value).slice(0, 4);

  const totalPortfolioValue = projects.reduce((sum, p) => sum + p.value, 0);
  const totalActualCost = projects.reduce((sum, p) => sum + p.actual, 0);
  const avgProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">02. COMPANY PORTFOLIO</h2>
          <p className="text-xs text-slate-400">Overview of all projects and performance</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg px-4 py-2 text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 hover:brightness-110 transition-all"
        >
          <Plus className="h-4 w-4" />
          Create Project
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Projects</div>
          <div className="text-2xl font-bold text-white mt-1">{projects.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">Active sites</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Portfolio Value</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">₹ {totalPortfolioValue.toFixed(1)} Cr</div>
          <div className="text-[10px] text-emerald-400 mt-1">Sum of contract values</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Actual Cost</div>
          <div className="text-2xl font-bold text-white mt-1">₹ {totalActualCost.toFixed(1)} Cr</div>
          <div className="text-[10px] text-slate-500 mt-1">Expended amount</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Average Progress</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{avgProgress}%</div>
          <div className="text-[10px] text-emerald-400 mt-1">Interactive mean</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Overall Profit Margin</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">12.8%</div>
          <div className="text-[10px] text-emerald-400 mt-1">Target: 15.0%</div>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-200">Project Portfolio Overview</h3>
          <button className="text-xs text-blue-400 hover:underline">View all Projects</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-[#0E1726]/80 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Project Name</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Location</th>
                <th className="p-3 font-semibold">Contract Value</th>
                <th className="p-3 font-semibold">Progress</th>
                <th className="p-3 font-semibold">Budget</th>
                <th className="p-3 font-semibold">Actual Cost</th>
                <th className="p-3 font-semibold">Profit %</th>
                <th className="p-3 font-semibold rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {projects.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-medium text-white flex items-center gap-2">
                    <Building className="h-3.5 w-3.5 text-slate-400" />
                    {p.name}
                  </td>
                  <td className="p-3">{p.type}</td>
                  <td className="p-3 text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3 text-slate-500" />
                    {p.location}
                  </td>
                  <td className="p-3 font-semibold text-slate-200">₹ {p.value} Cr</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 bg-slate-850 rounded-full w-20 overflow-hidden border border-slate-700/50">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${p.progress}%`,
                            backgroundColor: p.status === "Critical" ? "#ef4444" : p.status === "Delayed" ? "#f59e0b" : "#10b981",
                          }}
                        />
                      </div>
                      <span className="text-[10px] w-6 text-right">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="p-3">₹ {p.budget} Cr</td>
                  <td className="p-3 text-slate-200">₹ {p.actual} Cr</td>
                  <td className={`p-3 font-bold ${p.profit >= 10 ? "text-emerald-400" : p.profit >= 0 ? "text-yellow-400" : "text-red-400"}`}>
                    {p.profit}%
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === "Critical"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : p.status === "Delayed"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Project Progress Distribution */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Project Progress Distribution</h3>
          <div className="flex items-center justify-around h-48">
            <div className="h-36 w-36 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={progressStatusData} dataKey="value" innerRadius={36} outerRadius={54} paddingAngle={4}>
                    {progressStatusData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white">{projects.length}</span>
                <span className="text-[9px] text-slate-400">Total Status</span>
              </div>
            </div>
            <div className="space-y-2">
              {progressStatusData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span className="text-xs text-slate-400">{d.name}:</span>
                  <span className="text-xs font-bold text-white">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Projects by Type */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Projects by Type</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectsByType} layout="vertical" margin={{ left: -15, right: 10, top: 10, bottom: 5 }}>
                <XAxis type="number" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={15}>
                  {projectsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Cities by Value */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Top Cities by Project Value</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCities} margin={{ left: -15, right: 10, top: 10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={25}>
                  {topCities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 4 === 0 ? "#8B5CF6" : index % 4 === 1 ? "#3B82F6" : index % 4 === 2 ? "#10B981" : "#EC4899"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111A2E] border border-slate-800 rounded-xl w-full max-w-md p-6 relative">
            <h3 className="text-sm font-semibold text-white mb-4">Create New Construction Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  placeholder="e.g. Metro Line Extension"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Project Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Institutional">Institutional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Location City</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                    placeholder="Chennai"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Contract Value (₹ Cr)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                    placeholder="45.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Budget Allocation (₹ Cr)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                    placeholder="42.0"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-850 text-slate-400 hover:text-white rounded-lg px-4 py-2 text-xs font-bold border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-500/10"
                >
                  <Sparkles className="h-4 w-4" />
                  Initialize Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AIAssistantBar suggestions={["Highlight commercial risks", "Cities breakdown", "Which projects are delayed?", "Profitability forecast"]} />
    </div>
  );
}
