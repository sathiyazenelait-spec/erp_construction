"use client";
import React from "react";
import AuthGuard from "@/components/AuthGuard";

export default function SeniorEngLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard role="senior-site-engineer">
      <div className="min-h-screen bg-[#0A1120] text-slate-100">{children}</div>
    </AuthGuard>
  );
}
