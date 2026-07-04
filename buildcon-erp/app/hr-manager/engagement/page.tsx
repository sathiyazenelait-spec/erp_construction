"use client";
import React, { useState, useEffect } from "react";
import { 
  Heart, Smile, Calendar, AlertCircle, Plus, Send, 
  MessageSquare, User, CheckCircle2, ShieldAlert, X, RefreshCw
} from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface FeedbackEvent {
  id: number;
  title: string;
  type: "Townhall" | "Team Outing" | "Training" | "Celebration";
  date: string;
  location: string;
  status: "Scheduled" | "Completed";
  registered: number;
}

interface Grievance {
  id: number;
  employee: string;
  type: string;
  date: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Investigation" | "Resolved";
  summary: string;
}

export default function EngagementPage() {
  const [activeTab, setActiveTab] = useState<"survey" | "events" | "grievances">("survey");
  
  // Data lists
  const [events, setEvents] = useState<FeedbackEvent[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Plan Event Modal States
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState<"Townhall" | "Team Outing" | "Training" | "Celebration">("Townhall");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventAttendees, setEventAttendees] = useState("");
  const [eventSubmitLoading, setEventSubmitLoading] = useState(false);

  // Update Grievance Modal States
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [grievanceStatus, setGrievanceStatus] = useState<"Open" | "In Investigation" | "Resolved">("Open");
  const [grievanceSubmitLoading, setGrievanceSubmitLoading] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      setErrorMsg(null);
      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) {
        setErrorMsg("Session expired or missing authentication.");
        setLoading(false);
        return;
      }
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;
      if (!orgId) {
        setErrorMsg("No organization associated with this session.");
        setLoading(false);
        return;
      }

      // Fetch Events
      const evRes = await fetch(`https://erp-construction.onrender.com/api/hr-manager/events/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (evRes.ok) {
        const evData = await evRes.json();
        setEvents(evData);
      }

      // Fetch Grievances
      const grRes = await fetch(`https://erp-construction.onrender.com/api/hr-manager/grievances/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (grRes.ok) {
        const grData = await grRes.json();
        setGrievances(grData);
      }

    } catch (e) {
      console.error("Failed to load engagement data:", e);
      setErrorMsg("Failed to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handlePlanEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate || !eventLocation.trim()) return;
    setEventSubmitLoading(true);

    try {
      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) return;

      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;

      const res = await fetch("https://erp-construction.onrender.com/api/hr-manager/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: eventTitle,
          type: eventType,
          date: eventDate,
          location: eventLocation,
          status: "Scheduled",
          registered: eventAttendees ? parseInt(eventAttendees, 10) : 0,
          organizationId: orgId
        })
      });

      if (res.ok) {
        setEventTitle("");
        setEventDate("");
        setEventLocation("");
        setEventAttendees("");
        setShowEventModal(false);
        loadData();
        alert("Engagement event planned successfully!");
      } else {
        alert("Failed to save event.");
      }
    } catch (err) {
      console.error("Error creating event:", err);
    } finally {
      setEventSubmitLoading(false);
    }
  };

  const handleUpdateGrievanceStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance) return;
    setGrievanceSubmitLoading(true);

    try {
      const token = localStorage.getItem("buildcon_token");
      if (!token) return;

      const res = await fetch(`https://erp-construction.onrender.com/api/hr-manager/grievances/${selectedGrievance.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(grievanceStatus)
      });

      if (res.ok) {
        setShowGrievanceModal(false);
        setSelectedGrievance(null);
        loadData();
        alert("Grievance status updated successfully!");
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating grievance:", err);
    } finally {
      setGrievanceSubmitLoading(false);
    }
  };

  // Survey data (mock stats)
  const categories = [
    { name: "Work Environment", score: "4.3 / 5", percentage: 86 },
    { name: "Management Transparency", score: "4.0 / 5", percentage: 80 },
    { name: "Compensation & Benefits", score: "3.9 / 5", percentage: 78 },
    { name: "Career Growth", score: "4.1 / 5", percentage: 82 },
    { name: "Work-Life Balance", score: "4.4 / 5", percentage: 88 },
  ];

  const pendingGrievances = grievances.filter(g => g.status !== "Resolved").length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Employee Engagement & Welfare</h2>
          <p className="text-xs text-slate-400">Monitor work satisfaction scores, organise employee activities, and resolve grievance requests.</p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111C30] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-955/20 border border-red-500/20 text-red-400 rounded-xl p-5 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="text-xs font-semibold">{errorMsg}</div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Satisfaction Survey</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Smile className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">4.2 / 5.0</span>
            <span className="text-xs font-medium text-emerald-400">Excellent</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Based on Q1 Quarterly survey</p>
        </div>

        <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Participation Rate</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Heart className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">88%</span>
            <span className="text-xs font-medium text-blue-400">High Engagement</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">190 responses received</p>
        </div>

        <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upcoming Events</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{events.filter(e => e.status === "Scheduled").length} Scheduled</span>
            <span className="text-xs font-medium text-indigo-400">Active</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Events scheduled statefully</p>
        </div>

        <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Grievances</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{pendingGrievances} Open</span>
            <span className="text-xs font-medium text-rose-400">Pending Resolution</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Grievance SLA target: 48h</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab("survey")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "survey"
              ? "border-emerald-500 text-white"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Satisfaction Survey
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "events"
              ? "border-emerald-500 text-white"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Engagement Events
        </button>
        <button
          onClick={() => setActiveTab("grievances")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "grievances"
              ? "border-emerald-500 text-white"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Grievance Redressal
        </button>
      </div>

      {loading ? (
        <div className="bg-[#111C30]/50 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs italic flex flex-col items-center justify-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <span>Synchronizing engagement logs with database...</span>
        </div>
      ) : (
        <>
          {/* Satisfaction Tab */}
          {activeTab === "survey" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Survey Scoring Breakdown</h3>
                <div className="space-y-4">
                  {categories.map((cat, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300">{cat.name}</span>
                        <span className="font-bold text-white">{cat.score}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Anonymous Sentiment Analysis</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Aggregated comments point towards high satisfaction with project clarity and safety equipment availability. Major room for improvement centers around remote site drinking water systems, transit scheduling for late-shift workers, and quick turnaround on PF reimbursement claims.
                  </p>
                </div>
                <div className="mt-6 p-4 rounded-lg bg-[#111C30]/50 border border-slate-850 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <MessageSquare className="h-4 w-4 text-emerald-400" />
                    Latest Survey Insight
                  </div>
                  <p className="text-xs italic text-slate-300 font-sans">
                    &ldquo;Site supervisors communicate targets clearly, but payroll inquiries take up to 4 days to resolve. Need a faster helpdesk channel.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="bg-[#0F182A] border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Upcoming & Recent Events</h3>
                <button 
                  onClick={() => setShowEventModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 text-slate-950 font-bold text-xs transition-colors shadow-md"
                >
                  <Plus className="h-3.5 w-3.5" /> Plan Event
                </button>
              </div>

              {events.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs italic">
                  No engagement events scheduled yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {events.map((evt) => (
                    <div key={evt.id} className="p-4 rounded-xl bg-[#111C30] border border-slate-800 flex flex-col justify-between gap-3 text-xs">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wide">{evt.type}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                            evt.status === "Scheduled" 
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                              : "bg-slate-500/10 text-slate-400 border border-slate-700"
                          }`}>
                            {evt.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1.5">{evt.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">Where: {evt.location}</p>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-800 pt-2.5">
                        <span className="text-[10px] text-slate-500 font-mono">Scheduled: {evt.date}</span>
                        <span className="text-[10px] font-semibold text-slate-300">{evt.registered} Attendees</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Grievance Tab */}
          {activeTab === "grievances" && (
            <div className="bg-[#0F182A] border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Grievance logs & Redressal Desk</h3>
                <span className="text-xs text-rose-455 text-rose-450 text-rose-400 font-semibold">SLA Limit: 48 Hours Response</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-[#111C30]/50 text-slate-400 text-xs font-semibold">
                      <th className="p-4">Ticket</th>
                      <th className="p-4">Employee</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Date Logged</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-800/50">
                    {grievances.map((gri) => (
                      <tr key={gri.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono font-medium text-emerald-450 text-emerald-400">GRV-{gri.id}</td>
                        <td className="p-4 text-white font-semibold flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold font-mono">
                            {gri.employee[0]}
                          </div>
                          {gri.employee}
                        </td>
                        <td className="p-4 text-slate-300">{gri.type}</td>
                        <td className="p-4 text-slate-400 font-mono">{gri.date}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            gri.priority === "High" 
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                              : gri.priority === "Medium"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-slate-500/10 text-slate-400 border border-slate-700"
                          }`}>
                            {gri.priority}
                          </span>
                        </td>
                        <td className="p-4 text-slate-350 max-w-xs truncate" title={gri.summary}>{gri.summary}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            gri.status === "Resolved"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : gri.status === "In Investigation"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-rose-500/10 text-rose-455 text-rose-450 text-rose-400 border-rose-500/20"
                          }`}>
                            {gri.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => {
                              setSelectedGrievance(gri);
                              setGrievanceStatus(gri.status);
                              setShowGrievanceModal(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#111C30] border border-slate-800 text-[10px] font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition"
                          >
                            Update Status
                          </button>
                        </td>
                      </tr>
                    ))}
                    {grievances.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500 italic">No grievance logs registered yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Plan Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-gradient-to-br from-[#0F172A] to-[#0A1120] border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="h-4.5 w-4.5 text-emerald-400" /> Plan Engagement Activity
              </h3>
              <button 
                onClick={() => setShowEventModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handlePlanEvent} className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Event Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Q2 Corporate Townhall"
                  className="w-full bg-[#111C30] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Event Type</label>
                  <select 
                    className="w-full bg-[#111C30] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                  >
                    <option value="Townhall">Townhall</option>
                    <option value="Team Outing">Team Outing</option>
                    <option value="Training">Training</option>
                    <option value="Celebration">Celebration</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Scheduled Date</label>
                  <input 
                    type="date"
                    className="w-full bg-[#111C30] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Location / Venue</label>
                <input 
                  type="text"
                  placeholder="e.g. Main Conference Hall / Site A"
                  className="w-full bg-[#111C30] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Expected Attendees</label>
                <input 
                  type="number"
                  placeholder="e.g. 150"
                  className="w-full bg-[#111C30] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500"
                  value={eventAttendees}
                  onChange={(e) => setEventAttendees(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                disabled={eventSubmitLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs hover:brightness-110 transition disabled:opacity-50 mt-2 shadow-md shadow-emerald-500/10"
              >
                {eventSubmitLoading ? "Scheduling event..." : "Publish Event"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Update Grievance Modal */}
      {showGrievanceModal && selectedGrievance && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-gradient-to-br from-[#0F172A] to-[#0A1120] border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5 text-rose-500" /> Update Grievance Status
              </h3>
              <button 
                onClick={() => { setShowGrievanceModal(false); setSelectedGrievance(null); }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleUpdateGrievanceStatus} className="space-y-4 text-xs font-sans">
              <div className="p-3 bg-[#111C30] border border-slate-800 rounded-lg space-y-1">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Logged Complaint Ticket</div>
                <div className="font-bold text-white font-mono">GRV-{selectedGrievance.id}</div>
                <div className="text-[11px] text-slate-350 italic">“{selectedGrievance.summary}”</div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Set Resolution Status</label>
                <select 
                  className="w-full bg-[#111C30] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500"
                  value={grievanceStatus}
                  onChange={(e) => setGrievanceStatus(e.target.value as any)}
                  required
                >
                  <option value="Open">Open</option>
                  <option value="In Investigation">In Investigation</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={grievanceSubmitLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs hover:brightness-110 transition disabled:opacity-50 mt-2 shadow-md shadow-emerald-500/10"
              >
                {grievanceSubmitLoading ? "Saving resolution details..." : "Save Status"}
              </button>
            </form>
          </div>
        </div>
      )}

      <AIAssistantBar suggestions={["Export grievance reports log", "Identify highest category of complaints", "Plan corporate safety seminar"]} />
    </div>
  );
}
