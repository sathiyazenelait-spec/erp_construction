"use client";
import React, { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { usePathname, useRouter } from "next/navigation";
import LinkComponent from "next/link";
import {
  LayoutDashboard, Building2, CreditCard, Box, Activity, Cpu, Settings, LogOut, Calendar, Bell, ShieldCheck
} from "lucide-react";
import { logout, getSession } from "@/lib/auth";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
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
    { href: "/super-admin", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: "/super-admin/organizations", label: "Organizations", icon: <Building2 className="h-4 w-4" /> },
    { href: "/super-admin/subscriptions", label: "Subscriptions", icon: <CreditCard className="h-4 w-4" /> },
    { href: "/super-admin/modules", label: "ERP Modules", icon: <Box className="h-4 w-4" /> },
    { href: "/super-admin/ai", label: "AI Configuration", icon: <Cpu className="h-4 w-4" /> },
    { href: "/super-admin/health", label: "System Health", icon: <Activity className="h-4 w-4" />, badge: 0 },
    { href: "/super-admin/settings", label: "Global Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/super-admin") {
      return pathname === "/super-admin";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <AuthGuard role="super-admin">
      <div className="flex bg-[#080d18] text-slate-100 min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 bg-[#0c1220] border-r border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 grid place-items-center shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="h-5 w-5 text-slate-950 font-bold" />
              </div>
              <div>
                <div className="font-bold text-white tracking-wide">BuildCon Admin</div>
                <div className="text-[10px] text-emerald-400 font-semibold tracking-widest uppercase">System Console</div>
              </div>
            </div>

            <nav className="p-3 space-y-1 overflow-y-auto">
              {nav.map((it) => {
                const active = isLinkActive(it.href);
                return (
                  <LinkComponent
                    key={it.href}
                    href={it.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-emerald-600/90 to-teal-500/90 text-white font-semibold shadow-md shadow-emerald-500/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
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

          <div className="p-4 border-t border-slate-800/80 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 grid place-items-center text-sm font-bold shadow-inner">
              {name ? name[0] : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{name || "Super Admin"}</div>
              <div className="text-[11px] text-slate-400 font-medium capitalize truncate">Super Admin</div>
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
          <header className="bg-[#0c1220]/50 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center gap-4">
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                Super Admin Console <span className="animate-pulse text-emerald-400">⚡</span>
              </h1>
              <p className="text-xs text-slate-400">Global control panel for BuildCon cloud infrastructure.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-[#0e1628] border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                Wednesday, 28 May 2025
              </div>
              <button className="relative p-2 rounded-lg bg-[#0e1628] border border-slate-800 text-slate-300 hover:bg-slate-800">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500"></span>
              </button>
            </div>
          </header>

          {/* Children Dashboard Content */}
          <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#080d18]">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
