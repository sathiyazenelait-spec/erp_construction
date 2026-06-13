import { ReactNode } from "react";

export function KpiCard({ icon, label, value, sub, tone = "blue" }: {
  icon: ReactNode; label: string; value: string; sub?: ReactNode;
  tone?: "blue" | "green" | "purple" | "orange" | "teal" | "yellow";
}) {
  const tones: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600", green: "bg-emerald-50 text-emerald-600",
    purple: "bg-violet-50 text-violet-600", orange: "bg-orange-50 text-orange-600",
    teal: "bg-teal-50 text-teal-600", yellow: "bg-yellow-50 text-yellow-600",
  };
  return (
    <div className="kpi">
      <div className={`h-12 w-12 rounded-xl grid place-items-center ${tones[tone]}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-xl font-bold text-slate-900 leading-tight">{value}</div>
        {sub && <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

export function Card({ title, action, children, className = "" }: {
  title?: string; action?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <div className={`card p-5 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="font-semibold text-slate-800">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    "On Track": "bg-emerald-100 text-emerald-700",
    "Delayed": "bg-amber-100 text-amber-700",
    "Critical": "bg-red-100 text-red-700",
  };
  return <span className={`pill ${map[status] || "bg-slate-100 text-slate-700"}`}>{status}</span>;
}
