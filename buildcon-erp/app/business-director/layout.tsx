"use client";
import React, { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { usePathname, useRouter } from "next/navigation";
import LinkComponent from "next/link";
import {
  LayoutDashboard, Target, TrendingUp, FileText, Users, Megaphone, FolderKanban, FileEdit,
  BarChart3, Bot, Trophy, Settings, LogOut, Building2, Bell, Calendar
} from "lucide-react";
import { logout, getSession } from "@/lib/auth";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function BDDLayout({ children }: { children: React.ReactNode }) {
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
    { href: "/business-director", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: "/business-director/leads", label: "Leads Management", icon: <Target className="h-4 w-4" /> },
    { href: "/business-director/opportunities", label: "Opportunities", icon: <FolderKanban className="h-4 w-4" /> },
    { href: "/business-director/tenders", label: "Tenders", icon: <FileText className="h-4 w-4" /> },
    { href: "/business-director/crm", label: "Clients & CRM", icon: <Users className="h-4 w-4" /> },
    { href: "/business-director/marketing", label: "Marketing Analytics", icon: <Megaphone className="h-4 w-4" /> },
    { href: "/business-director/pipeline", label: "Sales Pipeline", icon: <TrendingUp className="h-4 w-4" /> },
    { href: "/business-director/proposals", label: "Proposals", icon: <FileEdit className="h-4 w-4" /> },
    { href: "/business-director/competitor", label: "Competitor Analysis", icon: <BarChart3 className="h-4 w-4" /> },
    { href: "/business-director/reports", label: "Reports & Analytics", icon: <FileText className="h-4 w-4" /> },
    { href: "/business-director/ai", label: "AI Sales Assistant", icon: <Bot className="h-4 w-4" /> },
    { href: "/business-director/targets", label: "Targets & Incentives", icon: <Trophy className="h-4 w-4" /> },
    { href: "/business-director/team", label: "Team Performance", icon: <Users className="h-4 w-4" /> },
    { href: "/business-director/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/business-director") {
      return pathname === "/business-director";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <AuthGuard role="business-director">
      <div className="flex bg-[#0A1120] text-slate-100 min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 bg-[#0F182A] border-r border-slate-800 flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-800 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 grid place-items-center shadow-lg shadow-amber-500/20">
                <Building2 className="h-5 w-5 text-slate-950 font-bold" />
              </div>
              <div>
                <div className="font-bold text-white tracking-wide">BuildWell</div>
                <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">Constructions</div>
              </div>
            </div>

            <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] animate-fadeIn">
              {nav.map((it) => {
                const active = isLinkActive(it.href);
                return (
                  <LinkComponent
                    key={it.href}
                    href={it.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-blue-600/95 to-blue-500/95 text-white font-semibold shadow-md shadow-blue-500/20"
                        : "text-slate-450 text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {it.icon}
                    <span className="flex-1">{it.label}</span>
                    {it.badge ? <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-500 text-white">{it.badge}</span> : null}
                  </LinkComponent>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-800 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 grid place-items-center text-sm font-bold shadow-inner">
              {name ? name[0] : "R"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{name || "Rajesh Verma"}</div>
              <div className="text-[11px] text-slate-400 font-medium capitalize truncate">Business Development</div>
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
                Good Morning, {name || "Rajesh Verma"} <span className="animate-pulse">👋</span>
              </h1>
              <p className="text-xs text-slate-400">Business Development Operational command console.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-[#111C30] border border-slate-850 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-blue-400" />
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
