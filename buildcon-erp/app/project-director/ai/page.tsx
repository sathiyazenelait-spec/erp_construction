"use client";
import React, { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";

export default function AIProjectAssistant() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello Arvind. I am your BuildWell AI Project Assistant. I have analyzed active construction milestones, PM scorecards, change orders, and material pipelines. Ask me anything about project delays, quality audits, or budget overruns." }
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
      let reply = "I've analyzed that request. Our primary risk is currently at the Phoenix Commercial Complex site due to concrete shortages and 45 days of delays.";
      if (input.toLowerCase().includes("delay")) {
        reply = "Currently, Greenfield Apartments is delayed by 15 days, and Phoenix Commercial Complex is delayed by 45 days (Critical risk).";
      } else if (input.toLowerCase().includes("pm") || input.toLowerCase().includes("performance")) {
        reply = "Suresh Babu has the highest overall rating (95%) with 90% on-time delivery across active sites.";
      } else if (input.toLowerCase().includes("budget")) {
        reply = "Greenfield Apartments and Phoenix Commercial Complex are currently Over Budget.";
      }
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">11. AI PROJECT ASSISTANT</h2>
        <p className="text-xs text-slate-400">Natural language insights, automated summaries, and site risk predictions</p>
      </div>

      <div className="bg-[#111C30] border border-slate-800 rounded-xl flex flex-col h-[500px]">
        {/* Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 max-w-xl ${m.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
              <div className={`h-8 w-8 rounded-lg grid place-items-center shrink-0 ${m.role === "user" ? "bg-blue-600 text-white" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
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
            placeholder="Ask AI about project status, PM scorecards, or delays..."
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
