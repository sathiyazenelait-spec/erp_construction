"use client";
import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { Users, AlertCircle, Heart, Zap, GraduationCap, CheckCircle2, Plus, Sparkles, FolderPlus, UserPlus, ShieldAlert } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface Department {
  dept: string;
  score: number;
  manager: string;
}

interface Employee {
  name: string;
  role: string;
  dept: string;
  status: string;
}

const INITIAL_DEPARTMENTS: Department[] = [
  { dept: "Project Management", score: 94, manager: "Amit Patel" },
  { dept: "Engineering", score: 92, manager: "Karan Johar" },
  { dept: "Site Operations", score: 87, manager: "Ravi Shankar" },
  { dept: "Safety & Inspection", score: 95, manager: "Neha Gupta" },
  { dept: "Procurement & Logistics", score: 84, manager: "Sanjay Dutt" },
];

const INITIAL_EMPLOYEES: Employee[] = [
  { name: "Rahul Sharma", role: "Site Engineer", dept: "Engineering", status: "Active" },
  { name: "Priya Patel", role: "Quality Analyst", dept: "Safety & Inspection", status: "Active" },
  { name: "Vikram Kumar", role: "Procurement Specialist", dept: "Procurement & Logistics", status: "Active" },
  { name: "Rohan Verma", role: "Project Manager", dept: "Project Management", status: "Active" },
];

export default function WorkforceAnalysis() {
  const [depts, setDepts] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);

  // Modals visibility
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showEmpModal, setShowEmpModal] = useState(false);
  const [showManagerModal, setShowManagerModal] = useState(false);

  // Form states
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptManager, setNewDeptManager] = useState("");

  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpRole, setNewEmpRole] = useState("");
  const [newEmpDept, setNewEmpDept] = useState("Engineering");

  const [selectedDept, setSelectedDept] = useState("Engineering");
  const [assignManagerName, setAssignManagerName] = useState("");

  // Statistics
  const totalEmployees = 215 + employees.length;

  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName) return;
    const newDept: Department = {
      dept: newDeptName,
      score: 90, // default starting score
      manager: newDeptManager || "TBD",
    };
    setDepts([...depts, newDept]);
    setNewDeptName("");
    setNewDeptManager("");
    setShowDeptModal(false);
  };

  const handleAddEmp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName || !newEmpRole) return;
    const newEmp: Employee = {
      name: newEmpName,
      role: newEmpRole,
      dept: newEmpDept,
      status: "Active",
    };
    setEmployees([...employees, newEmp]);
    setNewEmpName("");
    setNewEmpRole("");
    setShowEmpModal(false);
  };

  const handleAssignManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignManagerName) return;
    setDepts(depts.map(d => d.dept === selectedDept ? { ...d, manager: assignManagerName } : d));
    setAssignManagerName("");
    setShowManagerModal(false);
  };

  const employeeDistribution = [
    { name: "Management", value: 15, color: "#8B5CF6" },
    { name: "Engineers", value: 40 + employees.filter(e => e.role.includes("Engineer")).length, color: "#3B82F6" },
    { name: "Site Supervisors", value: 30 + employees.filter(e => e.role.includes("Supervisor") || e.role.includes("Manager")).length, color: "#EC4899" },
    { name: "Skilled Workers", value: 100, color: "#10B981" },
    { name: "Others", value: 30 + employees.filter(e => !e.role.includes("Engineer") && !e.role.includes("Supervisor") && !e.role.includes("Manager")).length, color: "#64748B" },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">06. WORKFORCE ANALYSIS</h2>
          <p className="text-xs text-slate-400">People, productivity and performance overview</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowDeptModal(true)}
            className="bg-slate-800 border border-slate-700 text-slate-200 hover:text-white rounded-lg px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <FolderPlus className="h-4 w-4 text-emerald-400" />
            Create Dept
          </button>
          <button
            onClick={() => setShowEmpModal(true)}
            className="bg-slate-800 border border-slate-700 text-slate-200 hover:text-white rounded-lg px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <UserPlus className="h-4 w-4 text-blue-400" />
            Add Employee
          </button>
          <button
            onClick={() => setShowManagerModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 hover:brightness-110 shadow-md shadow-blue-500/10 transition-all"
          >
            <Users className="h-4 w-4" />
            Assign Manager
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Employees</div>
          <div className="text-2xl font-bold text-white mt-1">{totalEmployees}</div>
          <div className="text-[10px] text-slate-500 mt-1">Full-time payroll</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Labour Strength</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">420 / 460</div>
          <div className="text-[10px] text-slate-500 mt-1">91.3% capacity utilized</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Attrition Rate</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">3.2%</div>
          <div className="text-[10px] text-emerald-400 mt-1">↓ 0.3% vs last quarter</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Productivity Score</div>
          <div className="text-2xl font-bold text-white mt-1">89%</div>
          <div className="text-[10px] text-emerald-400 mt-1">↑ 1.5% vs target</div>
        </div>
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Training Hours (YTD)</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">1,250</div>
          <div className="text-[10px] text-slate-500 mt-1">15 courses active</div>
        </div>
      </div>

      {/* Row 2: Distribution & Department Productivity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Employee Distribution */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Employee Distribution</h3>
          <div className="flex items-center justify-around h-48">
            <div className="h-32 w-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={employeeDistribution} dataKey="value" innerRadius={28} outerRadius={46} paddingAngle={2}>
                    {employeeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white">{totalEmployees}</span>
                <span className="text-[8px] text-slate-400">Total</span>
              </div>
            </div>
            <div className="space-y-1">
              {employeeDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] text-slate-305 w-20 truncate">{item.name}</span>
                  <span className="text-[10px] font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dept Productivity */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Active Departments & Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-[#0E1726]/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-2.5 font-semibold">Department</th>
                  <th className="p-2.5 font-semibold">Assigned Manager</th>
                  <th className="p-2.5 font-semibold">Productivity Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {depts.map((d, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="p-2.5 text-white font-medium">{d.dept}</td>
                    <td className="p-2.5 text-slate-300 font-semibold">{d.manager}</td>
                    <td className="p-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 bg-[#0E1726] rounded w-24 overflow-hidden border border-slate-700/50">
                          <div className="h-full rounded bg-emerald-500" style={{ width: `${d.score}%` }} />
                        </div>
                        <span className="font-bold text-emerald-400">{d.score}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 3: Employee Register & Alerts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Custom Employee Registry */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Recently Added Employees</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-[#0E1726]/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-2.5 font-semibold">Full Name</th>
                  <th className="p-2.5 font-semibold">Role</th>
                  <th className="p-2.5 font-semibold">Department</th>
                  <th className="p-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {employees.map((e, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/20">
                    <td className="p-2.5 text-white font-medium">{e.name}</td>
                    <td className="p-2.5 text-slate-400">{e.role}</td>
                    <td className="p-2.5 text-slate-300">{e.dept}</td>
                    <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{e.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workforce Alerts */}
        <div className="bg-red-950/10 border border-red-900/20 rounded-xl p-5">
          <div className="flex items-center gap-2 text-red-400 mb-3">
            <AlertCircle className="h-5 w-5" />
            <h3 className="text-sm font-semibold">Workforce Alerts</h3>
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="mt-1 h-1.5 w-1.5 bg-red-500 rounded-full shrink-0"></span>
              <span>Labour strength is **40 below requirement** at the Commercial Complex site.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1 h-1.5 w-1.5 bg-amber-500 rounded-full shrink-0"></span>
              <span>2 key employees have pending safety training certification renewals due this month.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1 h-1.5 w-1.5 bg-emerald-500 rounded-full shrink-0"></span>
              <span>Attrition rate remains stable within the acceptable standard limits.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Create Department Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111A2E] border border-slate-800 rounded-xl w-full max-w-sm p-6 relative">
            <h3 className="text-sm font-semibold text-white mb-4">Create Corporate Department</h3>
            <form onSubmit={handleCreateDept} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  placeholder="e.g. Quality Control"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Temporary Manager</label>
                <input
                  type="text"
                  value={newDeptManager}
                  onChange={(e) => setNewDeptManager(e.target.value)}
                  className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  placeholder="e.g. Ramesh Kumar"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  className="bg-slate-850 text-slate-400 hover:text-white rounded-lg px-4 py-2 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-1"
                >
                  <Sparkles className="h-4 w-4" />
                  Establish Dept
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showEmpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111A2E] border border-slate-800 rounded-xl w-full max-w-sm p-6 relative">
            <h3 className="text-sm font-semibold text-white mb-4">Add Employee to Registry</h3>
            <form onSubmit={handleAddEmp} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Employee Full Name</label>
                <input
                  type="text"
                  required
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  placeholder="Sunil Dutt"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Job Designation</label>
                <input
                  type="text"
                  required
                  value={newEmpRole}
                  onChange={(e) => setNewEmpRole(e.target.value)}
                  className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  placeholder="Site Supervisor"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Department</label>
                <select
                  value={newEmpDept}
                  onChange={(e) => setNewEmpDept(e.target.value)}
                  className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                >
                  {depts.map((d, i) => (
                    <option key={i} value={d.dept}>{d.dept}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmpModal(false)}
                  className="bg-slate-850 text-slate-400 hover:text-white rounded-lg px-4 py-2 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-1"
                >
                  <Sparkles className="h-4 w-4" />
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Manager Modal */}
      {showManagerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111A2E] border border-slate-800 rounded-xl w-full max-w-sm p-6 relative">
            <h3 className="text-sm font-semibold text-white mb-4">Assign Department Manager</h3>
            <form onSubmit={handleAssignManager} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Target Department</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                >
                  {depts.map((d, i) => (
                    <option key={i} value={d.dept}>{d.dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Manager Name</label>
                <input
                  type="text"
                  required
                  value={assignManagerName}
                  onChange={(e) => setAssignManagerName(e.target.value)}
                  className="w-full bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  placeholder="Amit Patel"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowManagerModal(false)}
                  className="bg-slate-850 text-slate-400 hover:text-white rounded-lg px-4 py-2 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-1"
                >
                  <Sparkles className="h-4 w-4" />
                  Assign Manager
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AIAssistantBar suggestions={["Skills inventory", "Labour roster details", "Productivity reports", "Training schedule"]} />
    </div>
  );
}
