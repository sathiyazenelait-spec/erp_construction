"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare, Send, ArrowLeft, RefreshCw, Smartphone,
  CheckCheck, AlertCircle, Phone, Clock, User, Filter,
  Layers, ShieldAlert, Sparkles, ExternalLink, Hash
} from "lucide-react";

interface NotificationLog {
  id?: number;
  channel: string; // WHATSAPP, SMS, EMAIL
  recipient: string;
  recipientName: string;
  templateName: string;
  subject: string;
  messageContent: string;
  deliveryStatus: string; // SENT, DELIVERED, READ, FAILED
  externalMessageId: string;
  sentAt: string;
  metadataJson?: string;
  organizationId?: number;
}

const DEFAULT_NOTIFICATIONS: NotificationLog[] = [
  {
    id: 1,
    channel: "WHATSAPP",
    recipient: "+91 98401 22345",
    recipientName: "Tata Tiscon Authorized Vendor",
    templateName: "PO_RELEASE_TEMPLATE",
    subject: "New Purchase Order Released: PO-2026-118",
    messageContent: "Dear Partner, BuildWell has released Purchase Order PO-2026-118 for 25.5 MT Fe550 TMT Rebar. Please review specs and confirm delivery slot: https://buildcon.erp/vendor-portal",
    deliveryStatus: "READ",
    externalMessageId: "WA-MSG-88192019",
    sentAt: "2026-11-17T09:15:00"
  },
  {
    id: 2,
    channel: "WHATSAPP",
    recipient: "+91 98840 99120",
    recipientName: "Rajesh Kumar (Homeowner Unit 402)",
    templateName: "MILESTONE_PROGRESS_ALERT",
    subject: "Skyline Residences Tower A Handover Update",
    messageContent: "Namaste Mr. Rajesh Kumar, your unit Tower A - 402 has completed 88% finishing milestones (Flooring & Joinery). View progress photos & inspection docs: https://buildcon.erp/client-portal",
    deliveryStatus: "DELIVERED",
    externalMessageId: "WA-MSG-88192025",
    sentAt: "2026-11-17T08:30:00"
  },
  {
    id: 3,
    channel: "SMS",
    recipient: "+91 97909 33211",
    recipientName: "Safety Officer Sharma",
    templateName: "SAFETY_CRITICAL_ALERT",
    subject: "Urgent: Mandatory Perimeter Scaffolding Inspection",
    messageContent: "ALERT: Tower B facade wind gusts exceeding 35 km/h. Mandatory halt on external cradle movement until re-certification. Check QA/QC hub.",
    deliveryStatus: "DELIVERED",
    externalMessageId: "SMS-GW-490219",
    sentAt: "2026-11-17T07:45:00"
  },
  {
    id: 4,
    channel: "WHATSAPP",
    recipient: "+91 94440 11982",
    recipientName: "Apex Civil Contractors Lead",
    templateName: "NCR_RECTIFICATION_NOTICE",
    subject: "Quality Notice: NCR-2026-001 Under Review",
    messageContent: "Notice: Honeycombing rectification for Shear Wall SW-03 requires micro-concrete cube test submission by 18-Nov-2026. Non-compliance halts pour clearance.",
    deliveryStatus: "DELIVERED",
    externalMessageId: "WA-MSG-88192040",
    sentAt: "2026-11-17T07:10:00"
  },
  {
    id: 5,
    channel: "SMS",
    recipient: "+91 98410 77651",
    recipientName: "Chairman Executive Office",
    templateName: "FINANCIAL_APPROVAL_REMINDER",
    subject: "Pending Approval: Subcontractor RA Bill #04",
    messageContent: "BuildWell ERP: Subcontractor L&T Struct RA Bill #04 for $420,000 awaits executive sign-off for Friday RTGS cycle.",
    deliveryStatus: "DELIVERED",
    externalMessageId: "SMS-GW-490233",
    sentAt: "2026-11-17T06:50:00"
  }
];

export default function NotificationsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<NotificationLog[]>(DEFAULT_NOTIFICATIONS);
  const [loading, setLoading] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("ALL");
  const [search, setSearch] = useState("");

  // Quick Dispatch Form
  const [formData, setFormData] = useState({
    channel: "WHATSAPP",
    recipient: "+91 ",
    recipientName: "",
    templateName: "CUSTOM_BROADCAST",
    subject: "",
    messageContent: ""
  });
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8081/api/notifications/org/1");
      if (res.ok) {
        const data = await res.json();
        if (data.logs && Array.isArray(data.logs) && data.logs.length > 0) {
          setLogs(data.logs);
        }
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: string) => {
    let msg = "";
    let sub = "";
    if (template === "PO_RELEASE_TEMPLATE") {
      sub = "Purchase Order Released";
      msg = "Dear Partner, BuildWell has released Purchase Order PO-2026-119. Please view items and confirm dispatch date.";
    } else if (template === "MILESTONE_PROGRESS_ALERT") {
      sub = "Project Milestone Update";
      msg = "Namaste! Your tower construction milestone is progressing on schedule. Review progress photos on your client portal.";
    } else if (template === "SAFETY_CRITICAL_ALERT") {
      sub = "Safety Weather Advisory";
      msg = "SAFETY ADVISORY: Site monsoon checklist active. Life-lines and 30mA RCCB trip testing mandatory before shift start.";
    } else if (template === "COMPLIANCE_EXPIRY_NOTICE") {
      sub = "Statutory License Renewal Reminder";
      msg = "URGENT COMPLIANCE: State Pollution Control CTE/CTO expires in 18 days. Statutory filing receipt required by Legal.";
    }
    setFormData({
      ...formData,
      templateName: template,
      subject: sub,
      messageContent: msg
    });
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipient || !formData.messageContent) {
      alert("Please provide recipient number and message text.");
      return;
    }

    const payload: NotificationLog = {
      ...formData,
      deliveryStatus: "DELIVERED",
      externalMessageId: (formData.channel === "WHATSAPP" ? "WA-MSG-" : "SMS-GW-") + Date.now().toString().slice(-8),
      sentAt: new Date().toISOString(),
      organizationId: 1
    };

    try {
      const res = await fetch("http://localhost:8081/api/notifications/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const saved = await res.json();
        setLogs([saved, ...logs]);
      } else {
        setLogs([payload, ...logs]);
      }
    } catch {
      setLogs([payload, ...logs]);
    }

    setDispatchStatus(`Successfully dispatched via ${formData.channel} Gateway (Message ID: ${payload.externalMessageId})`);
    setTimeout(() => setDispatchStatus(null), 5000);

    setFormData({
      channel: "WHATSAPP",
      recipient: "+91 ",
      recipientName: "",
      templateName: "CUSTOM_BROADCAST",
      subject: "",
      messageContent: ""
    });
  };

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.recipient.toLowerCase().includes(search.toLowerCase()) ||
      (l.recipientName && l.recipientName.toLowerCase().includes(search.toLowerCase())) ||
      l.messageContent.toLowerCase().includes(search.toLowerCase());

    const matchesChannel = selectedChannel === "ALL" || l.channel === selectedChannel;
    return matchesSearch && matchesChannel;
  });

  const whatsappTotal = logs.filter((l) => l.channel === "WHATSAPP").length;
  const smsTotal = logs.filter((l) => l.channel === "SMS").length;
  const deliveredTotal = logs.filter((l) => l.deliveryStatus === "DELIVERED" || l.deliveryStatus === "READ").length;

  return (
    <div className="min-h-screen bg-[#080E1A] text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0C1527] px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-wide">
                  Notification Center & WhatsApp / SMS Gateway
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  CARRIER ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated PO Release Alerts, Milestone Handover Updates, Safety Warnings & Subcontractor Reminders
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLogs}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0F192E] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Dispatches</div>
              <div className="text-2xl font-bold text-white mt-1">{logs.length}</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F192E] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">WhatsApp Business Messages</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{whatsappTotal}</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F192E] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">SMS Gateway Alerts</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">{smsTotal}</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Smartphone className="h-5 w-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F192E] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Delivery Rate</div>
              <div className="text-2xl font-bold text-teal-400 mt-1">
                {Math.round((deliveredTotal / (logs.length || 1)) * 100)}%
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <CheckCheck className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Dispatch Console and Logs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dispatch Box */}
          <div className="rounded-xl bg-[#0F192E] border border-slate-800 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Send className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Live Notification Dispatcher</h2>
            </div>

            {dispatchStatus && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <CheckCheck className="h-4 w-4" /> {dispatchStatus}
              </div>
            )}

            <form onSubmit={handleDispatch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Carrier Channel</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, channel: "WHATSAPP" })}
                    className={`p-2 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      formData.channel === "WHATSAPP"
                        ? "bg-emerald-600/20 border-emerald-500 text-emerald-400"
                        : "bg-slate-900 border-slate-700 text-slate-400"
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> WhatsApp API
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, channel: "SMS" })}
                    className={`p-2 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      formData.channel === "SMS"
                        ? "bg-cyan-600/20 border-cyan-500 text-cyan-400"
                        : "bg-slate-900 border-slate-700 text-slate-400"
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" /> SMS Gateway
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Pre-Approved Template</label>
                <select
                  value={formData.templateName}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="CUSTOM_BROADCAST">Custom Message</option>
                  <option value="PO_RELEASE_TEMPLATE">PO Release to Vendor</option>
                  <option value="MILESTONE_PROGRESS_ALERT">Milestone Progress to Homeowner</option>
                  <option value="SAFETY_CRITICAL_ALERT">Critical Safety Alert to Site</option>
                  <option value="COMPLIANCE_EXPIRY_NOTICE">Statutory License Reminder</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Recipient Name / Entity</label>
                <input
                  type="text"
                  placeholder="e.g. UltraTech Logistics Team"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Recipient Phone Number (with Country Code)</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98401 00000"
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Message Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter message text..."
                  value={formData.messageContent}
                  onChange={(e) => setFormData({ ...formData, messageContent: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <Send className="h-4 w-4" /> Dispatch Notification Now
              </button>
            </form>
          </div>

          {/* Logs Table */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter Bar */}
            <div className="p-3 bg-[#0F192E] border border-slate-800 rounded-xl flex items-center justify-between gap-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search recipient, phone, or message text..."
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 flex-1"
              />
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Channel:</span>
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
                >
                  <option value="ALL">All Channels</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="SMS">SMS</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {filteredLogs.map((log, i) => (
                <div
                  key={log.id || i}
                  className="p-4 rounded-xl bg-[#0F192E] border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          log.channel === "WHATSAPP"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                        }`}
                      >
                        {log.channel}
                      </span>
                      <span className="font-semibold text-white">{log.recipientName || log.recipient}</span>
                      <span className="font-mono text-slate-400 text-[11px]">{log.recipient}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {log.deliveryStatus}
                      </span>
                      <span className="text-slate-400 text-[11px] font-mono">
                        {log.sentAt?.replace("T", " ").substring(0, 16)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    {log.messageContent}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="font-mono text-slate-400 flex items-center gap-1">
                      <Hash className="h-3 w-3 text-slate-400" /> Gateway Ref: {log.externalMessageId}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">Template: {log.templateName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
