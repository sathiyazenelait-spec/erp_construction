import Link from "next/link";
import { Building2, Crown, Users, ShieldCheck, Wrench } from "lucide-react";

export default function HomeContent() {
  return (
    <div className="max-w-7xl w-full">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 grid place-items-center">
          <Building2 className="text-slate-900" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">BuildCon Constructions</h1>
          <p className="text-sm text-slate-300">Construction ERP + AI Platform</p>
        </div>
      </div>

      <h2 className="text-4xl font-bold mb-2">Welcome</h2>
      <p className="text-slate-300 mb-10">Choose your portal to sign in.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/login/chairman" className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 p-8 transition flex flex-col justify-between h-full">
          <div>
            <Crown className="h-10 w-10 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-1">Chairman Portal</h3>
            <p className="text-slate-300 text-sm leading-relaxed">Strategic command center — revenue, profit, growth, investments and board-level approvals.</p>
          </div>
          <span className="inline-block mt-4 text-yellow-300 text-sm group-hover:translate-x-1 transition">Sign in →</span>
        </Link>

        <Link href="/login/director" className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 p-8 transition flex flex-col justify-between h-full">
          <div>
            <Users className="h-10 w-10 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-1">Directors Portal</h3>
            <p className="text-slate-300 text-sm leading-relaxed">Centralized login for MD, Project, Business development and Finance directors.</p>
          </div>
          <span className="inline-block mt-4 text-blue-300 text-sm group-hover:translate-x-1 transition">Sign in →</span>
        </Link>

        <Link href="/login/manager" className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 p-8 transition flex flex-col justify-between h-full">
          <div>
            <Wrench className="h-10 w-10 text-amber-400 mb-4" />
            <h3 className="text-xl font-semibold mb-1">Teams &amp; Staff Portal</h3>
            <p className="text-slate-300 text-sm leading-relaxed">Centralized login for Construction, Marketing, HR managers, and Team Leaders. Access site execution, campaigns ROI, and team tasks.</p>
          </div>
          <span className="inline-block mt-4 text-amber-300 text-sm group-hover:translate-x-1 transition">Sign in →</span>
        </Link>

        <Link href="/login/super-admin" className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 p-8 transition flex flex-col justify-between h-full">
          <div>
            <ShieldCheck className="h-10 w-10 text-emerald-400 mb-4" />
            <h3 className="text-xl font-semibold mb-1">Super Admin</h3>
            <p className="text-slate-300 text-sm leading-relaxed">Application Owner &amp; Full System Access — manage organizations, subscriptions, configurations &amp; AI.</p>
          </div>
          <span className="inline-block mt-4 text-emerald-300 text-sm group-hover:translate-x-1 transition">Sign in →</span>
        </Link>
      </div>
    </div>
  );
}
