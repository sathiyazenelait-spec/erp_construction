"use client";
import { Bell, Calendar, Filter, Search, Plus } from "lucide-react";

export default function TopBar({ greeting, subtitle }: { greeting: string; subtitle: string }) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
      <div className="flex-1">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">{greeting} <span>👋</span></h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <button className="btn-ghost"><Calendar className="h-4 w-4 mr-1" /> 29 May 2025</button>
      <button className="btn-ghost"><Filter className="h-4 w-4 mr-1" /> Filter</button>
      <button className="relative btn-ghost p-2"><Bell className="h-5 w-5" /><span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] grid place-items-center">3</span></button>
      <button className="btn-primary"><Plus className="h-4 w-4 mr-1" /> Quick Action</button>
    </header>
  );
}
