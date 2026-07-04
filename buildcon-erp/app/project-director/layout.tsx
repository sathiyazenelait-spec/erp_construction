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

export default function PDLayout({ children }: { children: React.ReactNode }) {
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
    fetch(`https://erp-construction.onrender.com/api/project-director/dashboard/org/${orgId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((d) => {
        setProfileName(d.profileName || s?.name || "Arvind Menon");
        setAvatarInitials(d.avatarInitials || "AM");
        setSidebarMenus(d.sidebar_menus || "");
        if (d.header_date) {
          setHeaderDate(d.header_date);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading PD layout configurations:", err);
        setProfileName(s?.name || "Arvind Menon");
        setAvatarInitials("AM");
        setLoading(false);
      });
  }, []);

  const getSidebarIcon = (menuName: string) => {
    switch (menuName) {
      case "Dashboard": return <LayoutDashboard className="h-4 w-4" />;
      case "Portfolio Overview": return <FolderKanban className="h-4 w-4" />;
      case "Project Monitoring": return <Activity className="h-4 w-4" />;
      case "PM Performance": return <Users className="h-4 w-4" />;
      case "Budget Monitoring": return <Wallet className="h-4 w-4" />;
      case "Resource Allocation": return <Boxes className="h-4 w-4" />;
      case "Procurement Tracking": return <ShoppingCart className="h-4 w-4" />;
      case "Quality Center": return <ShieldCheck className="h-4 w-4" />;
      case "Safety Monitoring": return <ShieldCheck className="h-4 w-4" />;
      case "Risk Center": return <AlertTriangle className="h-4 w-4" />;
      case "Delay Management": return <Clock className="h-4 w-4" />;
      case "Change Orders": return <FileEdit className="h-4 w-4" />;
      case "Reports & Analytics": return <FileText className="h-4 w-4" />;
      case "AI Project Assistant": return <Bot className="h-4 w-4" />;
      case "Settings": return <Settings className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getSidebarHref = (menuName: string) => {
    switch (menuName) {
      case "Dashboard": return "/project-director";
      case "Portfolio Overview": return "/project-director/portfolio";
      case "Project Monitoring": return "/project-director/monitoring";
      case "PM Performance": return "/project-director/pm";
      case "Budget Monitoring": return "/project-director/budget";
      case "Resource Allocation": return "/project-director/resources";
      case "Procurement Tracking": return "/project-director/procurement";
      case "Quality Center": return "/project-director/quality";
      case "Safety Monitoring": return "/project-director/safety";
      case "Risk Center": return "/project-director/risk";
      case "Delay Management": return "/project-director/delays";
      case "Change Orders": return "/project-director/changes";
      case "Reports & Analytics": return "/project-director/reports";
      case "AI Project Assistant": return "/project-director/ai";
      case "Settings": return "/project-director/settings";
      default: return "/project-director";
    }
  };

  const sidebarList = sidebarMenus
    ? sidebarMenus.split("|").map((n) => n.trim()).filter(Boolean)
    : [
        "Dashboard",
        "Portfolio Overview",
        "Project Monitoring",
        "PM Performance",
        "Budget Monitoring",
        "Resource Allocation",
        "Procurement Tracking",
        "Quality Center",
        "Safety Monitoring",
        "Risk Center",
        "Delay Management",
        "Change Orders",
        "Reports & Analytics",
        "AI Project Assistant",
        "Settings"
      ];

  const visibleSidebarList = sidebarList.filter(item => {
    const isAi = item.toLowerCase().includes("ai");
    return !(isAi && tier === "growth");
  });

  const isLinkActive = (href: string) => {
    if (href === "/project-director") {
      return pathname === "/project-director";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A1120] text-slate-350 text-sm">
        Loading Command Center...
      </div>
    );
  }

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
              {visibleSidebarList.map((item) => {
                const href = getSidebarHref(item);
                const active = isLinkActive(href);
                return (
                  <LinkComponent
                    key={item}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-blue-600/95 to-blue-500/95 text-white font-semibold shadow-md shadow-blue-500/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {getSidebarIcon(item)}
                    <span className="flex-1">{item}</span>
                  </LinkComponent>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-800 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 grid place-items-center text-sm font-bold shadow-inner">
              {avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{profileName}</div>
              <div className="text-[11px] text-slate-400 font-medium capitalize truncate">Project Director</div>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/login/director");
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
              <p className="text-xs text-slate-400">Project Portfolio Command Console.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-[#111C30] border border-slate-850 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-blue-400" />
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
