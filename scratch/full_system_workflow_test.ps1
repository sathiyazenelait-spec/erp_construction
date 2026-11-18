$ErrorActionPreference = "Continue"

Write-Host "=======================================================================" -ForegroundColor Cyan
Write-Host "       BUILDCON ERP: COMPREHENSIVE END-TO-END WORKFLOW TEST SUITE      " -ForegroundColor Cyan
Write-Host "=======================================================================" -ForegroundColor Cyan

$passCount = 0
$failCount = 0

function Assert-Step($title, $scriptBlock) {
    try {
        $result = & $scriptBlock
        Write-Host " [PASS] $title" -ForegroundColor Green
        if ($result) {
            Write-Host "        Details: $result" -ForegroundColor DarkGray
        }
        $script:passCount++
    } catch {
        Write-Host " [FAIL] $title" -ForegroundColor Red
        Write-Host "        Error: $_" -ForegroundColor DarkRed
        $script:failCount++
    }
}

# ---------------------------------------------------------
# SECTION 1: SERVER CONNECTIVITY
# ---------------------------------------------------------
Write-Host "`n--- SECTION 1: SERVER CONNECTIVITY & HEALTH ---" -ForegroundColor Yellow

Assert-Step "Spring Boot Backend REST API is alive (Port 8081)" {
    $res = Invoke-RestMethod -Uri "http://localhost:8081/api/packages" -Method GET
    return "Status OK, packages count: $($res.Count)"
}

Assert-Step "FastAPI AI Engine is alive (Port 8001)" {
    $res = Invoke-RestMethod -Uri "http://localhost:8001/docs" -Method GET
    return "Swagger UI online at http://localhost:8001/docs"
}

Assert-Step "Next.js Frontend is serving requests (Port 3000)" {
    $res = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
    return "HTTP $($res.StatusCode), Size: $($res.RawContentLength) bytes"
}

# ---------------------------------------------------------
# SECTION 2: AUTHENTICATION & SECURITY TOKENS
# ---------------------------------------------------------
Write-Host "`n--- SECTION 2: AUTHENTICATION & MULTI-ROLE SECURITY TOKENS ---" -ForegroundColor Yellow

$global:qaqcToken = ""
$global:storeToken = ""
$global:vendorToken = ""
$global:clientToken = ""

Assert-Step "Authenticate QA/QC Engineer ('qaqc')" {
    $body = @{ username = "qaqc"; password = "qaqc123" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/signin" -Method POST -Body $body -ContentType "application/json"
    $global:qaqcToken = if ($res.token) { $res.token } else { $res.accessToken }
    return "Token acquired: $($global:qaqcToken.Substring(0, 15))..., Roles: $($res.roles -join ', ')"
}

Assert-Step "Authenticate Store Manager ('storemanager')" {
    $body = @{ username = "storemanager"; password = "store123" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/signin" -Method POST -Body $body -ContentType "application/json"
    $global:storeToken = if ($res.token) { $res.token } else { $res.accessToken }
    return "Token acquired: Roles: $($res.roles -join ', ')"
}

Assert-Step "Authenticate Vendor Supplier ('tatatiscon')" {
    $body = @{ username = "tatatiscon"; password = "vendor123" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/signin" -Method POST -Body $body -ContentType "application/json"
    $global:vendorToken = if ($res.token) { $res.token } else { $res.accessToken }
    return "Token acquired: Roles: $($res.roles -join ', ')"
}

Assert-Step "Authenticate Customer / Client ('rajesh')" {
    $body = @{ username = "rajesh"; password = "client123" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/signin" -Method POST -Body $body -ContentType "application/json"
    $global:clientToken = if ($res.token) { $res.token } else { $res.accessToken }
    return "Token acquired: Roles: $($res.roles -join ', ')"
}

$authHeaders = @{
    "Authorization" = "Bearer $global:qaqcToken"
    "Content-Type" = "application/json"
}
$aiHeaders = @{
    "X-API-Key" = "BuildconERPSecretKeyForSecurityAuthenticationJWT"
    "Content-Type" = "application/json"
}

# ---------------------------------------------------------
# SECTION 3: FASTAPI AI PREDICTION ENGINE (PORT 8001)
# ---------------------------------------------------------
Write-Host "`n--- SECTION 3: FASTAPI GENERATIVE AI SERVICES (PORT 8001) ---" -ForegroundColor Yellow

Assert-Step "FastAPI AI Pre-Project Feasibility & Budget Scoping (/api/ai/estimate)" {
    $body = @{
        projectName = "Zenith Sky City Tower C"
        targetBudget = 85000000.0
        workforceCount = 95
        builtupSqft = 48500.0
        floors = 3
        locationType = "District HQ City"
    } | ConvertTo-Json

    $res = Invoke-RestMethod -Uri "http://localhost:8001/api/ai/estimate" -Method POST -Body $body -Headers $aiHeaders
    return "Suggested Budget: ₹$([math]::Round($res.suggestedBudget / 10000000, 2)) Cr, Days: $($res.recommendedDays), Concrete: $($res.concreteVolume) m3, Steel: $($res.steelTonnage) MT"
}

Assert-Step "FastAPI AI Generic Copilot Assistant (/api/ai/generic-chat)" {
    $body = @{
        message = "How do we handle compressive strength failure in M25 concrete cube tests?"
        role = "qa_qc_engineer"
        profileName = "qaqc"
        organizationId = "1"
    } | ConvertTo-Json

    $res = Invoke-RestMethod -Uri "http://localhost:8001/api/ai/generic-chat" -Method POST -Body $body -Headers $aiHeaders
    return "Response length: $($res.response.Length) chars, Sample: $($res.response.Substring(0, 80))..."
}

Assert-Step "FastAPI AI Procurement Suggestions (/api/ai/procurement-suggestions)" {
    $body = @{
        projectStage = "Structure & Superstructure"
        criticalMaterials = @("Cement", "TMT Steel", "RMC")
    } | ConvertTo-Json

    $res = Invoke-RestMethod -Uri "http://localhost:8001/api/ai/procurement-suggestions" -Method POST -Body $body -Headers $aiHeaders
    return "Suggestions returned: $($res.suggestions.Count) recommendations generated"
}

# ---------------------------------------------------------
# SECTION 4: FULL WORKFLOW PIPELINE (SPRING BOOT BACKEND)
# ---------------------------------------------------------
Write-Host "`n--- SECTION 4: COMPLETE CONSTRUCTION WORKFLOW PIPELINE ---" -ForegroundColor Yellow

# Step 1: Blueprint Upload & AI Scoping
$global:dwgId = 0
Assert-Step "Workflow 1: Upload CAD/BIM Blueprint with instant AI takeoff" {
    $body = @{
        drawingNumber = "DWG-TWB-SLAB-88"
        title = "Tower B Superstructure Level 5 Slab Reinforcement"
        category = "STRUCTURAL"
        discipline = "Structural RCC"
        revision = "v1.0"
        revisionNotes = "Released for structural engineering review"
        fileName = "twb_slab_lvl5_rev1.dwg"
        fileType = "DWG"
        fileSizeBytes = 18400000
        status = "UNDER_REVIEW"
        projectName = "Skyline Tech Park - Tower B"
        projectId = 1
        scaleRatio = "1:50"
        builtupAreaSqft = 24600.0
        carpetAreaSqft = 19188.0
        organizationId = 1
    } | ConvertTo-Json

    $res = Invoke-RestMethod -Uri "http://localhost:8081/api/drawings/upload" -Method POST -Body $body -Headers $authHeaders
    $global:dwgId = $res.id
    return "Created Drawing ID: $($res.id) ($($res.drawingNumber)), Built-up: $($res.builtupAreaSqft) sqft, Wall: $($res.wallLengthMeters)m"
}

Assert-Step "Workflow 2: Multi-Role Drawing Approval for Site Construction Release (IFC)" {
    $body = @{
        approvedBy = "Er. V. Ramanathan (Chief Structural Consultant)"
    } | ConvertTo-Json

    $res = Invoke-RestMethod -Uri "http://localhost:8081/api/drawings/$global:dwgId/approve" -Method PUT -Body $body -Headers $authHeaders
    return "Drawing ID $global:dwgId transitioned to status: $($res.status), Approved By: $($res.approvedBy)"
}

Assert-Step "Workflow 3: Spatial Clash Detection & Engineering Resolution" {
    $clashes = Invoke-RestMethod -Uri "http://localhost:8081/api/drawings/clashes/org/1" -Method GET -Headers $authHeaders
    $targetClash = $clashes | Where-Object { $_.resolutionStatus -eq "OPEN" } | Select-Object -First 1
    if (-not $targetClash) {
        $targetClash = $clashes[0]
    }
    $body = @{
        resolutionNotes = "Offset duct by 60mm with Class-O fire acoustic sleeve."
        resolvedBy = "Er. Ramesh (Lead MEP Engineer)"
    } | ConvertTo-Json

    $res = Invoke-RestMethod -Uri "http://localhost:8081/api/drawings/clashes/$($targetClash.id)/resolve" -Method PUT -Body $body -Headers $authHeaders
    return "Clash ID $($targetClash.id) marked: $($res.resolutionStatus), Notes: $($res.resolutionNotes)"
}

Assert-Step "Workflow 4: Deep AI Project Delay & Budget Prediction Engine" {
    $body = @{
        projectId = 1
        projectName = "Skyline Tech Park - Tower B"
        organizationId = 1
    } | ConvertTo-Json

    $res = Invoke-RestMethod -Uri "http://localhost:8081/api/ai-predictions/generate" -Method POST -Body $body -Headers $authHeaders
    return "Delay Risk: $($res.delayRiskPercentage)%, Days: +$($res.predictedDelayDays)d, Cost Overrun Risk: $($res.costOverrunProbability)%, Variance: ₹$($res.projectedCostVariance)"
}

Assert-Step "Workflow 5: Store & Inventory Stock Tracking" {
    $storeHeaders = @{ "Authorization" = "Bearer $global:storeToken" }
    $res = Invoke-RestMethod -Uri "http://localhost:8081/api/store-manager/dashboard/org/1" -Method GET -Headers $storeHeaders
    return "Store Dashboard loaded, Items count: $($res.inventoryItems.Count), Critical Alerts: $($res.criticalStockCount)"
}

Assert-Step "Workflow 6: QA/QC Inspection, Cube Test & NCR Logging" {
    $res = Invoke-RestMethod -Uri "http://localhost:8081/api/qa-qc/dashboard/org/1" -Method GET -Headers $authHeaders
    return "QA/QC Dashboard loaded, Cube Tests: $($res.cubeTests.Count), Active NCRs: $($res.openNcrs)"
}

Assert-Step "Workflow 7: Vendor Bidding & Supply Management" {
    $vendorHeaders = @{ "Authorization" = "Bearer $global:vendorToken" }
    $res = Invoke-RestMethod -Uri "http://localhost:8081/api/vendor-portal/dashboard/org/1" -Method GET -Headers $vendorHeaders
    return "Vendor Portal loaded, Active RFQ Bids: $($res.bids.Count)"
}

Assert-Step "Workflow 8: Customer Handover & Snag Ticket Resolution" {
    $clientHeaders = @{ "Authorization" = "Bearer $global:clientToken" }
    $res = Invoke-RestMethod -Uri "http://localhost:8081/api/client-portal/dashboard/org/1" -Method GET -Headers $clientHeaders
    return "Client Portal loaded, Tickets: $($res.tickets.Count), Handover Progress: $($res.handoverPercentage)%"
}

Assert-Step "Workflow 9: Immutable Audit Trail Event Verification" {
    $res = Invoke-RestMethod -Uri "http://localhost:8081/api/audit-logs/org/1" -Method GET -Headers $authHeaders
    $lastLog = $res[0]
    return "Audit logs count: $($res.Count), Latest Event: [$($lastLog.action)] on $($lastLog.entityName) by $($lastLog.performedBy)"
}

Assert-Step "Workflow 10: Statutory Compliance & License Expiry Alerts" {
    $res = Invoke-RestMethod -Uri "http://localhost:8081/api/compliance/org/1" -Method GET -Headers $authHeaders
    return "Compliance Score: $($res.complianceScore)%, Total Licenses: $($res.totalRecords), Expiring Soon: $($res.expiringSoonCount)"
}

Assert-Step "Workflow 11: Meeting Management (MoM) & Action Items" {
    $res = Invoke-RestMethod -Uri "http://localhost:8081/api/meetings/org/1" -Method GET -Headers $authHeaders
    return "MoM Records: $($res.meetings.Count), Action Items: $($res.actionItems.Count), Open Tasks: $($res.openActionItems)"
}

Assert-Step "Workflow 12: WhatsApp / SMS Carrier Gateway Dispatch" {
    $body = @{
        channel = "WHATSAPP"
        recipient = "+919840192834"
        recipientName = "Site Superintendent Raman"
        templateName = "MILESTONE_PROGRESS_ALERT"
        subject = "Tower B Slab 5 Pour Complete"
        messageContent = "ALERT: Tower B Level 5 Raft Concrete Pour successfully achieved. 28-day curing cycle commences."
        organizationId = 1
    } | ConvertTo-Json

    $res = Invoke-RestMethod -Uri "http://localhost:8081/api/notifications/dispatch" -Method POST -Body $body -Headers $authHeaders
    return "Dispatched via $($res.channel) to $($res.recipient), Delivery: $($res.deliveryStatus), Tracking: $($res.externalMessageId)"
}

# ---------------------------------------------------------
# SECTION 5: FRONTEND PAGES & PORTALS (HTTP 200 CHECKS)
# ---------------------------------------------------------
Write-Host "`n--- SECTION 5: FRONTEND WEB PORTALS (HTTP 200 PROBES) ---" -ForegroundColor Yellow

$routes = @(
    "/",
    "/login",
    "/project-manager",
    "/construction-manager",
    "/senior-site-engineer",
    "/store-manager",
    "/procurement-manager",
    "/qa-qc-engineer",
    "/workforce-manager",
    "/subcontractor",
    "/quantity-surveyor",
    "/finance-accounts",
    "/finance-director",
    "/project-director",
    "/business-director",
    "/md",
    "/chairman",
    "/client-portal",
    "/vendor-portal",
    "/audit-logs",
    "/compliance",
    "/meetings",
    "/notifications",
    "/drawings"
)

foreach ($r in $routes) {
    Assert-Step "Route $r" {
        $res = Invoke-WebRequest -Uri "http://localhost:3000$r" -UseBasicParsing -TimeoutSec 15
        if ($res.StatusCode -ne 200) {
            throw "HTTP $($res.StatusCode)"
        }
        return "HTTP 200 OK ($($res.RawContentLength) bytes)"
    }
}

# ---------------------------------------------------------
# FINAL SUMMARY
# ---------------------------------------------------------
Write-Host "`n=======================================================================" -ForegroundColor Cyan
Write-Host "                        FINAL VERIFICATION SUMMARY                     " -ForegroundColor Cyan
Write-Host "=======================================================================" -ForegroundColor Cyan
Write-Host " Total Steps Tested : $($passCount + $failCount)" -ForegroundColor White
Write-Host " Tests Passed       : $passCount" -ForegroundColor Green
Write-Host " Tests Failed       : $failCount" -ForegroundColor $(if ($failCount -eq 0) { "Green" } else { "Red" })

if ($failCount -eq 0) {
    Write-Host "`n [SUCCESS] ALL TEST CASES PASSED WITH 100% SUCCESS RATE!" -ForegroundColor Green
} else {
    Write-Host "`n [WARNING] Some tests encountered errors. Check logs above." -ForegroundColor Red
}
