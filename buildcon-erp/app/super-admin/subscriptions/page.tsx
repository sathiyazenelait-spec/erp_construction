"use client";
import React, { useState } from "react";
import { CreditCard, Search, ArrowUpRight, DollarSign, CheckCircle2, AlertCircle, RefreshCcw } from "lucide-react";

interface Subscription {
  id: string;
  orgName: string;
  plan: "Enterprise" | "Premium" | "Growth";
  price: string;
  billingCycle: "Yearly" | "Monthly";
  renewalDate: string;
  status: "Active" | "Past Due" | "Canceled";
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

  const updateStatus = (id: string, nextStatus: "Active" | "Past Due" | "Canceled") => {
    setSubs(subs.map(s => s.id === id ? { ...s, status: nextStatus } : s));
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">SUBSCRIPTION PLANS & BILLING</h2>
        <p className="text-xs text-slate-400">Monitor billing lifecycles, active invoices, renewal calendars, and plan tiers</p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Growth Plan Card */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-5 relative overflow-hidden">
          <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">Growth Plan</div>
          <div className="text-2xl font-bold text-white mb-2">₹ 5,000 <span className="text-xs text-slate-500 font-normal">/ month</span></div>
          <p className="text-xs text-slate-400 mb-4">Suitable for regional builders managing up to 5 concurrent project sites.</p>
          <ul className="text-xs text-slate-300 space-y-2 mb-6">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Basic ERP module access</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Max 5 active projects</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Shared AI executive logs</li>
          </ul>
          <span className="text-[10px] bg-slate-800/60 text-slate-400 border border-slate-700/50 px-2 py-1 rounded-lg">8 Tenants Active</span>
        </div>

        {/* Premium Plan Card */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-5 relative overflow-hidden">
          <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Premium Plan</div>
          <div className="text-2xl font-bold text-white mb-2">₹ 15,000 <span className="text-xs text-slate-500 font-normal">/ month</span></div>
          <p className="text-xs text-slate-400 mb-4">Best for scaling firms managing mid-tier infrastructures and resource tracking.</p>
          <ul className="text-xs text-slate-300 space-y-2 mb-6">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-400" /> Advanced Financial Command</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-400" /> Max 20 active projects</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-400" /> Dedicated AI Assistant allocation</li>
          </ul>
          <span className="text-[10px] bg-slate-800/60 text-slate-400 border border-slate-700/50 px-2 py-1 rounded-lg">24 Tenants Active</span>
        </div>

        {/* Enterprise Plan Card */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-5 relative overflow-hidden border-emerald-500/35">
          <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded-bl">MOST REVENUE</div>
          <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">Enterprise Plan</div>
          <div className="text-2xl font-bold text-white mb-2">₹ 1,50,000 <span className="text-xs text-slate-500 font-normal">/ year</span></div>
          <p className="text-xs text-slate-400 mb-4">Complete platform features, limitless project scale, full system access controls, and custom integrations.</p>
          <ul className="text-xs text-slate-300 space-y-2 mb-6">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> Unlimited Projects & AI limits</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> Customized UI / branding config</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> Dedicated database & SLA</li>
          </ul>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg">10 Tenants Active</span>
        </div>
      </div>

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
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.plan === "Enterprise" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                      s.plan === "Premium" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                      "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    }`}>
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
    </div>
  );
}
