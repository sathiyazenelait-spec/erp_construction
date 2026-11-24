import json
import os
import random

categories = [
    {"id": 1, "name": "Residential Buildings", "icon": "🏢", "types": [
        "Luxury Residential Tower", "Mid-Rise Family Residence", "Urban Living Complex", "Suburban Family Tower", 
        "High-Density Residential Block", "Sky-Mansion Penthouse Tower", "Duplex Garden Residence", "High-End Condominium Tower",
        "Executive High-Rise Living Block", "Boutique Residential Residence"
    ], "floors_range": (3, 24)},
    {"id": 2, "name": "Hotels & Resorts", "icon": "🏨", "types": [
        "Luxury Beachfront Resort", "Urban 5-Star Boutique Hotel", "Mountain Eco-Resort", "Business Convention Hotel",
        "Floating Lagoon Luxury Resort", "Palace Heritage Grand Hotel", "Hillside Wellness Spa Resort", "Airport Transit Business Hotel",
        "Waterfront Marina Hotel", "Safari Eco-Lodge & Glamping Resort"
    ], "floors_range": (2, 18)},
    {"id": 3, "name": "Schools & Colleges", "icon": "🏫", "types": [
        "International K-12 Academy", "Engineering & Technology College", "Modern University Faculty Building", "Primary & Elementary School Campus",
        "Medical University Academic Block", "Arts & Architecture Design School", "Polytechnic Technical Institute", "Smart Digital Learning Campus",
        "Science & Research High School", "Collegiate Prep Boarding School"
    ], "floors_range": (2, 6)},
    {"id": 4, "name": "Hospitals & Clinics", "icon": "🏥", "types": [
        "Multi-Specialty Super Hospital", "Trauma & Critical Emergency Center", "Cardiovascular & Oncology Care Center", "Pediatric & Children's Medical Hospital",
        "Modern Outpatient Diagnostic Clinic", "Orthopedic & Rehabilitation Center", "Women's Health & Maternity Hospital", "Advanced Neurosurgery Research Hospital",
        "Daycare Surgical Specialist Clinic", "Metropolitan Health Sciences Medical Center"
    ], "floors_range": (3, 14)},
    {"id": 5, "name": "Office & Corporate Buildings", "icon": "🏢", "types": [
        "Futuristic Corporate HQ Tower", "Tech Innovation Software Campus", "Financial District Banking Skyscraper", "Creative Agency Co-Working Hub",
        "Multinational Enterprise Headquarters", "Biotech Research & Corporate Office", "Legal & Consulting Professional Chambers", "BPO & IT Executive Hub",
        "Green Certified Commercial Office", "Executive Diplomatic Trade Tower"
    ], "floors_range": (4, 30)},
    {"id": 6, "name": "Villas & Luxury Homes", "icon": "🏠", "types": [
        "Contemporary Minimalist Luxury Villa", "Tropical Balinese Modern Villa", "Mediterranean Courtyard Villa", "Hillside Cantilevered Glass Villa",
        "Ultra-Modern Waterfront Mansion", "Nordic Timber & Stone Eco-Villa", "Palatial Tuscan Style Estate", "Cyber-Luxury Smart Glass Villa",
        "Desert Oasis Modern Villa", "Japanese Zen Garden Residence"
    ], "floors_range": (1, 4)},
    {"id": 7, "name": "Apartments & Housing Complexes", "icon": "🏘️", "types": [
        "Affordable Community Housing Block", "Modern Studio Apartment Complex", "Gated Township Apartment Tower", "Transit-Oriented Development Apartments",
        "Senior Living Retirement Community", "Loft Style Industrial Apartments", "Micro-Unit Co-Living Apartment Complex", "Modular Prefab Urban Apartments",
        "Eco-Pod Housing Community", "Terraced Hillside Apartments"
    ], "floors_range": (3, 16)},
    {"id": 8, "name": "Hostels & Student Housing", "icon": "🛏️", "types": [
        "Modern Rounded Student Hostel", "University Scholars Dormitory Residence", "Co-Living International Student Hub", "Campus Athletes Accommodation Block",
        "Budget Travelers Lifestyle Hostel", "Postgraduate Research Fellows Residence", "Modular Pod Student Dormitory", "Eco-Campus Green Hostel",
        "Women's University Residence Hall", "High-Tech Student Living Village"
    ], "floors_range": (3, 10)},
    {"id": 9, "name": "Shopping Malls & Commercial Buildings", "icon": "🛍️", "types": [
        "Premium Destination Shopping Mall", "Open-Air Lifestyle Retail Promenade", "Multi-Level Downtown Shopping Galleria", "Hypermarket & Entertainment Complex",
        "Luxury Brand Flagship Retail Hub", "Regional Outlet Village Mall", "Underground Metro Retail Arcade", "Electronics & Tech Commercial Plaza",
        "Automobile Experience Retail Center", "Fashion & Jewelry Commercial Mall"
    ], "floors_range": (2, 8)},
    {"id": 10, "name": "Industrial & Factory Buildings", "icon": "🏭", "types": [
        "High-Bay PEB Logistics Warehouse", "Advanced Robotic Manufacturing Plant", "Automated E-Commerce Fulfillment Hub", "Pharmaceutical Formulation Cleanroom Plant",
        "Aircraft Maintenance Hangar Facility", "Food Processing & Cold Chain Facility", "Semiconductor Microchip Fabrication Facility", "Heavy Engineering Assembly Factory",
        "Renewable Battery Gigafactory", "Textile & Garment Eco-Factory"
    ], "floors_range": (1, 4)},
    {"id": 11, "name": "Sports & Recreation Buildings", "icon": "🏟️", "types": [
        "Olympic Indoor Aquatics Center", "Multi-Sport Arena & Gymnasium", "Professional Football Stadium Pavilion", "Tennis & Racquet Sports Club",
        "Community Youth Recreation Center", "Velodrome & Cycling Indoor Arena", "Extreme Sports & Skatepark Complex", "Golf Country Club & Wellness Pavilion",
        "Martial Arts & Combat Sports Academy", "Ice Hockey & Figure Skating Rink"
    ], "floors_range": (2, 6)},
    {"id": 12, "name": "Public & Government Buildings", "icon": "🏛️", "types": [
        "Civic City Hall & Municipal Chambers", "Supreme High Court of Justice", "National Central Public Library", "Metropolitan Railway Transit Terminal",
        "Embassies & Diplomatic Mission Complex", "State Legislative Assembly Hall", "Civil Aviation Airport Passenger Terminal", "Post Office & Public Services Hub",
        "Central Police & Fire Emergency Command", "Convention & Public Expo Center"
    ], "floors_range": (2, 10)},
    {"id": 13, "name": "Religious & Cultural Buildings", "icon": "🕌", "types": [
        "Contemporary Architectural Grand Mosque", "Modern Community Cathedral Church", "Vedic Temple & Cultural Heritage Center", "Buddhist Meditation Pavilion & Pagoda",
        "Contemporary Art & History Museum", "Performing Arts Concert Hall & Opera", "Universal Spiritual Meditation Center", "Heritage Cultural Archives & Memorial",
        "Sikh Gurdwara & Community Langar Hall", "Indigenous Arts & Amphitheater Complex"
    ], "floors_range": (1, 6)},
    {"id": 14, "name": "Eco-Friendly & Sustainable Buildings", "icon": "🌳", "types": [
        "Net-Zero Energy Vertical Forest Tower", "Biophilic Carbon-Neutral Office Campus", "Passive House Certified Solar Residence", "Circular Economy Recycled Timber Pavilion",
        "Earth-Sheltered Biome Eco-Structure", "Algae Bioreactor Kinetic Facade Building", "Rammed Earth & Bamboo Community Hub", "Permaculture Eco-Living Research Station",
        "Zero-Waste Green Urban Commons", "Water-Positive Floating Ecological Hub"
    ], "floors_range": (2, 12)},
    {"id": 15, "name": "Special / Futuristic Architectural Concepts", "icon": "🏗️", "types": [
        "Twisted Aerodynamic Kinetic Sky-Tower", "Floating Arcology Biomorphic City Unit", "Subterranean Inverted Earth-Scraper", "Geodesic Biosphere Dome Habitat",
        "Parametric Exoskeleton Metamorphic Complex", "V-Shaped Supersonic Wing Aerospace Hub", "H-Shaped Twin-Bridge Gravitational Tower", "Cantilevered Floating Sky-Ring Megastructure",
        "Cyber-Obsidian Hyperloop Transit Spire", "AI Autonomous Algorithmic Polyhedron"
    ], "floors_range": (4, 45)}
]

styles = [
    "Modern Contemporary", "Futuristic Parametric", "Minimalist Bauhaus", "Biophilic Eco-Organic", "Post-Modern Neo-Classical",
    "High-Tech Structural Expressionism", "Brutalist Geometric", "Aerodynamic Streamline", "Nordic Scandinavian", "Deconstructivist Sculptural"
]

facades = [
    "curved low-E double curtain-wall glazing", "perforated kinetic bronze sunscreen louvers", "ultra-clear acoustic structural silicone glass",
    "living vertical bio-moss walls", "aerodynamic fluted terracotta rain-screen panels", "white statuario architectural marble cladding",
    "carbon-fiber composite diagrid panels", "faceted diamond-cut photovoltaic glass envelopes", "champagne gold anodized aluminum fins",
    "exposed fair-faced architectural concrete walls"
]

windows = [
    "floor-to-ceiling panoramic glass windows with acoustic seals", "double-glazed low-emissivity smart tint windows", "frameless laminated acoustic glazing",
    "mechanized solar tracking operable window vents", "continuous ribbon strip vision windows", "triple-glazed argon-filled insulated acoustic panes",
    "recessed deeply shaded shadow-box windows", "high-performance solar control blue glazing", "clerestory daylighting transom windows",
    "structural glass corner-mullion panoramic windows"
]

balconies = [
    "cantilevered floating balconies with frameless laminated glass balustrades", "continuous 360-degree wrap-around panoramic ribbon balconies",
    "sinusoidal curved organic wave balconies with stainless steel railings", "cascading planted vertical garden terraces with automated misting",
    "alternating double-height sky-terrace balconies with timber decking", "minimalist recessed flush balcony loggias",
    "projecting glass-bottom observation deck balconies", "stepped ziggurat landscaped balconies with perimeter planters",
    "deeply recessed wind-shielded private balconies", "aerodynamic cantilevered aerodynamic wing balconies"
]

roofs = [
    "rooftop helipad with perimeter flight safety beacons & sky terrace", "elevated glass infinity sky pool with wooden sundeck",
    "landscaped penthouse botanical garden with walking track", "monocrystalline solar panel array with pressurized lift machine room",
    "geodesic glass dome astronomical observatory and panoramic lounge", "aerodynamic swept airplane wing roof with aviation beacons",
    "architectural standing-seam zinc gable roof with skylights", "extensive green roof with automated rainwater detention ponds",
    "rooftop outdoor sky-amphitheater and observation lounge", "sculptural butterfly roof with integrated rainwater harvesting scuppers"
]

entrances = [
    "grand double-height glass revolving lobby entrance with water curtain", "floating aerodynamic glass canopy porte-cochere",
    "monumental stone portico with twin illuminated reflection ponds", "seamless biometric access turnstile security portal foyer",
    "cantilevered steel-and-glass entrance awning with ambient LED uplighting", "landscaped ramped pedestrian piazza with sunken courtyard steps",
    "recessed atrium foyer with four-story indoor living green wall", "sculptural timber-clad archway with illuminated company crest",
    "weather-sealed automated sliding glass airlock vestibule", "terrace stepped entrance podium with dancing water jets"
]

landscapings = [
    "landscaped tropical botanical gardens with pedestrian stone pathways", "geometric zen courtyard plaza with specimen bonsai trees and granite pavers",
    "perimeter manicured evergreen bioswales and drought-tolerant turf", "reflective water pools with floating stepping stones and perimeter seating",
    "lush native woodland reforestation belt with butterfly meadows", "terraced stepped flower lawns with integrated stone amphitheater seating",
    "waterfront boardwalk promenade with shaded bamboo pergolas", "permaculture edible herb sensory garden and meditation lawns",
    "subtropical rain garden with porous gravel swales and accent palms", "sculptural rock garden with illuminated water cascades"
]

parkings = [
    "multi-level automated robotic stack parking with EV fast-chargers", "dedicated underground double-basement parking with smart bay sensors",
    "podium structured parking with living green acoustic screening walls", "surface permeable grass-paver parking with solar PV canopy shade",
    "private enclosed dual-car executive garages with automated roll-up shutters", "valet drop-off circle with subterranean parking ramp access",
    "multi-tier parking structure with separate emergency lane clearance", "covered bicycle storage pods and electric scooter charging stations",
    "heavy vehicle logistics loading dock bays with hydraulic levelers", "reserved perimeter visitor parking with permeable asphalt and tree wells"
]

sports_recreations = [
    "central open playground with double A-frame swing sets and slides", "regulation basketball court and synthetic turf volleyball court",
    "25-meter heated indoor swimming pool and hydrotherapy spa", "rooftop padel tennis courts and outdoor calisthenics gym",
    "synthetic turf mini football pitch and athletic running track", "indoor fitness center with squash court and yoga studio",
    "children's soft-play adventure park with rubberized safety flooring", "central zen recreation plaza with open-air amphitheater",
    "bowling alley, billiards lounge, and multi-purpose recreational hall", "climbing bouldering wall and multi-sport polyurethane arena"
]

materials = [
    "high-performance M35 reinforced concrete, Fe550D TMT steel, and imported Italian travertine",
    "sustainable laminated mass timber, recycled structural steel, and low-carbon geopolymer concrete",
    "high-performance acoustic low-E glass, titanium zinc standing seams, and basalt stone masonry",
    "ultra-high performance fiber-reinforced concrete (UHPC), carbon fiber composites, and ceramic fritted glass",
    "flamed granite pavers, aerospace-grade aluminum honeycomb panels, and marine-grade stainless steel",
    "autoclaved aerated concrete (AAC) blocks, structural silicone sealant, and thermal-break aluminum extrusions",
    "terracotta extruded baguette louvers, insulated mineral wool cores, and composite timber decking",
    "weathering corten steel accents, polished statuario marble, and monolithic micro-cement screeds",
    "recycled glass pozzolan concrete, bio-composite resins, and copper-nickel architectural flashing",
    "precast insulated sandwich panels, post-tensioned RCC floor slabs, and fluoropolymer coated metal"
]

lightings = [
    "warm 3000K architectural facade graze lighting and discrete linear LED step lights",
    "programmable dynamic RGBW digital facade pixel illumination and pathway bollards",
    "high-CRI concealed indirect ceiling cove lighting and focused tree uplighters",
    "cyberpunk cyan and amber neon accent glow strips with perimeter edge-lit glazing",
    "subtle moonlight-simulation tree canopy downlighting and underwater pool illumination",
    "anti-glare dark-sky compliant recessed exterior downlights with motion automation",
    "dramatic vertical wall-washing LED fixtures and glowing crystal finial beacon",
    "recessed linear ground-inground uplighting highlighting column structural rhythm",
    "warm diffused brass sconce exterior luminaires and solar-powered garden trail markers",
    "zen ambient perimeter perimeter perimeter fiber-optic starry night terrace illumination"
]

dataset = []
global_id = 1

for cat in categories:
    cat_id = cat["id"]
    cat_name = cat["name"]
    cat_icon = cat["icon"]
    floors_min, floors_max = cat["floors_range"]
    
    for i in range(1, 101):
        btype = cat["types"][(i - 1) % len(cat["types"])]
        floors = floors_min + (i * 7) % (floors_max - floors_min + 1)
        if floors < 1: floors = 1
        
        style = styles[(i + cat_id * 3) % len(styles)]
        facade = facades[(i + cat_id) % len(facades)]
        window = windows[(i * 2 + cat_id) % len(windows)]
        balcony = balconies[(i * 3 + cat_id) % len(balconies)]
        roof = roofs[(i + cat_id * 2) % len(roofs)]
        entrance = entrances[(i * 4 + cat_id) % len(entrances)]
        landscaping = landscapings[(i + cat_id * 5) % len(landscapings)]
        parking = parkings[(i * 3 + cat_id * 2) % len(parkings)]
        sports = sports_recreations[(i + cat_id * 4) % len(sports_recreations)]
        mat = materials[(i * 2 + cat_id * 3) % len(materials)]
        lighting = lightings[(i + cat_id * 6) % len(lightings)]
        
        # Rigorous prompt formula requested:
        # Building type + floors + architectural style + façade + windows + balconies + roof + entrance + landscaping + parking + sports/recreation + materials + lighting + 3D render + blueprint details
        prompt = (
            f"{floors} Floor {style} {btype} with {facade}, {window}, {balcony}, {roof}, "
            f"{entrance}, {landscaping}, {parking}, {sports}, {mat}, {lighting}, "
            f"detailed 3D model architectural visualization, realistic construction materials, professional blueprint-style presentation"
        )
        
        title = f"{floors}-Floor {style} {btype}"
        
        # Tags for quick UI filtering
        tags = [cat_name, f"{floors} Floors", style.split()[0], btype.split()[-1]]
        if "helipad" in roof: tags.append("Helipad")
        if "pool" in roof or "pool" in sports: tags.append("Pool")
        if "playground" in sports: tags.append("Playground")
        if "solar" in roof: tags.append("Solar")
        if "balconies" in balcony: tags.append("Balconies")
        
        dataset.append({
            "id": global_id,
            "categoryId": cat_id,
            "categoryName": cat_name,
            "categoryIcon": cat_icon,
            "title": title,
            "floors": floors,
            "buildingType": btype,
            "style": style,
            "prompt": prompt,
            "tags": tags[:5]
        })
        global_id += 1

out_dir = r"c:\Users\DELL\Documents\erp_construction_project\erp_construction_project\buildcon-erp\public\data"
os.makedirs(out_dir, exist_ok=True)
out_file = os.path.join(out_dir, "prompt_library_1500.json")

with open(out_file, "w", encoding="utf-8") as f:
    json.dump(dataset, f, indent=2, ensure_ascii=False)

print(f"Generated {len(dataset)} prompts across {len(categories)} categories to {out_file}")
