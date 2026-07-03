"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, homeForRole, Role } from "@/lib/auth";

export default function AuthGuard({ role, children }: { role: Role; children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const s = getSession();
    if (!s) {
      if (role === "chairman") {
        router.replace("/login/chairman");
      } else if (role === "super-admin" || role === "admin") {
        router.replace("/login/super-admin");
      } else if (["md", "project-director", "business-director", "finance-director"].includes(role)) {
        router.replace("/login/director");
      } else {
        router.replace("/login/manager");
      }
      return;
    }
    const matches = s.role === role || (role === "super-admin" && s.role === "admin");
    if (!matches) { router.replace(homeForRole(s.role)); return; }
    setOk(true);
  }, [role, router]);
  if (!ok) return <div className="p-10 text-slate-500 text-sm">Loading…</div>;
  return <>{children}</>;
}
