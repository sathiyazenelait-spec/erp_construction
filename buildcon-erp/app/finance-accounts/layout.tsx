"use client";
import React from "react";
import AuthGuard from "@/components/AuthGuard";

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard role="finance-accounts">
      <div className="min-h-screen bg-[#0A1120] text-slate-100">{children}</div>
    </AuthGuard>
  );
}
