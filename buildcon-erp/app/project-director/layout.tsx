"use client";
import React, { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { usePathname, useRouter } from "next/navigation";
import LinkComponent from "next/link";
import {
  LayoutDashboard, FolderKanban, Activity, Users, Wallet, Boxes, ShoppingCart, ShieldCheck,
  AlertTriangle, Clock, FileEdit, FileText, Bot, Settings, LogOut, Building2, Bell, Calendar
} from "lucide-react";
import { logout, getSession } from "@/lib/auth";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function PDLayout({ children }: { children: React.ReactNode }) {
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
    { href: "/project-director", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: "/project-director/portfolio", label: "Portfolio Overview", icon: <FolderKanban className="h-4 w-4" /> },
    { href: "/project-director/monitoring", label: "Project Monitoring", icon: <Activity className="h-4 w-4" /> },
    { href: "/project-director/pm", label: "PM Performance", icon: <Users className="h-4 w-4" /> },
    { href: "/project-director/budget", label: "Budget Monitoring", icon: <Wallet className="h-4 w-4" /> },
    { href: "/project-director/resources", label: "Resource Allocation", icon: <Boxes className="h-4 w-4" /> },
    { href: "/project-director/procurement", label: "Procurement Tracking", icon: <ShoppingCart className="h-4 w-4" /> },
    { href: "/project-director/quality", label: "Quality Center", icon: <ShieldCheck className="h-4 w-4" /> },
    { href: "/project-director/safety", label: "Safety Monitoring", icon: <ShieldCheck className="h-4 w-4" /> },
    { href: "/project-director/risk", label: "Risk Center", icon: <AlertTriangle className="h-4 w-4" /> },
    { href: "/project-director/delays", label: "Delay Management", icon: <Clock className="h-4 w-4" /> },
    { href: "/project-director/changes", label: "Change Orders", icon: <FileEdit className="h-4 w-4" /> },
    { href: "/project-director/reports", label: "Reports & Analytics", icon: <FileText className="h-4 w-4" /> },
    { href: "/project-director/ai", label: "AI Project Assistant", icon: <Bot className="h-4 w-4" /> },
    { href: "/project-director/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/project-director") {
      return pathname === "/project-director";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <AuthGuard role="project-director">
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
              {name ? name[0] : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{name || "Arvind Menon"}</div>
              <div className="text-[11px] text-slate-400 font-medium capitalize truncate">Project Director</div>
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
                Good Morning, {name || "Arvind Menon"} <span className="animate-pulse">👋</span>
              </h1>
              <p className="text-xs text-slate-400">Project Portfolio Command Console.</p>
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
