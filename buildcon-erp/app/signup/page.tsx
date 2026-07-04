"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Building2, ShieldAlert, CheckCircle } from "lucide-react";

const ROLES_MAP = {
  "ROLE_CHAIRMAN": "Chairman",
  "ROLE_MD": "Managing Director",
  "ROLE_PROJECT_DIRECTOR": "Project Director",
  "ROLE_BUSINESS_DIRECTOR": "Business Development Director",
  "ROLE_FINANCE_DIRECTOR": "Finance Director",
  "ROLE_CONSTRUCTION_MANAGER": "Construction Manager",
  "ROLE_PROJECT_MANAGER": "Project Manager",
  "ROLE_QUANTITY_SURVEYOR": "Quantity Surveyor",
  "ROLE_PROCUREMENT_MANAGER": "Procurement Manager",
  "ROLE_FINANCE_ACCOUNTS": "Finance & Accounts",
  "ROLE_SITE_MANAGEMENT": "Site Management",
  "ROLE_WORKFORCE_MANAGER": "Workforce & Labour",
  "ROLE_SUBCONTRACTOR": "Subcontractor",
  "ROLE_SENIOR_SITE_ENGINEER": "Senior Site Engineer",
  "ROLE_DIGITAL_MARKETING_TL": "Digital Marketing TL",
  "ROLE_DIGITAL_MARKETING_EXECUTIVE": "Digital Marketing Executive",
  "ROLE_SALES_EXECUTIVE": "Sales Executive",
  "ROLE_MARKETING_MANAGER": "Marketing Manager",
  "ROLE_HR_MANAGER": "HR Manager"
};

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ROLE_CHAIRMAN");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [organizationId, setOrganizationId] = useState<number | null>(null);
  const [tier, setTier] = useState<string>("Enterprise");
  const [orgName, setOrgName] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedId = localStorage.getItem("selected_login_org_id");
      if (savedId) {
        setOrganizationId(parseInt(savedId, 10));
      }
      const savedTier = localStorage.getItem("selected_login_tier") || "Enterprise";
      const savedOrg = localStorage.getItem("selected_login_org") || "";
      setTier(savedTier);
      setOrgName(savedOrg);

      const filtered = getFilteredRoles(savedTier);
      const keys = Object.keys(filtered);
      if (keys.length > 0) {
        setRole(keys[0]);
      }
    }
  }, []);

  function getFilteredRoles(currentTier: string) {
    const t = (currentTier || "Enterprise").toLowerCase();
    if (t === "growth") {
      return {
        "ROLE_CHAIRMAN": "Chairman",
        "ROLE_PROJECT_MANAGER": "Project Manager",
        "ROLE_SENIOR_SITE_ENGINEER": "Senior Site Engineer",
        "ROLE_SITE_MANAGEMENT": "Site Management",
        "ROLE_CONSTRUCTION_MANAGER": "Construction Manager",
        "ROLE_SUBCONTRACTOR": "Subcontractor",
        "ROLE_WORKFORCE_MANAGER": "Workforce & Labour"
      };
    }
    if (t === "premium") {
      return {
        "ROLE_CHAIRMAN": "Chairman",
        "ROLE_MD": "Managing Director",
        "ROLE_PROJECT_DIRECTOR": "Project Director",
        "ROLE_PROJECT_MANAGER": "Project Manager",
        "ROLE_CONSTRUCTION_MANAGER": "Construction Manager",
        "ROLE_QUANTITY_SURVEYOR": "Quantity Surveyor",
        "ROLE_PROCUREMENT_MANAGER": "Procurement Manager",
        "ROLE_FINANCE_ACCOUNTS": "Finance & Accounts",
        "ROLE_HR_MANAGER": "HR Manager",
        "ROLE_SALES_EXECUTIVE": "Sales Executive",
        "ROLE_SITE_MANAGEMENT": "Site Management",
        "ROLE_SUBCONTRACTOR": "Subcontractor"
      };
    }
    return ROLES_MAP;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      // Map role name directly to REST endpoint path structure
      let roleSegment = role.replace("ROLE_", "").toLowerCase().replace(/_/g, "-");
      if (roleSegment === "md") {
        roleSegment = "md";
      } else if (roleSegment === "admin-user" || roleSegment === "admin") {
        roleSegment = "admin";
      }

      const endpoint = `https://erp-construction.onrender.com/api/${roleSegment}/signup`;
      const payload = { username, email, password, role, organizationId };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Signup failed. Please try again.");
      }

      setSuccess(true);
      setTimeout(() => {
        if (role === "ROLE_CHAIRMAN") {
          router.push("/login/chairman");
        } else if (role.endsWith("DIRECTOR") || role === "ROLE_MD") {
          router.push("/login/director");
        } else if (role === "ROLE_ADMIN") {
          router.push("/login/super-admin");
        } else {
          router.push("/login/manager");
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Unable to connect to the backend server.");
    } finally {
      setLoading(false);
    }
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
            <div className="font-bold text-white tracking-wide">BuildWell</div>
            <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase font-mono">Constructions</div>
          </div>
        </div>

        <div>
          <Users className="h-8 w-8 text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold mb-3 tracking-wide">Unified Registration</h2>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            Create an account to join the BuildWell ERP ecosystem. Setup your credentials for directors, managers, chairman team, and staff roles.
          </p>
        </div>
        <p className="text-xs text-slate-500">© 2026 BuildWell ERP Platform</p>
      </div>

      {/* SIGNUP FORM RIGHT BAR */}
      <div className="flex items-center justify-center p-8 bg-[#0A1120]">
        <div className="w-full max-w-md bg-[#0F182A] border border-slate-800 rounded-2xl p-8 shadow-xl shadow-black/30">
          <h1 className="text-xl font-bold mb-1 tracking-wide text-white">Create Account</h1>
          <p className="text-xs text-slate-400 mb-6">
            Signing up for: <span className="text-yellow-400 font-semibold">{orgName || "Zenelait Infotech"}</span> ({tier} Tier)
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Select Organizational Role</label>
              <select 
                className="w-full bg-[#111C30] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 outline-none cursor-pointer focus:ring-1 focus:ring-blue-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {Object.entries(getFilteredRoles(tier)).map(([key, val]) => (
                  <option key={key} value={key}>{val}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Username</label>
              <input 
                type="text"
                placeholder="e.g. JohnDoe"
                className="w-full bg-[#111C30] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-blue-500" 
                value={username} 
                onChange={(e)=>setUsername(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
              <input 
                type="email"
                placeholder="john.doe@buildcon.com"
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
                placeholder="Minimum 6 characters"
                className="w-full bg-[#111C30] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-blue-500" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
                required 
              />
            </div>

            {error && (
              <div className="text-xs text-red-400 flex items-center gap-1.5 bg-red-950/20 border border-red-900/40 p-2.5 rounded-lg">
                <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-lg">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>User registered successfully! Redirecting to login...</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-650 text-white font-bold py-2.5 rounded-xl text-xs hover:brightness-110 transition shadow-md shadow-blue-500/10 disabled:opacity-50"
            >
              {loading ? "Registering Account..." : "Register Account"}
            </button>

            <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
              Already have an account?{" "}
              <Link className="text-blue-500 hover:underline" href="/login/director">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
