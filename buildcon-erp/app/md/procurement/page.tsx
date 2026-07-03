"use client";
import React, { useState, useEffect } from "react";
import { ShoppingCart, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import AIAssistantBar from "@/components/AIAssistantBar";

export default function ProcurementOverview() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  async function loadData() {
    try {
      setLoading(true);
      setErrorMsg(null);
      const sessionStr = localStorage.getItem("buildcon_session");
      const token = localStorage.getItem("buildcon_token");
      if (!sessionStr || !token) { setErrorMsg("Session expired."); setLoading(false); return; }
      const session = JSON.parse(sessionStr);
      const orgId = session.organizationId;

      const res = await fetch(`http://localhost:8081/api/procurement-manager/orders/org/${orgId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setOrders(await res.json());
      } else {
        setErrorMsg("Failed to retrieve procurement data.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const totalOrders = orders.length;
  const totalValue = orders.reduce((acc, o) => acc + (parseFloat(String(o.totalAmount || o.amount || 0).replace(/[^0-9.]/g, "")) || 0), 0);
  const deliveredCount = orders.filter(o => (o.status || "").toLowerCase() === "delivered").length;
  const pendingCount = orders.filter(o => (o.status || "").toLowerCase() !== "delivered").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">07. PROCUREMENT OVERVIEW</h2>
          <p className="text-xs text-slate-400">Inventory levels, active vendor contracts, purchase order values, and logistic schedules</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-lg bg-[#111C30] border border-slate-800 text-slate-400 hover:text-white transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading procurement data from database...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-red-400 text-xs flex justify-between items-center">
          <span>⚠️ {errorMsg}</span>
          <button onClick={loadData} className="px-4 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg font-semibold transition">Retry</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Total PO Value</div>
                <div className="text-2xl font-bold text-white mt-1">₹ {(totalValue / 100000).toFixed(1)} L</div>
                <div className="text-[10px] text-emerald-400 mt-1">{totalOrders} purchase orders</div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500/20" />
            </div>
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Delivered Orders</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{deliveredCount} Delivered</div>
                <div className="text-[10px] text-slate-400 mt-1">Received this cycle</div>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-500/20" />
            </div>
            <div className="bg-[#111C30] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Pending / In Transit</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">{pendingCount} Orders</div>
                <div className="text-[10px] text-slate-400 mt-1">Awaiting delivery or approval</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500/20" />
            </div>
          </div>

          <div className="bg-[#111C30] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Purchase Orders Log</h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="pb-2">PO ID</th>
                    <th className="pb-2">Item / Material</th>
                    <th className="pb-2">Vendor</th>
                    <th className="pb-2">Quantity</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {orders.map((order, idx) => (
                    <tr key={order.id || idx}>
                      <td className="py-3 font-mono text-slate-400">PO-{String(order.id || idx + 1).padStart(3, "0")}</td>
                      <td className="font-semibold text-slate-200">{order.materialName || order.item || "N/A"}</td>
                      <td className="text-slate-350">{order.vendorName || order.vendor || "N/A"}</td>
                      <td className="text-slate-400">{order.quantity || "N/A"}</td>
                      <td className="text-white font-bold">{order.totalAmount || order.amount || "N/A"}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          (order.status || "").toLowerCase() === "delivered"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : (order.status || "").toLowerCase() === "approved"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                          {order.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400">No purchase orders in database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <AIAssistantBar suggestions={["Track overdue POs", "Compare vendor pricing", "Show material price trends"]} />
    </div>
  );
}
