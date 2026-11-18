Write-Host "=== Testing Blueprint & AI Prediction Engine APIs ===" -ForegroundColor Cyan

# 1. Signin to get JWT
$authPayload = @{
    username = "qaqc"
    password = "qaqc123"
} | ConvertTo-Json

$token = ""
try {
    $loginRes = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/signin" -Method POST -Body $authPayload -ContentType "application/json"
    $token = if ($loginRes.token) { $loginRes.token } else { $loginRes.accessToken }
    Write-Host "[PASS] Authentication successful for qaqc (Token acquired: $($token.Substring(0, 15))...)" -ForegroundColor Green
} catch {
    Write-Host "[WARN] Login failed, proceeding without token: $_" -ForegroundColor Yellow
}

$headers = @{}
if ($token) {
    $headers["Authorization"] = "Bearer $token"
}

# 2. GET /api/drawings/org/1
try {
    $drawings = Invoke-RestMethod -Uri "http://localhost:8081/api/drawings/org/1" -Method GET -Headers $headers
    Write-Host "[PASS] GET /api/drawings/org/1 retrieved $($drawings.Count) blueprints" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] GET /api/drawings/org/1 failed: $_" -ForegroundColor Red
}

# 3. POST /api/drawings/upload
$testDrawingId = 1
try {
    $newDwg = @{
        drawingNumber = "DWG-STR-TWB-099"
        title = "Tower B Podium Transfer Slab Reinforcement"
        category = "STRUCTURAL"
        discipline = "Structural RCC"
        revision = "v1.0"
        revisionNotes = "Initial engineering draft"
        fileName = "podium_transfer_slab_v1.dwg"
        fileType = "DWG"
        fileSizeBytes = 16200000
        status = "UNDER_REVIEW"
        projectName = "Skyline Tech Park - Tower B"
        projectId = 1
        scaleRatio = "1:50"
        builtupAreaSqft = 26500.0
        carpetAreaSqft = 20670.0
        organizationId = 1
    } | ConvertTo-Json

    $createdDwg = Invoke-RestMethod -Uri "http://localhost:8081/api/drawings/upload" -Method POST -Body $newDwg -ContentType "application/json" -Headers $headers
    $testDrawingId = $createdDwg.id
    Write-Host "[PASS] POST /api/drawings/upload created ID $testDrawingId ($($createdDwg.drawingNumber))" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] POST /api/drawings/upload failed: $_" -ForegroundColor Red
}

# 4. PUT /api/drawings/{id}/approve
try {
    $approvePayload = @{
        approvedBy = "Er. V. Ramanathan (Chief Structural Consultant)"
    } | ConvertTo-Json

    $approved = Invoke-RestMethod -Uri "http://localhost:8081/api/drawings/$testDrawingId/approve" -Method PUT -Body $approvePayload -ContentType "application/json" -Headers $headers
    Write-Host "[PASS] PUT /api/drawings/$testDrawingId/approve status -> $($approved.status)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] PUT /api/drawings/$testDrawingId/approve failed: $_" -ForegroundColor Red
}

# 5. GET /api/drawings/clashes/org/1
$testClashId = 1
try {
    $clashes = Invoke-RestMethod -Uri "http://localhost:8081/api/drawings/clashes/org/1" -Method GET -Headers $headers
    Write-Host "[PASS] GET /api/drawings/clashes/org/1 retrieved $($clashes.Count) clashes" -ForegroundColor Green
    if ($clashes.Count -gt 0) {
        $testClashId = $clashes[0].id
    }
} catch {
    Write-Host "[FAIL] GET /api/drawings/clashes/org/1 failed: $_" -ForegroundColor Red
}

# 6. PUT /api/drawings/clashes/{clashId}/resolve
try {
    $resolvePayload = @{
        resolutionNotes = "Rerouted HVAC duct below beam soffit with 50mm insulation sleeve."
        resolvedBy = "Er. Ramesh (MEP Lead)"
    } | ConvertTo-Json

    $resolvedClash = Invoke-RestMethod -Uri "http://localhost:8081/api/drawings/clashes/$testClashId/resolve" -Method PUT -Body $resolvePayload -ContentType "application/json" -Headers $headers
    Write-Host "[PASS] PUT /api/drawings/clashes/$testClashId/resolve -> $($resolvedClash.resolutionStatus)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] PUT /api/drawings/clashes/$testClashId/resolve failed: $_" -ForegroundColor Red
}

# 7. POST /api/drawings/{id}/analyze-ai
try {
    $analyzed = Invoke-RestMethod -Uri "http://localhost:8081/api/drawings/1/analyze-ai" -Method POST -Headers $headers
    Write-Host "[PASS] POST /api/drawings/1/analyze-ai -> Builtup: $($analyzed.builtupAreaSqft) sqft, Wall: $($analyzed.wallLengthMeters) m" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] POST /api/drawings/1/analyze-ai failed: $_" -ForegroundColor Red
}

# 8. GET /api/ai-predictions/project/1
try {
    $prediction = Invoke-RestMethod -Uri "http://localhost:8081/api/ai-predictions/project/1" -Method GET -Headers $headers
    Write-Host "[PASS] GET /api/ai-predictions/project/1 -> Delay: $($prediction.delayRiskPercentage)%, Cost Overrun: $($prediction.costOverrunProbability)%" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] GET /api/ai-predictions/project/1 failed: $_" -ForegroundColor Red
}

# 9. POST /api/ai-predictions/generate
try {
    $genPayload = @{
        projectId = 1
        projectName = "Skyline Tech Park - Tower B"
        organizationId = 1
    } | ConvertTo-Json

    $generatedPred = Invoke-RestMethod -Uri "http://localhost:8081/api/ai-predictions/generate" -Method POST -Body $genPayload -ContentType "application/json" -Headers $headers
    Write-Host "[PASS] POST /api/ai-predictions/generate -> Bottleneck: $($generatedPred.criticalPathRisk)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] POST /api/ai-predictions/generate failed: $_" -ForegroundColor Red
}

# 10. Frontend Route Check
try {
    $feRes = Invoke-WebRequest -Uri "http://localhost:3000/drawings" -UseBasicParsing
    Write-Host "[PASS] Frontend http://localhost:3000/drawings returned HTTP $($feRes.StatusCode) ($($feRes.RawContentLength) bytes)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Frontend http://localhost:3000/drawings check failed: $_" -ForegroundColor Red
}

Write-Host "=== All Blueprint & AI Prediction Verification Completed ===" -ForegroundColor Cyan
