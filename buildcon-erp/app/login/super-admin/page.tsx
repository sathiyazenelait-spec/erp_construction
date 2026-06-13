"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Building2 } from "lucide-react";
import { login, homeForRole } from "@/lib/auth";

export default function SuperAdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const s = await login(email, password, ["super-admin", "admin"]);
    if (!s) { setErr("Invalid super admin credentials or role mismatch."); return; }
    router.push(homeForRole(s.role));
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-12">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 grid place-items-center"><Building2 className="text-slate-900"/></div>
          <div><div className="font-bold">BuildCon</div><div className="text-xs text-slate-300">Platform Admin</div></div>
        </div>
        <div>
          <ShieldCheck className="h-12 w-12 text-emerald-400 mb-4" />
          <h2 className="text-3xl font-bold mb-3">Super Admin Control</h2>
          <p className="text-slate-300 max-w-md">Full System Access — manage global configurations, organization accounts, active tiers, system health, and global AI models.</p>
        </div>
        <p className="text-xs text-slate-400">© 2026 BuildCon ERP Suite</p>
      </div>

      <div className="flex items-center justify-center p-8">
        <form onSubmit={submit} className="w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-1">Super Admin Login</h1>
          <p className="text-sm text-slate-500 mb-6">Enter platform owner credentials.</p>

          <label className="text-xs font-medium text-slate-600">Email</label>
          <input className="input mt-1 mb-4" value={email} onChange={(e)=>setEmail(e.target.value)} />

          <label className="text-xs font-medium text-slate-600">Password</label>
          <input type="password" className="input mt-1 mb-4" value={password} onChange={(e)=>setPassword(e.target.value)} />

          {err && <div className="text-sm text-red-600 mb-3">{err}</div>}
          <button className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700 hover:border-emerald-600">Sign in as Admin</button>

          <div className="mt-6 text-center text-sm text-slate-500">
            Chairman? <Link className="text-blue-600 hover:underline" href="/login/chairman">Use chairman portal</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
