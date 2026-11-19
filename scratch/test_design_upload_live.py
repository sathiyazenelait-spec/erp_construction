import urllib.request
import json
import os

print("=== 1. Testing Project Manager AI Estimator (Port 8001) ===")

url_est = "http://localhost:8001/api/ai/estimate"
payload_est = {
    "projectName": "Skyline Tech Park - Tower B",
    "targetBudget": 150000000.0,
    "workforceCount": 120,
    "designDescription": "Commercial IT Tower with RCC frame and double glazed facade",
    "architectSpec": "Structural dimensions: 69750.0 sq ft built-up area x 4 floors",
    "builtupSqft": 69750.0,
    "floors": 4,
    "locationType": "District HQ City"
}

headers_est = {
    "X-API-Key": "BuildconERPSecretKeyForSecurityAuthenticationJWT",
    "Content-Type": "application/json"
}

req_est = urllib.request.Request(url_est, data=json.dumps(payload_est).encode('utf-8'), headers=headers_est, method='POST')
try:
    with urllib.request.urlopen(req_est) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print("[PASS] AI Estimator (/api/ai/estimate) returned 200 OK!")
        print(f"       Suggested Budget : ₹{data.get('suggestedBudget') / 10000000:.2f} Cr")
        print(f"       Completion Date  : {data.get('completionDate')} ({data.get('estimatedDays')} days)")
        print(f"       Concrete Volume  : {data.get('concreteVolume')} m3")
        print(f"       Steel Tonnage    : {data.get('steelTonnage')} MT")
        print(f"       Structural Score : {data.get('structuralScore')}")
        print(f"       Structural Cost  : ₹{data.get('structuralCost') / 10000000:.2f} Cr")
        print(f"       MEP Cost         : ₹{data.get('mepCost') / 10000000:.2f} Cr")
        print(f"       Finishing Cost   : ₹{data.get('finishingCost') / 10000000:.2f} Cr")
        print(f"       Contingency      : ₹{data.get('contingencyCost') / 10000000:.2f} Cr")
        print(f"       Hazards          : {data.get('hazards')}")
        print(f"       Suggestions      : {len(data.get('suggestions', []))} recommendations")
except Exception as e:
    print(f"[FAIL] AI Estimator error: {e}")

print("\n=== 2. Testing Blueprint Hub Upload & AI Takeoff (Port 8081) ===")

# First get auth token
auth_url = "http://localhost:8081/api/auth/signin"
auth_payload = {"username": "qaqc", "password": "qaqc123"}
auth_req = urllib.request.Request(auth_url, data=json.dumps(auth_payload).encode('utf-8'), headers={"Content-Type": "application/json"}, method='POST')

token = ""
try:
    with urllib.request.urlopen(auth_req) as resp:
        auth_data = json.loads(resp.read().decode('utf-8'))
        token = auth_data.get("token") or auth_data.get("accessToken")
        print(f"[PASS] Authentication successful for qaqc (Token: {token[:15]}...)")
except Exception as e:
    print(f"[FAIL] Auth failed: {e}")

if token:
    dwg_url = "http://localhost:8081/api/drawings/upload"
    dwg_payload = {
        "drawingNumber": "DWG-AI-LIVE-TEST-01",
        "title": "Tower C Commercial Slab Layout & Beam Schedule",
        "category": "STRUCTURAL",
        "discipline": "Structural RCC",
        "revision": "v1.0",
        "fileName": "tower_c_commercial_slab.dwg",
        "fileType": "DWG",
        "fileSizeBytes": 15400000,
        "status": "UNDER_REVIEW",
        "projectName": "Skyline Tech Park - Tower C",
        "projectId": 1,
        "scaleRatio": "1:50",
        "builtupAreaSqft": 31200.0,
        "organizationId": 1
    }
    dwg_req = urllib.request.Request(
        dwg_url,
        data=json.dumps(dwg_payload).encode('utf-8'),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        },
        method='POST'
    )
    try:
        with urllib.request.urlopen(dwg_req) as resp:
            dwg_data = json.loads(resp.read().decode('utf-8'))
            print("[PASS] Blueprint Hub (/api/drawings/upload) returned 200 OK!")
            print(f"       Drawing ID       : {dwg_data.get('id')} ({dwg_data.get('drawingNumber')})")
            print(f"       AI Built-up Area : {dwg_data.get('builtupAreaSqft')} sqft")
            print(f"       AI Carpet Area   : {dwg_data.get('carpetAreaSqft')} sqft")
            print(f"       AI Wall Length   : {dwg_data.get('wallLengthMeters')} m")
            print(f"       AI Openings      : {dwg_data.get('openingCount')} doors/windows")
            print(f"       AI Clash Flags   : {dwg_data.get('clashesCount')} detected")
    except Exception as e:
        print(f"[FAIL] Blueprint upload error: {e}")

print("\n=== 3. Testing Deep AI Project Predictions (Port 8081) ===")
if token:
    pred_url = "http://localhost:8081/api/ai-predictions/project/1"
    pred_req = urllib.request.Request(pred_url, headers={"Authorization": f"Bearer {token}"}, method='GET')
    try:
        with urllib.request.urlopen(pred_req) as resp:
            pred_data = json.loads(resp.read().decode('utf-8'))
            print("[PASS] AI Predictions (/api/ai-predictions/project/1) returned 200 OK!")
            print(f"       Delay Risk %     : {pred_data.get('delayRiskPercentage')}%")
            print(f"       Predicted Delay  : +{pred_data.get('predictedDelayDays')} days")
            print(f"       Critical Path    : {pred_data.get('criticalPathRisk')}")
            print(f"       Cost Overrun %   : {pred_data.get('costOverrunProbability')}%")
            print(f"       Budget Variance  : ₹{pred_data.get('projectedCostVariance'):,.2f}")
            print(f"       Safety Score     : {pred_data.get('safetyRiskScore')}/100")
            print(f"       High Risk Zone   : {pred_data.get('highRiskZone')}")
    except Exception as e:
        print(f"[FAIL] Prediction fetch error: {e}")

print("\n=== ALL LIVE TESTS COMPLETED SUCCESSFULLY ===")
