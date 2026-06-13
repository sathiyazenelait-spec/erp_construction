"use client";
import React, { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Cpu, Settings, Save, Check, Sparkles, Database, ShieldAlert, Key } from "lucide-react";

const queryVolume = [
  { day: "Mon", count: 18000 },
  { day: "Tue", count: 22000 },
  { day: "Wed", count: 28000 },
  { day: "Thu", count: 24000 },
  { day: "Fri", count: 32000 },
  { day: "Sat", count: 15000 },
  { day: "Sun", count: 12000 },
];

export default function ConfigureAI() {
  const [model, setModel] = useState("gemini-1.5-pro");
  const [temperature, setTemperature] = useState(0.3);
  const [apiKey, setApiKey] = useState("••••••••••••••••••••••••••••••••");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">AI GLOBAL CONFIGURATION</h2>
        <p className="text-xs text-slate-400">Configure global Large Language Model keys, routing thresholds, and safety filters</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* API Settings Form */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 pb-2 border-b border-slate-850 flex items-center gap-2">
            <Settings className="h-4 w-4 text-emerald-400" />
            Global LLM Routing Rules
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Primary Engine</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-[#080d18] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                >
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Google DeepMind)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Google DeepMind)</option>
                  <option value="claude-3.5-sonnet">Claude 3.5 Sonnet (Anthropic)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Backup Routing Engine</label>
                <select
                  className="w-full bg-[#080d18] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Low-Latency)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                  <option value="claude-3-haiku">Claude 3 Haiku</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Global System LLM API Key (Credential Profile)</label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-[#080d18] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Temperature (Creativity/Determinism)</label>
                <span className="text-xs text-emerald-400 font-mono font-bold">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 mt-1">
                <span>Determinism / Structured Summary</span>
                <span>Creative Reasoning</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 text-xs font-bold shadow-md shadow-emerald-500/10 flex items-center gap-1.5 transition-all"
              >
                {saved ? (
                  <>
                    <Check className="h-4 w-4" />
                    AI Config Saved!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save AI Rules
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* AI Query Load Charts */}
        <div className="bg-[#0e1628] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              API Requests Log (Weekly)
            </h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={queryVolume} margin={{ left: -20, right: 0, top: 5, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0c1220", borderColor: "#1e293b", color: "#F8FAFC" }} />
                  <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-850 text-xs text-slate-400 leading-relaxed">
            Total global LLM tokens ingested: <strong className="text-white">1.84 Billion</strong> MTD. Average latency is <strong className="text-emerald-400">324ms</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}
