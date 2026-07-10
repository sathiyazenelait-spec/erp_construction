"use client";
import React, { useState, useEffect } from "react";
import { MessageSquare, Send, CheckCircle2, Clock, AlertCircle, Sparkles, User, ShieldAlert, Bot } from "lucide-react";
import { getSession } from "@/lib/auth";

interface Ticket {
  id?: number;
  sender: string;
  recipient: string;
  subject: string;
  description: string;
  ticketType: string;
  priority: string;
  status: string;
  date: string;
  organizationId: number;
}

interface ChatMessage {
  sender: string;
  text: string;
  time: string;
}

const RECIPIENTS = [
  "Managing Director",
  "Contractor",
  "Marketing Manager",
  "Project Manager",
  "HR Manager"
];

const TICKET_TYPES = [
  "Strategic Directive",
  "Delay Escalation",
  "Budget Revision",
  "Marketing Campaign",
  "Workforce Dispute",
  "Quality Alert"
];

const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export default function CommunicationPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [orgId, setOrgId] = useState<number | null>(null);

  // New Ticket Form State
  const [recipient, setRecipient] = useState(RECIPIENTS[0]);
  const [ticketType, setTicketType] = useState(TICKET_TYPES[0]);
  const [priority, setPriority] = useState("High");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Chat Simulator State
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<number, ChatMessage[]>>({});
  const [currentMessage, setCurrentMessage] = useState("");

  const fetchTickets = async (resolvedOrgId: number) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch(`https://erp-construction.onrender.com/api/chairman/tickets/org/${resolvedOrgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (e) {
      console.error("Failed to load tickets", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const s = getSession();
    if (s && s.organizationId) {
      setOrgId(s.organizationId);
      fetchTickets(s.organizationId);
    } else {
      setLoading(false);
    }
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description || !orgId) return;
    setSubmitting(true);

    const newTicket: Ticket = {
      sender: "Chairman",
      recipient,
      subject,
      description,
      ticketType,
      priority,
      status: "Open",
      date: new Date().toISOString().split("T")[0],
      organizationId: orgId
    };

    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("https://erp-construction.onrender.com/api/chairman/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newTicket)
      });

      if (res.ok) {
        const data = await res.json();
        setTickets(prev => [data, ...prev]);
        setSubject("");
        setDescription("");
        
        // Seed initial message
        if (data.id) {
          setChatMessages(prev => ({
            ...prev,
            [data.id]: [
              { sender: "Chairman", text: description, time: "Just Now" }
            ]
          }));
        }
      }
    } catch (e) {
      console.error("Error creating ticket", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (ticketId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch(`https://erp-construction.onrender.com/api/chairman/tickets/${ticketId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain",
          "Authorization": `Bearer ${token}`
        },
        body: newStatus
      });
      if (res.ok) {
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (e) {
      console.error("Error updating status", e);
    }
  };

  const getSimulatedReply = (recipient: string, message: string): string => {
    const msgLower = message.toLowerCase();
    if (recipient === "Managing Director") {
      if (msgLower.includes("profit") || msgLower.includes("revenue") || msgLower.includes("target")) {
        return "I have reviewed the numbers, Chairman. We are optimizing structural spends in phase 2 to ensure we hit our gross profit projections. I will present the audited figures in the board review next Wednesday.";
      }
      return "Received your directive, Chairman. I am coordinating with the project directors to ensure all key metrics align with our strategic pipeline.";
    } else if (recipient === "Contractor") {
      if (msgLower.includes("delay") || msgLower.includes("skyline") || msgLower.includes("concrete")) {
        return "Apologies for the inconvenience, Chairman. The concrete supply batch has been resolved and the logisticians have guaranteed daily delivery. We are working overtime shifts to recover the 3 weeks lag.";
      }
      return "Acknowledged, Chairman. We have deployed additional scaffolding workers at the site to expedite structural activities.";
    } else if (recipient === "Marketing Manager") {
      return "We are scaling our digital campaign targeting premium residential inquiries, Chairman. The SEO optimizations are complete, and we expect a 25% surge in qualified leads this month.";
    } else if (recipient === "Project Manager") {
      return "Acknowledged, Chairman. We have updated the BOQ tracking records and are reviewing material allocations to keep construction costs within budget.";
    } else {
      return "Directive received, Chairman. The HR department is coordinating labour welfare audits to resolve the workforce dispute immediately.";
    }
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim() || !selectedTicket || !selectedTicket.id) return;
    const ticketId = selectedTicket.id;
    const userMsg: ChatMessage = {
      sender: "Chairman",
      text: currentMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => ({
      ...prev,
      [ticketId]: [...(prev[ticketId] || []), userMsg]
    }));
    setCurrentMessage("");

    // Simulate response after 1.5 seconds
    setTimeout(() => {
      const botReplyText = getSimulatedReply(selectedTicket.recipient, userMsg.text);
      const botMsg: ChatMessage = {
        sender: selectedTicket.recipient,
        text: botReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => ({
        ...prev,
        [ticketId]: [...(prev[ticketId] || []), botMsg]
      }));
    }, 1500);
  };

  const getPriorityColor = (p: string) => {
    switch (p.toLowerCase()) {
      case "critical": return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      default: return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s.toLowerCase()) {
      case "resolved": return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "in investigation": return <Clock className="h-4 w-4 text-yellow-400 animate-pulse" />;
      default: return <AlertCircle className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-400" />
            Executive Communications & Directives
          </h2>
          <p className="text-xs text-slate-400">
            Direct, high-priority strategic channel to raise tickets and issue directives to technical heads and contractors.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Raised Tickets Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* New Directive Form */}
          <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-blue-400" />
              Issue New Strategic Directive / Ticket
            </h3>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">To Representative</label>
                  <select
                    className="w-full bg-[#0A1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  >
                    {RECIPIENTS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Directive Category</label>
                  <select
                    className="w-full bg-[#0A1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
                    value={ticketType}
                    onChange={(e) => setTicketType(e.target.value)}
                  >
                    {TICKET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Priority Scope</label>
                  <select
                    className="w-full bg-[#0A1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Skyline residences slab concrete delay investigation"
                  className="w-full bg-[#0A1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Directive Details / Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide explicit instructions or directive parameters..."
                  className="w-full bg-[#0A1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:brightness-110 text-white text-xs font-semibold rounded-lg px-4 py-2 flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
                >
                  <Send className="h-3 w-3" />
                  {submitting ? "Sending directive..." : "Dispatch Strategic Directive"}
                </button>
              </div>
            </form>
          </div>

          {/* Tickets List */}
          <div className="bg-[#111A2E] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800 bg-[#0F182A]">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Directives Queue</h3>
            </div>
            
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading directives queue...</div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No directives raised yet. Use the form above to dispatch directives.</div>
            ) : (
              <div className="divide-y divide-slate-800/60 max-h-[400px] overflow-y-auto">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTicket(t);
                      if (t.id && !chatMessages[t.id]) {
                        setChatMessages(prev => ({
                          ...prev,
                          [t.id!]: [
                            { sender: "Chairman", text: t.description, time: "Initial" }
                          ]
                        }));
                      }
                    }}
                    className={`p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors ${
                      selectedTicket && selectedTicket.id === t.id ? "bg-slate-800/60 border-l-4 border-blue-500" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getPriorityColor(t.priority)}`}>
                          {t.priority}
                        </span>
                        <span className="text-[10px] text-slate-400">To {t.recipient}</span>
                        <span className="text-[10px] text-slate-500">{t.date}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-white truncate">{t.subject}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{t.description}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(t.status)}
                        <span className="text-[11px] font-medium capitalize text-slate-350">{t.status.toLowerCase()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Chat Simulator Column */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl flex flex-col h-[580px] shadow-lg">
          {selectedTicket ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-800 bg-[#0F182A] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white truncate">{selectedTicket.subject}</h4>
                  <p className="text-[10px] text-slate-400">Direct link to: {selectedTicket.recipient}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <select
                    className="bg-[#0A1120] border border-slate-800 rounded px-1.5 py-1 text-[10px] text-slate-300 outline-none"
                    value={selectedTicket.status}
                    onChange={(e) => {
                      if (selectedTicket.id) {
                        handleUpdateStatus(selectedTicket.id, e.target.value);
                      }
                    }}
                  >
                    <option value="Open">Open</option>
                    <option value="In Investigation">Investigation</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Chat History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0A1120]/40">
                {selectedTicket.id && (chatMessages[selectedTicket.id] || []).map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[85%] ${
                      msg.sender === "Chairman" ? "ml-auto items-end" : "mr-auto items-start"
                    }`}
                  >
                    <span className="text-[9px] text-slate-500 mb-0.5">{msg.sender}</span>
                    <div
                      className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                        msg.sender === "Chairman"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/50"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-slate-600 mt-0.5">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-slate-800 bg-[#0F182A]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Message ${selectedTicket.recipient}...`}
                    className="flex-1 bg-[#0A1120] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
              <Bot className="h-10 w-10 text-slate-700 mb-2 animate-bounce" />
              <p className="text-xs">Select a directive from the queue to start a direct simulated chat line with the technical heads.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
