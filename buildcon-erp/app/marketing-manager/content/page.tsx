"use client";
import React, { useState, useEffect } from "react";
import { FileEdit, Calendar, Eye, Heart, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function ContentManagement() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [socialPosts, setSocialPosts] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);

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
      if (!activeOrgId) {
        setErrorMsg("No organization associated with this session.");
        setLoading(false);
        return;
      }

      const res = await fetch(`https://erp-construction.onrender.com/api/marketing-manager/dashboard/org/${activeOrgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setSocialPosts(data.socialPosts || []);
        setMetrics(data.metrics || []);
      } else {
        setErrorMsg("Failed to retrieve content data.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const getMetricValue = (key: string, fallback: number) => {
    const found = metrics.find((m: any) => m.metricKey === key);
    return found ? found.metricValue : fallback;
  };

  // Compute stats dynamically
  const totalPublished = socialPosts.filter(p => p.status !== "Scheduled" && p.status !== "Draft").length || socialPosts.length;
  const scheduledDrafts = socialPosts.filter(p => p.status === "Scheduled" || p.status === "Draft").length;

  // Total views: sum of reach values (strip "K Reach" suffix)
  const totalViewsK = socialPosts.reduce((acc, p) => {
    const val = parseFloat((p.reach || "0").replace("K Reach", "").replace(" Reach", "").trim() || "0");
    return acc + val;
  }, 0);

  // Total engagements (likes/reactions)
  const totalEngK = socialPosts.reduce((acc, p) => {
    const val = parseFloat((p.engagement || "0").replace("K Eng", "").replace(" Eng", "").trim() || "0");
    return acc + val;
  }, 0);

  const contentTypes = ["Blog Post", "YouTube Video", "Newsletter", "Social Post", "Case Study"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">CONTENT MANAGEMENT</h2>
          <p className="text-xs text-slate-400">Schedule company blogs, draft newsletters, publish walk-through video scripts, and check viewer counts.</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-400 hover:text-white transition-colors" title="Refresh Data">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[350px] space-y-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading content data from database...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-red-400 text-xs flex justify-between items-center">
          <span>⚠️ {errorMsg}</span>
          <button onClick={loadData} className="px-4 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg font-semibold transition">Retry</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 grid place-items-center">
                <FileEdit className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Total Content Published</div>
                <div className="text-xl font-bold text-white mt-1">{totalPublished} Posts</div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 grid place-items-center">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Total Content Views</div>
                <div className="text-xl font-bold text-white mt-1">
                  {totalViewsK > 0 ? `${totalViewsK.toFixed(1)}k Views` : "N/A"}
                </div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 grid place-items-center">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Likes &amp; Reactions</div>
                <div className="text-xl font-bold text-white mt-1">
                  {totalEngK > 0 ? `${totalEngK.toFixed(1)}k Actions` : "N/A"}
                </div>
              </div>
            </div>

            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 text-yellow-400 grid place-items-center">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <div className="text-slate-400 font-semibold">Scheduled / Drafts</div>
                <div className="text-xl font-bold text-amber-400 mt-1">{scheduledDrafts} Pending</div>
              </div>
            </div>
          </div>

          {/* Content Calendar Table */}
          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Content Production Calendar &amp; History</h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="pb-2">Title</th>
                    <th className="pb-2">Content Type</th>
                    <th className="pb-2">Reach</th>
                    <th className="pb-2">Engagement</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {socialPosts.map((post, idx) => (
                    <tr key={post.id || idx}>
                      <td className="py-3 font-semibold text-slate-200">{post.title}</td>
                      <td className="text-slate-350">{contentTypes[idx % contentTypes.length]}</td>
                      <td className="text-white font-bold">{post.reach || "N/A"}</td>
                      <td className="text-indigo-400 font-bold">{post.engagement || "N/A"}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          post.status === "Scheduled" || post.status === "Draft"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}>
                          {post.status || "Published"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {socialPosts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400">No social posts/content in database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <AIAssistantBar suggestions={["Generate outlines for green buildings article", "Check YouTube analytics charts", "Draft email newsletter template"]} />
    </div>
  );
}
