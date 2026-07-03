"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Share2, Users, Heart, MessageCircle, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function SocialMediaCenter() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [socialPosts, setSocialPosts] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [orgId, setOrgId] = useState<number | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      setErrorMsg(null);

      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) {
        setErrorMsg("Session expired or missing authentication.");
        setLoading(false);
        return;
      }

      const session = JSON.parse(sessionStr);
      const activeOrgId = session.organizationId;
      setOrgId(activeOrgId);

      if (!activeOrgId) {
        setErrorMsg("No organization associated with this session.");
        setLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:8081/api/marketing-manager/dashboard/org/${activeOrgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setSocialPosts(data.socialPosts || []);
        setMetrics(data.metrics || []);
      } else {
        setErrorMsg("Failed to retrieve social data.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const getMetricValue = (key: string, fallback: number) => {
    const found = metrics.find(m => m.metricKey === key);
    return found ? found.metricValue : fallback;
  };

  // Derive dynamic follower metrics
  const instaFollowers = getMetricValue("instagram_followers", 0);
  const linkedinFollowers = getMetricValue("linkedin_followers", 0);
  const fbFollowers = getMetricValue("facebook_followers", 0);
  const ytFollowers = getMetricValue("youtube_subscribers", 0);

  const totalFollowersPool = instaFollowers + linkedinFollowers + fbFollowers + ytFollowers;

  // Compute dynamic follower growth data
  const followerGrowth = [
    { platform: "Instagram", followers: instaFollowers, color: "#EF4444" },
    { platform: "LinkedIn", followers: linkedinFollowers, color: "#3B82F6" },
    { platform: "Facebook", followers: fbFollowers, color: "#1E3A8A" },
    { platform: "YouTube", followers: ytFollowers, color: "#EF4444" },
  ];

  // Calculate dynamic Monthly Post Engagements by summing up the engagement of all posts
  const totalEngagements = socialPosts.reduce((acc, sp) => {
    // Engagement is formatted like e.g. "2.5K Eng"
    const val = parseFloat(sp.engagement?.replace("K Eng", "").replace(" Eng", "") || "0");
    return acc + val;
  }, 0);
  const engagementsDisplay = totalEngagements > 0 ? `${totalEngagements.toFixed(1)}k Actions` : "0.0k Actions";

  const shareRate = getMetricValue("mgr_share_rate", 0.0);
  const commentsLog = getMetricValue("mgr_comments_log", 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">SOCIAL MEDIA CENTER</h2>
          <p className="text-xs text-slate-400">Monitor social channel followers growth, post engagements rate, corporate updates reach, and content interactions.</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-400 hover:text-white transition-colors" title="Refresh Data">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[350px] space-y-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading dynamic social media metrics from MySQL database...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-red-400 text-xs flex justify-between items-center">
          <span>⚠️ {errorMsg}</span>
          <button onClick={loadData} className="px-4 py-1.5 bg-red-650 hover:bg-red-550 text-white rounded-lg font-semibold transition">Retry</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Total Followers Pool</div>
                <div className="text-xl font-bold text-white mt-1">{(totalFollowersPool / 1000).toFixed(0)}k Followers</div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Monthly Post Engagements</div>
                <div className="text-xl font-bold text-white mt-1">{engagementsDisplay}</div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
                <Share2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Share Rate</div>
                <div className="text-xl font-bold text-white mt-1">{shareRate}%</div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 text-yellow-400 grid place-items-center">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Comments Log</div>
                <div className="text-xl font-bold text-amber-400 mt-1">{commentsLog} Comments</div>
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
                {socialPosts.map((post, idx) => {
                  const channels = ["LinkedIn", "Instagram", "Facebook", "YouTube"];
                  const channel = channels[idx % channels.length];
                  return (
                    <div key={idx} className="p-3 bg-[#0e1628] border border-slate-800 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span className="font-bold text-white bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">{channel}</span>
                        <span>Reach: <strong className="text-white font-mono">{post.reach}</strong> • Engagement: <strong className="text-indigo-400 font-mono">{post.engagement}</strong></span>
                      </div>
                      <p className="text-slate-200 leading-relaxed font-semibold">{post.title}</p>
                    </div>
                  );
                })}
                {socialPosts.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">No social posts registered in database.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <AIAssistantBar suggestions={["Suggest Instagram reels topics", "Create LinkedIn post draft about green buildings", "Analyze weekly follower growth rates"]} />
    </div>
  );
}
