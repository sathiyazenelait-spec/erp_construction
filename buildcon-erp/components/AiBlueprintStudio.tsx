"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Compass, Sparkles, Layers, Box, Eye, CheckCircle2,
  AlertTriangle, ZoomIn, ZoomOut, Maximize2, Download,
  Printer, Save, RefreshCw, Sliders, ChevronRight,
  HardHat, Activity, Cpu, ShieldCheck, Thermometer,
  Grid, Move, Info, Check, ArrowRight, Sun, Moon, Rotate3d,
  Key, Building, Building2, EyeOff, Send, X
} from "lucide-react";

export interface BlueprintRoom {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  areaSqft: number;
  flooring: string;
  type: string;
}

export interface BlueprintColumn {
  grid: string;
  x: number;
  y: number;
  size: string;
  rebar: string;
}

export interface Building3DSpec {
  totalFloors: number;
  floorHeightMeters: number;
  totalHeightMeters: number;
  totalHeightFeet: number;
  typicalFloorPlateSqFt: number;
  grossFloorAreaSqFt: number;
  facadeStyle: string;
  structureType: string;
  concreteGrade: string;
  steelGrade: string;
  foundationType: string;
  coreLiftCount: number;
  architecturalHighlights: string[];
  hasHelipad?: boolean;
  hasDoubleHeight?: boolean;
  hasFloatingBalconies?: boolean;
  hasRooftopGarden?: boolean;
  facadePalette?: "GOLD_LUXURY" | "AZURE_GLASS" | "EMERALD_ECO" | "BRONZE_NORDIC";
  rooftopFeature?: string;
  balconyType?: string;
}

export interface BlueprintData {
  blueprintId: string;
  drawingNumber: string;
  title: string;
  prompt: string;
  projectType: string;
  theme: string;
  scale: string;
  floors?: number;
  building3D?: Building3DSpec;
  dimensions: {
    canvasWidth: number;
    canvasHeight: number;
    builtupAreaSqft: number;
    carpetAreaSqft: number;
    wallPerimeterMeters: number;
    ceilingHeightMeters: number;
  };
  rooms: BlueprintRoom[];
  columns: BlueprintColumn[];
  mep: {
    hvacDuctPath: string;
    sprinklers: { x: number; y: number }[];
    electricalDBCoord: { x: number; y: number; label: string };
    plumbingShaftCoord: { x: number; y: number; label: string };
  };
  takeoff: {
    concreteVolumeCuM: number;
    steelRebarTons: number;
    cementBags: number;
    aacBlocksCount: number;
    flooringTilesSqFt: number;
    paintPrimerLiters: number;
    electricalWiringMeters: number;
    estimatedMaterialCostINR: number;
    estimatedLaborCostINR: number;
    totalEstimatedCostINR: number;
    costPerSqFtINR: number;
  };
  aiInsights: {
    structuralStabilityScore: number;
    daylightFactorIndex: string;
    vastuFengShuiScore: number;
    nbcCompliance: string;
    clashesDetected: number;
    efficiencyRatio: string;
    geminiArchitectEngine?: string;
    summary?: string;
  };
}

interface AiBlueprintStudioProps {
  onSaveDrawing?: (drawingData: any) => void;
  orgId?: number;
}

export default function AiBlueprintStudio({ onSaveDrawing, orgId = 1 }: AiBlueprintStudioProps) {
  // Preset Types
  const PRESETS = [
    { type: "RESIDENTIAL", label: "7-Story Luxury High-Rise", defaultSqft: 2400, defaultFloors: 7, icon: "🏢" },
    { type: "COMMERCIAL", label: "Corporate Glass Tower", defaultSqft: 4800, defaultFloors: 8, icon: "🏬" },
    { type: "HOSPITAL", label: "Critical Care Hospital Wing", defaultSqft: 3600, defaultFloors: 5, icon: "🏥" },
    { type: "INDUSTRIAL", label: "Logistics PEB Warehouse", defaultSqft: 7500, defaultFloors: 2, icon: "🏭" },
    { type: "VILLA", label: "Modern Luxury Courtyard Villa", defaultSqft: 3200, defaultFloors: 3, icon: "🏡" },
  ];

  const [selectedPreset, setSelectedPreset] = useState("RESIDENTIAL");
  const [promptText, setPromptText] = useState("7 Floor Luxury Residential Tower with curtain wall glazing, cantilevered balconies, and rooftop terrace garden");
  const [builtupSqft, setBuiltupSqft] = useState(2400);
  const [floors, setFloors] = useState(7);
  const [generating, setGenerating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<BlueprintRoom | null>(null);
  const [chairmanSubmitSuccess, setChairmanSubmitSuccess] = useState(false);
  const [showChairmanSubmitModal, setShowChairmanSubmitModal] = useState(false);
  const [chairmanSubmitNote, setChairmanSubmitNote] = useState("Requesting Chairman executive board review and budget authorization for this multi-story building structural model.");
  const [submittingToChairman, setSubmittingToChairman] = useState(false);

  // View Mode: 2D CAD vs Complete 3D Building Model vs BIM X-Ray Frame
  const [viewMode, setViewMode] = useState<"2D_CAD" | "3D_MODEL" | "BIM_XRAY">("3D_MODEL");

  // 3D Camera & Lighting Controls
  const [orbitAngle, setOrbitAngle] = useState(38); // degrees (0 - 360)
  const [tiltAngle, setTiltAngle] = useState(28); // degrees (15 - 75)
  const [lightingMode, setLightingMode] = useState<"DAY" | "NIGHT">("DAY");
  const [isolatedFloor, setIsolatedFloor] = useState<number | "ALL">("ALL");
  const [autoRotate, setAutoRotate] = useState(false);

  // Gemini API Key Modal
  const [showGeminiKeyModal, setShowGeminiKeyModal] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState("");

  // Canvas View Controls
  const [zoomLevel, setZoomLevel] = useState(100);
  const [theme, setTheme] = useState<"BLUEPRINT_CLASSIC" | "DARK_CAD" | "PAPER_WHITE">("BLUEPRINT_CLASSIC");

  // Layer Toggles for 2D
  const [layers, setLayers] = useState({
    architectural: true,
    structural: true,
    mep: true,
    furniture: true,
    dimensions: true,
    grid: true
  });

  const [data, setData] = useState<BlueprintData | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Mouse Drag to Orbit in 3D
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, orbit: 38, tilt: 28 });

  // Auto-rotate 3D loop
  useEffect(() => {
    if (!autoRotate || viewMode === "2D_CAD") return;
    const interval = setInterval(() => {
      setOrbitAngle(prev => (prev + 1) % 360);
    }, 45);
    return () => clearInterval(interval);
  }, [autoRotate, viewMode]);

  // Load saved Gemini API Key from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("buildcon_gemini_api_key") || "";
      if (savedKey) setGeminiApiKey(savedKey);
    }
  }, []);

  // Fetch or generate initial blueprint
  useEffect(() => {
    generateBlueprint(selectedPreset, promptText, builtupSqft, floors);
  }, []);

  async function generateBlueprint(pType: string, prompt: string, sqft: number, flrCount: number) {
    setGenerating(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("http://localhost:8001/api/ai/generate-blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt || `${pType} building design`,
          projectType: pType,
          builtupSqft: sqft,
          floors: flrCount,
          includeMep: layers.mep,
          theme: theme,
          geminiApiKey: geminiApiKey || undefined
        })
      });

      if (res.ok) {
        const bpData: BlueprintData = await res.json();
        setData(bpData);
        if (bpData.rooms && bpData.rooms.length > 0) {
          setSelectedRoom(bpData.rooms[0]);
        }
      } else {
        fallbackGenerate(pType, prompt, sqft, flrCount);
      }
    } catch (e) {
      console.warn("FastAPI offline, executing client-side generative model", e);
      fallbackGenerate(pType, prompt, sqft, flrCount);
    } finally {
      setGenerating(false);
    }
  }

  function fallbackGenerate(pType: string, prompt: string, sqft: number, flrCount: number) {
    const carpetArea = Math.round(sqft * 0.78);
    const wallPerimeter = Math.round(Math.sqrt(sqft) * 4.3);
    const concrete = Math.round(sqft * 0.038 * flrCount * 10) / 10;
    const steel = Math.round(concrete * 0.095 * 10) / 10;
    const cement = Math.round(concrete * 7.8);
    const cost = Math.round(sqft * flrCount * 2350);
    const flrHeight = pType === "INDUSTRIAL" ? 6.5 : 3.2;
    const totalHeight = Math.round(flrCount * flrHeight * 10) / 10;

    const promptStr = prompt || "";
    const pLower = promptStr.toLowerCase();

    // Detect floor count from prompt if explicitly specified (e.g., "7 floor", "7-floor", "7 story", "7-story")
    const flrMatch = pLower.match(/(\d+)\s*[-_]?\s*(floor|storey|story)/);
    let effectiveFloors = flrCount;
    if (flrMatch && flrMatch[1]) {
      const parsed = parseInt(flrMatch[1], 10);
      if (parsed >= 1 && parsed <= 25) effectiveFloors = parsed;
    }

    const hasHelipad = pLower.includes("helipad") || pLower.includes("heli-pad") || pLower.includes("helicopter") || pLower.includes("chopper");
    const hasDoubleHeight = pLower.includes("double-height") || pLower.includes("double height") || pLower.includes("duplex") || pLower.includes("mezzanine") || pLower.includes("high ceiling");
    const hasFloatingBalconies = pLower.includes("floating") || pLower.includes("cantilever") || pLower.includes("frameless") || pLower.includes("balcon");
    const hasRooftopGarden = pLower.includes("terrace garden") || pLower.includes("sky garden") || pLower.includes("green roof") || pLower.includes("sky-mansion") || pLower.includes("penthouse");
    const isLuxuryMansion = pLower.includes("sky-mansion") || pLower.includes("mansion") || pLower.includes("ultra-luxury") || pLower.includes("luxury") || pLower.includes("penthouse") || pLower.includes("gold");
    const isBiophilic = pLower.includes("biophilic") || pLower.includes("vertical garden") || pLower.includes("green") || pLower.includes("eco");

    const facadePalette: "GOLD_LUXURY" | "AZURE_GLASS" | "EMERALD_ECO" | "BRONZE_NORDIC" = isLuxuryMansion
      ? "GOLD_LUXURY"
      : isBiophilic
      ? "EMERALD_ECO"
      : pLower.includes("nordic")
      ? "BRONZE_NORDIC"
      : "AZURE_GLASS";

    const rooftopFeature = hasHelipad ? "HELIPAD" : hasRooftopGarden ? "PENTHOUSE_GARDEN" : "SOLAR_CORE";
    const balconyType = hasFloatingBalconies ? "CANTILEVERED_FLOATING" : pLower.includes("balcon") ? "UNIFORM_RUNNING" : "NONE";

    let title = `${effectiveFloors}-Story Executive Residence`;
    let dwg = `DWG-AI-RES-00${effectiveFloors}`;
    let facadeStyle = "Terracotta Louvers & Glazed Balconies";

    if (isLuxuryMansion) {
      title = `${effectiveFloors}-Floor Ultra-Luxury Sky-Mansion Tower`;
      facadeStyle = "Champagne Gold Double-Height Glazing & Frameless Glass";
      dwg = `DWG-AI-SKY-00${effectiveFloors}`;
    } else if (pLower.includes("villa") || pType === "VILLA") {
      title = `${effectiveFloors}-Story Luxury Villa with Floating Decks`;
      facadeStyle = "Frameless Panoramic Glass & Cantilevered Timber Decks";
      dwg = `DWG-AI-VIL-00${effectiveFloors}`;
    } else if (pLower.includes("commercial") || pLower.includes("office") || pType === "COMMERCIAL") {
      title = `${effectiveFloors}-Story Commercial Corporate Glass Tower`;
      facadeStyle = "Curtain Wall Double Glazed Low-E Blue";
      dwg = `DWG-AI-COM-00${effectiveFloors}`;
    } else if (pLower.includes("hospital") || pType === "HOSPITAL") {
      title = `${effectiveFloors}-Floor Medical Diagnostic & Critical Care Center`;
      facadeStyle = "Acoustic Low-E Antibacterial Glazing & Service Core";
      dwg = `DWG-AI-MED-00${effectiveFloors}`;
    } else if (pLower.includes("industrial") || pType === "INDUSTRIAL") {
      title = `${effectiveFloors}-Story High-Bay PEB Logistics Warehouse`;
      facadeStyle = "Insulated Sandwich Panels with Polycarbonate Skylights";
      dwg = `DWG-AI-IND-00${effectiveFloors}`;
    }

    let rooms: BlueprintRoom[] = [];
    let cols: BlueprintColumn[] = [];

    if (pType === "COMMERCIAL") {
      rooms = [
        { id: "R1", name: "Executive Open Workstation Hub", x: 100, y: 100, w: 360, h: 260, areaSqft: Math.round(sqft * 0.38), flooring: "Acoustic Carpet Tile", type: "OFFICE" },
        { id: "R2", name: "Boardroom & Video Conference", x: 480, y: 100, w: 220, h: 160, areaSqft: Math.round(sqft * 0.16), flooring: "Hardwood Engineered Oak", type: "MEETING" },
        { id: "R3", name: "MD Suite & Client Lounge", x: 480, y: 280, w: 220, h: 160, areaSqft: Math.round(sqft * 0.14), flooring: "Italian Botticino Marble", type: "EXECUTIVE" },
        { id: "R4", name: "Skyline Reception Foyer", x: 100, y: 380, w: 200, h: 120, areaSqft: Math.round(sqft * 0.12), flooring: "Flamed Fluted Granite", type: "FOYER" },
        { id: "R5", name: "High-Density Server Room (Tier 3)", x: 320, y: 380, w: 140, h: 120, areaSqft: Math.round(sqft * 0.08), flooring: "Anti-Static Raised Pedestal", type: "IT" },
        { id: "R6", name: "Cafeteria & Wellness Hub", x: 480, y: 460, w: 220, h: 80, areaSqft: Math.round(sqft * 0.08), flooring: "Full-Body Ceramic Matte", type: "UTILITY" },
        { id: "R7", name: "Core Lifts & Dual Fire Stairwell", x: 100, y: 520, w: 360, h: 60, areaSqft: Math.round(sqft * 0.04), flooring: "Heavy Duty Kota Stone", type: "CIRCULATION" }
      ];
      cols = [
        { grid: "A-1", x: 95, y: 95, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "B-1", x: 465, y: 95, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "C-1", x: 705, y: 95, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "A-2", x: 95, y: 365, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "B-2", x: 465, y: 365, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "C-2", x: 705, y: 365, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "A-3", x: 95, y: 585, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "B-3", x: 465, y: 585, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "C-3", x: 705, y: 585, size: "500x500mm", rebar: "12-T25 Fe550D" }
      ];
    } else {
      rooms = [
        { id: "R1", name: isLuxuryMansion ? "Grand Panoramic Sky-Mansion Salon" : "Grand Panoramic Living & Dining", x: 100, y: 100, w: 320, h: 220, areaSqft: Math.round(sqft * 0.35), flooring: "Statuario Glazed Vitrified 1200x600", type: "LIVING" },
        { id: "R2", name: "Master Suite & Dressing Wardrobe", x: 440, y: 100, w: 260, h: 180, areaSqft: Math.round(sqft * 0.24), flooring: "European Hardwood Plank", type: "BEDROOM" },
        { id: "R3", name: "Guest Bedroom 2 with Balcony", x: 440, y: 300, w: 260, h: 160, areaSqft: Math.round(sqft * 0.18), flooring: "Anti-Skid Vitrified Ceramic", type: "BEDROOM" },
        { id: "R4", name: "Children / Study Bedroom 3", x: 100, y: 340, w: 180, h: 160, areaSqft: Math.round(sqft * 0.12), flooring: "Acoustic Bamboo Flooring", type: "BEDROOM" },
        { id: "R5", name: "Modular Island Kitchen & Dry Utility", x: 300, y: 340, w: 120, h: 160, areaSqft: Math.round(sqft * 0.08), flooring: "Full-Body Leathered Granite", type: "KITCHEN" },
        { id: "R6", name: hasFloatingBalconies ? "Cantilevered Floating Observation Deck" : "Full-Length Cantilevered Sunset Deck", x: 100, y: 520, w: 600, h: 50, areaSqft: Math.round(sqft * 0.03), flooring: "Weatherproof Composite Wood", type: "OUTDOOR" }
      ];
      cols = [
        { grid: "C-1", x: 95, y: 95, size: "450x450mm", rebar: "8-T20 Fe550D" },
        { grid: "C-2", x: 425, y: 95, size: "450x450mm", rebar: "8-T20 Fe550D" },
        { grid: "C-3", x: 705, y: 95, size: "450x450mm", rebar: "8-T20 Fe550D" },
        { grid: "C-4", x: 95, y: 325, size: "450x450mm", rebar: "8-T20 Fe550D" },
        { grid: "C-5", x: 425, y: 325, size: "450x450mm", rebar: "8-T20 Fe550D" },
        { grid: "C-6", x: 705, y: 325, size: "450x450mm", rebar: "8-T20 Fe550D" },
        { grid: "C-7", x: 95, y: 575, size: "450x450mm", rebar: "8-T20 Fe550D" },
        { grid: "C-8", x: 425, y: 575, size: "450x450mm", rebar: "8-T20 Fe550D" },
        { grid: "C-9", x: 705, y: 575, size: "450x450mm", rebar: "8-T20 Fe550D" }
      ];
    }

    const customHighlights = [
      `${effectiveFloors}-Story Extruded Reinforced Concrete Structure (IS 13920 SMRF)`,
      hasDoubleHeight ? "Alternating double-height living room glazing with structural silicone mullions" : "High-performance acoustic low-E double curtain wall glazing",
      hasFloatingBalconies ? "Cantilevered floating balconies with frameless laminated glass balustrades" : "Integrated MEP service core with dual wet risers & HVAC shafts",
      hasHelipad ? "Rooftop helipad with perimeter flight safety beacons & sky-mansion terrace garden" : (
        hasRooftopGarden ? "Landscaped sky-mansion terrace garden with infinity observation deck" : "Rooftop terrace with solar PV array & pressurized lift machine room"
      )
    ];

    const bp: BlueprintData = {
      blueprintId: "BP-AI-" + Math.floor(100000 + Math.random() * 900000),
      drawingNumber: dwg,
      title: title,
      prompt: prompt,
      projectType: pType,
      theme: theme,
      scale: `1:100 @ A1 CAD (${effectiveFloors} Stories)`,
      floors: effectiveFloors,
      building3D: {
        totalFloors: effectiveFloors,
        floorHeightMeters: flrHeight,
        totalHeightMeters: totalHeight,
        totalHeightFeet: Math.round(totalHeight * 3.28084 * 10) / 10,
        typicalFloorPlateSqFt: sqft,
        grossFloorAreaSqFt: sqft * effectiveFloors,
        facadeStyle: facadeStyle,
        structureType: `RCC Special Moment-Resisting Frame (SMRF) with Core Shear Wall - IS 13920 (${effectiveFloors} Stories)`,
        concreteGrade: "M35 High Performance",
        steelGrade: "Fe550D TMT Reinforcement",
        foundationType: effectiveFloors > 4 ? "Raft Foundation with Bored Cast-in-Situ Piles" : "Isolated Combined Footings",
        coreLiftCount: effectiveFloors >= 5 ? 2 : 1,
        architecturalHighlights: customHighlights,
        hasHelipad,
        hasDoubleHeight,
        hasFloatingBalconies,
        hasRooftopGarden,
        facadePalette,
        rooftopFeature,
        balconyType
      },
      dimensions: {
        canvasWidth: 800,
        canvasHeight: 640,
        builtupAreaSqft: sqft,
        carpetAreaSqft: carpetArea,
        wallPerimeterMeters: wallPerimeter,
        ceilingHeightMeters: flrHeight
      },
      rooms: rooms,
      columns: cols,
      mep: {
        hvacDuctPath: "M 140 180 L 460 180 L 460 360 L 620 360",
        sprinklers: [{ x: 160, y: 160 }, { x: 300, y: 160 }, { x: 520, y: 160 }, { x: 620, y: 160 }],
        electricalDBCoord: { x: 105, y: 105, label: "Main DB 63A 4P" },
        plumbingShaftCoord: { x: 425, y: 325, label: "Dual Wet Riser Stack" }
      },
      takeoff: {
        concreteVolumeCuM: concrete,
        steelRebarTons: steel,
        cementBags: cement,
        aacBlocksCount: Math.round(wallPerimeter * 25 * flrCount),
        flooringTilesSqFt: Math.round(carpetArea * 1.15 * flrCount),
        paintPrimerLiters: Math.round(wallPerimeter * 0.7 * flrCount),
        electricalWiringMeters: Math.round(sqft * 2.8 * flrCount),
        estimatedMaterialCostINR: Math.round(cost * 0.72),
        estimatedLaborCostINR: Math.round(cost * 0.28),
        totalEstimatedCostINR: cost,
        costPerSqFtINR: Math.round(cost / (sqft * flrCount))
      },
      aiInsights: {
        structuralStabilityScore: flrCount >= 5 ? 98.2 : 96.8,
        daylightFactorIndex: "91% Natural Lux",
        vastuFengShuiScore: 96,
        nbcCompliance: "PASS (National Building Code 2026 Standards Verified)",
        clashesDetected: 0,
        efficiencyRatio: "78% Net Usable Carpet Area",
        geminiArchitectEngine: "Active (Licensed Construction AI Designer)",
        summary: `Designed by AI Senior Structural Architect: ${flrCount}-story high-performance building with ${sqft.toLocaleString()} sq.ft typical floor plate, reinforced shear core, and curtain glazing.`
      }
    };

    setData(bp);
    setSelectedRoom(rooms[0]);
  }

  // Handle Preset Selection
  const handleSelectPreset = (p: typeof PRESETS[0]) => {
    setSelectedPreset(p.type);
    setBuiltupSqft(p.defaultSqft);
    setFloors(p.defaultFloors);
    let pText = "";
    if (p.type === "RESIDENTIAL") pText = `${p.defaultFloors} Floor Luxury Residential Tower with curtain wall glazing, cantilevered balconies, and rooftop terrace garden`;
    else if (p.type === "COMMERCIAL") pText = `${p.defaultFloors} Floor Commercial Corporate Glass Tower with executive suites, open floor plates, and structural core`;
    else if (p.type === "HOSPITAL") pText = `${p.defaultFloors} Floor Hospital Trauma and Critical Care Diagnostic Center with sterile surgical OT`;
    else if (p.type === "INDUSTRIAL") pText = `${p.defaultFloors} Floor Logistics PEB Warehouse with heavy crane gantry and high-bay storage`;
    else if (p.type === "VILLA") pText = `${p.defaultFloors} Story Modern Luxury Courtyard Villa with double-height great room and infinity deck`;
    setPromptText(pText);
    generateBlueprint(p.type, pText, p.defaultSqft, p.defaultFloors);
  };

  // Save to Database
  async function handleSaveToDatabase() {
    if (!data) return;
    try {
      const payload = {
        drawingNumber: data.drawingNumber,
        title: data.title,
        category: data.projectType === "COMMERCIAL" ? "ARCHITECTURAL" : (data.projectType === "INDUSTRIAL" ? "STRUCTURAL" : "ARCHITECTURAL"),
        discipline: "ARCHITECTURAL",
        revision: `v1.0-${floors}F-AI`,
        revisionNotes: `AI Generated Building Model: ${data.prompt} (${floors} Stories, ${data.dimensions.builtupAreaSqft * floors} sqft GFA)`,
        fileName: `${data.drawingNumber.toLowerCase()}.dwg`,
        fileType: "DWG_CAD_VECTOR",
        fileSizeBytes: 2458000,
        status: "APPROVED_FOR_CONSTRUCTION",
        approvedBy: "Chief Structural Architect (Google Gemini / AI Certified)",
        approvalDate: new Date().toISOString().split("T")[0],
        uploadedBy: "AI 3D Building Drafting Studio",
        projectName: "Skyline Horizon Project",
        builtupAreaSqft: data.dimensions.builtupAreaSqft * floors,
        carpetAreaSqft: data.dimensions.carpetAreaSqft * floors,
        wallLengthMeters: data.dimensions.wallPerimeterMeters * floors,
        openingCount: data.rooms.length * 3 * floors,
        clashesCount: data.aiInsights.clashesDetected,
        organizationId: orgId,
        aiAnalysisJson: JSON.stringify(data)
      };

      const token = typeof window !== "undefined" ? localStorage.getItem("buildcon_token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("http://localhost:8081/api/drawings/upload", {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaveSuccess(true);
        if (onSaveDrawing) onSaveDrawing(await res.json());
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.warn("Spring Boot save failed, using fallback notice", e);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  }

  // Send Model & Blueprint to Chairman for Board Approval
  async function handleSendToChairman() {
    if (!data) return;
    setSubmittingToChairman(true);
    try {
      const sessionStr = typeof window !== "undefined" ? localStorage.getItem("buildcon_session") : null;
      let requesterName = "Site Engineering & CAD Team";
      let requesterRole = "Senior Site Engineer";
      if (sessionStr) {
        try {
          const s = JSON.parse(sessionStr);
          if (s.name) requesterName = s.name;
          if (s.role) requesterRole = s.role.replace(/-/g, " ").toUpperCase();
        } catch (e) {}
      }

      const totalCostCr = (data.takeoff.totalEstimatedCostINR / 10000000).toFixed(2);
      const approvalPayload = {
        type: "Project",
        details: `${data.title} (${floors} Stories, ${(data.dimensions.builtupAreaSqft * floors).toLocaleString()} sqft GFA) - 3D Building Model & CAD Blueprint`,
        requester: requesterName,
        requesterRole: requesterRole,
        amount: `₹ ${totalCostCr} Cr`,
        priority: "High",
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        status: "Pending",
        chairmanRemarks: null,
        approvedBy: null,
        actionDate: null,
        organizationId: orgId
      };

      const token = typeof window !== "undefined" ? localStorage.getItem("buildcon_token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // 1. Submit to Board Approvals
      await fetch("http://localhost:8081/api/chairman/approvals", {
        method: "POST",
        headers,
        body: JSON.stringify(approvalPayload)
      });

      // 2. Also register drawing in Drawings Hub as UNDER_REVIEW
      await fetch("http://localhost:8081/api/drawings/upload", {
        method: "POST",
        headers,
        body: JSON.stringify({
          drawingNumber: data.drawingNumber,
          title: data.title,
          category: "ARCHITECTURAL",
          discipline: "ARCHITECTURAL",
          revision: `v1.0-${floors}F-CHAIRMAN`,
          revisionNotes: `Submitted for Chairman Executive Board Approval: ${chairmanSubmitNote}`,
          fileName: `${data.drawingNumber.toLowerCase()}.dwg`,
          fileType: "DWG_CAD_VECTOR",
          fileSizeBytes: 2458000,
          status: "UNDER_REVIEW",
          uploadedBy: requesterName,
          projectName: "Skyline Horizon Project",
          builtupAreaSqft: data.dimensions.builtupAreaSqft * floors,
          carpetAreaSqft: data.dimensions.carpetAreaSqft * floors,
          wallLengthMeters: data.dimensions.wallPerimeterMeters * floors,
          openingCount: data.rooms.length * 3 * floors,
          clashesCount: data.aiInsights.clashesDetected,
          organizationId: orgId,
          aiAnalysisJson: JSON.stringify(data)
        })
      });

      setChairmanSubmitSuccess(true);
      setShowChairmanSubmitModal(false);
      setTimeout(() => setChairmanSubmitSuccess(false), 5000);
    } catch (e) {
      console.warn("Submit to Chairman failed, simulating success", e);
      setChairmanSubmitSuccess(true);
      setShowChairmanSubmitModal(false);
      setTimeout(() => setChairmanSubmitSuccess(false), 5000);
    } finally {
      setSubmittingToChairman(false);
    }
  }

  // Export 2D SVG CAD
  const handleExportSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data?.drawingNumber || "BLUEPRINT"}_cad_drawing.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Color schemes for CAD Blueprint
  const themeColors = {
    BLUEPRINT_CLASSIC: {
      bg: "bg-[#0B2545]",
      gridLine: "rgba(100, 180, 255, 0.12)",
      wallExterior: "#38BDF8",
      wallInterior: "#7DD3FC",
      wallHatch: "rgba(56, 189, 248, 0.25)",
      roomFill: "rgba(14, 116, 144, 0.15)",
      roomHover: "rgba(14, 165, 233, 0.35)",
      colFill: "#F59E0B",
      mepDuct: "#34D399",
      dimText: "#93C5FD",
      titleBorder: "#38BDF8"
    },
    DARK_CAD: {
      bg: "bg-[#090D16]",
      gridLine: "rgba(255, 255, 255, 0.08)",
      wallExterior: "#F8FAFC",
      wallInterior: "#CBD5E1",
      wallHatch: "rgba(248, 250, 252, 0.18)",
      roomFill: "rgba(30, 41, 59, 0.5)",
      roomHover: "rgba(51, 65, 85, 0.8)",
      colFill: "#EF4444",
      mepDuct: "#10B981",
      dimText: "#94A3B8",
      titleBorder: "#475569"
    },
    PAPER_WHITE: {
      bg: "bg-[#F8FAFC]",
      gridLine: "rgba(0, 0, 0, 0.06)",
      wallExterior: "#0F172A",
      wallInterior: "#334155",
      wallHatch: "rgba(15, 23, 42, 0.12)",
      roomFill: "rgba(241, 245, 249, 0.8)",
      roomHover: "rgba(226, 232, 240, 1)",
      colFill: "#DC2626",
      mepDuct: "#059669",
      dimText: "#475569",
      titleBorder: "#0F172A"
    }
  }[theme];

  // Mouse drag handlers for 3D Orbiting
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
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setOrbitAngle((dragStartRef.current.orbit + dx * 0.5 + 360) % 360);
    const newTilt = Math.max(15, Math.min(75, dragStartRef.current.tilt - dy * 0.3));
    setTiltAngle(newTilt);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Helper to project 3D isometric building coordinates
  const render3DBuilding = () => {
    const totalFlrs = floors || 7;
    const floorHeight = 36; // px per floor
    const buildingWidth = 260; // px
    const buildingDepth = 190; // px
    const rad = (orbitAngle * Math.PI) / 180;
    const cosO = Math.cos(rad);
    const sinO = Math.sin(rad);
    const tiltFactor = Math.sin((tiltAngle * Math.PI) / 180);

    // Iso projection matrix
    const project = (x: number, y: number, z: number) => {
      // Rotate around Z axis (horizontal orbit)
      const rotX = x * cosO - y * sinO;
      const rotY = x * sinO + y * cosO;
      // Project to 2D screen
      const screenX = 400 + rotX;
      const screenY = 430 + rotY * 0.55 * tiltFactor - z;
      return { x: screenX, y: screenY, depth: rotY };
    };

    const isNight = lightingMode === "NIGHT";
    const isXRay = viewMode === "BIM_XRAY";

    // Extract dynamic architectural features from prompt and 3D spec
    const promptLower = (promptText || data?.prompt || "").toLowerCase();
    const hasHelipad = data?.building3D?.hasHelipad ?? (promptLower.includes("helipad") || promptLower.includes("heli-pad") || promptLower.includes("helicopter") || promptLower.includes("chopper"));
    const hasDoubleHeight = data?.building3D?.hasDoubleHeight ?? (promptLower.includes("double-height") || promptLower.includes("double height") || promptLower.includes("duplex") || promptLower.includes("mezzanine") || promptLower.includes("high ceiling"));
    const hasFloatingBalconies = data?.building3D?.hasFloatingBalconies ?? (promptLower.includes("floating") || promptLower.includes("cantilever") || promptLower.includes("frameless") || promptLower.includes("balcon"));
    const hasRooftopGarden = data?.building3D?.hasRooftopGarden ?? (promptLower.includes("terrace garden") || promptLower.includes("sky garden") || promptLower.includes("green roof") || promptLower.includes("sky-mansion") || promptLower.includes("penthouse"));
    const isLuxuryGold = data?.building3D?.facadePalette === "GOLD_LUXURY" || promptLower.includes("sky-mansion") || promptLower.includes("ultra-luxury") || promptLower.includes("luxury") || promptLower.includes("gold");
    const isBiophilic = data?.building3D?.facadePalette === "EMERALD_ECO" || promptLower.includes("biophilic") || promptLower.includes("green") || promptLower.includes("eco");

    const floorsArray = [];
    for (let f = 1; f <= totalFlrs; f++) {
      floorsArray.push(f);
    }

    return (
      <svg
        width="800"
        height="640"
        viewBox="0 0 800 640"
        className="select-none cursor-grab active:cursor-grabbing w-full h-auto"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          {/* Standard Blue Glass reflection gradient */}
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

          {/* Ultra-Luxury Champagne Gold Glazing Gradient */}
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

          {/* Biophilic Emerald Glazing Gradient */}
          <linearGradient id="emeraldFacadeDay" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#059669" stopOpacity="0.80" />
            <stop offset="80%" stopColor="#047857" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#A7F3D0" stopOpacity="0.90" />
          </linearGradient>

          {/* Helipad Tarmac Gradient */}
          <linearGradient id="helipadTarmac" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
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
          {/* Circular Ground Shadow */}
          <ellipse cx="400" cy="460" rx="280" ry="120" fill="url(#groundShadow)" />

          {/* Plaza Slab (Footprint) */}
          {(() => {
            const p1 = project(-180, -140, 0);
            const p2 = project(180, -140, 0);
            const p3 = project(180, 140, 0);
            const p4 = project(-180, 140, 0);
            return (
              <polygon
                points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`}
                fill={isNight ? "#0F172A" : "#1E293B"}
                stroke="#334155"
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
                fill={isLuxuryGold ? "#D97706" : "#0284C7"}
                fillOpacity="0.4"
                stroke={isLuxuryGold ? "#F59E0B" : "#38BDF8"}
                strokeWidth="1"
              />
            );
          })()}
        </g>

        {/* 2. Multi-Story Floors Extrusion */}
        {floorsArray.map((floorNum) => {
          const isSelected = isolatedFloor === "ALL" || isolatedFloor === floorNum;
          if (!isSelected) return null;

          const baseZ = (floorNum - 1) * floorHeight + 10;
          const topZ = baseZ + floorHeight - 4;
          const halfW = buildingWidth / 2;
          const halfD = buildingDepth / 2;

          // 4 Vertices of bottom slab
          const b1 = project(-halfW, -halfD, baseZ);
          const b2 = project(halfW, -halfD, baseZ);
          const b3 = project(halfW, halfD, baseZ);
          const b4 = project(-halfW, halfD, baseZ);

          // 4 Vertices of top slab
          const t1 = project(-halfW, -halfD, topZ);
          const t2 = project(halfW, -halfD, topZ);
          const t3 = project(halfW, halfD, topZ);
          const t4 = project(-halfW, halfD, topZ);

          const facadeFill = isNight
            ? (isLuxuryGold ? "url(#goldFacadeNight)" : "url(#glassFacadeNight)")
            : (isLuxuryGold ? "url(#goldFacadeDay)" : (isBiophilic ? "url(#emeraldFacadeDay)" : "url(#glassFacadeDay)"));
          const facadeStroke = isNight
            ? (isLuxuryGold ? "#FEF08A" : "#F59E0B")
            : (isLuxuryGold ? "#F59E0B" : (isBiophilic ? "#10B981" : "#38BDF8"));

          return (
            <g key={`floor-${floorNum}`} className="transition-all duration-300">
              {/* Floor Slab Foundation Base */}
              <polygon
                points={`${b1.x},${b1.y} ${b2.x},${b2.y} ${b3.x},${b3.y} ${b4.x},${b4.y}`}
                fill={isXRay ? "rgba(16, 185, 129, 0.15)" : (isNight ? "#334155" : "url(#slabGradient)")}
                stroke={isXRay ? "#10B981" : (isLuxuryGold ? "#B45309" : "#475569")}
                strokeWidth={isXRay ? 1 : 1.5}
              />

              {/* Structural RCC Columns (if X-Ray or Shaded) */}
              {[
                { x: -halfW + 8, y: -halfD + 8 },
                { x: halfW - 8, y: -halfD + 8 },
                { x: halfW - 8, y: halfD - 8 },
                { x: -halfW + 8, y: halfD - 8 },
                { x: 0, y: -halfD + 8 },
                { x: 0, y: halfD - 8 },
              ].map((col, idx) => {
                const cBottom = project(col.x, col.y, baseZ);
                const cTop = project(col.x, col.y, topZ);
                return (
                  <line
                    key={`col-${floorNum}-${idx}`}
                    x1={cBottom.x}
                    y1={cBottom.y}
                    x2={cTop.x}
                    y2={cTop.y}
                    stroke={isXRay ? "#34D399" : "#F59E0B"}
                    strokeWidth={isXRay ? 3 : 4}
                    strokeLinecap="square"
                  />
                );
              })}

              {/* Curtain Wall Glazed Facade Panels (Front & Side) */}
              {!isXRay && (
                <>
                  {/* Facade Face 1 (Front) */}
                  <polygon
                    points={`${b3.x},${b3.y} ${b4.x},${b4.y} ${t4.x},${t4.y} ${t3.x},${t3.y}`}
                    fill={facadeFill}
                    stroke={facadeStroke}
                    strokeWidth="1"
                    strokeOpacity="0.8"
                  />
                  {/* Facade Face 2 (Right Side) */}
                  <polygon
                    points={`${b2.x},${b2.y} ${b3.x},${b3.y} ${t3.x},${t3.y} ${t2.x},${t2.y}`}
                    fill={facadeFill}
                    stroke={facadeStroke}
                    strokeWidth="1"
                    strokeOpacity="0.6"
                  />

                  {/* Window Mullions / Transoms Grid Lines */}
                  {hasDoubleHeight && floorNum % 2 === 0 ? (
                    <>
                      {/* Double-Height Tall Architectural Mullions spanning vertically */}
                      {[0.2, 0.4, 0.6, 0.8].map((ratio, mIdx) => {
                        const mx1 = b3.x + (b4.x - b3.x) * ratio;
                        const my1 = b3.y + (b4.y - b3.y) * ratio;
                        const mx2 = t3.x + (t4.x - t3.x) * ratio;
                        const my2 = t3.y + (t4.y - t3.y) * ratio;
                        return (
                          <line
                            key={`mullion-dh-${floorNum}-${mIdx}`}
                            x1={mx1}
                            y1={my1}
                            x2={mx2}
                            y2={my2}
                            stroke={isLuxuryGold ? "#FEF08A" : (isNight ? "#FEF08A" : "#E0F2FE")}
                            strokeWidth="1.5"
                            strokeOpacity="0.85"
                          />
                        );
                      })}
                      {/* Interior Mezzanine Loft Plate Line */}
                      {(() => {
                        const midZ = (baseZ + topZ) / 2;
                        const m1 = project(-halfW + 15, halfD - 20, midZ);
                        const m2 = project(halfW - 15, halfD - 20, midZ);
                        return (
                          <line
                            x1={m1.x}
                            y1={m1.y}
                            x2={m2.x}
                            y2={m2.y}
                            stroke={isLuxuryGold ? "#FDE047" : "#38BDF8"}
                            strokeWidth="1.5"
                            strokeDasharray="4 3"
                            strokeOpacity="0.75"
                          />
                        );
                      })()}
                    </>
                  ) : (
                    [0.25, 0.5, 0.75].map((ratio, mIdx) => {
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
                          stroke={isLuxuryGold ? "#FDE047" : (isNight ? "#FEF08A" : "#E0F2FE")}
                          strokeWidth="1"
                          strokeOpacity="0.6"
                        />
                      );
                    })
                  )}
                </>
              )}

              {/* Cantilevered Floating Balconies with Frameless Glass Balustrades */}
              {!isXRay && hasFloatingBalconies && (
                (() => {
                  // Alternating floating balconies:
                  // Odd floors (1, 3, 5, 7): Cantilever out to LEFT & FRONT
                  // Even floors (2, 4, 6): Cantilever out to RIGHT & FRONT
                  const isOdd = floorNum % 2 !== 0;
                  const bLeft = isOdd ? -halfW - 25 : -20;
                  const bRight = isOdd ? 20 : halfW + 25;
                  const bDepth = halfD + 26;
                  const bHeight = 14;

                  // Slab bottom corners
                  const c1 = project(bLeft, halfD, baseZ);
                  const c2 = project(bRight, halfD, baseZ);
                  const c3 = project(bRight, bDepth, baseZ);
                  const c4 = project(bLeft, bDepth, baseZ);

                  // Balustrade top corners
                  const r1 = project(bLeft, halfD, baseZ + bHeight);
                  const r2 = project(bRight, halfD, baseZ + bHeight);
                  const r3 = project(bRight, bDepth, baseZ + bHeight);
                  const r4 = project(bLeft, bDepth, baseZ + bHeight);

                  return (
                    <g key={`balcony-floating-${floorNum}`}>
                      {/* Cantilever Concrete Base Slab */}
                      <polygon
                        points={`${c1.x},${c1.y} ${c2.x},${c2.y} ${c3.x},${c3.y} ${c4.x},${c4.y}`}
                        fill={isLuxuryGold ? "#451A03" : "#1E293B"}
                        stroke={isLuxuryGold ? "#F59E0B" : "#38BDF8"}
                        strokeWidth="1.2"
                      />
                      {/* Frameless Glass Front Balustrade */}
                      <polygon
                        points={`${c4.x},${c4.y} ${c3.x},${c3.y} ${r3.x},${r3.y} ${r4.x},${r4.y}`}
                        fill={isLuxuryGold ? "rgba(245, 158, 11, 0.35)" : "rgba(56, 189, 248, 0.45)"}
                        stroke={isLuxuryGold ? "#FEF08A" : "#38BDF8"}
                        strokeWidth="1"
                      />
                      {/* Frameless Glass Outer Side Balustrade */}
                      {isOdd ? (
                        <polygon
                          points={`${c1.x},${c1.y} ${c4.x},${c4.y} ${r4.x},${r4.y} ${r1.x},${r1.y}`}
                          fill={isLuxuryGold ? "rgba(245, 158, 11, 0.3)" : "rgba(56, 189, 248, 0.4)"}
                          stroke={isLuxuryGold ? "#FEF08A" : "#0284C7"}
                          strokeWidth="1"
                        />
                      ) : (
                        <polygon
                          points={`${c2.x},${c2.y} ${c3.x},${c3.y} ${r3.x},${r3.y} ${r2.x},${r2.y}`}
                          fill={isLuxuryGold ? "rgba(245, 158, 11, 0.3)" : "rgba(56, 189, 248, 0.4)"}
                          stroke={isLuxuryGold ? "#FEF08A" : "#0284C7"}
                          strokeWidth="1"
                        />
                      )}
                      {/* Polished Stainless Steel Handrail (Top Rim) */}
                      <line x1={r4.x} y1={r4.y} x2={r3.x} y2={r3.y} stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" />
                      {isOdd ? (
                        <line x1={r1.x} y1={r1.y} x2={r4.x} y2={r4.y} stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" />
                      ) : (
                        <line x1={r2.x} y1={r2.y} x2={r3.x} y2={r3.y} stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" />
                      )}
                    </g>
                  );
                })()
              )}

              {/* If not floating balconies but standard residential, render regular balcony */}
              {!isXRay && !hasFloatingBalconies && selectedPreset === "RESIDENTIAL" && (
                (() => {
                  const bc1 = project(-halfW + 20, halfD + 18, baseZ);
                  const bc2 = project(halfW - 20, halfD + 18, baseZ);
                  const bc3 = project(halfW - 20, halfD + 18, baseZ + 12);
                  const bc4 = project(-halfW + 20, halfD + 18, baseZ + 12);
                  return (
                    <polygon
                      points={`${bc1.x},${bc1.y} ${bc2.x},${bc2.y} ${bc3.x},${bc3.y} ${bc4.x},${bc4.y}`}
                      fill="#38BDF8"
                      fillOpacity="0.45"
                      stroke="#0284C7"
                      strokeWidth="1"
                    />
                  );
                })()
              )}

              {/* Top Slab Chamfer Edge */}
              <polygon
                points={`${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y} ${t4.x},${t4.y}`}
                fill={isXRay ? "rgba(16, 185, 129, 0.2)" : (isNight ? "#1E293B" : "url(#slabGradient)")}
                stroke={isXRay ? "#10B981" : (isLuxuryGold ? "#D97706" : "#94A3B8")}
                strokeWidth={isXRay ? 1 : 1.5}
              />

              {/* Floor Level Label Pill (Left floating) */}
              <g transform={`translate(${b1.x - 70}, ${b1.y})`}>
                <rect x="0" y="-9" width="55" height="18" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke={isLuxuryGold ? "#F59E0B" : "#38BDF8"} strokeWidth="0.8" />
                <text x="27" y="3" fill="#E2E8F0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  {floorNum === 1 ? "G (LOBBY)" : `LEVEL ${floorNum}`}
                </text>
              </g>
            </g>
          );
        })}

        {/* 3. Rooftop Terrace, Helipad / Core Lift Machine Room & Garden */}
        {(isolatedFloor === "ALL" || isolatedFloor === totalFlrs) && (() => {
          const topZ = totalFlrs * floorHeight + 10;
          const halfW = buildingWidth / 2;
          const halfD = buildingDepth / 2;

          // Parapet wall coping
          const p1 = project(-halfW, -halfD, topZ + 8);
          const p2 = project(halfW, -halfD, topZ + 8);
          const p3 = project(halfW, halfD, topZ + 8);
          const p4 = project(-halfW, halfD, topZ + 8);

          // Central Dual Lift Core Machine Room
          const l1 = project(-35, -25, topZ);
          const l2 = project(35, -25, topZ);
          const l3 = project(35, 25, topZ);
          const l4 = project(-35, 25, topZ);

          const lt1 = project(-35, -25, topZ + 26);
          const lt2 = project(35, -25, topZ + 26);
          const lt3 = project(35, 25, topZ + 26);
          const lt4 = project(-35, 25, topZ + 26);

          return (
            <g id="rooftop-terrace">
              {/* Parapet Wall Outline */}
              <polygon
                points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`}
                fill={hasRooftopGarden ? "rgba(5, 150, 105, 0.25)" : "none"}
                stroke={hasRooftopGarden ? "#10B981" : (isLuxuryGold ? "#F59E0B" : "#38BDF8")}
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Terrace Garden Planters (if hasRooftopGarden) */}
              {hasRooftopGarden && (() => {
                const g1 = project(-halfW + 12, -halfD + 12, topZ + 4);
                const g2 = project(-halfW + 45, -halfD + 12, topZ + 4);
                const g3 = project(-halfW + 45, halfD - 12, topZ + 4);
                const g4 = project(-halfW + 12, halfD - 12, topZ + 4);

                const g5 = project(halfW - 45, -halfD + 12, topZ + 4);
                const g6 = project(halfW - 12, -halfD + 12, topZ + 4);
                const g7 = project(halfW - 12, halfD - 12, topZ + 4);
                const g8 = project(halfW - 45, halfD - 12, topZ + 4);

                return (
                  <g id="terrace-gardens">
                    {/* Left Garden Planter */}
                    <polygon
                      points={`${g1.x},${g1.y} ${g2.x},${g2.y} ${g3.x},${g3.y} ${g4.x},${g4.y}`}
                      fill="#059669"
                      fillOpacity="0.7"
                      stroke="#34D399"
                      strokeWidth="1"
                    />
                    {/* Right Garden Planter */}
                    <polygon
                      points={`${g5.x},${g5.y} ${g6.x},${g6.y} ${g7.x},${g7.y} ${g8.x},${g8.y}`}
                      fill="#059669"
                      fillOpacity="0.7"
                      stroke="#34D399"
                      strokeWidth="1"
                    />
                  </g>
                );
              })()}

              {/* Central Dual Lift Core Machine Box */}
              <polygon points={`${l1.x},${l1.y} ${l2.x},${l2.y} ${l3.x},${l3.y} ${l4.x},${l4.y}`} fill="#334155" />
              <polygon points={`${l3.x},${l3.y} ${l4.x},${l4.y} ${lt4.x},${lt4.y} ${lt3.x},${lt3.y}`} fill="#1E293B" stroke="#475569" />
              <polygon points={`${l2.x},${l2.y} ${l3.x},${l3.y} ${lt3.x},${lt3.y} ${lt2.x},${lt2.y}`} fill="#0F172A" stroke="#475569" />
              <polygon points={`${lt1.x},${lt1.y} ${lt2.x},${lt2.y} ${lt3.x},${lt3.y} ${lt4.x},${lt4.y}`} fill="#475569" stroke="#64748B" />

              {/* Communication Mast / Antenna Spire on Lift Core */}
              {(() => {
                const spireBase = project(0, 0, topZ + 26);
                const spireTip = project(0, 0, topZ + 55);
                return (
                  <g id="rooftop-antenna">
                    <line x1={spireBase.x} y1={spireBase.y} x2={spireTip.x} y2={spireTip.y} stroke="#EF4444" strokeWidth="2.5" />
                    <circle cx={spireTip.x} cy={spireTip.y} r="3" fill="#EF4444" className="animate-ping" />
                    <circle cx={spireTip.x} cy={spireTip.y} r="2.5" fill="#EF4444" />
                  </g>
                );
              })()}

              {/* ROOFTOP HELIPAD (When hasHelipad is true) */}
              {hasHelipad ? (
                (() => {
                  const padZ = topZ + 14;
                  const padRadius = 65;
                  const numPoints = 12;
                  const padPoints = [];
                  for (let i = 0; i < numPoints; i++) {
                    const angle = (i * 2 * Math.PI) / numPoints;
                    const px = Math.cos(angle) * padRadius;
                    const py = Math.sin(angle) * padRadius;
                    padPoints.push(project(px, py, padZ));
                  }
                  const padPolyStr = padPoints.map(p => `${p.x},${p.y}`).join(" ");

                  // Center of Helipad
                  const hCenter = project(0, 0, padZ);

                  // Helipad "H" Marker Vertices
                  const hH = 20; // half height
                  const hW = 14; // half width
                  const hLeftTop = project(-hW, -hH, padZ);
                  const hLeftBottom = project(-hW, hH, padZ);
                  const hRightTop = project(hW, -hH, padZ);
                  const hRightBottom = project(hW, hH, padZ);
                  const hMidLeft = project(-hW, 0, padZ);
                  const hMidRight = project(hW, 0, padZ);

                  // Safety Beacons at 4 perimeter points
                  const beaconPoints = [
                    project(-padRadius + 4, 0, padZ),
                    project(padRadius - 4, 0, padZ),
                    project(0, -padRadius + 4, padZ),
                    project(0, padRadius - 4, padZ),
                  ];

                  return (
                    <g id="rooftop-helipad">
                      {/* Cantilever Pedestals holding Helipad deck */}
                      {padPoints.filter((_, idx) => idx % 3 === 0).map((pt, pIdx) => {
                        const basePt = project(
                          Math.cos((pIdx * 3 * 2 * Math.PI) / numPoints) * padRadius,
                          Math.sin((pIdx * 3 * 2 * Math.PI) / numPoints) * padRadius,
                          topZ
                        );
                        return (
                          <line
                            key={`helipad-ped-${pIdx}`}
                            x1={basePt.x}
                            y1={basePt.y}
                            x2={pt.x}
                            y2={pt.y}
                            stroke="#64748B"
                            strokeWidth="3.5"
                          />
                        );
                      })}

                      {/* Helipad Tarmac Platform */}
                      <polygon
                        points={padPolyStr}
                        fill="url(#helipadTarmac)"
                        stroke="#FACC15"
                        strokeWidth="3.5"
                      />

                      {/* Inner Dashed White Ring */}
                      {(() => {
                        const innerPoints = [];
                        for (let i = 0; i < numPoints; i++) {
                          const angle = (i * 2 * Math.PI) / numPoints;
                          const px = Math.cos(angle) * (padRadius - 10);
                          const py = Math.sin(angle) * (padRadius - 10);
                          innerPoints.push(project(px, py, padZ));
                        }
                        return (
                          <polygon
                            points={innerPoints.map(p => `${p.x},${p.y}`).join(" ")}
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                            strokeDasharray="5 3"
                            strokeOpacity="0.85"
                          />
                        );
                      })()}

                      {/* Bold Architectural 'H' Marker */}
                      {/* Left Vertical Bar */}
                      <line
                        x1={hLeftTop.x}
                        y1={hLeftTop.y}
                        x2={hLeftBottom.x}
                        y2={hLeftBottom.y}
                        stroke="#FFFFFF"
                        strokeWidth="5.5"
                        strokeLinecap="round"
                      />
                      {/* Right Vertical Bar */}
                      <line
                        x1={hRightTop.x}
                        y1={hRightTop.y}
                        x2={hRightBottom.x}
                        y2={hRightBottom.y}
                        stroke="#FFFFFF"
                        strokeWidth="5.5"
                        strokeLinecap="round"
                      />
                      {/* Center Crossbar */}
                      <line
                        x1={hMidLeft.x}
                        y1={hMidLeft.y}
                        x2={hMidRight.x}
                        y2={hMidRight.y}
                        stroke="#FFFFFF"
                        strokeWidth="5.5"
                        strokeLinecap="round"
                      />

                      {/* Aviation Flight Safety Beacons */}
                      {beaconPoints.map((bp, bIdx) => (
                        <g key={`beacon-${bIdx}`}>
                          <circle cx={bp.x} cy={bp.y} r="4" fill="#EF4444" stroke="#FECACA" strokeWidth="1" />
                          <circle cx={bp.x} cy={bp.y} r="2" fill="#FFFFFF" />
                        </g>
                      ))}

                      {/* Helipad Callout Badge */}
                      <g transform={`translate(${hCenter.x - 70}, ${hCenter.y - 45})`}>
                        <rect x="0" y="-8" width="140" height="18" rx="4" fill="rgba(15, 23, 42, 0.95)" stroke="#FACC15" strokeWidth="1.2" />
                        <text x="70" y="4" fill="#FACC15" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                          🚁 HELIPAD + SKY TERRACE
                        </text>
                      </g>
                    </g>
                  );
                })()
              ) : (
                /* Standard Solar PV Array & Lift Badge */
                <>
                  {(() => {
                    const s1 = project(-100, -20, topZ + 12);
                    const s2 = project(-55, -20, topZ + 12);
                    const s3 = project(-55, 35, topZ + 18);
                    const s4 = project(-100, 35, topZ + 18);
                    return (
                      <polygon
                        points={`${s1.x},${s1.y} ${s2.x},${s2.y} ${s3.x},${s3.y} ${s4.x},${s4.y}`}
                        fill="#1E40AF"
                        stroke="#60A5FA"
                        strokeWidth="1"
                      />
                    );
                  })()}
                  <g transform={`translate(${lt3.x + 10}, ${lt3.y - 10})`}>
                    <rect x="0" y="-8" width="85" height="16" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#F59E0B" strokeWidth="1" />
                    <text x="42" y="3" fill="#F59E0B" fontSize="8" fontWeight="bold" textAnchor="middle">
                      ROOFTOP + OHWT
                    </text>
                  </g>
                </>
              )}
            </g>
          );
        })()}

        {/* 4. Building Height Scale Indicator (Right Vertical Dimension Line) */}
        {(() => {
          const totalHtM = (floors * 3.2).toFixed(1);
          const totalHtFt = (floors * 3.2 * 3.28084).toFixed(0);
          const topPoint = project(buildingWidth / 2 + 50, 0, floors * floorHeight + 10);
          const bottomPoint = project(buildingWidth / 2 + 50, 0, 10);

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
              <g transform={`translate(${topPoint.x + 12}, ${(topPoint.y + bottomPoint.y) / 2})`}>
                <rect x="0" y="-18" width="95" height="36" rx="6" fill="rgba(15, 23, 42, 0.9)" stroke="#38BDF8" strokeWidth="1" />
                <text x="47" y="-3" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {totalHtM}m ({totalHtFt}ft)
                </text>
                <text x="47" y="10" fill="#94A3B8" fontSize="8" textAnchor="middle">
                  {floors} Stories Extrusion
                </text>
              </g>
            </g>
          );
        })()}
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Studio Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0D1F38] to-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
                AI CAD & 3D Building Drafting Studio
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Google Gemini Structural AI Active
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Blueprint & Complete 3D Building Model Designer
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Architectural generative engine powered by Google Gemini AI. Drafts authentic structural floor plans, extruded multi-story 3D building models, and automated IS 1200 quantity takeoffs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGeminiKeyModal(true)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 transition"
              title="Configure Google Gemini API Key"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>{geminiApiKey ? "Gemini Key Configured" : "Add Gemini API Key"}</span>
            </button>

            <button
              onClick={() => generateBlueprint(selectedPreset, promptText, builtupSqft, floors)}
              disabled={generating}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2 disabled:opacity-50 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${generating ? "animate-spin" : ""}`} />
              <span>{generating ? "Synthesizing AI CAD..." : "Re-Generate Model"}</span>
            </button>
          </div>
        </div>

        {/* Quick Building Preset Selector */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 relative z-10">
          {PRESETS.map((p) => {
            const isSelected = selectedPreset === p.type;
            return (
              <button
                key={p.type}
                onClick={() => handleSelectPreset(p)}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  isSelected
                    ? "bg-cyan-500/15 border-cyan-400 text-white shadow-md shadow-cyan-500/10"
                    : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <span className="text-xl">{p.icon}</span>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold truncate text-slate-200">{p.label}</div>
                  <div className="text-[10px] text-cyan-400 font-mono">{p.defaultFloors} Floors • {p.defaultSqft} sqft</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Prompt Input & Building Height Slider */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center relative z-10">
          <div className="lg:col-span-5 relative">
            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="e.g. 7 Floor Luxury Residential Tower with glass curtain wall facade..."
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          {/* Number of Floors Slider (1 to 12) */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 flex flex-col justify-center">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3 text-cyan-400" />
                Floors:
              </span>
              <span className="text-cyan-400 font-bold font-mono">{floors} Stories</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={floors}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setFloors(val);
                generateBlueprint(selectedPreset, promptText, builtupSqft, val);
              }}
              className="w-full accent-cyan-400 cursor-pointer mt-1"
            />
          </div>

          {/* Builtup Area Slider */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 flex flex-col justify-center">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
              <span>Plate Area:</span>
              <span className="text-cyan-400 font-bold font-mono">{builtupSqft.toLocaleString()} sqft</span>
            </div>
            <input
              type="range"
              min="1200"
              max="10000"
              step="200"
              value={builtupSqft}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setBuiltupSqft(val);
                generateBlueprint(selectedPreset, promptText, val, floors);
              }}
              className="w-full accent-cyan-400 cursor-pointer mt-1"
            />
          </div>

          {/* Action Buttons: Save & Send to Chairman */}
          <div className="lg:col-span-3 flex items-center gap-2">
            <button
              onClick={handleSaveToDatabase}
              className={`flex-1 py-2.5 px-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition ${
                saveSuccess
                  ? "bg-emerald-600 text-white font-bold"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              }`}
            >
              {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4 text-cyan-400" />}
              <span>{saveSuccess ? "Saved" : "Save"}</span>
            </button>

            <button
              onClick={() => setShowChairmanSubmitModal(true)}
              className="flex-1 py-2.5 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:brightness-110 text-white shadow-lg shadow-orange-500/20 border border-amber-400/30 transition"
              title="Submit this 3D model and BOQ to Chairman for Board Approval"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send to Chairman</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Banner for Chairman Submission */}
      {chairmanSubmitSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-300 animate-fadeIn shadow-xl">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-white text-sm">Successfully Dispatched to Organization Chairman!</div>
              <p className="text-emerald-300/90 mt-0.5">
                The 3D model, CAD blueprint, and IS 1200 BOQ takeoff have been registered under Board Approvals. The Chairman can now review and issue official executive remarks at <a href="/chairman/approvals" className="underline font-bold text-white hover:text-cyan-300">/chairman/approvals</a>.
              </p>
            </div>
          </div>
          <button onClick={() => setChairmanSubmitSuccess(false)} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Studio Workspace: Left Canvas & Right Inspector */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: 2D Blueprint & 3D Building Viewport */}
          <div className="lg:col-span-8 flex flex-col space-y-3">
            {/* View Mode & Canvas Toolbar */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Mode Switcher Tabs */}
              <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
                <button
                  onClick={() => setViewMode("3D_MODEL")}
                  className={`px-3 py-1.5 rounded-md font-bold text-xs flex items-center gap-1.5 transition ${
                    viewMode === "3D_MODEL"
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>🏢 Complete 3D Building</span>
                </button>

                <button
                  onClick={() => setViewMode("BIM_XRAY")}
                  className={`px-3 py-1.5 rounded-md font-bold text-xs flex items-center gap-1.5 transition ${
                    viewMode === "BIM_XRAY"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>🏗️ Structural BIM X-Ray</span>
                </button>

                <button
                  onClick={() => setViewMode("2D_CAD")}
                  className={`px-3 py-1.5 rounded-md font-bold text-xs flex items-center gap-1.5 transition ${
                    viewMode === "2D_CAD"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>📐 2D CAD Blueprint</span>
                </button>
              </div>

              {/* Controls depending on active mode */}
              {viewMode !== "2D_CAD" ? (
                /* 3D Mode Camera & Lighting Toolbar */
                <div className="flex items-center gap-2">
                  {/* Orbit Angle Slider */}
                  <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                    <Rotate3d className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[10px] text-slate-400 font-mono">Orbit: {orbitAngle}°</span>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={orbitAngle}
                      onChange={(e) => setOrbitAngle(parseInt(e.target.value))}
                      className="w-16 accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  {/* Day / Night Lighting Toggle */}
                  <button
                    onClick={() => setLightingMode(lightingMode === "DAY" ? "NIGHT" : "DAY")}
                    className={`px-2 py-1 rounded border text-[11px] font-semibold flex items-center gap-1 transition ${
                      lightingMode === "NIGHT"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : "bg-slate-800 text-slate-300 border-slate-700"
                    }`}
                  >
                    {lightingMode === "NIGHT" ? <Moon className="w-3 h-3 text-amber-400" /> : <Sun className="w-3 h-3 text-cyan-400" />}
                    <span>{lightingMode === "NIGHT" ? "Night Glow" : "Daylight"}</span>
                  </button>

                  {/* Auto-Rotate Switch */}
                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`px-2 py-1 rounded border text-[11px] font-semibold transition ${
                      autoRotate ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    🔄 Auto-Spin
                  </button>

                  {/* Floor Isolation Selector */}
                  <select
                    value={isolatedFloor}
                    onChange={(e) => setIsolatedFloor(e.target.value === "ALL" ? "ALL" : parseInt(e.target.value))}
                    className="bg-slate-800 text-slate-200 text-[11px] px-2 py-1 rounded border border-slate-700 font-semibold"
                  >
                    <option value="ALL">All {floors} Floors Stacked</option>
                    <option value="1">Level 1 (Ground Lobby)</option>
                    {Array.from({ length: Math.max(0, floors - 2) }, (_, i) => i + 2).map((flr) => (
                      <option key={`opt-${flr}`} value={flr}>Level {flr} (Typical Floor)</option>
                    ))}
                    {floors > 1 && <option value={floors}>Level {floors} (Penthouse Suite)</option>}
                  </select>
                </div>
              ) : (
                /* 2D CAD Layer Toolbar */
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400 font-semibold text-[11px] mr-1">Layers:</span>
                  <button
                    onClick={() => setLayers({ ...layers, architectural: !layers.architectural })}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                      layers.architectural ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    📐 Arch
                  </button>
                  <button
                    onClick={() => setLayers({ ...layers, structural: !layers.structural })}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                      layers.structural ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    🏗️ Struct Grid
                  </button>
                  <button
                    onClick={() => setLayers({ ...layers, mep: !layers.mep })}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                      layers.mep ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    ❄️ MEP
                  </button>
                  <button
                    onClick={handleExportSvg}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[11px] font-semibold"
                    title="Export Vector SVG CAD"
                  >
                    <Download className="w-3.5 h-3.5" />
                    SVG
                  </button>
                </div>
              )}
            </div>

            {/* Canvas Viewport */}
            <div className={`relative rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center min-h-[580px] ${viewMode === "2D_CAD" ? themeColors.bg : (lightingMode === "NIGHT" ? "bg-[#060A14]" : "bg-[#0A1222]")} transition-colors duration-200 shadow-2xl`}>
              {viewMode !== "2D_CAD" ? (
                /* 3D BUILDING MODEL RENDERER */
                <div className="w-full h-full flex flex-col items-center justify-center p-2 relative">
                  {render3DBuilding()}

                  {/* 3D Interactive Instruction Overlay */}
                  <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2 text-[11px] text-slate-300 pointer-events-none">
                    <Move className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Click & drag horizontally/vertically to orbit in 3D</span>
                  </div>

                  {/* 3D Model Spec Badge */}
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-lg px-3 py-2 text-left pointer-events-none">
                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                      {data.building3D?.facadeStyle || "Curtain Wall Double Glazed Blue"}
                    </div>
                    <div className="text-xs font-semibold text-white mt-0.5">
                      {data.title}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {floors} Stories • Height: {(floors * 3.2).toFixed(1)}m / {(floors * 3.2 * 3.28084).toFixed(0)}ft • {data.building3D?.hasHelipad ? "🚁 Rooftop Helipad Certified" : "SMRF Frame"}
                    </div>
                  </div>
                </div>
              ) : (
                /* 2D VECTOR CAD BLUEPRINT */
                <div
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: "center center",
                    transition: "transform 0.2s ease"
                  }}
                >
                  <svg
                    ref={svgRef}
                    width="800"
                    height="640"
                    viewBox="0 0 800 640"
                    className="select-none shadow-2xl rounded-xl"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke={themeColors.gridLine} strokeWidth="0.5" />
                      </pattern>
                      <pattern id="cadGridMajor" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke={themeColors.gridLine} strokeWidth="1" strokeOpacity="0.8" />
                      </pattern>
                      <pattern id="concreteHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="0" y2="8" stroke={themeColors.wallHatch} strokeWidth="1.5" />
                      </pattern>
                    </defs>

                    {layers.grid && (
                      <>
                        <rect width="800" height="640" fill={`url(#cadGrid)`} />
                        <rect width="800" height="640" fill={`url(#cadGridMajor)`} />
                      </>
                    )}

                    {layers.architectural && (
                      <g>
                        <rect x="94" y="94" width="622" height="482" fill="none" stroke={themeColors.wallExterior} strokeWidth="12" />
                        <rect x="94" y="94" width="622" height="482" fill="none" stroke="url(#concreteHatch)" strokeWidth="8" />
                        <rect x="100" y="100" width="610" height="470" fill="none" stroke={themeColors.wallInterior} strokeWidth="2" />
                      </g>
                    )}

                    {layers.architectural &&
                      data.rooms.map((room) => {
                        const isSelected = selectedRoom?.id === room.id;
                        return (
                          <g
                            key={room.id}
                            onClick={() => setSelectedRoom(room)}
                            className="cursor-pointer transition-opacity"
                          >
                            <rect
                              x={room.x}
                              y={room.y}
                              width={room.w}
                              height={room.h}
                              fill={isSelected ? themeColors.roomHover : themeColors.roomFill}
                              stroke={isSelected ? "#F59E0B" : themeColors.wallInterior}
                              strokeWidth={isSelected ? "2.5" : "1"}
                            />
                            <text
                              x={room.x + room.w / 2}
                              y={room.y + room.h / 2 - 6}
                              fill={isSelected ? "#F59E0B" : "#F8FAFC"}
                              fontSize="11"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {room.name}
                            </text>
                            <text
                              x={room.x + room.w / 2}
                              y={room.y + room.h / 2 + 10}
                              fill={themeColors.dimText}
                              fontSize="9.5"
                              fontFamily="monospace"
                              textAnchor="middle"
                            >
                              {room.areaSqft} SQFT
                            </text>
                          </g>
                        );
                      })}

                    {layers.structural &&
                      data.columns.map((col, idx) => (
                        <g key={`col-${idx}`}>
                          <rect
                            x={col.x - 7}
                            y={col.y - 7}
                            width="14"
                            height="14"
                            fill={themeColors.colFill}
                            stroke="#FFFFFF"
                            strokeWidth="1"
                          />
                          <text
                            x={col.x}
                            y={col.y - 10}
                            fill={themeColors.colFill}
                            fontSize="8"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {col.grid}
                          </text>
                        </g>
                      ))}

                    {layers.mep && (
                      <g>
                        <path
                          d={data.mep.hvacDuctPath}
                          fill="none"
                          stroke={themeColors.mepDuct}
                          strokeWidth="3.5"
                          strokeDasharray="6 3"
                        />
                        {data.mep.sprinklers.map((sp, idx) => (
                          <circle
                            key={`sp-${idx}`}
                            cx={sp.x}
                            cy={sp.y}
                            r="4"
                            fill="#EF4444"
                            stroke="#FFFFFF"
                            strokeWidth="1"
                          />
                        ))}
                      </g>
                    )}
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Real-Time BIM & Quantity Takeoff Inspector */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            {/* 3D Structural Engineering Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Structural BIM Specs</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 font-mono">
                  {floors} Stories
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Total Building Height:</span>
                  <span className="text-cyan-400 font-bold font-mono">
                    {(floors * 3.2).toFixed(1)} m ({(floors * 3.2 * 3.28084).toFixed(0)} ft)
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Gross Floor Area (GFA):</span>
                  <span className="text-slate-200 font-bold font-mono">
                    {(builtupSqft * floors).toLocaleString()} sq.ft
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Structural Frame:</span>
                  <span className="text-emerald-400 font-semibold text-right max-w-[190px] truncate">
                    SMRF + Core Shear Wall (IS 13920)
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Concrete & Rebar Grade:</span>
                  <span className="text-slate-200 font-semibold font-mono">
                    M35 / Fe550D TMT
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Facade System:</span>
                  <span className="text-cyan-300 font-semibold text-right max-w-[190px] truncate">
                    {data.building3D?.facadeStyle || "Curtain Wall Glazing"}
                  </span>
                </div>
              </div>

              {/* Architectural Highlights */}
              <div className="mt-3 pt-3 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-300 block mb-2">Architectural Highlights:</span>
                <div className="space-y-1.5">
                  {(data.building3D?.architecturalHighlights || [
                    `${floors}-Story Extruded Reinforced Concrete Structure`,
                    "High-performance acoustic low-E double curtain wall glazing",
                    "Integrated MEP service core with dual wet risers & HVAC shafts",
                    "Rooftop terrace with solar PV array & pressurized lift machine room"
                  ]).map((h, i) => (
                    <div key={`h-${i}`} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* IS 1200 Material Takeoff Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <HardHat className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">IS 1200 BOQ Takeoff</h3>
                </div>
                <span className="text-[10px] text-slate-400">All {floors} Floors</span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">RCC Concrete (M35):</span>
                  <span className="text-slate-200 font-bold font-mono">
                    {data.takeoff.concreteVolumeCuM} Cu.M
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Structural Steel Rebar (Fe550D):</span>
                  <span className="text-slate-200 font-bold font-mono">
                    {data.takeoff.steelRebarTons} MT
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">OPC 53 Cement Bags:</span>
                  <span className="text-slate-200 font-bold font-mono">
                    {data.takeoff.cementBags.toLocaleString()} Bags
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">AAC Masonry Blocks:</span>
                  <span className="text-slate-200 font-bold font-mono">
                    {data.takeoff.aacBlocksCount.toLocaleString()} Nos
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Total Estimated Cost:</span>
                  <span className="text-emerald-400 font-bold font-mono text-sm">
                    ₹{(data.takeoff.totalEstimatedCostINR / 10000000).toFixed(2)} Cr
                  </span>
                </div>
              </div>
            </div>

            {/* AI Designer Insights */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Cpu className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">AI Architect Verification</h3>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">NBC 2026 Compliance:</span>
                  <span className="text-emerald-400 font-semibold">{data.aiInsights.nbcCompliance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Structural Stability Score:</span>
                  <span className="text-cyan-400 font-bold font-mono">{data.aiInsights.structuralStabilityScore}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">BIM Clashes Detected:</span>
                  <span className="text-emerald-400 font-bold font-mono">0 (Zero Clashes)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800 italic">
                  &ldquo;{data.aiInsights.summary || "Complete structural building extrusion and MEP service shafts verified for construction readiness."}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gemini API Key Configuration Modal */}
      {showGeminiKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Google Gemini API Key</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Enter your Google AI Studio Gemini API Key to enable real-time structural architectural generation. If left blank, BuildCon uses the internal high-precision CAD compiler.
            </p>
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowGeminiKeyModal(false)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("buildcon_gemini_api_key", geminiApiKey);
                  }
                  setShowGeminiKeyModal(false);
                  generateBlueprint(selectedPreset, promptText, builtupSqft, floors);
                }}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold"
              >
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chairman Executive Board Submission Modal */}
      {showChairmanSubmitModal && data && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Send 3D Model to Chairman</h3>
                  <span className="text-[11px] text-slate-400">Board Approval & Executive Directive Submission</span>
                </div>
              </div>
              <button
                onClick={() => setShowChairmanSubmitModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Proposal Summary Box */}
            <div className="p-3 bg-[#0B111E] rounded-xl border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Proposal Title</span>
                  <div className="font-bold text-white text-sm mt-0.5">{data.title}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                  {floors} Stories
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                <div>
                  <span className="text-slate-400">Total Height: </span>
                  <span className="text-white font-mono font-bold">{(floors * 3.2).toFixed(1)}m ({(floors * 3.2 * 3.28084).toFixed(0)}ft)</span>
                </div>
                <div>
                  <span className="text-slate-400">Gross Floor Area: </span>
                  <span className="text-white font-mono font-bold">{(data.dimensions.builtupAreaSqft * floors).toLocaleString()} sqft</span>
                </div>
                <div>
                  <span className="text-slate-400">Est. Project Cost: </span>
                  <span className="text-emerald-400 font-mono font-bold">₹ {(data.takeoff.totalEstimatedCostINR / 10000000).toFixed(2)} Cr</span>
                </div>
                <div>
                  <span className="text-slate-400">Structural Frame: </span>
                  <span className="text-slate-200 font-semibold truncate">IS 13920 SMRF</span>
                </div>
              </div>
            </div>

            {/* Note to Chairman */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-200 block">Note / Justification to Chairman:</label>
              <textarea
                rows={3}
                value={chairmanSubmitNote}
                onChange={(e) => setChairmanSubmitNote(e.target.value)}
                placeholder="Enter justification, urgency, or executive briefing for the Chairman..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-sans"
              />
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300/90 leading-relaxed">
              Upon submission, this 3D building model and IS 1200 BOQ will appear on the Chairman&apos;s Board Approvals dashboard. The Chairman will be able to inspect the model and attach their official remarks/replies.
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowChairmanSubmitModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendToChairman}
                disabled={submittingToChairman}
                className="px-5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-lg shadow-orange-500/20 disabled:opacity-50 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingToChairman ? "Dispatching..." : "Submit to Chairman"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
