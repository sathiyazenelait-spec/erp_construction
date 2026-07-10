"use client";
import React, { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { usePathname, useRouter } from "next/navigation";
import LinkComponent from "next/link";
import {
  LayoutDashboard, FileText, Briefcase, BarChart3, Wallet, TrendingUp, Users, Heart,
  ShieldCheck, AlertTriangle, Inbox, Bot, Target, LineChart as LineIcon, Settings,
  Crown, LogOut, Building2, Bell, Calendar, Filter, Plus, Sparkles, Send, MessageSquare
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

  // Dynamic states
  const [profileName, setProfileName] = useState("");
  const [avatarInitials, setAvatarInitials] = useState("");
  const [sidebarMenus, setSidebarMenus] = useState("");
  const [headerDate, setHeaderDate] = useState("Wednesday, 28 May 2025");
  const [loading, setLoading] = useState(true);
  const [brandName, setBrandName] = useState("BuildCon");

  useEffect(() => {
    const updateSessionData = () => {
      const s = getSession();
      if (s) {
        setName(s.name);
        setRole(s.role);
      }
      const savedOrg = localStorage.getItem("selected_login_org");
      if (savedOrg) {
        setBrandName(savedOrg);
      }
      const orgId = s?.organizationId || 1;
      const token = localStorage.getItem("buildcon_token");
      fetch(`https://erp-construction.onrender.com/api/chairman/dashboard/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((d) => {
          const userProfileName = (d.profileName && d.profileName !== "Chairman User" && d.profileName !== "Chairman")
            ? d.profileName 
            : (s?.name || d.profileName || "Chairman");
          setProfileName(userProfileName);
          const initials = userProfileName.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2);
          setAvatarInitials(d.avatarInitials || initials || "CH");
          setSidebarMenus(d.sidebar_menus || "");
          if (d.header_date) {
            setHeaderDate(d.header_date);
          }
          const t = d.subscriptionTier || localStorage.getItem("selected_login_tier") || "Enterprise";
          setTier(t);
          localStorage.setItem("selected_login_tier", t);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading Chairman layout configurations:", err);
          const fallbackName = s?.name || "Chairman";
          setProfileName(fallbackName);
          const initials = fallbackName.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2);
          setAvatarInitials(initials || "CH");
          const t = localStorage.getItem("selected_login_tier") || "Enterprise";
          setTier(t);
          setLoading(false);
        });
    };
    updateSessionData();
    window.addEventListener("storage", updateSessionData);
    return () => window.removeEventListener("storage", updateSessionData);
  }, []);

  const getSidebarIcon = (menuName: string) => {
    switch (menuName) {
      case "Dashboard":
      case "Executive Summary": return <LayoutDashboard className="h-4 w-4" />;
      case "Company Portfolio": return <Briefcase className="h-4 w-4" />;
      case "Financial Command":
      case "Financial Snapshot": return <Wallet className="h-4 w-4" />;
      case "Sales & Opportunities":
      case "Sales Pipeline": return <TrendingUp className="h-4 w-4" />;
      case "Client Insights":
      case "Client Directory": return <Heart className="h-4 w-4" />;
      case "Workforce Overview":
      case "Workforce Analysis": return <Users className="h-4 w-4" />;
      case "Safety Center":
      case "Safety Audits": return <ShieldCheck className="h-4 w-4" />;
      case "Approval Center":
      case "Board Approvals": return <Inbox className="h-4 w-4" />;
      case "Board Reports": return <FileText className="h-4 w-4" />;
      case "AI Executive Assistant": return <Bot className="h-4 w-4" />;
      case "Strategic Planning":
      case "Strategy Sandbox": return <Target className="h-4 w-4" />;
      case "Investment Tracker": return <LineIcon className="h-4 w-4" />;
      case "Subscription Package":
      case "Subscription": return <Crown className="h-4 w-4" />;
      case "Settings":
      case "System Settings": return <Settings className="h-4 w-4" />;
      case "Communication & Tickets": return <MessageSquare className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getSidebarHref = (menuName: string) => {
    switch (menuName) {
      case "Dashboard":
      case "Executive Summary": return "/chairman";
      case "Company Portfolio": return "/chairman/portfolio";
      case "Financial Command":
      case "Financial Snapshot": return "/chairman/financial";
      case "Sales & Opportunities":
      case "Sales Pipeline": return "/chairman/sales";
      case "Client Insights":
      case "Client Directory": return "/chairman/clients";
      case "Workforce Overview":
      case "Workforce Analysis": return "/chairman/workforce";
      case "Safety Center":
      case "Safety Audits": return "/chairman/safety";
      case "Approval Center":
      case "Board Approvals": return "/chairman/approvals";
      case "Board Reports": return "/chairman/board";
      case "AI Executive Assistant": return "/chairman/ai";
      case "Strategic Planning":
      case "Strategy Sandbox": return "/chairman/strategy";
      case "Investment Tracker": return "/chairman/investments";
      case "Subscription Package":
      case "Subscription": return "/chairman/subscription";
      case "Settings":
      case "System Settings": return "/chairman/settings";
      case "Communication & Tickets": return "/chairman/communication";
      default: return "/chairman";
    }
  };

  const sidebarList = sidebarMenus
    ? [...sidebarMenus.split("|").map((n) => n.trim()).filter(Boolean), "Communication & Tickets"]
    : [
        "Executive Summary",
        "Company Portfolio",
        "Financial Command",
        "Sales & Opportunities",
        "Client Insights",
        "Workforce Analysis",
        "Safety Center",
        "Board Approvals",
        "Board Reports",
        "AI Executive Assistant",
        "Strategic Planning",
        "Investment Tracker",
        "Subscription",
        "Communication & Tickets",
        "Settings"
      ];

  const filteredNav = sidebarList.filter(item => {
    const href = getSidebarHref(item);
    const normalizedTier = tier.toLowerCase();
    if (normalizedTier === "growth") {
      return ["/chairman", "/chairman/portfolio", "/chairman/approvals", "/chairman/settings", "/chairman/subscription", "/chairman/communication"].includes(href);
    } else if (normalizedTier === "premium") {
      return ["/chairman", "/chairman/portfolio", "/chairman/financial", "/chairman/safety", "/chairman/workforce", "/chairman/approvals", "/chairman/ai", "/chairman/settings", "/chairman/subscription", "/chairman/communication"].includes(href);
    }
    return true;
  });

  const isLinkActive = (href: string) => {
    if (href === "/chairman") {
      return pathname === "/chairman" || pathname === "/chairman/executive";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B111E] text-slate-350 text-sm">
        Loading Strategic Command...
      </div>
    );
  }

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
                <div className="font-bold text-white tracking-wide">{brandName}</div>
                <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">Building Better Tomorrow</div>
              </div>
            </div>

            <nav className="p-3 space-y-1 overflow-y-auto">
              {filteredNav.map((item) => {
                const href = getSidebarHref(item);
                const active = isLinkActive(href);
                const isApproval = item === "Board Approvals" || item === "Approval Center";
                return (
                  <LinkComponent
                    key={item}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-blue-600/90 to-blue-500/90 text-white font-semibold shadow-md shadow-blue-500/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {getSidebarIcon(item)}
                    <span className="flex-1">{item}</span>
                    {isApproval ? <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-500 text-white">3</span> : null}
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
              <div className="text-[11px] text-slate-400 font-medium capitalize truncate">{role.replace("-", " ")}</div>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/login/chairman");
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
                Good Morning, {profileName} <span className="animate-pulse">👋</span>
              </h1>
              <p className="text-xs text-slate-400">Here's what's happening with BuildCon Constructions today.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-[#111A2E] border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-blue-400" />
                {headerDate}
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
