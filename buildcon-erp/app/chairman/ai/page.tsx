"use client";
import React, { useState } from "react";
import { Sparkles, Send, Bot, User, Clock, CornerDownLeft, Volume2, ThumbsUp, RefreshCw } from "lucide-react";

const initialSuggestions = [
  "Why did Commercial Complex project delay?",
  "Show me top 5 clients by revenue contribution.",
  "Predict our next quarter revenue trend.",
  "Who are the top performing Project Managers?",
  "Show active safety alerts across Chennai.",
  "What are my pending approvals today?",
];

const mockReplies: Record<string, string> = {
  "Why did Commercial Complex project delay?": "The Commercial Complex project in Madurai is currently delayed due to a supply chain disruption in concrete procurement and minor labour shortages (40 below requirements). Material prices increased by 8% in Q2, affecting concrete delivery rates.",
  "Show me top 5 clients by revenue contribution.": "Top 5 clients by revenue contribution are:\n1. ABC Developers: ₹78.5 Cr\n2. XYZ Constructions: ₹52.0 Cr\n3. PQR Builders: ₹38.2 Cr\n4. L&N Properties: ₹25.0 Cr\n5. Individual Homeowners: ₹18.5 Cr",
  "Predict our next quarter revenue trend.": "Based on current order book value of ₹441.5 Cr and lead pipeline, Q3 Revenue is forecasted at ₹78.0 Cr (an estimated growth of 12% quarter-on-quarter). Key drivers are Chennai residential sales.",
  "Who are the top performing Project Managers?": "Top performing Project Managers this quarter based on project margin retention & safety audit scores:\n1. Amit Kumar (Chennai site) - Margin: 18.2%, Audit: 98%\n2. Vijay Kumar (Skyline site) - Margin: 14.5%, Audit: 94%",
  "Show active safety alerts across Chennai.": "Active Safety Alert: High-risk operations detected at Commercial Complex. Deep excavation work requires immediate safety auditor oversight. PPE compliance is currently at 98%.",
  "What are my pending approvals today?": "You have 6 pending approvals total:\n- PO: Steel Procurement (₹75.0 Lakhs)\n- Investment: Coimbatore Branch (₹1.5 Cr)\n- Capex: Tower Crane (₹1.2 Cr)\n- Opex: Sub-Contractor Invoice (₹15.0 Lakhs)\n- Material: Cement Supply (₹45.0 Lakhs)\n- Project variation: Civil Work (₹8.5 Lakhs)",
};

interface Message {
  sender: "bot" | "user";
  text: string;
  time: string;
}

export default function AIExecutiveAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Good Morning, Chairman! I'm your AI business assistant. How can I help you analyze your operations today?", time: "10:30 AM" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const newMsgs = [...messages, { sender: "user" as const, text: textToSend, time: "Just now" }];
    setMessages(newMsgs);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const lower = textToSend.trim();
      const reply = mockReplies[lower] || `I have analyzed the data database for "${textToSend}". Total contract value remains ₹441.5 Cr with an average safety score of 96%. Let me know if you would like me to compile a PDF summary report.`;

      setMessages((prev) => [...prev, { sender: "bot", text: reply, time: "Just now" }]);
      setTyping(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">10. AI EXECUTIVE ASSISTANT</h2>
        <p className="text-xs text-slate-400">Your intelligent business companion</p>
      </div>

      {/* Main Chat Interface */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Chat window */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5 lg:col-span-3 flex flex-col h-[520px]">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-3 items-start max-w-[85%] ${m.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center ${m.sender === "user" ? "bg-blue-600 text-white font-bold" : "bg-[#1E293B] text-blue-400"}`}>
                  {m.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4.5 w-4.5" />}
                </div>
                <div className={`rounded-xl p-3 text-xs leading-relaxed ${m.sender === "user" ? "bg-blue-600 text-white" : "bg-[#0E1726]/80 text-slate-200 border border-slate-800/80"}`}>
                  <p className="whitespace-pre-line">{m.text}</p>
                  <span className="text-[9px] text-slate-400 block mt-1.5 text-right">{m.time}</span>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-3 items-start">
                <div className="h-8 w-8 rounded-lg bg-[#1E293B] text-blue-400 flex items-center justify-center shrink-0">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                <div className="bg-[#0E1726]/80 border border-slate-800/80 rounded-xl px-4 py-3 text-xs text-slate-400">
                  AI is typing<span className="animate-pulse">...</span>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="mt-4 pt-3 border-t border-slate-850 flex gap-2 items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSend(input); }}
              placeholder="Ask a question about your business operations, safety, or approvals..."
              className="flex-1 bg-[#0E1726] border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500 placeholder:text-slate-500"
            />
            <button onClick={() => handleSend(input)} className="h-9 w-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center shrink-0 transition-colors">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Suggestion Sidebar */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Suggested Questions</h3>
          </div>
          <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">Select one of the preset prompts to test the AI assistant with real database insights.</p>
          <div className="space-y-2.5">
            {initialSuggestions.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="w-full text-left p-2.5 text-[11px] text-slate-300 hover:text-white bg-[#0E1726]/60 border border-slate-800/80 hover:border-slate-700 rounded-lg transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
