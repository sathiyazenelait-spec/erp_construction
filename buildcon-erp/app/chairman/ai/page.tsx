"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { getSession } from "@/lib/auth";

interface Message {
  sender: "bot" | "user";
  text: string;
  time: string;
}

export default function AIExecutiveAssistant() {
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Good Morning, Chairman! I'm your AI business assistant. How can I help you analyze your operations today?", time: "10:30 AM" }
  ]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = getSession();
    setSession(s);
    const token = localStorage.getItem("buildcon_token");
    const orgId = s?.organizationId || 1;
    fetch(`https://erp-construction.onrender.com/api/chairman/dashboard/org/${orgId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((d) => {
        if (d.ai_suggestions) {
          setSuggestions(d.ai_suggestions.split("|").map((item: string) => item.trim()));
        }
        if (d.profileName) {
          setMessages([
            { sender: "bot", text: `Good Morning, ${d.profileName}! I'm your AI business assistant. How can I help you analyze your operations today?`, time: "10:30 AM" }
          ]);
        }
      })
      .catch((err) => {
        console.error("Error fetching AI suggestions for Chairman:", err);
        setSuggestions([
          "Why did Commercial Complex project delay?",
          "Show me top 5 clients by revenue contribution.",
          "Predict our next quarter revenue trend."
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
    setTyping(true);

    try {
      const orgId = session?.organizationId || 1;
      const token = localStorage.getItem("buildcon_token");
      const res = await fetch("https://erp-construction.onrender.com/api/chairman/ai-chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: text, organizationId: String(orgId) }),
      });
      if (res.ok) {
        const d = await res.json();
        const aiMsg: Message = { 
          sender: "bot", 
          text: d.response, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const aiMsg: Message = { 
          sender: "bot", 
          text: "Error calling AI Assistant backend.", 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      const aiMsg: Message = { 
        sender: "bot", 
        text: "AI service is currently offline. Please check connection.", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setTyping(false);
    }
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
            <div ref={endRef} />
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="mt-4 pt-3 border-t border-slate-850 flex gap-2 items-center"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your business operations, safety, or approvals..."
              className="flex-1 bg-[#0E1726] border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500 placeholder:text-slate-500"
            />
            <button type="submit" className="h-9 w-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center shrink-0 transition-colors">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Suggestion Sidebar */}
        <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Suggested Questions</h3>
          </div>
          <p className="text-[10px] text-slate-400 mb-4 leading-relaxed font-sans">Select one of the preset prompts to test the AI assistant with real database insights.</p>
          <div className="space-y-2.5">
            {suggestions.map((prompt, idx) => (
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
