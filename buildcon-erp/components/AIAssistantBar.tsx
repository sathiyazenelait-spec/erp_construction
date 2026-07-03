"use client";
import { Sparkles, Send } from "lucide-react";
import { useState, useEffect } from "react";

export default function AIAssistantBar({ suggestions }: { suggestions: string[] }) {
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<string>("");

  useEffect(() => {
    setTier((localStorage.getItem("selected_login_tier") || "Enterprise").toLowerCase());
  }, []);

  if (!tier || tier !== "enterprise") {
    return null;
  }

  return (
    <div className="card p-3 flex items-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0">
      <div className="flex items-center gap-2 pl-2">
        <Sparkles className="h-5 w-5 text-blue-400" />
        <span className="text-sm font-medium">AI Business Assistant</span>
      </div>
      <input
        value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Ask me anything about your business..."
        className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-sm outline-none placeholder:text-slate-400"
      />
      <div className="hidden lg:flex gap-2">
        {suggestions.map((s) => (
          <button key={s} className="text-xs px-2.5 py-1.5 rounded-md bg-white/10 hover:bg-white/20">{s}</button>
        ))}
      </div>
      <button className="h-9 w-9 grid place-items-center rounded-lg bg-blue-600 hover:bg-blue-700"><Send className="h-4 w-4" /></button>
    </div>
  );
}
