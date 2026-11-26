"use client";
import React from "react";
import AiBlueprintStudio from "@/components/AiBlueprintStudio";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Building2, ShieldCheck, Globe } from "lucide-react";

export default function OrganizationRoleDrawingPage() {
  const params = useParams();
  const roleParam = typeof params?.role === "string" ? params.role.toLowerCase() : "client";

  const roleTitles: Record<string, { label: string; badge: string; color: string }> = {
    client: { label: "Client Executive Portal", badge: "CLIENT VIEW", color: "text-purple-400 bg-purple-500/20 border-purple-500/30" },
    pm: { label: "Project Manager Engineering Hub", badge: "PM ARCHITECT", color: "text-cyan-400 bg-cyan-500/20 border-cyan-500/30" },
    admin: { label: "Super-Admin Infrastructure Suite", badge: "ADMIN SUPERIOR", color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30" },
    pd: { label: "Project Director Strategic Control", badge: "DIRECTOR SUITE", color: "text-blue-400 bg-blue-500/20 border-blue-500/30" },
    contractor: { label: "Contractor On-Site BIM Workstation", badge: "CONTRACTOR PRO", color: "text-amber-400 bg-amber-500/20 border-amber-500/30" },
  };

  const currentRoleInfo = roleTitles[roleParam] || {
    label: `${roleParam.toUpperCase()} Workspace`,
    badge: roleParam.toUpperCase(),
    color: "text-cyan-400 bg-cyan-500/20 border-cyan-500/30"
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white">
      {/* Top Organization Navigation Bar */}
      <header className="border-b border-slate-800 bg-[#0A0F1D]/90 backdrop-blur-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ERP Home</span>
          </Link>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm tracking-wide">{currentRoleInfo.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${currentRoleInfo.color}`}>
              <Building2 className="w-3 h-3" />
              {currentRoleInfo.badge} • ♾️ Unlimited Generations
            </span>
          </div>
        </div>

        {/* Switcher & Public Portal Link */}
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/drawing"
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition font-medium flex items-center gap-1"
          >
            <Globe className="w-3 h-3" />
            <span>Public User (3/day)</span>
          </Link>
          <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />
          <span className="text-slate-400 hidden sm:inline">Switch Role:</span>
          {["client", "pm", "admin", "pd", "contractor"].map((r) => (
            <Link
              key={r}
              href={`/drawing/${r}`}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition ${
                r === roleParam
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              {r.toUpperCase()}
            </Link>
          ))}
        </div>
      </header>

      {/* Main Studio Canvas with Organization Unlimited Quota */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        <AiBlueprintStudio userRole={roleParam} orgId={1} />
      </main>
    </div>
  );
}
