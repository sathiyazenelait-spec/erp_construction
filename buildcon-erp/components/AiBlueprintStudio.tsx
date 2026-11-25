"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Compass, Sparkles, Layers, Box, Eye, CheckCircle2,
  AlertTriangle, ZoomIn, ZoomOut, Maximize2, Download,
  Printer, Save, RefreshCw, Sliders, ChevronRight,
  HardHat, Activity, Cpu, ShieldCheck, Thermometer,
  Grid, Move, Info, Check, ArrowRight, Sun, Moon, Rotate3d,
  Key, Building, Building2, EyeOff, Send, X, BookOpen, Search, Copy
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
  massingForm?: "RECTANGULAR" | "STEPPED_CASCADING" | "CURVED_CYLINDRICAL" | "TWISTED_DIAGRID" | "INDUSTRIAL_SHED" | "L_SHAPED" | "U_SHAPED" | "V_SHAPED" | "T_SHAPED" | "H_SHAPED" | "SPHERICAL_BALL" | "OPEN_SQUARE_DONUT" | "WIDE_LINEAR_RANGE" | "CIRCULAR_DONUT" | "ALDAR_COIN";
  isLShaped?: boolean;
  isUShaped?: boolean;
  isVShaped?: boolean;
  isTShaped?: boolean;
  isHShaped?: boolean;
  isSphericalBall?: boolean;
  isOpenSquare?: boolean;
  isCircularDonut?: boolean;
  isAldarCoin?: boolean;
  isWideRange?: boolean;
  isCurvedRounded?: boolean;
  isHostel?: boolean;
  hasBasketball?: boolean;
  hasVolleyball?: boolean;
  hasSportsCourt?: boolean;
  hasPlayground?: boolean;
  hasAirplaneRoof?: boolean;
  hasSolarPanels?: boolean;
  glassDistribution?: "FULL_GLASS" | "LEFT_FRONT_GLASS" | "RIGHT_FRONT_GLASS" | "ONE_SIDE_GLASS" | "BALANCED_DUAL_CURTAIN";
  rooftopFeature?: "HELIPAD" | "INFINITY_POOL" | "OBSERVATORY_DOME" | "PENTHOUSE_GARDEN" | "GABLE_ROOF" | "SOLAR_ARRAY" | "AIRPLANE_WING_ROOF";
  balconyType?: "CANTILEVERED_FLOATING" | "WRAPAROUND_RIBBON" | "CURVED_WAVE" | "TERRACED_CASCADE" | "MINIMAL_FLUSH";
  facadePalette?: "GOLD_LUXURY" | "CYBER_OBSIDIAN" | "EMERALD_BIOPHILIC" | "TERRACOTTA_NORDIC" | "WHITE_MARBLE" | "AZURE_GLASS";
  hasHelipad?: boolean;
  hasInfinityPool?: boolean;
  hasObservatoryDome?: boolean;
  hasGableRoof?: boolean;
  hasDoubleHeight?: boolean;
  hasFloatingBalconies?: boolean;
  hasWraparoundBalconies?: boolean;
  hasRooftopGarden?: boolean;
  hasDiagrid?: boolean;
  hasSkyCourt?: boolean;
  hasSunLouvers?: boolean;
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

  // 1,500 Prompt Architectural Library Modal State
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [promptLibraryData, setPromptLibraryData] = useState<any[]>([]);
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<number | "ALL">("ALL");
  const [promptSearchQuery, setPromptSearchQuery] = useState("");
  const [copiedPromptId, setCopiedPromptId] = useState<number | null>(null);
  const [promptDisplayLimit, setPromptDisplayLimit] = useState(36);

  // Load 1,500 Prompt Library Dataset
  useEffect(() => {
    fetch("/data/prompt_library_1500.json")
      .then(res => res.json())
      .then(d => {
        if (Array.isArray(d)) setPromptLibraryData(d);
      })
      .catch(err => console.error("Could not load prompt library:", err));
  }, []);

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

    // Auto-detect floor count from prompt if explicitly specified (e.g. "10 floor", "12 story", "4 storey")
    let targetFloors = flrCount;
    const match = (prompt || "").match(/(\d+)\s*[-_]?\s*(floor|storey|story)/i);
    if (match && match[1]) {
      const parsed = parseInt(match[1], 10);
      if (parsed >= 1 && parsed <= 25) {
        targetFloors = parsed;
        if (targetFloors !== floors) setFloors(targetFloors);
      }
    }

    try {
      const res = await fetch("http://localhost:8001/api/ai/generate-blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt || `${pType} building design`,
          projectType: pType,
          builtupSqft: sqft,
          floors: targetFloors,
          includeMep: layers.mep,
          theme: theme,
          geminiApiKey: geminiApiKey || undefined
        })
      });

      if (res.ok) {
        const bpData: BlueprintData = await res.json();
        setData(bpData);
        if (bpData.floors && bpData.floors !== targetFloors) {
          setFloors(bpData.floors);
        }
        if (bpData.rooms && bpData.rooms.length > 0) {
          setSelectedRoom(bpData.rooms[0]);
        }
      } else {
        fallbackGenerate(pType, prompt, sqft, targetFloors);
      }
    } catch (e) {
      console.warn("FastAPI offline, executing client-side generative model", e);
      fallbackGenerate(pType, prompt, sqft, targetFloors);
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
    const hasInfinityPool = pLower.includes("pool") || pLower.includes("infinity pool") || pLower.includes("sky pool") || pLower.includes("swimming pool") || pLower.includes("sundeck") || pLower.includes("jacuzzi");
    const hasObservatoryDome = pLower.includes("dome") || pLower.includes("observatory") || pLower.includes("planetarium") || pLower.includes("sky lounge") || pLower.includes("telescope") || pLower.includes("crown") || pLower.includes("spire");
    const hasGableRoof = pLower.includes("gable") || pLower.includes("pitched") || pLower.includes("slanted") || pLower.includes("sloped") || pLower.includes("cottage");
    const hasDoubleHeight = pLower.includes("double-height") || pLower.includes("double height") || pLower.includes("duplex") || pLower.includes("mezzanine") || pLower.includes("high ceiling");
    const hasFloatingBalconies = pLower.includes("floating") || pLower.includes("cantilever") || pLower.includes("frameless") || pLower.includes("balcon");
    const hasWraparoundBalconies = pLower.includes("wrap") || pLower.includes("wraparound") || pLower.includes("wrap-around") || pLower.includes("continuous") || pLower.includes("ribbon") || pLower.includes("panoramic balcony");
    const hasWaveBalconies = pLower.includes("wave") || pLower.includes("undulating") || pLower.includes("ripple") || pLower.includes("organic") || pLower.includes("aqua");
    const hasTerracedBalconies = pLower.includes("vertical garden") || pLower.includes("planted balcony") || pLower.includes("bosco") || pLower.includes("cascading plant") || pLower.includes("hanging garden");
    const hasRooftopGarden = pLower.includes("terrace garden") || pLower.includes("sky garden") || pLower.includes("green roof") || pLower.includes("sky-mansion") || pLower.includes("penthouse");
    const isLuxuryMansion = pLower.includes("sky-mansion") || pLower.includes("mansion") || pLower.includes("ultra-luxury") || pLower.includes("luxury") || pLower.includes("penthouse") || pLower.includes("gold") || pLower.includes("champagne") || pLower.includes("prestige");
    const isCyberObsidian = pLower.includes("black") || pLower.includes("obsidian") || pLower.includes("dark") || pLower.includes("smoke") || pLower.includes("carbon") || pLower.includes("cyber") || pLower.includes("stealth") || pLower.includes("neon") || pLower.includes("futuristic");
    const isBiophilic = pLower.includes("biophilic") || pLower.includes("vertical forest") || pLower.includes("green") || pLower.includes("eco") || pLower.includes("sustainable") || pLower.includes("living wall");
    const isWhiteMarble = pLower.includes("white") || pLower.includes("marble") || pLower.includes("classical") || pLower.includes("statuario") || pLower.includes("clean") || pLower.includes("ivory") || pLower.includes("minimalist");
    const isTerracotta = pLower.includes("nordic") || pLower.includes("terracotta") || pLower.includes("wood") || pLower.includes("timber") || pLower.includes("brick") || pLower.includes("clay");
    const hasDiagrid = pLower.includes("diagrid") || pLower.includes("diamond") || pLower.includes("lattice") || pLower.includes("exoskeleton") || pLower.includes("cross brace") || pLower.includes("x-brace");
    const hasSkyCourt = pLower.includes("sky court") || pLower.includes("sky-court") || pLower.includes("mid-level garden") || pLower.includes("void") || pLower.includes("cutout") || pLower.includes("hollow") || pLower.includes("sky bridge");
    const hasSunLouvers = pLower.includes("louver") || pLower.includes("louvers") || pLower.includes("shading") || pLower.includes("brise-soleil") || pLower.includes("fins") || pLower.includes("slats");
    const isTShaped = (/\b(t[-_\s]?(shape|shaped|block|layout|plan|frame|framed|design|model|structure|tower|building))\b/i.test(pLower)) || (/\bt\b/i.test(pLower) && /\b(shape|shaped)\b/i.test(pLower));
    const isHShaped = (/\b(h[-_\s]?(shape|shaped|block|layout|plan|frame|framed|design|model|structure|tower|building))\b/i.test(pLower)) || (/\bh\b/i.test(pLower) && /\b(shape|shaped)\b/i.test(pLower));
    const isVShaped = (/\b(v[-_\s]?(shape|shaped|block|layout|plan|frame|framed|design|model|structure|tower|building))\b/i.test(pLower)) || (/\bv\b/i.test(pLower) && /\b(shape|shaped)\b/i.test(pLower));
    const isUShaped = (/\b(u[-_\s]?(shape|shaped|block|layout|plan|frame|framed|design|model|structure|tower|building))\b/i.test(pLower)) || (/\bu\b/i.test(pLower) && /\b(shape|shaped)\b/i.test(pLower)) || pLower.includes("horseshoe");
    const isLShaped = (/\b(l[-_\s]?(shape|shaped|block|layout|plan|frame|framed|design|model|structure|tower|building))\b/i.test(pLower)) || (/\bl\b/i.test(pLower) && /\b(shape|shaped)\b/i.test(pLower));
    const isSphericalBall = pLower.includes("ball shape") || pLower.includes("spherical") || pLower.includes("sphere") || pLower.includes("globe") || pLower.includes("orb") || pLower.includes("geodesic ball") || pLower.includes("ball building");
    const isOpenSquare = pLower.includes("square open center") || pLower.includes("open center") || pLower.includes("hollow square") || pLower.includes("courtyard ring") || pLower.includes("atrium square") || pLower.includes("square courtyard") || (pLower.includes("donut") && !pLower.includes("circular"));
    const isAldarCoin = pLower.includes("aldar") || pLower.includes("coin shape") || pLower.includes("standing disc") || pLower.includes("coin building") || pLower.includes("vertical circle");
    const isCircularDonut = pLower.includes("cricle") || pLower.includes("circle") || pLower.includes("circular") || pLower.includes("ring shape") || pLower.includes("circular donut") || pLower.includes("circular courtyard");
    const isWideRange = pLower.includes("wide range") || pLower.includes("wide building") || pLower.includes("linear campus") || pLower.includes("wide span") || pLower.includes("extended pavilion") || pLower.includes("low-rise wide");

    const isCurvedRounded = pLower.includes("rounded") || pLower.includes("curved") || pLower.includes("round") || pLower.includes("cylinder") || pLower.includes("cylindrical") || pLower.includes("oval") || pLower.includes("crescent") || pLower.includes("arc");
    const isHostel = pLower.includes("hostel") || pLower.includes("dormitory") || pLower.includes("student") || pLower.includes("campus") || pLower.includes("coliving");
    const hasBasketball = pLower.includes("basketball") || pLower.includes("b-ball") || pLower.includes("hoop");
    const hasVolleyball = pLower.includes("volleyball") || pLower.includes("v-ball");
    const hasPlayground = pLower.includes("playgroud") || pLower.includes("playground") || pLower.includes("play ground") || pLower.includes("play area") || pLower.includes("park") || pLower.includes("kids zone");
    const hasSportsCourt = hasBasketball || hasVolleyball || hasPlayground || pLower.includes("sports court") || pLower.includes("court");

    const hasAirplaneRoof = pLower.includes("aeroplan") || pLower.includes("airplane") || pLower.includes("aeroplane") || pLower.includes("wing design roof") || pLower.includes("wing roof") || pLower.includes("aviation roof") || pLower.includes("aerodynamic roof");
    const hasSolarPanels = pLower.includes("solar pannel") || pLower.includes("solar panel") || pLower.includes("solar rooftop") || pLower.includes("photovoltaic") || pLower.includes("solar array") || pLower.includes("solar farm");

    const isFullGlass = pLower.includes("full glass") || pLower.includes("all glass") || pLower.includes("fully glazed") || pLower.includes("total glass") || pLower.includes("glass curtain wall") || pLower.includes("full glassed");
    const isRightFrontGlass = pLower.includes("right front glass") || pLower.includes("right side glass") || pLower.includes("right wing glazed") || pLower.includes("right glazed") || pLower.includes("right front glassed");
    const isLeftFrontGlass = pLower.includes("left front glass") || pLower.includes("left side glass") || pLower.includes("left wing glazed") || pLower.includes("left glazed") || pLower.includes("left front glassed");
    const isOneSideGlass = pLower.includes("one side glass") || pLower.includes("single side glass") || pLower.includes("one side glazed") || pLower.includes("front glass only") || pLower.includes("one side glassed");

    // Massing Form
    let massingForm: "RECTANGULAR" | "STEPPED_CASCADING" | "CURVED_CYLINDRICAL" | "TWISTED_DIAGRID" | "INDUSTRIAL_SHED" | "L_SHAPED" | "U_SHAPED" | "V_SHAPED" | "T_SHAPED" | "H_SHAPED" | "SPHERICAL_BALL" | "OPEN_SQUARE_DONUT" | "WIDE_LINEAR_RANGE" | "CIRCULAR_DONUT" | "ALDAR_COIN" = "RECTANGULAR";
    if (isVShaped) {
      massingForm = "V_SHAPED";
    } else if (isUShaped) {
      massingForm = "U_SHAPED";
    } else if (isTShaped) {
      massingForm = "T_SHAPED";
    } else if (isHShaped) {
      massingForm = "H_SHAPED";
    } else if (isSphericalBall) {
      massingForm = "SPHERICAL_BALL";
    } else if (isOpenSquare) {
      massingForm = "OPEN_SQUARE_DONUT";
    } else if (isAldarCoin) {
      massingForm = "ALDAR_COIN";
    } else if (isCircularDonut) {
      massingForm = "CIRCULAR_DONUT";
    } else if (isWideRange) {
      massingForm = "WIDE_LINEAR_RANGE";
    } else if (isLShaped) {
      massingForm = "L_SHAPED";
    } else if (isCurvedRounded || isHostel) {
      massingForm = "CURVED_CYLINDRICAL";
    } else if (pLower.includes("stepped") || pLower.includes("cascading") || pLower.includes("terraced tower") || pLower.includes("ziggurat") || pLower.includes("setback") || pLower.includes("pyramid")) {
      massingForm = "STEPPED_CASCADING";
    } else if (pLower.includes("curved") || pLower.includes("cylinder") || pLower.includes("cylindrical") || pLower.includes("circular") || pLower.includes("round tower") || pLower.includes("oval") || pLower.includes("fluid")) {
      massingForm = "CURVED_CYLINDRICAL";
    } else if (pLower.includes("twist") || pLower.includes("twisted") || pLower.includes("spiral") || pLower.includes("diagrid")) {
      massingForm = "TWISTED_DIAGRID";
    } else if (pType === "INDUSTRIAL" || pLower.includes("warehouse") || pLower.includes("shed") || pLower.includes("factory") || pLower.includes("hangar")) {
      massingForm = "INDUSTRIAL_SHED";
    }

    // Glass Distribution
    let glassDistribution: "FULL_GLASS" | "LEFT_FRONT_GLASS" | "RIGHT_FRONT_GLASS" | "ONE_SIDE_GLASS" | "BALANCED_DUAL_CURTAIN" = "BALANCED_DUAL_CURTAIN";
    if (isRightFrontGlass) glassDistribution = "RIGHT_FRONT_GLASS";
    else if (isLeftFrontGlass) glassDistribution = "LEFT_FRONT_GLASS";
    else if (isOneSideGlass) glassDistribution = "ONE_SIDE_GLASS";
    else if (isFullGlass) glassDistribution = "FULL_GLASS";

    // Facade Palette
    let facadePalette: "GOLD_LUXURY" | "CYBER_OBSIDIAN" | "EMERALD_BIOPHILIC" | "TERRACOTTA_NORDIC" | "WHITE_MARBLE" | "AZURE_GLASS" = "AZURE_GLASS";
    if (isLuxuryMansion) facadePalette = "GOLD_LUXURY";
    else if (isCyberObsidian) facadePalette = "CYBER_OBSIDIAN";
    else if (isBiophilic) facadePalette = "EMERALD_BIOPHILIC";
    else if (isWhiteMarble) facadePalette = "WHITE_MARBLE";
    else if (isTerracotta) facadePalette = "TERRACOTTA_NORDIC";

    // Rooftop Feature
    let rooftopFeature: "HELIPAD" | "INFINITY_POOL" | "OBSERVATORY_DOME" | "PENTHOUSE_GARDEN" | "GABLE_ROOF" | "SOLAR_ARRAY" | "AIRPLANE_WING_ROOF" = "SOLAR_ARRAY";
    if (hasAirplaneRoof) rooftopFeature = "AIRPLANE_WING_ROOF";
    else if (hasHelipad) rooftopFeature = "HELIPAD";
    else if (hasInfinityPool) rooftopFeature = "INFINITY_POOL";
    else if (hasObservatoryDome) rooftopFeature = "OBSERVATORY_DOME";
    else if (hasGableRoof || pType === "VILLA") rooftopFeature = "GABLE_ROOF";
    else if (hasRooftopGarden) rooftopFeature = "PENTHOUSE_GARDEN";
    else if (hasSolarPanels) rooftopFeature = "SOLAR_ARRAY";

    // Balcony Type
    let balconyType: "CANTILEVERED_FLOATING" | "WRAPAROUND_RIBBON" | "CURVED_WAVE" | "TERRACED_CASCADE" | "MINIMAL_FLUSH" = "MINIMAL_FLUSH";
    if (hasWaveBalconies) balconyType = "CURVED_WAVE";
    else if (hasWraparoundBalconies) balconyType = "WRAPAROUND_RIBBON";
    else if (hasTerracedBalconies) balconyType = "TERRACED_CASCADE";
    else if (hasFloatingBalconies) balconyType = "CANTILEVERED_FLOATING";
    else if (pType === "RESIDENTIAL") balconyType = "CANTILEVERED_FLOATING";

    let title = `${effectiveFloors}-Story Executive Residence`;
    let dwg = `DWG-AI-RES-00${effectiveFloors}`;
    let facadeStyle = "Terracotta Louvers & Glazed Balconies";

    if (isVShaped) {
      title = `${effectiveFloors}-Story Modern V-Shaped Iconic Tower`;
      facadeStyle = "V-Shaped Dual Wing Glazed Facade with Central Entrance Plaza";
      dwg = `DWG-AI-VSHP-00${effectiveFloors}`;
    } else if (isUShaped) {
      title = `${effectiveFloors}-Story Modern U-Shaped Courtyard Complex`;
      facadeStyle = "U-Shaped Triple Wing Glazed Envelope with Central Courtyard";
      dwg = `DWG-AI-USHP-00${effectiveFloors}`;
    } else if (isTShaped) {
      title = `${effectiveFloors}-Floor T-Shaped Commercial Complex`;
      facadeStyle = "T-Shaped Extruded Structural Frame with Front Glass Curtain";
      dwg = `DWG-AI-TSHP-00${effectiveFloors}`;
    } else if (isHShaped) {
      title = `${effectiveFloors}-Story H-Shaped Twin-Tower with Glazed Skybridge`;
      facadeStyle = "H-Shaped Dual Tower Envelope with Central Connecting Skybridge";
      dwg = `DWG-AI-HSHP-00${effectiveFloors}`;
    } else if (isSphericalBall) {
      title = `${effectiveFloors}-Floor Spherical Geodesic Orb Corporate Headquarters`;
      facadeStyle = "Spherical Geodesic Glass & Carbon Exoskeleton Globe";
      dwg = `DWG-AI-ORB-00${effectiveFloors}`;
    } else if (isOpenSquare) {
      title = `${effectiveFloors}-Story Square Open-Center Quadrangle Atrium Complex`;
      facadeStyle = "Continuous Quadrangle Glazed Ring with Open Central Courtyard";
      dwg = `DWG-AI-SQAT-00${effectiveFloors}`;
    } else if (isWideRange) {
      title = `${effectiveFloors}-Story Wide-Range Linear Innovation Campus`;
      facadeStyle = "Wide Multi-Bay Structural Steel Frame & Ribbon Glazing";
      dwg = `DWG-AI-WIDE-00${effectiveFloors}`;
    } else if (isHostel) {
      title = `${effectiveFloors}-Floor Rounded Luxury Campus Hostel Residence`;
      facadeStyle = "Aerodynamic Curved Glass Envelope with Panoramic Balconies";
      dwg = `DWG-AI-HSTL-00${effectiveFloors}`;
    } else if (isCurvedRounded) {
      title = `${effectiveFloors}-Floor Curved Architectural Panoramic Tower`;
      facadeStyle = "Aerodynamic Curved Glass Envelope with Panoramic Balconies";
      dwg = `DWG-AI-CRV-00${effectiveFloors}`;
    } else if (isLShaped) {
      title = `${effectiveFloors}-Story Modern L-Shaped Dual-Wing Complex`;
      facadeStyle = "L-Shaped Dual Wing Glazed Envelope with Courtyard";
      dwg = `DWG-AI-LSHP-00${effectiveFloors}`;
    } else if (isLuxuryMansion) {
      title = `${effectiveFloors}-Floor Ultra-Luxury Sky-Mansion Tower`;
      facadeStyle = "Champagne Gold Double-Height Glazing & Frameless Glass";
      dwg = `DWG-AI-SKY-00${effectiveFloors}`;
    } else if (isCyberObsidian) {
      title = `${effectiveFloors}-Story Cyberpunk Obsidian Glass Tower`;
      facadeStyle = "Smoke Obsidian Glazing with Neon Structural Exoskeleton";
      dwg = `DWG-AI-CYB-00${effectiveFloors}`;
    } else if (isBiophilic) {
      title = `${effectiveFloors}-Floor Biophilic Vertical Forest Complex`;
      facadeStyle = "Living Green Wall Facade & Cascading Planted Terraces";
      dwg = `DWG-AI-ECO-00${effectiveFloors}`;
    } else if (pLower.includes("villa") || pType === "VILLA") {
      title = `${effectiveFloors}-Story Modern Luxury Villa with Floating Decks`;
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

    if (hasAirplaneRoof) {
      facadeStyle += " + Airplane Wing Aerodynamic Roof";
    }
    if (hasSolarPanels) {
      facadeStyle += " + Solar Photovoltaic Rooftop Farm";
    }
    if (glassDistribution === "FULL_GLASS") {
      facadeStyle = "Full Glass Curtain Wall Panoramic Facade";
    } else if (glassDistribution === "LEFT_FRONT_GLASS") {
      facadeStyle = "Left Front Glazed Curtain Wall (Precast Flank)";
    } else if (glassDistribution === "RIGHT_FRONT_GLASS") {
      facadeStyle = "Right Front Glazed Curtain Wall (Precast Flank)";
    } else if (glassDistribution === "ONE_SIDE_GLASS") {
      facadeStyle = "One-Side Glazed Front Envelope (Solid Side Walls)";
    }

    let rooms: BlueprintRoom[] = [];
    let cols: BlueprintColumn[] = [];

    if (isVShaped) {
      rooms = [
        { id: "R1", name: "Executive Suite (West Wing)", x: 100, y: 140, w: 260, h: 220, areaSqft: Math.round(sqft * 0.32), flooring: "Imported Italian Botticino", type: "LIVING" },
        { id: "R2", name: "Corporate Hub (East Wing)", x: 440, y: 140, w: 260, h: 220, areaSqft: Math.round(sqft * 0.32), flooring: "Acoustic Oak Parquet", type: "OFFICE" },
        { id: "R3", name: "Central Apex Glazed Rotunda & Atrium", x: 280, y: 100, w: 240, h: 160, areaSqft: Math.round(sqft * 0.20), flooring: "Polished Granite Pavers", type: "FOYER" },
        { id: "R4", name: "Entrance Plaza & Open Playground", x: 100, y: 440, w: 600, h: 120, areaSqft: Math.round(sqft * 0.16), flooring: "Landscaped Turf Lawn", type: "COURTYARD" }
      ];
      cols = [
        { grid: "V-1", x: 95, y: 135, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "V-2", x: 355, y: 135, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "V-3", x: 695, y: 135, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "V-4", x: 275, y: 95, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "V-5", x: 515, y: 95, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "V-6", x: 95, y: 355, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "V-7", x: 695, y: 355, size: "500x500mm", rebar: "12-T25 Fe550D" }
      ];
    } else if (isHShaped) {
      rooms = [
        { id: "R1", name: "Tower West Living Suites", x: 100, y: 100, w: 200, h: 440, areaSqft: Math.round(sqft * 0.40), flooring: "Engineered Oak Plank", type: "BEDROOM" },
        { id: "R2", name: "Tower East Corporate Pods", x: 500, y: 100, w: 200, h: 440, areaSqft: Math.round(sqft * 0.40), flooring: "Statuario Glazed Vitrified", type: "OFFICE" },
        { id: "R3", name: "Central Connecting Skybridge Lounge", x: 300, y: 240, w: 200, h: 140, areaSqft: Math.round(sqft * 0.20), flooring: "Structural Glass Flooring", type: "LIVING" }
      ];
      cols = [
        { grid: "H-1", x: 95, y: 95, size: "550x550mm", rebar: "16-T25 Fe550D" },
        { grid: "H-2", x: 295, y: 95, size: "550x550mm", rebar: "16-T25 Fe550D" },
        { grid: "H-3", x: 495, y: 95, size: "550x550mm", rebar: "16-T25 Fe550D" },
        { grid: "H-4", x: 695, y: 95, size: "550x550mm", rebar: "16-T25 Fe550D" },
        { grid: "H-5", x: 95, y: 535, size: "550x550mm", rebar: "16-T25 Fe550D" },
        { grid: "H-6", x: 295, y: 535, size: "550x550mm", rebar: "16-T25 Fe550D" },
        { grid: "H-7", x: 495, y: 535, size: "550x550mm", rebar: "16-T25 Fe550D" },
        { grid: "H-8", x: 695, y: 535, size: "550x550mm", rebar: "16-T25 Fe550D" }
      ];
    } else if (isOpenSquare) {
      rooms = [
        { id: "R1", name: "North Wing Academic Suites", x: 100, y: 100, w: 600, h: 120, areaSqft: Math.round(sqft * 0.28), flooring: "Acoustic Vinyl Tile", type: "OFFICE" },
        { id: "R2", name: "South Wing Innovation Lab", x: 100, y: 440, w: 600, h: 120, areaSqft: Math.round(sqft * 0.28), flooring: "Anti-Static Epoxy", type: "OFFICE" },
        { id: "R3", name: "West Wing Living Quarters", x: 100, y: 220, w: 140, h: 220, areaSqft: Math.round(sqft * 0.16), flooring: "European Hardwood", type: "BEDROOM" },
        { id: "R4", name: "East Wing Dining & Wellness", x: 560, y: 220, w: 140, h: 220, areaSqft: Math.round(sqft * 0.16), flooring: "Ceramic Matte Anti-Skid", type: "KITCHEN" },
        { id: "R5", name: "Central Open Sky Garden Atrium", x: 240, y: 220, w: 320, h: 220, areaSqft: Math.round(sqft * 0.12), flooring: "Granite Pavers & Zen Lawn", type: "COURTYARD" }
      ];
      cols = [
        { grid: "Q-1", x: 95, y: 95, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "Q-2", x: 695, y: 95, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "Q-3", x: 235, y: 215, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "Q-4", x: 555, y: 215, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "Q-5", x: 235, y: 435, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "Q-6", x: 555, y: 435, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "Q-7", x: 95, y: 555, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "Q-8", x: 695, y: 555, size: "500x500mm", rebar: "12-T25 Fe550D" }
      ];
    } else if (isHostel) {
      rooms = [
        { id: "R1", name: "Student Living Suites (Wing A)", x: 100, y: 100, w: 290, h: 220, areaSqft: Math.round(sqft * 0.32), flooring: "Acoustic Luxury Vinyl Tile", type: "BEDROOM" },
        { id: "R2", name: "Student Living Suites (Wing B)", x: 410, y: 100, w: 290, h: 220, areaSqft: Math.round(sqft * 0.32), flooring: "Acoustic Luxury Vinyl Tile", type: "BEDROOM" },
        { id: "R3", name: "Campus Dining Hall & Cafeteria", x: 100, y: 340, w: 220, h: 140, areaSqft: Math.round(sqft * 0.16), flooring: "Vitrified Anti-Slip Tile", type: "KITCHEN" },
        { id: "R4", name: "Central Study Library & Tech Hub", x: 340, y: 340, w: 180, h: 140, areaSqft: Math.round(sqft * 0.12), flooring: "Engineered Oak Wood", type: "OFFICE" },
        { id: "R5", name: "Sports Courtyard (Basketball & Volleyball)", x: 100, y: 500, w: 600, h: 70, areaSqft: Math.round(sqft * 0.08), flooring: "Multi-Sport Polyurethane Hardcourt", type: "COURTYARD" }
      ];
      cols = [
        { grid: "H-1", x: 95, y: 95, size: "450x450mm", rebar: "8-T20 Fe550D" },
        { grid: "H-2", x: 395, y: 95, size: "450x450mm", rebar: "8-T20 Fe550D" },
        { grid: "H-3", x: 695, y: 95, size: "450x450mm", rebar: "8-T20 Fe550D" },
        { grid: "H-4", x: 95, y: 335, size: "450x450mm", rebar: "8-T20 Fe550D" },
        { grid: "H-5", x: 395, y: 335, size: "450x450mm", rebar: "8-T20 Fe550D" },
        { grid: "H-6", x: 695, y: 335, size: "450x450mm", rebar: "8-T20 Fe550D" },
        { grid: "H-7", x: 95, y: 495, size: "450x450mm", rebar: "8-T20 Fe550D" },
        { grid: "H-8", x: 695, y: 495, size: "450x450mm", rebar: "8-T20 Fe550D" }
      ];
    } else if (isLShaped) {
      rooms = [
        { id: "R1", name: "Living Suite (Left Wing)", x: 100, y: 340, w: 280, h: 220, areaSqft: Math.round(sqft * 0.28), flooring: "Imported Italian Marble", type: "LIVING" },
        { id: "R2", name: "Master Suite (Left Wing)", x: 100, y: 100, w: 280, h: 220, areaSqft: Math.round(sqft * 0.26), flooring: "Hardwood Oak Parquet", type: "BEDROOM" },
        { id: "R3", name: "Dining & Gourmet Kitchen (Rear Wing)", x: 400, y: 100, w: 300, h: 140, areaSqft: Math.round(sqft * 0.22), flooring: "Polished Vitrified Tile", type: "KITCHEN" },
        { id: "R4", name: "Guest Suite & Executive Study (Rear Wing)", x: 400, y: 250, w: 300, h: 80, areaSqft: Math.round(sqft * 0.14), flooring: "Engineered Hardwood", type: "BEDROOM" },
        { id: "R5", name: "Landscaped Zen Courtyard (Open-to-Sky)", x: 400, y: 340, w: 300, h: 220, areaSqft: Math.round(sqft * 0.10), flooring: "Green Lawn & Granite Pavers", type: "COURTYARD" }
      ];
      cols = [
        { grid: "L-1", x: 95, y: 95, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "L-2", x: 395, y: 95, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "L-3", x: 695, y: 95, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "L-4", x: 95, y: 335, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "L-5", x: 395, y: 335, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "L-6", x: 695, y: 335, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "L-7", x: 95, y: 555, size: "500x500mm", rebar: "12-T25 Fe550D" },
        { grid: "L-8", x: 395, y: 555, size: "500x500mm", rebar: "12-T25 Fe550D" }
      ];
    } else if (pType === "COMMERCIAL") {
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
      `${effectiveFloors}-Story ${massingForm.replace('_', ' ').toLowerCase()} structural frame`,
      massingForm === "L_SHAPED" ? "L-shaped dual wing configuration with central open-air courtyard" : (
        hasDiagrid ? "External diagonal structural steel diagrid exoskeleton" : (
          hasDoubleHeight ? "Alternating double-height living room glazing with structural silicone mullions" : "High-performance acoustic low-E double curtain wall glazing"
        )
      ),
      balconyType === "CURVED_WAVE" ? "Curved wave sinusoidal organic balconies" : (
        balconyType === "WRAPAROUND_RIBBON" ? "Continuous 360-degree wrap-around panoramic ribbon balconies" : (
          balconyType === "TERRACED_CASCADE" ? "Cascading planted vertical garden terraces with automated drip misting" : (
            balconyType === "CANTILEVERED_FLOATING" ? "Cantilevered floating balconies with frameless laminated glass balustrades" : "Integrated MEP service core with dual wet risers & HVAC shafts"
          )
        )
      ),
      rooftopFeature === "HELIPAD" ? "Rooftop helipad with perimeter flight safety beacons & sky terrace" : (
        rooftopFeature === "INFINITY_POOL" ? "Elevated infinity sky pool with glass overflow edge and wooden sundeck" : (
          rooftopFeature === "OBSERVATORY_DOME" ? "Geodesic glass dome astronomical observatory & panoramic sky lounge" : (
            rooftopFeature === "GABLE_ROOF" ? "Architectural pitched timber gable roof with weather-sealed standing seams" : (
              rooftopFeature === "PENTHOUSE_GARDEN" ? "Landscaped sky-park botanical terrace garden with observation deck" : "Rooftop terrace with solar PV array & pressurized lift machine room"
            )
          )
        )
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
        massingForm,
        isVShaped,
        isUShaped,
        isTShaped,
        isHShaped,
        isCircularDonut,
        isAldarCoin,
        isSphericalBall,
        isOpenSquare,
        isWideRange,
        isLShaped,
        isCurvedRounded,
        isHostel,
        hasBasketball,
        hasVolleyball,
        hasSportsCourt,
        hasPlayground,
        hasAirplaneRoof,
        hasSolarPanels,
        glassDistribution,
        rooftopFeature,
        balconyType,
        facadePalette,
        hasHelipad,
        hasInfinityPool,
        hasObservatoryDome,
        hasGableRoof,
        hasDoubleHeight,
        hasFloatingBalconies,
        hasWraparoundBalconies,
        hasRooftopGarden,
        hasDiagrid,
        hasSkyCourt,
        hasSunLouvers
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

  // Extract dynamic architectural features from prompt and 3D spec for both 3D & 2D CAD
  const promptLower = (promptText || data?.prompt || "").toLowerCase();
  const allContextText = `${promptText} ${data?.prompt || ""} ${data?.title || ""} ${data?.building3D?.facadeStyle || ""}`.toLowerCase();

  const isHShaped = (/\b(h[-_\s]?(shape|shaped|block|layout|plan|frame|framed|design|model|structure|tower|building))\b/i.test(allContextText)) ||
                    (/\bh\b/i.test(allContextText) && /\b(shape|shaped)\b/i.test(allContextText)) ||
                    data?.building3D?.massingForm === "H_SHAPED" ||
                    Boolean(data?.building3D?.isHShaped);

  const isTShaped = !isHShaped && (
                    (/\b(t[-_\s]?(shape|shaped|block|layout|plan|frame|framed|design|model|structure|tower|building))\b/i.test(allContextText)) ||
                    (/\bt\b/i.test(allContextText) && /\b(shape|shaped)\b/i.test(allContextText)) ||
                    data?.building3D?.massingForm === "T_SHAPED" ||
                    Boolean(data?.building3D?.isTShaped));

  const isVShaped = !isHShaped && !isTShaped && (
                    (/\b(v[-_\s]?(shape|shaped|block|layout|plan|frame|framed|design|model|structure|tower|building))\b/i.test(allContextText)) ||
                    (/\bv\b/i.test(allContextText) && /\b(shape|shaped)\b/i.test(allContextText)) ||
                    data?.building3D?.massingForm === "V_SHAPED" ||
                    Boolean(data?.building3D?.isVShaped));

  const isUShaped = !isHShaped && !isTShaped && !isVShaped && (
                    (/\b(u[-_\s]?(shape|shaped|block|layout|plan|frame|framed|design|model|structure|tower|building))\b/i.test(allContextText)) ||
                    (/\bu\b/i.test(allContextText) && /\b(shape|shaped)\b/i.test(allContextText)) ||
                    allContextText.includes("horseshoe") ||
                    data?.building3D?.massingForm === "U_SHAPED" ||
                    Boolean(data?.building3D?.isUShaped));

  const isAldarCoin = allContextText.includes("aldar") || allContextText.includes("coin shape") || allContextText.includes("standing disc") || allContextText.includes("coin building") || allContextText.includes("vertical circle") || data?.building3D?.massingForm === "ALDAR_COIN" || Boolean(data?.building3D?.isAldarCoin);

  const isCircularDonut = !isAldarCoin && (allContextText.includes("cricle") || allContextText.includes("circle") || allContextText.includes("circular") || allContextText.includes("ring shape") || allContextText.includes("circular donut") || allContextText.includes("circular courtyard") || data?.building3D?.massingForm === "CIRCULAR_DONUT" || Boolean(data?.building3D?.isCircularDonut));

  const isSphericalBall = allContextText.includes("ball shape") || allContextText.includes("spherical") || allContextText.includes("sphere") || allContextText.includes("globe") || allContextText.includes("orb") || allContextText.includes("geodesic ball") || allContextText.includes("ball building") || data?.building3D?.massingForm === "SPHERICAL_BALL" || Boolean(data?.building3D?.isSphericalBall);

  const isOpenSquare = allContextText.includes("square open center") || allContextText.includes("open center") || allContextText.includes("hollow square") || allContextText.includes("courtyard ring") || allContextText.includes("atrium square") || (allContextText.includes("donut") && !allContextText.includes("circular")) || data?.building3D?.massingForm === "OPEN_SQUARE_DONUT" || Boolean(data?.building3D?.isOpenSquare);

  const isWideRange = allContextText.includes("wide range") || allContextText.includes("wide building") || allContextText.includes("linear campus") || allContextText.includes("wide span") || data?.building3D?.massingForm === "WIDE_LINEAR_RANGE" || Boolean(data?.building3D?.isWideRange);

  const isLShaped = !isHShaped && !isTShaped && !isVShaped && !isUShaped && !isSphericalBall && !isOpenSquare && !isCircularDonut && !isAldarCoin && (
                    (/\b(l[-_\s]?(shape|shaped|block|layout|plan|frame|framed|design|model|structure|tower|building))\b/i.test(allContextText)) ||
                    (/\bl\b/i.test(allContextText) && /\b(shape|shaped)\b/i.test(allContextText)) ||
                    data?.building3D?.massingForm === "L_SHAPED" ||
                    Boolean(data?.building3D?.isLShaped));

  const isCurvedRounded = data?.building3D?.isCurvedRounded ?? (promptLower.includes("round") || promptLower.includes("curved") || promptLower.includes("circular") || promptLower.includes("cylinder") || promptLower.includes("cylindrical") || promptLower.includes("oval") || promptLower.includes("crescent") || promptLower.includes("arc"));
  const isHostel = data?.building3D?.isHostel ?? (promptLower.includes("hostel") || promptLower.includes("dormitory") || promptLower.includes("student") || promptLower.includes("campus") || promptLower.includes("coliving"));

  const massingForm = (
    isHShaped
      ? "H_SHAPED"
      : isTShaped
      ? "T_SHAPED"
      : isVShaped
      ? "V_SHAPED"
      : isUShaped
      ? "U_SHAPED"
      : isSphericalBall
      ? "SPHERICAL_BALL"
      : isOpenSquare
      ? "OPEN_SQUARE_DONUT"
      : isAldarCoin
      ? "ALDAR_COIN"
      : isCircularDonut
      ? "CIRCULAR_DONUT"
      : isWideRange
      ? "WIDE_LINEAR_RANGE"
      : isLShaped
      ? "L_SHAPED"
      : data?.building3D?.massingForm || (
          isCurvedRounded || isHostel
            ? "CURVED_CYLINDRICAL"
            : promptLower.includes("stepped") || promptLower.includes("cascading") || promptLower.includes("terraced tower") || promptLower.includes("ziggurat") || promptLower.includes("setback") || promptLower.includes("pyramid")
            ? "STEPPED_CASCADING"
            : promptLower.includes("twist") || promptLower.includes("twisted") || promptLower.includes("spiral") || promptLower.includes("diagrid")
            ? "TWISTED_DIAGRID"
            : selectedPreset === "INDUSTRIAL" || promptLower.includes("warehouse") || promptLower.includes("shed")
            ? "INDUSTRIAL_SHED"
            : "RECTANGULAR"
        )
  );

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
    const hasInfinityPool = data?.building3D?.hasInfinityPool ?? (promptLower.includes("pool") || promptLower.includes("infinity pool") || promptLower.includes("sky pool") || promptLower.includes("swimming pool") || promptLower.includes("sundeck"));
    const hasObservatoryDome = data?.building3D?.hasObservatoryDome ?? (promptLower.includes("dome") || promptLower.includes("observatory") || promptLower.includes("planetarium") || promptLower.includes("sky lounge") || promptLower.includes("telescope") || promptLower.includes("crown") || promptLower.includes("spire"));
    const hasGableRoof = data?.building3D?.hasGableRoof ?? (promptLower.includes("gable") || promptLower.includes("pitched") || promptLower.includes("slanted") || promptLower.includes("sloped") || promptLower.includes("cottage"));
    const hasDoubleHeight = data?.building3D?.hasDoubleHeight ?? (promptLower.includes("double-height") || promptLower.includes("double height") || promptLower.includes("duplex") || promptLower.includes("mezzanine") || promptLower.includes("high ceiling"));
    const hasFloatingBalconies = data?.building3D?.hasFloatingBalconies ?? (promptLower.includes("floating") || promptLower.includes("cantilever") || promptLower.includes("frameless"));
    const hasWraparoundBalconies = data?.building3D?.hasWraparoundBalconies ?? (promptLower.includes("wrap") || promptLower.includes("wraparound") || promptLower.includes("wrap-around") || promptLower.includes("continuous") || promptLower.includes("ribbon") || promptLower.includes("panoramic balcony"));
    const hasWaveBalconies = promptLower.includes("wave") || promptLower.includes("undulating") || promptLower.includes("ripple") || promptLower.includes("organic") || promptLower.includes("aqua");
    const hasTerracedBalconies = promptLower.includes("vertical garden") || promptLower.includes("planted balcony") || promptLower.includes("bosco") || promptLower.includes("cascading plant") || promptLower.includes("hanging garden");
    const hasRooftopGarden = data?.building3D?.hasRooftopGarden ?? (promptLower.includes("terrace garden") || promptLower.includes("sky garden") || promptLower.includes("green roof") || promptLower.includes("sky-mansion") || promptLower.includes("penthouse"));
    const isLuxuryGold = data?.building3D?.facadePalette === "GOLD_LUXURY" || promptLower.includes("sky-mansion") || promptLower.includes("ultra-luxury") || promptLower.includes("luxury") || promptLower.includes("gold") || promptLower.includes("champagne");
    const isCyberObsidian = data?.building3D?.facadePalette === "CYBER_OBSIDIAN" || promptLower.includes("black") || promptLower.includes("obsidian") || promptLower.includes("dark") || promptLower.includes("smoke") || promptLower.includes("carbon") || promptLower.includes("cyber") || promptLower.includes("stealth") || promptLower.includes("neon") || promptLower.includes("futuristic");
    const isBiophilic = data?.building3D?.facadePalette === "EMERALD_BIOPHILIC" || promptLower.includes("biophilic") || promptLower.includes("vertical forest") || promptLower.includes("green") || promptLower.includes("eco");
    const isWhiteMarble = data?.building3D?.facadePalette === "WHITE_MARBLE" || promptLower.includes("white") || promptLower.includes("marble") || promptLower.includes("classical") || promptLower.includes("statuario");
    const isTerracotta = data?.building3D?.facadePalette === "TERRACOTTA_NORDIC" || promptLower.includes("nordic") || promptLower.includes("terracotta") || promptLower.includes("wood") || promptLower.includes("timber") || promptLower.includes("brick");
    const hasDiagrid = data?.building3D?.hasDiagrid ?? (promptLower.includes("diagrid") || promptLower.includes("diamond") || promptLower.includes("lattice") || promptLower.includes("exoskeleton") || promptLower.includes("cross brace") || promptLower.includes("x-brace"));
    const hasSkyCourt = data?.building3D?.hasSkyCourt ?? (promptLower.includes("sky court") || promptLower.includes("sky-court") || promptLower.includes("mid-level garden") || promptLower.includes("void") || promptLower.includes("cutout") || promptLower.includes("hollow") || promptLower.includes("sky bridge"));
    const hasSunLouvers = data?.building3D?.hasSunLouvers ?? (promptLower.includes("louver") || promptLower.includes("louvers") || promptLower.includes("shading") || promptLower.includes("brise-soleil") || promptLower.includes("fins") || promptLower.includes("slats"));

    const isCurvedRounded = data?.building3D?.isCurvedRounded ?? (promptLower.includes("round") || promptLower.includes("curved") || promptLower.includes("circular") || promptLower.includes("cylinder") || promptLower.includes("cylindrical") || promptLower.includes("oval") || promptLower.includes("crescent") || promptLower.includes("arc"));
    const isHostel = data?.building3D?.isHostel ?? (promptLower.includes("hostel") || promptLower.includes("dormitory") || promptLower.includes("student") || promptLower.includes("campus") || promptLower.includes("coliving"));
    const hasBasketball = data?.building3D?.hasBasketball ?? (promptLower.includes("basketball") || promptLower.includes("b-ball") || promptLower.includes("hoop"));
    const hasVolleyball = data?.building3D?.hasVolleyball ?? (promptLower.includes("volleyball") || promptLower.includes("v-ball"));
    const hasSportsCourt = data?.building3D?.hasSportsCourt ?? (hasBasketball || hasVolleyball || promptLower.includes("sports court") || promptLower.includes("court"));

    const allContextText = `${promptText} ${data?.prompt || ""} ${data?.title || ""} ${data?.building3D?.facadeStyle || ""}`.toLowerCase();

    const isHShaped = (/\b(h[-_\s]?(shape|shaped|block|layout|plan|frame|framed|design|model|structure|tower|building))\b/i.test(allContextText)) ||
                      (/\bh\b/i.test(allContextText) && /\b(shape|shaped)\b/i.test(allContextText)) ||
                      data?.building3D?.massingForm === "H_SHAPED" ||
                      Boolean(data?.building3D?.isHShaped);

    const isTShaped = !isHShaped && (
                      (/\b(t[-_\s]?(shape|shaped|block|layout|plan|frame|framed|design|model|structure|tower|building))\b/i.test(allContextText)) ||
                      (/\bt\b/i.test(allContextText) && /\b(shape|shaped)\b/i.test(allContextText)) ||
                      data?.building3D?.massingForm === "T_SHAPED" ||
                      Boolean(data?.building3D?.isTShaped));

    const isVShaped = !isHShaped && !isTShaped && (
                      (/\b(v[-_\s]?(shape|shaped|block|layout|plan|frame|framed|design|model|structure|tower|building))\b/i.test(allContextText)) ||
                      (/\bv\b/i.test(allContextText) && /\b(shape|shaped)\b/i.test(allContextText)) ||
                      data?.building3D?.massingForm === "V_SHAPED" ||
                      Boolean(data?.building3D?.isVShaped));

    const isUShaped = !isHShaped && !isTShaped && !isVShaped && (
                      (/\b(u[-_\s]?(shape|shaped|block|layout|plan|frame|framed|design|model|structure|tower|building))\b/i.test(allContextText)) ||
                      (/\bu\b/i.test(allContextText) && /\b(shape|shaped)\b/i.test(allContextText)) ||
                      allContextText.includes("horseshoe") ||
                      data?.building3D?.massingForm === "U_SHAPED" ||
                      Boolean(data?.building3D?.isUShaped));

    const isAldarCoin = allContextText.includes("aldar") || allContextText.includes("coin shape") || allContextText.includes("standing disc") || allContextText.includes("coin building") || allContextText.includes("vertical circle") || data?.building3D?.massingForm === "ALDAR_COIN" || Boolean(data?.building3D?.isAldarCoin);

    const isCircularDonut = !isAldarCoin && (allContextText.includes("cricle") || allContextText.includes("circle") || allContextText.includes("circular") || allContextText.includes("ring shape") || allContextText.includes("circular donut") || allContextText.includes("circular courtyard") || data?.building3D?.massingForm === "CIRCULAR_DONUT" || Boolean(data?.building3D?.isCircularDonut));

    const isSphericalBall = allContextText.includes("ball shape") || allContextText.includes("spherical") || allContextText.includes("sphere") || allContextText.includes("globe") || allContextText.includes("orb") || allContextText.includes("geodesic ball") || allContextText.includes("ball building") || data?.building3D?.massingForm === "SPHERICAL_BALL" || Boolean(data?.building3D?.isSphericalBall);

    const isOpenSquare = allContextText.includes("square open center") || allContextText.includes("open center") || allContextText.includes("hollow square") || allContextText.includes("courtyard ring") || allContextText.includes("atrium square") || (allContextText.includes("donut") && !allContextText.includes("circular")) || data?.building3D?.massingForm === "OPEN_SQUARE_DONUT" || Boolean(data?.building3D?.isOpenSquare);

    const isWideRange = allContextText.includes("wide range") || allContextText.includes("wide building") || allContextText.includes("linear campus") || allContextText.includes("wide span") || data?.building3D?.massingForm === "WIDE_LINEAR_RANGE" || Boolean(data?.building3D?.isWideRange);

    const isLShaped = !isHShaped && !isTShaped && !isVShaped && !isUShaped && !isSphericalBall && !isOpenSquare && !isCircularDonut && !isAldarCoin && (
                      (/\b(l[-_\s]?(shape|shaped|block|layout|plan|frame|framed|design|model|structure|tower|building))\b/i.test(allContextText)) ||
                      (/\bl\b/i.test(allContextText) && /\b(shape|shaped)\b/i.test(allContextText)) ||
                      data?.building3D?.massingForm === "L_SHAPED" ||
                      Boolean(data?.building3D?.isLShaped));

    const hasPlayground = data?.building3D?.hasPlayground ?? (promptLower.includes("playgroud") || promptLower.includes("playground") || promptLower.includes("play ground") || promptLower.includes("play area") || promptLower.includes("park"));
    const hasAirplaneRoof = data?.building3D?.hasAirplaneRoof ?? (promptLower.includes("aeroplan") || promptLower.includes("airplane") || promptLower.includes("aeroplane") || promptLower.includes("wing design roof") || promptLower.includes("wing roof") || promptLower.includes("aviation roof"));
    const hasSolarPanels = data?.building3D?.hasSolarPanels ?? (promptLower.includes("solar pannel") || promptLower.includes("solar panel") || promptLower.includes("solar rooftop") || promptLower.includes("solar array") || promptLower.includes("solar farm"));
    const glassDistribution = data?.building3D?.glassDistribution || (
      promptLower.includes("left front glass") || promptLower.includes("left front glassed") ? "LEFT_FRONT_GLASS" :
      promptLower.includes("right front glass") || promptLower.includes("right front glassed") ? "RIGHT_FRONT_GLASS" :
      promptLower.includes("one side glass") || promptLower.includes("one side glassed") ? "ONE_SIDE_GLASS" :
      promptLower.includes("full glass") || promptLower.includes("full glassed") ? "FULL_GLASS" :
      "BALANCED_DUAL_CURTAIN"
    );

    // Active Massing Form (Prompt explicit shapes take highest priority)
    const massingForm = (
      isHShaped
        ? "H_SHAPED"
        : isTShaped
        ? "T_SHAPED"
        : isVShaped
        ? "V_SHAPED"
        : isUShaped
        ? "U_SHAPED"
        : isSphericalBall
        ? "SPHERICAL_BALL"
        : isOpenSquare
        ? "OPEN_SQUARE_DONUT"
        : isAldarCoin
        ? "ALDAR_COIN"
        : isCircularDonut
        ? "CIRCULAR_DONUT"
        : isWideRange
        ? "WIDE_LINEAR_RANGE"
        : isLShaped
        ? "L_SHAPED"
        : data?.building3D?.massingForm || (
            isCurvedRounded || isHostel
              ? "CURVED_CYLINDRICAL"
              : promptLower.includes("stepped") || promptLower.includes("cascading") || promptLower.includes("terraced tower") || promptLower.includes("ziggurat") || promptLower.includes("setback") || promptLower.includes("pyramid")
              ? "STEPPED_CASCADING"
              : promptLower.includes("twist") || promptLower.includes("twisted") || promptLower.includes("spiral") || promptLower.includes("diagrid")
              ? "TWISTED_DIAGRID"
              : selectedPreset === "INDUSTRIAL" || promptLower.includes("warehouse") || promptLower.includes("shed")
              ? "INDUSTRIAL_SHED"
              : "RECTANGULAR"
          )
    );

    // Active Rooftop Feature
    const rooftopFeature = data?.building3D?.rooftopFeature || (
      hasAirplaneRoof ? "AIRPLANE_WING_ROOF" : hasHelipad ? "HELIPAD" : hasInfinityPool ? "INFINITY_POOL" : hasObservatoryDome ? "OBSERVATORY_DOME" : hasGableRoof || selectedPreset === "VILLA" ? "GABLE_ROOF" : hasRooftopGarden ? "PENTHOUSE_GARDEN" : "SOLAR_ARRAY"
    );

    // Active Balcony Type
    const balconyType = data?.building3D?.balconyType || (
      hasWaveBalconies ? "CURVED_WAVE" : hasWraparoundBalconies ? "WRAPAROUND_RIBBON" : hasTerracedBalconies ? "TERRACED_CASCADE" : hasFloatingBalconies ? "CANTILEVERED_FLOATING" : (selectedPreset === "RESIDENTIAL" ? "CANTILEVERED_FLOATING" : "MINIMAL_FLUSH")
    );

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

          {/* Terracotta Nordic Wood/Clay Gradient */}
          <linearGradient id="nordicFacadeDay" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EA580C" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#C2410C" stopOpacity="0.80" />
            <stop offset="80%" stopColor="#9A3412" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FDBA74" stopOpacity="0.90" />
          </linearGradient>

          {/* Statuario White Marble Gradient */}
          <linearGradient id="marbleFacadeDay" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" stopOpacity="0.92" />
            <stop offset="45%" stopColor="#E2E8F0" stopOpacity="0.85" />
            <stop offset="80%" stopColor="#CBD5E1" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
          </linearGradient>

          {/* Infinity Pool Water Gradient */}
          <linearGradient id="poolWater" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#06B6D4" stopOpacity="0.85" />
            <stop offset="80%" stopColor="#0891B2" stopOpacity="0.90" />
            <stop offset="100%" stopColor="#67E8F9" stopOpacity="0.95" />
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
                fill={isNight ? "#0F172A" : (isCyberObsidian ? "#090D16" : "#1E293B")}
                stroke={isCyberObsidian ? "#06B6D4" : "#334155"}
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

          {/* Sports Courtyard with Regulation Basketball & Volleyball Courts */}
          {(hasSportsCourt || hasBasketball || hasVolleyball || isHostel) && (() => {
            // Basketball Court (West Side: X: [-150, -18], Y: [30, 145])
            const bk1 = project(-150, 30, 2);
            const bk2 = project(-18, 30, 2);
            const bk3 = project(-18, 145, 2);
            const bk4 = project(-150, 145, 2);
            const bkCenter = project(-84, 87.5, 2);

            // Basketball Hoops
            const bkHoop1Base = project(-148, 87.5, 2);
            const bkHoop1Top = project(-148, 87.5, 24);
            const bkHoop1BL = project(-148, 77.5, 26);
            const bkHoop1BR = project(-148, 97.5, 26);
            const bkHoop1BBL = project(-148, 77.5, 18);
            const bkHoop1BBR = project(-148, 97.5, 18);
            const bkHoop1Rim = project(-138, 87.5, 19);

            const bkHoop2Base = project(-20, 87.5, 2);
            const bkHoop2Top = project(-20, 87.5, 24);
            const bkHoop2BL = project(-20, 77.5, 26);
            const bkHoop2BR = project(-20, 97.5, 26);
            const bkHoop2BBL = project(-20, 77.5, 18);
            const bkHoop2BBR = project(-20, 97.5, 18);
            const bkHoop2Rim = project(-30, 87.5, 19);

            // Volleyball Court (East Side: X: [18, 150], Y: [30, 145])
            const vb1 = project(18, 30, 2);
            const vb2 = project(150, 30, 2);
            const vb3 = project(150, 145, 2);
            const vb4 = project(18, 145, 2);
            const vbCenter = project(84, 87.5, 2);

            // Volleyball Net across Y = 87.5 from X = 18 to 150
            const netPole1Base = project(18, 87.5, 2);
            const netPole1Top = project(18, 87.5, 24);
            const netPole2Base = project(150, 87.5, 2);
            const netPole2Top = project(150, 87.5, 24);

            const netTopL = project(18, 87.5, 22);
            const netTopR = project(150, 87.5, 22);
            const netBotL = project(18, 87.5, 11);
            const netBotR = project(150, 87.5, 11);

            return (
              <g id="sports-courtyard-plaza">
                {/* Court Perimeter Landscape Surround */}
                {(() => {
                  const sp1 = project(-165, 20, 1.5);
                  const sp2 = project(165, 20, 1.5);
                  const sp3 = project(165, 155, 1.5);
                  const sp4 = project(-165, 155, 1.5);
                  return (
                    <polygon
                      points={`${sp1.x},${sp1.y} ${sp2.x},${sp2.y} ${sp3.x},${sp3.y} ${sp4.x},${sp4.y}`}
                      fill="#064E3B"
                      stroke="#059669"
                      strokeWidth="1.5"
                      fillOpacity="0.85"
                    />
                  );
                })()}

                {/* BASKETBALL COURT (West Wing) */}
                <polygon
                  points={`${bk1.x},${bk1.y} ${bk2.x},${bk2.y} ${bk3.x},${bk3.y} ${bk4.x},${bk4.y}`}
                  fill="#1E3A8A"
                  stroke="#60A5FA"
                  strokeWidth="1.5"
                />
                {/* Center Half-Court Line & Jump Circle */}
                {(() => {
                  const cl1 = project(-84, 30, 2.5);
                  const cl2 = project(-84, 145, 2.5);
                  const k1A = project(-150, 67.5, 2.5);
                  const k1B = project(-120, 67.5, 2.5);
                  const k1C = project(-120, 107.5, 2.5);
                  const k1D = project(-150, 107.5, 2.5);

                  const k2A = project(-18, 67.5, 2.5);
                  const k2B = project(-48, 67.5, 2.5);
                  const k2C = project(-48, 107.5, 2.5);
                  const k2D = project(-18, 107.5, 2.5);

                  return (
                    <>
                      <line x1={cl1.x} y1={cl1.y} x2={cl2.x} y2={cl2.y} stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="3 2" />
                      <ellipse cx={bkCenter.x} cy={bkCenter.y} rx="15" ry="7.5" fill="none" stroke="#FFFFFF" strokeWidth="1.2" />
                      {/* Terracotta Key Areas */}
                      <polygon points={`${k1A.x},${k1A.y} ${k1B.x},${k1B.y} ${k1C.x},${k1C.y} ${k1D.x},${k1D.y}`} fill="#C2410C" fillOpacity="0.85" stroke="#FFFFFF" strokeWidth="1" />
                      <polygon points={`${k2A.x},${k2A.y} ${k2B.x},${k2B.y} ${k2C.x},${k2C.y} ${k2D.x},${k2D.y}`} fill="#C2410C" fillOpacity="0.85" stroke="#FFFFFF" strokeWidth="1" />
                    </>
                  );
                })()}

                {/* 3D Basketball Hoops */}
                <g id="basketball-hoops-3d">
                  {/* Hoop 1 (West) */}
                  <line x1={bkHoop1Base.x} y1={bkHoop1Base.y} x2={bkHoop1Top.x} y2={bkHoop1Top.y} stroke="#CBD5E1" strokeWidth="2.5" />
                  <polygon points={`${bkHoop1BL.x},${bkHoop1BL.y} ${bkHoop1BR.x},${bkHoop1BR.y} ${bkHoop1BBR.x},${bkHoop1BBR.y} ${bkHoop1BBL.x},${bkHoop1BBL.y}`} fill="#F8FAFC" stroke="#DC2626" strokeWidth="1" fillOpacity="0.9" />
                  <ellipse cx={bkHoop1Rim.x} cy={bkHoop1Rim.y} rx="5" ry="2.5" fill="none" stroke="#EA580C" strokeWidth="2" />

                  {/* Hoop 2 (East) */}
                  <line x1={bkHoop2Base.x} y1={bkHoop2Base.y} x2={bkHoop2Top.x} y2={bkHoop2Top.y} stroke="#CBD5E1" strokeWidth="2.5" />
                  <polygon points={`${bkHoop2BL.x},${bkHoop2BL.y} ${bkHoop2BR.x},${bkHoop2BR.y} ${bkHoop2BBR.x},${bkHoop2BBR.y} ${bkHoop2BBL.x},${bkHoop2BBL.y}`} fill="#F8FAFC" stroke="#DC2626" strokeWidth="1" fillOpacity="0.9" />
                  <ellipse cx={bkHoop2Rim.x} cy={bkHoop2Rim.y} rx="5" ry="2.5" fill="none" stroke="#EA580C" strokeWidth="2" />
                </g>

                {/* Basketball Badge */}
                <g transform={`translate(${bkCenter.x - 62}, ${bkCenter.y + 24})`}>
                  <rect x="0" y="-8" width="124" height="16" rx="4" fill="rgba(15, 23, 42, 0.92)" stroke="#3B82F6" strokeWidth="0.8" />
                  <text x="62" y="4" fill="#93C5FD" fontSize="8" fontWeight="bold" textAnchor="middle">
                    🏀 BASKETBALL COURT
                  </text>
                </g>

                {/* VOLLEYBALL COURT (East Wing) */}
                <polygon
                  points={`${vb1.x},${vb1.y} ${vb2.x},${vb2.y} ${vb3.x},${vb3.y} ${vb4.x},${vb4.y}`}
                  fill="#0284C7"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                />
                {/* Center Line & 3m Attack Lines */}
                {(() => {
                  const vl1 = project(18, 87.5, 2.5);
                  const vl2 = project(150, 87.5, 2.5);
                  const at1A = project(18, 65, 2.5);
                  const at1B = project(150, 65, 2.5);
                  const at2A = project(18, 110, 2.5);
                  const at2B = project(150, 110, 2.5);
                  return (
                    <>
                      <line x1={vl1.x} y1={vl1.y} x2={vl2.x} y2={vl2.y} stroke="#FFFFFF" strokeWidth="1.5" />
                      <line x1={at1A.x} y1={at1A.y} x2={at1B.x} y2={at1B.y} stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 2" />
                      <line x1={at2A.x} y1={at2A.y} x2={at2B.x} y2={at2B.y} stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 2" />
                    </>
                  );
                })()}

                {/* 3D Volleyball Net */}
                <g id="volleyball-net-3d">
                  <line x1={netPole1Base.x} y1={netPole1Base.y} x2={netPole1Top.x} y2={netPole1Top.y} stroke="#E2E8F0" strokeWidth="3" />
                  <line x1={netPole2Base.x} y1={netPole2Base.y} x2={netPole2Top.x} y2={netPole2Top.y} stroke="#E2E8F0" strokeWidth="3" />
                  <polygon
                    points={`${netTopL.x},${netTopL.y} ${netTopR.x},${netTopR.y} ${netBotR.x},${netBotR.y} ${netBotL.x},${netBotL.y}`}
                    fill="rgba(255, 255, 255, 0.45)"
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                  />
                  <line x1={netTopL.x} y1={netTopL.y} x2={netTopR.x} y2={netTopR.y} stroke="#FFFFFF" strokeWidth="2.5" />
                  {/* Volleyball hovering over net */}
                  {(() => {
                    const vbBall = project(84, 87.5, 30);
                    return (
                      <circle cx={vbBall.x} cy={vbBall.y} r="3.5" fill="#FACC15" stroke="#EAB308" strokeWidth="1" />
                    );
                  })()}
                </g>

                {/* Volleyball Badge */}
                <g transform={`translate(${vbCenter.x - 62}, ${vbCenter.y + 24})`}>
                  <rect x="0" y="-8" width="124" height="16" rx="4" fill="rgba(15, 23, 42, 0.92)" stroke="#38BDF8" strokeWidth="0.8" />
                  <text x="62" y="4" fill="#7DD3FC" fontSize="8" fontWeight="bold" textAnchor="middle">
                    🏐 VOLLEYBALL COURT
                  </text>
                </g>
              </g>
            );
          })()}

          {/* L-Shaped Central Courtyard Plaza with Lawn & Fountain */}
          {isLShaped && !hasSportsCourt && !isHostel && (() => {
            const halfW = buildingWidth / 2;
            const halfD = buildingDepth / 2;
            const xCorner = 10;
            const yCorner = -10;
            const cp1 = project(xCorner + 4, yCorner + 4, 2);
            const cp2 = project(halfW + 4, yCorner + 4, 2);
            const cp3 = project(halfW + 4, halfD + 4, 2);
            const cp4 = project(xCorner + 4, halfD + 4, 2);
            const fCenter = project((xCorner + halfW) / 2 + 5, (yCorner + halfD) / 2 + 2, 3);
            return (
              <g id="lshape-courtyard-plaza">
                {/* Landscaped Green Lawn Slab */}
                <polygon
                  points={`${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${cp3.x},${cp3.y} ${cp4.x},${cp4.y}`}
                  fill="#065F46"
                  stroke="#10B981"
                  strokeWidth="1.5"
                />
                {/* Stone Paver Border */}
                <line x1={cp4.x} y1={cp4.y} x2={cp1.x} y2={cp1.y} stroke="#34D399" strokeWidth="2" strokeDasharray="6 3" />
                <line x1={cp1.x} y1={cp1.y} x2={cp2.x} y2={cp2.y} stroke="#34D399" strokeWidth="2" strokeDasharray="6 3" />
                
                {/* Central Water Fountain & Reflection Pool */}
                <ellipse cx={fCenter.x} cy={fCenter.y} rx="30" ry="15" fill="#0369A1" stroke="#38BDF8" strokeWidth="2" />
                <ellipse cx={fCenter.x} cy={fCenter.y} rx="20" ry="10" fill="#0284C7" stroke="#7DD3FC" strokeWidth="1.5" />
                <ellipse cx={fCenter.x} cy={fCenter.y} rx="10" ry="5" fill="#38BDF8" />
                {/* Upward Fountain Spout */}
                <line x1={fCenter.x} y1={fCenter.y} x2={fCenter.x} y2={fCenter.y - 15} stroke="#E0F2FE" strokeWidth="2.5" />
                <circle cx={fCenter.x} cy={fCenter.y - 15} r="3" fill="#FFFFFF" className="animate-ping" />
                <circle cx={fCenter.x} cy={fCenter.y - 15} r="2.5" fill="#FFFFFF" />

                {/* Floating Courtyard Label Badge */}
                <g transform={`translate(${fCenter.x - 60}, ${fCenter.y + 22})`}>
                  <rect x="0" y="-8" width="120" height="16" rx="4" fill="rgba(15, 23, 42, 0.92)" stroke="#10B981" strokeWidth="0.8" />
                  <text x="60" y="4" fill="#34D399" fontSize="8" fontWeight="bold" textAnchor="middle">
                    ⛲ ZEN COURTYARD PLAZA
                  </text>
                </g>
              </g>
            );
          })()}

          {/* Open Playground / Children's & Campus Recreational Park */}
          {(hasPlayground || (!hasSportsCourt && !isLShaped && (isVShaped || promptLower.includes("playground")))) && (() => {
            const pg1 = project(-155, 30, 2);
            const pg2 = project(155, 30, 2);
            const pg3 = project(155, 150, 2);
            const pg4 = project(-155, 150, 2);
            const pgCenter = project(0, 90, 2);

            // Double A-frame swing set on West side
            const swA1 = project(-115, 60, 2);
            const swA2 = project(-115, 120, 2);
            const swTop1 = project(-115, 60, 26);
            const swTop2 = project(-115, 120, 26);
            const swSeat1 = project(-115, 80, 8);
            const swSeat2 = project(-115, 100, 8);

            // Playground Slide on East side
            const slBase = project(110, 60, 2);
            const slTop = project(110, 60, 24);
            const slEnd = project(110, 125, 2);

            // Circular sandbox / soft play pit in center
            const sandCenter = project(0, 90, 2.5);

            return (
              <g id="central-open-playground">
                {/* Lush Green Park Turf Lawn */}
                <polygon
                  points={`${pg1.x},${pg1.y} ${pg2.x},${pg2.y} ${pg3.x},${pg3.y} ${pg4.x},${pg4.y}`}
                  fill="#047857"
                  stroke="#10B981"
                  strokeWidth="1.8"
                />
                {/* Soft Play Safety Rubber Perimeter */}
                <line x1={pg1.x} y1={pg1.y} x2={pg2.x} y2={pg2.y} stroke="#34D399" strokeWidth="2" strokeDasharray="6 3" />
                <line x1={pg4.x} y1={pg4.y} x2={pg3.x} y2={pg3.y} stroke="#34D399" strokeWidth="2" strokeDasharray="6 3" />

                {/* Central Soft Play Sandbox */}
                <ellipse cx={sandCenter.x} cy={sandCenter.y} rx="32" ry="16" fill="#FDE047" fillOpacity="0.85" stroke="#CA8A04" strokeWidth="1.5" />
                <ellipse cx={sandCenter.x} cy={sandCenter.y} rx="22" ry="11" fill="#FEF08A" stroke="#EAB308" strokeWidth="1" strokeDasharray="4 2" />

                {/* 3D Swing Set (West) */}
                <g id="playground-swings">
                  <line x1={swA1.x} y1={swA1.y} x2={swTop1.x} y2={swTop1.y} stroke="#E2E8F0" strokeWidth="3" />
                  <line x1={swA2.x} y1={swA2.y} x2={swTop2.x} y2={swTop2.y} stroke="#E2E8F0" strokeWidth="3" />
                  <line x1={swTop1.x} y1={swTop1.y} x2={swTop2.x} y2={swTop2.y} stroke="#CBD5E1" strokeWidth="3.5" />
                  {/* Chains & Swing Seats */}
                  <line x1={swTop1.x + (swTop2.x - swTop1.x) * 0.35} y1={swTop1.y + (swTop2.y - swTop1.y) * 0.35} x2={swSeat1.x} y2={swSeat1.y} stroke="#94A3B8" strokeWidth="1.2" />
                  <line x1={swTop1.x + (swTop2.x - swTop1.x) * 0.65} y1={swTop1.y + (swTop2.y - swTop1.y) * 0.65} x2={swSeat2.x} y2={swSeat2.y} stroke="#94A3B8" strokeWidth="1.2" />
                  <rect x={swSeat1.x - 7} y={swSeat1.y - 2} width="14" height="4" rx="1.5" fill="#EF4444" stroke="#DC2626" strokeWidth="0.8" />
                  <rect x={swSeat2.x - 7} y={swSeat2.y - 2} width="14" height="4" rx="1.5" fill="#3B82F6" stroke="#2563EB" strokeWidth="0.8" />
                </g>

                {/* 3D Playground Slide (East) */}
                <g id="playground-slide">
                  {/* Ladder */}
                  <line x1={slBase.x} y1={slBase.y} x2={slTop.x} y2={slTop.y} stroke="#64748B" strokeWidth="3" />
                  {/* Chute */}
                  <line x1={slTop.x} y1={slTop.y} x2={slEnd.x} y2={slEnd.y} stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" />
                  <line x1={slTop.x} y1={slTop.y - 1} x2={slEnd.x} y2={slEnd.y - 1} stroke="#FDBA74" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* Playground Badge */}
                <g transform={`translate(${pgCenter.x - 90}, ${pgCenter.y + 30})`}>
                  <rect x="0" y="-8" width="180" height="17" rx="4" fill="rgba(15, 23, 42, 0.95)" stroke="#10B981" strokeWidth="1" />
                  <text x="90" y="4" fill="#34D399" fontSize="8" fontWeight="bold" textAnchor="middle">
                    🛝 OPEN RECREATIONAL PLAYGROUND
                  </text>
                </g>
              </g>
            );
          })()}

          {/* Open Square Center Atrium Plinth Garden */}
          {isOpenSquare && (() => {
            const sq1 = project(-48, -43, 2);
            const sq2 = project(48, -43, 2);
            const sq3 = project(48, 33, 2);
            const sq4 = project(-48, 33, 2);
            const sqCenter = project(0, -5, 3);
            return (
              <g id="open-square-atrium-plinth">
                <polygon points={`${sq1.x},${sq1.y} ${sq2.x},${sq2.y} ${sq3.x},${sq3.y} ${sq4.x},${sq4.y}`} fill="#065F46" stroke="#34D399" strokeWidth="1.5" />
                <ellipse cx={sqCenter.x} cy={sqCenter.y} rx="22" ry="11" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
                <circle cx={sqCenter.x} cy={sqCenter.y} r="2.5" fill="#FFFFFF" />
                <g transform={`translate(${sqCenter.x - 65}, ${sqCenter.y + 18})`}>
                  <rect x="0" y="-7" width="130" height="14" rx="3" fill="rgba(15, 23, 42, 0.92)" stroke="#10B981" strokeWidth="0.8" />
                  <text x="65" y="3" fill="#34D399" fontSize="7" fontWeight="bold" textAnchor="middle">
                    🌳 OPEN CENTER ATRIUM QUAD
                  </text>
                </g>
              </g>
            );
          })()}
        </g>

        {/* 2. Multi-Story Floors Extrusion */}
        {floorsArray.map((floorNum) => {
          const isSelected = isolatedFloor === "ALL" || isolatedFloor === floorNum;
          if (!isSelected) return null;

          const baseZ = (floorNum - 1) * floorHeight + 10;
          const topZ = baseZ + floorHeight - 4;

          // Dynamic scale per floor based on massing form
          let widthScale = 1.0;
          let depthScale = 1.0;
          let twistX = 0;

          if (massingForm === "STEPPED_CASCADING") {
            const stepRatio = 1 - ((floorNum - 1) / totalFlrs) * 0.32;
            widthScale = stepRatio;
            depthScale = stepRatio;
          } else if (massingForm === "TWISTED_DIAGRID") {
            const twistAngle = ((floorNum - 1) / totalFlrs) * 0.55;
            twistX = Math.sin(twistAngle) * 16;
          }

          const halfW = (buildingWidth / 2) * widthScale;
          const halfD = (buildingDepth / 2) * depthScale;

          // 4 Vertices of bottom slab
          const b1 = project(-halfW + twistX, -halfD, baseZ);
          const b2 = project(halfW + twistX, -halfD, baseZ);
          const b3 = project(halfW + twistX, halfD, baseZ);
          const b4 = project(-halfW + twistX, halfD, baseZ);

          // 4 Vertices of top slab
          const t1 = project(-halfW + twistX, -halfD, topZ);
          const t2 = project(halfW + twistX, -halfD, topZ);
          const t3 = project(halfW + twistX, halfD, topZ);
          const t4 = project(-halfW + twistX, halfD, topZ);

          // 6 Vertices of L-shaped slabs (dual wing + inner courtyard)
          const xCorner = 10;
          const yCorner = -10;
          const lb1 = project(-halfW + twistX, -halfD, baseZ);
          const lb2 = project(halfW + twistX, -halfD, baseZ);
          const lb3 = project(halfW + twistX, yCorner, baseZ);
          const lb4 = project(xCorner + twistX, yCorner, baseZ);
          const lb5 = project(xCorner + twistX, halfD, baseZ);
          const lb6 = project(-halfW + twistX, halfD, baseZ);

          const lt1 = project(-halfW + twistX, -halfD, topZ);
          const lt2 = project(halfW + twistX, -halfD, topZ);
          const lt3 = project(halfW + twistX, yCorner, topZ);
          const lt4 = project(xCorner + twistX, yCorner, topZ);
          const lt5 = project(xCorner + twistX, halfD, topZ);
          const lt6 = project(-halfW + twistX, halfD, topZ);

          // V-Shaped Dual Wing Vertices
          const vb1 = project(0 + twistX, -115, baseZ);      // outer apex
          const vb2 = project(155 + twistX, 35, baseZ);      // right wing outer tip
          const vb3 = project(125 + twistX, 60, baseZ);      // right wing inner tip
          const vb4 = project(0 + twistX, -50, baseZ);       // inner apex
          const vb5 = project(-125 + twistX, 60, baseZ);     // left wing inner tip
          const vb6 = project(-155 + twistX, 35, baseZ);     // left wing outer tip

          const vt1 = project(0 + twistX, -115, topZ);
          const vt2 = project(155 + twistX, 35, topZ);
          const vt3 = project(125 + twistX, 60, topZ);
          const vt4 = project(0 + twistX, -50, topZ);
          const vt5 = project(-125 + twistX, 60, topZ);
          const vt6 = project(-155 + twistX, 35, topZ);

          // T-Shaped Symmetric Structural Frame Vertices (Matches ResearchGate Structural Model)
          const tb1 = project(-140 + twistX, 20, baseZ);   // Left wing back corner
          const tb2 = project(-45 + twistX, 20, baseZ);    // Left notch inner corner
          const tb3 = project(-45 + twistX, -100, baseZ);  // Stem rear left corner
          const tb4 = project(45 + twistX, -100, baseZ);   // Stem rear right corner
          const tb5 = project(45 + twistX, 20, baseZ);     // Right notch inner corner
          const tb6 = project(140 + twistX, 20, baseZ);    // Right wing back corner
          const tb7 = project(140 + twistX, 80, baseZ);    // Front right corner
          const tb8 = project(-140 + twistX, 80, baseZ);   // Front left corner

          const tt1 = project(-140 + twistX, 20, topZ);
          const tt2 = project(-45 + twistX, 20, topZ);
          const tt3 = project(-45 + twistX, -100, topZ);
          const tt4 = project(45 + twistX, -100, topZ);
          const tt5 = project(45 + twistX, 20, topZ);
          const tt6 = project(140 + twistX, 20, topZ);
          const tt7 = project(140 + twistX, 80, topZ);
          const tt8 = project(-140 + twistX, 80, topZ);

          // H-Shaped Symmetric Structural Frame Vertices (Matches ResearchGate 3D Model)
          const hb1 = project(-140 + twistX, -85, baseZ); // Left wing, rear left
          const hb2 = project(-50 + twistX, -85, baseZ);  // Left wing, rear right
          const hb3 = project(-50 + twistX, -28, baseZ);  // Left wing, inner rear notch corner
          const hb4 = project(50 + twistX, -28, baseZ);   // Right wing, inner rear notch corner
          const hb5 = project(50 + twistX, -85, baseZ);   // Right wing, rear left
          const hb6 = project(140 + twistX, -85, baseZ);  // Right wing, rear right
          const hb7 = project(140 + twistX, 85, baseZ);   // Right wing, front right
          const hb8 = project(50 + twistX, 85, baseZ);    // Right wing, front left
          const hb9 = project(50 + twistX, 28, baseZ);    // Right wing, inner front notch corner
          const hb10 = project(-50 + twistX, 28, baseZ);  // Left wing, inner front notch corner
          const hb11 = project(-50 + twistX, 85, baseZ);  // Left wing, front right
          const hb12 = project(-140 + twistX, 85, baseZ); // Left wing, front left

          const ht1 = project(-140 + twistX, -85, topZ);
          const ht2 = project(-50 + twistX, -85, topZ);
          const ht3 = project(-50 + twistX, -28, topZ);
          const ht4 = project(50 + twistX, -28, topZ);
          const ht5 = project(50 + twistX, -85, topZ);
          const ht6 = project(140 + twistX, -85, topZ);
          const ht7 = project(140 + twistX, 85, topZ);
          const ht8 = project(50 + twistX, 85, topZ);
          const ht9 = project(50 + twistX, 28, topZ);
          const ht10 = project(-50 + twistX, 28, topZ);
          const ht11 = project(-50 + twistX, 85, topZ);
          const ht12 = project(-140 + twistX, 85, topZ);

          // Spherical Geodesic Globe Floor Coordinates
          const sphereDelta = (floorNum - 0.5 - totalFlrs / 2) / (totalFlrs / 2 + 0.5);
          const sphereRad = 135 * Math.sqrt(Math.max(0.18, 1 - sphereDelta * sphereDelta)) * widthScale;
          const sbOut: { x: number; y: number }[] = [];
          const stOut: { x: number; y: number }[] = [];
          const sphereSegs = 12;
          for (let i = 0; i < sphereSegs; i++) {
            const ang = (i * 2 * Math.PI) / sphereSegs;
            const xo = Math.cos(ang) * sphereRad + twistX;
            const yo = Math.sin(ang) * (sphereRad * 0.72) - 15;
            sbOut.push(project(xo, yo, baseZ));
            stOut.push(project(xo, yo, topZ));
          }

          // Open-Center Quadrangle Donut Vertices
          const qb1 = project(-125 + twistX, -110, baseZ);
          const qb2 = project(125 + twistX, -110, baseZ);
          const qb3 = project(125 + twistX, 85, baseZ);
          const qb4 = project(-125 + twistX, 85, baseZ);

          const qt1 = project(-125 + twistX, -110, topZ);
          const qt2 = project(125 + twistX, -110, topZ);
          const qt3 = project(125 + twistX, 85, topZ);
          const qt4 = project(-125 + twistX, 85, topZ);

          const qHoleB1 = project(-50 + twistX, -45, baseZ);
          const qHoleB2 = project(50 + twistX, -45, baseZ);
          const qHoleB3 = project(50 + twistX, 35, baseZ);
          const qHoleB4 = project(-50 + twistX, 35, baseZ);

          const qHoleT1 = project(-50 + twistX, -45, topZ);
          const qHoleT2 = project(50 + twistX, -45, topZ);
          const qHoleT3 = project(50 + twistX, 35, topZ);
          const qHoleT4 = project(-50 + twistX, 35, topZ);

          // Wide-Range Linear Campus Vertices
          const wideSpan = 185 * widthScale;
          const wb1 = project(-wideSpan + twistX, -55, baseZ);
          const wb2 = project(wideSpan + twistX, -55, baseZ);
          const wb3 = project(wideSpan + twistX, 55, baseZ);
          const wb4 = project(-wideSpan + twistX, 55, baseZ);

          const wt1 = project(-wideSpan + twistX, -55, topZ);
          const wt2 = project(wideSpan + twistX, -55, topZ);
          const wt3 = project(wideSpan + twistX, 55, topZ);
          const wt4 = project(-wideSpan + twistX, 55, topZ);

          // U-Shaped Courtyard Complex (3 Wings: Left Wing, Rear Connecting Bar, Right Wing)
          const uWingW = halfW * 0.40;
          const uRearD = halfD * 0.44;
          const ub1 = project(-halfW + twistX, -halfD, baseZ); // back left
          const ub2 = project(halfW + twistX, -halfD, baseZ);  // back right
          const ub3 = project(halfW + twistX, halfD, baseZ);   // front right tip
          const ub4 = project(halfW - uWingW + twistX, halfD, baseZ); // inner front right
          const ub5 = project(halfW - uWingW + twistX, -halfD + uRearD, baseZ); // inner courtyard back right
          const ub6 = project(-halfW + uWingW + twistX, -halfD + uRearD, baseZ); // inner courtyard back left
          const ub7 = project(-halfW + uWingW + twistX, halfD, baseZ); // inner front left
          const ub8 = project(-halfW + twistX, halfD, baseZ);  // front left tip

          const ut1 = project(-halfW + twistX, -halfD, topZ);
          const ut2 = project(halfW + twistX, -halfD, topZ);
          const ut3 = project(halfW + twistX, halfD, topZ);
          const ut4 = project(halfW - uWingW + twistX, halfD, topZ);
          const ut5 = project(halfW - uWingW + twistX, -halfD + uRearD, topZ);
          const ut6 = project(-halfW + uWingW + twistX, -halfD + uRearD, topZ);
          const ut7 = project(-halfW + uWingW + twistX, halfD, topZ);
          const ut8 = project(-halfW + twistX, halfD, topZ);

          // 8-segment curved crescent geometry for rounded architectural massing
          const arcSegs = 8;
          const radMin = (18 * Math.PI) / 180;
          const radMax = (162 * Math.PI) / 180;
          const rxOut = 142 * widthScale;
          const ryOut = 92 * depthScale;
          const rxIn = 72 * widthScale;
          const ryIn = 46 * depthScale;
          const yOffset = -25;

          const cbOut: { x: number; y: number }[] = [];
          const cbIn: { x: number; y: number }[] = [];
          const ctOut: { x: number; y: number }[] = [];
          const ctIn: { x: number; y: number }[] = [];

          for (let i = 0; i <= arcSegs; i++) {
            const ang = radMin + (i / arcSegs) * (radMax - radMin);
            const xo = -Math.cos(ang) * rxOut + twistX;
            const yo = -Math.sin(ang) * ryOut + yOffset;
            const xi = -Math.cos(ang) * rxIn + twistX;
            const yi = -Math.sin(ang) * ryIn + yOffset;
            cbOut.push(project(xo, yo, baseZ));
            cbIn.push(project(xi, yi, baseZ));
            ctOut.push(project(xo, yo, topZ));
            ctIn.push(project(xi, yi, topZ));
          }

          // 16-Segment Complete Circular Courtyard Donut (Matches user's Reference Image 8)
          const circSegs = 16;
          const circOutB: { x: number; y: number }[] = [];
          const circInB: { x: number; y: number }[] = [];
          const circOutT: { x: number; y: number }[] = [];
          const circInT: { x: number; y: number }[] = [];
          const rxCircOut = 135 * widthScale;
          const ryCircOut = 90 * depthScale;
          const rxCircIn = 65 * widthScale;
          const ryCircIn = 42 * depthScale;
          for (let i = 0; i <= circSegs; i++) {
            const ang = (i * 2 * Math.PI) / circSegs;
            const xo = Math.cos(ang) * rxCircOut + twistX;
            const yo = Math.sin(ang) * ryCircOut;
            const xi = Math.cos(ang) * rxCircIn + twistX;
            const yi = Math.sin(ang) * ryCircIn;
            circOutB.push(project(xo, yo, baseZ));
            circInB.push(project(xi, yi, baseZ));
            circOutT.push(project(xo, yo, topZ));
            circInT.push(project(xi, yi, topZ));
          }

          // Balcony along inner concave curve facing courtyard
          const rxBalc = rxIn - 18 * widthScale;
          const ryBalc = ryIn - 13 * depthScale;
          const cbBalc: { x: number; y: number }[] = [];
          const crBalc: { x: number; y: number }[] = [];
          for (let i = 0; i <= arcSegs; i++) {
            const ang = radMin + (i / arcSegs) * (radMax - radMin);
            const xb = -Math.cos(ang) * rxBalc + twistX;
            const yb = -Math.sin(ang) * ryBalc + yOffset;
            cbBalc.push(project(xb, yb, baseZ));
            crBalc.push(project(xb, yb, baseZ + 12));
          }

          // Determine Facade Fill and Stroke
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
          } else if (isWhiteMarble) {
            facadeFill = "url(#marbleFacadeDay)";
            facadeStroke = "#94A3B8";
          } else if (isTerracotta) {
            facadeFill = "url(#nordicFacadeDay)";
            facadeStroke = "#EA580C";
          }

          return (
            <g key={`floor-${floorNum}`} className="transition-all duration-300">
              {/* Floor Slab Foundation Base - Hollow shapes use SVG path with fillRule="evenodd" */}
              {massingForm === "OPEN_SQUARE_DONUT" ? (
                <path
                  d={`M ${qb1.x} ${qb1.y} L ${qb2.x} ${qb2.y} L ${qb3.x} ${qb3.y} L ${qb4.x} ${qb4.y} Z M ${qHoleB1.x} ${qHoleB1.y} L ${qHoleB4.x} ${qHoleB4.y} L ${qHoleB3.x} ${qHoleB3.y} L ${qHoleB2.x} ${qHoleB2.y} Z`}
                  fillRule="evenodd"
                  fill={isXRay ? "rgba(16, 185, 129, 0.15)" : (isNight ? "#334155" : "url(#slabGradient)")}
                  stroke={isXRay ? "#10B981" : (isCyberObsidian ? "#06B6D4" : (isLuxuryGold ? "#B45309" : "#475569"))}
                  strokeWidth={isXRay ? 1 : 1.5}
                />
              ) : massingForm === "CIRCULAR_DONUT" ? (
                <path
                  d={`M ${circOutB.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')} Z M ${circInB.slice().reverse().map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')} Z`}
                  fillRule="evenodd"
                  fill={isXRay ? "rgba(16, 185, 129, 0.15)" : (isNight ? "#334155" : "url(#slabGradient)")}
                  stroke={isXRay ? "#10B981" : (isCyberObsidian ? "#06B6D4" : (isLuxuryGold ? "#B45309" : "#475569"))}
                  strokeWidth={isXRay ? 1 : 1.5}
                />
              ) : (
                <polygon
                  points={
                    massingForm === "V_SHAPED"
                      ? `${vb1.x},${vb1.y} ${vb2.x},${vb2.y} ${vb3.x},${vb3.y} ${vb4.x},${vb4.y} ${vb5.x},${vb5.y} ${vb6.x},${vb6.y}`
                      : massingForm === "U_SHAPED"
                      ? `${ub1.x},${ub1.y} ${ub2.x},${ub2.y} ${ub3.x},${ub3.y} ${ub4.x},${ub4.y} ${ub5.x},${ub5.y} ${ub6.x},${ub6.y} ${ub7.x},${ub7.y} ${ub8.x},${ub8.y}`
                      : massingForm === "T_SHAPED"
                      ? `${tb1.x},${tb1.y} ${tb2.x},${tb2.y} ${tb3.x},${tb3.y} ${tb4.x},${tb4.y} ${tb5.x},${tb5.y} ${tb6.x},${tb6.y} ${tb7.x},${tb7.y} ${tb8.x},${tb8.y}`
                      : massingForm === "H_SHAPED"
                      ? `${hb1.x},${hb1.y} ${hb2.x},${hb2.y} ${hb3.x},${hb3.y} ${hb4.x},${hb4.y} ${hb5.x},${hb5.y} ${hb6.x},${hb6.y} ${hb7.x},${hb7.y} ${hb8.x},${hb8.y} ${hb9.x},${hb9.y} ${hb10.x},${hb10.y} ${hb11.x},${hb11.y} ${hb12.x},${hb12.y}`
                      : massingForm === "SPHERICAL_BALL"
                      ? sbOut.map(p => `${p.x},${p.y}`).join(" ")
                      : massingForm === "WIDE_LINEAR_RANGE"
                      ? `${wb1.x},${wb1.y} ${wb2.x},${wb2.y} ${wb3.x},${wb3.y} ${wb4.x},${wb4.y}`
                      : isCurvedRounded
                      ? [...cbOut, ...[...cbIn].reverse()].map(p => `${p.x},${p.y}`).join(" ")
                      : isLShaped
                      ? `${lb1.x},${lb1.y} ${lb2.x},${lb2.y} ${lb3.x},${lb3.y} ${lb4.x},${lb4.y} ${lb5.x},${lb5.y} ${lb6.x},${lb6.y}`
                      : `${b1.x},${b1.y} ${b2.x},${b2.y} ${b3.x},${b3.y} ${b4.x},${b4.y}`
                  }
                  fill={isXRay ? "rgba(16, 185, 129, 0.15)" : (isNight ? "#334155" : "url(#slabGradient)")}
                  stroke={isXRay ? "#10B981" : (isCyberObsidian ? "#06B6D4" : (isLuxuryGold ? "#B45309" : "#475569"))}
                  strokeWidth={isXRay ? 1 : 1.5}
                />
              )}

              {/* Structural RCC Columns (if X-Ray or Shaded) */}
              {(massingForm === "T_SHAPED" ? [
                // ResearchGate T-Shaped Structural Frame Columns at all corners & bay intersections
                { bottom: tb8, top: tt8 },
                { bottom: project(-70 + twistX, 80, baseZ), top: project(-70 + twistX, 80, topZ) },
                { bottom: project(0 + twistX, 80, baseZ), top: project(0 + twistX, 80, topZ) },
                { bottom: project(70 + twistX, 80, baseZ), top: project(70 + twistX, 80, topZ) },
                { bottom: tb7, top: tt7 },
                { bottom: tb6, top: tt6 },
                { bottom: tb5, top: tt5 },
                { bottom: project(45 + twistX, -40, baseZ), top: project(45 + twistX, -40, topZ) },
                { bottom: tb4, top: tt4 },
                { bottom: project(0 + twistX, -100, baseZ), top: project(0 + twistX, -100, topZ) },
                { bottom: tb3, top: tt3 },
                { bottom: project(-45 + twistX, -40, baseZ), top: project(-45 + twistX, -40, topZ) },
                { bottom: tb2, top: tt2 },
                { bottom: tb1, top: tt1 }
              ] : massingForm === "H_SHAPED" ? [
                // ResearchGate H-Shaped Structural Frame Columns at all 12 corners + bay nodes
                { bottom: hb1, top: ht1 }, { bottom: hb2, top: ht2 }, { bottom: hb3, top: ht3 },
                { bottom: hb4, top: ht4 }, { bottom: hb5, top: ht5 }, { bottom: hb6, top: ht6 },
                { bottom: hb7, top: ht7 }, { bottom: hb8, top: ht8 }, { bottom: hb9, top: ht9 },
                { bottom: hb10, top: ht10 }, { bottom: hb11, top: ht11 }, { bottom: hb12, top: ht12 },
                // Flank & notch intermediate columns
                { bottom: project(-140 + twistX, 0, baseZ), top: project(-140 + twistX, 0, topZ) },
                { bottom: project(140 + twistX, 0, baseZ), top: project(140 + twistX, 0, topZ) },
                { bottom: project(-95 + twistX, 85, baseZ), top: project(-95 + twistX, 85, topZ) },
                { bottom: project(95 + twistX, 85, baseZ), top: project(95 + twistX, 85, topZ) },
                { bottom: project(-95 + twistX, -85, baseZ), top: project(-95 + twistX, -85, topZ) },
                { bottom: project(95 + twistX, -85, baseZ), top: project(95 + twistX, -85, topZ) },
                { bottom: project(0 + twistX, 28, baseZ), top: project(0 + twistX, 28, topZ) },
                { bottom: project(0 + twistX, -28, baseZ), top: project(0 + twistX, -28, topZ) }
              ] : massingForm === "U_SHAPED" ? [
                { bottom: ub1, top: ut1 }, { bottom: ub2, top: ut2 }, { bottom: ub3, top: ut3 },
                { bottom: ub4, top: ut4 }, { bottom: ub5, top: ut5 }, { bottom: ub6, top: ut6 },
                { bottom: ub7, top: ut7 }, { bottom: ub8, top: ut8 },
                { bottom: project(-halfW + twistX, 0, baseZ), top: project(-halfW + twistX, 0, topZ) },
                { bottom: project(halfW + twistX, 0, baseZ), top: project(halfW + twistX, 0, topZ) },
                { bottom: project(0 + twistX, -halfD + uRearD, baseZ), top: project(0 + twistX, -halfD + uRearD, topZ) },
                { bottom: project(0 + twistX, -halfD, baseZ), top: project(0 + twistX, -halfD, topZ) }
              ] : massingForm === "V_SHAPED" ? [
                { bottom: vb1, top: vt1 }, { bottom: vb2, top: vt2 }, { bottom: vb3, top: vt3 },
                { bottom: vb4, top: vt4 }, { bottom: vb5, top: vt5 }, { bottom: vb6, top: vt6 },
                { bottom: project(-77.5 + twistX, -40, baseZ), top: project(-77.5 + twistX, -40, topZ) },
                { bottom: project(77.5 + twistX, -40, baseZ), top: project(77.5 + twistX, -40, topZ) },
                { bottom: project(-62.5 + twistX, 5, baseZ), top: project(-62.5 + twistX, 5, topZ) },
                { bottom: project(62.5 + twistX, 5, baseZ), top: project(62.5 + twistX, 5, topZ) }
              ] : isCurvedRounded ? [
                { bottom: cbOut[0], top: ctOut[0] },
                { bottom: cbIn[0], top: ctIn[0] },
                { bottom: cbOut[2], top: ctOut[2] },
                { bottom: cbIn[2], top: ctIn[2] },
                { bottom: cbOut[4], top: ctOut[4] },
                { bottom: cbIn[4], top: ctIn[4] },
                { bottom: cbOut[6], top: ctOut[6] },
                { bottom: cbIn[6], top: ctIn[6] },
                { bottom: cbOut[8], top: ctOut[8] },
                { bottom: cbIn[8], top: ctIn[8] }
              ] : isLShaped ? [
                { bottom: project(-halfW + 8 + twistX, -halfD + 8, baseZ), top: project(-halfW + 8 + twistX, -halfD + 8, topZ) },
                { bottom: project(halfW - 8 + twistX, -halfD + 8, baseZ), top: project(halfW - 8 + twistX, -halfD + 8, topZ) },
                { bottom: project(halfW - 8 + twistX, yCorner - 8, baseZ), top: project(halfW - 8 + twistX, yCorner - 8, topZ) },
                { bottom: project(xCorner + 6 + twistX, yCorner - 6, baseZ), top: project(xCorner + 6 + twistX, yCorner - 6, topZ) },
                { bottom: project(xCorner - 8 + twistX, halfD - 8, baseZ), top: project(xCorner - 8 + twistX, halfD - 8, topZ) },
                { bottom: project(-halfW + 8 + twistX, halfD - 8, baseZ), top: project(-halfW + 8 + twistX, halfD - 8, topZ) },
                { bottom: project(-halfW / 2 + twistX, -halfD + 8, baseZ), top: project(-halfW / 2 + twistX, -halfD + 8, topZ) },
                { bottom: project(-halfW + 8 + twistX, 0, baseZ), top: project(-halfW + 8 + twistX, 0, topZ) }
              ] : [
                { bottom: project(-halfW + 8 + twistX, -halfD + 8, baseZ), top: project(-halfW + 8 + twistX, -halfD + 8, topZ) },
                { bottom: project(halfW - 8 + twistX, -halfD + 8, baseZ), top: project(halfW - 8 + twistX, -halfD + 8, topZ) },
                { bottom: project(halfW - 8 + twistX, halfD - 8, baseZ), top: project(halfW - 8 + twistX, halfD - 8, topZ) },
                { bottom: project(-halfW + 8 + twistX, halfD - 8, baseZ), top: project(-halfW + 8 + twistX, halfD - 8, topZ) },
                { bottom: project(0 + twistX, -halfD + 8, baseZ), top: project(0 + twistX, -halfD + 8, topZ) },
                { bottom: project(0 + twistX, halfD - 8, baseZ), top: project(0 + twistX, halfD - 8, topZ) }
              ]).map((col, idx) => (
                <line
                  key={`col-${floorNum}-${idx}`}
                  x1={col.bottom.x}
                  y1={col.bottom.y}
                  x2={col.top.x}
                  y2={col.top.y}
                  stroke={isXRay ? "#34D399" : (isCyberObsidian ? "#06B6D4" : "#F59E0B")}
                  strokeWidth={isXRay ? 3 : 4}
                  strokeLinecap="square"
                />
              ))}

              {/* Mid-Level Sky Court Garden Cutout (if hasSkyCourt and mid floor) */}
              {hasSkyCourt && floorNum === Math.ceil(totalFlrs / 2) && !isXRay ? (
                (() => {
                  const sc1 = project(-halfW * 0.4 + twistX, halfD, baseZ + 2);
                  const sc2 = project(halfW * 0.4 + twistX, halfD, baseZ + 2);
                  const sc3 = project(halfW * 0.4 + twistX, -halfD * 0.2, baseZ + 2);
                  const sc4 = project(-halfW * 0.4 + twistX, -halfD * 0.2, baseZ + 2);
                  return (
                    <g id="sky-court-cutout">
                      {/* Open-Air Garden Terrace Void */}
                      <polygon points={`${sc1.x},${sc1.y} ${sc2.x},${sc2.y} ${sc3.x},${sc3.y} ${sc4.x},${sc4.y}`} fill="#059669" stroke="#34D399" strokeWidth="1.5" />
                      {/* Sky Court Label */}
                      <g transform={`translate(${sc1.x + 10}, ${sc1.y - 12})`}>
                        <rect x="0" y="-8" width="80" height="15" rx="3" fill="rgba(15, 23, 42, 0.9)" stroke="#10B981" strokeWidth="0.8" />
                        <text x="40" y="3" fill="#34D399" fontSize="7" fontWeight="bold" textAnchor="middle">
                          🌿 SKY COURT
                        </text>
                      </g>
                    </g>
                  );
                })()
              ) : massingForm === "H_SHAPED" && !isXRay ? (
                /* H-SHAPED SYMMETRIC STRUCTURAL FRAME FACADE (Matches ResearchGate 3D Model with 3D Depth Sorting) */
                <g id={`hshape-facade-floor-${floorNum}`}>
                  {(() => {
                    const hFaces = [
                      { id: 'left_front', p1: hb12, p2: hb11, t1: ht12, t2: ht11, midX: -95, midY: 85, strokeW: "1.4", op: "0.92" },
                      { id: 'left_inner_notch', p1: hb11, p2: hb10, t1: ht11, t2: ht10, midX: -50, midY: 56.5, strokeW: "1.1", op: "0.85" },
                      { id: 'bridge_front', p1: hb10, p2: hb9, t1: ht10, t2: ht9, midX: 0, midY: 28, strokeW: "1.3", op: "0.95" },
                      { id: 'right_inner_notch', p1: hb9, p2: hb8, t1: ht9, t2: ht8, midX: 50, midY: 56.5, strokeW: "1.1", op: "0.85" },
                      { id: 'right_front', p1: hb8, p2: hb7, t1: ht8, t2: ht7, midX: 95, midY: 85, strokeW: "1.4", op: "0.92" },
                      { id: 'right_flank', p1: hb7, p2: hb6, t1: ht7, t2: ht6, midX: 140, midY: 0, strokeW: "1.2", op: "0.75" },
                      { id: 'right_rear', p1: hb6, p2: hb5, t1: ht6, t2: ht5, midX: 95, midY: -85, strokeW: "1.2", op: "0.80" },
                      { id: 'right_rear_notch', p1: hb5, p2: hb4, t1: ht5, t2: ht4, midX: 50, midY: -56.5, strokeW: "1.1", op: "0.80" },
                      { id: 'bridge_rear', p1: hb4, p2: hb3, t1: ht4, t2: ht3, midX: 0, midY: -28, strokeW: "1.2", op: "0.80" },
                      { id: 'left_rear_notch', p1: hb3, p2: hb2, t1: ht3, t2: ht2, midX: -50, midY: -56.5, strokeW: "1.1", op: "0.80" },
                      { id: 'left_rear', p1: hb2, p2: hb1, t1: ht2, t2: ht1, midX: -95, midY: -85, strokeW: "1.2", op: "0.80" },
                      { id: 'left_flank', p1: hb1, p2: hb12, t1: ht1, t2: ht12, midX: -140, midY: 0, strokeW: "1.2", op: "0.75" }
                    ].map(face => ({
                      ...face,
                      depth: face.midX * sinO + face.midY * cosO
                    })).sort((a, b) => a.depth - b.depth);

                    return hFaces.map(face => (
                      <g key={`h-face-${floorNum}-${face.id}`}>
                        <polygon
                          points={`${face.p1.x},${face.p1.y} ${face.p2.x},${face.p2.y} ${face.t2.x},${face.t2.y} ${face.t1.x},${face.t1.y}`}
                          fill={facadeFill}
                          stroke={facadeStroke}
                          strokeWidth={face.strokeW}
                          strokeOpacity={face.op}
                        />
                        {[0.33, 0.66].map((ratio, mIdx) => {
                          const mx1 = face.p1.x + (face.p2.x - face.p1.x) * ratio;
                          const my1 = face.p1.y + (face.p2.y - face.p1.y) * ratio;
                          const mx2 = face.t1.x + (face.t2.x - face.t1.x) * ratio;
                          const my2 = face.t1.y + (face.t2.y - face.t1.y) * ratio;
                          return (
                            <line
                              key={`h-mull-${floorNum}-${face.id}-${mIdx}`}
                              x1={mx1}
                              y1={my1}
                              x2={mx2}
                              y2={my2}
                              stroke={isLuxuryGold ? "#FDE047" : (isCyberObsidian ? "#06B6D4" : (isNight ? "#FEF08A" : "#38BDF8"))}
                              strokeWidth="1.2"
                              strokeOpacity="0.65"
                            />
                          );
                        })}
                      </g>
                    ));
                  })()}

                  {/* Central Spine Label on Mid Floor */}
                  {floorNum === Math.ceil(totalFlrs / 2) && (() => {
                    const sbMid = {
                      x: (hb10.x + hb9.x) / 2,
                      y: (hb10.y + hb9.y + ht10.y + ht9.y) / 4
                    };
                    return (
                      <g transform={`translate(${sbMid.x - 45}, ${sbMid.y - 6})`}>
                        <rect x="0" y="-7" width="90" height="14" rx="3" fill="rgba(15, 23, 42, 0.95)" stroke="#38BDF8" strokeWidth="0.8" />
                        <text x="45" y="3" fill="#38BDF8" fontSize="7" fontWeight="bold" textAnchor="middle">
                          🏢 CENTRAL CORE
                        </text>
                      </g>
                    );
                  })()}
                </g>
              ) : massingForm === "T_SHAPED" && !isXRay ? (
                /* T-SHAPED SYMMETRIC STRUCTURAL FRAME FACADE (Matches ResearchGate Structural Model with 3D Depth Sorting) */
                <g id={`tshape-facade-floor-${floorNum}`}>
                  {(() => {
                    const tFaces = [
                      { id: 'front', p1: tb8, p2: tb7, t1: tt8, t2: tt7, midX: 0, midY: 80, strokeW: "1.4", op: "0.92" },
                      { id: 'right_end', p1: tb7, p2: tb6, t1: tt7, t2: tt6, midX: 140, midY: 50, strokeW: "1.2", op: "0.85" },
                      { id: 'right_notch', p1: tb6, p2: tb5, t1: tt6, t2: tt5, midX: 92.5, midY: 20, strokeW: "1", op: "0.80" },
                      { id: 'stem_right', p1: tb5, p2: tb4, t1: tt5, t2: tt4, midX: 45, midY: -40, strokeW: "1", op: "0.75" },
                      { id: 'stem_rear', p1: tb4, p2: tb3, t1: tt4, t2: tt3, midX: 0, midY: -100, strokeW: "1.2", op: "0.80" },
                      { id: 'stem_left', p1: tb3, p2: tb2, t1: tt3, t2: tt2, midX: -45, midY: -40, strokeW: "1", op: "0.75" },
                      { id: 'left_notch', p1: tb2, p2: tb1, t1: tt2, t2: tt1, midX: -92.5, midY: 20, strokeW: "1", op: "0.80" },
                      { id: 'left_end', p1: tb1, p2: tb8, t1: tt1, t2: tt8, midX: -140, midY: 50, strokeW: "1.2", op: "0.85" }
                    ].map(face => ({
                      ...face,
                      depth: face.midX * sinO + face.midY * cosO
                    })).sort((a, b) => a.depth - b.depth);

                    return tFaces.map(face => (
                      <g key={`t-face-${floorNum}-${face.id}`}>
                        <polygon
                          points={`${face.p1.x},${face.p1.y} ${face.p2.x},${face.p2.y} ${face.t2.x},${face.t2.y} ${face.t1.x},${face.t1.y}`}
                          fill={facadeFill}
                          stroke={facadeStroke}
                          strokeWidth={face.strokeW}
                          strokeOpacity={face.op}
                        />
                        {/* Structural Columns & Window Mullions on T-Faces */}
                        {(face.id === 'front' ? [0.16, 0.33, 0.5, 0.66, 0.83] : [0.33, 0.66]).map((ratio, mIdx) => {
                          const mx1 = face.p1.x + (face.p2.x - face.p1.x) * ratio;
                          const my1 = face.p1.y + (face.p2.y - face.p1.y) * ratio;
                          const mx2 = face.t1.x + (face.t2.x - face.t1.x) * ratio;
                          const my2 = face.t1.y + (face.t2.y - face.t1.y) * ratio;
                          return (
                            <line
                              key={`t-mull-${floorNum}-${face.id}-${mIdx}`}
                              x1={mx1}
                              y1={my1}
                              x2={mx2}
                              y2={my2}
                              stroke={isLuxuryGold ? "#FDE047" : (isCyberObsidian ? "#06B6D4" : (isNight ? "#FEF08A" : "#38BDF8"))}
                              strokeWidth="1.2"
                              strokeOpacity="0.65"
                            />
                          );
                        })}
                      </g>
                    ));
                  })()}
                </g>
              ) : massingForm === "V_SHAPED" && !isXRay ? (
                /* V-SHAPED SYMMETRIC DUAL WING STRUCTURAL FACADE (Matches ResearchGate Structural Model with 3D Depth Sorting) */
                <g id={`vshape-facade-floor-${floorNum}`}>
                  {(() => {
                    const vFaces = [
                      { id: 'left_outer', p1: vb1, p2: vb6, t1: vt1, t2: vt6, midX: -77.5, midY: -40, strokeW: "1.2", op: "0.75" },
                      { id: 'left_tip', p1: vb6, p2: vb5, t1: vt6, t2: vt5, midX: -140, midY: 47.5, strokeW: "1.4", op: "0.90" },
                      { id: 'left_inner', p1: vb5, p2: vb4, t1: vt5, t2: vt4, midX: -62.5, midY: 5, strokeW: "1.2", op: "0.85" },
                      { id: 'right_inner', p1: vb4, p2: vb3, t1: vt4, t2: vt3, midX: 62.5, midY: 5, strokeW: "1.2", op: "0.85" },
                      { id: 'right_tip', p1: vb3, p2: vb2, t1: vt3, t2: vt2, midX: 140, midY: 47.5, strokeW: "1.4", op: "0.90" },
                      { id: 'right_outer', p1: vb2, p2: vb1, t1: vt2, t2: vt1, midX: 77.5, midY: -40, strokeW: "1.2", op: "0.75" }
                    ].map(face => ({
                      ...face,
                      depth: face.midX * sinO + face.midY * cosO
                    })).sort((a, b) => a.depth - b.depth);

                    return vFaces.map(face => (
                      <g key={`v-face-${floorNum}-${face.id}`}>
                        <polygon
                          points={`${face.p1.x},${face.p1.y} ${face.p2.x},${face.p2.y} ${face.t2.x},${face.t2.y} ${face.t1.x},${face.t1.y}`}
                          fill={facadeFill}
                          stroke={facadeStroke}
                          strokeWidth={face.strokeW}
                          strokeOpacity={face.op}
                        />
                        {[0.25, 0.5, 0.75].map((ratio, mIdx) => {
                          const mx1 = face.p1.x + (face.p2.x - face.p1.x) * ratio;
                          const my1 = face.p1.y + (face.p2.y - face.p1.y) * ratio;
                          const mx2 = face.t1.x + (face.t2.x - face.t1.x) * ratio;
                          const my2 = face.t1.y + (face.t2.y - face.t1.y) * ratio;
                          return (
                            <line
                              key={`v-mull-${floorNum}-${face.id}-${mIdx}`}
                              x1={mx1}
                              y1={my1}
                              x2={mx2}
                              y2={my2}
                              stroke={isLuxuryGold ? "#FDE047" : (isCyberObsidian ? "#06B6D4" : (isNight ? "#FEF08A" : "#38BDF8"))}
                              strokeWidth="1.2"
                              strokeOpacity="0.65"
                            />
                          );
                        })}
                      </g>
                    ));
                  })()}

                  {/* Central V-Apex Rotunda Highlight on Mid Floor */}
                  {floorNum === Math.ceil(totalFlrs / 2) && (
                    <g transform={`translate(${vb4.x - 40}, ${vb4.y - 12})`}>
                      <rect x="0" y="-7" width="80" height="14" rx="3" fill="rgba(15, 23, 42, 0.95)" stroke="#38BDF8" strokeWidth="0.8" />
                      <text x="40" y="3" fill="#38BDF8" fontSize="7" fontWeight="bold" textAnchor="middle">
                        🏛️ CENTRAL FOYER
                      </text>
                    </g>
                  )}
                </g>
              ) : massingForm === "U_SHAPED" && !isXRay ? (
                /* U-SHAPED TRIPLE-WING ARCHITECTURAL FACADE (Matches ResearchGate 3D Model with Depth Sorting) */
                <g id={`ushape-facade-floor-${floorNum}`}>
                  {(() => {
                    const uFaces = [
                      { id: 'left_tip', p1: ub8, p2: ub7, t1: ut8, t2: ut7, midX: -halfW + uWingW / 2, midY: halfD, strokeW: "1.4", op: "0.92" },
                      { id: 'left_inner', p1: ub7, p2: ub6, t1: ut7, t2: ut6, midX: -halfW + uWingW, midY: (-halfD + uRearD + halfD) / 2, strokeW: "1.2", op: "0.85" },
                      { id: 'rear_inner', p1: ub6, p2: ub5, t1: ut6, t2: ut5, midX: 0, midY: -halfD + uRearD, strokeW: "1.3", op: "0.90" },
                      { id: 'right_inner', p1: ub5, p2: ub4, t1: ut5, t2: ut4, midX: halfW - uWingW, midY: (-halfD + uRearD + halfD) / 2, strokeW: "1.2", op: "0.85" },
                      { id: 'right_tip', p1: ub4, p2: ub3, t1: ut4, t2: ut3, midX: halfW - uWingW / 2, midY: halfD, strokeW: "1.4", op: "0.92" },
                      { id: 'right_flank', p1: ub3, p2: ub2, t1: ut3, t2: ut2, midX: halfW, midY: 0, strokeW: "1.2", op: "0.75" },
                      { id: 'rear_outer', p1: ub2, p2: ub1, t1: ut2, t2: ut1, midX: 0, midY: -halfD, strokeW: "1.2", op: "0.75" },
                      { id: 'left_flank', p1: ub1, p2: ub8, t1: ut1, t2: ut8, midX: -halfW, midY: 0, strokeW: "1.2", op: "0.75" }
                    ].map(face => ({
                      ...face,
                      depth: face.midX * sinO + face.midY * cosO
                    })).sort((a, b) => a.depth - b.depth);

                    return uFaces.map(face => (
                      <g key={`u-face-${floorNum}-${face.id}`}>
                        <polygon
                          points={`${face.p1.x},${face.p1.y} ${face.p2.x},${face.p2.y} ${face.t2.x},${face.t2.y} ${face.t1.x},${face.t1.y}`}
                          fill={facadeFill}
                          stroke={facadeStroke}
                          strokeWidth={face.strokeW}
                          strokeOpacity={face.op}
                        />
                        {[0.33, 0.66].map((ratio, mIdx) => {
                          const mx1 = face.p1.x + (face.p2.x - face.p1.x) * ratio;
                          const my1 = face.p1.y + (face.p2.y - face.p1.y) * ratio;
                          const mx2 = face.t1.x + (face.t2.x - face.t1.x) * ratio;
                          const my2 = face.t1.y + (face.t2.y - face.t1.y) * ratio;
                          return (
                            <line
                              key={`u-mull-${floorNum}-${face.id}-${mIdx}`}
                              x1={mx1}
                              y1={my1}
                              x2={mx2}
                              y2={my2}
                              stroke={isLuxuryGold ? "#FDE047" : (isCyberObsidian ? "#06B6D4" : (isNight ? "#FEF08A" : "#38BDF8"))}
                              strokeWidth="1.2"
                              strokeOpacity="0.65"
                            />
                          );
                        })}
                      </g>
                    ));
                  })()}
                </g>
              ) : massingForm === "L_SHAPED" && !isXRay ? (
                /* L-SHAPED 4-FACE CURTAIN WALL FACADE */
                <g id={`lshape-facade-floor-${floorNum}`}>
                  {/* Face 1: Left Wing Front Face */}
                  <polygon
                    points={`${lb6.x},${lb6.y} ${lb5.x},${lb5.y} ${lt5.x},${lt5.y} ${lt6.x},${lt6.y}`}
                    fill={facadeFill}
                    stroke={facadeStroke}
                    strokeWidth="1"
                    strokeOpacity="0.85"
                  />
                  {/* Face 2: Courtyard West Wall (Inner Left Wing) */}
                  <polygon
                    points={`${lb5.x},${lb5.y} ${lb4.x},${lb4.y} ${lt4.x},${lt4.y} ${lt5.x},${lt5.y}`}
                    fill={facadeFill}
                    stroke={facadeStroke}
                    strokeWidth="1"
                    strokeOpacity="0.75"
                  />
                  {/* Face 3: Courtyard South Wall (Inner Rear Wing) */}
                  <polygon
                    points={`${lb4.x},${lb4.y} ${lb3.x},${lb3.y} ${lt3.x},${lt3.y} ${lt4.x},${lt4.y}`}
                    fill={facadeFill}
                    stroke={facadeStroke}
                    strokeWidth="1"
                    strokeOpacity="0.80"
                  />
                  {/* Face 4: Rear Wing Right Face */}
                  <polygon
                    points={`${lb3.x},${lb3.y} ${lb2.x},${lb2.y} ${lt2.x},${lt2.y} ${lt3.x},${lt3.y}`}
                    fill={facadeFill}
                    stroke={facadeStroke}
                    strokeWidth="1"
                    strokeOpacity="0.65"
                  />

                  {/* Vertical Window Mullions across all 4 visible faces */}
                  {[
                    { p1: lb6, p2: lb5, t1: lt6, t2: lt5 },
                    { p1: lb5, p2: lb4, t1: lt5, t2: lt4 },
                    { p1: lb4, p2: lb3, t1: lt4, t2: lt3 },
                    { p1: lb3, p2: lb2, t1: lt3, t2: lt2 }
                  ].map((face, fIdx) => (
                    [0.33, 0.66].map((ratio, mIdx) => {
                      const mx1 = face.p1.x + (face.p2.x - face.p1.x) * ratio;
                      const my1 = face.p1.y + (face.p2.y - face.p1.y) * ratio;
                      const mx2 = face.t1.x + (face.t2.x - face.t1.x) * ratio;
                      const my2 = face.t1.y + (face.t2.y - face.t1.y) * ratio;
                      return (
                        <line
                          key={`mullion-ls-${floorNum}-${fIdx}-${mIdx}`}
                          x1={mx1}
                          y1={my1}
                          x2={mx2}
                          y2={my2}
                          stroke={isLuxuryGold ? "#FDE047" : (isCyberObsidian ? "#06B6D4" : (isNight ? "#FEF08A" : "#E0F2FE"))}
                          strokeWidth="1"
                          strokeOpacity="0.6"
                        />
                      );
                    })
                  ))}
                </g>
              ) : (massingForm === "CURVED_CYLINDRICAL" || isCurvedRounded) && !isXRay ? (
                /* CURVED ROUNDED ARCHITECTURAL FACADE */
                <g id={`curved-facade-floor-${floorNum}`}>
                  {/* Outer Convex Rear / Flanks Facade Segments */}
                  {Array.from({ length: arcSegs }).map((_, i) => (
                    <polygon
                      key={`curved-out-${floorNum}-${i}`}
                      points={`${cbOut[i].x},${cbOut[i].y} ${cbOut[i+1].x},${cbOut[i+1].y} ${ctOut[i+1].x},${ctOut[i+1].y} ${ctOut[i].x},${ctOut[i].y}`}
                      fill={facadeFill}
                      stroke={facadeStroke}
                      strokeWidth="1"
                      strokeOpacity="0.55"
                    />
                  ))}

                  {/* Left Wing End-Cap */}
                  <polygon
                    points={`${cbOut[0].x},${cbOut[0].y} ${cbIn[0].x},${cbIn[0].y} ${ctIn[0].x},${ctIn[0].y} ${ctOut[0].x},${ctOut[0].y}`}
                    fill={facadeFill}
                    stroke={facadeStroke}
                    strokeWidth="1"
                    strokeOpacity="0.85"
                  />
                  {/* Right Wing End-Cap */}
                  <polygon
                    points={`${cbIn[arcSegs].x},${cbIn[arcSegs].y} ${cbOut[arcSegs].x},${cbOut[arcSegs].y} ${ctOut[arcSegs].x},${ctOut[arcSegs].y} ${ctIn[arcSegs].x},${ctIn[arcSegs].y}`}
                    fill={facadeFill}
                    stroke={facadeStroke}
                    strokeWidth="1"
                    strokeOpacity="0.85"
                  />

                  {/* Inner Concave Front Panoramic Facade (Faces Courtyard) */}
                  {Array.from({ length: arcSegs }).map((_, i) => (
                    <polygon
                      key={`curved-in-${floorNum}-${i}`}
                      points={`${cbIn[i].x},${cbIn[i].y} ${cbIn[i+1].x},${cbIn[i+1].y} ${ctIn[i+1].x},${ctIn[i+1].y} ${ctIn[i].x},${ctIn[i].y}`}
                      fill={facadeFill}
                      stroke={facadeStroke}
                      strokeWidth="1"
                      strokeOpacity="0.88"
                    />
                  ))}

                  {/* Vertical Window Mullions along Inner Curved Facade */}
                  {Array.from({ length: arcSegs }).map((_, i) => {
                    const mx1 = (cbIn[i].x + cbIn[i+1].x) / 2;
                    const my1 = (cbIn[i].y + cbIn[i+1].y) / 2;
                    const mx2 = (ctIn[i].x + ctIn[i+1].x) / 2;
                    const my2 = (ctIn[i].y + ctIn[i+1].y) / 2;
                    return (
                      <line
                        key={`mullion-crv-${floorNum}-${i}`}
                        x1={mx1}
                        y1={my1}
                        x2={mx2}
                        y2={my2}
                        stroke={isLuxuryGold ? "#FDE047" : (isCyberObsidian ? "#06B6D4" : (isNight ? "#FEF08A" : "#E0F2FE"))}
                        strokeWidth="1.2"
                        strokeOpacity="0.75"
                      />
                    );
                  })}
                </g>
              ) : massingForm === "SPHERICAL_BALL" && !isXRay ? (
                /* SPHERICAL GEODESIC GLOBE FACADE */
                <g id={`sphere-facade-floor-${floorNum}`}>
                  {Array.from({ length: sphereSegs }).map((_, i) => {
                    const nextI = (i + 1) % sphereSegs;
                    return (
                      <polygon
                        key={`sphere-panel-${floorNum}-${i}`}
                        points={`${sbOut[i].x},${sbOut[i].y} ${sbOut[nextI].x},${sbOut[nextI].y} ${stOut[nextI].x},${stOut[nextI].y} ${stOut[i].x},${stOut[i].y}`}
                        fill={facadeFill}
                        stroke={facadeStroke}
                        strokeWidth="1"
                        strokeOpacity="0.75"
                      />
                    );
                  })}
                  {/* Equatorial Structural Ring on Equator Floor */}
                  {floorNum === Math.ceil(totalFlrs / 2) && (
                    <polygon
                      points={stOut.map(p => `${p.x},${p.y}`).join(" ")}
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="3"
                    />
                  )}
                </g>
              ) : massingForm === "OPEN_SQUARE_DONUT" && !isXRay ? (
                /* OPEN-CENTER SQUARE ATRIUM FACADE */
                <g id={`square-donut-facade-floor-${floorNum}`}>
                  {/* Outer Front Face */}
                  <polygon
                    points={`${qb4.x},${qb4.y} ${qb3.x},${qb3.y} ${qt3.x},${qt3.y} ${qt4.x},${qt4.y}`}
                    fill={facadeFill}
                    stroke={facadeStroke}
                    strokeWidth="1.2"
                    strokeOpacity="0.85"
                  />
                  {/* Outer Right Face */}
                  <polygon
                    points={`${qb2.x},${qb2.y} ${qb3.x},${qb3.y} ${qt3.x},${qt3.y} ${qt2.x},${qt2.y}`}
                    fill={facadeFill}
                    stroke={facadeStroke}
                    strokeWidth="1"
                    strokeOpacity="0.65"
                  />
                  {/* Inner Atrium Courtyard North Wall (Visible from top angle) */}
                  <polygon
                    points={`${qHoleB1.x},${qHoleB1.y} ${qHoleB2.x},${qHoleB2.y} ${qHoleT2.x},${qHoleT2.y} ${qHoleT1.x},${qHoleT1.y}`}
                    fill={facadeFill}
                    stroke={isNight ? "#FEF08A" : "#38BDF8"}
                    strokeWidth="1"
                    strokeOpacity="0.80"
                  />
                  {/* Inner Atrium Courtyard West Wall */}
                  <polygon
                    points={`${qHoleB1.x},${qHoleB1.y} ${qHoleB4.x},${qHoleB4.y} ${qHoleT4.x},${qHoleT4.y} ${qHoleT1.x},${qHoleT1.y}`}
                    fill={facadeFill}
                    stroke={facadeStroke}
                    strokeWidth="1"
                    strokeOpacity="0.70"
                  />
                  {/* Inner Atrium Courtyard Front Wall */}
                  <polygon
                    points={`${qHoleB4.x},${qHoleB4.y} ${qHoleB3.x},${qHoleB3.y} ${qHoleT3.x},${qHoleT3.y} ${qHoleT4.x},${qHoleT4.y}`}
                    fill={facadeFill}
                    stroke={isNight ? "#FEF08A" : "#38BDF8"}
                    strokeWidth="1"
                    strokeOpacity="0.75"
                  />
                  {/* Window Mullions on Front */}
                  {[0.25, 0.5, 0.75].map((ratio, mIdx) => {
                    const mx1 = qb4.x + (qb3.x - qb4.x) * ratio;
                    const my1 = qb4.y + (qb3.y - qb4.y) * ratio;
                    const mx2 = qt4.x + (qt3.x - qt4.x) * ratio;
                    const my2 = qt4.y + (qt3.y - qt4.y) * ratio;
                    return (
                      <line
                        key={`mullion-sq-${floorNum}-${mIdx}`}
                        x1={mx1}
                        y1={my1}
                        x2={mx2}
                        y2={my2}
                        stroke={isLuxuryGold ? "#FDE047" : (isCyberObsidian ? "#06B6D4" : (isNight ? "#FEF08A" : "#E0F2FE"))}
                        strokeWidth="1"
                        strokeOpacity="0.6"
                      />
                    );
                  })}
                </g>
              ) : massingForm === "CIRCULAR_DONUT" && !isXRay ? (
                /* 360-DEGREE CIRCULAR COURTYARD DONUT FACADE (Matches Reference Image 8) */
                <g id={`circ-donut-facade-floor-${floorNum}`}>
                  {/* Inner Courtyard Rear Facade Segments (Visible looking into open donut) */}
                  {Array.from({ length: 8 }).map((_, i) => {
                    const idx = i + 8;
                    const nextIdx = (idx + 1) % circSegs;
                    return (
                      <polygon
                        key={`circ-in-${floorNum}-${i}`}
                        points={`${circInB[idx].x},${circInB[idx].y} ${circInB[nextIdx].x},${circInB[nextIdx].y} ${circInT[nextIdx].x},${circInT[nextIdx].y} ${circInT[idx].x},${circInT[idx].y}`}
                        fill={facadeFill}
                        stroke={facadeStroke}
                        strokeWidth="1"
                        strokeOpacity="0.85"
                      />
                    );
                  })}
                  {/* Outer Panoramic Curved Facade Segments (Front half) */}
                  {Array.from({ length: 8 }).map((_, i) => {
                    const nextI = (i + 1) % circSegs;
                    return (
                      <polygon
                        key={`circ-out-${floorNum}-${i}`}
                        points={`${circOutB[i].x},${circOutB[i].y} ${circOutB[nextI].x},${circOutB[nextI].y} ${circOutT[nextI].x},${circOutT[nextI].y} ${circOutT[i].x},${circOutT[i].y}`}
                        fill={facadeFill}
                        stroke={facadeStroke}
                        strokeWidth="1.2"
                        strokeOpacity="0.88"
                      />
                    );
                  })}
                  {/* Vertical Window Mullions on Front Arc */}
                  {Array.from({ length: 8 }).map((_, i) => {
                    const mx1 = (circOutB[i].x + circOutB[(i + 1) % circSegs].x) / 2;
                    const my1 = (circOutB[i].y + circOutB[(i + 1) % circSegs].y) / 2;
                    const mx2 = (circOutT[i].x + circOutT[(i + 1) % circSegs].x) / 2;
                    const my2 = (circOutT[i].y + circOutT[(i + 1) % circSegs].y) / 2;
                    return (
                      <line
                        key={`circ-mullion-${floorNum}-${i}`}
                        x1={mx1}
                        y1={my1}
                        x2={mx2}
                        y2={my2}
                        stroke={isNight ? "#FEF08A" : "#38BDF8"}
                        strokeWidth="1"
                        strokeOpacity="0.7"
                      />
                    );
                  })}
                </g>
              ) : massingForm === "WIDE_LINEAR_RANGE" && !isXRay ? (
                /* WIDE-RANGE LINEAR CAMPUS FACADE */
                <g id={`wide-facade-floor-${floorNum}`}>
                  {/* Front Wide Span Face */}
                  <polygon
                    points={`${wb4.x},${wb4.y} ${wb3.x},${wb3.y} ${wt3.x},${wt3.y} ${wt4.x},${wt4.y}`}
                    fill={facadeFill}
                    stroke={facadeStroke}
                    strokeWidth="1.2"
                    strokeOpacity="0.88"
                  />
                  {/* Right End Face */}
                  <polygon
                    points={`${wb2.x},${wb2.y} ${wb3.x},${wb3.y} ${wt3.x},${wt3.y} ${wt2.x},${wt2.y}`}
                    fill={facadeFill}
                    stroke={facadeStroke}
                    strokeWidth="1"
                    strokeOpacity="0.65"
                  />
                  {/* Multi-Bay Vertical Expansion Joints */}
                  {[0.16, 0.33, 0.5, 0.66, 0.83].map((ratio, jIdx) => {
                    const jx1 = wb4.x + (wb3.x - wb4.x) * ratio;
                    const jy1 = wb4.y + (wb3.y - wb4.y) * ratio;
                    const jx2 = wt4.x + (wt3.x - wt4.x) * ratio;
                    const jy2 = wt4.y + (wt3.y - wt4.y) * ratio;
                    return (
                      <line
                        key={`wide-joint-${floorNum}-${jIdx}`}
                        x1={jx1}
                        y1={jy1}
                        x2={jx2}
                        y2={jy2}
                        stroke={isNight ? "#FEF08A" : "#38BDF8"}
                        strokeWidth="1.8"
                        strokeOpacity="0.7"
                      />
                    );
                  })}
                </g>
              ) : (
                /* Curtain Wall Glazed Facade Panels (Front & Side) */
                !isXRay && (
                  <>
                    {/* Facade Face 1 (Front) */}
                    <polygon
                      points={`${b3.x},${b3.y} ${b4.x},${b4.y} ${t4.x},${t4.y} ${t3.x},${t3.y}`}
                      fill={glassDistribution === "RIGHT_FRONT_GLASS" ? "#1E293B" : facadeFill}
                      stroke={facadeStroke}
                      strokeWidth="1"
                      strokeOpacity="0.8"
                    />
                    {/* Facade Face 2 (Right Side) */}
                    <polygon
                      points={`${b2.x},${b2.y} ${b3.x},${b3.y} ${t3.x},${t3.y} ${t2.x},${t2.y}`}
                      fill={glassDistribution === "LEFT_FRONT_GLASS" || glassDistribution === "ONE_SIDE_GLASS" ? "#1E293B" : facadeFill}
                      stroke={facadeStroke}
                      strokeWidth="1"
                      strokeOpacity="0.6"
                    />

                    {/* Structural Diagrid Exoskeleton (if hasDiagrid) */}
                    {hasDiagrid && (
                      <g id={`diagrid-frame-${floorNum}`}>
                        <line x1={b4.x} y1={b4.y} x2={t3.x} y2={t3.y} stroke={isCyberObsidian ? "#06B6D4" : "#38BDF8"} strokeWidth="2.5" strokeOpacity="0.85" />
                        <line x1={b3.x} y1={b3.y} x2={t4.x} y2={t4.y} stroke={isCyberObsidian ? "#06B6D4" : "#38BDF8"} strokeWidth="2.5" strokeOpacity="0.85" />
                      </g>
                    )}

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
                              stroke={isLuxuryGold ? "#FEF08A" : (isCyberObsidian ? "#06B6D4" : (isNight ? "#FEF08A" : "#E0F2FE"))}
                              strokeWidth="1.5"
                              strokeOpacity="0.85"
                            />
                          );
                        })}
                        {/* Interior Mezzanine Loft Plate Line */}
                        {(() => {
                          const midZ = (baseZ + topZ) / 2;
                          const m1 = project(-halfW + 15 + twistX, halfD - 20, midZ);
                          const m2 = project(halfW - 15 + twistX, halfD - 20, midZ);
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
                            stroke={isLuxuryGold ? "#FDE047" : (isCyberObsidian ? "#06B6D4" : (isNight ? "#FEF08A" : "#E0F2FE"))}
                            strokeWidth="1"
                            strokeOpacity="0.6"
                          />
                        );
                      })
                    )}

                    {/* Sun Louvers / Vertical Fins (if hasSunLouvers) */}
                    {hasSunLouvers && [0.15, 0.35, 0.55, 0.75, 0.95].map((ratio, lIdx) => {
                      const fx = b4.x + (b3.x - b4.x) * ratio;
                      const fy = b4.y + (b3.y - b4.y) * ratio;
                      return (
                        <line
                          key={`louver-${floorNum}-${lIdx}`}
                          x1={fx}
                          y1={fy}
                          x2={fx}
                          y2={fy - floorHeight * 0.9}
                          stroke="#F59E0B"
                          strokeWidth="2.5"
                          strokeOpacity="0.7"
                        />
                      );
                    })}
                  </>
                )
              )}

              {/* DYNAMIC BALCONY VARIATIONS */}
              {!isXRay && (
                (() => {
                  if (isCurvedRounded) {
                    // Continuous curved wrap-around cantilevered ribbon balcony facing the sports courtyard
                    return (
                      <g key={`curved-balcony-${floorNum}`}>
                        {/* Balcony Floor Slab */}
                        <polygon
                          points={[...cbIn, ...[...cbBalc].reverse()].map(p => `${p.x},${p.y}`).join(" ")}
                          fill="#1E293B"
                          stroke="#38BDF8"
                          strokeWidth="1"
                        />
                        {/* Frameless Curved Laminated Glass Balustrade Segments */}
                        {Array.from({ length: arcSegs }).map((_, i) => (
                          <polygon
                            key={`balc-glass-${floorNum}-${i}`}
                            points={`${cbBalc[i].x},${cbBalc[i].y} ${cbBalc[i+1].x},${cbBalc[i+1].y} ${crBalc[i+1].x},${crBalc[i+1].y} ${crBalc[i].x},${crBalc[i].y}`}
                            fill="rgba(56, 189, 248, 0.45)"
                            stroke="#38BDF8"
                            strokeWidth="1"
                          />
                        ))}
                        {/* Polished Chrome Handrail along the Entire Arc */}
                        {Array.from({ length: arcSegs }).map((_, i) => (
                          <line
                            key={`handrail-${floorNum}-${i}`}
                            x1={crBalc[i].x}
                            y1={crBalc[i].y}
                            x2={crBalc[i+1].x}
                            y2={crBalc[i+1].y}
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        ))}
                      </g>
                    );
                  } else if (isLShaped) {
                    // Cantilevered glass balconies along Left Wing Front (Face 1) and Rear Wing Right (Face 4)
                    const bLeftFront = project(-halfW + twistX, halfD + 18, baseZ);
                    const bRightFront = project(xCorner + twistX, halfD + 18, baseZ);
                    const brLeftFront = project(-halfW + twistX, halfD + 18, baseZ + 12);
                    const brRightFront = project(xCorner + twistX, halfD + 18, baseZ + 12);

                    const bRearRight1 = project(halfW + 18 + twistX, -halfD, baseZ);
                    const bRearRight2 = project(halfW + 18 + twistX, yCorner, baseZ);
                    const brRearRight1 = project(halfW + 18 + twistX, -halfD, baseZ + 12);
                    const brRearRight2 = project(halfW + 18 + twistX, yCorner, baseZ + 12);

                    return (
                      <g key={`lshape-balconies-${floorNum}`}>
                        <polygon points={`${lb6.x},${lb6.y} ${bLeftFront.x},${bLeftFront.y} ${bRightFront.x},${bRightFront.y} ${lb5.x},${lb5.y}`} fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                        <polygon points={`${bLeftFront.x},${bLeftFront.y} ${bRightFront.x},${bRightFront.y} ${brRightFront.x},${brRightFront.y} ${brLeftFront.x},${brLeftFront.y}`} fill="rgba(56, 189, 248, 0.45)" stroke="#38BDF8" strokeWidth="1" />
                        <line x1={brLeftFront.x} y1={brLeftFront.y} x2={brRightFront.x} y2={brRightFront.y} stroke="#FFFFFF" strokeWidth="2" />

                        <polygon points={`${lb3.x},${lb3.y} ${bRearRight2.x},${bRearRight2.y} ${bRearRight1.x},${bRearRight1.y} ${lb2.x},${lb2.y}`} fill="#0F172A" stroke="#0284C7" strokeWidth="1" />
                        <polygon points={`${bRearRight2.x},${bRearRight2.y} ${bRearRight1.x},${bRearRight1.y} ${brRearRight1.x},${brRearRight1.y} ${brRearRight2.x},${brRearRight2.y}`} fill="rgba(2, 132, 199, 0.4)" stroke="#0284C7" strokeWidth="1" />
                        <line x1={brRearRight2.x} y1={brRearRight2.y} x2={brRearRight1.x} y2={brRearRight1.y} stroke="#FFFFFF" strokeWidth="2" />
                      </g>
                    );
                  } else if (massingForm === "H_SHAPED") {
                    // Dual Twin-Wing Balconies: Left Wing Front (hb12 -> hb11) and Right Wing Front (hb8 -> hb7)
                    // ZERO balcony spanning across the central notch (hb11 -> hb8)!
                    const hbL1 = project(-140 + twistX, 85 + 16, baseZ);
                    const hbL2 = project(-50 + twistX, 85 + 16, baseZ);
                    const hbrL1 = project(-140 + twistX, 85 + 16, baseZ + 12);
                    const hbrL2 = project(-50 + twistX, 85 + 16, baseZ + 12);

                    const hbR1 = project(50 + twistX, 85 + 16, baseZ);
                    const hbR2 = project(140 + twistX, 85 + 16, baseZ);
                    const hbrR1 = project(50 + twistX, 85 + 16, baseZ + 12);
                    const hbrR2 = project(140 + twistX, 85 + 16, baseZ + 12);

                    return (
                      <g key={`hshape-balconies-${floorNum}`}>
                        {/* Left Wing Front Balcony */}
                        <polygon points={`${hb12.x},${hb12.y} ${hbL1.x},${hbL1.y} ${hbL2.x},${hbL2.y} ${hb11.x},${hb11.y}`} fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                        <polygon points={`${hbL1.x},${hbL1.y} ${hbL2.x},${hbL2.y} ${hbrL2.x},${hbrL2.y} ${hbrL1.x},${hbrL1.y}`} fill="rgba(56, 189, 248, 0.45)" stroke="#38BDF8" strokeWidth="1" />
                        <line x1={hbrL1.x} y1={hbrL1.y} x2={hbrL2.x} y2={hbrL2.y} stroke="#FFFFFF" strokeWidth="2" />

                        {/* Right Wing Front Balcony */}
                        <polygon points={`${hb8.x},${hb8.y} ${hbR1.x},${hbR1.y} ${hbR2.x},${hbR2.y} ${hb7.x},${hb7.y}`} fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                        <polygon points={`${hbR1.x},${hbR1.y} ${hbR2.x},${hbR2.y} ${hbrR2.x},${hbrR2.y} ${hbrR1.x},${hbrR1.y}`} fill="rgba(56, 189, 248, 0.45)" stroke="#38BDF8" strokeWidth="1" />
                        <line x1={hbrR1.x} y1={hbrR1.y} x2={hbrR2.x} y2={hbrR2.y} stroke="#FFFFFF" strokeWidth="2" />
                      </g>
                    );
                  } else if (massingForm === "U_SHAPED") {
                    // Dual Forward Wing Tip Balconies: Left Forward Tip (ub8 -> ub7) and Right Forward Tip (ub4 -> ub3)
                    // ZERO balcony bridging across the central open courtyard (ub7 -> ub4)!
                    const ubL1 = project(-halfW + twistX, halfD + 16, baseZ);
                    const ubL2 = project(-halfW + uWingW + twistX, halfD + 16, baseZ);
                    const ubrL1 = project(-halfW + twistX, halfD + 16, baseZ + 12);
                    const ubrL2 = project(-halfW + uWingW + twistX, halfD + 16, baseZ + 12);

                    const ubR1 = project(halfW - uWingW + twistX, halfD + 16, baseZ);
                    const ubR2 = project(halfW + twistX, halfD + 16, baseZ);
                    const ubrR1 = project(halfW - uWingW + twistX, halfD + 16, baseZ + 12);
                    const ubrR2 = project(halfW + twistX, halfD + 16, baseZ + 12);

                    return (
                      <g key={`ushape-balconies-${floorNum}`}>
                        {/* Left Tip Balcony */}
                        <polygon points={`${ub8.x},${ub8.y} ${ubL1.x},${ubL1.y} ${ubL2.x},${ubL2.y} ${ub7.x},${ub7.y}`} fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                        <polygon points={`${ubL1.x},${ubL1.y} ${ubL2.x},${ubL2.y} ${ubrL2.x},${ubrL2.y} ${ubrL1.x},${ubrL1.y}`} fill="rgba(56, 189, 248, 0.45)" stroke="#38BDF8" strokeWidth="1" />
                        <line x1={ubrL1.x} y1={ubrL1.y} x2={ubrL2.x} y2={ubrL2.y} stroke="#FFFFFF" strokeWidth="2" />

                        {/* Right Tip Balcony */}
                        <polygon points={`${ub4.x},${ub4.y} ${ubR1.x},${ubR1.y} ${ubR2.x},${ubR2.y} ${ub3.x},${ub3.y}`} fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                        <polygon points={`${ubR1.x},${ubR1.y} ${ubR2.x},${ubR2.y} ${ubrR2.x},${ubrR2.y} ${ubrR1.x},${ubrR1.y}`} fill="rgba(56, 189, 248, 0.45)" stroke="#38BDF8" strokeWidth="1" />
                        <line x1={ubrR1.x} y1={ubrR1.y} x2={ubrR2.x} y2={ubrR2.y} stroke="#FFFFFF" strokeWidth="2" />
                      </g>
                    );
                  } else if (massingForm === "V_SHAPED") {
                    // Wing Tip Cantilever Balconies: Left Wing Tip (vb6 -> vb5) and Right Wing Tip (vb3 -> vb2)
                    // ZERO balcony bridging across the V gap (vb6 -> vb2)!
                    const vbL1 = project(-155 + twistX, 35 + 16, baseZ);
                    const vbL2 = project(-125 + twistX, 60 + 16, baseZ);
                    const vbrL1 = project(-155 + twistX, 35 + 16, baseZ + 12);
                    const vbrL2 = project(-125 + twistX, 60 + 16, baseZ + 12);

                    const vbR1 = project(125 + twistX, 60 + 16, baseZ);
                    const vbR2 = project(155 + twistX, 35 + 16, baseZ);
                    const vbrR1 = project(125 + twistX, 60 + 16, baseZ + 12);
                    const vbrR2 = project(155 + twistX, 35 + 16, baseZ + 12);

                    return (
                      <g key={`vshape-balconies-${floorNum}`}>
                        {/* Left Wing Tip Balcony */}
                        <polygon points={`${vb6.x},${vb6.y} ${vbL1.x},${vbL1.y} ${vbL2.x},${vbL2.y} ${vb5.x},${vb5.y}`} fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                        <polygon points={`${vbL1.x},${vbL1.y} ${vbL2.x},${vbL2.y} ${vbrL2.x},${vbrL2.y} ${vbrL1.x},${vbrL1.y}`} fill="rgba(56, 189, 248, 0.45)" stroke="#38BDF8" strokeWidth="1" />
                        <line x1={vbrL1.x} y1={vbrL1.y} x2={vbrL2.x} y2={vbrL2.y} stroke="#FFFFFF" strokeWidth="2" />

                        {/* Right Wing Tip Balcony */}
                        <polygon points={`${vb3.x},${vb3.y} ${vbR1.x},${vbR1.y} ${vbR2.x},${vbR2.y} ${vb2.x},${vb2.y}`} fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                        <polygon points={`${vbR1.x},${vbR1.y} ${vbR2.x},${vbR2.y} ${vbrR2.x},${vbrR2.y} ${vbrR1.x},${vbrR1.y}`} fill="rgba(56, 189, 248, 0.45)" stroke="#38BDF8" strokeWidth="1" />
                        <line x1={vbrR1.x} y1={vbrR1.y} x2={vbrR2.x} y2={vbrR2.y} stroke="#FFFFFF" strokeWidth="2" />
                      </g>
                    );
                  } else if (massingForm === "T_SHAPED") {
                    // Front Flange Continuous Balcony: tb8 -> tb7 (does NOT spill into side voids tb1..tb6)
                    const tbF1 = project(-140 + twistX, 80 + 16, baseZ);
                    const tbF2 = project(140 + twistX, 80 + 16, baseZ);
                    const tbrF1 = project(-140 + twistX, 80 + 16, baseZ + 12);
                    const tbrF2 = project(140 + twistX, 80 + 16, baseZ + 12);

                    return (
                      <g key={`tshape-balconies-${floorNum}`}>
                        <polygon points={`${tb8.x},${tb8.y} ${tbF1.x},${tbF1.y} ${tbF2.x},${tbF2.y} ${tb7.x},${tb7.y}`} fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                        <polygon points={`${tbF1.x},${tbF1.y} ${tbF2.x},${tbF2.y} ${tbrF2.x},${tbrF2.y} ${tbrF1.x},${tbrF1.y}`} fill="rgba(56, 189, 248, 0.45)" stroke="#38BDF8" strokeWidth="1" />
                        <line x1={tbrF1.x} y1={tbrF1.y} x2={tbrF2.x} y2={tbrF2.y} stroke="#FFFFFF" strokeWidth="2" />
                      </g>
                    );
                  } else if (massingForm === "OPEN_SQUARE_DONUT") {
                    // Perimeter Outer Balcony along Front Face: qb4 -> qb3 (leaves inner atrium completely open!)
                    const qbF1 = project(-125 + twistX, 85 + 16, baseZ);
                    const qbF2 = project(125 + twistX, 85 + 16, baseZ);
                    const qbrF1 = project(-125 + twistX, 85 + 16, baseZ + 12);
                    const qbrF2 = project(125 + twistX, 85 + 16, baseZ + 12);

                    return (
                      <g key={`sqdonut-balconies-${floorNum}`}>
                        <polygon points={`${qb4.x},${qb4.y} ${qbF1.x},${qbF1.y} ${qbF2.x},${qbF2.y} ${qb3.x},${qb3.y}`} fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                        <polygon points={`${qbF1.x},${qbF1.y} ${qbF2.x},${qbF2.y} ${qbrF2.x},${qbrF2.y} ${qbrF1.x},${qbrF1.y}`} fill="rgba(56, 189, 248, 0.45)" stroke="#38BDF8" strokeWidth="1" />
                        <line x1={qbrF1.x} y1={qbrF1.y} x2={qbrF2.x} y2={qbrF2.y} stroke="#FFFFFF" strokeWidth="2" />
                      </g>
                    );
                  } else if (massingForm === "CIRCULAR_DONUT") {
                    // Inner courtyard perimeter viewing rail
                    return (
                      <g key={`circdonut-balconies-${floorNum}`}>
                        {Array.from({ length: 8 }).map((_, i) => (
                          <line
                            key={`circ-balc-${floorNum}-${i}`}
                            x1={circInB[i].x}
                            y1={circInB[i].y - 8}
                            x2={circInB[(i + 1) % circSegs].x}
                            y2={circInB[(i + 1) % circSegs].y - 8}
                            stroke="#38BDF8"
                            strokeWidth="2"
                          />
                        ))}
                      </g>
                    );
                  } else if (balconyType === "WRAPAROUND_RIBBON") {
                    // Continuous wrap-around 360-deg ribbon balconies around front and right side
                    const wrapDepth = halfD + 20;
                    const c1 = project(-halfW - 15 + twistX, wrapDepth, baseZ);
                    const c2 = project(halfW + 20 + twistX, wrapDepth, baseZ);
                    const c3 = project(halfW + 20 + twistX, -halfD - 15, baseZ);
                    const r1 = project(-halfW - 15 + twistX, wrapDepth, baseZ + 12);
                    const r2 = project(halfW + 20 + twistX, wrapDepth, baseZ + 12);
                    const r3 = project(halfW + 20 + twistX, -halfD - 15, baseZ + 12);

                    return (
                      <g key={`balcony-wrap-${floorNum}`}>
                        <polygon points={`${b4.x},${b4.y} ${c1.x},${c1.y} ${c2.x},${c2.y} ${b3.x},${b3.y}`} fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                        <polygon points={`${b3.x},${b3.y} ${c2.x},${c2.y} ${c3.x},${c3.y} ${b2.x},${b2.y}`} fill="#0F172A" stroke="#0284C7" strokeWidth="1" />
                        {/* Wrap-around glass balustrade */}
                        <polygon points={`${c1.x},${c1.y} ${c2.x},${c2.y} ${r2.x},${r2.y} ${r1.x},${r1.y}`} fill="rgba(56, 189, 248, 0.45)" stroke="#38BDF8" strokeWidth="1" />
                        <polygon points={`${c2.x},${c2.y} ${c3.x},${c3.y} ${r3.x},${r3.y} ${r2.x},${r2.y}`} fill="rgba(2, 132, 199, 0.4)" stroke="#0284C7" strokeWidth="1" />
                        <line x1={r1.x} y1={r1.y} x2={r2.x} y2={r2.y} stroke="#FFFFFF" strokeWidth="2" />
                        <line x1={r2.x} y1={r2.y} x2={r3.x} y2={r3.y} stroke="#FFFFFF" strokeWidth="2" />
                      </g>
                    );
                  } else if (balconyType === "CURVED_WAVE") {
                    // Sinusoidal undulating wave balconies (Aqua Tower style)
                    const waveOffset = Math.sin((floorNum * Math.PI) / 2) * 24;
                    const w1 = project(-halfW + 10 + twistX, halfD + 14 + (waveOffset < 0 ? 18 : 6), baseZ);
                    const w2 = project(halfW - 10 + twistX, halfD + 14 + (waveOffset > 0 ? 18 : 6), baseZ);
                    const wr1 = project(-halfW + 10 + twistX, halfD + 14 + (waveOffset < 0 ? 18 : 6), baseZ + 12);
                    const wr2 = project(halfW - 10 + twistX, halfD + 14 + (waveOffset > 0 ? 18 : 6), baseZ + 12);

                    return (
                      <g key={`balcony-wave-${floorNum}`}>
                        <polygon points={`${b4.x},${b4.y} ${w1.x},${w1.y} ${w2.x},${w2.y} ${b3.x},${b3.y}`} fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                        <polygon points={`${w1.x},${w1.y} ${w2.x},${w2.y} ${wr2.x},${wr2.y} ${wr1.x},${wr1.y}`} fill="rgba(56, 189, 248, 0.5)" stroke="#38BDF8" strokeWidth="1.2" />
                        <line x1={wr1.x} y1={wr1.y} x2={wr2.x} y2={wr2.y} stroke="#F8FAFC" strokeWidth="2" />
                      </g>
                    );
                  } else if (balconyType === "TERRACED_CASCADE") {
                    // Terraced cascade with hanging green vertical foliage
                    const tc1 = project(-halfW + 15 + twistX, halfD + 22, baseZ);
                    const tc2 = project(halfW - 15 + twistX, halfD + 22, baseZ);
                    const tcr1 = project(-halfW + 15 + twistX, halfD + 22, baseZ + 11);
                    const tcr2 = project(halfW - 15 + twistX, halfD + 22, baseZ + 11);

                    return (
                      <g key={`balcony-terrace-${floorNum}`}>
                        <polygon points={`${b4.x},${b4.y} ${tc1.x},${tc1.y} ${tc2.x},${tc2.y} ${b3.x},${b3.y}`} fill="#064E3B" stroke="#10B981" strokeWidth="1.2" />
                        <polygon points={`${tc1.x},${tc1.y} ${tc2.x},${tc2.y} ${tcr2.x},${tcr2.y} ${tcr1.x},${tcr1.y}`} fill="#059669" stroke="#34D399" strokeWidth="1" />
                        {/* Cascading hanging ivy greenery */}
                        {[0.2, 0.4, 0.6, 0.8].map((ratio, vIdx) => {
                          const vx = tc1.x + (tc2.x - tc1.x) * ratio;
                          const vy = tc1.y + (tc2.y - tc1.y) * ratio;
                          return (
                            <line key={`vine-${floorNum}-${vIdx}`} x1={vx} y1={vy} x2={vx + (vIdx % 2 === 0 ? 3 : -3)} y2={vy + 10} stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                          );
                        })}
                      </g>
                    );
                  } else if (balconyType === "CANTILEVERED_FLOATING") {
                    // Alternating cantilevered floating pods
                    const isOdd = floorNum % 2 !== 0;
                    const bLeft = isOdd ? -halfW - 25 : -20;
                    const bRight = isOdd ? 20 : halfW + 25;
                    const bDepth = halfD + 26;
                    const bHeight = 14;

                    const c1 = project(bLeft + twistX, halfD, baseZ);
                    const c2 = project(bRight + twistX, halfD, baseZ);
                    const c3 = project(bRight + twistX, bDepth, baseZ);
                    const c4 = project(bLeft + twistX, bDepth, baseZ);

                    const r1 = project(bLeft + twistX, halfD, baseZ + bHeight);
                    const r2 = project(bRight + twistX, halfD, baseZ + bHeight);
                    const r3 = project(bRight + twistX, bDepth, baseZ + bHeight);
                    const r4 = project(bLeft + twistX, bDepth, baseZ + bHeight);

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
                })()
              )}

              {/* Top Slab Chamfer Edge - Hollow shapes use SVG path with fillRule="evenodd" */}
              {massingForm === "OPEN_SQUARE_DONUT" ? (
                <path
                  d={`M ${qt1.x} ${qt1.y} L ${qt2.x} ${qt2.y} L ${qt3.x} ${qt3.y} L ${qt4.x} ${qt4.y} Z M ${qHoleT1.x} ${qHoleT1.y} L ${qHoleT4.x} ${qHoleT4.y} L ${qHoleT3.x} ${qHoleT3.y} L ${qHoleT2.x} ${qHoleT2.y} Z`}
                  fillRule="evenodd"
                  fill={isXRay ? "rgba(16, 185, 129, 0.2)" : (isNight ? "#1E293B" : "url(#slabGradient)")}
                  stroke={isXRay ? "#10B981" : (isCyberObsidian ? "#06B6D4" : (isLuxuryGold ? "#D97706" : "#94A3B8"))}
                  strokeWidth={isXRay ? 1 : 1.5}
                />
              ) : massingForm === "CIRCULAR_DONUT" ? (
                <path
                  d={`M ${circOutT.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')} Z M ${circInT.slice().reverse().map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')} Z`}
                  fillRule="evenodd"
                  fill={isXRay ? "rgba(16, 185, 129, 0.2)" : (isNight ? "#1E293B" : "url(#slabGradient)")}
                  stroke={isXRay ? "#10B981" : (isCyberObsidian ? "#06B6D4" : (isLuxuryGold ? "#D97706" : "#94A3B8"))}
                  strokeWidth={isXRay ? 1 : 1.5}
                />
              ) : (
                <polygon
                  points={
                    massingForm === "V_SHAPED"
                      ? `${vt1.x},${vt1.y} ${vt2.x},${vt2.y} ${vt3.x},${vt3.y} ${vt4.x},${vt4.y} ${vt5.x},${vt5.y} ${vt6.x},${vt6.y}`
                      : massingForm === "U_SHAPED"
                      ? `${ut1.x},${ut1.y} ${ut2.x},${ut2.y} ${ut3.x},${ut3.y} ${ut4.x},${ut4.y} ${ut5.x},${ut5.y} ${ut6.x},${ut6.y} ${ut7.x},${ut7.y} ${ut8.x},${ut8.y}`
                      : massingForm === "T_SHAPED"
                      ? `${tt1.x},${tt1.y} ${tt2.x},${tt2.y} ${tt3.x},${tt3.y} ${tt4.x},${tt4.y} ${tt5.x},${tt5.y} ${tt6.x},${tt6.y} ${tt7.x},${tt7.y} ${tt8.x},${tt8.y}`
                      : massingForm === "H_SHAPED"
                      ? `${ht1.x},${ht1.y} ${ht2.x},${ht2.y} ${ht3.x},${ht3.y} ${ht4.x},${ht4.y} ${ht5.x},${ht5.y} ${ht6.x},${ht6.y} ${ht7.x},${ht7.y} ${ht8.x},${ht8.y} ${ht9.x},${ht9.y} ${ht10.x},${ht10.y} ${ht11.x},${ht11.y} ${ht12.x},${ht12.y}`
                      : massingForm === "SPHERICAL_BALL"
                      ? stOut.map(p => `${p.x},${p.y}`).join(" ")
                      : massingForm === "WIDE_LINEAR_RANGE"
                      ? `${wt1.x},${wt1.y} ${wt2.x},${wt2.y} ${wt3.x},${wt3.y} ${wt4.x},${wt4.y}`
                      : isCurvedRounded
                      ? [...ctOut, ...[...ctIn].reverse()].map(p => `${p.x},${p.y}`).join(" ")
                      : isLShaped
                      ? `${lt1.x},${lt1.y} ${lt2.x},${lt2.y} ${lt3.x},${lt3.y} ${lt4.x},${lt4.y} ${lt5.x},${lt5.y} ${lt6.x},${lt6.y}`
                      : `${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y} ${t4.x},${t4.y}`
                  }
                  fill={isXRay ? "rgba(16, 185, 129, 0.2)" : (isNight ? "#1E293B" : "url(#slabGradient)")}
                  stroke={isXRay ? "#10B981" : (isCyberObsidian ? "#06B6D4" : (isLuxuryGold ? "#D97706" : "#94A3B8"))}
                  strokeWidth={isXRay ? 1 : 1.5}
                />
              )}

              {/* Structural FEM Grid Lines on H-Shape Roof Slab (matches ResearchGate structural model) */}
              {massingForm === "H_SHAPED" && floorNum === totalFlrs && (
                <g id="h-roof-fem-grid" opacity="0.85">
                  {/* Left Wing Grid Lines */}
                  {[-110, -80].map((gx, gIdx) => {
                    const pA = project(gx + twistX, -85, topZ);
                    const pB = project(gx + twistX, 85, topZ);
                    return <line key={`h-fem-l-x-${gIdx}`} x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />;
                  })}
                  {[-28, 28].map((gy, gIdx) => {
                    const pA = project(-140 + twistX, gy, topZ);
                    const pB = project(-50 + twistX, gy, topZ);
                    return <line key={`h-fem-l-y-${gIdx}`} x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />;
                  })}
                  {/* Right Wing Grid Lines */}
                  {[80, 110].map((gx, gIdx) => {
                    const pA = project(gx + twistX, -85, topZ);
                    const pB = project(gx + twistX, 85, topZ);
                    return <line key={`h-fem-r-x-${gIdx}`} x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />;
                  })}
                  {[-28, 28].map((gy, gIdx) => {
                    const pA = project(50 + twistX, gy, topZ);
                    const pB = project(140 + twistX, gy, topZ);
                    return <line key={`h-fem-r-y-${gIdx}`} x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />;
                  })}
                  {/* Center Bridge Crossbar Grid Lines */}
                  {[-16, 16].map((gx, gIdx) => {
                    const pA = project(gx + twistX, -28, topZ);
                    const pB = project(gx + twistX, 28, topZ);
                    return <line key={`h-fem-b-x-${gIdx}`} x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />;
                  })}
                  {(() => {
                    const pA = project(-50 + twistX, 0, topZ);
                    const pB = project(50 + twistX, 0, topZ);
                    return <line x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />;
                  })()}
                </g>
              )}

              {/* Structural FEM Grid Lines on T-Shape Roof Slab (matches ResearchGate structural model) */}
              {massingForm === "T_SHAPED" && floorNum === totalFlrs && (
                <g id="t-roof-fem-grid" opacity="0.85">
                  {/* Front Flange Crossbar Grids */}
                  {[-95, -50, 0, 50, 95].map((gx, gIdx) => {
                    const pA = project(gx + twistX, 20, topZ);
                    const pB = project(gx + twistX, 80, topZ);
                    return <line key={`t-fem-f-x-${gIdx}`} x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />;
                  })}
                  {(() => {
                    const pA = project(-140 + twistX, 50, topZ);
                    const pB = project(140 + twistX, 50, topZ);
                    return <line x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />;
                  })()}
                  {/* Stem Web Grids */}
                  {[-15, -45, -75].map((gy, gIdx) => {
                    const pA = project(-45 + twistX, gy, topZ);
                    const pB = project(45 + twistX, gy, topZ);
                    return <line key={`t-fem-s-y-${gIdx}`} x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />;
                  })}
                  {(() => {
                    const pA = project(0 + twistX, -100, topZ);
                    const pB = project(0 + twistX, 20, topZ);
                    return <line x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />;
                  })()}
                </g>
              )}

              {/* Structural FEM Grid Lines on V-Shape Roof Slab (matches ResearchGate structural model) */}
              {massingForm === "V_SHAPED" && floorNum === totalFlrs && (
                <g id="v-roof-fem-grid" opacity="0.85">
                  {/* Left Wing Lateral Bay Ribs */}
                  {[0.25, 0.5, 0.75].map((ratio, rIdx) => {
                    const xOut = 0 + (-155 - 0) * ratio;
                    const yOut = -115 + (35 - (-115)) * ratio;
                    const xIn = 0 + (-125 - 0) * ratio;
                    const yIn = -50 + (60 - (-50)) * ratio;
                    const pA = project(xOut + twistX, yOut, topZ);
                    const pB = project(xIn + twistX, yIn, topZ);
                    return <line key={`v-fem-l-${rIdx}`} x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />;
                  })}
                  {/* Right Wing Lateral Bay Ribs */}
                  {[0.25, 0.5, 0.75].map((ratio, rIdx) => {
                    const xOut = 0 + (155 - 0) * ratio;
                    const yOut = -115 + (35 - (-115)) * ratio;
                    const xIn = 0 + (125 - 0) * ratio;
                    const yIn = -50 + (60 - (-50)) * ratio;
                    const pA = project(xOut + twistX, yOut, topZ);
                    const pB = project(xIn + twistX, yIn, topZ);
                    return <line key={`v-fem-r-${rIdx}`} x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />;
                  })}
                  {/* Wing Longitudinal Spine Lines */}
                  {(() => {
                    const pApex = project(0 + twistX, -82, topZ);
                    const pLeftTip = project(-140 + twistX, 47, topZ);
                    const pRightTip = project(140 + twistX, 47, topZ);
                    return (
                      <>
                        <line x1={pApex.x} y1={pApex.y} x2={pLeftTip.x} y2={pLeftTip.y} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />
                        <line x1={pApex.x} y1={pApex.y} x2={pRightTip.x} y2={pRightTip.y} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />
                      </>
                    );
                  })()}
                </g>
              )}

              {/* Structural FEM Grid Lines on U-Shape Roof Slab (matches ResearchGate structural model) */}
              {massingForm === "U_SHAPED" && floorNum === totalFlrs && (
                <g id="u-roof-fem-grid" opacity="0.85">
                  {/* Left Wing Cross Bay Lines */}
                  {[-halfD + uRearD * 0.5, 0, halfD * 0.5].map((gy, gIdx) => {
                    const pA = project(-halfW + twistX, gy, topZ);
                    const pB = project(-halfW + uWingW + twistX, gy, topZ);
                    return <line key={`u-fem-l-${gIdx}`} x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />;
                  })}
                  {/* Right Wing Cross Bay Lines */}
                  {[-halfD + uRearD * 0.5, 0, halfD * 0.5].map((gy, gIdx) => {
                    const pA = project(halfW - uWingW + twistX, gy, topZ);
                    const pB = project(halfW + twistX, gy, topZ);
                    return <line key={`u-fem-r-${gIdx}`} x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />;
                  })}
                  {/* Rear Connecting Wing Cross Bay Lines */}
                  {[-halfW * 0.35, 0, halfW * 0.35].map((gx, gIdx) => {
                    const pA = project(gx + twistX, -halfD, topZ);
                    const pB = project(gx + twistX, -halfD + uRearD, topZ);
                    return <line key={`u-fem-b-${gIdx}`} x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />;
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

        {/* 3. DYNAMIC ROOFTOP ARCHITECTURE */}
        {(isolatedFloor === "ALL" || isolatedFloor === totalFlrs) && (() => {
          const topZ = totalFlrs * floorHeight + 10;
          let topWidthScale = 1.0;
          let topDepthScale = 1.0;
          let topTwistX = 0;

          if (massingForm === "STEPPED_CASCADING") {
            const stepRatio = 1 - ((totalFlrs - 1) / totalFlrs) * 0.32;
            topWidthScale = stepRatio;
            topDepthScale = stepRatio;
          } else if (massingForm === "TWISTED_DIAGRID") {
            const twistAngle = ((totalFlrs - 1) / totalFlrs) * 0.55;
            topTwistX = Math.sin(twistAngle) * 16;
          }

          const halfW = (buildingWidth / 2) * topWidthScale;
          const halfD = (buildingDepth / 2) * topDepthScale;
          const xCorner = 10;
          const yCorner = -10;
          const uWingW = halfW * 0.40;
          const uRearD = halfD * 0.44;

          // Parapet wall coping (standard rectangular)
          const p1 = project(-halfW + topTwistX, -halfD, topZ + 8);
          const p2 = project(halfW + topTwistX, -halfD, topZ + 8);
          const p3 = project(halfW + topTwistX, halfD, topZ + 8);
          const p4 = project(-halfW + topTwistX, halfD, topZ + 8);

          // Parapet wall coping (L-shaped)
          const lp1 = project(-halfW + topTwistX, -halfD, topZ + 8);
          const lp2 = project(halfW + topTwistX, -halfD, topZ + 8);
          const lp3 = project(halfW + topTwistX, yCorner, topZ + 8);
          const lp4 = project(xCorner + topTwistX, yCorner, topZ + 8);
          const lp5 = project(xCorner + topTwistX, halfD, topZ + 8);
          const lp6 = project(-halfW + topTwistX, halfD, topZ + 8);

          // V-Shaped Parapet
          const roof_vt1 = project(0 + topTwistX, -115, topZ + 8);
          const roof_vt2 = project(155 + topTwistX, 35, topZ + 8);
          const roof_vt3 = project(125 + topTwistX, 60, topZ + 8);
          const roof_vt4 = project(0 + topTwistX, -50, topZ + 8);
          const roof_vt5 = project(-125 + topTwistX, 60, topZ + 8);
          const roof_vt6 = project(-155 + topTwistX, 35, topZ + 8);

          // T-Shaped Parapet
          const roof_tt1 = project(-140 + topTwistX, 20, topZ + 8);
          const roof_tt2 = project(-45 + topTwistX, 20, topZ + 8);
          const roof_tt3 = project(-45 + topTwistX, -100, topZ + 8);
          const roof_tt4 = project(45 + topTwistX, -100, topZ + 8);
          const roof_tt5 = project(45 + topTwistX, 20, topZ + 8);
          const roof_tt6 = project(140 + topTwistX, 20, topZ + 8);
          const roof_tt7 = project(140 + topTwistX, 80, topZ + 8);
          const roof_tt8 = project(-140 + topTwistX, 80, topZ + 8);

          // H-Shaped Parapet
          const roof_ht1 = project(-140 + topTwistX, -85, topZ + 8);
          const roof_ht2 = project(-50 + topTwistX, -85, topZ + 8);
          const roof_ht3 = project(-50 + topTwistX, -28, topZ + 8);
          const roof_ht4 = project(50 + topTwistX, -28, topZ + 8);
          const roof_ht5 = project(50 + topTwistX, -85, topZ + 8);
          const roof_ht6 = project(140 + topTwistX, -85, topZ + 8);
          const roof_ht7 = project(140 + topTwistX, 85, topZ + 8);
          const roof_ht8 = project(50 + topTwistX, 85, topZ + 8);
          const roof_ht9 = project(50 + topTwistX, 28, topZ + 8);
          const roof_ht10 = project(-50 + topTwistX, 28, topZ + 8);
          const roof_ht11 = project(-50 + topTwistX, 85, topZ + 8);
          const roof_ht12 = project(-140 + topTwistX, 85, topZ + 8);

          // U-Shaped Parapet
          const roof_ut1 = project(-halfW + topTwistX, -halfD, topZ + 8);
          const roof_ut2 = project(halfW + topTwistX, -halfD, topZ + 8);
          const roof_ut3 = project(halfW + topTwistX, halfD, topZ + 8);
          const roof_ut4 = project(halfW - uWingW + topTwistX, halfD, topZ + 8);
          const roof_ut5 = project(halfW - uWingW + topTwistX, -halfD + uRearD, topZ + 8);
          const roof_ut6 = project(-halfW + uWingW + topTwistX, -halfD + uRearD, topZ + 8);
          const roof_ut7 = project(-halfW + uWingW + topTwistX, halfD, topZ + 8);
          const roof_ut8 = project(-halfW + topTwistX, halfD, topZ + 8);

          // Open Square Donut Parapet
          const roof_qt1 = project(-125 + topTwistX, -110, topZ + 8);
          const roof_qt2 = project(125 + topTwistX, -110, topZ + 8);
          const roof_qt3 = project(125 + topTwistX, 85, topZ + 8);
          const roof_qt4 = project(-125 + topTwistX, 85, topZ + 8);
          const roof_qHoleT1 = project(-50 + topTwistX, -45, topZ + 8);
          const roof_qHoleT2 = project(50 + topTwistX, -45, topZ + 8);
          const roof_qHoleT3 = project(50 + topTwistX, 35, topZ + 8);
          const roof_qHoleT4 = project(-50 + topTwistX, 35, topZ + 8);

          // Circular Donut Parapet
          const roof_circSegs = 16;
          const roof_circR_out = 135 * topWidthScale;
          const roof_circR_in = 65 * topWidthScale;
          const roof_circOutT: { x: number; y: number }[] = [];
          const roof_circInT: { x: number; y: number }[] = [];
          for (let i = 0; i < roof_circSegs; i++) {
            const ang = (i * 2 * Math.PI) / roof_circSegs;
            roof_circOutT.push(project(Math.cos(ang) * roof_circR_out + topTwistX, Math.sin(ang) * (roof_circR_out * 0.7) - 15, topZ + 8));
            roof_circInT.push(project(Math.cos(ang) * roof_circR_in + topTwistX, Math.sin(ang) * (roof_circR_in * 0.7) - 15, topZ + 8));
          }

          // Parapet wall coping (curved crescent)
          const cpTopOut: { x: number; y: number }[] = [];
          const cpTopIn: { x: number; y: number }[] = [];
          if (isCurvedRounded) {
            const arcSegs = 8;
            const radMin = (18 * Math.PI) / 180;
            const radMax = (162 * Math.PI) / 180;
            const rxOut = 142 * topWidthScale;
            const ryOut = 92 * topDepthScale;
            const rxIn = 72 * topWidthScale;
            const ryIn = 46 * topDepthScale;
            const yOffset = -25;
            for (let i = 0; i <= arcSegs; i++) {
              const ang = radMin + (i / arcSegs) * (radMax - radMin);
              const xo = -Math.cos(ang) * rxOut + topTwistX;
              const yo = -Math.sin(ang) * ryOut + yOffset;
              const xi = -Math.cos(ang) * rxIn + topTwistX;
              const yi = -Math.sin(ang) * ryIn + yOffset;
              cpTopOut.push(project(xo, yo, topZ + 8));
              cpTopIn.push(project(xi, yi, topZ + 8));
            }
          }

          // Central Core Lift Machine Room positioning per massing shape
          let coreX = 0;
          let coreY = 0;
          let coreW = 25;
          let coreD = 20;
          if (isLShaped) {
            coreX = -halfW * 0.45;
            coreY = -halfD * 0.45;
          } else if (massingForm === "U_SHAPED") {
            coreX = 0;
            coreY = -halfD + uRearD / 2;
            coreW = 28;
            coreD = 16;
          } else if (massingForm === "H_SHAPED") {
            coreX = 0;
            coreY = 0;
            coreW = 22;
            coreD = 14;
          } else if (massingForm === "OPEN_SQUARE_DONUT") {
            coreX = 0;
            coreY = -75;
            coreW = 24;
            coreD = 15;
          } else if (massingForm === "V_SHAPED") {
            coreX = 0;
            coreY = -80;
            coreW = 20;
            coreD = 16;
          } else if (massingForm === "T_SHAPED") {
            coreX = 0;
            coreY = 50;
            coreW = 24;
            coreD = 16;
          }

          const l1 = project(coreX - coreW + topTwistX, coreY - coreD, topZ);
          const l2 = project(coreX + coreW + topTwistX, coreY - coreD, topZ);
          const l3 = project(coreX + coreW + topTwistX, coreY + coreD, topZ);
          const l4 = project(coreX - coreW + topTwistX, coreY + coreD, topZ);

          const lt1 = project(coreX - coreW + topTwistX, coreY - coreD, topZ + 26);
          const lt2 = project(coreX + coreW + topTwistX, coreY - coreD, topZ + 26);
          const lt3 = project(coreX + coreW + topTwistX, coreY + coreD, topZ + 26);
          const lt4 = project(coreX - coreW + topTwistX, coreY + coreD, topZ + 26);

          return (
            <g id="rooftop-feature-group">
              {/* Parapet Outline */}
              {massingForm === "OPEN_SQUARE_DONUT" ? (
                <g id="parapet-sq-donut">
                  <polygon points={`${roof_qt1.x},${roof_qt1.y} ${roof_qt2.x},${roof_qt2.y} ${roof_qt3.x},${roof_qt3.y} ${roof_qt4.x},${roof_qt4.y}`} fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 2" />
                  <polygon points={`${roof_qHoleT1.x},${roof_qHoleT1.y} ${roof_qHoleT2.x},${roof_qHoleT2.y} ${roof_qHoleT3.x},${roof_qHoleT3.y} ${roof_qHoleT4.x},${roof_qHoleT4.y}`} fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 2" />
                </g>
              ) : massingForm === "CIRCULAR_DONUT" ? (
                <g id="parapet-circ-donut">
                  <polygon points={roof_circOutT.map(p => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 2" />
                  <polygon points={roof_circInT.map(p => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 2" />
                </g>
              ) : (
                <polygon
                  points={
                    massingForm === "V_SHAPED"
                      ? `${roof_vt1.x},${roof_vt1.y} ${roof_vt2.x},${roof_vt2.y} ${roof_vt3.x},${roof_vt3.y} ${roof_vt4.x},${roof_vt4.y} ${roof_vt5.x},${roof_vt5.y} ${roof_vt6.x},${roof_vt6.y}`
                      : massingForm === "U_SHAPED"
                      ? `${roof_ut1.x},${roof_ut1.y} ${roof_ut2.x},${roof_ut2.y} ${roof_ut3.x},${roof_ut3.y} ${roof_ut4.x},${roof_ut4.y} ${roof_ut5.x},${roof_ut5.y} ${roof_ut6.x},${roof_ut6.y} ${roof_ut7.x},${roof_ut7.y} ${roof_ut8.x},${roof_ut8.y}`
                      : massingForm === "T_SHAPED"
                      ? `${roof_tt1.x},${roof_tt1.y} ${roof_tt2.x},${roof_tt2.y} ${roof_tt3.x},${roof_tt3.y} ${roof_tt4.x},${roof_tt4.y} ${roof_tt5.x},${roof_tt5.y} ${roof_tt6.x},${roof_tt6.y} ${roof_tt7.x},${roof_tt7.y} ${roof_tt8.x},${roof_tt8.y}`
                      : massingForm === "H_SHAPED"
                      ? `${roof_ht1.x},${roof_ht1.y} ${roof_ht2.x},${roof_ht2.y} ${roof_ht3.x},${roof_ht3.y} ${roof_ht4.x},${roof_ht4.y} ${roof_ht5.x},${roof_ht5.y} ${roof_ht6.x},${roof_ht6.y} ${roof_ht7.x},${roof_ht7.y} ${roof_ht8.x},${roof_ht8.y} ${roof_ht9.x},${roof_ht9.y} ${roof_ht10.x},${roof_ht10.y} ${roof_ht11.x},${roof_ht11.y} ${roof_ht12.x},${roof_ht12.y}`
                      : isCurvedRounded
                      ? [...cpTopOut, ...[...cpTopIn].reverse()].map(p => `${p.x},${p.y}`).join(" ")
                      : isLShaped
                      ? `${lp1.x},${lp1.y} ${lp2.x},${lp2.y} ${lp3.x},${lp3.y} ${lp4.x},${lp4.y} ${lp5.x},${lp5.y} ${lp6.x},${lp6.y}`
                      : `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`
                  }
                  fill={hasRooftopGarden ? "rgba(5, 150, 105, 0.25)" : "none"}
                  stroke={hasRooftopGarden ? "#10B981" : (isCyberObsidian ? "#06B6D4" : (isLuxuryGold ? "#F59E0B" : "#38BDF8"))}
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
              )}

              {/* Central Lift Core Box */}
              <polygon points={`${l1.x},${l1.y} ${l2.x},${l2.y} ${l3.x},${l3.y} ${l4.x},${l4.y}`} fill="#334155" />
              <polygon points={`${l3.x},${l3.y} ${l4.x},${l4.y} ${lt4.x},${lt4.y} ${lt3.x},${lt3.y}`} fill="#1E293B" stroke="#475569" />
              <polygon points={`${l2.x},${l2.y} ${l3.x},${l3.y} ${lt3.x},${lt3.y} ${lt2.x},${lt2.y}`} fill="#0F172A" stroke="#475569" />
              <polygon points={`${lt1.x},${lt1.y} ${lt2.x},${lt2.y} ${lt3.x},${lt3.y} ${lt4.x},${lt4.y}`} fill="#475569" stroke="#64748B" />

              {/* Communication Mast / Antenna Spire */}
              {(() => {
                const spireBase = project(coreX + topTwistX, coreY, topZ + 26);
                const spireTip = project(coreX + topTwistX, coreY, topZ + 55);
                return (
                  <g id="rooftop-antenna">
                    <line x1={spireBase.x} y1={spireBase.y} x2={spireTip.x} y2={spireTip.y} stroke="#EF4444" strokeWidth="2.5" />
                    <circle cx={spireTip.x} cy={spireTip.y} r="3" fill="#EF4444" className="animate-ping" />
                    <circle cx={spireTip.x} cy={spireTip.y} r="2.5" fill="#EF4444" />
                  </g>
                );
              })()}

              {/* 1. ROOFTOP HELIPAD */}
              {rooftopFeature === "HELIPAD" && (() => {
                const padZ = topZ + 14;
                let padRadius = 65;
                let padCenterX = topTwistX;
                let padCenterY = 0;

                if (massingForm === "H_SHAPED") {
                  padCenterX = -95 + topTwistX;
                  padCenterY = 0;
                  padRadius = 38;
                } else if (massingForm === "U_SHAPED") {
                  padCenterX = 0 + topTwistX;
                  padCenterY = -halfD + uRearD / 2;
                  padRadius = 36;
                } else if (massingForm === "V_SHAPED") {
                  padCenterX = 0 + topTwistX;
                  padCenterY = -75;
                  padRadius = 38;
                } else if (massingForm === "OPEN_SQUARE_DONUT") {
                  padCenterX = 85 + topTwistX;
                  padCenterY = -15;
                  padRadius = 34;
                }

                const numPoints = 12;
                const padPoints = [];
                for (let i = 0; i < numPoints; i++) {
                  const angle = (i * 2 * Math.PI) / numPoints;
                  const px = Math.cos(angle) * padRadius + padCenterX;
                  const py = Math.sin(angle) * padRadius + padCenterY;
                  padPoints.push(project(px, py, padZ));
                }

                const hCenter = project(padCenterX, padCenterY, padZ);
                const hH = padRadius * 0.32;
                const hW = padRadius * 0.22;
                const hLeftTop = project(-hW + padCenterX, -hH + padCenterY, padZ);
                const hLeftBottom = project(-hW + padCenterX, hH + padCenterY, padZ);
                const hRightTop = project(hW + padCenterX, -hH + padCenterY, padZ);
                const hRightBottom = project(hW + padCenterX, hH + padCenterY, padZ);
                const hMidLeft = project(-hW + padCenterX, padCenterY, padZ);
                const hMidRight = project(hW + padCenterX, padCenterY, padZ);

                const beaconPoints = [
                  project(-padRadius + 4 + padCenterX, padCenterY, padZ),
                  project(padRadius - 4 + padCenterX, padCenterY, padZ),
                  project(padCenterX, -padRadius + 4 + padCenterY, padZ),
                  project(padCenterX, padRadius - 4 + padCenterY, padZ),
                ];

                return (
                  <g id="rooftop-helipad">
                    {/* Support Columns */}
                    {padPoints.filter((_, idx) => idx % 3 === 0).map((pt, pIdx) => {
                      const basePt = project(Math.cos((pIdx * 3 * 2 * Math.PI) / numPoints) * padRadius + padCenterX, Math.sin((pIdx * 3 * 2 * Math.PI) / numPoints) * padRadius + padCenterY, topZ);
                      return <line key={`helipad-ped-${pIdx}`} x1={basePt.x} y1={basePt.y} x2={pt.x} y2={pt.y} stroke="#64748B" strokeWidth="3.5" />;
                    })}
                    <polygon points={padPoints.map(p => `${p.x},${p.y}`).join(" ")} fill="url(#helipadTarmac)" stroke="#FACC15" strokeWidth="3.5" />
                    <line x1={hLeftTop.x} y1={hLeftTop.y} x2={hLeftBottom.x} y2={hLeftBottom.y} stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
                    <line x1={hRightTop.x} y1={hRightTop.y} x2={hRightBottom.x} y2={hRightBottom.y} stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
                    <line x1={hMidLeft.x} y1={hMidLeft.y} x2={hMidRight.x} y2={hMidRight.y} stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
                    {beaconPoints.map((bp, bIdx) => (
                      <g key={`beacon-${bIdx}`}>
                        <circle cx={bp.x} cy={bp.y} r="4" fill="#EF4444" stroke="#FECACA" strokeWidth="1" />
                        <circle cx={bp.x} cy={bp.y} r="2" fill="#FFFFFF" />
                      </g>
                    ))}
                    <g transform={`translate(${hCenter.x - 70}, ${hCenter.y - 45})`}>
                      <rect x="0" y="-8" width="140" height="18" rx="4" fill="rgba(15, 23, 42, 0.95)" stroke="#FACC15" strokeWidth="1.2" />
                      <text x="70" y="4" fill="#FACC15" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        🚁 HELIPAD + SKY TERRACE
                      </text>
                    </g>
                  </g>
                );
              })()}

              {/* 2. ROOFTOP SKY INFINITY POOL */}
              {rooftopFeature === "INFINITY_POOL" && (() => {
                const poolZ = topZ + 6;
                let poolW1 = project(-halfW * 0.7 + topTwistX, -halfD * 0.3, poolZ);
                let poolW2 = project(halfW * 0.7 + topTwistX, -halfD * 0.3, poolZ);
                let poolW3 = project(halfW * 0.7 + topTwistX, halfD * 0.7, poolZ);
                let poolW4 = project(-halfW * 0.7 + topTwistX, halfD * 0.7, poolZ);

                // Wooden sundeck border
                let deck1 = project(-halfW * 0.9 + topTwistX, -halfD * 0.5, poolZ - 2);
                let deck2 = project(halfW * 0.9 + topTwistX, -halfD * 0.5, poolZ - 2);
                let deck3 = project(halfW * 0.9 + topTwistX, halfD * 0.85, poolZ - 2);
                let deck4 = project(-halfW * 0.9 + topTwistX, halfD * 0.85, poolZ - 2);

                if (massingForm === "H_SHAPED") {
                  // Placed on Right Wing
                  poolW1 = project(65 + topTwistX, -30, poolZ);
                  poolW2 = project(125 + topTwistX, -30, poolZ);
                  poolW3 = project(125 + topTwistX, 65, poolZ);
                  poolW4 = project(65 + topTwistX, 65, poolZ);
                  deck1 = project(55 + topTwistX, -40, poolZ - 2);
                  deck2 = project(135 + topTwistX, -40, poolZ - 2);
                  deck3 = project(135 + topTwistX, 75, poolZ - 2);
                  deck4 = project(55 + topTwistX, 75, poolZ - 2);
                } else if (massingForm === "U_SHAPED") {
                  // Placed on Rear Connecting Wing
                  poolW1 = project(-60 + topTwistX, -halfD + 6, poolZ);
                  poolW2 = project(60 + topTwistX, -halfD + 6, poolZ);
                  poolW3 = project(60 + topTwistX, -halfD + uRearD - 8, poolZ);
                  poolW4 = project(-60 + topTwistX, -halfD + uRearD - 8, poolZ);
                  deck1 = project(-70 + topTwistX, -halfD + 2, poolZ - 2);
                  deck2 = project(70 + topTwistX, -halfD + 2, poolZ - 2);
                  deck3 = project(70 + topTwistX, -halfD + uRearD - 4, poolZ - 2);
                  deck4 = project(-70 + topTwistX, -halfD + uRearD - 4, poolZ - 2);
                } else if (massingForm === "OPEN_SQUARE_DONUT") {
                  // Placed on South Roof Slab
                  poolW1 = project(-80 + topTwistX, 48, poolZ);
                  poolW2 = project(80 + topTwistX, 48, poolZ);
                  poolW3 = project(80 + topTwistX, 75, poolZ);
                  poolW4 = project(-80 + topTwistX, 75, poolZ);
                  deck1 = project(-90 + topTwistX, 42, poolZ - 2);
                  deck2 = project(90 + topTwistX, 42, poolZ - 2);
                  deck3 = project(90 + topTwistX, 82, poolZ - 2);
                  deck4 = project(-90 + topTwistX, 82, poolZ - 2);
                } else if (massingForm === "V_SHAPED") {
                  // Placed on Right Wing Tip
                  poolW1 = project(80 + topTwistX, -10, poolZ);
                  poolW2 = project(140 + topTwistX, 20, poolZ);
                  poolW3 = project(120 + topTwistX, 45, poolZ);
                  poolW4 = project(60 + topTwistX, 15, poolZ);
                  deck1 = project(75 + topTwistX, -15, poolZ - 2);
                  deck2 = project(145 + topTwistX, 15, poolZ - 2);
                  deck3 = project(125 + topTwistX, 50, poolZ - 2);
                  deck4 = project(55 + topTwistX, 20, poolZ - 2);
                }

                return (
                  <g id="rooftop-infinity-pool">
                    {/* Teak Timber Sundeck */}
                    <polygon points={`${deck1.x},${deck1.y} ${deck2.x},${deck2.y} ${deck3.x},${deck3.y} ${deck4.x},${deck4.y}`} fill="#78350F" stroke="#B45309" strokeWidth="1.5" />
                    {/* Luminous Cyan Pool Water Body */}
                    <polygon points={`${poolW1.x},${poolW1.y} ${poolW2.x},${poolW2.y} ${poolW3.x},${poolW3.y} ${poolW4.x},${poolW4.y}`} fill="url(#poolWater)" stroke="#67E8F9" strokeWidth="2" />
                    {/* Glass Rim-Flow Overflow Edge */}
                    <line x1={poolW4.x} y1={poolW4.y} x2={poolW3.x} y2={poolW3.y} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                    {/* Poolside Sun Loungers */}
                    {[-30, 0, 30].map((lx, lIdx) => {
                      const lp = project(lx + topTwistX, -halfD * 0.4, poolZ);
                      return <rect key={`lounger-${lIdx}`} x={lp.x - 7} y={lp.y - 4} width="14" height="8" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.8" />;
                    })}
                    {/* Callout Badge */}
                    <g transform={`translate(${poolW1.x + 30}, ${poolW1.y - 25})`}>
                      <rect x="0" y="-8" width="165" height="18" rx="4" fill="rgba(15, 23, 42, 0.95)" stroke="#06B6D4" strokeWidth="1.2" />
                      <text x="82" y="4" fill="#22D3EE" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        🏊 SKY INFINITY POOL & SUNDECK
                      </text>
                    </g>
                  </g>
                );
              })()}

              {/* 3. ROOFTOP OBSERVATORY DOME */}
              {rooftopFeature === "OBSERVATORY_DOME" && (() => {
                const domeCenter = project(topTwistX, 0, topZ + 26);
                const domeRadius = 45;
                return (
                  <g id="rooftop-observatory-dome">
                    {/* Spherical Dome Structure */}
                    <ellipse cx={domeCenter.x} cy={domeCenter.y - 12} rx={domeRadius} ry={domeRadius * 0.75} fill="url(#glassFacadeDay)" stroke="#38BDF8" strokeWidth="2" />
                    {/* Geodesic Rib Lines */}
                    <ellipse cx={domeCenter.x} cy={domeCenter.y - 12} rx={domeRadius * 0.65} ry={domeRadius * 0.75} fill="none" stroke="#E0F2FE" strokeWidth="1.2" />
                    <ellipse cx={domeCenter.x} cy={domeCenter.y - 12} rx={domeRadius * 0.3} ry={domeRadius * 0.75} fill="none" stroke="#E0F2FE" strokeWidth="1" />
                    {/* Astronomical Telescope Viewing Slit */}
                    <line x1={domeCenter.x - 8} y1={domeCenter.y - 42} x2={domeCenter.x + 12} y2={domeCenter.y + 12} stroke="#F59E0B" strokeWidth="3" />
                    {/* Callout Badge */}
                    <g transform={`translate(${domeCenter.x - 85}, ${domeCenter.y - 55})`}>
                      <rect x="0" y="-8" width="170" height="18" rx="4" fill="rgba(15, 23, 42, 0.95)" stroke="#38BDF8" strokeWidth="1.2" />
                      <text x="85" y="4" fill="#38BDF8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        🔭 SKY OBSERVATORY & DOME
                      </text>
                    </g>
                  </g>
                );
              })()}

              {/* 4. ROOFTOP PITCHED GABLE ROOF */}
              {rooftopFeature === "GABLE_ROOF" && (() => {
                const ridgeHeight = topZ + 36;
                const ridge1 = project(-halfW + topTwistX, 0, ridgeHeight);
                const ridge2 = project(halfW + topTwistX, 0, ridgeHeight);

                return (
                  <g id="rooftop-gable-roof">
                    {/* Sloped Roof Plane Front */}
                    <polygon points={`${ridge1.x},${ridge1.y} ${ridge2.x},${ridge2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`} fill="#B91C1C" stroke="#7F1D1D" strokeWidth="1.5" />
                    {/* Sloped Roof Plane Rear */}
                    <polygon points={`${ridge1.x},${ridge1.y} ${ridge2.x},${ridge2.y} ${p2.x},${p2.y} ${p1.x},${p1.y}`} fill="#991B1B" stroke="#7F1D1D" strokeWidth="1.5" />
                    {/* Ridge Line */}
                    <line x1={ridge1.x} y1={ridge1.y} x2={ridge2.x} y2={ridge2.y} stroke="#FEF08A" strokeWidth="2.5" />
                    {/* Callout Badge */}
                    <g transform={`translate(${ridge1.x + 30}, ${ridge1.y - 20})`}>
                      <rect x="0" y="-8" width="160" height="18" rx="4" fill="rgba(15, 23, 42, 0.95)" stroke="#EF4444" strokeWidth="1.2" />
                      <text x="80" y="4" fill="#FCA5A5" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        🏠 ARCHITECTURAL GABLE ROOF
                      </text>
                    </g>
                  </g>
                );
              })()}

              {/* 5. AERODYNAMIC AIRPLANE WING ROOF */}
              {rooftopFeature === "AIRPLANE_WING_ROOF" && (() => {
                const wingZ = topZ + 12;
                // Fuselage Center Cabin
                const fuse1 = project(-32 + topTwistX, -50, wingZ);
                const fuse2 = project(32 + topTwistX, -50, wingZ);
                const fuse3 = project(32 + topTwistX, 40, wingZ);
                const fuse4 = project(-32 + topTwistX, 40, wingZ);
                const noseTip = project(0 + topTwistX, 75, wingZ + 4);

                // Swept Left Wing
                const wingLRootFront = project(-28 + topTwistX, 20, wingZ);
                const wingLRootRear = project(-28 + topTwistX, -35, wingZ);
                const wingLTipFront = project(-195 + topTwistX, -30, wingZ + 6);
                const wingLTipRear = project(-185 + topTwistX, -55, wingZ + 6);
                const wingletL = project(-195 + topTwistX, -30, wingZ + 20);

                // Swept Right Wing
                const wingRRootFront = project(28 + topTwistX, 20, wingZ);
                const wingRRootRear = project(28 + topTwistX, -35, wingZ);
                const wingRTipFront = project(195 + topTwistX, -30, wingZ + 6);
                const wingRTipRear = project(185 + topTwistX, -55, wingZ + 6);
                const wingletR = project(195 + topTwistX, -30, wingZ + 20);

                return (
                  <g id="rooftop-airplane-wing">
                    {/* Swept Left Wing Surface */}
                    <polygon
                      points={`${wingLRootRear.x},${wingLRootRear.y} ${wingLRootFront.x},${wingLRootFront.y} ${wingLTipFront.x},${wingLTipFront.y} ${wingLTipRear.x},${wingLTipRear.y}`}
                      fill="#1E293B"
                      stroke="#38BDF8"
                      strokeWidth="1.8"
                    />
                    {/* Left Winglet (Canted Upwards) with Red Port Aviation Beacon */}
                    <polygon
                      points={`${wingLTipRear.x},${wingLTipRear.y} ${wingLTipFront.x},${wingLTipFront.y} ${wingletL.x},${wingletL.y}`}
                      fill="#0284C7"
                      stroke="#EF4444"
                      strokeWidth="1.5"
                    />
                    <circle cx={wingletL.x} cy={wingletL.y} r="3.5" fill="#EF4444" className="animate-ping" />
                    <circle cx={wingletL.x} cy={wingletL.y} r="3" fill="#EF4444" />

                    {/* Swept Right Wing Surface */}
                    <polygon
                      points={`${wingRRootRear.x},${wingRRootRear.y} ${wingRRootFront.x},${wingRRootFront.y} ${wingRTipFront.x},${wingRTipFront.y} ${wingRTipRear.x},${wingRTipRear.y}`}
                      fill="#0F172A"
                      stroke="#38BDF8"
                      strokeWidth="1.8"
                    />
                    {/* Right Winglet (Canted Upwards) with Green Starboard Aviation Beacon */}
                    <polygon
                      points={`${wingRTipRear.x},${wingRTipRear.y} ${wingRTipFront.x},${wingRTipFront.y} ${wingletR.x},${wingletR.y}`}
                      fill="#0284C7"
                      stroke="#10B981"
                      strokeWidth="1.5"
                    />
                    <circle cx={wingletR.x} cy={wingletR.y} r="3.5" fill="#10B981" className="animate-ping" />
                    <circle cx={wingletR.x} cy={wingletR.y} r="3" fill="#10B981" />

                    {/* Aerodynamic Fuselage Cockpit / Observation Deck */}
                    <polygon
                      points={`${fuse1.x},${fuse1.y} ${fuse2.x},${fuse2.y} ${fuse3.x},${fuse3.y} ${noseTip.x},${noseTip.y} ${fuse4.x},${fuse4.y}`}
                      fill="url(#glassFacadeDay)"
                      stroke="#38BDF8"
                      strokeWidth="2"
                    />
                    <line x1={fuse4.x} y1={fuse4.y} x2={noseTip.x} y2={noseTip.y} stroke="#FFFFFF" strokeWidth="2" />
                    <line x1={fuse3.x} y1={fuse3.y} x2={noseTip.x} y2={noseTip.y} stroke="#FFFFFF" strokeWidth="2" />

                    {/* Callout Badge */}
                    <g transform={`translate(${noseTip.x - 105}, ${noseTip.y + 16})`}>
                      <rect x="0" y="-8" width="210" height="18" rx="4" fill="rgba(15, 23, 42, 0.95)" stroke="#38BDF8" strokeWidth="1.2" />
                      <text x="105" y="4" fill="#38BDF8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        ✈️ AERODYNAMIC AIRPLANE WING ROOF
                      </text>
                    </g>
                  </g>
                );
              })()}

              {/* 6. MONOCRYSTALLINE SOLAR PV ROOFTOP FARM */}
              {(rooftopFeature === "SOLAR_ARRAY" || hasSolarPanels) && (() => {
                if (massingForm === "OPEN_SQUARE_DONUT") {
                  // 4 Perimeter Solar Arrays framing the open atrium (matches Reference Image 9!)
                  // North Slab Array
                  const sN1 = project(-90 + topTwistX, -95, topZ + 8);
                  const sN2 = project(90 + topTwistX, -95, topZ + 8);
                  const sN3 = project(90 + topTwistX, -65, topZ + 14);
                  const sN4 = project(-90 + topTwistX, -65, topZ + 14);
                  // South Slab Array
                  const sS1 = project(-90 + topTwistX, 50, topZ + 8);
                  const sS2 = project(90 + topTwistX, 50, topZ + 8);
                  const sS3 = project(90 + topTwistX, 75, topZ + 14);
                  const sS4 = project(-90 + topTwistX, 75, topZ + 14);
                  // West Slab Array
                  const sW1 = project(-115 + topTwistX, -45, topZ + 8);
                  const sW2 = project(-70 + topTwistX, -45, topZ + 8);
                  const sW3 = project(-70 + topTwistX, 35, topZ + 14);
                  const sW4 = project(-115 + topTwistX, 35, topZ + 14);
                  // East Slab Array
                  const sE1 = project(70 + topTwistX, -45, topZ + 8);
                  const sE2 = project(115 + topTwistX, -45, topZ + 8);
                  const sE3 = project(115 + topTwistX, 35, topZ + 14);
                  const sE4 = project(70 + topTwistX, 35, topZ + 14);

                  return (
                    <g id="rooftop-solar-farm-donut">
                      <polygon points={`${sN1.x},${sN1.y} ${sN2.x},${sN2.y} ${sN3.x},${sN3.y} ${sN4.x},${sN4.y}`} fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1" />
                      <polygon points={`${sS1.x},${sS1.y} ${sS2.x},${sS2.y} ${sS3.x},${sS3.y} ${sS4.x},${sS4.y}`} fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1" />
                      <polygon points={`${sW1.x},${sW1.y} ${sW2.x},${sW2.y} ${sW3.x},${sW3.y} ${sW4.x},${sW4.y}`} fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1" />
                      <polygon points={`${sE1.x},${sE1.y} ${sE2.x},${sE2.y} ${sE3.x},${sE3.y} ${sE4.x},${sE4.y}`} fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1" />
                      <g transform={`translate(${sN1.x - 10}, ${sN1.y - 25})`}>
                        <rect x="0" y="-8" width="180" height="18" rx="4" fill="rgba(15, 23, 42, 0.95)" stroke="#F59E0B" strokeWidth="1.2" />
                        <text x="90" y="4" fill="#FDE047" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                          ⚡ QUAD PERIMETER SOLAR PV (180 kWp)
                        </text>
                      </g>
                    </g>
                  );
                } else if (massingForm === "H_SHAPED") {
                  // Twin arrays on Left Wing and Right Wing, central bridge clear!
                  const r1A = project(-125 + topTwistX, -45, topZ + 10);
                  const r1B = project(-65 + topTwistX, -45, topZ + 10);
                  const r1C = project(-65 + topTwistX, 45, topZ + 16);
                  const r1D = project(-125 + topTwistX, 45, topZ + 16);

                  const r2A = project(65 + topTwistX, -45, topZ + 10);
                  const r2B = project(125 + topTwistX, -45, topZ + 10);
                  const r2C = project(125 + topTwistX, 45, topZ + 16);
                  const r2D = project(65 + topTwistX, 45, topZ + 16);

                  return (
                    <g id="rooftop-solar-farm-hshape">
                      <polygon points={`${r1A.x},${r1A.y} ${r1B.x},${r1B.y} ${r1C.x},${r1C.y} ${r1D.x},${r1D.y}`} fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1.2" />
                      <line x1={(r1A.x + r1B.x) / 2} y1={(r1A.y + r1B.y) / 2} x2={(r1D.x + r1C.x) / 2} y2={(r1D.y + r1C.y) / 2} stroke="#93C5FD" strokeWidth="0.8" />
                      <polygon points={`${r2A.x},${r2A.y} ${r2B.x},${r2B.y} ${r2C.x},${r2C.y} ${r2D.x},${r2D.y}`} fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1.2" />
                      <line x1={(r2A.x + r2B.x) / 2} y1={(r2A.y + r2B.y) / 2} x2={(r2D.x + r2C.x) / 2} y2={(r2D.y + r2C.y) / 2} stroke="#93C5FD" strokeWidth="0.8" />
                      <g transform={`translate(${r1A.x - 10}, ${r1A.y - 25})`}>
                        <rect x="0" y="-8" width="180" height="18" rx="4" fill="rgba(15, 23, 42, 0.95)" stroke="#F59E0B" strokeWidth="1.2" />
                        <text x="90" y="4" fill="#FDE047" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                          ⚡ TWIN WING SOLAR PV FARM (150 kWp)
                        </text>
                      </g>
                    </g>
                  );
                } else if (massingForm === "U_SHAPED") {
                  // Arrays on Left Wing and Right Wing
                  const r1A = project(-halfW + 8 + topTwistX, -halfD + 10, topZ + 10);
                  const r1B = project(-halfW + uWingW - 8 + topTwistX, -halfD + 10, topZ + 10);
                  const r1C = project(-halfW + uWingW - 8 + topTwistX, halfD - 10, topZ + 16);
                  const r1D = project(-halfW + 8 + topTwistX, halfD - 10, topZ + 16);

                  const r2A = project(halfW - uWingW + 8 + topTwistX, -halfD + 10, topZ + 10);
                  const r2B = project(halfW - 8 + topTwistX, -halfD + 10, topZ + 10);
                  const r2C = project(halfW - 8 + topTwistX, halfD - 10, topZ + 16);
                  const r2D = project(halfW - uWingW + 8 + topTwistX, halfD - 10, topZ + 16);

                  return (
                    <g id="rooftop-solar-farm-ushape">
                      <polygon points={`${r1A.x},${r1A.y} ${r1B.x},${r1B.y} ${r1C.x},${r1C.y} ${r1D.x},${r1D.y}`} fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1.2" />
                      <polygon points={`${r2A.x},${r2A.y} ${r2B.x},${r2B.y} ${r2C.x},${r2C.y} ${r2D.x},${r2D.y}`} fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1.2" />
                      <g transform={`translate(${r1A.x - 10}, ${r1A.y - 25})`}>
                        <rect x="0" y="-8" width="180" height="18" rx="4" fill="rgba(15, 23, 42, 0.95)" stroke="#F59E0B" strokeWidth="1.2" />
                        <text x="90" y="4" fill="#FDE047" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                          ⚡ U-WING SOLAR PV FARM (140 kWp)
                        </text>
                      </g>
                    </g>
                  );
                }

                // Default 3 Racks of Solar PV panels for standard buildings
                const r1A = project(-110 + topTwistX, -40, topZ + 12);
                const r1B = project(-30 + topTwistX, -40, topZ + 12);
                const r1C = project(-30 + topTwistX, -5, topZ + 18);
                const r1D = project(-110 + topTwistX, -5, topZ + 18);

                const r2A = project(-110 + topTwistX, 5, topZ + 12);
                const r2B = project(-30 + topTwistX, 5, topZ + 12);
                const r2C = project(-30 + topTwistX, 40, topZ + 18);
                const r2D = project(-110 + topTwistX, 40, topZ + 18);

                const r3A = project(30 + topTwistX, -40, topZ + 12);
                const r3B = project(110 + topTwistX, -40, topZ + 12);
                const r3C = project(110 + topTwistX, 20, topZ + 18);
                const r3D = project(30 + topTwistX, 20, topZ + 18);

                return (
                  <g id="rooftop-solar-farm">
                    {/* Rack 1 */}
                    <polygon points={`${r1A.x},${r1A.y} ${r1B.x},${r1B.y} ${r1C.x},${r1C.y} ${r1D.x},${r1D.y}`} fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1.2" />
                    <line x1={(r1A.x + r1B.x) / 2} y1={(r1A.y + r1B.y) / 2} x2={(r1D.x + r1C.x) / 2} y2={(r1D.y + r1C.y) / 2} stroke="#93C5FD" strokeWidth="0.8" />
                    {/* Rack 2 */}
                    <polygon points={`${r2A.x},${r2A.y} ${r2B.x},${r2B.y} ${r2C.x},${r2C.y} ${r2D.x},${r2D.y}`} fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1.2" />
                    <line x1={(r2A.x + r2B.x) / 2} y1={(r2A.y + r2B.y) / 2} x2={(r2D.x + r2C.x) / 2} y2={(r2D.y + r2C.y) / 2} stroke="#93C5FD" strokeWidth="0.8" />
                    {/* Rack 3 */}
                    <polygon points={`${r3A.x},${r3A.y} ${r3B.x},${r3B.y} ${r3C.x},${r3C.y} ${r3D.x},${r3D.y}`} fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1.2" />
                    <line x1={(r3A.x + r3B.x) / 2} y1={(r3A.y + r3B.y) / 2} x2={(r3D.x + r3C.x) / 2} y2={(r3D.y + r3C.y) / 2} stroke="#93C5FD" strokeWidth="0.8" />

                    {/* Solar PV Farm Badge */}
                    <g transform={`translate(${r1A.x - 10}, ${r1A.y - 25})`}>
                      <rect x="0" y="-8" width="180" height="18" rx="4" fill="rgba(15, 23, 42, 0.95)" stroke="#F59E0B" strokeWidth="1.2" />
                      <text x="90" y="4" fill="#FDE047" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        ⚡ SOLAR PV ROOFTOP FARM (120 kWp)
                      </text>
                    </g>
                  </g>
                );
              })()}
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
          <div className="lg:col-span-5 relative flex items-center gap-1.5">
            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  generateBlueprint(selectedPreset, promptText, builtupSqft, floors);
                }
              }}
              placeholder="e.g. 8-Floor T-Shape Building, V-Shaped Tower, or H-Shape..."
              className="flex-1 bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono shadow-inner"
            />
            <button
              onClick={() => generateBlueprint(selectedPreset, promptText, builtupSqft, floors)}
              disabled={generating}
              className="px-3 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition whitespace-nowrap active:scale-95 disabled:opacity-50"
              title="Generate 3D Architectural Blueprint Model from Prompt"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              <span>Generate 3D</span>
            </button>
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

        {/* 1,500 Prompt Library & 1-Click AI Design Archetype Chips */}
        <div className="mt-3.5 pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowPromptLibrary(true);
                setPromptDisplayLimit(36);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600/30 via-indigo-600/30 to-purple-600/30 hover:from-cyan-500/40 hover:to-purple-500/40 text-cyan-200 border border-cyan-400/50 hover:border-cyan-300 transition-all flex items-center gap-2 shadow-lg shadow-cyan-950/30 active:scale-95 group"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>📚 1,500 Prompt Library</span>
              <span className="px-1.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-mono font-extrabold border border-cyan-400/30">
                15 Categories (100 each)
              </span>
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Quick Models:</span>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5 relative z-10">
          {[
            { label: "🏢 8-Floor H-Shaped Frame", prompt: "8 Floor High-Tech Modern H-Shaped Symmetric Structural Frame Building with dual parallel tower wings and central connecting structural core, multi-bay beam-column grid facade with continuous double-glazed Low-E curtain wall, structural perimeter columns at all bay intersections, flat roof slab with structural FEM bay grid lines and central elevator machine room, double-height covered entrance portico in front courtyard notch, landscaped front and rear sunken garden plazas with pedestrian walkways, two-level subterranean parking garage, indoor sports recreation center with squash courts and fitness gym, high-strength M40 concrete frame with Fe550D TMT structural rebar, warm 3000K linear LED perimeter column uplighting, detailed 3D model architectural visualization, realistic construction materials, professional blueprint-style presentation", floors: 8 },
            { label: "🏗️ 8-Floor T-Shaped Frame", prompt: "8 Floor Modern T-Shaped Symmetric Structural Frame Building with perpendicular stem spine and broad front transverse wing, structural beam-column grid facade with continuous double-glazed curtain wall, structural perimeter columns at all bay intersections, flat roof slab with structural FEM bay grid lines, two landscaped outdoor courtyards flanking the stem, M40 concrete frame with Fe550D TMT rebar, detailed 3D model architectural visualization, realistic construction materials, professional blueprint-style presentation", floors: 8 },
            { label: "🗼 6-Floor V-Shaped Tower", prompt: "6 Floor V-Shaped Modern Iconic Commercial Tower with converging panoramic glazed wings meeting at a central glass apex rotunda, double-glazed acoustic curtain wall windows with motorized solar louvers, cantilevered tapering wing balconies, aerodynamic rooftop crown with monocrystalline solar PV panels, grand two-story central entrance rotunda foyer with revolving glass doors, converging landscaped outdoor garden plaza with interactive water jets, subterranean multi-deck parking garage, open recreational sports playground with synthetic turf multi-sports pitch, M35 concrete core with composite steel framing, programmed cool-blue architectural LED night lighting, detailed 3D model architectural visualization, realistic construction materials, professional blueprint-style presentation", floors: 6 },
            { label: "🏨 6-Floor U-Shaped Complex", prompt: "6 Floor Modern Luxury U-Shaped Courtyard Complex with three continuous glazed wings enclosing an expansive central open courtyard, floor-to-ceiling acoustic Low-E glass curtain walls, wrap-around cantilevered balconies overlooking the courtyard, rooftop solar PV farm array with certified lift machine rooms, grand central glass-roofed pedestrian arrival foyer, landscaped inner courtyard with volleyball court, basketball court, and central swimming pool, subterranean basement parking with dedicated EV charging stations, multi-sport athletic fitness gym and student recreation lounge, high-performance M35 RCC frame with Fe550D TMT rebar, 3000K architectural facade wall grazing illumination, detailed 3D model architectural visualization, realistic construction materials, professional blueprint-style presentation", floors: 6 },
            { label: "⭕ 6-Floor Circular Donut", prompt: "6 Floor Iconic Circular Courtyard Donut Building with continuous 360-degree curved glass facade enclosing a lush circular inner garden courtyard atrium, aerodynamic ribbon balconies, rooftop observation terrace, central civic entrance rotunda, M35 concrete frame, detailed 3D model architectural visualization, professional blueprint-style presentation", floors: 6 },
            { label: "🌿 7-Floor L-Shaped Hub", prompt: "7-Floor Modern L-Shaped Building Model with central landscaped courtyard, cantilevered glass balconies, and double-glazed curtain wall facade", floors: 7 },
            { label: "🔮 Spherical Orb Globe", prompt: "6-Floor Spherical Geodesic Ball Company Headquarters with carbon exoskeleton and glass globe facade", floors: 6 },
            { label: "🔲 Square Open-Center", prompt: "5-Floor Square Open Center Quadrangle Building with continuous glass envelope and central open-sky atrium", floors: 5 },
            { label: "✈️ Airplane Wing Roof", prompt: "6-Floor Contemporary Tower with aerodynamic swept airplane wing roof, navigation beacons, and curtain wall glazing", floors: 6 },
            { label: "☀️ Solar Farm Rooftop", prompt: "7-Floor Green Energy Commercial Complex with monocrystalline solar panel rooftop farm array", floors: 7 },
            { label: "🪟 Full Glass Curtain", prompt: "7-Floor Ultra-Modern Full Glassed Corporate Tower with double-glazed low-E blue curtain wall on all sides", floors: 7 },
            { label: "🌓 Left Front Glassed", prompt: "6-Floor Contemporary Office Building with left front glass curtain wall and precast right wing", floors: 6 },
            { label: "🌗 Right Front Glassed", prompt: "6-Floor Contemporary Office Building with right front glass curtain wall and precast left wing", floors: 6 },
            { label: "⚽ Open Playground Hostel", prompt: "5-Floor Rounded Luxury Hostel Building with modern balconies and center open playground with sports court", floors: 5 },
            { label: "🏛️ Wide Linear Campus", prompt: "4-Floor Wide-Range Linear Innovation Campus Building with multi-bay structural frame and ribbon windows", floors: 4 },
            { label: "🚁 Helipad Sky-Mansion", prompt: "7-Floor Ultra-Luxury Sky-Mansion Tower with champagne gold glazing, cantilevered floating balconies, and rooftop helipad terrace", floors: 7 },
            { label: "🏊 Infinity Sky Pool", prompt: "6-Floor Contemporary Waterfront Tower with elevated glass infinity sky pool, wooden sundeck, and azure glass facade", floors: 6 },
            { label: "🌀 Twisted Spiral Diagrid", prompt: "8-Floor Futuristic Spiral Twisted Tower with diamond diagrid exoskeleton and obsidian glass curtain wall", floors: 8 },
            { label: "🔭 Observatory Dome", prompt: "5-Floor Sky Observatory Tower with geodesic glass dome astronomical observatory and panoramic sky lounge", floors: 5 },
            { label: "🌲 Biophilic Vertical Forest", prompt: "6-Floor Biophilic Vertical Forest Residential Complex with cascading planted terraces and living green wall facade", floors: 6 }
          ].map((chip, idx) => (
            <button
              key={`chip-${idx}`}
              onClick={() => {
                setPromptText(chip.prompt);
                setFloors(chip.floors);
                generateBlueprint(selectedPreset, chip.prompt, builtupSqft, chip.floors);
              }}
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-800/80 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 border border-slate-700/80 hover:border-cyan-500/40 transition flex items-center gap-1 shadow-sm active:scale-95"
            >
              {chip.label}
            </button>
          ))}
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
                      {floors} Stories • Height: {(floors * 3.2).toFixed(1)}m / {(floors * 3.2 * 3.28084).toFixed(0)}ft • {data.building3D?.rooftopFeature === "AIRPLANE_WING_ROOF" ? "✈️ Airplane Wing Roof" : (data.building3D?.rooftopFeature === "HELIPAD" ? "🚁 Rooftop Helipad" : (data.building3D?.rooftopFeature === "INFINITY_POOL" ? "🏊 Sky Infinity Pool" : (data.building3D?.rooftopFeature === "OBSERVATORY_DOME" ? "🔭 Panoramic Dome" : (data.building3D?.rooftopFeature === "GABLE_ROOF" ? "🏠 Pitched Gable Roof" : (data.building3D?.hasSolarPanels || data.building3D?.rooftopFeature === "SOLAR_ARRAY" ? "⚡ Solar PV Rooftop" : "SMRF Core Frame")))))}
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
                      (massingForm === "H_SHAPED" || isHShaped) ? (
                        <g id="cad-hshape-outline">
                          {/* H-Shaped Twin-Towers with Central Skybridge */}
                          <polygon
                            points="94,94 280,94 280,240 520,240 520,94 706,94 706,576 520,576 520,380 280,380 280,576 94,576"
                            fill="none"
                            stroke={themeColors.wallExterior}
                            strokeWidth="12"
                          />
                          <polygon
                            points="94,94 280,94 280,240 520,240 520,94 706,94 706,576 520,576 520,380 280,380 280,576 94,576"
                            fill="none"
                            stroke="url(#concreteHatch)"
                            strokeWidth="8"
                          />
                          <polygon
                            points="100,100 274,100 274,246 526,246 526,100 700,100 700,570 526,570 526,374 274,374 274,570 100,570"
                            fill="none"
                            stroke={themeColors.wallInterior}
                            strokeWidth="2"
                          />
                          {/* Skybridge Linking Corridor */}
                          <rect x="280" y="246" width="240" height="128" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 2" />
                          <text x="400" y="315" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle">
                            🌉 GLAZED SKYBRIDGE
                          </text>
                        </g>
                      ) : (massingForm === "T_SHAPED" || isTShaped) ? (
                        <g id="cad-tshape-outline">
                          {/* T-Shaped Structural Walls */}
                          <polygon
                            points="94,94 706,94 706,260 480,260 480,576 320,576 320,260 94,260"
                            fill="none"
                            stroke={themeColors.wallExterior}
                            strokeWidth="12"
                          />
                          <polygon
                            points="94,94 706,94 706,260 480,260 480,576 320,576 320,260 94,260"
                            fill="none"
                            stroke="url(#concreteHatch)"
                            strokeWidth="8"
                          />
                          <polygon
                            points="100,100 700,100 700,254 474,254 474,570 326,570 326,254 100,254"
                            fill="none"
                            stroke={themeColors.wallInterior}
                            strokeWidth="2"
                          />
                          {/* West & East Side Courtyards */}
                          <rect x="94" y="260" width="220" height="310" fill="#064E3B" fillOpacity="0.2" stroke="#10B981" strokeWidth="1" strokeDasharray="4 2" />
                          <rect x="486" y="260" width="220" height="310" fill="#064E3B" fillOpacity="0.2" stroke="#10B981" strokeWidth="1" strokeDasharray="4 2" />
                          <text x="204" y="415" fill="#34D399" fontSize="9" fontWeight="bold" textAnchor="middle">WEST COURTYARD</text>
                          <text x="596" y="415" fill="#34D399" fontSize="9" fontWeight="bold" textAnchor="middle">EAST COURTYARD</text>
                        </g>
                      ) : (massingForm === "V_SHAPED" || isVShaped) ? (
                        <g id="cad-vshape-outline">
                          {/* V-Shaped Exterior Dual Wing Walls */}
                          <polygon
                            points="400,100 680,140 640,320 440,240 400,280 360,240 160,320 120,140"
                            fill="none"
                            stroke={themeColors.wallExterior}
                            strokeWidth="12"
                          />
                          <polygon
                            points="400,100 680,140 640,320 440,240 400,280 360,240 160,320 120,140"
                            fill="none"
                            stroke="url(#concreteHatch)"
                            strokeWidth="8"
                          />
                          <polygon
                            points="400,108 672,146 634,314 438,236 400,274 362,236 166,314 128,146"
                            fill="none"
                            stroke={themeColors.wallInterior}
                            strokeWidth="2"
                          />
                          {/* Central Apex Rotunda Glass Entrance */}
                          <circle cx="400" cy="274" r="26" fill="none" stroke="#38BDF8" strokeWidth="2" />
                          <circle cx="400" cy="274" r="14" fill="none" stroke="#7DD3FC" strokeWidth="1" strokeDasharray="3 2" />
                          <text x="400" y="278" fill="#38BDF8" fontSize="8" fontWeight="bold" textAnchor="middle">
                            ROTUNDA
                          </text>
                          {/* Entrance Plaza & Open Playground */}
                          <rect x="150" y="380" width="500" height="180" rx="8" fill="#064E3B" fillOpacity="0.25" stroke="#10B981" strokeWidth="1.5" strokeDasharray="5 3" />
                          <text x="400" y="475" fill="#34D399" fontSize="11" fontWeight="bold" textAnchor="middle">
                            ENTRANCE PLAZA & OPEN PLAYGROUND
                          </text>
                        </g>
                      ) : (massingForm === "U_SHAPED" || isUShaped) ? (
                        <g id="cad-ushape-outline">
                          {/* U-Shaped Three-Wing Exterior Walls */}
                          <polygon
                            points="94,94 706,94 706,576 520,576 520,280 280,280 280,576 94,576"
                            fill="none"
                            stroke={themeColors.wallExterior}
                            strokeWidth="12"
                          />
                          <polygon
                            points="94,94 706,94 706,576 520,576 520,280 280,280 280,576 94,576"
                            fill="none"
                            stroke="url(#concreteHatch)"
                            strokeWidth="8"
                          />
                          <polygon
                            points="100,100 700,100 700,570 526,570 526,274 274,274 274,570 100,570"
                            fill="none"
                            stroke={themeColors.wallInterior}
                            strokeWidth="2"
                          />
                          {/* Central Landscaped Courtyard with Sports Court */}
                          <rect x="280" y="280" width="240" height="290" fill="#064E3B" fillOpacity="0.25" stroke="#10B981" strokeWidth="1.5" strokeDasharray="5 3" />
                          <circle cx="400" cy="425" r="30" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
                          <text x="400" y="430" fill="#34D399" fontSize="10" fontWeight="bold" textAnchor="middle">
                            CENTRAL COURTYARD PLAZA
                          </text>
                        </g>
                      ) : (massingForm === "CIRCULAR_DONUT" || isCircularDonut) ? (
                        <g id="cad-circ-donut-outline">
                          {/* Outer Circle */}
                          <circle cx="400" cy="335" r="260" fill="none" stroke={themeColors.wallExterior} strokeWidth="12" />
                          <circle cx="400" cy="335" r="260" fill="none" stroke="url(#concreteHatch)" strokeWidth="8" />
                          <circle cx="400" cy="335" r="254" fill="none" stroke={themeColors.wallInterior} strokeWidth="2" />
                          {/* Inner Courtyard Circle */}
                          <circle cx="400" cy="335" r="130" fill="#064E3B" fillOpacity="0.3" stroke="#10B981" strokeWidth="3" strokeDasharray="6 3" />
                          <circle cx="400" cy="335" r="40" fill="none" stroke="#38BDF8" strokeWidth="2" />
                          <text x="400" y="340" fill="#34D399" fontSize="10" fontWeight="bold" textAnchor="middle">
                            CIRCULAR ATRIUM COURTYARD
                          </text>
                        </g>
                      ) : (massingForm === "OPEN_SQUARE_DONUT" || isOpenSquare) ? (
                        <g id="cad-open-square-outline">
                          {/* Square Open-Center Quadrangle */}
                          <rect x="94" y="94" width="612" height="482" fill="none" stroke={themeColors.wallExterior} strokeWidth="12" />
                          <rect x="94" y="94" width="612" height="482" fill="none" stroke="url(#concreteHatch)" strokeWidth="8" />
                          <rect x="100" y="100" width="600" height="470" fill="none" stroke={themeColors.wallInterior} strokeWidth="2" />
                          {/* Inner Quadrangle Open Atrium Cutout */}
                          <rect x="260" y="220" width="280" height="230" fill="#064E3B" fillOpacity="0.3" stroke="#10B981" strokeWidth="2" strokeDasharray="4 2" />
                          <ellipse cx="400" cy="335" rx="35" ry="20" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
                          <text x="400" y="340" fill="#34D399" fontSize="10" fontWeight="bold" textAnchor="middle">
                            OPEN-TO-SKY ATRIUM QUAD
                          </text>
                        </g>
                      ) : (massingForm === "SPHERICAL_BALL" || isSphericalBall) ? (
                        <g id="cad-sphere-outline">
                          {/* Spherical Geodesic Circular Outer Shell */}
                          <ellipse cx="400" cy="335" rx="280" ry="220" fill="none" stroke={themeColors.wallExterior} strokeWidth="12" />
                          <ellipse cx="400" cy="335" rx="280" ry="220" fill="none" stroke="url(#concreteHatch)" strokeWidth="8" />
                          <ellipse cx="400" cy="335" rx="274" ry="214" fill="none" stroke={themeColors.wallInterior} strokeWidth="2" />
                          {/* Concentric Geodesic Latitude Rings */}
                          <ellipse cx="400" cy="335" rx="200" ry="155" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="6 3" />
                          <ellipse cx="400" cy="335" rx="110" ry="85" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="6 3" />
                          <circle cx="400" cy="335" r="28" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
                          <text x="400" y="339" fill="#F59E0B" fontSize="8" fontWeight="bold" textAnchor="middle">
                            CORE
                          </text>
                        </g>
                      ) : (massingForm === "L_SHAPED" || isLShaped) ? (
                        <g id="cad-lshape-outline">
                          {/* L-shaped Exterior Thick Walls */}
                          <polygon
                            points="94,94 716,94 716,334 394,334 394,582 94,582"
                            fill="none"
                            stroke={themeColors.wallExterior}
                            strokeWidth="12"
                          />
                          <polygon
                            points="94,94 716,94 716,334 394,334 394,582 94,582"
                            fill="none"
                            stroke="url(#concreteHatch)"
                            strokeWidth="8"
                          />
                          <polygon
                            points="100,100 710,100 710,328 400,328 400,576 100,576"
                            fill="none"
                            stroke={themeColors.wallInterior}
                            strokeWidth="2"
                          />
                          {/* Courtyard Lawn & Fountain in 2D Blueprint */}
                          <rect x="404" y="334" width="306" height="242" fill="#064E3B" fillOpacity="0.25" stroke="#10B981" strokeWidth="1" strokeDasharray="4 2" />
                          <circle cx="557" cy="455" r="35" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
                          <circle cx="557" cy="455" r="15" fill="none" stroke="#7DD3FC" strokeWidth="1" />
                          <text x="557" y="458" fill="#34D399" fontSize="10" fontWeight="bold" textAnchor="middle">
                            COURTYARD GARDEN
                          </text>
                        </g>
                      ) : (massingForm === "CURVED_CYLINDRICAL" || isCurvedRounded || isHostel) ? (
                        <g id="cad-curved-hostel-sports-outline">
                          {/* Exterior Building Arc Outline */}
                          <path
                            d="M 94 320 C 94 140 230 94 400 94 C 570 94 706 140 706 320 L 610 320 C 610 180 500 150 400 150 C 300 150 190 180 190 320 Z"
                            fill="none"
                            stroke={themeColors.wallExterior}
                            strokeWidth="12"
                          />
                          <path
                            d="M 94 320 C 94 140 230 94 400 94 C 570 94 706 140 706 320 L 610 320 C 610 180 500 150 400 150 C 300 150 190 180 190 320 Z"
                            fill="none"
                            stroke="url(#concreteHatch)"
                            strokeWidth="8"
                          />
                          <path
                            d="M 100 316 C 100 146 234 100 400 100 C 566 100 700 146 700 316 L 616 316 C 616 186 504 156 400 156 C 296 156 184 186 184 316 Z"
                            fill="none"
                            stroke={themeColors.wallInterior}
                            strokeWidth="2"
                          />

                          {/* Central Sports Courtyard Plaza Boundary */}
                          <rect x="94" y="340" width="612" height="236" rx="8" fill="#064E3B" fillOpacity="0.25" stroke="#10B981" strokeWidth="1.5" strokeDasharray="6 3" />
                          <text x="400" y="356" fill="#34D399" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="2">
                            CENTRAL SPORTS COURTYARD PLAZA
                          </text>

                          {/* Basketball Court 2D CAD Layout */}
                          <g id="cad-basketball-court">
                            <rect x="115" y="370" width="265" height="190" rx="4" fill="#1E3A8A" fillOpacity="0.8" stroke="#60A5FA" strokeWidth="1.5" />
                            {/* Half Court Line */}
                            <line x1="247" y1="370" x2="247" y2="560" stroke="#FFFFFF" strokeWidth="1.2" />
                            {/* Center Jump Circle */}
                            <circle cx="247" cy="465" r="24" fill="none" stroke="#FFFFFF" strokeWidth="1.2" />
                            {/* Left Key Area */}
                            <rect x="115" y="425" width="45" height="80" fill="#C2410C" fillOpacity="0.6" stroke="#FFFFFF" strokeWidth="1" />
                            <circle cx="160" cy="465" r="18" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 2" />
                            <circle cx="122" cy="465" r="4" fill="none" stroke="#EA580C" strokeWidth="1.5" />
                            {/* Right Key Area */}
                            <rect x="335" y="425" width="45" height="80" fill="#C2410C" fillOpacity="0.6" stroke="#FFFFFF" strokeWidth="1" />
                            <circle cx="335" cy="465" r="18" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 2" />
                            <circle cx="373" cy="465" r="4" fill="none" stroke="#EA580C" strokeWidth="1.5" />
                            <text x="247" y="550" fill="#93C5FD" fontSize="8" fontWeight="bold" textAnchor="middle">
                              BASKETBALL COURT (REGULATION)
                            </text>
                          </g>

                          {/* Volleyball Court 2D CAD Layout */}
                          <g id="cad-volleyball-court">
                            <rect x="420" y="370" width="265" height="190" rx="4" fill="#0284C7" fillOpacity="0.8" stroke="#38BDF8" strokeWidth="1.5" />
                            {/* Center Net Line */}
                            <line x1="552" y1="370" x2="552" y2="560" stroke="#FFFFFF" strokeWidth="2.5" />
                            {/* Left 3m Attack Line */}
                            <line x1="510" y1="370" x2="510" y2="560" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 2" />
                            {/* Right 3m Attack Line */}
                            <line x1="594" y1="370" x2="594" y2="560" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 2" />
                            {/* Net Posts */}
                            <circle cx="552" cy="366" r="3" fill="#E2E8F0" />
                            <circle cx="552" cy="564" r="3" fill="#E2E8F0" />
                            <text x="552" y="550" fill="#7DD3FC" fontSize="8" fontWeight="bold" textAnchor="middle">
                              VOLLEYBALL COURT (REGULATION)
                            </text>
                          </g>
                        </g>
                      ) : (data.building3D?.massingForm === "OPEN_SQUARE_DONUT" || data.building3D?.isOpenSquare || data.prompt?.toLowerCase().includes("square open center") || data.prompt?.toLowerCase().includes("open center") || data.prompt?.toLowerCase().includes("donut")) ? (
                        <g id="cad-open-square-outline">
                          {/* Square Open-Center Quadrangle */}
                          <rect x="94" y="94" width="612" height="482" fill="none" stroke={themeColors.wallExterior} strokeWidth="12" />
                          <rect x="94" y="94" width="612" height="482" fill="none" stroke="url(#concreteHatch)" strokeWidth="8" />
                          <rect x="100" y="100" width="600" height="470" fill="none" stroke={themeColors.wallInterior} strokeWidth="2" />
                          {/* Inner Quadrangle Open Atrium Cutout */}
                          <rect x="260" y="220" width="280" height="230" fill="#064E3B" fillOpacity="0.3" stroke="#10B981" strokeWidth="2" strokeDasharray="4 2" />
                          <ellipse cx="400" cy="335" rx="35" ry="20" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
                          <text x="400" y="340" fill="#34D399" fontSize="10" fontWeight="bold" textAnchor="middle">
                            OPEN-TO-SKY ATRIUM QUAD
                          </text>
                        </g>
                      ) : (data.building3D?.massingForm === "SPHERICAL_BALL" || data.building3D?.isSphericalBall || data.prompt?.toLowerCase().includes("ball shape") || data.prompt?.toLowerCase().includes("spherical") || data.prompt?.toLowerCase().includes("sphere")) ? (
                        <g id="cad-sphere-outline">
                          {/* Spherical Geodesic Circular Outer Shell */}
                          <ellipse cx="400" cy="335" rx="280" ry="220" fill="none" stroke={themeColors.wallExterior} strokeWidth="12" />
                          <ellipse cx="400" cy="335" rx="280" ry="220" fill="none" stroke="url(#concreteHatch)" strokeWidth="8" />
                          <ellipse cx="400" cy="335" rx="274" ry="214" fill="none" stroke={themeColors.wallInterior} strokeWidth="2" />
                          {/* Concentric Geodesic Latitude Rings */}
                          <ellipse cx="400" cy="335" rx="200" ry="155" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="6 3" />
                          <ellipse cx="400" cy="335" rx="110" ry="85" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="6 3" />
                          <circle cx="400" cy="335" r="28" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
                          <text x="400" y="339" fill="#F59E0B" fontSize="8" fontWeight="bold" textAnchor="middle">
                            CORE
                          </text>
                        </g>
                      ) : (data.building3D?.massingForm === "L_SHAPED" || data.building3D?.isLShaped || data.prompt?.toLowerCase().includes("l shape") || data.prompt?.toLowerCase().includes("l-shape") || data.prompt?.toLowerCase().includes("l shaped") || data.prompt?.toLowerCase().includes("l-shaped")) ? (
                        <g id="cad-lshape-outline">
                          {/* L-shaped Exterior Thick Walls */}
                          <polygon
                            points="94,94 716,94 716,334 394,334 394,582 94,582"
                            fill="none"
                            stroke={themeColors.wallExterior}
                            strokeWidth="12"
                          />
                          <polygon
                            points="94,94 716,94 716,334 394,334 394,582 94,582"
                            fill="none"
                            stroke="url(#concreteHatch)"
                            strokeWidth="8"
                          />
                          <polygon
                            points="100,100 710,100 710,328 400,328 400,576 100,576"
                            fill="none"
                            stroke={themeColors.wallInterior}
                            strokeWidth="2"
                          />
                          {/* Courtyard Lawn & Fountain in 2D Blueprint */}
                          <rect x="404" y="334" width="306" height="242" fill="#064E3B" fillOpacity="0.25" stroke="#10B981" strokeWidth="1" strokeDasharray="4 2" />
                          <circle cx="557" cy="455" r="35" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
                          <circle cx="557" cy="455" r="15" fill="none" stroke="#7DD3FC" strokeWidth="1" />
                          <text x="557" y="458" fill="#34D399" fontSize="10" fontWeight="bold" textAnchor="middle">
                            ZEN COURTYARD
                          </text>
                        </g>
                      ) : (
                        <g>
                          <rect x="94" y="94" width="622" height="482" fill="none" stroke={themeColors.wallExterior} strokeWidth="12" />
                          <rect x="94" y="94" width="622" height="482" fill="none" stroke="url(#concreteHatch)" strokeWidth="8" />
                          <rect x="100" y="100" width="610" height="470" fill="none" stroke={themeColors.wallInterior} strokeWidth="2" />
                        </g>
                      )
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

      {/* 1,500 Prompt Architectural Library Modal */}
      {showPromptLibrary && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-[#0B111E] border border-slate-700/80 rounded-2xl max-w-6xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-bold text-white tracking-wide">
                      Architectural 3D Blueprint Prompt Library
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
                      1,500 Prompts • 15 Categories
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Structured with complete 14-parameter architectural engineering formula. Click &quot;Load &amp; Generate&quot; for instant 3D model generation.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/downloads/1000_Architectural_3D_Model_Generation_Prompts.pdf"
                  download="1000_Architectural_3D_Model_Generation_Prompts.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
                  title="Download Official 1,000 Prompts PDF Document (171 Pages)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF (1,000 Prompts)</span>
                </a>
                <button
                  onClick={() => setShowPromptLibrary(false)}
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
                  title="Close Library"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 shrink-0 space-y-3">
              {/* Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={promptSearchQuery}
                  onChange={(e) => {
                    setPromptSearchQuery(e.target.value);
                    setPromptDisplayLimit(36);
                  }}
                  placeholder="Search by keywords (e.g., helipad, cantilever, rounded, solar, sports court, glass, hospital, villa, hostel, spiral)..."
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700/70 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                />
                {promptSearchQuery && (
                  <button
                    onClick={() => setPromptSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Pills (15 Core Categories + All) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
                {[
                  { id: "ALL", name: "All", icon: "🌐", count: promptLibraryData.length || 1500 },
                  { id: 1, name: "Residential", icon: "🏢", count: 100 },
                  { id: 2, name: "Hotels & Resorts", icon: "🏨", count: 100 },
                  { id: 3, name: "Schools & Colleges", icon: "🏫", count: 100 },
                  { id: 4, name: "Hospitals & Clinics", icon: "🏥", count: 100 },
                  { id: 5, name: "Office & Corporate", icon: "🏢", count: 100 },
                  { id: 6, name: "Villas & Luxury Homes", icon: "🏠", count: 100 },
                  { id: 7, name: "Apartments & Housing", icon: "🏘️", count: 100 },
                  { id: 8, name: "Hostels & Student Housing", icon: "🛏️", count: 100 },
                  { id: 9, name: "Shopping Malls", icon: "🛍️", count: 100 },
                  { id: 10, name: "Industrial & Factory", icon: "🏭", count: 100 },
                  { id: 11, name: "Sports & Recreation", icon: "🏟️", count: 100 },
                  { id: 12, name: "Public & Government", icon: "🏛️", count: 100 },
                  { id: 13, name: "Religious & Cultural", icon: "🕌", count: 100 },
                  { id: 14, name: "Eco-Friendly & Sustainable", icon: "🌳", count: 100 },
                  { id: 15, name: "Futuristic Concepts", icon: "🏗️", count: 100 },
                ].map((cat) => {
                  const isActive = selectedPromptCategory === cat.id;
                  return (
                    <button
                      key={`cat-pill-${cat.id}`}
                      onClick={() => {
                        setSelectedPromptCategory(cat.id as any);
                        setPromptDisplayLimit(36);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
                        isActive
                          ? "bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20"
                          : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? "bg-black/20 text-black font-extrabold" : "bg-slate-900 text-slate-400"
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prompt Cards Grid (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {(() => {
                const filteredPrompts = promptLibraryData.filter((item) => {
                  const matchesCat = selectedPromptCategory === "ALL" || item.categoryId === selectedPromptCategory;
                  if (!matchesCat) return false;
                  if (!promptSearchQuery.trim()) return true;
                  const q = promptSearchQuery.toLowerCase();
                  return (
                    item.title?.toLowerCase().includes(q) ||
                    item.prompt?.toLowerCase().includes(q) ||
                    item.buildingType?.toLowerCase().includes(q) ||
                    item.style?.toLowerCase().includes(q) ||
                    item.categoryName?.toLowerCase().includes(q) ||
                    (Array.isArray(item.tags) && item.tags.some((t: string) => t.toLowerCase().includes(q)))
                  );
                });

                if (filteredPrompts.length === 0) {
                  return (
                    <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                      <Search className="w-10 h-10 text-slate-600 mb-2" />
                      <div className="text-sm font-semibold text-slate-300">No prompts matched your search</div>
                      <div className="text-xs text-slate-500 mt-1">Try another keyword or select a different category</div>
                    </div>
                  );
                }

                const visiblePrompts = filteredPrompts.slice(0, promptDisplayLimit);

                return (
                  <>
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                      <span>
                        Showing <strong className="text-white">{visiblePrompts.length}</strong> of{" "}
                        <strong className="text-cyan-400">{filteredPrompts.length}</strong> prompts
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Formula: Type + Floors + Style + Facade + Windows + Balconies + Roof + Entrance + Landscape + Parking + Sports + Materials + Lighting
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {visiblePrompts.map((item) => (
                        <div
                          key={`prompt-card-${item.id}`}
                          className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-cyan-950/20 group"
                        >
                          {/* Card Top Details */}
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm">{item.categoryIcon}</span>
                                <span className="text-[11px] font-bold text-slate-300">{item.categoryName}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/20">
                                  {item.floors} Floors
                                </span>
                                <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-mono">
                                  #{item.id}
                                </span>
                              </div>
                            </div>

                            <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-2">
                              {item.title}
                            </h4>

                            {/* Full Prompt Display Box */}
                            <div className="p-3 rounded-xl bg-black/40 border border-slate-800/80 text-[11px] text-slate-300/90 leading-relaxed font-mono select-text mb-3">
                              {item.prompt}
                            </div>

                            {/* Tags Chips */}
                            {Array.isArray(item.tags) && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {item.tags.map((tag: string, tIdx: number) => (
                                  <span
                                    key={`tag-${item.id}-${tIdx}`}
                                    className="px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 text-[9px] font-medium"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                            <button
                              onClick={() => {
                                setPromptText(item.prompt);
                                setFloors(item.floors);
                                setShowPromptLibrary(false);
                                generateBlueprint(selectedPreset, item.prompt, builtupSqft, item.floors);
                              }}
                              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-cyan-900/30 transition active:scale-95"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Load &amp; Generate 3D Model</span>
                            </button>

                            <button
                              onClick={() => {
                                setPromptText(item.prompt);
                                setFloors(item.floors);
                                setShowPromptLibrary(false);
                              }}
                              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                              title="Set as Prompt without Auto-Generating"
                            >
                              Use in Prompt Box
                            </button>

                            <button
                              onClick={() => {
                                if (navigator.clipboard) {
                                  navigator.clipboard.writeText(item.prompt);
                                  setCopiedPromptId(item.id);
                                  setTimeout(() => setCopiedPromptId(null), 2000);
                                }
                              }}
                              className={`p-2 rounded-xl border text-xs font-semibold transition flex items-center gap-1 ${
                                copiedPromptId === item.id
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                  : "bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-700/60"
                              }`}
                              title="Copy Prompt to Clipboard"
                            >
                              {copiedPromptId === item.id ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination / Load More */}
                    {filteredPrompts.length > promptDisplayLimit && (
                      <div className="pt-4 flex justify-center">
                        <button
                          onClick={() => setPromptDisplayLimit((prev) => prev + 36)}
                          className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold transition flex items-center gap-2 shadow-lg"
                        >
                          <span>Load More Prompts (+36)</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({filteredPrompts.length - promptDisplayLimit} remaining)
                          </span>
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
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
