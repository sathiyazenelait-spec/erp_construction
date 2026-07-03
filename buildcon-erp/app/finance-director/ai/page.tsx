"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { getSession } from "@/lib/auth";

interface Message {
  sender: "ai" | "user";
  text: string;
  time: string;
}

export default function AIFinanceAssistant() {
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Good day. I am your AI Finance Assistant. Ask me anything about accounts, margins, cash flow projections, or budget status.", time: "10:30 AM" }
  ]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = getSession();
    setSession(s);
    const orgId = s?.organizationId || 1;
    const token = typeof window !== "undefined" ? localStorage.getItem("buildcon_token") : null;
    fetch(`http://localhost:8081/api/finance-director/dashboard/org/${orgId}`, {
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    })
      .then((res) => res.json())
      .then((d) => {
        if (d.ai_suggestions) {
          setSuggestions(d.ai_suggestions.split("|").map((item: string) => item.trim()));
        }
        if (d.profileName) {
          setMessages([
            { sender: "ai", text: `Good day, ${d.profileName}. I am your AI Finance Assistant. Ask me anything about accounts, margins, cash flow projections, or budget status.`, time: "10:30 AM" }
          ]);
        }
      })
      .catch((err) => {
        console.error("Error fetching AI suggestions for FD:", err);
        setSuggestions([
          "Why profit margin decreased?",
          "Least profitable project",
          "Year-end profit forecast"
        ]);
      });
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: Message = { 
      sender: "user", 
      text, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    try {
      const orgId = session?.organizationId || 1;
      const token = typeof window !== "undefined" ? localStorage.getItem("buildcon_token") : null;
      const res = await fetch("http://localhost:8081/api/finance-director/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: text, organizationId: String(orgId) }),
      });
      if (res.ok) {
        const d = await res.json();
        const aiMsg: Message = { 
          sender: "ai", 
          text: d.response, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const aiMsg: Message = { 
          sender: "ai", 
          text: "Error calling AI Assistant backend.", 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      const aiMsg: Message = { 
        sender: "ai", 
        text: "AI service is currently offline. Please check connection.", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages((prev) => [...prev, aiMsg]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-4xl mx-auto bg-[#111C30] border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#0f182a] p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">AI Copilot (Finance)</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Online & Ready
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}>
            <div className={`h-8 w-8 rounded-lg shrink-0 grid place-items-center text-xs font-bold border ${
              msg.sender === "user" 
                ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/30" 
                : "bg-blue-600/20 text-blue-400 border-blue-500/30"
            }`}>
              {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className={`rounded-xl p-3.5 text-xs text-slate-200 leading-relaxed shadow-sm ${
              msg.sender === "user" 
                ? "bg-[#0e1628] border border-emerald-500/20 rounded-tr-none" 
                : "bg-[#0f182a] border border-slate-850 rounded-tl-none"
            }`}>
              <div>{msg.text}</div>
              <div className="text-[9px] text-slate-500 mt-1.5 text-right">{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Suggestions List */}
      <div className="p-3 border-t border-slate-850 bg-[#0e1628] flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSend(suggestion)}
            className="text-[10px] bg-[#111C30] hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-800 transition"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-slate-800 bg-[#0f182a] flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the general ledger or margins..."
          className="flex-1 bg-[#111C30] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition placeholder:text-slate-500"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-emerald-500/10"
        >
          <Send className="h-3 w-3" />
          Send
        </button>
      </form>
    </div>
  );
}
