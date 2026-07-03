"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Wallet, DollarSign, TrendingUp, ArrowUpRight, Percent, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function FinancialOverview() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any>({});
  const [trendData, setTrendData] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);

  async function loadData() {
    try {
      setLoading(true);
      setErrorMsg(null);
      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) { setErrorMsg("Session expired."); setLoading(false); return; }
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;
      if (!orgId) { setErrorMsg("No organization found."); setLoading(false); return; }

      const res = await fetch(`http://localhost:8081/api/md/dashboard/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const d = await res.json();
        setMetrics(d);
        // Revenue trend from projects
        if (d.projects && d.projects.length > 0) {
          const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
          const monthMap: {[k: string]: number} = {};
          d.projects.forEach((p: any) => {
            const month = p.startDate ? months[new Date(p.startDate).getMonth()] : "Jan";
            monthMap[month] = (monthMap[month] || 0) + (p.budget || 0);
          });
          setTrendData(Object.keys(monthMap).map(m => ({ m, v: Math.round(monthMap[m] / 100000) })));
        }
        // Expense breakdown
        setExpenseData([
          { name: "Direct Construction Cost", value: Math.round((d.revenue_mtd_num || 1320) * 0.48 / 100), color: "#3B82F6" },
          { name: "Material Procurement", value: Math.round((d.revenue_mtd_num || 1320) * 0.24 / 100), color: "#10B981" },
          { name: "Labor & Payroll", value: Math.round((d.revenue_mtd_num || 1320) * 0.12 / 100), color: "#F59E0B" },
          { name: "Equipment Rent / CAPEX", value: Math.round((d.revenue_mtd_num || 1320) * 0.08 / 100), color: "#8B5CF6" },
          { name: "Other Overheads", value: Math.round((d.revenue_mtd_num || 1320) * 0.08 / 100), color: "#64748B" },
        ]);
      } else {
        setErrorMsg("Failed to retrieve financial data.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const totalProjects = metrics.projects?.length || 0;
  const totalBudget = metrics.projects?.reduce((acc: number, p: any) => acc + (p.budget || 0), 0) || 0;
  const totalActual = metrics.projects?.reduce((acc: number, p: any) => acc + (p.actual || 0), 0) || 0;
  const netProfit = totalBudget - totalActual;
  const margin = totalBudget > 0 ? ((netProfit / totalBudget) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">03. FINANCIAL COMMAND</h2>
          <p className="text-xs text-slate-400">Company ledger, gross profit, cash flow forecasts, and aging receivables</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-400 hover:text-white transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading financial data from database...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-red-400 text-xs flex justify-between items-center">
          <span>⚠️ {errorMsg}</span>
          <button onClick={loadData} className="px-4 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg font-semibold transition">Retry</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400">Total Group Revenue</div>
              <div className="text-2xl font-bold text-white mt-1">{metrics.revenue_mtd || `₹ ${(totalBudget/10000000).toFixed(1)} Cr`}</div>
              <div className="text-[10px] text-emerald-400 mt-1">↑ YTD across {totalProjects} projects</div>
            </div>
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400">Net Profit (Estimated)</div>
              <div className="text-2xl font-bold text-white mt-1">{metrics.net_profit_mtd || `₹ ${(netProfit/10000000).toFixed(1)} Cr`}</div>
              <div className="text-[10px] text-emerald-400 mt-1">Margin {margin}%</div>
            </div>
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400">Total Expenditure</div>
              <div className="text-2xl font-bold text-white mt-1">₹ {(totalActual/10000000).toFixed(1)} Cr</div>
              <div className="text-[10px] text-amber-400 mt-1">Across all active projects</div>
            </div>
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400">Cash Position</div>
              <div className="text-2xl font-bold text-white mt-1">{metrics.cash_position || `₹ ${((totalBudget - totalActual) / 10000000).toFixed(1)} Cr`}</div>
              <div className="text-[10px] text-slate-500 mt-1">Available balance est.</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Revenue Trend (Project Budget Distribution)</h3>
              <div className="h-56">
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="m" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#0F182A", borderColor: "#1E293B", color: "#F8FAFC" }} />
                      <Area type="monotone" dataKey="v" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">No trend data available.</div>
                )}
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Cost Distribution</h3>
              <div className="flex items-center justify-around h-36">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={expenseData} dataKey="value" innerRadius={30} outerRadius={50} paddingAngle={3}>
                      {expenseData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {expenseData.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-slate-300">{cat.name}</span>
                    </div>
                    <span className="text-white font-semibold">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <AIAssistantBar suggestions={["Forecast Q3 revenue", "Identify cost overrun projects", "Show aging receivables"]} />
    </div>
  );
}
