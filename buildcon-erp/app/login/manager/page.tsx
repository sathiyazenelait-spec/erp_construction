"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wrench, Building2, Megaphone, Users, User, ShieldAlert, ArrowLeft } from "lucide-react";
import { login, homeForRole, Role } from "@/lib/auth";

interface RoleOption {
  value: Role;
  label: string;
  group: "Post-Sales Operations" | "Sales & Marketing" | "Corporate & HR Support";
}

const ALL_ROLE_OPTIONS: RoleOption[] = [
  { value: "project-manager", label: "Project Manager", group: "Post-Sales Operations" },
  { value: "senior-site-engineer", label: "Senior Site Engineer", group: "Post-Sales Operations" },
  { value: "site-management", label: "Site Management", group: "Post-Sales Operations" },
  { value: "construction-manager", label: "Construction Manager", group: "Post-Sales Operations" },
  { value: "subcontractor", label: "Subcontractor", group: "Post-Sales Operations" },
  { value: "workforce-manager", label: "Workforce & Labour", group: "Post-Sales Operations" },
  { value: "quantity-surveyor", label: "Quantity Surveyor", group: "Post-Sales Operations" },
  { value: "procurement-manager", label: "Procurement Manager", group: "Post-Sales Operations" },
  { value: "finance-accounts", label: "Finance & Accounts", group: "Post-Sales Operations" },
  { value: "digital-marketing-tl", label: "Digital Marketing TL", group: "Sales & Marketing" },
  { value: "digital-marketing-executive", label: "Digital Marketing Executive", group: "Sales & Marketing" },
  { value: "sales-executive", label: "Sales Executive", group: "Sales & Marketing" },
  { value: "marketing-manager", label: "Marketing Manager", group: "Sales & Marketing" },
  { value: "hr-manager", label: "HR Manager", group: "Corporate & HR Support" }
];

export default function CentralizedManagerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("project-manager");
  const [tier, setTier] = useState<string>("Enterprise");
  const [orgName, setOrgName] = useState<string>("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTier = localStorage.getItem("selected_login_tier") || "Enterprise";
      const savedOrg = localStorage.getItem("selected_login_org") || "";
      setTier(savedTier);
      setOrgName(savedOrg);

      // Select first allowed role dynamically
      const allowed = getFilteredOptions(savedTier);
      if (allowed.length > 0) {
        setSelectedRole(allowed[0].value);
      }
    }
  }, []);

  function getFilteredOptions(currentTier: string) {
    const t = (currentTier || "Enterprise").toLowerCase();
    if (t === "growth") {
      return ALL_ROLE_OPTIONS.filter(o =>
        ["project-manager", "senior-site-engineer", "site-management", "construction-manager", "subcontractor", "workforce-manager"].includes(o.value)
      );
    }
    if (t === "premium") {
      return ALL_ROLE_OPTIONS.filter(o =>
        ["project-manager", "construction-manager", "quantity-surveyor", "procurement-manager", "finance-accounts", "hr-manager", "sales-executive", "site-management", "subcontractor"].includes(o.value)
      );
    }
    return ALL_ROLE_OPTIONS;
  }
  function getFilteredSwitch(currentTier: string) {
    const d = (currentTier || "Enterprise").toLowerCase();
    if (d === "enterprise") {
      return (
        <>
          <span className="text-slate-400">Board Member? </span>
          <Link className="text-yellow-500 hover:underline" href="/login/director">Use directors portal</Link>
        </>
      );
    }
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const allowedRoles = filteredOptions.map(o => o.value);
    const s = await login(email, password, allowedRoles);
    if (!s) { setErr("Invalid staff credentials or role mismatch."); return; }
    router.push(homeForRole(s.role));
  }

  const filteredOptions = getFilteredOptions(tier);
  const groups = Array.from(new Set(filteredOptions.map(o => o.group)));

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-[#0A1120] text-slate-100">
      {/* BRANDING LEFT BAR */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 text-white p-12 border-r border-slate-800">
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
          <div className="flex items-center gap-4 mb-4">
            <Wrench className="h-8 w-8 text-amber-500" />
            <Megaphone className="h-8 w-8 text-purple-500" />
            <Users className="h-8 w-8 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3 tracking-wide">Teams & Staff Portal</h2>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            Centralized portal access for Construction, Marketing, HR managers, and site operations teams. Access timelines, analytics, and quality parameters.
          </p>

          <div className="mt-8 space-y-1 bg-[#111C30]/50 border border-slate-800 rounded-xl p-4 max-h-48 overflow-y-auto pr-2">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-2 font-bold">Standard Credentials</div>
            <ul className="space-y-1.5 text-[11px] text-slate-400 font-mono">
              <li>• pm@buildcon.com / pm123 (Project Manager)</li>
              <li>• sub@buildcon.com / sub123 (Subcontractor)</li>
              <li>• senior-eng@buildcon.com / eng123 (Senior Site Engineer)</li>
              <li>• site@buildcon.com / site123 (Site Management)</li>
              <li>• workforce@buildcon.com / workforce123 (Workforce & Labour)</li>
              <li>• cm@buildcon.com / cm123 (Construction Manager)</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-slate-500">© 2026 BuildWell ERP Platform</p>
      </div>

      {/* LOGIN VIEW RIGHT BAR */}
      <div className="flex items-center justify-center p-8 bg-[#0A1120]">
        <div className="w-full max-w-sm bg-[#0F182A] border border-slate-800 rounded-2xl p-8 shadow-xl shadow-black/30">
          <div className="mb-4">
            <Link href="/" className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
          </div>
          <h1 className="text-xl font-bold mb-1 tracking-wide text-white">Teams & Staff Sign in</h1>
          <p className="text-xs text-slate-400 mb-6">
            Logging in to: <span className="text-yellow-400 font-semibold">{orgName || "Zenelait Infotech"}</span> ({tier} Tier)
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Select Role Group</label>
              <select
                className="w-full bg-[#111C30] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 outline-none cursor-pointer focus:ring-1 focus:ring-yellow-500"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Role)}
              >
                {groups.map(groupName => (
                  <optgroup key={groupName} label={groupName}>
                    {filteredOptions.filter(o => o.group === groupName).map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Username</label>
              <input
                type="email"
                className="w-full bg-[#111C30] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-yellow-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Password</label>
              <input
                type="password"
                className="w-full bg-[#111C30] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-yellow-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {err && (
              <div className="text-xs text-red-400 flex items-center gap-1.5 bg-red-950/20 border border-red-900/40 p-2.5 rounded-lg">
                <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
                <span>{err}</span>
              </div>
            )}

            <button type="submit" className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs hover:brightness-110 transition shadow-md shadow-yellow-500/10">
              Sign in as Staff
            </button>

            {getFilteredSwitch(tier) && (
              <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-450">
                {getFilteredSwitch(tier)}
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
