"use client";
import React, { useState, useEffect } from "react";
import { Landmark, FileCheck, ShieldAlert, AlertTriangle, RefreshCw, Plus, Edit2, X } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface PayrollSummary {
  id: number;
  department: string;
  employeeCount: string;
  basicComponent: string;
  deductions: string;
  netPayout: string;
  status: string;
  organizationId?: number;
}

export default function PayrollCenter() {
  const [payrollList, setPayrollList] = useState<PayrollSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal and Form States
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PayrollSummary | null>(null);
  const [form, setForm] = useState({
    department: "",
    employeeCount: "",
    basicComponent: "",
    deductions: "",
    netPayout: "",
    status: "Processed"
  });

  async function loadPayroll() {
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

      const res = await fetch(`https://erp-construction.onrender.com/api/hr-manager/payroll/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPayrollList(data);
      } else {
        setErrorMsg("Failed to retrieve payroll summary.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPayroll();
  }, []);

  const openModal = (item: PayrollSummary | null = null) => {
    if (item) {
      setEditingItem(item);
      setForm({
        department: item.department,
        employeeCount: item.employeeCount,
        basicComponent: item.basicComponent,
        deductions: item.deductions,
        netPayout: item.netPayout,
        status: item.status
      });
    } else {
      setEditingItem(null);
      setForm({
        department: "",
        employeeCount: "",
        basicComponent: "",
        deductions: "",
        netPayout: "",
        status: "Processed"
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) return;
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;

      const payload = {
        ...form,
        organizationId: orgId
      };

      let url = "https://erp-construction.onrender.com/api/hr-manager/payroll";
      let method = "POST";
      if (editingItem) {
        url = `https://erp-construction.onrender.com/api/hr-manager/payroll/${editingItem.id}`;
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
        loadPayroll();
        setShowModal(false);
      } else {
        alert("Failed to save payroll record.");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting backend server.");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#111C30]/50 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs italic flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        <span>Synchronizing payroll logs with database...</span>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="bg-[#111C30] border border-slate-850 rounded-xl p-6 text-center text-slate-400 text-xs">
        <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
        <p className="font-semibold text-rose-400 mb-2">{errorMsg}</p>
        <button onClick={loadPayroll} className="px-3 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition">
          Retry Load
        </button>
      </div>
    );
  }

  // Calculate Net Payout Sum dynamically from database rows
  const parsePayout = (str: string): number => {
    try {
      const clean = str.replace(/[₹\s,]/g, "").trim();
      if (clean.toLowerCase().includes("l")) {
        return parseFloat(clean.replace(/l/i, "").trim());
      }
      return parseFloat(clean) / 100000; // Convert standard rupees to Lakhs
    } catch {
      return 0;
    }
  };

  const totalNetLakhs = payrollList.reduce((sum, item) => sum + parsePayout(item.netPayout), 0);
  const totalNet = totalNetLakhs > 0 ? `₹${totalNetLakhs.toFixed(2)} Lakhs` : "₹0.00 Lakhs";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">PAYROLL CENTER</h2>
          <p className="text-xs text-slate-400">Review monthly payroll structures, salary processing progress, tax deductions status, and payment logs.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-xs font-bold transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Department
          </button>
          <button
            onClick={loadPayroll}
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
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Total Net Salary (May)</div>
            <div className="text-xl font-bold text-white mt-1">{totalNet}</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Processing Status</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">
                  {payrollList.length > 0 ? `${Math.round((payrollList.filter(p => p.status.toLowerCase() === "processed" || p.status.toLowerCase() === "approved").length / payrollList.length) * 100)}% Processed` : "No records"}
                </div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Disbursed Bank Date</div>
            <div className="text-xl font-bold text-white mt-1">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          </div>
        </div>
      </div>

      {/* Salary Breakdown Table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Department Wise Salary Summary</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Department Name</th>
                <th className="pb-2">Employees Count</th>
                <th className="pb-2">Basic Component</th>
                <th className="pb-2">Deductions (PF/TDS)</th>
                <th className="pb-2">Total Net Payout</th>
                <th className="pb-2">Approval Status</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {payrollList.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/10 transition-colors">
                  <td className="py-3 font-semibold text-slate-200">{row.department}</td>
                  <td className="text-white font-bold">{row.employeeCount}</td>
                  <td className="text-slate-350">{row.basicComponent}</td>
                  <td className="text-rose-400 font-semibold">{row.deductions}</td>
                  <td className="text-emerald-400 font-bold">{row.netPayout}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      row.status.toLowerCase() === "processed" || row.status.toLowerCase() === "approved"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => openModal(row)}
                      className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded transition"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {payrollList.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-slate-500 italic text-center py-6">No payroll records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#111C30] border border-slate-800 rounded-xl p-6 relative shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-base font-bold text-white mb-4">
              {editingItem ? "Edit Department Payroll Record" : "Add Department Payroll Record"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">Department Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sales & Marketing"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full bg-[#0A1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5">Employees Count</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 Staff"
                    value={form.employeeCount}
                    onChange={(e) => setForm({ ...form, employeeCount: e.target.value })}
                    className="w-full bg-[#0A1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5">Basic Component</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹5.8 L"
                    value={form.basicComponent}
                    onChange={(e) => setForm({ ...form, basicComponent: e.target.value })}
                    className="w-full bg-[#0A1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5">Deductions (PF/TDS)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹48,000"
                    value={form.deductions}
                    onChange={(e) => setForm({ ...form, deductions: e.target.value })}
                    className="w-full bg-[#0A1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5">Total Net Payout</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹5.32 L"
                    value={form.netPayout}
                    onChange={(e) => setForm({ ...form, netPayout: e.target.value })}
                    className="w-full bg-[#0A1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">Approval Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-[#0A1120] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                  required
                >
                  <option value="Processed">Processed</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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

      <AIAssistantBar suggestions={["Generate salary slip PDFs template", "Confirm overall PF deduction transfer", "Check pending reimbursement vouchers"]} />
    </div>
  );
}
