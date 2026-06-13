"use client";
import React, { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { usePathname, useRouter } from "next/navigation";
import LinkComponent from "next/link";
import {
  LayoutDashboard, FileText, Briefcase, BarChart3, Wallet, TrendingUp, Users, Heart,
  ShieldCheck, AlertTriangle, Inbox, Bot, Target, LineChart as LineIcon, Settings,
  Crown, LogOut, Building2, Bell, Calendar, Filter, Plus, Sparkles, Send
} from "lucide-react";
import { logout, getSession } from "@/lib/auth";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function ChairmanLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const [tier, setTier] = useState("Enterprise");

  useEffect(() => {
    const s = getSession();
    if (s) {
      setName(s.name);
      setRole(s.role);
    }
    const t = localStorage.getItem("selected_login_tier");
    if (t) {
      setTier(t);
    }
  }, []);

  const nav: NavItem[] = [
    { href: "/chairman", label: "Executive Summary", icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: "/chairman/portfolio", label: "Company Portfolio", icon: <Briefcase className="h-4 w-4" /> },
    { href: "/chairman/financial", label: "Financial Command", icon: <Wallet className="h-4 w-4" /> },
    { href: "/chairman/sales", label: "Sales & Opportunities", icon: <TrendingUp className="h-4 w-4" /> },
    { href: "/chairman/clients", label: "Client Insights", icon: <Heart className="h-4 w-4" /> },
    { href: "/chairman/workforce", label: "Workforce Analysis", icon: <Users className="h-4 w-4" /> },
    { href: "/chairman/safety", label: "Safety Center", icon: <ShieldCheck className="h-4 w-4" /> },
    { href: "/chairman/approvals", label: "Approval Center", icon: <Inbox className="h-4 w-4" />, badge: 3 },
    { href: "/chairman/board", label: "Board Reports", icon: <FileText className="h-4 w-4" /> },
    { href: "/chairman/ai", label: "AI Executive Assistant", icon: <Bot className="h-4 w-4" /> },
    { href: "/chairman/strategy", label: "Strategic Planning", icon: <Target className="h-4 w-4" /> },
    { href: "/chairman/investments", label: "Investment Tracker", icon: <LineIcon className="h-4 w-4" /> },
    { href: "/chairman/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const filteredNav = nav.filter(item => {
    if (tier === "Growth") {
      // Growth allows Executive Summary, Portfolio, Approvals, AI Assistant, Settings
      return ["/chairman", "/chairman/portfolio", "/chairman/approvals", "/chairman/ai", "/chairman/settings"].includes(item.href);
    } else if (tier === "Premium") {
      // Premium adds Financial Command, Safety, Workforce
      return ["/chairman", "/chairman/portfolio", "/chairman/financial", "/chairman/safety", "/chairman/workforce", "/chairman/approvals", "/chairman/ai", "/chairman/settings"].includes(item.href);
    }
    // Enterprise allows all
    return true;
  });

  // Helper to determine active route
  const isLinkActive = (href: string) => {
    if (href === "/chairman") {
      return pathname === "/chairman" || pathname === "/chairman/executive";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <AuthGuard role="chairman">
      <div className="flex bg-[#0B111E] text-slate-100 min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 bg-[#0E1726] border-r border-slate-800 flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-800 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 grid place-items-center shadow-lg shadow-amber-500/20">
                <Building2 className="h-5 w-5 text-slate-950 font-bold" />
              </div>
              <div>
                <div className="font-bold text-white tracking-wide">BuildCon</div>
                <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">Building Better Tomorrow</div>
              </div>
            </div>

            <nav className="p-3 space-y-1 overflow-y-auto">
              {filteredNav.map((it) => {
                const active = isLinkActive(it.href);
                return (
                  <LinkComponent
                    key={it.href}
                    href={it.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-blue-600/90 to-blue-500/90 text-white font-semibold shadow-md shadow-blue-500/20"
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

          <div className="p-4 border-t border-slate-800 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 grid place-items-center text-sm font-bold shadow-inner">
              {name ? name[0] : "C"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{name || "Chairman"}</div>
              <div className="text-[11px] text-slate-400 font-medium capitalize truncate">{role.replace("-", " ")}</div>
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
          <header className="bg-[#0E1726]/50 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center gap-4">
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                Good Morning, Rajesh Kumar <span className="animate-pulse">👋</span>
              </h1>
              <p className="text-xs text-slate-400">Here's what's happening with BuildCon Constructions today.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-[#111A2E] border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-blue-400" />
                Wednesday, 28 May 2025
              </div>
              <div className="bg-[#111A2E] border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 flex items-center gap-2 hover:bg-slate-800 cursor-pointer">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                Filter
              </div>
              <button className="relative p-2 rounded-lg bg-[#111A2E] border border-slate-800 text-slate-300 hover:bg-slate-800">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg px-3.5 py-1.5 text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 hover:brightness-110 transition-all">
                <Plus className="h-3.5 w-3.5" />
                Quick Action
              </button>
            </div>
          </header>

          {/* Children Dashboard Content */}
          <main className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#0B111E]">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
