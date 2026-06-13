"use client";
import React, { useState, useEffect } from "react";
import { Building2, Plus, Search, ShieldCheck, Mail, MapPin, Globe, Sparkles, Trash2 } from "lucide-react";

interface Org {
  id: number;
  name: string;
  domain: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  subscriptionTier: string;
}

export default function ManageOrganizations() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [chairmanEmail, setChairmanEmail] = useState("");
  const [chairmanPassword, setChairmanPassword] = useState("");
  const [chairmanConfirmPassword, setChairmanConfirmPassword] = useState("");
  const [tier, setTier] = useState("Enterprise");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [search, setSearch] = useState("");

  const getHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("buildcon_token") : null;
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  };

  const loadOrgs = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8081/api/organizations", {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to load organizations.");
      const data = await res.json();
      setOrgs(data);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrgs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !domain || !chairmanEmail || !chairmanPassword) return;

    if (chairmanPassword !== chairmanConfirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const payload = {
        name,
        domain,
        subscriptionTier: tier,
        location: location || "Global",
        phone: phone || "N/A",
        chairmanEmail,
        chairmanPassword
      };

      const res = await fetch("http://localhost:8081/api/organizations", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to create organization.");
      }

      setName("");
      setDomain("");
      setChairmanEmail("");
      setChairmanPassword("");
      setChairmanConfirmPassword("");
      setTier("Enterprise");
      setLocation("");
      setPhone("");
      setShowModal(false);
      loadOrgs();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this organization?")) return;
    try {
      const res = await fetch(`http://localhost:8081/api/organizations/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to delete organization.");
      loadOrgs();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredOrgs = orgs.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">ORGANIZATION DIRECTORY</h2>
          <p className="text-xs text-slate-400">View and manage tenant organizations subscribed to BuildCon ERP</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg px-4 py-2 text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 hover:brightness-110 transition-all"
        >
          <Plus className="h-4 w-4" />
          Create Organization
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-4 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            placeholder="Search organizations by name or domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#080d18] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Orgs List */}
      <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-xs text-slate-400">Loading organizations...</div>
          ) : error ? (
            <div className="p-10 text-center text-xs text-red-400">{error}</div>
          ) : filteredOrgs.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400">No organizations found.</div>
          ) : (
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-[#0c1220] text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4 font-semibold">Organization Name</th>
                  <th className="p-4 font-semibold">Domain</th>
                  <th className="p-4 font-semibold">Chairman Email</th>
                  <th className="p-4 font-semibold">Subscription Tier</th>
                  <th className="p-4 font-semibold">Location</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredOrgs.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-semibold text-white flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 grid place-items-center">
                        <Building2 className="h-4 w-4 text-emerald-400" />
                      </div>
                      {o.name}
                    </td>
                    <td className="p-4 font-mono text-slate-400">{o.domain}</td>
                    <td className="p-4 text-slate-300">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                        {o.email}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        o.subscriptionTier === "Enterprise" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                        o.subscriptionTier === "Premium" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}>
                        {o.subscriptionTier}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        {o.address}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        o.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(o.id)}
                        className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Delete Organization"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Org Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-slate-800 rounded-xl w-full max-w-md p-6 relative">
            <h3 className="text-sm font-semibold text-white mb-4">Create New Tenant Organization</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#080d18] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  placeholder="e.g. Landmark Infrastructure"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Email Domain</label>
                  <input
                    type="text"
                    required
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full bg-[#080d18] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                    placeholder="landmark.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Chairman Email</label>
                  <input
                    type="email"
                    required
                    value={chairmanEmail}
                    onChange={(e) => setChairmanEmail(e.target.value)}
                    className="w-full bg-[#080d18] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                    placeholder="chairman@landmark.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Chairman Password</label>
                  <input
                    type="password"
                    required
                    value={chairmanPassword}
                    onChange={(e) => setChairmanPassword(e.target.value)}
                    className="w-full bg-[#080d18] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={chairmanConfirmPassword}
                    onChange={(e) => setChairmanConfirmPassword(e.target.value)}
                    className="w-full bg-[#080d18] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Subscription Tier</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full bg-[#080d18] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Enterprise">Enterprise</option>
                    <option value="Premium">Premium</option>
                    <option value="Growth">Growth</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#080d18] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                    placeholder="Chennai, India"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#080d18] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-800 text-slate-400 hover:text-white rounded-lg px-4 py-2 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-1"
                >
                  <Sparkles className="h-4 w-4" />
                  Register Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

