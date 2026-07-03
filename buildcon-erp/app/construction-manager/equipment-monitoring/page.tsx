"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { HardDrive, Settings, AlertCircle, PlusCircle, X } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { getSession } from "@/lib/auth";

export default function EquipmentMonitoring() {
  const [loading, setLoading] = useState(true);
  const [equipmentList, setEquipmentList] = useState<any[]>([]);

  // Modal toggle state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [equipmentCode, setEquipmentCode] = useState("");
  const [machineryType, setMachineryType] = useState("");
  const [allocatedSite, setAllocatedSite] = useState("");
  const [diagnostics, setDiagnostics] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [status, setStatus] = useState("Active");

  // Notification state
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fetchEquipment = async () => {
    const s = getSession();
    const orgId = s?.organizationId || 1;
    const token = localStorage.getItem("buildcon_token");
    const headers = { "Authorization": `Bearer ${token}` };

    try {
      const res = await fetch(`http://localhost:8081/api/construction-manager/equipment/org/${orgId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setEquipmentList(data || []);
      }
    } catch (err) {
      console.error("Error fetching equipment:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipmentCode || !machineryType || !status) {
      showToast("Please fill all required fields", "error");
      return;
    }

    const s = getSession();
    const orgId = s?.organizationId || 1;
    const token = localStorage.getItem("buildcon_token");
    const headers = { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };

    try {
      const res = await fetch(`http://localhost:8081/api/construction-manager/equipment`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          equipmentCode,
          machineryType,
          allocatedSite: allocatedSite || "Unassigned",
          diagnostics: diagnostics || "Optimal Status",
          scheduledDate: scheduledDate || "N/A",
          status,
          organizationId: orgId
        })
      });

      if (res.ok) {
        showToast("Equipment registered successfully!");
        setIsAddModalOpen(false);
        // Clear form
        setEquipmentCode("");
        setMachineryType("");
        setAllocatedSite("");
        setDiagnostics("");
        setScheduledDate("");
        setStatus("Active");
        // Reload list
        fetchEquipment();
      } else {
        showToast("Failed to register equipment", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error registering equipment", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-slate-350 text-xs font-semibold">
        Loading Equipment Fleet Logs...
      </div>
    );
  }

  // Calculate dynamic summary stats
  const totalCount = equipmentList.length;
  const activeCount = equipmentList.filter(e => e.status === "Active").length;
  const idleCount = equipmentList.filter(e => e.status === "Idle").length;
  const maintenanceCount = equipmentList.filter(e => e.status === "Maintenance").length;
  const breakdownCount = equipmentList.filter(e => e.status === "Breakdown").length;

  const equipmentStatusData = [
    { name: "Active", value: activeCount, color: "#10B981" },
    { name: "Idle", value: idleCount, color: "#3B82F6" },
    { name: "Maintenance", value: maintenanceCount, color: "#F59E0B" },
    { name: "Breakdown", value: breakdownCount, color: "#EF4444" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">06. EQUIPMENT MONITORING</h2>
          <p className="text-xs text-slate-400">Monitor active heavy machinery, equipment utilization metrics, diagnostic codes, and maintenance schedules.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
        >
          <PlusCircle className="h-4 w-4" />
          Add Machinery / Equipment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Total Machinery Units</div>
          <div className="text-xl font-bold text-white mt-1">{totalCount} Units</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Active Deployments</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {activeCount} Units ({totalCount > 0 ? Math.round(activeCount / totalCount * 100) : 0}%)
          </div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Under Maintenance</div>
          <div className="text-xl font-bold text-amber-400 mt-1">{maintenanceCount} Units</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-slate-400">Breakdowns Reported</div>
          <div className="text-xl font-bold text-rose-400 mt-1">{breakdownCount} Units</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Status Donut */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Equipment Fleet Status</h3>
            <div className="space-y-2 text-[10px]">
              {equipmentStatusData.map((eq) => (
                <div key={eq.name} className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: eq.color }} />
                    <span>{eq.name}</span>
                  </div>
                  <span className="font-bold text-white font-mono">
                    {eq.value} ({totalCount > 0 ? Math.round(eq.value / totalCount * 100) : 0}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-32 w-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={equipmentStatusData} dataKey="value" nameKey="name" innerRadius={24} outerRadius={42} paddingAngle={2}>
                  {equipmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-white font-mono">{totalCount}</span>
              <span className="text-[7px] text-slate-400 uppercase">Total Units</span>
            </div>
          </div>
        </div>

        {/* Maintenance scheduler */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            Upcoming Maintenance & Breakdowns
          </h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-2">Equipment ID</th>
                  <th className="pb-2">Machinery Type</th>
                  <th className="pb-2">Allocated Site</th>
                  <th className="pb-2">Diagnostics / Status</th>
                  <th className="pb-2">Scheduled Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {equipmentList.map((eq) => (
                  <tr key={eq.id}>
                    <td className="py-3 font-semibold text-white">{eq.equipmentCode}</td>
                    <td className="text-slate-200">{eq.machineryType}</td>
                    <td className="text-slate-400">{eq.allocatedSite}</td>
                    <td className={eq.status === "Breakdown" ? "text-rose-400 font-semibold animate-pulse" : "text-slate-350"}>
                      {eq.diagnostics || eq.status}
                    </td>
                    <td className="text-slate-400">{eq.scheduledDate}</td>
                  </tr>
                ))}
                {equipmentList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-slate-500">No equipment recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Schedule breakdown repairs for EQ-104", "Report machinery idling details", "Export diagnostic logs"]} />

      {/* Add Equipment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative text-slate-200">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-blue-400" />
              Register Fleet Machinery
            </h3>
            <form onSubmit={handleAddEquipment} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Equipment Code *</label>
                  <input 
                    type="text" 
                    value={equipmentCode} 
                    onChange={(e) => setEquipmentCode(e.target.value)}
                    placeholder="e.g. EQ-110"
                    className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Status</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="Active">Active</option>
                    <option value="Idle">Idle</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Breakdown">Breakdown</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Machinery Description / Type *</label>
                <input 
                  type="text" 
                  value={machineryType} 
                  onChange={(e) => setMachineryType(e.target.value)}
                  placeholder="e.g. Liebherr Tower Crane 150, CAT Excavator"
                  className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Allocated Site</label>
                <input 
                  type="text" 
                  value={allocatedSite} 
                  onChange={(e) => setAllocatedSite(e.target.value)}
                  placeholder="e.g. Site A - Chennai"
                  className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Diagnostics / Issue status</label>
                <input 
                  type="text" 
                  value={diagnostics} 
                  onChange={(e) => setDiagnostics(e.target.value)}
                  placeholder="e.g. Hydraulics Check, Optimal, Engine Replacement"
                  className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Scheduled Maintenance Date</label>
                <input 
                  type="text" 
                  value={scheduledDate} 
                  onChange={(e) => setScheduledDate(e.target.value)}
                  placeholder="e.g. 30 May 2025, N/A"
                  className="w-full bg-[#0e1628] border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-350 hover:text-white transition font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition font-semibold"
                >
                  Register Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications */}
      {notification && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg border shadow-xl transition-all duration-300 transform translate-y-0 ${
          notification.type === "success" 
            ? "bg-[#0A2540] border-emerald-500/30 text-emerald-400" 
            : "bg-[#2D1B22] border-rose-500/30 text-rose-400"
        }`}>
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}
    </div>
  );
}
