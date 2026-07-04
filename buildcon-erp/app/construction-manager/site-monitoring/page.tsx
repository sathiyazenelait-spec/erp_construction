"use client";
import React, { useState, useEffect } from "react";
import { Eye, MapPin, Video, Users, AlertTriangle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { getSession } from "@/lib/auth";

export default function SiteMonitoring() {
  const [projects, setProjects] = useState<any[]>([]);
  const [workforceOnsite, setWorkforceOnsite] = useState(0);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getSession();
    const orgId = s?.organizationId || 1;
    const token = localStorage.getItem("buildcon_token");
    const headers = { "Authorization": `Bearer ${token}` };

    const fetchData = async () => {
      try {
        // Fetch projects
        const projRes = await fetch(`https://erp-construction.onrender.com/api/projects/org/${orgId}`, { headers });
        let projData = [];
        if (projRes.ok) {
          projData = await projRes.json();
          setProjects(projData);
        }

        // Fetch workforce audits
        try {
          const wfRes = await fetch(`https://erp-construction.onrender.com/api/workforce-manager/dashboard/org/${orgId}`, { headers });
          if (wfRes.ok) {
            const wfData = await wfRes.json();
            const audits = wfData.audits || [];
            const totalWorkforce = audits.reduce((sum: number, a: any) => sum + (a.actual || 0), 0);
            setWorkforceOnsite(totalWorkforce || 420); // Fallback to 420 if no audits
          }
        } catch (err) {
          console.error("Error fetching workforce details:", err);
        }

        // Fetch alerts
        try {
          const alertsRes = await fetch(`https://erp-construction.onrender.com/api/alerts/org/${orgId}`, { headers });
          if (alertsRes.ok) {
            const alertsData = await alertsRes.json();
            setAlerts(alertsData || []);
          }
        } catch (err) {
          console.error("Error fetching alerts:", err);
        }
      } catch (err) {
        console.error("Error loading site monitoring data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-slate-350 text-xs font-semibold">
        Loading Site Monitoring Analytics...
      </div>
    );
  }

  // Calculate stats
  const totalSites = projects.length;
  const activeMonitoringCount = projects.filter((p) => p.status === "Active").length;
  const openIncidents = alerts.filter((a) => !a.resolved).length;

  // Camera feeds (map first 4 projects or defaults if less than 4)
  const cameraFeeds = projects.length > 0 
    ? projects.slice(0, 4).map((p, idx) => {
        const isActive = p.status === "Active";
        const locationParts = p.location ? p.location.split(" ") : [];
        const cityName = locationParts[0] || "Chennai";
        return {
          site: p.name,
          location: `Site ${String.fromCharCode(65 + idx)} - ${cityName}`,
          camera: `Cam ${idx + 1} (${idx === 0 ? "Gate A" : idx === 1 ? "Tower B" : idx === 2 ? "Material Yard" : "Office Block"})`,
          status: isActive ? "Active" : "Offline",
          time: isActive ? "Live" : "Last sync 2h"
        };
      })
    : [
        { site: "Skyline Residences", location: "Site A - Chennai", camera: "Cam 1 (Gate A)", status: "Active", time: "Live" },
        { site: "Greenfield Apartments", location: "Site B - Coimbatore", camera: "Cam 3 (Tower B)", status: "Active", time: "Live" },
        { site: "Phoenix Commercial", location: "Site C - Chennai", camera: "Cam 2 (Material Yard)", status: "Active", time: "Live" },
        { site: "Lakeview Villas", location: "Site D - Madurai", camera: "Cam 5 (Office Block)", status: "Offline", time: "Last sync 2h" }
      ];

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
            <div className="text-xl font-bold text-white">{totalSites} Sites</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Active Monitoring</div>
            <div className="text-xl font-bold text-white">{activeMonitoringCount} Sites Online</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Total Workers On Site</div>
            <div className="text-xl font-bold text-white">{workforceOnsite} Workers</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-400 grid place-items-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Open Incidents / Gaps</div>
            <div className="text-xl font-bold text-rose-400">{openIncidents} Gaps</div>
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
            {cameraFeeds.map((feed, idx) => (
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
                  <Video className={`h-6 w-6 ${feed.status === "Active" ? "text-emerald-400 animate-pulse" : "text-slate-600"}`} />
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
            
            <div className="bg-[#0e1628] border border-slate-800 rounded-lg p-4 h-56 overflow-y-auto text-xs text-slate-400 flex flex-col gap-2">
              {projects.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-800 last:border-0">
                  <span className="font-medium text-slate-200 truncate max-w-[150px]">{p.name}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-blue-400 shrink-0" />
                    {p.location || "Unknown"}
                  </span>
                </div>
              ))}
              {projects.length === 0 && (
                <span className="text-[10px] text-slate-500 text-center mt-12">No active project locations</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Request live drone feed of Site A", "Why is Site D camera offline?", "Check site access authorization codes"]} />
    </div>
  );
}
