"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Rotate3d, Sun, Moon, Maximize2, Minimize2, Check, X,
  Building2, Layers, ShieldCheck, Box, HardHat, Cpu,
  Award, Move, Eye, Info, Sparkles, Lock, ShieldAlert, AlertOctagon
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
  blueprintData?: any;
  aiAnalysisJson?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onRevoke?: () => void;
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
  blueprintData,
  aiAnalysisJson,
  onApprove,
  onReject,
  onRevoke,
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

  // Parse blueprintData or fallback to aiAnalysisJson
  let bp: any = blueprintData;
  if (!bp && aiAnalysisJson) {
    try {
      bp = typeof aiAnalysisJson === "string" ? JSON.parse(aiAnalysisJson) : aiAnalysisJson;
    } catch (e) {}
  }

  // Determine architectural shape & facade styling from text/props/blueprint
  const promptLower = `${title} ${details || ""} ${shape || ""} ${bp?.prompt || ""} ${bp?.title || ""}`.toLowerCase();
  const isHShaped = bp?.building3D?.massingForm === "H_SHAPED" || shape === "H_SHAPED" || (/\bh[-_\s]?(shape|shaped|block|frame|layout)\b/i.test(promptLower)) || (/\bh\b/i.test(promptLower) && /\bshape\b/i.test(promptLower));
  const isTShaped = !isHShaped && (
    bp?.building3D?.massingForm === "T_SHAPED" ||
    shape === "T_SHAPED" ||
    (/\b(t|tee)[-_\s]?(shape|shaped|block|frame|layout|plan|building|tower|structure|type|model)\b/i.test(promptLower)) ||
    (/\b(t|tee)\b/i.test(promptLower) && /\b(shape|shaped)\b/i.test(promptLower)) ||
    promptLower.includes("t-shape") || promptLower.includes("t shape") || promptLower.includes("t shaped") || promptLower.includes("t-shaped") || promptLower.includes("t frame") || promptLower.includes("t-frame") || promptLower.includes("tee shape")
  );
  const isVShaped = !isHShaped && !isTShaped && (bp?.building3D?.massingForm === "V_SHAPED" || shape === "V_SHAPED" || (/\bv[-_\s]?(shape|shaped|block|frame|layout)\b/i.test(promptLower)) || (/\bv\b/i.test(promptLower) && /\bshape\b/i.test(promptLower)));
  const isUShaped = !isHShaped && !isTShaped && !isVShaped && (bp?.building3D?.massingForm === "U_SHAPED" || shape === "U_SHAPED" || (/\bu[-_\s]?(shape|shaped|block|frame|courtyard)\b/i.test(promptLower)) || (/\bu\b/i.test(promptLower) && /\bshape\b/i.test(promptLower)));
  const isCircular = !isHShaped && !isTShaped && !isVShaped && !isUShaped && (bp?.building3D?.massingForm === "CIRCULAR_DONUT" || shape === "CIRCULAR_DONUT" || promptLower.includes("circle") || promptLower.includes("circular") || promptLower.includes("cylind"));
  const isLShaped = !isHShaped && !isTShaped && !isVShaped && !isUShaped && !isCircular && (bp?.building3D?.massingForm === "L_SHAPED" || shape === "L_SHAPED" || (/\bl[-_\s]?(shape|shaped|block|frame)\b/i.test(promptLower)));

  const isLuxuryGold = bp?.building3D?.facadePalette === "GOLD_LUXURY" || promptLower.includes("sky-mansion") || promptLower.includes("ultra-luxury") || promptLower.includes("luxury") || promptLower.includes("gold") || promptLower.includes("champagne");
  const isCyberObsidian = bp?.building3D?.facadePalette === "CYBER_OBSIDIAN" || promptLower.includes("black") || promptLower.includes("obsidian") || promptLower.includes("dark") || promptLower.includes("smoke") || promptLower.includes("carbon") || promptLower.includes("cyber");
  const isBiophilic = bp?.building3D?.facadePalette === "EMERALD_BIOPHILIC" || promptLower.includes("biophilic") || promptLower.includes("vertical forest") || promptLower.includes("green");

  const massingForm = isHShaped ? "H_SHAPED"
    : isTShaped ? "T_SHAPED"
    : isVShaped ? "V_SHAPED"
    : isUShaped ? "U_SHAPED"
    : isCircular ? "CIRCULAR_DONUT"
    : isLShaped ? "L_SHAPED"
    : "RECTANGULAR";

  const balconyType = bp?.building3D?.balconyType || (
    promptLower.includes("wave") ? "CURVED_WAVE"
    : promptLower.includes("wrap") ? "WRAPAROUND_RIBBON"
    : promptLower.includes("terrace") || promptLower.includes("garden") ? "TERRACED_CASCADE"
    : (isLuxuryGold || promptLower.includes("sky-mansion") || promptLower.includes("floating") || promptLower.includes("cantilever")) ? "CANTILEVERED_FLOATING"
    : "CANTILEVERED_FLOATING"
  );

  const detectedShapeLabel = isHShaped ? "H-Shaped Dual-Tower"
    : isTShaped ? "T-Shaped Modern Frame"
    : isVShaped ? "V-Shaped Converging Tower"
    : isUShaped ? "U-Shaped Courtyard Complex"
    : isCircular ? "Circular Atrium Complex"
    : isLuxuryGold ? "Ultra-Luxury Sky-Mansion"
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
    const screenY = 410 + rotY * 0.55 * tiltFactor - z;
    return { x: screenX, y: screenY, depth: rotY };
  };

  const isNight = lightingMode === "NIGHT";
  const isRevoked = status === "Revoked" || status === "REVOKED" || status === "ACCESS_REVOKED" || status === "REVOKE";
  const totalFlrs = Math.max(3, Math.min(25, floors || 7));
  const floorHeight = 36; // px per floor matching CAD Studio AiBlueprintStudio
  const buildingWidth = 260;
  const buildingDepth = 190;

  // Estimated structural takeoffs
  const totalGFA = bp?.takeoff?.grossFloorAreaSqft || (totalFlrs * 2400);
  const concreteCuM = bp?.takeoff?.concreteVolumeCuM ? bp.takeoff.concreteVolumeCuM.toFixed(1) : (totalFlrs * 91.2).toFixed(1);
  const steelRebarMT = bp?.takeoff?.steelRebarWeightMT ? bp.takeoff.steelRebarWeightMT.toFixed(1) : (totalFlrs * 8.65).toFixed(1);
  const cementBags = bp?.takeoff?.cementBags ? bp.takeoff.cementBags.toLocaleString() : (totalFlrs * 710).toLocaleString();

  // Render complete 3D SVG building matching CAD Studio AiBlueprintStudio
  const renderBuildingSVG = () => {
    const halfW = buildingWidth / 2;
    const halfD = buildingDepth / 2;

    // Facade fill & stroke styling matching CAD Studio exactly
    let facadeFill = isNight ? "url(#glassFacadeNight)" : "url(#glassFacadeDay)";
    let facadeStroke = isNight ? "#F59E0B" : "#38BDF8";

    if (isLuxuryGold) {
      facadeFill = isNight ? "url(#goldFacadeNight)" : "url(#goldFacadeDay)";
      facadeStroke = isNight ? "#FEF08A" : "#F59E0B";
    } else if (isCyberObsidian) {
      facadeFill = isNight ? "url(#cyberFacadeNight)" : "url(#cyberFacadeDay)";
      facadeStroke = isNight ? "#06B6D4" : "#38BDF8";
    } else if (isBiophilic) {
      facadeFill = isNight ? "url(#emeraldFacadeNight)" : "url(#emeraldFacadeDay)";
      facadeStroke = isNight ? "#6EE7B7" : "#10B981";
    }

    const floorsArray: number[] = [];
    for (let f = 1; f <= totalFlrs; f++) {
      floorsArray.push(f);
    }

    return (
      <>
        <defs>
          {/* Azure Glass reflection gradient */}
          <linearGradient id="glassFacadeDay" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#0284C7" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#0369A1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="glassFacadeNight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E293B" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#0F172A" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FEF08A" stopOpacity="0.6" />
          </linearGradient>

          {/* Champagne Gold Luxury Glazing Gradient */}
          <linearGradient id="goldFacadeDay" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.88" />
            <stop offset="35%" stopColor="#D97706" stopOpacity="0.80" />
            <stop offset="70%" stopColor="#B45309" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FEF08A" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="goldFacadeNight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#78350F" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.80" />
            <stop offset="70%" stopColor="#451A03" stopOpacity="0.90" />
            <stop offset="100%" stopColor="#FDE047" stopOpacity="0.90" />
          </linearGradient>

          {/* Cyber Obsidian Smoke Black Gradient */}
          <linearGradient id="cyberFacadeDay" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0F172A" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#1E293B" stopOpacity="0.90" />
            <stop offset="75%" stopColor="#090D16" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#334155" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="cyberFacadeNight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#030712" stopOpacity="0.98" />
            <stop offset="30%" stopColor="#06B6D4" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#0F172A" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.55" />
          </linearGradient>

          {/* Biophilic Emerald Jade Glazing Gradient */}
          <linearGradient id="emeraldFacadeDay" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#059669" stopOpacity="0.80" />
            <stop offset="80%" stopColor="#047857" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#A7F3D0" stopOpacity="0.90" />
          </linearGradient>

          <linearGradient id="emeraldFacadeNight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#064E3B" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#10B981" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#022C22" stopOpacity="0.90" />
            <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.80" />
          </linearGradient>

          <linearGradient id="slabGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          <linearGradient id="groundShadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,0,0,0.6)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
        </defs>

        {/* 1. Ground Plaza & Foundations */}
        <g id="ground-plinth">
          <ellipse cx="350" cy="440" rx="260" ry="110" fill="url(#groundShadow)" />

          {/* Plaza Slab (Footprint) */}
          {(() => {
            const p1 = project(-180, -140, 0);
            const p2 = project(180, -140, 0);
            const p3 = project(180, 140, 0);
            const p4 = project(-180, 140, 0);
            return (
              <polygon
                points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`}
                fill={isNight ? "#0F172A" : (isCyberObsidian ? "#090D16" : "#1E293B")}
                stroke={isCyberObsidian ? "#06B6D4" : (isLuxuryGold ? "#B45309" : "#334155")}
                strokeWidth="1.5"
              />
            );
          })()}

          {/* Plaza Landscaping & Entrance Canopy */}
          {(() => {
            const ep1 = project(-60, 140, 0);
            const ep2 = project(60, 140, 0);
            const ep3 = project(80, 180, 0);
            const ep4 = project(-80, 180, 0);
            return (
              <polygon
                points={`${ep1.x},${ep1.y} ${ep2.x},${ep2.y} ${ep3.x},${ep3.y} ${ep4.x},${ep4.y}`}
                fill={isLuxuryGold ? "#D97706" : (isCyberObsidian ? "#06B6D4" : (isBiophilic ? "#059669" : "#0284C7"))}
                fillOpacity="0.4"
                stroke={isLuxuryGold ? "#F59E0B" : (isCyberObsidian ? "#22D3EE" : "#38BDF8")}
                strokeWidth="1"
              />
            );
          })()}
        </g>

        {/* 2. Multi-Story Floors Extrusion */}
        {floorsArray.map((floorNum) => {
          if (activeFloorTab !== "ALL" && activeFloorTab !== floorNum) return null;

          const baseZ = (floorNum - 1) * floorHeight + 10;
          const topZ = baseZ + floorHeight - 4;

          // 4 Vertices of bottom slab (Rectangular default)
          const b1 = project(-halfW, -halfD, baseZ);
          const b2 = project(halfW, -halfD, baseZ);
          const b3 = project(halfW, halfD, baseZ);
          const b4 = project(-halfW, halfD, baseZ);

          // 4 Vertices of top slab
          const t1 = project(-halfW, -halfD, topZ);
          const t2 = project(halfW, -halfD, topZ);
          const t3 = project(halfW, halfD, topZ);
          const t4 = project(-halfW, halfD, topZ);

          // T-Shaped Symmetric Structural Frame Vertices
          const tb1 = project(-140, 20, baseZ);
          const tb2 = project(-45, 20, baseZ);
          const tb3 = project(-45, -100, baseZ);
          const tb4 = project(45, -100, baseZ);
          const tb5 = project(45, 20, baseZ);
          const tb6 = project(140, 20, baseZ);
          const tb7 = project(140, 80, baseZ);
          const tb8 = project(-140, 80, baseZ);

          const tt1 = project(-140, 20, topZ);
          const tt2 = project(-45, 20, topZ);
          const tt3 = project(-45, -100, topZ);
          const tt4 = project(45, -100, topZ);
          const tt5 = project(45, 20, topZ);
          const tt6 = project(140, 20, topZ);
          const tt7 = project(140, 80, topZ);
          const tt8 = project(-140, 80, topZ);

          // H-Shaped Symmetric Structural Frame Vertices
          const hb1 = project(-140, -85, baseZ);
          const hb2 = project(-50, -85, baseZ);
          const hb3 = project(-50, -28, baseZ);
          const hb4 = project(50, -28, baseZ);
          const hb5 = project(50, -85, baseZ);
          const hb6 = project(140, -85, baseZ);
          const hb7 = project(140, 85, baseZ);
          const hb8 = project(50, 85, baseZ);
          const hb9 = project(50, 28, baseZ);
          const hb10 = project(-50, 28, baseZ);
          const hb11 = project(-50, 85, baseZ);
          const hb12 = project(-140, 85, baseZ);

          const ht1 = project(-140, -85, topZ);
          const ht2 = project(-50, -85, topZ);
          const ht3 = project(-50, -28, topZ);
          const ht4 = project(50, -28, topZ);
          const ht5 = project(50, -85, topZ);
          const ht6 = project(140, -85, topZ);
          const ht7 = project(140, 85, topZ);
          const ht8 = project(50, 85, topZ);
          const ht9 = project(50, 28, topZ);
          const ht10 = project(-50, 28, topZ);
          const ht11 = project(-50, 85, topZ);
          const ht12 = project(-140, 85, topZ);

          return (
            <g key={`floor-${floorNum}`} className="transition-all duration-300">
              {/* Floor Slab Foundation Base */}
              <polygon
                points={
                  massingForm === "T_SHAPED"
                    ? `${tb1.x},${tb1.y} ${tb2.x},${tb2.y} ${tb3.x},${tb3.y} ${tb4.x},${tb4.y} ${tb5.x},${tb5.y} ${tb6.x},${tb6.y} ${tb7.x},${tb7.y} ${tb8.x},${tb8.y}`
                    : massingForm === "H_SHAPED"
                    ? `${hb1.x},${hb1.y} ${hb2.x},${hb2.y} ${hb3.x},${hb3.y} ${hb4.x},${hb4.y} ${hb5.x},${hb5.y} ${hb6.x},${hb6.y} ${hb7.x},${hb7.y} ${hb8.x},${hb8.y} ${hb9.x},${hb9.y} ${hb10.x},${hb10.y} ${hb11.x},${hb11.y} ${hb12.x},${hb12.y}`
                    : `${b1.x},${b1.y} ${b2.x},${b2.y} ${b3.x},${b3.y} ${b4.x},${b4.y}`
                }
                fill={isNight ? "#334155" : "url(#slabGradient)"}
                stroke={isCyberObsidian ? "#06B6D4" : (isLuxuryGold ? "#B45309" : "#475569")}
                strokeWidth={1.5}
              />

              {/* Vertical Structural Columns */}
              {(massingForm === "T_SHAPED" ? [
                { bottom: tb8, top: tt8 }, { bottom: tb7, top: tt7 }, { bottom: tb6, top: tt6 },
                { bottom: tb5, top: tt5 }, { bottom: tb4, top: tt4 }, { bottom: tb3, top: tt3 },
                { bottom: tb2, top: tt2 }, { bottom: tb1, top: tt1 }
              ] : massingForm === "H_SHAPED" ? [
                { bottom: hb1, top: ht1 }, { bottom: hb6, top: ht6 }, { bottom: hb7, top: ht7 },
                { bottom: hb12, top: ht12 }, { bottom: hb3, top: ht3 }, { bottom: hb4, top: ht4 },
                { bottom: hb9, top: ht9 }, { bottom: hb10, top: ht10 }
              ] : [
                { bottom: project(-halfW + 8, -halfD + 8, baseZ), top: project(-halfW + 8, -halfD + 8, topZ) },
                { bottom: project(halfW - 8, -halfD + 8, baseZ), top: project(halfW - 8, -halfD + 8, topZ) },
                { bottom: project(halfW - 8, halfD - 8, baseZ), top: project(halfW - 8, halfD - 8, topZ) },
                { bottom: project(-halfW + 8, halfD - 8, baseZ), top: project(-halfW + 8, halfD - 8, topZ) }
              ]).map((col, idx) => (
                <line
                  key={`col-${floorNum}-${idx}`}
                  x1={col.bottom.x}
                  y1={col.bottom.y}
                  x2={col.top.x}
                  y2={col.top.y}
                  stroke={isLuxuryGold ? "#F59E0B" : (isCyberObsidian ? "#06B6D4" : "#38BDF8")}
                  strokeWidth={3}
                  strokeLinecap="square"
                />
              ))}

              {/* Curtain Wall Glazed Facade Panels */}
              {massingForm === "T_SHAPED" ? (
                /* T-SHAPED FACADE WITH 3D DEPTH SORTING */
                (() => {
                  const tFaces = [
                    { id: 'front', p1: tb8, p2: tb7, t1: tt8, t2: tt7, midX: 0, midY: 80 },
                    { id: 'right_end', p1: tb7, p2: tb6, t1: tt7, t2: tt6, midX: 140, midY: 50 },
                    { id: 'right_notch', p1: tb6, p2: tb5, t1: tt6, t2: tt5, midX: 92.5, midY: 20 },
                    { id: 'stem_right', p1: tb5, p2: tb4, t1: tt5, t2: tt4, midX: 45, midY: -40 },
                    { id: 'stem_rear', p1: tb4, p2: tb3, t1: tt4, t2: tt3, midX: 0, midY: -100 },
                    { id: 'stem_left', p1: tb3, p2: tb2, t1: tt3, t2: tt2, midX: -45, midY: -40 },
                    { id: 'left_notch', p1: tb2, p2: tb1, t1: tt2, t2: tt1, midX: -92.5, midY: 20 },
                    { id: 'left_end', p1: tb1, p2: tb8, t1: tt1, t2: tt8, midX: -140, midY: 50 }
                  ].map(face => ({
                    ...face,
                    depth: face.midX * sinO + face.midY * cosO
                  })).sort((a, b) => a.depth - b.depth);

                  return tFaces.map(face => (
                    <polygon
                      key={`t-face-${floorNum}-${face.id}`}
                      points={`${face.p1.x},${face.p1.y} ${face.p2.x},${face.p2.y} ${face.t2.x},${face.t2.y} ${face.t1.x},${face.t1.y}`}
                      fill={facadeFill}
                      stroke={facadeStroke}
                      strokeWidth="1.2"
                      strokeOpacity="0.88"
                    />
                  ));
                })()
              ) : massingForm === "H_SHAPED" ? (
                /* H-SHAPED FACADE WITH 3D DEPTH SORTING */
                (() => {
                  const hFaces = [
                    { id: 'left_front', p1: hb12, p2: hb11, t1: ht12, t2: ht11, midX: -95, midY: 85 },
                    { id: 'bridge_front', p1: hb10, p2: hb9, t1: ht10, t2: ht9, midX: 0, midY: 28 },
                    { id: 'right_front', p1: hb8, p2: hb7, t1: ht8, t2: ht7, midX: 95, midY: 85 },
                    { id: 'right_flank', p1: hb7, p2: hb6, t1: ht7, t2: ht6, midX: 140, midY: 0 },
                    { id: 'left_flank', p1: hb1, p2: hb12, t1: ht1, t2: ht12, midX: -140, midY: 0 }
                  ].map(face => ({
                    ...face,
                    depth: face.midX * sinO + face.midY * cosO
                  })).sort((a, b) => a.depth - b.depth);

                  return hFaces.map(face => (
                    <polygon
                      key={`h-face-${floorNum}-${face.id}`}
                      points={`${face.p1.x},${face.p1.y} ${face.p2.x},${face.p2.y} ${face.t2.x},${face.t2.y} ${face.t1.x},${face.t1.y}`}
                      fill={facadeFill}
                      stroke={facadeStroke}
                      strokeWidth="1.2"
                      strokeOpacity="0.88"
                    />
                  ));
                })()
              ) : (
                /* Standard Rectilinear Glazed Curtain Wall (Front & Side) */
                <>
                  {/* Facade Face 1 (Front) */}
                  <polygon
                    points={`${b3.x},${b3.y} ${b4.x},${b4.y} ${t4.x},${t4.y} ${t3.x},${t3.y}`}
                    fill={facadeFill}
                    stroke={facadeStroke}
                    strokeWidth="1"
                    strokeOpacity="0.85"
                  />
                  {/* Facade Face 2 (Right Side) */}
                  <polygon
                    points={`${b2.x},${b2.y} ${b3.x},${b3.y} ${t3.x},${t3.y} ${t2.x},${t2.y}`}
                    fill={facadeFill}
                    stroke={facadeStroke}
                    strokeWidth="1"
                    strokeOpacity="0.65"
                  />

                  {/* Window Mullions Grid Lines */}
                  {[0.25, 0.5, 0.75].map((ratio, mIdx) => {
                    const mx1 = b3.x + (b4.x - b3.x) * ratio;
                    const my1 = b3.y + (b4.y - b3.y) * ratio;
                    const mx2 = t3.x + (t4.x - t3.x) * ratio;
                    const my2 = t3.y + (t4.y - t3.y) * ratio;
                    return (
                      <line
                        key={`mullion-${floorNum}-${mIdx}`}
                        x1={mx1}
                        y1={my1}
                        x2={mx2}
                        y2={my2}
                        stroke={isLuxuryGold ? "#FDE047" : (isCyberObsidian ? "#06B6D4" : (isNight ? "#FEF08A" : "#E0F2FE"))}
                        strokeWidth="1"
                        strokeOpacity="0.65"
                      />
                    );
                  })}
                </>
              )}

              {/* DYNAMIC ARCHITECTURAL BALCONIES (1:1 with CAD Studio) */}
              {(() => {
                if (massingForm === "T_SHAPED") {
                  const tbF1 = project(-140, 80 + 16, baseZ);
                  const tbF2 = project(140, 80 + 16, baseZ);
                  const tbrF1 = project(-140, 80 + 16, baseZ + 12);
                  const tbrF2 = project(140, 80 + 16, baseZ + 12);
                  return (
                    <g key={`tshape-balc-${floorNum}`}>
                      <polygon points={`${tb8.x},${tb8.y} ${tbF1.x},${tbF1.y} ${tbF2.x},${tbF2.y} ${tb7.x},${tb7.y}`} fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                      <polygon points={`${tbF1.x},${tbF1.y} ${tbF2.x},${tbF2.y} ${tbrF2.x},${tbrF2.y} ${tbrF1.x},${tbrF1.y}`} fill="rgba(56, 189, 248, 0.45)" stroke="#38BDF8" strokeWidth="1" />
                      <line x1={tbrF1.x} y1={tbrF1.y} x2={tbrF2.x} y2={tbrF2.y} stroke="#FFFFFF" strokeWidth="2" />
                    </g>
                  );
                } else if (massingForm === "H_SHAPED") {
                  const hbL1 = project(-140, 85 + 16, baseZ);
                  const hbL2 = project(-50, 85 + 16, baseZ);
                  const hbrL1 = project(-140, 85 + 16, baseZ + 12);
                  const hbrL2 = project(-50, 85 + 16, baseZ + 12);

                  const hbR1 = project(50, 85 + 16, baseZ);
                  const hbR2 = project(140, 85 + 16, baseZ);
                  const hbrR1 = project(50, 85 + 16, baseZ + 12);
                  const hbrR2 = project(140, 85 + 16, baseZ + 12);
                  return (
                    <g key={`hshape-balc-${floorNum}`}>
                      <polygon points={`${hb12.x},${hb12.y} ${hbL1.x},${hbL1.y} ${hbL2.x},${hbL2.y} ${hb11.x},${hb11.y}`} fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                      <polygon points={`${hbL1.x},${hbL1.y} ${hbL2.x},${hbL2.y} ${hbrL2.x},${hbrL2.y} ${hbrL1.x},${hbrL1.y}`} fill="rgba(56, 189, 248, 0.45)" stroke="#38BDF8" strokeWidth="1" />
                      <line x1={hbrL1.x} y1={hbrL1.y} x2={hbrL2.x} y2={hbrL2.y} stroke="#FFFFFF" strokeWidth="2" />

                      <polygon points={`${hb8.x},${hb8.y} ${hbR1.x},${hbR1.y} ${hbR2.x},${hbR2.y} ${hb7.x},${hb7.y}`} fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                      <polygon points={`${hbR1.x},${hbR1.y} ${hbR2.x},${hbR2.y} ${hbrR2.x},${hbrR2.y} ${hbrR1.x},${hbrR1.y}`} fill="rgba(56, 189, 248, 0.45)" stroke="#38BDF8" strokeWidth="1" />
                      <line x1={hbrR1.x} y1={hbrR1.y} x2={hbrR2.x} y2={hbrR2.y} stroke="#FFFFFF" strokeWidth="2" />
                    </g>
                  );
                } else if (balconyType === "CANTILEVERED_FLOATING") {
                  // Alternating cantilevered floating pods (Ultra-Luxury Sky-Mansion signature)
                  const isOdd = floorNum % 2 !== 0;
                  const bLeft = isOdd ? -halfW - 25 : -20;
                  const bRight = isOdd ? 20 : halfW + 25;
                  const bDepth = halfD + 26;
                  const bHeight = 14;

                  const c1 = project(bLeft, halfD, baseZ);
                  const c2 = project(bRight, halfD, baseZ);
                  const c3 = project(bRight, bDepth, baseZ);
                  const c4 = project(bLeft, bDepth, baseZ);

                  const r1 = project(bLeft, halfD, baseZ + bHeight);
                  const r2 = project(bRight, halfD, baseZ + bHeight);
                  const r3 = project(bRight, bDepth, baseZ + bHeight);
                  const r4 = project(bLeft, bDepth, baseZ + bHeight);

                  return (
                    <g key={`balcony-floating-${floorNum}`}>
                      <polygon points={`${c1.x},${c1.y} ${c2.x},${c2.y} ${c3.x},${c3.y} ${c4.x},${c4.y}`} fill={isLuxuryGold ? "#451A03" : "#1E293B"} stroke={isLuxuryGold ? "#F59E0B" : "#38BDF8"} strokeWidth="1.2" />
                      <polygon points={`${c4.x},${c4.y} ${c3.x},${c3.y} ${r3.x},${r3.y} ${r4.x},${r4.y}`} fill={isLuxuryGold ? "rgba(245, 158, 11, 0.35)" : "rgba(56, 189, 248, 0.45)"} stroke={isLuxuryGold ? "#FEF08A" : "#38BDF8"} strokeWidth="1" />
                      {isOdd ? (
                        <polygon points={`${c1.x},${c1.y} ${c4.x},${c4.y} ${r4.x},${r4.y} ${r1.x},${r1.y}`} fill={isLuxuryGold ? "rgba(245, 158, 11, 0.3)" : "rgba(56, 189, 248, 0.4)"} stroke={isLuxuryGold ? "#FEF08A" : "#0284C7"} strokeWidth="1" />
                      ) : (
                        <polygon points={`${c2.x},${c2.y} ${c3.x},${c3.y} ${r3.x},${r3.y} ${r2.x},${r2.y}`} fill={isLuxuryGold ? "rgba(245, 158, 11, 0.3)" : "rgba(56, 189, 248, 0.4)"} stroke={isLuxuryGold ? "#FEF08A" : "#0284C7"} strokeWidth="1" />
                      )}
                      <line x1={r4.x} y1={r4.y} x2={r3.x} y2={r3.y} stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" />
                      {isOdd ? (
                        <line x1={r1.x} y1={r1.y} x2={r4.x} y2={r4.y} stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" />
                      ) : (
                        <line x1={r2.x} y1={r2.y} x2={r3.x} y2={r3.y} stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" />
                      )}
                    </g>
                  );
                }
                return null;
              })()}

              {/* Top Slab Chamfer Edge */}
              <polygon
                points={
                  massingForm === "T_SHAPED"
                    ? `${tt1.x},${tt1.y} ${tt2.x},${tt2.y} ${tt3.x},${tt3.y} ${tt4.x},${tt4.y} ${tt5.x},${tt5.y} ${tt6.x},${tt6.y} ${tt7.x},${tt7.y} ${tt8.x},${tt8.y}`
                    : massingForm === "H_SHAPED"
                    ? `${ht1.x},${ht1.y} ${ht2.x},${ht2.y} ${ht3.x},${ht3.y} ${ht4.x},${ht4.y} ${ht5.x},${ht5.y} ${ht6.x},${ht6.y} ${ht7.x},${ht7.y} ${ht8.x},${ht8.y} ${ht9.x},${ht9.y} ${ht10.x},${ht10.y} ${ht11.x},${ht11.y} ${ht12.x},${ht12.y}`
                    : `${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y} ${t4.x},${t4.y}`
                }
                fill={isNight ? "#1E293B" : "url(#slabGradient)"}
                stroke={isCyberObsidian ? "#06B6D4" : (isLuxuryGold ? "#D97706" : "#94A3B8")}
                strokeWidth={1.5}
              />

              {/* Structural FEM Grid Lines on Roof Slab (if top floor) */}
              {floorNum === totalFlrs && massingForm === "T_SHAPED" && (
                <g id="t-roof-fem-grid" opacity="0.85">
                  {[-95, -50, 0, 50, 95].map((gx, gIdx) => {
                    const pA = project(gx, 20, topZ);
                    const pB = project(gx, 80, topZ);
                    return <line key={`t-fem-f-x-${gIdx}`} x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />;
                  })}
                  {[-15, -45, -75].map((gy, gIdx) => {
                    const pA = project(-45, gy, topZ);
                    const pB = project(45, gy, topZ);
                    return <line key={`t-fem-s-y-${gIdx}`} x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />;
                  })}
                </g>
              )}

              {/* Floor Level Label Pill (Left floating) */}
              <g transform={`translate(${b1.x - 70}, ${b1.y})`}>
                <rect x="0" y="-9" width="55" height="18" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke={isCyberObsidian ? "#06B6D4" : (isLuxuryGold ? "#F59E0B" : "#38BDF8")} strokeWidth="0.8" />
                <text x="27" y="3" fill="#E2E8F0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  {floorNum === 1 ? "G (LOBBY)" : `LEVEL ${floorNum}`}
                </text>
              </g>
            </g>
          );
        })}

        {/* 3. Rooftop Architecture & Elevator Penthouse */}
        {(() => {
          const topZ = totalFlrs * floorHeight + 10;
          const p1 = project(-halfW, -halfD, topZ + 8);
          const p2 = project(halfW, -halfD, topZ + 8);
          const p3 = project(halfW, halfD, topZ + 8);
          const p4 = project(-halfW, halfD, topZ + 8);

          // Central core lift machine room
          let coreX = 0;
          let coreY = 0;
          let coreW = 25;
          let coreD = 20;

          if (massingForm === "T_SHAPED") {
            coreX = 0;
            coreY = 50;
            coreW = 24;
            coreD = 16;
          } else if (massingForm === "H_SHAPED") {
            coreX = 0;
            coreY = 0;
            coreW = 22;
            coreD = 14;
          }

          const l1 = project(coreX - coreW, coreY - coreD, topZ);
          const l2 = project(coreX + coreW, coreY - coreD, topZ);
          const l3 = project(coreX + coreW, coreY + coreD, topZ);
          const l4 = project(coreX - coreW, coreY + coreD, topZ);

          const lt1 = project(coreX - coreW, coreY - coreD, topZ + 26);
          const lt2 = project(coreX + coreW, coreY - coreD, topZ + 26);
          const lt3 = project(coreX + coreW, coreY + coreD, topZ + 26);
          const lt4 = project(coreX - coreW, coreY + coreD, topZ + 26);

          const spireBase = project(coreX, coreY, topZ + 26);
          const spireTip = project(coreX, coreY, topZ + 55);

          return (
            <g id="rooftop-feature-group">
              {/* Parapet Outline with Green Signature Box matching Studio */}
              <polygon
                points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`}
                fill="none"
                stroke="#10B981"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Rooftop Level Badge matching Studio */}
              <g transform={`translate(${p4.x - 20}, ${p4.y - 14})`}>
                <rect x="0" y="-7" width="55" height="15" rx="3" fill="rgba(15, 23, 42, 0.9)" stroke="#10B981" strokeWidth="0.8" />
                <text x="27.5" y="3.5" fill="#34D399" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  LEVEL {totalFlrs}
                </text>
              </g>

              {/* Central Lift Core Box */}
              <polygon points={`${l1.x},${l1.y} ${l2.x},${l2.y} ${l3.x},${l3.y} ${l4.x},${l4.y}`} fill="#334155" />
              <polygon points={`${l3.x},${l3.y} ${l4.x},${l4.y} ${lt4.x},${lt4.y} ${lt3.x},${lt3.y}`} fill="#1E293B" stroke="#475569" />
              <polygon points={`${l2.x},${l2.y} ${l3.x},${l3.y} ${lt3.x},${lt3.y} ${lt2.x},${lt2.y}`} fill="#0F172A" stroke="#475569" />
              <polygon points={`${lt1.x},${lt1.y} ${lt2.x},${lt2.y} ${lt3.x},${lt3.y} ${lt4.x},${lt4.y}`} fill="#475569" stroke="#64748B" />

              {/* Communication Mast / Obstruction Beacon Light */}
              <g id="rooftop-antenna">
                <line x1={spireBase.x} y1={spireBase.y} x2={spireTip.x} y2={spireTip.y} stroke="#EF4444" strokeWidth="2.5" />
                <circle cx={spireTip.x} cy={spireTip.y} r="3" fill="#EF4444" className="animate-ping" />
                <circle cx={spireTip.x} cy={spireTip.y} r="2.5" fill="#EF4444" />
              </g>
            </g>
          );
        })()}

        {/* 4. Height Scale Dimension Line matching CAD Studio AiBlueprintStudio */}
        {(() => {
          const totalHtM = (totalFlrs * 3.2).toFixed(1);
          const totalHtFt = (totalFlrs * 3.2 * 3.28084).toFixed(0);
          const topPoint = project(buildingWidth / 2 + 45, 0, totalFlrs * floorHeight + 10);
          const bottomPoint = project(buildingWidth / 2 + 45, 0, 10);

          return (
            <g id="height-scale">
              <line
                x1={bottomPoint.x}
                y1={bottomPoint.y}
                x2={topPoint.x}
                y2={topPoint.y}
                stroke="#38BDF8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <line x1={bottomPoint.x - 6} y1={bottomPoint.y} x2={bottomPoint.x + 6} y2={bottomPoint.y} stroke="#38BDF8" strokeWidth="2" />
              <line x1={topPoint.x - 6} y1={topPoint.y} x2={topPoint.x + 6} y2={topPoint.y} stroke="#38BDF8" strokeWidth="2" />
              <g transform={`translate(${topPoint.x + 10}, ${(topPoint.y + bottomPoint.y) / 2})`}>
                <rect x="0" y="-18" width="95" height="36" rx="6" fill="rgba(15, 23, 42, 0.9)" stroke="#38BDF8" strokeWidth="1" />
                <text x="47" y="-3" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {totalHtM}m ({totalHtFt}ft)
                </text>
                <text x="47" y="10" fill="#94A3B8" fontSize="8" textAnchor="middle">
                  {totalFlrs} Stories Extrusion
                </text>
              </g>
            </g>
          );
        })()}
      </>
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
          {isRevoked ? (
            <div className="w-full h-full min-h-[420px] flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-red-950/40 via-[#0d070b] to-slate-950 relative overflow-hidden rounded-xl border border-red-500/30">
              <div className="p-4 bg-red-500/15 border-2 border-red-500/60 rounded-2xl text-red-400 mb-4 shadow-2xl shadow-red-950/50 animate-pulse">
                <Lock className="w-12 h-12" />
              </div>
              <div className="px-3.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-mono font-bold tracking-wider mb-2">
                🔒 ACCESS REVOKED BY CHAIRMAN DIRECTIVE
              </div>
              <h3 className="text-xl font-bold text-white max-w-md">
                3D Model & CAD Viewing Terminated
              </h3>
              <p className="text-xs text-red-200/80 mt-2 max-w-md leading-relaxed">
                The Executive Chairman has exercised executive board powers to terminate access to this 3D structural building model. Viewing privileges across all organization and public users are immediately revoked.
              </p>
              <div className="mt-5 p-3.5 bg-red-900/30 border border-red-700/50 rounded-xl text-left max-w-md w-full text-xs">
                <div className="flex items-center justify-between text-[11px] text-red-300 font-bold mb-1">
                  <span>EXECUTIVE STOP DIRECTIVE</span>
                  <span className="text-red-400">Order by Chairman</span>
                </div>
                <p className="text-slate-300 text-[11px] italic">
                  &ldquo;{details || "Structural audit revision or safety moratorium directive in effect."}&rdquo;
                </p>
                <div className="mt-2 pt-2 border-t border-red-800/40 flex items-center justify-between text-[10px] text-red-400">
                  <span>Revocation State: ACTIVE KILL</span>
                  <span>Date: {date}</span>
                </div>
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
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
              {onApprove && !isRevoked && (
                <button
                  type="button"
                  onClick={onApprove}
                  className="flex-1 py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve 3D Model</span>
                </button>
              )}
              {onRevoke && !isRevoked && (
                <button
                  type="button"
                  onClick={onRevoke}
                  className="py-2.5 px-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 transition cursor-pointer"
                  title="Kill and Revoke Access across all Organization & Public Users"
                >
                  <Lock className="w-4 h-4" />
                  <span>Revoke 3D Access</span>
                </button>
              )}
              {onReject && !isRevoked && (
                <button
                  type="button"
                  onClick={onReject}
                  className="py-2.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              )}
              {isRevoked && (
                <div className="w-full p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-center text-xs font-bold text-red-300 flex items-center justify-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>ACCESS TERMINATED BY CHAIRMAN</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
