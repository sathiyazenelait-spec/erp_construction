"use client";
import React, { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { usePathname, useRouter } from "next/navigation";
import LinkComponent from "next/link";
import {
  LayoutDashboard, Wallet, TrendingUp, ArrowUpFromLine, ArrowDownToLine,
  Calculator, BarChart3, Receipt, ShieldCheck, HardDrive, Banknote,
  FileText, CheckSquare, Bot, Settings, LogOut, Building2, Bell, Calendar
} from "lucide-react";
import { logout, getSession } from "@/lib/auth";

export default function FinanceDirectorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  // Dynamic States
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
    const token = typeof window !== "undefined" ? localStorage.getItem("buildcon_token") : null;
    fetch(`http://localhost:8081/api/finance-director/dashboard/org/${orgId}`, {
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    })
      .then((res) => res.json())
      .then((d) => {
        setProfileName(d.profileName || s?.name || "Suresh Kumar");
        setAvatarInitials(d.avatarInitials || "SK");
        setSidebarMenus(d.sidebar_menus || "");
        if (d.header_date) {
          setHeaderDate(d.header_date);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading FD layout configs:", err);
        setProfileName(s?.name || "Suresh Kumar");
        setAvatarInitials("SK");
        setLoading(false);
      });
  }, []);

  const getSidebarIcon = (name: string) => {
    switch (name) {
      case "Financial Overview": return <LayoutDashboard className="h-4 w-4" />;
      case "Cash Flow Center": return <Wallet className="h-4 w-4" />;
      case "Revenue Management": return <TrendingUp className="h-4 w-4" />;
      case "Receivables": return <ArrowUpFromLine className="h-4 w-4" />;
      case "Payables":
      case "Expenses Ledger": return <ArrowDownToLine className="h-4 w-4" />;
      case "Project Cost Control": return <Calculator className="h-4 w-4" />;
      case "Budget Monitoring": return <BarChart3 className="h-4 w-4" />;
      case "Tax & Compliance": return <Receipt className="h-4 w-4" />;
      case "Audit & Statutory": return <ShieldCheck className="h-4 w-4" />;
      case "Fixed Assets Inventory": return <HardDrive className="h-4 w-4" />;
      case "Investment Tracker": return <Banknote className="h-4 w-4" />;
      case "Financial Reports": return <FileText className="h-4 w-4" />;
      case "Approval Center": return <CheckSquare className="h-4 w-4" />;
      case "AI Finance Assistant": return <Bot className="h-4 w-4" />;
      case "Profile Settings": return <Settings className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getSidebarHref = (name: string) => {
    switch (name) {
      case "Financial Overview": return "/finance-director";
      case "Cash Flow Center": return "/finance-director/cash";
      case "Revenue Management": return "/finance-director/revenue";
      case "Receivables": return "/finance-director/receivables";
      case "Payables": return "/finance-director/payables";
      case "Expenses Ledger": return "/finance-director/expenses";
      case "Project Cost Control": return "/finance-director/cost-control";
      case "Budget Monitoring": return "/finance-director/budget";
      case "Tax & Compliance": return "/finance-director/tax";
      case "Audit & Statutory": return "/finance-director/audit";
      case "Fixed Assets Inventory": return "/finance-director/fixed-assets";
      case "Investment Tracker": return "/finance-director/investments";
      case "Financial Reports": return "/finance-director/reports";
      case "Approval Center": return "/finance-director/approvals";
      case "AI Finance Assistant": return "/finance-director/ai";
      case "Profile Settings": return "/finance-director/settings";
      default: return "/finance-director";
    }
  };

  const sidebarList = sidebarMenus
    ? sidebarMenus.split("|").map((n) => n.trim()).filter(Boolean)
    : [
        "Financial Overview",
        "Cash Flow Center",
        "Revenue Management",
        "Receivables",
        "Payables",
        "Expenses Ledger",
        "Project Cost Control",
        "Budget Monitoring",
        "Tax & Compliance",
        "Audit & Statutory",
        "Fixed Assets Inventory",
        "Investment Tracker",
        "Financial Reports",
        "Approval Center",
        "AI Finance Assistant",
        "Profile Settings"
      ];

  const visibleSidebarList = sidebarList.filter(item => {
    const isAi = item.toLowerCase().includes("ai");
    return !(isAi && tier === "growth");
  });

  const isLinkActive = (href: string) => {
    if (href === "/finance-director") {
      return pathname === "/finance-director";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A1120] text-slate-350 text-sm">
        Loading Financial Control Center...
      </div>
    );
  }

  return (
    <AuthGuard role="finance-director">
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
              {visibleSidebarList.map((item) => {
                const href = getSidebarHref(item);
                const active = isLinkActive(href);
                const isApproval = item === "Approval Center";
                return (
                  <LinkComponent
                    key={item}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-emerald-600/95 to-teal-500/95 text-white font-semibold shadow-md shadow-emerald-500/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {getSidebarIcon(item)}
                    <span className="flex-1">{item}</span>
                    {isApproval ? <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-500 text-slate-955">4</span> : null}
                  </LinkComponent>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-800 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 grid place-items-center text-sm font-bold shadow-inner">
              {avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{profileName}</div>
              <div className="text-[11px] text-slate-400 font-medium capitalize truncate font-sans">Finance Director</div>
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
              <p className="text-xs text-slate-400">Finance Command Center & Enterprise Ledger</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-[#111C30] border border-slate-850 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-emerald-400" />
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
