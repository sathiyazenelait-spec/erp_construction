"use client";
import React, { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { usePathname, useRouter } from "next/navigation";
import LinkComponent from "next/link";
import {
  LayoutDashboard, FileText, Users, Briefcase, Wallet, TrendingUp, Heart, Boxes, ShoppingCart,
  ShieldCheck, AlertTriangle, Inbox, Bot, Settings, LogOut, Building2, Bell, Calendar
} from "lucide-react";
import { logout, getSession } from "@/lib/auth";

export default function MDLayout({ children }: { children: React.ReactNode }) {
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
    fetch(`http://localhost:8081/api/md/dashboard/org/${orgId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((d) => {
        setProfileName(d.profileName || s?.name || "Rajesh Kumar");
        setAvatarInitials(d.avatarInitials || "RK");
        setSidebarMenus(d.sidebar_menus || "");
        if (d.header_date) {
          setHeaderDate(d.header_date);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading MD layout configurations:", err);
        setProfileName(s?.name || "Rajesh Kumar");
        setAvatarInitials("RK");
        setLoading(false);
      });
  }, []);

  const getSidebarIcon = (menuName: string) => {
    switch (menuName) {
      case "Dashboard": return <LayoutDashboard className="h-4 w-4" />;
      case "Executive Command": return <FileText className="h-4 w-4" />;
      case "Department Performance": return <Users className="h-4 w-4" />;
      case "Projects Command Center": return <Briefcase className="h-4 w-4" />;
      case "Financial Overview": return <Wallet className="h-4 w-4" />;
      case "Sales & Business Pipeline": return <TrendingUp className="h-4 w-4" />;
      case "Client Management": return <Heart className="h-4 w-4" />;
      case "Resource Management": return <Boxes className="h-4 w-4" />;
      case "Procurement Overview": return <ShoppingCart className="h-4 w-4" />;
      case "Safety & Compliance": return <ShieldCheck className="h-4 w-4" />;
      case "Risk Management": return <AlertTriangle className="h-4 w-4" />;
      case "Approvals Center": return <Inbox className="h-4 w-4" />;
      case "AI Business Assistant": return <Bot className="h-4 w-4" />;
      case "Reports Center": return <FileText className="h-4 w-4" />;
      case "Settings": return <Settings className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getSidebarHref = (menuName: string) => {
    switch (menuName) {
      case "Dashboard": return "/md";
      case "Executive Command": return "/md/executive";
      case "Department Performance": return "/md/departments";
      case "Projects Command Center": return "/md/projects";
      case "Financial Overview": return "/md/financial";
      case "Sales & Business Pipeline": return "/md/sales";
      case "Client Management": return "/md/clients";
      case "Resource Management": return "/md/resources";
      case "Procurement Overview": return "/md/procurement";
      case "Safety & Compliance": return "/md/safety";
      case "Risk Management": return "/md/risk";
      case "Approvals Center": return "/md/approvals";
      case "AI Business Assistant": return "/md/ai";
      case "Reports Center": return "/md/reports";
      case "Settings": return "/md/settings";
      default: return "/md";
    }
  };

  const sidebarList = sidebarMenus
    ? sidebarMenus.split("|").map((n) => n.trim()).filter(Boolean)
    : [
        "Dashboard",
        "Executive Command",
        "Department Performance",
        "Projects Command Center",
        "Financial Overview",
        "Sales & Business Pipeline",
        "Client Management",
        "Resource Management",
        "Procurement Overview",
        "Safety & Compliance",
        "Risk Management",
        "Approvals Center",
        "AI Business Assistant",
        "Reports Center",
        "Settings"
      ];

  const visibleSidebarList = sidebarList.filter(item => {
    const isAi = item.toLowerCase().includes("ai");
    return !(isAi && tier === "growth");
  });

  const isLinkActive = (href: string) => {
    if (href === "/md") {
      return pathname === "/md";
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
    <AuthGuard role="md">
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

            <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
              {visibleSidebarList.map((item) => {
                const href = getSidebarHref(item);
                const active = isLinkActive(href);
                const isApproval = item === "Approvals Center";
                return (
                  <LinkComponent
                    key={item}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-blue-600/90 to-blue-500/90 text-white font-semibold shadow-md shadow-blue-500/20"
                        : "text-slate-455 text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {getSidebarIcon(item)}
                    <span className="flex-1">{item}</span>
                    {isApproval ? <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-500 text-white">6</span> : null}
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
              <div className="text-[11px] text-slate-400 font-medium capitalize truncate">Managing Director</div>
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
              <p className="text-xs text-slate-400">Managing Director Operational Command Console.</p>
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
