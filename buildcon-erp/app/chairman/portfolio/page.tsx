"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from "recharts";
import { Building, MapPin, DollarSign, Percent, TrendingUp, AlertTriangle, Plus, Sparkles, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface Project {
  id?: number;
  name: string;
  type: string;
  location: string;
  value: number;
  progress: number;
  budget: number;
  actual: number;
  profit: number;
  status: string;
  architectName?: string;
  planningImage?: string;
  constructionImage?: string;
  buildingModelImage?: string;
  startDate?: string;
}

const INITIAL_PROJECTS: Project[] = [

];

const progressStatusData = [
  { name: "On Track", value: 12, color: "#10B981" },
  { name: "Delayed", value: 4, color: "#F59E0B" },
  { name: "Critical", value: 2, color: "#EF4444" },
];

export default function CompanyPortfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Edit Modal States
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("Commercial");
  const [editLocation, setEditLocation] = useState("");
  const [editBudget, setEditBudget] = useState("");
  const [editProgress, setEditProgress] = useState("0");
  const [editStatus, setEditStatus] = useState("Planning");
  const [editArchitectName, setEditArchitectName] = useState("");
  const [editPlanningImage, setEditPlanningImage] = useState("");
  const [editConstructionImage, setEditConstructionImage] = useState("");
  const [editBuildingModelImage, setEditBuildingModelImage] = useState("");
  const [editStartDate, setEditStartDate] = useState("");

  // Create Form states
  const [name, setName] = useState("");
  const [type, setType] = useState("Residential");
  const [location, setLocation] = useState("");
  const [value, setValue] = useState("");
  const [budget, setBudget] = useState("");
  const [architectName, setArchitectName] = useState("");
  const [planningImage, setPlanningImage] = useState("");
  const [buildingModelImage, setBuildingModelImage] = useState("");
  const [startDate, setStartDate] = useState("");

  const fetchProjects = async () => {
    try {
      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) {
        setProjects(INITIAL_PROJECTS);
        setLoading(false);
        return;
      }
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;
      if (!orgId) {
        setProjects(INITIAL_PROJECTS);
        setLoading(false);
        return;
      }

      const res = await fetch(`https://erp-construction.onrender.com/api/projects/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const mapped: Project[] = data.map((p: any) => {
          const budgetInCr = p.budget > 1000 ? p.budget / 10000000 : p.budget;
          const progressPct = parseInt(p.workforceDetails) || 0;
          const actualInCr = budgetInCr * (progressPct / 100);
          return {
            id: p.id,
            name: p.name,
            type: p.locationType || "Commercial",
            location: p.location,
            value: budgetInCr,
            progress: progressPct,
            budget: budgetInCr,
            actual: parseFloat(actualInCr.toFixed(2)),
            profit: 15, // default static margin
            status: p.status || "Planning",
            architectName: p.architectName || "",
            planningImage: p.planningImage || "",
            constructionImage: p.constructionImage || "",
            buildingModelImage: p.buildingModelImage || "",
            startDate: p.startDate || ""
          };
        });
        setDbProjects(mapped);
        setProjects([...mapped, ...INITIAL_PROJECTS]);
      } else {
        setProjects(INITIAL_PROJECTS);
      }
    } catch (e) {
      console.error("Failed to fetch database projects for company portfolio", e);
      setProjects(INITIAL_PROJECTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !budget) return;

    try {
      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) return;
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;
      if (!orgId) return;

      const res = await fetch("https://erp-construction.onrender.com/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          location,
          budget: parseFloat(budget) * 10000000, // convert Cr to raw Rupees
          status: "Planning",
          organizationId: orgId,
          locationType: type,
          workforceDetails: "0",
          architectName: architectName,
          planningImage: planningImage,
          buildingModelImage: buildingModelImage,
          startDate: startDate || new Date().toISOString().split("T")[0],
          constructionImage: ""
        })
      });

      if (res.ok) {
        setName("");
        setLocation("");
        setValue("");
        setBudget("");
        setArchitectName("");
        setPlanningImage("");
        setBuildingModelImage("");
        setStartDate("");
        setShowModal(false);
        fetchProjects();
      } else {
        alert("Failed to save project in database");
      }
    } catch (err) {
      console.error("Error creating project in DB", err);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;
      const res = await fetch(`https://erp-construction.onrender.com/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        alert("Project deleted successfully!");
        fetchProjects();
      } else {
        alert("Failed to delete project from database");
      }
    } catch (err) {
      console.error("Error deleting project", err);
    }
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setEditName(p.name);
    setEditType(p.type);
    setEditLocation(p.location);
    setEditBudget(p.budget.toString());
    setEditProgress(p.progress.toString());
    setEditStatus(p.status);
    setEditArchitectName(p.architectName || "");
    setEditPlanningImage(p.planningImage || "");
    setEditConstructionImage(p.constructionImage || "");
    setEditBuildingModelImage(p.buildingModelImage || "");
    setEditStartDate(p.startDate || "");
    setShowEditModal(true);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.id) return;

    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const res = await fetch(`https://erp-construction.onrender.com/api/projects/${editingProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editName,
          location: editLocation,
          budget: parseFloat(editBudget) * 10000000,
          status: editStatus,
          locationType: editType,
          workforceDetails: editProgress,
          actualProgress: parseInt(editProgress) || 0,
          architectName: editArchitectName,
          planningImage: editPlanningImage,
          constructionImage: editConstructionImage,
          buildingModelImage: editBuildingModelImage,
          startDate: editStartDate
        })
      });

      if (res.ok) {
        setShowEditModal(false);
        setEditingProject(null);
        fetchProjects();
      } else {
        alert("Failed to update project details");
      }
    } catch (err) {
      console.error("Error updating project in DB", err);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "planning" | "construction" | "create_planning" | "building_model" | "create_building_model") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        if (field === "planning") setEditPlanningImage(reader.result);
        else if (field === "construction") setEditConstructionImage(reader.result);
        else if (field === "create_planning") setPlanningImage(reader.result);
        else if (field === "building_model") setEditBuildingModelImage(reader.result);
        else if (field === "create_building_model") setBuildingModelImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
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
  })).sort((a, b) => b.value - a.value).slice(0, 4);

  const totalPortfolioValue = projects.reduce((sum, p) => sum + p.value, 0);
  const totalActualCost = projects.reduce((sum, p) => sum + p.actual, 0);
  const avgProgress = projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0;

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
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {projects.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-medium text-white flex items-center gap-2">
                    <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="truncate max-w-[180px]">{p.name}</span>
                      <div className="flex items-center gap-1 text-[9px] text-slate-500 font-mono mt-0.5">
                        {p.architectName && <span className="italic">Arch: {p.architectName}</span>}
                        {p.startDate && <span>• Start: {p.startDate}</span>}
                      </div>
                    </div>
                    <div className="flex gap-1.5 ml-auto shrink-0">
                      {p.planningImage && (
                        <div className="relative group/img">
                          <img src={p.planningImage} className="h-7 w-7 rounded border border-slate-700 object-cover" title="Planning Image (Blueprint)" />
                          <div className="absolute hidden group-hover/img:block bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] border border-slate-700 p-1.5 rounded-lg shadow-xl">
                            <img src={p.planningImage} className="max-h-48 max-w-48 object-contain" />
                            <div className="text-[9px] text-slate-400 text-center mt-1">Design Blueprint</div>
                          </div>
                        </div>
                      )}
                      {p.buildingModelImage && (
                        <div className="relative group/img">
                          <img src={p.buildingModelImage} className="h-7 w-7 rounded border border-slate-700 object-cover" title="Building Model Image" />
                          <div className="absolute hidden group-hover/img:block bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] border border-slate-700 p-1.5 rounded-lg shadow-xl">
                            <img src={p.buildingModelImage} className="max-h-48 max-w-48 object-contain" />
                            <div className="text-[9px] text-slate-400 text-center mt-1">Building Model</div>
                          </div>
                        </div>
                      )}
                      {p.constructionImage && (
                        <div className="relative group/img">
                          <img src={p.constructionImage} className="h-7 w-7 rounded border border-slate-700 object-cover" title="Construction Image (On-site)" />
                          <div className="absolute hidden group-hover/img:block bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] border border-slate-700 p-1.5 rounded-lg shadow-xl">
                            <img src={p.constructionImage} className="max-h-48 max-w-48 object-contain" />
                            <div className="text-[9px] text-slate-400 text-center mt-1">On-Site Progress</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3">{p.type}</td>
                  <td className="p-3 text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      {p.location}
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-slate-200">₹ {p.value.toFixed(1)} Cr</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 bg-slate-850 rounded-full w-20 overflow-hidden border border-slate-700/50">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${p.progress}%`,
                            backgroundColor: p.status === "Critical" ? "#ef4444" : p.status === "Delayed" || p.status === "Suspended" ? "#f59e0b" : "#10b981",
                          }}
                        />
                      </div>
                      <span className="text-[10px] w-6 text-right">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="p-3">₹ {p.budget.toFixed(1)} Cr</td>
                  <td className="p-3 text-slate-200">₹ {p.actual.toFixed(1)} Cr</td>
                  <td className={`p-3 font-bold ${p.profit >= 10 ? "text-emerald-400" : p.profit >= 0 ? "text-yellow-400" : "text-red-400"}`}>
                    {p.profit}%
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.status === "Critical"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : p.status === "Delayed" || p.status === "Suspended"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {p.id ? (
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-colors"
                          title="Edit Project"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id!)}
                          className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">Static Mock</span>
                    )}
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
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Architect Name</label>
                <input
                  type="text"
                  value={architectName}
                  onChange={(e) => setArchitectName(e.target.value)}
                  className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  placeholder="e.g. Sridhar Associates"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Planning Image (Blueprint)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileChange(e, "create_planning")}
                      className="hidden"
                      id="create-planning-upload"
                    />
                    <label
                      htmlFor="create-planning-upload"
                      className="bg-[#0E1726] border border-slate-800 hover:border-blue-500 text-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <ImageIcon className="h-3.5 w-3.5 text-slate-450" /> Upload
                    </label>
                    {planningImage && (
                      <img src={planningImage} className="h-8 w-8 rounded border border-slate-700 object-cover" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Building Model Image</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileChange(e, "create_building_model")}
                      className="hidden"
                      id="create-building-model-upload"
                    />
                    <label
                      htmlFor="create-building-model-upload"
                      className="bg-[#0E1726] border border-slate-800 hover:border-blue-500 text-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <ImageIcon className="h-3.5 w-3.5 text-slate-450" /> Upload
                    </label>
                    {buildingModelImage && (
                      <img src={buildingModelImage} className="h-8 w-8 rounded border border-slate-700 object-cover" />
                    )}
                  </div>
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

      {/* Edit Project Modal */}
      {showEditModal && editingProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111A2E] border border-slate-800 rounded-xl w-full max-w-md p-6 relative">
            <h3 className="text-sm font-semibold text-white mb-4">Edit Project Specifications</h3>
            <form onSubmit={handleUpdateProject} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Project Type</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
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
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Budget Allocation (₹ Cr)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                    className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">On-site Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={editProgress}
                    onChange={(e) => setEditProgress(e.target.value)}
                    className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Project Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Completed">Completed</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Architect Name</label>
                <input
                  type="text"
                  value={editArchitectName}
                  onChange={(e) => setEditArchitectName(e.target.value)}
                  className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Blueprint</label>
                  <div className="flex flex-col gap-1.5 items-start">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileChange(e, "planning")}
                      className="hidden"
                      id="edit-planning-upload"
                    />
                    <label
                      htmlFor="edit-planning-upload"
                      className="bg-[#0E1726] border border-slate-800 hover:border-blue-500 text-slate-300 rounded-lg px-3 py-1.5 text-[11px] font-semibold cursor-pointer flex items-center gap-1 w-full justify-center"
                    >
                      <ImageIcon className="h-3.5 w-3.5 text-slate-450" /> Upload
                    </label>
                    {editPlanningImage && (
                      <img src={editPlanningImage} className="h-8 w-8 rounded border border-slate-700 object-cover mx-auto" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Building Model</label>
                  <div className="flex flex-col gap-1.5 items-start">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileChange(e, "building_model")}
                      className="hidden"
                      id="edit-building-model-upload"
                    />
                    <label
                      htmlFor="edit-building-model-upload"
                      className="bg-[#0E1726] border border-slate-800 hover:border-blue-500 text-slate-300 rounded-lg px-3 py-1.5 text-[11px] font-semibold cursor-pointer flex items-center gap-1 w-full justify-center"
                    >
                      <ImageIcon className="h-3.5 w-3.5 text-slate-450" /> Upload
                    </label>
                    {editBuildingModelImage && (
                      <img src={editBuildingModelImage} className="h-8 w-8 rounded border border-slate-700 object-cover mx-auto" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Site Progress</label>
                  <div className="flex flex-col gap-1.5 items-start">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileChange(e, "construction")}
                      className="hidden"
                      id="edit-construction-upload"
                    />
                    <label
                      htmlFor="edit-construction-upload"
                      className="bg-[#0E1726] border border-slate-800 hover:border-blue-500 text-slate-300 rounded-lg px-3 py-1.5 text-[11px] font-semibold cursor-pointer flex items-center gap-1 w-full justify-center"
                    >
                      <ImageIcon className="h-3.5 w-3.5 text-slate-450" /> Upload
                    </label>
                    {editConstructionImage && (
                      <img src={editConstructionImage} className="h-8 w-8 rounded border border-slate-700 object-cover mx-auto" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProject(null);
                  }}
                  className="bg-slate-850 text-slate-400 hover:text-white rounded-lg px-4 py-2 text-xs font-bold border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-500/10"
                >
                  <Sparkles className="h-4 w-4" />
                  Save Changes
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
