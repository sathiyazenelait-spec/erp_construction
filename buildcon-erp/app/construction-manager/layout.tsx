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

export default function ConstructionManagerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  // Dynamic states
  const [profileName, setProfileName] = useState("");
  const [avatarInitials, setAvatarInitials] = useState("");
  const [sidebarMenus, setSidebarMenus] = useState("");
  const [headerDate, setHeaderDate] = useState("Wednesday, 28 May 2025");
  const [loading, setLoading] = useState(true);

  const [tier, setTier] = useState<string>("");
  useEffect(() => {
    const s = getSession();
    if (s) {
      setName(s.name);
      setRole(s.role);
    }
    setTier((localStorage.getItem("selected_login_tier") || "Enterprise").toLowerCase());
    const orgId = s?.organizationId || 1;
    const token = localStorage.getItem("buildcon_token");
    fetch(`http://localhost:8081/api/construction-manager/dashboard/org/${orgId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((d) => {
        setProfileName(d.profileName || s?.name || "Karthik R.");
        setAvatarInitials(d.avatarInitials || "KR");
        setSidebarMenus(d.sidebar_menus || "");
        if (d.header_date) {
          setHeaderDate(d.header_date);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading CM layout configurations:", err);
        setProfileName(s?.name || "Karthik R.");
        setAvatarInitials("KR");
        setLoading(false);
      });
  }, []);

  const getSidebarIcon = (name: string) => {
    switch (name) {
      case "Dashboard": return <LayoutDashboard className="h-4 w-4" />;
      case "Project Progress": return <TrendingUp className="h-4 w-4" />;
      case "Site Monitoring": return <Eye className="h-4 w-4" />;
      case "Resource Management": return <Users className="h-4 w-4" />;
      case "Labour Productivity": return <Award className="h-4 w-4" />;
      case "Material Tracking": return <Hammer className="h-4 w-4" />;
      case "Equipment Monitoring": return <HardDrive className="h-4 w-4" />;
      case "Quality Control": return <FileCheck className="h-4 w-4" />;
      case "Safety Center": return <ShieldCheck className="h-4 w-4" />;
      case "Procurement": return <ShoppingCart className="h-4 w-4" />;
      case "Delay Management": return <Clock className="h-4 w-4" />;
      case "Daily Site Reports": return <ClipboardList className="h-4 w-4" />;
      case "AI Construction Assistant": return <Bot className="h-4 w-4" />;
      case "Settings": return <Settings className="h-4 w-4" />;
      default: return <ClipboardList className="h-4 w-4" />;
    }
  };

  const getSidebarHref = (name: string) => {
    switch (name) {
      case "Dashboard": return "/construction-manager";
      case "Project Progress": return "/construction-manager/project-progress";
      case "Site Monitoring": return "/construction-manager/site-monitoring";
      case "Resource Management": return "/construction-manager/resource-management";
      case "Labour Productivity": return "/construction-manager/labour-productivity";
      case "Material Tracking": return "/construction-manager/material-tracking";
      case "Equipment Monitoring": return "/construction-manager/equipment-monitoring";
      case "Quality Control": return "/construction-manager/quality-control";
      case "Safety Center": return "/construction-manager/safety-center";
      case "Procurement": return "/construction-manager/procurement";
      case "Delay Management": return "/construction-manager/delay-management";
      case "Daily Site Reports": return "/construction-manager/daily-site-reports";
      case "AI Construction Assistant": return "/construction-manager/ai";
      case "Settings": return "/construction-manager/settings";
      default: return "/construction-manager";
    }
  };

  const sidebarList = sidebarMenus
    ? sidebarMenus.split("|").map((n) => n.trim()).filter(Boolean)
    : [
        "Dashboard",
        "Project Progress",
        "Site Monitoring",
        "Resource Management",
        "Labour Productivity",
        "Material Tracking",
        "Equipment Monitoring",
        "Quality Control",
        "Safety Center",
        "Procurement",
        "Delay Management",
        "Daily Site Reports",
        "AI Construction Assistant",
        "Settings"
      ];

  const visibleSidebarList = sidebarList.filter(item => {
    const isAi = item.toLowerCase().includes("ai");
    return !(isAi && tier === "growth");
  });

  const isLinkActive = (href: string) => {
    if (href === "/construction-manager") {
      return pathname === "/construction-manager";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A1120] text-slate-350 text-sm">
        Loading Site Infrastructure...
      </div>
    );
  }

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
              {visibleSidebarList.map((item) => {
                const href = getSidebarHref(item);
                const active = isLinkActive(href);
                const isDelayItem = item === "Delay Management";
                return (
                  <LinkComponent
                    key={item}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {getSidebarIcon(item)}
                    <span className="flex-1">{item}</span>
                    {isDelayItem ? <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-rose-500 text-white">3</span> : null}
                  </LinkComponent>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-800 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-amber-600/20 text-amber-400 border border-amber-500/30 grid place-items-center text-sm font-bold shadow-inner">
              {avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{profileName}</div>
              <div className="text-[11px] text-slate-400 font-medium capitalize truncate">Construction Manager</div>
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
                Good Morning, {profileName} <span className="animate-pulse">👋</span>
              </h1>
              <p className="text-xs text-slate-400">Site Operations, Machinery Deployments, and Productivity command.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-[#111C30] border border-slate-850 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                {headerDate}
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
