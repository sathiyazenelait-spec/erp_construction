"use client";
import React from "react";
import { HardDrive, Wrench, ShieldAlert } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function FixedAssetsInventory() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">FIXED ASSETS INVENTORY</h2>
        <p className="text-xs text-slate-400">Track company physical assets, site heavy machineries, capital depreciation registers, and asset values.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Total Fixed Assets</div>
            <div className="text-xl font-bold text-white">₹42.5 Cr</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Heavy Equipment Units</div>
            <div className="text-xl font-bold text-white">18 Active Cranes/Mixers</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-yellow-500/10 text-yellow-400 grid place-items-center">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Depreciation MTD</div>
            <div className="text-xl font-bold text-amber-400">₹8.4 L</div>
          </div>
        </div>
      </div>

      {/* Asset register table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Capital Asset Register & Depreciation Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Asset Code</th>
                <th className="pb-2">Description / Asset Name</th>
                <th className="pb-2">Purchase Date</th>
                <th className="pb-2">Purchase Cost</th>
                <th className="pb-2">Book Value</th>
                <th className="pb-2">Depreciation Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["AST-CRN-001", "Tower Crane Liebherr 150 EC-B", "12 Mar 2023", "₹4.5 Cr", "₹3.8 Cr", "15% WDV"],
                ["AST-MIX-008", "Mobile Concrete Mixer Truck", "08 Sep 2024", "₹85 L", "₹76 L", "15% WDV"],
                ["AST-OFF-104", "Madurai Office IT Servers & UPS", "15 Jan 2025", "₹22 L", "₹18 L", "40% SLM"],
                ["AST-EXC-003", "Hydraulic Excavator CAT 320", "20 May 2023", "₹1.2 Cr", "₹98 L", "15% WDV"]
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-medium text-slate-450 text-slate-450 text-slate-400">{row[0]}</td>
                  <td className="text-slate-200 font-semibold">{row[1]}</td>
                  <td className="text-slate-400">{row[2]}</td>
                  <td className="text-slate-350 font-medium">{row[3]}</td>
                  <td className="text-emerald-400 font-bold">{row[4]}</td>
                  <td className="text-slate-350">{row[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Calculate annual depreciation forecast", "List fully depreciated assets", "Download complete Asset Register (.csv)"]} />
    </div>
  );
}
