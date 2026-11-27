"use client";
import React, { useState, useEffect } from "react";
import { FileText, Download, Calendar, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";
import { getSession } from "@/lib/auth";

export default function ReportsAnalytics() {
  const [reportList, setReportList] = useState<any[]>([
    { id: 1, name: "Monthly Sales Progress Report - May 2025", type: "PDF", size: "3.5 MB", date: "28 May 2025" },
    { id: 2, name: "Tender Participation Log - May 2025", type: "XLSX", size: "8.2 MB", date: "27 May 2025" },
    { id: 3, name: "Marketing Spend & Leads Analysis - Q1 2025", type: "PDF", size: "5.4 MB", date: "20 May 2025" },
    { id: 4, name: "Signed Contracts Ledger - Q1 2025", type: "PDF", size: "4.1 MB", date: "15 May 2025" },
  ]);

  const [loading, setLoading] = useState(false);
  const session = getSession();
  const orgId = session?.organizationId || 1;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/business-director/reports/org/${orgId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.reports) setReportList(data.reports);
      }
    } catch (err) {
      console.warn("Backend reports fetch failed, using fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId]);

  const handleDownload = (name: string) => {
    alert(`Downloading report: ${name}... Generation complete.`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">10. REPORTS & ANALYTICS</h2>
          <p className="text-xs text-slate-400">View and download live sales pipeline spreadsheets, tender participation records, and marketing analytics</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold hover:bg-slate-700 hover:text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Reports List */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Available Downloads ({reportList.length})</h3>
        <div className="space-y-3">
          {reportList.map((r, idx) => (
            <div key={r.id || idx} className="bg-[#0e1628] border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4 hover:border-slate-800 transition">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-500/10 grid place-items-center text-blue-400 border border-blue-500/20">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{r.name}</h4>
                  <div className="text-[10px] text-slate-400 mt-1 flex flex-wrap gap-3">
                    <span>Format: <strong className="text-slate-300">{r.type}</strong></span>
                    <span>Size: <strong className="text-slate-300">{r.size}</strong></span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-slate-500" /> {r.date}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDownload(r.name)}
                className="bg-slate-850 hover:bg-slate-800 hover:text-white border border-slate-800 text-slate-400 rounded-lg p-2 transition-colors cursor-pointer"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <AIAssistantBar suggestions={["Export custom reports", "Opportunities reports history", "SWOT audits archive"]} />
    </div>
  );
}
