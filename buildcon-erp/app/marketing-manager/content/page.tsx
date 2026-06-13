"use client";
import React from "react";
import { FileEdit, Calendar, Eye, Heart, Video } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function ContentManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">CONTENT MANAGEMENT</h2>
        <p className="text-xs text-slate-400">Schedule company blogs, draft newsletters, publish walk-through video scripts, and check viewer counts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <FileEdit className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Total Content Published</div>
            <div className="text-xl font-bold text-white mt-1">48 Articles / Videos</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Total Content Views</div>
            <div className="text-xl font-bold text-white mt-1">82k Views</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Likes & Reactions</div>
            <div className="text-xl font-bold text-white mt-1">3.4k Likes</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-yellow-500/10 text-yellow-400 grid place-items-center">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Scheduled (June)</div>
            <div className="text-xl font-bold text-amber-400 mt-1">8 Drafts Pending</div>
          </div>
        </div>
      </div>

      {/* Content Calendar */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Content Production Calendar & History</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2">Title</th>
                <th className="pb-2">Content Type</th>
                <th className="pb-2">Publish Date</th>
                <th className="pb-2">Total Impressions</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                ["How Eco-conscious building designs save costs", "Blog Post", "28 May 2025", "12k Views", "Published"],
                ["Coimbatore construction walkthrough walk-around", "YouTube Video", "20 May 2025", "35k Views", "Published"],
                ["Top 5 mistakes to avoid in home foundation construction", "Newsletter", "15 May 2025", "8k Sent", "Published"],
                ["Slab concreting checks standard checklist", "Blog Post", "05 Jun 2025", "Draft Mode", "Scheduled"]
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-semibold text-slate-200">{row[0]}</td>
                  <td className="text-slate-350">{row[1]}</td>
                  <td className="text-slate-450 text-slate-400">{row[2]}</td>
                  <td className="text-white font-bold">{row[3]}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      row[4] === "Published" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {row[4]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIAssistantBar suggestions={["Generate outlines for green buildings article", "Check YouTube analytics charts", "Draft email newsletter template"]} />
    </div>
  );
}
