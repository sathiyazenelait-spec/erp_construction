"use client";
import React, { useState, useEffect } from "react";
import { Check, Sparkles, ShieldCheck, Crown, ArrowUpRight, Loader2 } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

interface OrgDetails {
  id: number;
  name: string;
  domain: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  subscriptionTier: string;
}

export default function SubscriptionPage() {
  const [org, setOrg] = useState<OrgDetails | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingTier, setUpdatingTier] = useState<string | null>(null);
  const [error, setError] = useState("");

  const getHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("buildcon_token") : null;
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  };

  const fetchOrgDetails = async () => {
    try {
      const sessionStr = localStorage.getItem("buildcon_session");
      if (!sessionStr) {
        setError("No active session found.");
        setLoading(false);
        return;
      }
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;
      if (!orgId) {
        setError("No organization ID found in session.");
        setLoading(false);
        return;
      }

      const res = await fetch(`https://erp-construction.onrender.com/api/organizations/${orgId}`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to load organization subscription info.");
      const data = await res.json();
      setOrg(data);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await fetch("https://erp-construction.onrender.com/api/packages", {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setPlans(data);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to load backend packages, using static defaults", e);
    }
    // Fallback static list
    setPlans([
      {
        name: "Growth",
        price: "₹3,299 / month",
        description: "Essential ERP toolkit tailored for small building contractors.",
        features: [
          "Executive Summary Dashboard",
          "Company Portfolio Profile",
          "Approval Center workflow",
          "AI Executive Assistant chat access",
          "Basic Account Settings"
        ],
        themeColor: "emerald",
        badge: "Essential"
      },
      {
        name: "Premium",
        price: "₹4,799 / month",
        description: "Complete financial control and site workforce tracking system.",
        features: [
          "Everything in Growth",
          "Financial Command & expense tracking",
          "Safety Center risk analysis logs",
          "Workforce Analysis & allocation statistics"
        ],
        themeColor: "blue",
        badge: "Most Popular"
      },
      {
        name: "Enterprise",
        price: "₹8,999 / month",
        description: "Full-scale construction ERP with AI metrics and strategic planning.",
        features: [
          "Everything in Premium",
          "Sales & Opportunities pipeline",
          "Client Insights & communication tracking",
          "Strategic Planning & projection matrices",
          "Investment Tracker & multi-project audits",
          "Board Reports builder"
        ],
        themeColor: "purple",
        badge: "Complete Suite"
      }
    ]);
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchOrgDetails(), fetchPackages()]);
      setLoading(false);
    };
    initData();
  }, []);

  const handleUpgrade = async (tierName: string) => {
    if (!org) return;
    try {
      setUpdatingTier(tierName);
      const res = await fetch(`https://erp-construction.onrender.com/api/organizations/${org.id}/subscription?tier=${tierName}`, {
        method: "PUT",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to upgrade plan.");
      
      const updatedOrg = await res.json();
      setOrg(updatedOrg);
      localStorage.setItem("selected_login_tier", tierName);
      
      // Give a tiny timeout for success state, then reload page to update navigation sidebar
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err: any) {
      alert(err.message);
      setUpdatingTier(null);
    }
  };

  // plans loaded dynamically from packages API

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <span className="text-xs text-slate-400 font-medium">Fetching subscription status...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-xs text-red-400 bg-red-950/20 border border-red-500/20 rounded-xl">
        {error}
      </div>
    );
  }

  const currentTier = org?.subscriptionTier || "Growth";

  return (
    <div className="space-y-8">
      {/* Page Title & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">14. SUBSCRIPTION MANAGEMENT</h2>
          <p className="text-xs text-slate-400">Upgrade or manage your enterprise workspace packages</p>
        </div>
        {org && (
          <div className="bg-[#111A2E] border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-3">
            <Crown className="h-5 w-5 text-amber-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Current active plan</div>
              <div className="text-xs font-bold text-white">{org.name} — <span className="text-amber-400">{currentTier}</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isCurrent = currentTier.toLowerCase() === p.name.toLowerCase();
          const isUpdating = updatingTier === p.name;
          
          let cardStyle = "bg-[#111A2E] border-slate-800 hover:border-slate-700 transition-all";
          let badgeStyle = "bg-slate-800 text-slate-400";
          let btnStyle = "bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white shadow-md shadow-emerald-500/15";
          let priceColor = "text-white";

          if (isCurrent) {
            cardStyle = "bg-gradient-to-b from-[#16223e] to-[#111a2e] border-blue-500/50 shadow-lg shadow-blue-500/10 scale-102 relative";
            badgeStyle = "bg-blue-500/10 text-blue-400 border border-blue-500/20";
            btnStyle = "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-default";
            priceColor = "text-blue-400";
          } else {
            if (p.themeColor === "blue") {
              cardStyle = "bg-[#111A2E] border-blue-500/20 hover:border-blue-500/40 transition-all";
              badgeStyle = "bg-blue-500/10 text-blue-400 border border-blue-500/20";
              btnStyle = "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/10 hover:shadow-blue-500/20";
            } else if (p.themeColor === "purple") {
              cardStyle = "bg-[#111A2E] border-purple-500/20 hover:border-purple-500/40 transition-all";
              badgeStyle = "bg-purple-500/10 text-purple-400 border border-purple-500/20";
              btnStyle = "bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white shadow-md shadow-purple-500/15";
            } else if (p.themeColor === "emerald") {
              cardStyle = "bg-[#111A2E] border-emerald-500/20 hover:border-emerald-500/40 transition-all";
              badgeStyle = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
              btnStyle = "bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white shadow-md shadow-emerald-500/15";
            } else if (p.themeColor === "rose") {
              cardStyle = "bg-[#111A2E] border-rose-500/20 hover:border-rose-500/40 transition-all";
              badgeStyle = "bg-rose-500/10 text-rose-400 border border-rose-500/20";
              btnStyle = "bg-gradient-to-r from-rose-600 to-pink-500 hover:brightness-110 text-white shadow-md shadow-rose-500/15";
            } else if (p.themeColor === "amber") {
              cardStyle = "bg-[#111A2E] border-amber-500/20 hover:border-amber-500/40 transition-all";
              badgeStyle = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
              btnStyle = "bg-gradient-to-r from-amber-600 to-orange-550 hover:brightness-110 text-white shadow-md shadow-amber-500/15";
            }
          }

          return (
            <div
              key={p.name}
              className={`border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${cardStyle}`}
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${badgeStyle}`}>
                      {p.badge}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1.5">{p.name}</h3>
                  </div>
                  {isCurrent && <ShieldCheck className="h-5 w-5 text-emerald-400" />}
                </div>

                <p className="text-xs text-slate-400 mb-6 min-h-[32px]">{p.description}</p>

                {/* Price */}
                <div className="mb-6">
                  {p.price.includes("/") ? (
                    <>
                      <span className={`text-3xl font-extrabold tracking-tight ${priceColor}`}>{p.price.split("/")[0].trim()}</span>
                      <span className="text-xs text-slate-500 font-medium"> / {p.price.split("/")[1].trim()}</span>
                    </>
                  ) : (
                    <>
                      <span className={`text-3xl font-extrabold tracking-tight ${priceColor}`}>{p.price}</span>
                      <span className="text-xs text-slate-500 font-medium"> / month</span>
                    </>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3.5 mb-8 border-t border-slate-800/80 pt-6">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Features included:</span>
                  {p.features.map((f: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={() => !isCurrent && handleUpgrade(p.name)}
                  disabled={isCurrent || isUpdating}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${btnStyle}`}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Upgrading plan...
                    </>
                  ) : isCurrent ? (
                    <>
                      <Check className="h-4 w-4" />
                      Active Package
                    </>
                  ) : (
                    <>
                      Upgrade Plan
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Notice / FAQ */}
      <div className="bg-[#111A2E]/50 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-blue-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Enterprise billing terms</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Upgrades take effect immediately. Features corresponding to the upgraded tier will become visible in the navigation sidebar upon automatic workspace refresh. The difference will be added to the next invoice cycle automatically.
        </p>
      </div>

      <AIAssistantBar suggestions={["Compare plan features", "Invoice history", "Payment methods", "Subscription analytics"]} />
    </div>
  );
}
