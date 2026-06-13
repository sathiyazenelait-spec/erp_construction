"use client";
import React, { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { usePathname, useRouter } from "next/navigation";
import LinkComponent from "next/link";
import {
  LayoutDashboard, Wrench, Calendar, Bell, LogOut, Building2,
  TrendingUp, Eye, ShieldAlert, Users, Award, Hammer, HardDrive,
  FileCheck, ShieldCheck, ShoppingCart, Clock, ClipboardList, Bot, Settings
} from "lucide-react";
import { logout, getSession } from "@/lib/auth";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function ConstructionManagerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const s = getSession();
    if (s) {
      setName(s.name);
      setRole(s.role);
    }
  }, []);

  const nav: NavItem[] = [
    { href: "/construction-manager", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: "/construction-manager/project-progress", label: "Project Progress", icon: <TrendingUp className="h-4 w-4" /> },
    { href: "/construction-manager/site-monitoring", label: "Site Monitoring", icon: <Eye className="h-4 w-4" /> },
    { href: "/construction-manager/resource-management", label: "Resource Management", icon: <Users className="h-4 w-4" /> },
    { href: "/construction-manager/labour-productivity", label: "Labour Productivity", icon: <Award className="h-4 w-4" /> },
    { href: "/construction-manager/material-tracking", label: "Material Tracking", icon: <Hammer className="h-4 w-4" /> },
    { href: "/construction-manager/equipment-monitoring", label: "Equipment Monitoring", icon: <HardDrive className="h-4 w-4" /> },
    { href: "/construction-manager/quality-control", label: "Quality Control", icon: <FileCheck className="h-4 w-4" /> },
    { href: "/construction-manager/safety-center", label: "Safety Center", icon: <ShieldCheck className="h-4 w-4" /> },
    { href: "/construction-manager/procurement", label: "Procurement", icon: <ShoppingCart className="h-4 w-4" /> },
    { href: "/construction-manager/delay-management", label: "Delay Management", icon: <Clock className="h-4 w-4" />, badge: 3 },
    { href: "/construction-manager/daily-site-reports", label: "Daily Site Reports", icon: <ClipboardList className="h-4 w-4" /> },
    { href: "/construction-manager/ai", label: "AI Construction Assistant", icon: <Bot className="h-4 w-4" /> },
    { href: "/construction-manager/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/construction-manager") {
      return pathname === "/construction-manager";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <AuthGuard role="construction-manager">
      <div className="flex bg-[#0A1120] text-slate-100 min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 bg-[#0F182A] border-r border-slate-800 flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-800 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 grid place-items-center shadow-lg shadow-amber-500/20">
                <Building2 className="h-5 w-5 text-slate-950 font-bold" />
              </div>
              <div>
                <div className="font-bold text-white tracking-wide">BuildWell</div>
                <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">Constructions</div>
              </div>
            </div>

            <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
              {nav.map((it) => {
                const active = isLinkActive(it.href);
                return (
                  <LinkComponent
                    key={it.href}
                    href={it.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {it.icon}
                    <span className="flex-1">{it.label}</span>
                    {it.badge ? <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-rose-500 text-white">{it.badge}</span> : null}
                  </LinkComponent>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-800 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-amber-600/20 text-amber-400 border border-amber-500/30 grid place-items-center text-sm font-bold shadow-inner">
              {name ? name[0] : "K"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{name || "Karthik R."}</div>
              <div className="text-[11px] text-slate-400 font-medium capitalize truncate">Construction Manager</div>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="p-1.5 rounded-md text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* TopBar */}
          <header className="bg-[#0F182A]/50 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center gap-4">
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                Good Morning, {name || "Karthik R."} <span className="animate-pulse">👋</span>
              </h1>
              <p className="text-xs text-slate-400">Site Operations, Machinery Deployments, and Productivity command.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-[#111C30] border border-slate-850 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                Wednesday, 28 May 2025
              </div>
              <button className="relative p-2 rounded-lg bg-[#111C30] border border-slate-850 text-slate-300 hover:bg-slate-800">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>
          </header>

          {/* Children Dashboard Content */}
          <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#0A1120]">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
