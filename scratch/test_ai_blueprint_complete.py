import urllib.request
import json

def test_full_ai_blueprint_flow():
    # 0. Authenticate as Project Manager
    login_req = urllib.request.Request(
        "http://localhost:8081/api/auth/signin",
        data=json.dumps({"username": "pm@buildcon.com", "password": "pm123"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(login_req) as resp:
        token = json.loads(resp.read().decode("utf-8"))["token"]
        print("0. Authentication successful as PM. Token acquired.")

    # 1. Generate blueprint with FastAPI
    gen_req = urllib.request.Request(
        "http://localhost:8001/api/ai/generate-blueprint",
        data=json.dumps({
            "prompt": "4BHK Luxury Sky Villa with Balcony & HVAC",
            "projectType": "VILLA",
            "builtupSqft": 3600
        }).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(gen_req) as resp:
        assert resp.status == 200, f"FastAPI returned {resp.status}"
        bp = json.loads(resp.read().decode("utf-8"))
        print("1. FastAPI Blueprint generated:", bp["title"])
        print("   Dimensions:", bp["dimensions"]["builtupAreaSqft"], "sqft")
        print("   Rooms:", len(bp["rooms"]), "rooms generated")
        print("   Takeoff Total Cost: INR", bp["takeoff"]["totalEstimatedCostINR"])

    # 2. Upload/Save to Spring Boot Backend with Bearer Token
    upload_payload = {
        "drawingNumber": bp["drawingNumber"],
        "title": bp["title"],
        "category": "ARCHITECTURAL",
        "discipline": "ARCHITECTURAL",
        "revision": "v1.0-AI",
        "revisionNotes": f"AI Blueprint Studio generated: {bp['prompt']}",
        "fileName": f"{bp['drawingNumber'].lower()}.dwg",
        "fileType": "DWG_CAD_VECTOR",
        "fileSizeBytes": 3120000,
        "status": "APPROVED_FOR_CONSTRUCTION",
        "approvedBy": "Lead Architect (AI Verified)",
        "approvalDate": "2026-11-20",
        "uploadedBy": "AI CAD Generative Engine",
        "projectName": "Skyline Tech Park - Tower B",
        "builtupAreaSqft": bp["dimensions"]["builtupAreaSqft"],
        "carpetAreaSqft": bp["dimensions"]["carpetAreaSqft"],
        "wallLengthMeters": bp["dimensions"]["wallPerimeterMeters"],
        "openingCount": len(bp["rooms"]) * 3,
        "clashesCount": 0,
        "organizationId": 1,
        "aiAnalysisJson": json.dumps(bp)
    }

    save_req = urllib.request.Request(
        "http://localhost:8081/api/drawings/upload",
        data=json.dumps(upload_payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"}
    )
    with urllib.request.urlopen(save_req) as resp:
        assert resp.status == 200, f"Spring Boot upload returned {resp.status}"
        saved = json.loads(resp.read().decode("utf-8"))
        print("2. Spring Boot saved drawing record:", saved["id"], saved["drawingNumber"])

    # 3. Verify drawings list in Spring Boot
    list_req = urllib.request.Request(
        "http://localhost:8081/api/drawings/org/1",
        headers={"Authorization": f"Bearer {token}"}
    )
    with urllib.request.urlopen(list_req) as resp:
        assert resp.status == 200
        dwgs = json.loads(resp.read().decode("utf-8"))
        print(f"3. Spring Boot catalog has {len(dwgs)} drawings in Org 1.")
        found = any(d["drawingNumber"] == bp["drawingNumber"] for d in dwgs)
        assert found, "Generated blueprint not found in database!"
        print("âœ… Verified: Generated blueprint is stored and queryable in database!")

    print("\nâœ… ALL AI BLUEPRINT TESTS PASSED 100%!")

if __name__ == "__main__":
    test_full_ai_blueprint_flow()
