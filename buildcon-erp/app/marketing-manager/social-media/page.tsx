"use client";
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Share2, Users, Heart, MessageCircle } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

const followerGrowth = [
  { platform: "Instagram", followers: 45000, color: "#EF4444" },
  { platform: "LinkedIn", followers: 32000, color: "#3B82F6" },
  { platform: "Facebook", followers: 28000, color: "#1E3A8A" },
  { platform: "YouTube", followers: 15000, color: "#EF4444" },
];

export default function SocialMediaCenter() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">SOCIAL MEDIA CENTER</h2>
        <p className="text-xs text-slate-400">Monitor social channel followers growth, post engagements rate, corporate updates reach, and content interactions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Total Followers Pool</div>
            <div className="text-xl font-bold text-white mt-1">120k Followers</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Monthly Post Engagements</div>
            <div className="text-xl font-bold text-white mt-1">18.2k Actions</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
            <Share2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Share Rate</div>
            <div className="text-xl font-bold text-white mt-1">4.52%</div>
          </div>
        </div>

        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-yellow-500/10 text-yellow-400 grid place-items-center">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Comments Log</div>
            <div className="text-xl font-bold text-amber-450 text-amber-450 text-amber-400 mt-1">320 Comments</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Followers Chart */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-1">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Followers by Channel</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={followerGrowth} layout="vertical" margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <XAxis type="number" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis dataKey="platform" type="category" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0E1726", borderColor: "#1E293B", color: "#F8FAFC" }} />
                <Bar dataKey="followers" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent posts */}
        <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Recent Social Media Posts</h3>
          <div className="space-y-3.5 text-xs">
            {[
              { text: "We are thrilled to announce the launch of Skyline Residences, Chennai's newest luxury landmark!", channel: "LinkedIn", likes: 850, shares: 145 },
              { text: "Take an exclusive virtual walkthrough of our model apartments in Coimbatore. Link in bio!", channel: "Instagram", likes: 1240, shares: 320 },
              { text: "How green building certifications are reshaping urban residential developments.", channel: "Facebook", likes: 410, shares: 98 }
            ].map((post, idx) => (
              <div key={idx} className="p-3 bg-[#0e1628] border border-slate-800 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span className="font-bold text-white bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">{post.channel}</span>
                  <span>❤️ {post.likes} Likes • 🔁 {post.shares} Shares</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{post.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AIAssistantBar suggestions={["Suggest Instagram reels topics", "Create LinkedIn post draft about green buildings", "Analyze weekly follower growth rates"]} />
    </div>
  );
}
