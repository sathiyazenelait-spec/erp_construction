"use client";
import React, { useState, useEffect } from "react";
import { Users, Smile, Mail, Phone, Calendar, Plus, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { getSession } from "@/lib/auth";

export default function CRM() {
  const [crmClients, setCrmClients] = useState<any[]>([
    { id: 1, name: "ABC Developers Pvt Ltd", contact: "Mr. Ramesh", phone: "+91 98765 43210", projects: 3, status: "Active", lastContact: "28 May 2025" },
    { id: 2, name: "XYZ Constructions Ltd", contact: "Ms. Suresh", phone: "+91 87654 32109", projects: 2, status: "Active", lastContact: "26 May 2025" },
    { id: 3, name: "Greenfield Builders Group", contact: "Mr. Rajan", phone: "+91 76543 21098", projects: 2, status: "Active", lastContact: "25 May 2025" },
    { id: 4, name: "L&N Infraventures Inc", contact: "Mr. Karthik", phone: "+91 65432 10987", projects: 1, status: "Potential", lastContact: "27 May 2025" },
    { id: 5, name: "Oceanic Resorts & Hotels", contact: "Mr. Vijay", phone: "+91 95432 10987", projects: 2, status: "Active", lastContact: "20 May 2025" },
  ]);

  const [kpi, setKpi] = useState({
    totalClients: 320,
    activeAccounts: 180,
    potentialAccounts: 95,
    inactiveAccounts: 45
  });

  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    contact: "",
    phone: "",
    projects: 1,
    status: "Active",
    lastContact: "Today"
  });

  const session = getSession();
  const orgId = session?.organizationId || 1;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/business-director/crm/org/${orgId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.clients) setCrmClients(data.clients);
        if (data.kpi) setKpi(data.kpi);
      }
    } catch (err) {
      console.warn("Backend CRM fetch failed, using local fallback", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId]);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) return;

    const payload = {
      ...newClient,
      id: crmClients.length + 1,
      lastContact: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    };

    setCrmClients([payload, ...crmClients]);
    setKpi({ ...kpi, totalClients: kpi.totalClients + 1, activeAccounts: kpi.activeAccounts + 1 });
    setShowAddModal(false);

    try {
      await fetch(`http://localhost:8081/api/business-director/crm/org/${orgId}/add-client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn("Failed to persist client:", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">05. CLIENTS & CRM</h2>
          <p className="text-xs text-slate-400">Live customer profile accounts, active accounts, and last touchpoints logs</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-500/30 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Account</span>
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold hover:bg-slate-700 hover:text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Clients</div>
          <div className="text-2xl font-bold text-white mt-1">{kpi.totalClients}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Active Accounts</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{kpi.activeAccounts}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Potential Accounts</div>
          <div className="text-2xl font-bold text-yellow-400 mt-1">{kpi.potentialAccounts}</div>
        </div>
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Inactive Accounts</div>
          <div className="text-2xl font-bold text-red-400 mt-1">{kpi.inactiveAccounts}</div>
        </div>
      </div>

      {/* CRM Registry */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Accounts Directory ({crmClients.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/85 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Client Name</th>
                <th className="p-3 font-semibold">Contact Person</th>
                <th className="p-3 font-semibold">Phone</th>
                <th className="p-3 font-semibold text-center">Projects</th>
                <th className="p-3 font-semibold text-center">Status</th>
                <th className="p-3 rounded-r-lg text-right">Last Touchpoint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {crmClients.map((client, idx) => (
                <tr key={client.id || idx} className="hover:bg-slate-850/40">
                  <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                    <Smile className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span>{client.name}</span>
                  </td>
                  <td className="p-3 text-slate-300">{client.contact}</td>
                  <td className="p-3 font-mono">{client.phone}</td>
                  <td className="p-3 text-center text-white font-bold">{client.projects}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      client.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="p-3 text-right text-slate-400 font-mono">{client.lastContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Add New Client Account</h3>
            <form onSubmit={handleAddClient} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Company / Developer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prestige Estates Ltd"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. Anand"
                    value={newClient.contact}
                    onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98..."
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Active Projects</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newClient.projects}
                    onChange={(e) => setNewClient({ ...newClient, projects: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Status</label>
                  <select
                    value={newClient.status}
                    onChange={(e) => setNewClient({ ...newClient, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Potential">Potential</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AIAssistantBar suggestions={["Clients with recent deals?", "Inactive accounts recovery", "CRM overview"]} />
    </div>
  );
}
