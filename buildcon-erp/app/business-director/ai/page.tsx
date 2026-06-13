"use client";
import React, { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";

export default function AISalesAssistant() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello Rajesh Verma. I am your BuildWell AI Sales Assistant. I have analyzed active client funnels, marketing performance, submitted proposals, and government tender metrics. Ask me anything about lead conversions or bid strategies." }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;

    const userMessage = { role: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      let reply = "I've analyzed that request. Google Ads currently yields the highest quality leads (Qualified leads: 520, cost per lead: ₹196).";
      if (input.toLowerCase().includes("tender")) {
        reply = "We have won 4 tenders MTD, and IT Park Phase - 2 (₹ 25.0 Cr) is currently shortlisted with a high conversion score.";
      } else if (input.toLowerCase().includes("proposal")) {
        reply = "We have sent 180 proposals MTD, and 60 proposals are currently under review by clients.";
      } else if (input.toLowerCase().includes("leads")) {
        reply = "Out of 1,250 total leads, 520 are qualified (41.6% Qualification rate).";
      }
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">11. AI SALES ASSISTANT</h2>
        <p className="text-xs text-slate-400">Natural language insights, automated summaries, and conversion predictions</p>
      </div>

      <div className="bg-[#111C30] border border-slate-800 rounded-xl flex flex-col h-[500px]">
        {/* Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 max-w-xl ${m.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
              <div className={`h-8 w-8 rounded-lg grid place-items-center shrink-0 ${m.role === "user" ? "bg-blue-600 text-white" : "bg-emerald-500/10 text-emerald-450 text-emerald-450 text-emerald-400 border border-emerald-500/20"}`}>
                <Bot className="h-4 w-4" />
              </div>
              <div className={`p-3 rounded-xl text-xs leading-relaxed ${m.role === "user" ? "bg-blue-600 text-white" : "bg-[#0e1628] border border-slate-800 text-slate-200"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-800 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI about sales status, proposal scorecards, or tenders..."
            className="flex-1 bg-[#0A1120] border border-slate-800 rounded-lg px-4 py-2 text-xs text-white outline-none focus:border-blue-500"
          />
          <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:brightness-110 text-white rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-500/10">
            <Send className="h-3.5 w-3.5" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
