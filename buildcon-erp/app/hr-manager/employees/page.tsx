"use client";
import React, { useState, useEffect } from "react";
import { Users, Search, Filter, RefreshCw, AlertCircle, Plus, X, ShieldAlert } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface Employee {
  id: string;
  name: string;
  role: string;
  dept: string;
  status: "Active" | "On Leave" | "Suspended";
  joined: string;
}

const AVAILABLE_ROLES = [
  { value: "ROLE_PROJECT_MANAGER", label: "Project Manager" },
  { value: "ROLE_SITE_MANAGEMENT", label: "Site Supervisor (Site Management)" },
  { value: "ROLE_SENIOR_SITE_ENGINEER", label: "Senior Site Engineer" },
  { value: "ROLE_CONSTRUCTION_MANAGER", label: "Construction Manager" },
  { value: "ROLE_QUANTITY_SURVEYOR", label: "Quantity Surveyor" },
  { value: "ROLE_PROCUREMENT_MANAGER", label: "Procurement Manager" },
  { value: "ROLE_FINANCE_ACCOUNTS", label: "Finance & Accounts Lead" },
  { value: "ROLE_WORKFORCE_MANAGER", label: "Workforce Manager" },
  { value: "ROLE_SUBCONTRACTOR", label: "Subcontractor" },
];

export default function EmployeeManagement() {
  const [list, setList] = useState<Employee[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Add Employee Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("ROLE_PROJECT_MANAGER");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  async function loadEmployees() {
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

      const res = await fetch(`https://erp-construction.onrender.com/api/hr-manager/employees/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setList(data);
      } else {
        setErrorMsg("Failed to retrieve employee directory.");
      }
    } catch (e) {
      console.error("Failed to load employees:", e);
      setErrorMsg("Failed to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalLoading(true);

    try {
      const sessionStr = localStorage.getItem("buildcon_session");
      if (!sessionStr) {
        setModalError("Session expired. Please log in again.");
        setModalLoading(false);
        return;
      }
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;

      // Map role name directly to REST endpoint path structure
      const roleSegment = newRole.replace("ROLE_", "").toLowerCase().replace(/_/g, "-");
      const endpoint = `https://erp-construction.onrender.com/api/${roleSegment}/signup`;
      const payload = {
        username: newUsername,
        email: newEmail,
        password: newPassword,
        role: newRole,
        organizationId: orgId
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to register employee.");
      }

      // Reset form & close modal
      setNewUsername("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("ROLE_PROJECT_MANAGER");
      setShowAddModal(false);
      
      // Refresh directory list
      loadEmployees();
      alert("Employee added successfully!");
    } catch (err: any) {
      setModalError(err.message || "Unable to register employee.");
    } finally {
      setModalLoading(false);
    }
  };

  const filtered = list.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || emp.role.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    return matchesSearch && emp.dept === filter;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">EMPLOYEE MANAGEMENT</h2>
          <p className="text-xs text-slate-400">Search and filter active corporate personnel profiles, track statuses, and view organizational roles.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 text-slate-950 font-bold rounded-lg text-xs transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Employee
          </button>
          <button
            onClick={loadEmployees}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111C30] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 justify-between items-center text-xs">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by employee name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111C30] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500 transition placeholder:text-slate-500"
          />
        </div>
        <div className="flex gap-2 self-stretch md:self-auto overflow-x-auto pb-1 md:pb-0">
          {["all", "Engineering", "Finance", "Projects", "Management", "HR"].map((dept) => (
            <button
              key={dept}
              onClick={() => setFilter(dept)}
              className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap ${
                filter === dept 
                   ? "bg-emerald-600 text-white border-emerald-500 font-semibold" 
                   : "bg-[#111C30] border-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              {dept === "all" ? "All Depts" : dept}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-10 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <p className="text-xs text-slate-400">Retrieving organization directory from the database...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-red-955/20 border border-red-500/20 text-red-400 rounded-xl p-5 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="text-xs font-semibold">{errorMsg}</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs italic">
          No matching employees found in your organization directory.
        </div>
      ) : (
        /* Employees Table */
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Corporate Employee Directory</h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-2">Employee ID</th>
                  <th className="pb-2">Full Name</th>
                  <th className="pb-2">Designation / Role</th>
                  <th className="pb-2">Department</th>
                  <th className="pb-2">Joined Date</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-800/25 transition-colors">
                    <td className="py-3 font-semibold text-slate-500">{emp.id}</td>
                    <td className="text-white font-bold">{emp.name}</td>
                    <td className="text-slate-200">{emp.role}</td>
                    <td className="text-slate-400">{emp.dept}</td>
                    <td className="text-slate-400 font-mono">{emp.joined}</td>
                    <td>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                        emp.status === "Active" 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : emp.status === "On Leave"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Employee Modal (Premium Styled Glassmorphic overlay) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-gradient-to-br from-[#0F172A] to-[#0A1120] border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-emerald-400" /> Register Corporate Employee
              </h3>
              <button 
                onClick={() => { setShowAddModal(false); setModalError(null); }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Select Organizational Role</label>
                <select 
                  className="w-full bg-[#111C30] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  required
                >
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r.value} value={r.value} className="bg-[#111C30]">{r.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Username / Name</label>
                <input 
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#111C30] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-emerald-500" 
                  value={newUsername} 
                  onChange={(e)=>setNewUsername(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
                <input 
                  type="email"
                  placeholder="employee.name@buildcon.com"
                  className="w-full bg-[#111C30] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-emerald-500" 
                  value={newEmail} 
                  onChange={(e)=>setNewEmail(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Credentials Password</label>
                <input 
                  type="password" 
                  placeholder="Minimum 6 characters"
                  className="w-full bg-[#111C30] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-emerald-500" 
                  value={newPassword} 
                  onChange={(e)=>setNewPassword(e.target.value)} 
                  required 
                />
              </div>

              {modalError && (
                <div className="text-xs text-red-400 flex items-center gap-1.5 bg-red-950/20 border border-red-900/40 p-2.5 rounded-lg">
                  <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={modalLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs hover:brightness-110 transition shadow-md shadow-emerald-500/10 disabled:opacity-50 mt-2"
              >
                {modalLoading ? "Registering Employee profile..." : "Confirm & Add Employee"}
              </button>
            </form>
          </div>
        </div>
      )}

      <AIAssistantBar suggestions={["List active project supervisors", "Show manpower allocation statistics", "Predict employee attrition risk"]} />
    </div>
  );
}
