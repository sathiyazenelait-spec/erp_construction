"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Crown, Building2, ArrowLeft } from "lucide-react";
import { login, homeForRole } from "@/lib/auth";

export default function ChairmanLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState<string>("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOrg = localStorage.getItem("selected_login_org") || "";
      setOrgName(savedOrg);
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const s = await login(email, password, ["chairman"]);
    if (!s) { setErr("Invalid chairman credentials or role mismatch."); return; }
    router.push(homeForRole(s.role));
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-yellow-900 text-white p-12">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 grid place-items-center"><Building2 className="text-slate-900"/></div>
          <div>
            <div className="font-bold">
              {orgName ? orgName.split(" ")[0] : "BuildCon"}
            </div>
            <div className="text-xs text-slate-300">
              {orgName ? orgName.split(" ").slice(1).join(" ") : "Constructions"}
            </div>
          </div>
        </div>
        <div>
          <Crown className="h-12 w-12 text-yellow-400 mb-4" />
          <h2 className="text-3xl font-bold mb-3">Chairman Portal</h2>
          <p className="text-slate-300 max-w-md">Strategic command center — revenue, profit, growth, investments and board-level approvals at your fingertips.</p>
        </div>
        <p className="text-xs text-slate-400">© 2026 BuildCon Constructions</p>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-4">
            <Link href="/" className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
          </div>
          <form onSubmit={submit}>
            <h1 className="text-2xl font-bold mb-1">Chairman Sign in</h1>
            <p className="text-sm text-slate-500 mb-6">Restricted — Chairman / Owner access only.</p>

            <label className="text-xs font-medium text-slate-600">Email</label>
            <input className="input mt-1 mb-4" value={email} onChange={(e)=>setEmail(e.target.value)} />

            <label className="text-xs font-medium text-slate-600">Password</label>
            <input type="password" className="input mt-1 mb-4" value={password} onChange={(e)=>setPassword(e.target.value)} />

            {err && <div className="text-sm text-red-600 mb-3">{err}</div>}
            <button className="btn-primary w-full">Sign in as Chairman</button>

            <div className="mt-6 text-center text-sm text-slate-500">
              Director? <Link className="text-blue-600 hover:underline" href="/login/director">Use directors portal</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
