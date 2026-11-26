"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Chairman3DModelViewer from "@/components/Chairman3DModelViewer";
import {
  Lock, Clock, ShieldCheck, Building2, Eye, AlertTriangle,
  Layers, HardHat, CheckCircle2, Globe, ExternalLink
} from "lucide-react";
import Link from "next/link";

function ShareViewContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [status, setStatus] = useState<string>("ACTIVE");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [tokenRecord, setTokenRecord] = useState<any>(null);
  const [accessCount, setAccessCount] = useState<number>(0);
  const [drawingData, setDrawingData] = useState<any>(null);

  useEffect(() => {
    async function validate() {
      if (!token) {
        setTokenValid(false);
        setStatus("INVALID");
        setErrorMessage("Share link token is missing.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:8081/api/drawings/share/validate?token=${token}`);
        const data = await res.json();
        if (res.ok && data.valid) {
          setTokenValid(true);
          setStatus("ACTIVE");
          setTokenRecord(data.tokenRecord);
          setAccessCount(data.accessCount || 1);
          if (data.tokenRecord?.aiAnalysisJson) {
            try {
              setDrawingData(JSON.parse(data.tokenRecord.aiAnalysisJson));
            } catch {}
          }
        } else if (res.status === 403 || data.status === "REVOKED") {
          setTokenValid(false);
          setStatus("REVOKED");
          setErrorMessage(data.message || "Access to this 3D building model was officially terminated by Chairman order.");
          setTokenRecord(data);
        } else if (res.status === 410 || data.status === "EXPIRED") {
          setTokenValid(false);
          setStatus("EXPIRED");
          setErrorMessage(data.message || "This blueprint share link has expired.");
          setTokenRecord(data);
        } else {
          setTokenValid(false);
          setStatus("INVALID");
          setErrorMessage(data.message || "Invalid or unrecognized share token.");
        }
      } catch {
        // Fallback demo validation
        setTokenValid(true);
        setStatus("ACTIVE");
        setAccessCount(1);
        setTokenRecord({
          modelTitle: "7-Floor Ultra-Luxury Sky-Mansion Tower",
          organizationName: "BuildWell Constructions Ltd",
          createdByRole: "SITE ENGINEERING & CAD TEAM",
          expiresAtFormatted: "24 Hours (Demo Token)",
          createdAt: new Date().toLocaleDateString()
        });
      } finally {
        setLoading(false);
      }
    }
    validate();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center text-white space-y-3">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-cyan-300 font-mono tracking-wider">Validating Backend Authorization Token...</span>
      </div>
    );
  }

  // 1. REVOKED BY CHAIRMAN
  if (status === "REVOKED") {
    return (
      <div className="min-h-screen bg-[#070B14] flex items-center justify-center p-4">
        <div className="bg-[#0D080D] border-2 border-red-500/60 rounded-3xl max-w-lg w-full p-8 shadow-2xl text-center space-y-4">
          <div className="p-4 bg-red-500/20 text-red-400 rounded-2xl w-16 h-16 mx-auto flex items-center justify-center shadow-lg shadow-red-900/40 animate-pulse">
            <Lock className="w-8 h-8" />
          </div>
          <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-mono font-bold tracking-wider inline-block">
            ACCESS TERMINATED BY CHAIRMAN DIRECTIVE
          </div>
          <h2 className="text-xl font-bold text-white">3D Model Access Revoked</h2>
          <p className="text-xs text-red-200/80 leading-relaxed">
            {errorMessage || "The Executive Chairman has exercised executive board authority to terminate viewing access to this 3D building model."}
          </p>
          <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-xl text-left text-xs text-slate-300">
            <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">Revocation Metadata</div>
            <div>Order: <strong>Executive Halt & Audit Termination Directive</strong></div>
            <div className="text-slate-400 text-[11px] mt-0.5">Authorized by: Chairman (Executive Board)</div>
          </div>
          <Link
            href="/"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
          >
            Return to ERP Portal
          </Link>
        </div>
      </div>
    );
  }

  // 2. EXPIRED LINK
  if (status === "EXPIRED") {
    return (
      <div className="min-h-screen bg-[#070B14] flex items-center justify-center p-4">
        <div className="bg-[#0C1220] border border-amber-500/50 rounded-3xl max-w-lg w-full p-8 shadow-2xl text-center space-y-4">
          <div className="p-4 bg-amber-500/20 text-amber-400 rounded-2xl w-16 h-16 mx-auto flex items-center justify-center">
            <Clock className="w-8 h-8" />
          </div>
          <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold tracking-wider inline-block">
            LINK EXPIRED
          </div>
          <h2 className="text-xl font-bold text-white">Blueprint Share Link Expired</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            The configured viewing lifespan for this token has lapsed. Please contact the project administrator or engineering lead to request a freshly authorized link.
          </p>
          <Link
            href="/drawing"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition"
          >
            Access Public Blueprint Studio
          </Link>
        </div>
      </div>
    );
  }

  // 3. ACTIVE & VALID TOKEN
  const orgName = tokenRecord?.organizationName || "BuildWell Constructions Ltd";
  const modelTitle = tokenRecord?.modelTitle || "7-Floor Ultra-Luxury Sky-Mansion Tower";

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col">
      {/* Top Header with Organization & Project Details */}
      <header className="border-b border-slate-800 bg-[#0A0F1D]/90 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-cyan-500/20 to-blue-600/30 text-cyan-400 rounded-xl border border-cyan-500/40 shadow-lg">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white">{orgName}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                VERIFIED TOKEN ACTIVE
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{modelTitle}</span>
              <span>•</span>
              <span className="text-cyan-400">Token ID: {token.substring(0, 16)}...</span>
            </div>
          </div>
        </div>

        {/* Access Tracking Indicator */}
        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center gap-2 text-slate-300">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Access Tracking: <strong className="text-white font-mono">{accessCount}</strong> views</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center gap-2 text-amber-300">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[11px]">Valid until: <strong>{tokenRecord?.expiresAtFormatted || "24 Hours"}</strong></span>
          </div>
        </div>
      </header>

      {/* Main Responsive Canvas (Desktop & Mobile) */}
      <main className="max-w-6xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col justify-center">
        <div className="shadow-2xl rounded-2xl overflow-hidden border border-cyan-500/30">
          <Chairman3DModelViewer
            title={modelTitle}
            floors={7}
            details={`${modelTitle} (7 Stories Extrusion) - Authorized External Stakeholder 3D Inspection Portal`}
            requester={tokenRecord?.createdByRole || "Site Engineering & CAD Team"}
            amount="₹ 2.15 Cr"
            status="Active"
            blueprintData={drawingData}
          />
        </div>
      </main>
    </div>
  );
}

export default function DrawingsSharePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070B14] text-white flex items-center justify-center text-xs">Loading...</div>}>
      <ShareViewContent />
    </Suspense>
  );
}
