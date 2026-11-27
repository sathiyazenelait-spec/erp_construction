"use client";
import React, { useState, useEffect } from "react";
import { Target, Search, Filter, Plus, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { getSession } from "@/lib/auth";

export default function LeadsManagement() {
  const [leadsLog, setLeadsLog] = useState<any[]>([
    { id: 1, name: "Ravi Kumar", source: "Google Ads", phone: "+91 98765 43210", location: "Chennai", budget: "₹80 Lakhs - 1.2 Cr", status: "Qualified" },
    { id: 2, name: "Anita Verma", source: "Website", phone: "+91 87654 32109", location: "Chennai", budget: "₹1.5 Cr - 2.0 Cr", status: "Qualified" },
    { id: 3, name: "Manoj Singh", source: "Referral", phone: "+91 76543 21098", location: "Coimbatore", budget: "₹75 Lakhs - 1.0 Cr", status: "Working" },
    { id: 4, name: "Priya Iyer", source: "Website", phone: "+91 65432 10987", location: "Bangalore", budget: "₹2.0 Cr - 3.0 Cr", status: "New" },
    { id: 5, name: "Arun Prakash", source: "Social Media", phone: "+91 95432 10987", location: "Trichy", budget: "₹50 Lakhs - 80 Lakhs", status: "Working" },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    source: "Google Ads",
    phone: "",
    location: "Chennai",
    budget: "₹1.0 Cr - 1.5 Cr",
    status: "Qualified"
  });

  const session = getSession();
  const orgId = session?.organizationId || 1;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/business-director/leads/org/${orgId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.leads) setLeadsLog(data.leads);
      }
    } catch (err) {
      console.warn("Backend leads fetch failed, using fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId]);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name) return;

    const payload = { ...newLead, id: leadsLog.length + 1 };
    setLeadsLog([payload, ...leadsLog]);
    setShowAddModal(false);

    try {
      await fetch(`http://localhost:8081/api/business-director/leads/org/${orgId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn("Failed to persist lead:", e);
    }
  };

  const filteredLeads = filterStatus === "ALL" ? leadsLog : leadsLog.filter((l) => l.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">02. LEADS MANAGEMENT</h2>
          <p className="text-xs text-slate-400">Incoming inquiries, marketing leads, and customer details</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#111C30] border border-slate-800 rounded-lg p-1 text-xs">
            {["ALL", "Qualified", "Working", "New"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-md transition ${filterStatus === st ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:text-white"}`}
              >
                {st}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-500/30 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold hover:bg-slate-700 hover:text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Leads Table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Live Leads Pipeline ({filteredLeads.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-350">
            <thead className="bg-[#0E1726]/85 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold rounded-l-lg">Lead Name</th>
                <th className="p-3 font-semibold">Source</th>
                <th className="p-3 font-semibold">Phone Contact</th>
                <th className="p-3 font-semibold">Location</th>
                <th className="p-3 font-semibold">Budget (₹)</th>
                <th className="p-3 font-semibold rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLeads.map((lead, idx) => (
                <tr key={lead.id || idx} className="hover:bg-slate-850/40">
                  <td className="p-3 font-medium text-white flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span>{lead.name}</span>
                  </td>
                  <td className="p-3 text-slate-300">{lead.source}</td>
                  <td className="p-3 font-mono">{lead.phone}</td>
                  <td className="p-3 text-slate-400">{lead.location}</td>
                  <td className="p-3 text-white font-semibold">{lead.budget}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      lead.status === "Qualified" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      lead.status === "Working" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                      "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Capture Inbound Lead</h3>
            <form onSubmit={handleAddLead} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Prospect Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Kumar"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Lead Source</label>
                  <select
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Google Ads">Google Ads</option>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Walk-in">Walk-in</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+91..."
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Target Location</label>
                  <input
                    type="text"
                    value={newLead.location}
                    onChange={(e) => setNewLead({ ...newLead, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Status</label>
                  <select
                    value={newLead.status}
                    onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Qualified">Qualified</option>
                    <option value="Working">Working</option>
                    <option value="New">New</option>
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
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AIAssistantBar suggestions={["Best converting source?", "Qualified leads summary", "Uncontacted leads"]} />
    </div>
  );
}
