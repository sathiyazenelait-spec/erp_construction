"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, LogOut } from "lucide-react";
import { logout, getSession } from "@/lib/auth";
import { useEffect, useState } from "react";

export interface NavItem { href: string; label: string; icon: React.ReactNode; badge?: number; }

export default function Sidebar({ brand, items, footer }: { brand: string; items: NavItem[]; footer?: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [orgId, setOrgId] = useState<number | null>(null);
  useEffect(() => { const s = getSession(); if (s) { setName(s.name); setRole(s.role); if (s.organizationId) setOrgId(s.organizationId); } }, []);

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-100 min-h-screen flex flex-col">
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 grid place-items-center">
          <Building2 className="h-5 w-5 text-slate-900" />
        </div>
        <div>
          <div className="font-bold leading-none">{brand}</div>
          <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Constructions</div>
        </div>
      </div>

      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {items.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + "/");
          return (
            <Link key={it.href} href={it.href} className={`sidebar-link ${active ? "active" : ""}`}>
              {it.icon}
              <span className="flex-1">{it.label}</span>
              {it.badge ? <span className="pill bg-red-500 text-white">{it.badge}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        {footer}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-700 grid place-items-center text-sm font-semibold">
            {name ? name[0] : "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{name || "User"}</div>
            <div className="text-[11px] text-slate-400 capitalize truncate">
              {role.replace("-", " ")} {orgId !== null ? `(Org: #${orgId})` : ""}
            </div>
          </div>
          <button onClick={() => { logout(); router.push("/"); }} className="p-1.5 rounded-md hover:bg-white/10" title="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
