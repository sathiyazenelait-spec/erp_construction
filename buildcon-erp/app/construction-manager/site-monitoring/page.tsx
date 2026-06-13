"use client";
import React from "react";
import { Eye, MapPin, Video, Users, AlertTriangle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function SiteMonitoring() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">02. SITE MONITORING</h2>
        <p className="text-xs text-slate-400">Live feed logs, active personnel counts, and geological maps across all construction sites.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Total Sites Registered</div>
            <div className="text-xl font-bold text-white">12 Sites</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Active Monitoring</div>
            <div className="text-xl font-bold text-white">9 Sites Online</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Total Workers On Site</div>
            <div className="text-xl font-bold text-white">420 Workers</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-400 grid place-items-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Open Incidents / Gaps</div>
            <div className="text-xl font-bold text-rose-455 text-rose-450 text-rose-400">4 Gaps</div>
          </div>
        </div>
      </div>

      {/* Camera feeds & Maps */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Video className="h-4 w-4 text-rose-400" />
            Live Feed Logs & Active Sites
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            {[
              { site: "Skyline Residences", location: "Site A - Chennai", camera: "Cam 1 (Gate A)", status: "Active", time: "Live" },
              { site: "Greenfield Apartments", location: "Site B - Coimbatore", camera: "Cam 3 (Tower B)", status: "Active", time: "Live" },
              { site: "Phoenix Commercial", location: "Site C - Chennai", camera: "Cam 2 (Material Yard)", status: "Active", time: "Live" },
              { site: "Lakeview Villas", location: "Site D - Madurai", camera: "Cam 5 (Office Block)", status: "Offline", time: "Last sync 2h" }
            ].map((feed, idx) => (
              <div key={idx} className="bg-[#0e1628] border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-white">{feed.site}</div>
                    <div className="text-[10px] text-slate-400">{feed.location}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                    feed.status === "Active" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}>
                    {feed.status}
                  </span>
                </div>
                <div className="bg-slate-900 aspect-video rounded-lg flex items-center justify-center border border-slate-800 text-[10px] text-slate-400 flex-col gap-2">
                  <Video className={`h-6 w-6 ${feed.status === "Active" ? "text-emerald-400 animate-pulse" : "text-slate-655 text-slate-600"}`} />
                  <span>{feed.camera} ({feed.time})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map View */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-400" />
              Site Map View
            </h3>
            <p className="text-xs text-slate-400 mb-4">Geological tracking of Chennai, Coimbatore and Madurai active construction operations.</p>
            <div className="bg-[#0e1628] border border-slate-800 rounded-lg h-56 flex items-center justify-center text-xs text-slate-450 text-slate-400 flex-col gap-2">
              <span>📍 Chennai Hub (Site A, C)</span>
              <span>📍 Coimbatore Hub (Site B)</span>
              <span>📍 Madurai Hub (Site D)</span>
              <span className="text-[10px] text-slate-500 mt-4">Static Maps Rendering Center</span>
            </div>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Request live drone feed of Site A", "Why is Site D camera offline?", "Check site access authorization codes"]} />
    </div>
  );
}
