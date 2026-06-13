"use client";
import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, Send, User, Sparkles, RefreshCw, Trash2, 
  FileText, ShieldAlert, Users, PlusCircle 
} from "lucide-react";

interface Message {
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
}

export default function AiHrAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "assistant",
      text: "Hello, Meenakshi Iyer! I am your AI HR Assistant. I have indexed the current employee roster, attendance registers, statutory regulations, and payroll tables. How can I help you today?",
      timestamp: "10:45 AM"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const quickChips = [
    { label: "Draft POSH Safety Warning", icon: <ShieldAlert className="h-3 w-3" /> },
    { label: "Show Supervisor Recruitment stats", icon: <Users className="h-3 w-3" /> },
    { label: "List compliance alert details", icon: <FileText className="h-3 w-3" /> },
    { label: "Summarize pending leaves", icon: <PlusCircle className="h-3 w-3" /> }
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      sender: "user",
      text,
      timestamp: timeString
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate response
    setTimeout(() => {
      let replyText = "";
      if (text.toLowerCase().includes("safety warning") || text.toLowerCase().includes("posh")) {
        replyText = `**MEMORANDUM OF COMPLIANCE WARNING**\n\n**To:** All Construction Site Subcontractors & Supervisors\n**Subject:** Mandatory POSH & Anti-Harassment Compliance Training Refresher\n\n**Notice:** Please find attached the drafted safety and workplace decorum circular. It specifies that all contract labour supervisors must undergo the 2-hour POSH compliance training before 25th June 2025. Please review and click 'Generate PDF Circular' to print or email to supervisors.`;
      } else if (text.toLowerCase().includes("recruitment") || text.toLowerCase().includes("supervisor")) {
        replyText = `**Supervisor Recruitment Pipeline (June 2025):**\n\n* **Open Vacancies:** 6 (Site B: 4, Site C: 2)\n* **Applications Screened:** 24\n* **Scheduled Interviews:** 8 (Ongoing this week)\n* **Selected / Pending Offer Letter:** 2 candidates (Rahul Dev, M. G. Swaminathan)\n\nWould you like me to draft offer letters for the selected supervisor candidates?`;
      } else if (text.toLowerCase().includes("compliance")) {
        replyText = `**Current Compliance Alerts (Action Required):**\n\n1. **AUD-104 (Contractor Wage & PF Compliance Audit):** Score of 89.2% requires a corrective action report submitted to the Labour Commissioner within 10 days regarding Site C contractor provident fund registration.\n2. **Statutory Filing due on 20th June 2025:** Minimum Wages Compliance Declaration draft ready for review.`;
      } else if (text.toLowerCase().includes("leave")) {
        replyText = `There are currently **14 pending leave requests** requiring your approval:\n\n* **Casual / Sick Leave:** 8 applications (Labour workforce at site A)\n* **Earned Leave:** 4 applications (Engineers / Project staff)\n* **Maternity / Paternity Leave:** 2 applications (Office staff)\n\nYou can view and approve these requests in the [Leave Management](/hr-manager/leave) console.`;
      } else {
        replyText = `I have received your request regarding: "${text}". I can fetch live data on workforce distribution, generate employment agreement templates, track PF filings, or calculate attendance discrepancies. Let me know which task you would like to initiate!`;
      }

      setMessages(prev => [...prev, {
        sender: "assistant",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          AI HR Copilot <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Assistant Beta</span>
        </h2>
        <p className="text-xs text-slate-400">Ask questions, draft policies, parse worker database details, and automate reporting tasks using NLP queries.</p>
      </div>

      {/* Main Console */}
      <div className="flex-1 min-h-0 bg-[#0F182A] border border-slate-800 rounded-xl flex flex-col justify-between overflow-hidden shadow-inner">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex gap-3 max-w-[80%] ${
                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center border ${
                msg.sender === "user" 
                  ? "bg-emerald-600/20 border-emerald-500/30 text-emerald-400" 
                  : "bg-slate-800 border-slate-700 text-slate-300"
              }`}>
                {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div className="space-y-1">
                <div className={`p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-emerald-600 text-white rounded-tr-none"
                    : "bg-[#111C30] border border-slate-800 text-slate-200 rounded-tl-none"
                }`}>
                  {msg.text}
                </div>
                <div className={`text-[10px] text-slate-500 px-1 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 mr-auto max-w-[80%]">
              <div className="h-8 w-8 rounded-full shrink-0 flex items-center justify-center bg-slate-800 border border-slate-700 text-slate-300">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-[#111C30] border border-slate-800 p-3 rounded-xl rounded-tl-none flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Chips & Input area */}
        <div className="p-4 border-t border-slate-800 bg-[#0A1120]/40 space-y-3">
          {/* Chip lists */}
          <div className="flex flex-wrap gap-2">
            {quickChips.map((chip, idx) => (
              <button 
                key={idx}
                onClick={() => handleSend(chip.label)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-full bg-[#111C30] border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                {chip.icon}
                {chip.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2 bg-[#111C30] border border-slate-800 rounded-lg p-1 px-3"
          >
            <input 
              type="text" 
              placeholder="Ask AI Copilot to draft warnings, check leaves, or outline hiring stats..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 flex-1 py-2"
            />
            <button 
              type="submit"
              className="p-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              disabled={!input.trim()}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
