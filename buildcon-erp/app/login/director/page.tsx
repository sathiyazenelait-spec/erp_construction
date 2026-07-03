"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Building2, ShieldAlert, ArrowLeft } from "lucide-react";
import { login, homeForRole, Role } from "@/lib/auth";

const ALLOWED: Role[] = ["md", "project-director", "business-director", "finance-director"];

export default function DirectorLogin() {
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
    const s = await login(email, password, ALLOWED);
    if (!s) { setErr("Invalid director credentials or role mismatch."); return; }
    router.push(homeForRole(s.role));
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-[#0A1120] text-slate-100">
      {/* BRANDING LEFT BAR */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-950 via-blue-950/80 to-slate-900 text-white p-12 border-r border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 grid place-items-center shadow-lg shadow-yellow-500/20">
            <Building2 className="text-slate-950 h-5 w-5 font-bold" />
          </div>
          <div>
            <div className="font-bold text-white tracking-wide">
              {orgName ? orgName.split(" ")[0] : "BuildWell"}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase font-mono">
              {orgName ? orgName.split(" ").slice(1).join(" ") : "Constructions"}
            </div>
          </div>
        </div>

        <div>
          <Users className="h-8 w-8 text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold mb-3 tracking-wide">Directors Portal</h2>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            Central board of directors sign-in portal. Access Managing Director, Project planning, Business development, and Finance audits workspaces.
          </p>
          
          <div className="mt-8 space-y-1 bg-[#111C30]/50 border border-slate-800 rounded-xl p-4">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-2 font-bold">Standard Credentials</div>
            <ul className="space-y-1.5 text-[11px] text-slate-400 font-mono">
              <li>• md@buildcon.com / md123 (Managing Director)</li>
              <li>• pd@buildcon.com / pd123 (Project Director)</li>
              <li>• bd@buildcon.com / bd123 (Business Development Director)</li>
              <li>• fd@buildcon.com / fd123 (Finance Director)</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-slate-500">© 2026 BuildWell ERP Platform</p>
      </div>

      {/* LOGIN FORM RIGHT BAR */}
      <div className="flex items-center justify-center p-8 bg-[#0A1120]">
        <div className="w-full max-w-sm bg-[#0F182A] border border-slate-800 rounded-2xl p-8 shadow-xl shadow-black/30">
          <div className="mb-4">
            <Link href="/" className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
          </div>
          <h1 className="text-xl font-bold mb-1 tracking-wide text-white">Director Sign in</h1>
          <p className="text-xs text-slate-400 mb-6">Select your executive seat and log into your board dashboard.</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Select Director Seat</label>
              <select 
                className="w-full bg-[#111C30] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 outline-none cursor-pointer focus:ring-1 focus:ring-blue-500"
                defaultValue="md"
              >
                <option value="md">Managing Director</option>
                <option value="project-director">Project Director</option>
                <option value="business-director">Business Development Director</option>
                <option value="finance-director">Finance Director</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Username</label>
              <input 
                type="email"
                className="w-full bg-[#111C30] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-blue-500" 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Password</label>
              <input 
                type="password" 
                className="w-full bg-[#111C30] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-blue-500" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
                required 
              />
            </div>

            {err && (
              <div className="text-xs text-red-400 flex items-center gap-1.5 bg-red-950/20 border border-red-900/40 p-2.5 rounded-lg">
                <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
                <span>{err}</span>
              </div>
            )}

            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-650 text-white font-bold py-2.5 rounded-xl text-xs hover:brightness-110 transition shadow-md shadow-blue-500/10">
              Sign in as Director
            </button>

            <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-450 space-y-2">
              <div>
                <span className="text-slate-400">Chairman? </span>
                <Link className="text-yellow-500 hover:underline" href="/login/chairman">Use chairman portal</Link>
              </div>
              <div>
                <span className="text-slate-400">Operations Team? </span>
                <Link className="text-blue-400 hover:underline" href="/login/manager">Use staff portal</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
