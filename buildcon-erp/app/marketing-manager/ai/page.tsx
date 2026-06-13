"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  sender: "ai" | "user";
  text: string;
  time: string;
}

const autoReplies: Record<string, string> = {
  "which platform has the lowest cpl?": "Organic SEO currently reports the lowest Cost Per Lead at ₹195, followed closely by Meta Ads at ₹269. Google Ads registers the highest CPL at ₹293 due to high competition on primary brand keywords.",
  "show google ads search trends": "Recent search query audits indicate that search volumes for 'luxury villas Chennai' rose by 18% in May. Display impressions also rose by 12% following bid optimization.",
  "forecast leads next month": "Based on current spend trends of ₹4.8 L and an average conversion rate of 4.82%, we project capturing 2,150 Leads in June, representing a 16.2% increase.",
  "analyze competitor traffic metrics": "Competitor traffic metrics reveal Apex Builders registers the highest organic sessions share (42,000/mo) targeting 'luxury villas Chennai' keywords, while Prime Realty drives the highest Meta Ads reach.",
};

export default function AIMarketingAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Good day, Ananya. I am your AI Marketing Assistant. Ask me anything about ad campaign CTRs, leads channels, SEO ranks, competitor spends, or monthly ROI.", time: "10:30 AM" }
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: Message = { sender: "user", text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    setTimeout(() => {
      const lower = text.toLowerCase().trim();
      let replyText = "I will scan Google analytics and Meta logs. Can you specify if you need the stats for Facebook or Instagram?";
      
      for (const key of Object.keys(autoReplies)) {
        if (lower.includes(key) || key.includes(lower)) {
          replyText = autoReplies[key];
          break;
        }
      }

      const aiMsg: Message = { sender: "ai", text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-4xl mx-auto bg-[#111C30] border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#0f182a] p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">AI Copilot (Marketing)</div>
            <div className="text-[10px] text-purple-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse"></span>
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
                ? "bg-purple-600/20 text-purple-400 border-purple-500/30" 
                : "bg-blue-600/20 text-blue-400 border-blue-500/30"
            }`}>
              {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className={`rounded-xl p-3.5 text-xs text-slate-200 leading-relaxed shadow-sm ${
              msg.sender === "user" 
                ? "bg-[#0e1628] border border-purple-500/20 rounded-tr-none" 
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
      <div className="p-3 border-t border-slate-855 bg-[#0e1628] flex flex-wrap gap-2">
        {Object.keys(autoReplies).map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSend(suggestion)}
            className="text-[10px] bg-[#111C30] hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-800 transition"
          >
            {suggestion.charAt(0).toUpperCase() + suggestion.slice(1)}
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
          placeholder="Ask a question about ad groups, CPC, LTV, or keyword positions..."
          className="flex-1 bg-[#111C30] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition placeholder:text-slate-500"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:brightness-110 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-purple-500/10"
        >
          <Send className="h-3 w-3" />
          Send
        </button>
      </form>
    </div>
  );
}
