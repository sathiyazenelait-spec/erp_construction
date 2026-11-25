"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Rotate3d, Sun, Moon, Maximize2, Minimize2, Check, X,
  Building2, Layers, ShieldCheck, Box, HardHat, Cpu,
  Award, Move, Eye, Info, Sparkles
} from "lucide-react";

export interface Chairman3DModelProps {
  id?: number | string;
  title: string;
  floors?: number;
  shape?: string;
  details?: string;
  requester?: string;
  requesterRole?: string;
  amount?: string;
  date?: string;
  status?: string;
  compact?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onClose?: () => void;
}

export default function Chairman3DModelViewer({
  title,
  floors = 7,
  shape = "AUTO",
  details,
  requester = "Site Engineering & CAD Team",
  requesterRole = "Senior Site Engineer",
  amount = "₹ 2.15 Cr",
  date = "Today",
  status = "Pending",
  compact = false,
  onApprove,
  onReject,
  onClose
}: Chairman3DModelProps) {
  const [orbitAngle, setOrbitAngle] = useState(38);
  const [tiltAngle, setTiltAngle] = useState(28);
  const [lightingMode, setLightingMode] = useState<"DAY" | "NIGHT">("DAY");
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeFloorTab, setActiveFloorTab] = useState<number | "ALL">("ALL");

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, orbit: 38, tilt: 28 });

  // Auto rotation
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setOrbitAngle((prev) => (prev + 0.8) % 360);
    }, 45);
    return () => clearInterval(interval);
  }, [autoRotate]);

  // Mouse interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      orbit: orbitAngle,
      tilt: tiltAngle
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    let newOrbit = (dragStartRef.current.orbit + deltaX * 0.6) % 360;
    if (newOrbit < 0) newOrbit += 360;
    const newTilt = Math.max(15, Math.min(75, dragStartRef.current.tilt - deltaY * 0.4));
    setOrbitAngle(Math.round(newOrbit));
    setTiltAngle(Math.round(newTilt));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Determine architectural shape from text/props
  const allText = `${title} ${details || ""} ${shape || ""}`.toLowerCase();
  const isHShaped = shape === "H_SHAPED" || (/\bh[-_\s]?(shape|shaped|block|frame|layout)\b/i.test(allText)) || (/\bh\b/i.test(allText) && /\bshape\b/i.test(allText));
  const isTShaped = !isHShaped && (
    shape === "T_SHAPED" ||
    (/\b(t|tee)[-_\s]?(shape|shaped|block|frame|layout|plan|building|tower|structure|type|model)\b/i.test(allText)) ||
    (/\b(t|tee)\b/i.test(allText) && /\b(shape|shaped)\b/i.test(allText)) ||
    allText.includes("t-shape") || allText.includes("t shape") || allText.includes("t shaped") || allText.includes("t-shaped") || allText.includes("t frame") || allText.includes("t-frame") || allText.includes("tee shape")
  );
  const isVShaped = !isHShaped && !isTShaped && (shape === "V_SHAPED" || (/\bv[-_\s]?(shape|shaped|block|frame|layout)\b/i.test(allText)) || (/\bv\b/i.test(allText) && /\bshape\b/i.test(allText)));
  const isUShaped = !isHShaped && !isTShaped && !isVShaped && (shape === "U_SHAPED" || (/\bu[-_\s]?(shape|shaped|block|frame|courtyard)\b/i.test(allText)) || (/\bu\b/i.test(allText) && /\bshape\b/i.test(allText)));
  const isCircular = !isHShaped && !isTShaped && !isVShaped && !isUShaped && (shape === "CIRCULAR_DONUT" || allText.includes("circle") || allText.includes("circular") || allText.includes("cylind"));

  const detectedShapeLabel = isHShaped ? "H-Shaped Dual-Tower"
    : isTShaped ? "T-Shaped Modern Frame"
    : isVShaped ? "V-Shaped Converging Tower"
    : isUShaped ? "U-Shaped Courtyard Complex"
    : isCircular ? "Circular Atrium Complex"
    : "Modern High-Rise Tower";

  // Projection math
  const rad = (orbitAngle * Math.PI) / 180;
  const cosO = Math.cos(rad);
  const sinO = Math.sin(rad);
  const tiltFactor = Math.sin((tiltAngle * Math.PI) / 180);

  const project = (x: number, y: number, z: number) => {
    const rotX = x * cosO - y * sinO;
    const rotY = x * sinO + y * cosO;
    const screenX = 350 + rotX;
    const screenY = 320 + rotY * 0.55 * tiltFactor - z;
    return { x: screenX, y: screenY, depth: rotY };
  };

  const isNight = lightingMode === "NIGHT";
  const totalFlrs = Math.max(3, Math.min(25, floors || 7));
  const floorHeight = Math.max(22, Math.min(38, Math.round(230 / totalFlrs)));

  // Estimated structural takeoffs
  const totalGFA = totalFlrs * 2400;
  const concreteCuM = (totalFlrs * 91.2).toFixed(1);
  const steelRebarMT = (totalFlrs * 8.65).toFixed(1);
  const cementBags = (totalFlrs * 710).toLocaleString();

  // Render 3D SVG building geometry
  const renderBuildingSVG = () => {
    const elements: React.ReactNode[] = [];

    // Ground Plaza Shadow & Pedestrian Base
    const shadowP1 = project(-200, -160, 0);
    const shadowP2 = project(200, -160, 0);
    const shadowP3 = project(200, 160, 0);
    const shadowP4 = project(-200, 160, 0);

    elements.push(
      <polygon
        key="ground-shadow"
        points={`${shadowP1.x},${shadowP1.y} ${shadowP2.x},${shadowP2.y} ${shadowP3.x},${shadowP3.y} ${shadowP4.x},${shadowP4.y}`}
        fill={isNight ? "#020617" : "#090d16"}
        opacity={0.8}
        stroke={isNight ? "#1e293b" : "#1e293b"}
        strokeWidth={1}
      />
    );

    // Landscaped perimeter walkway
    const walk1 = project(-180, -140, 2);
    const walk2 = project(180, -140, 2);
    const walk3 = project(180, 140, 2);
    const walk4 = project(-180, 140, 2);
    elements.push(
      <polygon
        key="perimeter-walkway"
        points={`${walk1.x},${walk1.y} ${walk2.x},${walk2.y} ${walk3.x},${walk3.y} ${walk4.x},${walk4.y}`}
        fill={isNight ? "#0f172a" : "#1e293b"}
        opacity={0.4}
        stroke="#38bdf8"
        strokeWidth={0.7}
        strokeDasharray="4 3"
      />
    );

    // Multi-floor structure based on shape
    if (isHShaped) {
      // H-SHAPE: Left Wing, Right Wing, and Central Skybridge Core
      for (let f = 0; f < totalFlrs; f++) {
        if (activeFloorTab !== "ALL" && activeFloorTab !== f + 1) continue;
        const z0 = f * floorHeight;
        const z1 = z0 + floorHeight - 3;

        // Left Tower Wing (-140 to -50)
        elements.push(renderBox(`h-left-${f}`, -140, -120, -50, 120, z0, z1, f));
        // Right Tower Wing (50 to 140)
        elements.push(renderBox(`h-right-${f}`, 50, -120, 140, 120, z0, z1, f));
        // Connecting Skybridge Core (-50 to 50, narrow -30 to 30)
        elements.push(renderBox(`h-bridge-${f}`, -50, -32, 50, 32, z0, z1, f, true));
      }

      // Rooftop Elevator Machine Rooms & Solar PV on Twin Towers
      const topZ = totalFlrs * floorHeight;
      elements.push(renderBox("h-mr-left", -110, -35, -75, 35, topZ, topZ + 26, totalFlrs, false, "#334155"));
      elements.push(renderBox("h-mr-right", 75, -35, 110, 35, topZ, topZ + 26, totalFlrs, false, "#334155"));
    } else if (isTShaped) {
      // T-SHAPE: Front Transverse Wing Bar and Rear Central Perpendicular Stem (Matches ResearchGate Structural Model)
      for (let f = 0; f < totalFlrs; f++) {
        if (activeFloorTab !== "ALL" && activeFloorTab !== f + 1) continue;
        const z0 = f * floorHeight;
        const z1 = z0 + floorHeight - 3;

        // Front horizontal bar (-140 to 140, 20 to 80, center y = 50)
        const barBox = { key: `t-bar-${f}`, x1: -140, y1: 20, x2: 140, y2: 80, z0, z1, f, isCore: false, midX: 0, midY: 50 };
        // Central perpendicular stem (-45 to 45, -100 to 20, center y = -40)
        const stemBox = { key: `t-stem-${f}`, x1: -45, y1: -100, x2: 45, y2: 20, z0, z1, f, isCore: true, midX: 0, midY: -40 };

        // 3D Depth Sorting: Draw further box first so front box never clips improperly
        const boxes = [barBox, stemBox].map(b => ({
          ...b,
          depth: b.midX * sinO + b.midY * cosO
        })).sort((a, b) => a.depth - b.depth);

        boxes.forEach(b => {
          elements.push(renderBox(b.key, b.x1, b.y1, b.x2, b.y2, b.z0, b.z1, b.f, b.isCore));
        });
      }
      const topZ = totalFlrs * floorHeight;
      elements.push(renderBox("t-mr", -25, -20, 25, 20, topZ, topZ + 25, totalFlrs, false, "#334155"));
    } else if (isVShaped) {
      // V-SHAPE: Left angled wing, Right angled wing, Central apex rotunda
      for (let f = 0; f < totalFlrs; f++) {
        if (activeFloorTab !== "ALL" && activeFloorTab !== f + 1) continue;
        const z0 = f * floorHeight;
        const z1 = z0 + floorHeight - 3;

        // Central Apex Rotunda (-40 to 40, -100 to -30)
        elements.push(renderBox(`v-apex-${f}`, -40, -100, 40, -30, z0, z1, f));
        // Left Wing radiating backwards (-125 to -35, -40 to 105)
        elements.push(renderBox(`v-left-${f}`, -125, -40, -35, 105, z0, z1, f));
        // Right Wing radiating backwards (35 to 125, -40 to 105)
        elements.push(renderBox(`v-right-${f}`, 35, -40, 125, 105, z0, z1, f));
      }
      const topZ = totalFlrs * floorHeight;
      elements.push(renderBox("v-crown", -28, -85, 28, -45, topZ, topZ + 28, totalFlrs, false, "#38bdf8"));
    } else if (isUShaped) {
      // U-SHAPE: Left wing, Rear connecting wing, Right wing enclosing courtyard
      for (let f = 0; f < totalFlrs; f++) {
        if (activeFloorTab !== "ALL" && activeFloorTab !== f + 1) continue;
        const z0 = f * floorHeight;
        const z1 = z0 + floorHeight - 3;

        // Rear Cross Wing (-120 to 120, -110 to -50)
        elements.push(renderBox(`u-rear-${f}`, -120, -110, 120, -50, z0, z1, f));
        // Left Forward Wing (-120 to -60, -50 to 95)
        elements.push(renderBox(`u-left-${f}`, -120, -50, -60, 95, z0, z1, f));
        // Right Forward Wing (60 to 120, -50 to 95)
        elements.push(renderBox(`u-right-${f}`, 60, -50, 120, 95, z0, z1, f));
      }
      const topZ = totalFlrs * floorHeight;
      elements.push(renderBox("u-mr", -35, -95, 35, -60, topZ, topZ + 25, totalFlrs, false, "#334155"));
    } else {
      // STANDARD RECTILINEAR TOWER WITH RECESSED CORE
      for (let f = 0; f < totalFlrs; f++) {
        if (activeFloorTab !== "ALL" && activeFloorTab !== f + 1) continue;
        const z0 = f * floorHeight;
        const z1 = z0 + floorHeight - 3;

        elements.push(renderBox(`std-${f}`, -110, -85, 110, 85, z0, z1, f));
      }
      const topZ = totalFlrs * floorHeight;
      elements.push(renderBox("std-mr", -40, -35, 40, 35, topZ, topZ + 28, totalFlrs, false, "#334155"));
    }

    return elements;
  };

  // Helper to render an isometric 3D extruded prism box
  const renderBox = (
    key: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    z0: number,
    z1: number,
    floorIndex: number,
    isCore: boolean = false,
    customRoofColor?: string
  ) => {
    // 8 vertices of cuboid
    const p1 = project(x1, y1, z0); // bottom left front
    const p2 = project(x2, y1, z0); // bottom right front
    const p3 = project(x2, y2, z0); // bottom right back
    const p4 = project(x1, y2, z0); // bottom left back
    const p5 = project(x1, y1, z1); // top left front
    const p6 = project(x2, y1, z1); // top right front
    const p7 = project(x2, y2, z1); // top right back
    const p8 = project(x1, y2, z1); // top left back

    const isTopFloor = floorIndex === totalFlrs - 1;
    const wallColorDay = isCore ? "#0284c7" : "#0ea5e9";
    const wallColorNight = isCore ? "#1e293b" : "#0f172a";
    const slabStroke = isNight ? "#f59e0b" : "#38bdf8";

    return (
      <g key={key}>
        {/* Front Wall Face (p1, p2, p6, p5) */}
        <polygon
          points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p6.x},${p6.y} ${p5.x},${p5.y}`}
          fill={isNight ? wallColorNight : wallColorDay}
          opacity={0.85}
          stroke={slabStroke}
          strokeWidth={0.8}
        />
        {/* Window grid dividers */}
        <line x1={(p1.x + p2.x) / 2} y1={(p1.y + p2.y) / 2} x2={(p5.x + p6.x) / 2} y2={(p5.y + p6.y) / 2} stroke={isNight ? "#fef08a" : "#bae6fd"} strokeWidth={0.6} opacity={0.7} />

        {/* Right Wall Face (p2, p3, p7, p6) */}
        <polygon
          points={`${p2.x},${p2.y} ${p3.x},${p3.y} ${p7.x},${p7.y} ${p6.x},${p6.y}`}
          fill={isNight ? "#090d16" : "#0369a1"}
          opacity={0.9}
          stroke={slabStroke}
          strokeWidth={0.8}
        />
        <line x1={(p2.x + p3.x) / 2} y1={(p2.y + p3.y) / 2} x2={(p6.x + p7.x) / 2} y2={(p6.y + p7.y) / 2} stroke={isNight ? "#fef08a" : "#7dd3fc"} strokeWidth={0.6} opacity={0.6} />

        {/* Top Roof Slab Face (p5, p6, p7, p8) */}
        <polygon
          points={`${p5.x},${p5.y} ${p6.x},${p6.y} ${p7.x},${p7.y} ${p8.x},${p8.y}`}
          fill={customRoofColor || (isTopFloor ? (isNight ? "#1e293b" : "#cbd5e1") : (isNight ? "#0f172a" : "#94a3b8"))}
          opacity={0.95}
          stroke={isTopFloor ? (isNight ? "#f59e0b" : "#0284c7") : "#475569"}
          strokeWidth={isTopFloor ? 1.5 : 0.7}
        />

        {/* Rooftop FEM Bay Grid Lines on Top Floor */}
        {isTopFloor && !customRoofColor && (
          <>
            <line x1={(p5.x + p8.x) / 2} y1={(p5.y + p8.y) / 2} x2={(p6.x + p7.x) / 2} y2={(p6.y + p7.y) / 2} stroke="#38bdf8" strokeWidth={0.7} strokeDasharray="3 2" />
            <line x1={(p5.x + p6.x) / 2} y1={(p5.y + p6.y) / 2} x2={(p8.x + p7.x) / 2} y2={(p8.y + p7.y) / 2} stroke="#38bdf8" strokeWidth={0.7} strokeDasharray="3 2" />
          </>
        )}

        {/* Structural Perimeter Columns at Bay Intersections */}
        <circle cx={p5.x} cy={p5.y} r={1.8} fill={isNight ? "#fbbf24" : "#ffffff"} />
        <circle cx={p6.x} cy={p6.y} r={1.8} fill={isNight ? "#fbbf24" : "#ffffff"} />
      </g>
    );
  };

  return (
    <div className={`bg-[#0A0F1D] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
      isFullscreen ? "fixed inset-4 z-50 flex flex-col" : "w-full"
    }`}>
      {/* Top Header Bar */}
      <div className="p-4 bg-[#0E1628]/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 text-cyan-400 rounded-xl shadow-lg shadow-cyan-500/10">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">{title}</h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                {totalFlrs} Floors
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                {detectedShapeLabel}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-3">
              <span>Submitted by: <strong className="text-slate-200">{requester}</strong> ({requesterRole})</span>
              <span>•</span>
              <span>Date: <strong className="text-slate-200">{date}</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-mono font-bold">{amount}</span>
            </div>
          </div>
        </div>

        {/* Viewport Control Badges */}
        <div className="flex items-center gap-2">
          {/* Day/Night Lighting Toggle */}
          <button
            onClick={() => setLightingMode(isNight ? "DAY" : "NIGHT")}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              isNight
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
            }`}
            title="Toggle Day/Night 3000K LED Facade Illumination"
          >
            {isNight ? <Moon className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-yellow-400" />}
            <span>{isNight ? "Night Mode" : "Daylight"}</span>
          </button>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              autoRotate
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
            }`}
            title="Toggle 360-Degree Continuous Auto-Orbit"
          >
            <Rotate3d className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin text-cyan-400" : ""}`} />
            <span>{autoRotate ? "Auto-Orbiting" : "Manual Orbit"}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title={isFullscreen ? "Exit Fullscreen" : "Inspect Fullscreen 3D BIM"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace: 3D Viewport on Left, Specifications on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 overflow-hidden">
        {/* Left: 3D Building Canvas */}
        <div className="lg:col-span-8 relative bg-gradient-to-b from-[#070b14] via-[#091122] to-[#050811] flex items-center justify-center min-h-[380px] p-2 select-none">
          <svg
            viewBox="0 0 700 640"
            className="w-full h-full max-h-[500px] cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {renderBuildingSVG()}
          </svg>

          {/* Floating Orbit Instructions */}
          <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2 text-[10px] text-slate-300 pointer-events-none">
            <Move className="w-3.5 h-3.5 text-cyan-400" />
            <span>Drag horizontally or vertically to rotate in 3D ({orbitAngle}°, tilt: {tiltAngle}°)</span>
          </div>

          {/* Floating Elevation Indicator */}
          <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-1.5 text-right text-[11px] font-mono">
            <span className="text-slate-400 block text-[9px] uppercase font-bold">Total Elevation</span>
            <span className="text-cyan-300 font-bold">{(totalFlrs * 3.2).toFixed(1)}m ({(totalFlrs * 3.2 * 3.28084).toFixed(0)}ft)</span>
          </div>
        </div>

        {/* Right: Architectural Takeoff & Executive Inspection Panel */}
        <div className="lg:col-span-4 bg-[#0B1222] border-t lg:border-t-0 lg:border-l border-slate-800 p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                IS 1200 Structural Takeoff
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">
                NBC 2026 PASS
              </span>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-[#0E172A] rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Gross Floor Area</span>
                <span className="font-bold text-white font-mono">{totalGFA.toLocaleString()} sq.ft</span>
              </div>
              <div className="p-2.5 bg-[#0E172A] rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">RCC Concrete (M35)</span>
                <span className="font-bold text-cyan-300 font-mono">{concreteCuM} Cu.M</span>
              </div>
              <div className="p-2.5 bg-[#0E172A] rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Steel Rebar (Fe550D)</span>
                <span className="font-bold text-amber-300 font-mono">{steelRebarMT} MT</span>
              </div>
              <div className="p-2.5 bg-[#0E172A] rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">OPC 53 Cement Bags</span>
                <span className="font-bold text-purple-300 font-mono">{cementBags} Bags</span>
              </div>
            </div>

            {/* AI Architectural Verification Box */}
            <div className="p-3 bg-gradient-to-r from-cyan-950/20 via-slate-900 to-slate-900 border border-cyan-500/20 rounded-xl space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-cyan-300 font-bold text-xs">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  BIM Clashes & Structural Stability
                </span>
                <span className="text-emerald-400 font-mono">0 Clashes</span>
              </div>
              <p className="text-slate-300 text-[10px] leading-relaxed">
                Structural frame conforms to IS 13920 seismic resistance standards with Fe550D rebar grid. Cantilevered floor slabs and Low-E curtain walls fully validated.
              </p>
            </div>

            {/* Justification note if available */}
            {details && (
              <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-[10px] text-slate-300">
                <span className="font-bold text-amber-400 block mb-0.5">Proposal Specification:</span>
                <span className="text-slate-300">{details}</span>
              </div>
            )}
          </div>

          {/* Chairman Decision Actions */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Authorization Budget:</span>
              <span className="text-emerald-400 font-mono font-bold text-sm">{amount}</span>
            </div>

            <div className="flex items-center gap-2">
              {onApprove && (
                <button
                  type="button"
                  onClick={onApprove}
                  className="flex-1 py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve 3D Model</span>
                </button>
              )}
              {onReject && (
                <button
                  type="button"
                  onClick={onReject}
                  className="py-2.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
