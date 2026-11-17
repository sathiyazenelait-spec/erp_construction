"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users, Calendar, Clock, CheckSquare, Square, Plus,
  Search, Filter, ArrowLeft, RefreshCw, AlertCircle, FileText,
  MapPin, UserCheck, CheckCircle2, X, ChevronRight
} from "lucide-react";

interface MeetingRecord {
  id?: number;
  meetingCode: string;
  title: string;
  projectRef: string;
  meetingDate: string;
  meetingTime: string;
  location: string;
  chairperson: string;
  attendees: string;
  agenda: string;
  discussionNotes: string;
  decisionsTaken: string;
  status: string;
}

interface MeetingActionItem {
  id?: number;
  meetingId?: number;
  meetingCode: string;
  taskDescription: string;
  assignedTo: string;
  dueDate: string;
  priority: string; // HIGH, MEDIUM, LOW
  status: string; // OPEN, IN_PROGRESS, COMPLETED
  remarks?: string;
}

const DEFAULT_MEETINGS: MeetingRecord[] = [
  {
    id: 1,
    meetingCode: "MOM-2026-081",
    title: "Weekly Site Progress & Tower B Casting Coordination",
    projectRef: "Skyline Residences",
    meetingDate: "2026-11-14",
    meetingTime: "10:30 AM - 12:00 PM",
    location: "Site Conference Room A",
    chairperson: "Er. K. Natarajan (Project Director)",
    attendees: "Site Manager, Structural Consultant, L&T Subcontractor Lead, QA/QC Head, Store In-charge",
    agenda: "1. Tower B 14th floor slab concrete pour schedule\n2. Rebar staging bottlenecks at Bay 3\n3. Monsoon waterproofing slurry inspection",
    discussionNotes: "Discussion emphasized that transit mixers must be batched with retarded admixture to prevent cold joints. Store confirmed 28 MT Fe550 rebar is reserved. QA confirmed cover blocks verified.",
    decisionsTaken: "1. Approved Sunday night concrete pour (320 cum).\n2. Assigned extra transit mixer backup from Guindy plant.\n3. Mandatory safety harness checklist before faÃ§ade scaffolding climb.",
    status: "COMPLETED"
  },
  {
    id: 2,
    meetingCode: "MOM-2026-082",
    title: "Commercial Procurement & Vendor Quotation Negotiation",
    projectRef: "Phoenix Commercial Complex",
    meetingDate: "2026-11-11",
    meetingTime: "03:00 PM - 04:30 PM",
    location: "Corporate Boardroom 2",
    chairperson: "V. Ramanathan (Finance Director)",
    attendees: "Procurement Head, Tata Tiscon Rep, UltraTech Area Lead, Chief QS",
    agenda: "1. Q3 bulk steel rate locking\n2. Credit term extension to 45 days for cement indents\n3. Weighbridge slip integration",
    discussionNotes: "Suppliers agreed to hold price parity at $54,500/MT for 60 days on condition of minimum monthly drawdown of 120 MT.",
    decisionsTaken: "Approved procurement agreement with Tata Tiscon. Finance cleared $1.56M advance cheque release.",
    status: "COMPLETED"
  }
];

const DEFAULT_ACTIONS: MeetingActionItem[] = [
  {
    id: 1,
    meetingId: 1,
    meetingCode: "MOM-2026-081",
    taskDescription: "Mobilize 2 additional concrete boom pumps by Saturday 18:00 hrs",
    assignedTo: "Construction Manager",
    dueDate: "2026-11-19",
    priority: "HIGH",
    status: "OPEN",
    remarks: "Coordinated with Schwing Stetter vendor"
  },
  {
    id: 2,
    meetingId: 1,
    meetingCode: "MOM-2026-081",
    taskDescription: "Submit non-shrink grout cube test reports for Shear Wall SW-03",
    assignedTo: "QA/QC Engineer",
    dueDate: "2026-11-21",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    remarks: "7-day cube curing underway in site lab"
  },
  {
    id: 3,
    meetingId: 2,
    meetingCode: "MOM-2026-082",
    taskDescription: "Issue finalized Purchase Order PO-2026-118 with signed price schedule",
    assignedTo: "Purchase Manager",
    dueDate: "2026-11-16",
    priority: "HIGH",
    status: "COMPLETED",
    remarks: "PO issued & acknowledged on vendor extranet"
  }
];

export default function MeetingsPage() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<MeetingRecord[]>(DEFAULT_MEETINGS);
  const [actionItems, setActionItems] = useState<MeetingActionItem[]>(DEFAULT_ACTIONS);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"MEETINGS" | "ACTION_ITEMS">("MEETINGS");
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRecord | null>(DEFAULT_MEETINGS[0]);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);

  // New Meeting Form
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    projectRef: "Skyline Residences",
    meetingDate: "",
    meetingTime: "",
    location: "Site Office Meeting Room",
    chairperson: "",
    attendees: "",
    agenda: "",
    discussionNotes: "",
    decisionsTaken: ""
  });

  // New Action Item Form
  const [newAction, setNewAction] = useState({
    meetingCode: "MOM-2026-081",
    taskDescription: "",
    assignedTo: "",
    dueDate: "",
    priority: "MEDIUM",
    remarks: ""
  });

  useEffect(() => {
    fetchMeetingData();
  }, []);

  const fetchMeetingData = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8081/api/meetings/org/1");
      if (res.ok) {
        const data = await res.json();
        if (data.meetings && Array.isArray(data.meetings) && data.meetings.length > 0) {
          setMeetings(data.meetings);
          setSelectedMeeting(data.meetings[0]);
        }
        if (data.actionItems && Array.isArray(data.actionItems) && data.actionItems.length > 0) {
          setActionItems(data.actionItems);
        }
      }
    } catch {
      // Fallback to default
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeeting.title) {
      alert("Please provide a meeting title.");
      return;
    }

    const payload: MeetingRecord = {
      ...newMeeting,
      meetingCode: `MOM-2026-${Math.floor(100 + Math.random() * 900)}`,
      status: "COMPLETED"
    };

    try {
      const res = await fetch("http://localhost:8081/api/meetings/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const saved = await res.json();
        setMeetings([saved, ...meetings]);
        setSelectedMeeting(saved);
      } else {
        setMeetings([payload, ...meetings]);
        setSelectedMeeting(payload);
      }
    } catch {
      setMeetings([payload, ...meetings]);
      setSelectedMeeting(payload);
    }

    setShowMeetingModal(false);
  };

  const handleCreateActionItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAction.taskDescription || !newAction.assignedTo) {
      alert("Please fill in task description and assignee.");
      return;
    }

    const payload: MeetingActionItem = {
      ...newAction,
      status: "OPEN"
    };

    try {
      const res = await fetch("http://localhost:8081/api/meetings/action-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const saved = await res.json();
        setActionItems([saved, ...actionItems]);
      } else {
        setActionItems([payload, ...actionItems]);
      }
    } catch {
      setActionItems([payload, ...actionItems]);
    }

    setShowActionModal(false);
  };

  const toggleActionItemStatus = async (item: MeetingActionItem) => {
    const nextStatus = item.status === "COMPLETED" ? "OPEN" : "COMPLETED";
    if (item.id) {
      try {
        await fetch(`http://localhost:8081/api/meetings/action-items/${item.id}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus })
        });
      } catch {
        // ignore
      }
    }
    setActionItems(actionItems.map(a => a.id === item.id ? { ...a, status: nextStatus } : a));
  };

  const openActionCount = actionItems.filter(a => a.status !== "COMPLETED").length;
  const completedActionCount = actionItems.filter(a => a.status === "COMPLETED").length;

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
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-wide">
                  Meeting Management & Minutes of Meeting (MoM)
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/30">
                  DECISION REGISTER
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Site Coordination, Consultant Reviews, Decision Logs & Action Item Deliverables
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMeetingData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowActionModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <CheckSquare className="h-3.5 w-3.5 text-violet-400" />
            Add Action Item
          </button>
          <button
            onClick={() => setShowMeetingModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            Record Meeting (MoM)
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Metric Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0F192E] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Recorded MoMs</div>
              <div className="text-2xl font-bold text-white mt-1">{meetings.length}</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F192E] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Action Items Logged</div>
              <div className="text-2xl font-bold text-slate-200 mt-1">{actionItems.length}</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <CheckSquare className="h-5 w-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F192E] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pending Deliverables</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">{openActionCount}</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F192E] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Completed Deliverables</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{completedActionCount}</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-800 gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab("MEETINGS")}
            className={`pb-3 transition-colors flex items-center gap-2 ${
              activeTab === "MEETINGS"
                ? "border-b-2 border-violet-500 text-violet-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="h-4 w-4" /> Minutes of Meeting Archive ({meetings.length})
          </button>
          <button
            onClick={() => setActiveTab("ACTION_ITEMS")}
            className={`pb-3 transition-colors flex items-center gap-2 ${
              activeTab === "ACTION_ITEMS"
                ? "border-b-2 border-violet-500 text-violet-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <CheckSquare className="h-4 w-4" /> Action Items & Deliverables ({actionItems.length})
          </button>
        </div>

        {/* Meetings Tab View */}
        {activeTab === "MEETINGS" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Meeting List Sidebar */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Meetings Register</h2>
              {meetings.map((m) => (
                <div
                  key={m.id || m.meetingCode}
                  onClick={() => setSelectedMeeting(m)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedMeeting?.meetingCode === m.meetingCode
                      ? "bg-violet-950/20 border-violet-600/60 shadow-lg shadow-violet-950/20"
                      : "bg-[#0F192E] border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-violet-400 font-bold">{m.meetingCode}</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {m.meetingDate}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white mt-1.5 text-xs line-clamp-2">{m.title}</h3>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[160px]">{m.projectRef}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Meeting Detail View */}
            <div className="lg:col-span-2 rounded-xl bg-[#0F192E] border border-slate-800 p-6 space-y-5">
              {selectedMeeting ? (
                <>
                  <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30">
                          {selectedMeeting.meetingCode}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{selectedMeeting.projectRef}</span>
                      </div>
                      <h2 className="text-base font-bold text-white mt-2">{selectedMeeting.title}</h2>
                    </div>
                    <div className="text-right text-xs">
                      <div className="text-white font-mono flex items-center justify-end gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" /> {selectedMeeting.meetingDate}
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">{selectedMeeting.meetingTime}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-400">Location / Venue:</span>
                      <div className="text-slate-200 font-medium flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-violet-400" /> {selectedMeeting.location}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Chairperson:</span>
                      <div className="text-slate-200 font-medium flex items-center gap-1 mt-0.5">
                        <UserCheck className="h-3.5 w-3.5 text-emerald-400" /> {selectedMeeting.chairperson}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400">Attendees & Stakeholders:</span>
                      <div className="text-slate-300 mt-0.5">{selectedMeeting.attendees}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Agenda Points</h4>
                    <div className="p-3 bg-slate-900/50 rounded-lg text-xs text-slate-300 whitespace-pre-line border border-slate-800/80">
                      {selectedMeeting.agenda}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Key Discussions & Observations</h4>
                    <div className="p-3 bg-slate-900/50 rounded-lg text-xs text-slate-300 whitespace-pre-line border border-slate-800/80">
                      {selectedMeeting.discussionNotes}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Formal Decisions & Approvals Recorded
                    </h4>
                    <div className="p-3 bg-emerald-950/10 rounded-lg text-xs text-emerald-200 whitespace-pre-line border border-emerald-900/40">
                      {selectedMeeting.decisionsTaken}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-slate-400">Select a meeting to view its minutes.</div>
              )}
            </div>
          </div>
        )}

        {/* Action Items Tab View */}
        {activeTab === "ACTION_ITEMS" && (
          <div className="rounded-xl bg-[#0F192E] border border-slate-800 overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center w-12">Done</th>
                  <th className="py-3.5 px-4">MoM Code</th>
                  <th className="py-3.5 px-6">Deliverable / Task Description</th>
                  <th className="py-3.5 px-4">Assigned To</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {actionItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleActionItemStatus(item)}
                        className="text-slate-400 hover:text-emerald-400 transition-colors"
                      >
                        {item.status === "COMPLETED" ? (
                          <CheckSquare className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-500" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-violet-400 whitespace-nowrap">
                      {item.meetingCode}
                    </td>
                    <td className="py-3 px-6 text-white font-medium max-w-md">
                      <div className={item.status === "COMPLETED" ? "line-through text-slate-400" : ""}>
                        {item.taskDescription}
                      </div>
                      {item.remarks && (
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.remarks}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap font-medium">
                      {item.assignedTo}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                      {item.dueDate}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          item.priority === "HIGH"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            : item.priority === "MEDIUM"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          item.status === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : item.status === "IN_PROGRESS"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                            : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* New Meeting Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C1527] border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowMeetingModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
              <div className="h-8 w-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-white">Record Minutes of Meeting (MoM)</h2>
            </div>

            <form onSubmit={handleCreateMeeting} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Meeting Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Structural Consultant Review for Tower B"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Project Reference</label>
                  <input
                    type="text"
                    value={newMeeting.projectRef}
                    onChange={(e) => setNewMeeting({ ...newMeeting, projectRef: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Meeting Date</label>
                  <input
                    type="date"
                    required
                    value={newMeeting.meetingDate}
                    onChange={(e) => setNewMeeting({ ...newMeeting, meetingDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Time & Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 11:00 AM - 12:30 PM"
                    value={newMeeting.meetingTime}
                    onChange={(e) => setNewMeeting({ ...newMeeting, meetingTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Chairperson</label>
                  <input
                    type="text"
                    placeholder="e.g. Er. K. Natarajan"
                    value={newMeeting.chairperson}
                    onChange={(e) => setNewMeeting({ ...newMeeting, chairperson: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Attendees & Representatives</label>
                <input
                  type="text"
                  placeholder="e.g. Site PM, Civil Engineer, Quality Inspector, Structural Lead"
                  value={newMeeting.attendees}
                  onChange={(e) => setNewMeeting({ ...newMeeting, attendees: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Agenda Points</label>
                <textarea
                  rows={2}
                  placeholder="Key discussion topics..."
                  value={newMeeting.agenda}
                  onChange={(e) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Discussion Summary</label>
                <textarea
                  rows={3}
                  placeholder="Detailed discussion notes..."
                  value={newMeeting.discussionNotes}
                  onChange={(e) => setNewMeeting({ ...newMeeting, discussionNotes: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Formal Decisions & Clearances</label>
                <textarea
                  rows={2}
                  placeholder="Actionable agreements and approvals..."
                  value={newMeeting.decisionsTaken}
                  onChange={(e) => setNewMeeting({ ...newMeeting, decisionsTaken: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowMeetingModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold"
                >
                  Save Minutes of Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Action Item Modal */}
      {showActionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C1527] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowActionModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
              <div className="h-8 w-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center">
                <CheckSquare className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-white">Add Meeting Action Item</h2>
            </div>

            <form onSubmit={handleCreateActionItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Meeting Reference Code</label>
                <input
                  type="text"
                  value={newAction.meetingCode}
                  onChange={(e) => setNewAction({ ...newAction, meetingCode: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Deliverable / Task Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Procure 40 bags non-shrink micro-concrete"
                  value={newAction.taskDescription}
                  onChange={(e) => setNewAction({ ...newAction, taskDescription: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Assigned Person / Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Store Manager"
                    value={newAction.assignedTo}
                    onChange={(e) => setNewAction({ ...newAction, assignedTo: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newAction.dueDate}
                    onChange={(e) => setNewAction({ ...newAction, dueDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Priority</label>
                  <select
                    value={newAction.priority}
                    onChange={(e) => setNewAction({ ...newAction, priority: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Remarks</label>
                  <input
                    type="text"
                    placeholder="Optional notes"
                    value={newAction.remarks}
                    onChange={(e) => setNewAction({ ...newAction, remarks: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowActionModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold"
                >
                  Assign Action Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
