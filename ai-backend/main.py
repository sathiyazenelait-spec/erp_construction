from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Optional
import urllib.request
import json
import base64
import os
from datetime import datetime, timedelta

app = FastAPI(title="BuildCon ERP AI Services")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Vector DB: Mock historical construction projects
HISTORICAL_PROJECTS = [
    {
        "id": 1,
        "name": "Commercial Complex Tower",
        "description": "High-rise office building with RCC frame, steel core, double glazed facade, HVAC, fire systems, escalators, and basement parking.",
        "base_budget": 50000000.0,
        "base_hours": 3200,
        "hazards": "High-elevation scaffolding, heavy crane operations, electrical high-tension wiring, excavation collapse risk.",
        "suggestions": [
            "Use grade FE500 steel for columns to optimize framing cost by 3.5%.",
            "Double-glazed facade panels can be pre-fabricated off-site to reduce installation hours by 12%.",
            "Maintain concrete curing time of 14 days strictly due to high load-bearing constraints."
        ]
    },
    {
        "id": 2,
        "name": "Residential Apartment Blocks",
        "description": "Multi-family residential apartments, load bearing masonry, modular kitchens, tiles, plumbing, landscaping, community center, solar roof.",
        "base_budget": 25000000.0,
        "base_hours": 1800,
        "hazards": "Excavation hazards, toxic paint fumes, falls from height, concrete splash eye hazards.",
        "suggestions": [
            "Modular bathroom units can save 18 days of plumbing and waterproofing installation.",
            "Utilize fly-ash bricks instead of red clay bricks to reduce material costs by 4%.",
            "Install solar panel scaffolding simultaneously with roofing to save labor overlaps."
        ]
    },
    {
        "id": 3,
        "name": "Infrastructure Highway Extension",
        "description": "Four-lane concrete expressway, asphalt paving, road signs, bridges, drainage channels, soil stabilization, safety barriers.",
        "base_budget": 80000000.0,
        "base_hours": 5500,
        "hazards": "Heavy highway vehicle traffic, hot asphalt burns, dust inhalation, deep trench excavation cave-in.",
        "suggestions": [
            "Soil stabilization via lime treatment reduces subgrade requirements by 5%.",
            "Pre-cast concrete girders for bridge spans will save 25 days of on-site shuttering.",
            "Use solar-powered warning barriers for enhanced traffic control safety."
        ]
    },
    {
        "id": 4,
        "name": "Industrial Warehouse Shed",
        "description": "Prefabricated steel warehouse, PEB structure, metal sheet roofing, concrete flooring, loading docks, fire sprinklers.",
        "base_budget": 12000000.0,
        "base_hours": 1100,
        "hazards": "Metal roof installation winds, crane overturn, metal cutting flying debris, forklifts operating area.",
        "suggestions": [
            "Lock steel sheeting orders 4 weeks early to hedge against price inflation.",
            "Install high-durability floor coating after primary steel frame is bolted to prevent scuffs.",
            "Recommend continuous ridge ventilation to optimize natural airflow and lower cooling costs."
        ]
    }
]

# Fit vector space model (TF-IDF Vector database representation)
descriptions = [p["description"] for p in HISTORICAL_PROJECTS]
vectorizer = TfidfVectorizer()
vector_db = vectorizer.fit_transform(descriptions)

class ProjectEstimateRequest(BaseModel):
    projectName: str
    targetBudget: float
    workforceCount: int
    designDescription: Optional[str] = ""
    architectSpec: Optional[str] = ""
    length: Optional[float] = 30.0
    floors: Optional[int] = 2

class EstimateResponse(BaseModel):
    projectName: str
    suggestedBudget: float
    estimatedHours: int
    estimatedDays: int
    workforceNeeded: int
    completionDate: str
    structuralScore: str
    hazards: str
    suggestions: List[str]

@app.post("/api/ai/estimate", response_model=EstimateResponse)
def estimate_project(payload: ProjectEstimateRequest):
    # Retrieve closest matching template using cosine similarity search
    query_text = f"{payload.projectName} {payload.designDescription} {payload.architectSpec}"
    query_vector = vectorizer.transform([query_text])
    
    similarities = cosine_similarity(query_vector, vector_db).flatten()
    best_match_idx = int(np.argmax(similarities))
    match_score = similarities[best_match_idx]
    
    matched_template = HISTORICAL_PROJECTS[best_match_idx]
    
    # Generate dynamic suggestions scaling based on the payload parameters
    # Suggested budget is derived from template baseline with scaling factors
    multiplier = 1.0
    if payload.targetBudget > 0:
        # Scale to match user's scale, capping deviation
        ratio = payload.targetBudget / matched_template["base_budget"]
        multiplier = max(0.5, min(ratio, 4.0))
        
    suggested_budget = matched_template["base_budget"] * multiplier * 0.95  # 5% target saving suggestion
    estimated_hours = int(matched_template["base_hours"] * multiplier)
    
    # Custom workforce checks
    workforce_suggestion = ""
    needed_workforce = int(estimated_hours / 150)
    if payload.workforceCount < needed_workforce:
        workforce_suggestion = f"Warning: Target workforce ({payload.workforceCount}) is lower than recommended ({needed_workforce}). Suggest increasing crew size by {needed_workforce - payload.workforceCount} labourers."
    else:
        workforce_suggestion = f"Workforce of {payload.workforceCount} is optimal for this scale."
        
    suggestions = list(matched_template["suggestions"])
    suggestions.append(workforce_suggestion)
    
    # Calculate simulated structural score
    score = int(90 + (match_score * 10))
    structural_score = f"{score}/100"
    
    est_days = estimated_hours // 8
    target_workforce = max(payload.workforceCount, needed_workforce)
    comp_date = (datetime.now() + timedelta(days=est_days)).strftime("%Y-%m-%d")

    return EstimateResponse(
        projectName=payload.projectName,
        suggestedBudget=round(suggested_budget, 2),
        estimatedHours=estimated_hours,
        estimatedDays=est_days,
        workforceNeeded=target_workforce,
        completionDate=comp_date,
        structuralScore=structural_score,
        hazards=matched_template["hazards"],
        suggestions=suggestions
    )

@app.post("/api/ai/analyze-progress")
def analyze_progress(file: UploadFile = File(...)):
    filename = file.filename.lower()
    
    if "towerb" in filename or "slab" in filename:
        progress_ratio = "78%"
        predicted_delay = 5
        detected_issues = [
            "Slab-12 rebar distribution density has a 4.2% deviation from engineering specification.",
            "Scaffolding support base shows minor tilt of 1.2 degrees. Recommend lock re-tightening."
        ]
    elif "column" in filename:
        progress_ratio = "45%"
        predicted_delay = 14
        detected_issues = [
            "Column curing moisture level is insufficient. Wet Hessian cloth wrapping needs replacement.",
            "Warning: Concrete pour honeycombing observed near bottom junction."
        ]
    else:
        progress_ratio = "62%"
        predicted_delay = 8
        detected_issues = [
            "Material stockpile is blocking primary site egress routes.",
            "Safety inspection: Three crew members in Zone B noticed working without active harness attachment."
        ]
        
    return {
        "progressRatio": progress_ratio,
        "predictedDelayDays": predicted_delay,
        "detectedIssues": detected_issues
    }

def call_gemini_api(prompt: str, mime_type: str, img_b64: str) -> dict:
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        return None
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        headers = {"Content-Type": "application/json"}
        body = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt + "\nRespond with a valid JSON document only. Schema: {\"suggestedBudget\": float, \"estimatedDays\": int, \"workforceNeeded\": int, \"structuralScore\": \"string (e.g. 95/100)\", \"hazards\": \"string description\", \"suggestions\": [\"suggestion 1\", \"suggestion 2\"]}"},
                        {
                            "inlineData": {
                                "mimeType": mime_type,
                                "data": img_b64
                            }
                        }
                    ]
                }
            ],
            "generationConfig": {
                "responseMimeType": "application/json"
            }
        }
        
        req = urllib.request.Request(
            url, 
            data=json.dumps(body).encode("utf-8"), 
            headers=headers, 
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=15) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            text_out = res_data["contents"][0]["parts"][0]["text"]
            return json.loads(text_out)
    except Exception as e:
        print("Gemini API call failed:", e)
        return None

@app.post("/api/ai/estimate-image")
async def estimate_image(
    projectName: str = Form(...),
    targetBudget: float = Form(...),
    workforceCount: int = Form(...),
    length: float = Form(...),
    floors: int = Form(...),
    file: UploadFile = File(...)
):
    image_data = await file.read()
    image_b64 = base64.b64encode(image_data).decode("utf-8")
    mime_type = file.content_type or "image/jpeg"
    
    prompt = f"Analyze this construction blueprint / layout design for project '{projectName}'. Constraints: Target Budget: INR {targetBudget}, Length: {length} meters, Floors: {floors}, Planned workforce: {workforceCount}. Estimate the budget baseline (INR), estimated duration in days, optimal workforce count, structural hazard warning tags, and recommendations."
    
    gemini_result = call_gemini_api(prompt, mime_type, image_b64)
    
    if gemini_result:
        est_days = gemini_result.get("estimatedDays", 120)
        workforce = gemini_result.get("workforceNeeded", workforceCount)
        comp_date = (datetime.now() + timedelta(days=est_days)).strftime("%Y-%m-%d")
        return {
            "projectName": projectName,
            "suggestedBudget": gemini_result.get("suggestedBudget", targetBudget * 0.94),
            "estimatedHours": est_days * 8,
            "estimatedDays": est_days,
            "workforceNeeded": workforce,
            "completionDate": comp_date,
            "structuralScore": gemini_result.get("structuralScore", "92/100"),
            "hazards": gemini_result.get("hazards", "Scaffolding safety warnings"),
            "suggestions": gemini_result.get("suggestions", ["Optimize steel grade layout."])
        }
        
    print("Gemini key not configured. Using heuristics fallback...")
    calculated_hours = int((length * floors * 75) + (targetBudget / 22000))
    est_days = calculated_hours // 8
    suggested_budget = targetBudget * 0.93
    hazards = "Excavation trench instability, crane loading limits overreach, scaffolding base sliding."
    suggestions = [
        f"Length of {length}m and {floors} floors requires at least {int(calculated_hours/120)} skilled labourers.",
        f"Suggest pre-cast floor beams for G+{floors} level to minimize concrete curing window delay.",
        "Safety notice: High wind hazard on upper floors (Floor 3+). Secure sheet anchorings."
    ]
    comp_date = (datetime.now() + timedelta(days=est_days)).strftime("%Y-%m-%d")
    
    return {
        "projectName": projectName,
        "suggestedBudget": round(suggested_budget, 2),
        "estimatedHours": calculated_hours,
        "estimatedDays": est_days,
        "workforceNeeded": max(workforceCount, int(calculated_hours/120)),
        "completionDate": comp_date,
        "structuralScore": "93/100",
        "hazards": hazards,
        "suggestions": suggestions
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
