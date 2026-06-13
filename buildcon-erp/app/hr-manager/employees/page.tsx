"use client";
import React, { useState } from "react";
import { Users, Search, Filter } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface Employee {
  id: string;
  name: string;
  role: string;
  dept: string;
  status: "Active" | "On Leave" | "Suspended";
  joined: string;
}

const initialEmployees: Employee[] = [
  { id: "EMP-001", name: "Arvind Menon", role: "Project Director", dept: "Engineering", status: "Active", joined: "12 Mar 2021" },
  { id: "EMP-002", name: "Suresh Kumar", role: "Finance Director", dept: "Finance", status: "Active", joined: "15 Jun 2022" },
  { id: "EMP-003", name: "Rajesh Verma", role: "BD Director", dept: "Sales & Marketing", status: "Active", joined: "01 Sep 2020" },
  { id: "EMP-004", name: "Karthik R.", role: "Construction Manager", dept: "Projects", status: "Active", joined: "10 Feb 2023" },
  { id: "EMP-005", name: "Ananya Sharma", role: "Marketing Manager", dept: "Sales & Marketing", status: "Active", joined: "20 May 2024" },
  { id: "EMP-006", name: "Meenakshi Iyer", role: "HR Manager", dept: "HR", status: "Active", joined: "15 Jan 2020" },
  { id: "EMP-007", name: "Amit Patel", role: "Site Supervisor", dept: "Projects", status: "On Leave", joined: "12 Oct 2022" }
];

export default function EmployeeManagement() {
  const [list, setList] = useState<Employee[]>(initialEmployees);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = list.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || emp.role.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    return matchesSearch && emp.dept === filter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">EMPLOYEE MANAGEMENT</h2>
        <p className="text-xs text-slate-400">Search and filter active corporate personnel profiles, track statuses, and view organizational roles.</p>
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
        <div className="flex gap-2 self-stretch md:self-auto">
          {["all", "Engineering", "Finance", "Projects", "Sales & Marketing", "HR"].map((dept) => (
            <button
              key={dept}
              onClick={() => setFilter(dept)}
              className={`px-3 py-1.5 rounded-lg border transition ${
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

      {/* Employees Table */}
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
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-850 transition">
                  <td className="py-3 font-semibold text-slate-400">{emp.id}</td>
                  <td className="text-white font-bold">{emp.name}</td>
                  <td className="text-slate-200">{emp.role}</td>
                  <td className="text-slate-350">{emp.dept}</td>
                  <td className="text-slate-400">{emp.joined}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      emp.status === "Active" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : emp.status === "On Leave"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-455 text-rose-450 text-rose-400 border-rose-500/20"
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

      <AIAssistantBar suggestions={["Add new employee profile", "List active project supervisors", "Download complete directories"]} />
    </div>
  );
}
