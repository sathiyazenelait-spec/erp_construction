"use client";
import React from "react";
import AiBlueprintStudio from "@/components/AiBlueprintStudio";
import Link from "next/link";
import { ArrowLeft, Globe, Shield } from "lucide-react";

export default function PublicDrawingPage() {
  return (
    <div className="min-h-screen bg-[#070B14] text-white">
      {/* Top Navigation Bar */}
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
            <span className="font-bold text-white text-sm tracking-wide">BuildCon CAD Studio</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Globe className="w-3 h-3 text-amber-400" />
              Public Guest User (3 Daily Generations)
            </span>
          </div>
        </div>

        {/* Quick Links to Organization User Roles */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 hidden sm:inline">Organization Infinity Plans:</span>
          <Link
            href="/drawing/client"
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600/30 text-slate-300 hover:text-cyan-300 border border-slate-700 transition font-medium"
          >
            Client
          </Link>
          <Link
            href="/drawing/pm"
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600/30 text-slate-300 hover:text-cyan-300 border border-slate-700 transition font-medium"
          >
            PM
          </Link>
          <Link
            href="/drawing/admin"
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600/30 text-slate-300 hover:text-cyan-300 border border-slate-700 transition font-medium"
          >
            Admin
          </Link>
          <Link
            href="/drawing/contractor"
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600/30 text-slate-300 hover:text-cyan-300 border border-slate-700 transition font-medium"
          >
            Contractor
          </Link>
        </div>
      </header>

      {/* Main Studio Canvas with Public User Quota Enforced */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        <AiBlueprintStudio userRole="public" orgId={1} />
      </main>
    </div>
  );
}
