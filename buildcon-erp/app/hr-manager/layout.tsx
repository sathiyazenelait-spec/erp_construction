"use client";
import React, { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { usePathname, useRouter } from "next/navigation";
import LinkComponent from "next/link";
import {
  LayoutDashboard, Users, UserPlus, ShieldAlert, Award,
  Calendar, Landmark, Heart, FileText, CheckCircle2, Bot,
  Settings, LogOut, Building2, Bell, Sparkles, BookOpen
} from "lucide-react";
import { logout, getSession } from "@/lib/auth";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function HRManagerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const [tier, setTier] = useState<string>("");
  useEffect(() => {
    const s = getSession();
    if (s) {
      setName(s.name);
      setRole(s.role);
    }
    setTier((localStorage.getItem("selected_login_tier") || "Enterprise").toLowerCase());
  }, []);

  const nav: NavItem[] = [
    { href: "/hr-manager", label: "Executive Summary", icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: "/hr-manager/workforce", label: "Workforce Overview", icon: <Users className="h-4 w-4" /> },
    { href: "/hr-manager/recruitment", label: "Recruitment Center", icon: <UserPlus className="h-4 w-4" /> },
    { href: "/hr-manager/employees", label: "Employee Management", icon: <Users className="h-4 w-4" /> },
    { href: "/hr-manager/attendance", label: "Attendance Management", icon: <Calendar className="h-4 w-4" /> },
    { href: "/hr-manager/payroll", label: "Payroll Center", icon: <Landmark className="h-4 w-4" /> },
    { href: "/hr-manager/leave", label: "Leave Management", icon: <CheckCircle2 className="h-4 w-4" />, badge: 14 },
    { href: "/hr-manager/performance", label: "Performance Management", icon: <Award className="h-4 w-4" /> },
    { href: "/hr-manager/training", label: "Training Center", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/hr-manager/compliance", label: "Compliance Center", icon: <FileText className="h-4 w-4" /> },
    { href: "/hr-manager/engagement", label: "Employee Engagement", icon: <Heart className="h-4 w-4" /> },
    { href: "/hr-manager/ai", label: "AI HR Assistant", icon: <Bot className="h-4 w-4" /> },
    { href: "/hr-manager/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const visibleNav = nav.filter(it => {
    const isAi = it.href.endsWith("/ai") || it.label.toLowerCase().includes("ai");
    return !(isAi && tier === "growth");
  });

  const isLinkActive = (href: string) => {
    if (href === "/hr-manager") {
      return pathname === "/hr-manager";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <AuthGuard role="hr-manager">
      <div className="flex bg-[#0A1120] text-slate-100 min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 bg-[#0F182A] border-r border-slate-800 flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-800 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 grid place-items-center shadow-lg shadow-emerald-500/20">
                <Building2 className="h-5 w-5 text-slate-950 font-bold" />
               </div>
              <div>
                <div className="font-bold text-white tracking-wide">BuildWell</div>
                <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">Constructions</div>
              </div>
            </div>
 
            <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
              {visibleNav.map((it) => {
                const active = isLinkActive(it.href);
                return (
                  <LinkComponent
                    key={it.href}
                    href={it.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold shadow-md shadow-emerald-500/20"
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
            <div className="h-9 w-9 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 grid place-items-center text-sm font-bold shadow-inner">
              {name ? name[0] : "M"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{name || "Meenakshi Iyer"}</div>
              <div className="text-[11px] text-slate-400 font-medium capitalize truncate">HR Manager</div>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/login/manager");
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
                Good Morning, {name || "Meenakshi Iyer"} <span className="animate-pulse">👋</span>
              </h1>
              <p className="text-xs text-slate-400">Workforce Analytics, Recruitment Pipeline, and Payroll control panel.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-[#111C30] border border-slate-850 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-emerald-400" />
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
