"use client";
import React, { useState, useEffect } from "react";
import { 
  CreditCard, Search, ArrowUpRight, DollarSign, CheckCircle2, 
  AlertCircle, RefreshCcw, Plus, Trash2, Edit2, X, Save, Sparkles 
} from "lucide-react";

interface Subscription {
  id: string;
  orgName: string;
  plan: string;
  price: string;
  billingCycle: "Yearly" | "Monthly";
  renewalDate: string;
  status: "Active" | "Past Due" | "Canceled";
}

interface Package {
  id?: number;
  name: string;
  badge: string;
  price: string;
  description: string;
  themeColor: string;
  features: string[];
}

const INITIAL_SUBS: Subscription[] = [
  { id: "sub-1", orgName: "BuildCon Constructions", plan: "Enterprise", price: "₹ 1,50,000", billingCycle: "Yearly", renewalDate: "2026-12-15", status: "Active" },
  { id: "sub-2", orgName: "Apex Builders Group", plan: "Premium", price: "₹ 15,000", billingCycle: "Monthly", renewalDate: "2026-06-25", status: "Active" },
  { id: "sub-3", orgName: "Metro Infrastructure Ltd", plan: "Enterprise", price: "₹ 1,80,000", billingCycle: "Yearly", renewalDate: "2027-01-10", status: "Active" },
  { id: "sub-4", orgName: "Skyline Realty & Housing", plan: "Growth", price: "₹ 5,000", billingCycle: "Monthly", renewalDate: "2026-06-12", status: "Past Due" },
];

export default function ManageSubscriptions() {
  const [subs, setSubs] = useState<Subscription[]>(INITIAL_SUBS);
  const [search, setSearch] = useState("");
  
  // Package states
  const [packages, setPackages] = useState<Package[]>([]);
  const [loadingPkgs, setLoadingPkgs] = useState(true);
  const [error, setError] = useState("");

  // Modal / Form states
  const [showModal, setShowModal] = useState(false);
  const [editPkg, setEditPkg] = useState<Package | null>(null);
  const [formName, setFormName] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formThemeColor, setFormThemeColor] = useState("blue");
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [newFeatureText, setNewFeatureText] = useState("");

  const getHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("buildcon_token") : null;
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  };

  const fetchPackages = async () => {
    try {
      setLoadingPkgs(true);
      const res = await fetch("http://localhost:8081/api/packages", {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to load packages.");
      const data = await res.json();
      setPackages(data);
    } catch (err: any) {
      setError(err.message || "An error occurred loading packages.");
    } finally {
      setLoadingPkgs(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const openAddModal = () => {
    setEditPkg(null);
    setFormName("");
    setFormBadge("");
    setFormPrice("");
    setFormDescription("");
    setFormThemeColor("blue");
    setFormFeatures([]);
    setNewFeatureText("");
    setShowModal(true);
  };

  const openEditModal = (pkg: Package) => {
    setEditPkg(pkg);
    setFormName(pkg.name);
    setFormBadge(pkg.badge);
    setFormPrice(pkg.price);
    setFormDescription(pkg.description);
    setFormThemeColor(pkg.themeColor);
    setFormFeatures([...pkg.features]);
    setNewFeatureText("");
    setShowModal(true);
  };

  const addFeature = () => {
    if (newFeatureText.trim() && !formFeatures.includes(newFeatureText.trim())) {
      setFormFeatures([...formFeatures, newFeatureText.trim()]);
      setNewFeatureText("");
    }
  };

  const removeFeature = (index: number) => {
    setFormFeatures(formFeatures.filter((_, i) => i !== index));
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Package = {
      name: formName,
      badge: formBadge,
      price: formPrice,
      description: formDescription,
      themeColor: formThemeColor,
      features: formFeatures
    };

    try {
      let url = "http://localhost:8081/api/packages";
      let method = "POST";

      if (editPkg && editPkg.id) {
        url = `http://localhost:8081/api/packages/${editPkg.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method: method,
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save package.");
      await fetchPackages();
      setShowModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeletePackage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      const res = await fetch(`http://localhost:8081/api/packages/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to delete package.");
      await fetchPackages();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const updateStatus = (id: string, nextStatus: "Active" | "Past Due" | "Canceled") => {
    setSubs(subs.map(s => s.id === id ? { ...s, status: nextStatus } : s));
  };

  // Helper to resolve card color themes dynamically
  const getThemeClasses = (color: string) => {
    switch (color) {
      case "emerald":
        return {
          border: "border-emerald-500/20 hover:border-emerald-500/40",
          text: "text-emerald-400",
          badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        };
      case "purple":
        return {
          border: "border-purple-500/20 hover:border-purple-500/40",
          text: "text-purple-400",
          badge: "bg-purple-500/10 text-purple-400 border border-purple-500/20"
        };
      case "rose":
        return {
          border: "border-rose-500/20 hover:border-rose-500/40",
          text: "text-rose-400",
          badge: "bg-rose-500/10 text-rose-400 border border-rose-500/20"
        };
      case "amber":
        return {
          border: "border-amber-500/20 hover:border-amber-500/40",
          text: "text-amber-400",
          badge: "bg-amber-500/10 text-amber-400 border border-amber-500/20"
        };
      case "blue":
      default:
        return {
          border: "border-blue-500/20 hover:border-blue-500/40",
          text: "text-blue-400",
          badge: "bg-blue-500/10 text-blue-400 border border-blue-500/20"
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">SUBSCRIPTION PLANS & BILLING</h2>
          <p className="text-xs text-slate-400">Monitor billing lifecycles, active invoices, renewal calendars, and plan tiers</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white font-bold py-2 px-4 rounded-lg text-xs transition flex items-center gap-2 shadow-md shadow-emerald-500/10"
        >
          <Plus className="h-4 w-4" /> Create Subscription Package
        </button>
      </div>

      {/* Plans Grid */}
      {loadingPkgs ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCcw className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 text-xs text-rose-400 bg-rose-950/20 border border-rose-500/20 rounded-xl">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((p) => {
            const theme = getThemeClasses(p.themeColor);
            return (
              <div 
                key={p.id} 
                className={`bg-[#0e1628] border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 ${theme.border}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${theme.badge}`}>
                      {p.badge}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(p)}
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                        title="Edit Plan"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => p.id && handleDeletePackage(p.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
                        title="Delete Plan"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{p.name} Plan</div>
                  <div className="text-2xl font-bold text-white mb-2">{p.price}</div>
                  <p className="text-xs text-slate-400 mb-4 min-h-[32px]">{p.description}</p>
                  
                  <ul className="text-xs text-slate-350 space-y-2 mb-6 border-t border-slate-800/80 pt-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Features included:</span>
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subscription List */}
      <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-200">Active Billing Contracts</h3>
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              placeholder="Search contracts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#080d18] border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-[#0c1220] text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 font-semibold">Tenant Organization</th>
                <th className="p-3 font-semibold">Plan Tier</th>
                <th className="p-3 font-semibold">Subscription Rate</th>
                <th className="p-3 font-semibold">Billing Period</th>
                <th className="p-3 font-semibold">Next Invoice Date</th>
                <th className="p-3 font-semibold">Billing Status</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {subs.filter(s => s.orgName.toLowerCase().includes(search.toLowerCase())).map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-3 font-medium text-white">{s.orgName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {s.plan}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-200">{s.price}</td>
                  <td className="p-3 text-slate-400">{s.billingCycle}</td>
                  <td className="p-3 text-slate-300">{s.renewalDate}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 w-fit ${
                      s.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      s.status === "Past Due" ? "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse" :
                      "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                    }`}>
                      {s.status === "Active" ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : <AlertCircle className="h-3 w-3 text-red-400" />}
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex gap-2 justify-end">
                      {s.status !== "Active" && (
                        <button
                          onClick={() => updateStatus(s.id, "Active")}
                          className="bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded px-2.5 py-1 text-[10px] font-bold transition-all"
                        >
                          Resolve Past Due
                        </button>
                      )}
                      {s.status === "Active" && (
                        <button
                          onClick={() => updateStatus(s.id, "Past Due")}
                          className="bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded px-2.5 py-1 text-[10px] font-bold transition-all"
                        >
                          Trigger Late Alert
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Package Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-300">
          <div className="w-full max-w-lg bg-[#0e1628] border border-slate-800 rounded-2xl shadow-xl flex flex-col max-h-[90vh] animate-scaleIn">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-850">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
                {editPkg ? "Edit Package Plan" : "Create Subscription Package"}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSavePackage} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Package Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Growth"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#080d18] border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Essential"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full bg-[#080d18] border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Price Rate</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹3,299 / month"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-[#080d18] border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Theme Accent Color</label>
                  <select
                    value={formThemeColor}
                    onChange={(e) => setFormThemeColor(e.target.value)}
                    className="w-full bg-[#080d18] border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                  >
                    <option value="blue">Blue (Default / Premium)</option>
                    <option value="emerald">Emerald (Growth / Essential)</option>
                    <option value="purple">Purple (Enterprise / Suite)</option>
                    <option value="rose">Rose (Premium Alternative)</option>
                    <option value="amber">Amber (Warning / Trial)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Tailored for small building contractors..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-[#080d18] border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Dynamic features checklist builder */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Manage Included Features</label>
                
                {/* Feature Add Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add plan feature description..."
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    className="flex-1 bg-[#080d18] border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Features Chip List */}
                <div className="bg-[#080d18] border border-slate-800 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                  {formFeatures.length === 0 ? (
                    <span className="text-slate-500 italic">No features added yet. Add at least one feature.</span>
                  ) : (
                    formFeatures.map((feat, index) => (
                      <div key={index} className="flex justify-between items-center bg-[#111c30] border border-slate-800 rounded-lg p-2 gap-2 text-white">
                        <span className="break-all">{feat}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-rose-400 hover:text-rose-500 p-0.5 rounded hover:bg-rose-950/20 transition-colors shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-850 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white font-bold px-5 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/10"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
