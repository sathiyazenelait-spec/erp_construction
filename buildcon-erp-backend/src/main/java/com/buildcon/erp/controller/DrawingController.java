package com.buildcon.erp.controller;

import com.buildcon.erp.model.DrawingClashRecord;
import com.buildcon.erp.model.DrawingRecord;
import com.buildcon.erp.service.AiPredictionService;
import com.buildcon.erp.service.DrawingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/drawings")
public class DrawingController {

    @Autowired
    private DrawingService drawingService;

    @Autowired
    private AiPredictionService aiPredictionService;

    @GetMapping("/org/{orgId}")
    public ResponseEntity<List<DrawingRecord>> getDrawings(@PathVariable Long orgId) {
        return ResponseEntity.ok(drawingService.getDrawings(orgId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DrawingRecord> getDrawingById(@PathVariable Long id) {
        return drawingService.getDrawingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/upload")
    public ResponseEntity<DrawingRecord> uploadDrawing(@RequestBody DrawingRecord drawing) {
        DrawingRecord saved = drawingService.saveDrawing(drawing);
        // Automatically trigger AI initial blueprint takeoff
        try {
            saved = aiPredictionService.analyzeBlueprintWithAi(saved.getId());
        } catch (Exception e) {
            System.err.println("Non-blocking AI blueprint analysis error: " + e.getMessage());
        }
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<DrawingRecord> approveDrawing(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String approvedBy = body.getOrDefault("approvedBy", "Chief Structural Consultant");
        DrawingRecord approved = drawingService.approveDrawing(id, approvedBy);
        return ResponseEntity.ok(approved);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<DrawingRecord> rejectDrawing(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String remarks = body.getOrDefault("remarks", "Rejected. Revisions requested.");
        String rejectedBy = body.getOrDefault("rejectedBy", "QA/QC Lead");
        DrawingRecord rejected = drawingService.rejectDrawing(id, remarks, rejectedBy);
        return ResponseEntity.ok(rejected);
    }

    @GetMapping("/{id}/clashes")
    public ResponseEntity<List<DrawingClashRecord>> getDrawingClashes(@PathVariable Long id) {
        return ResponseEntity.ok(drawingService.getClashes(id));
    }

    @GetMapping("/clashes/org/{orgId}")
    public ResponseEntity<List<DrawingClashRecord>> getAllClashesByOrg(@PathVariable Long orgId) {
        return ResponseEntity.ok(drawingService.getAllClashesByOrg(orgId));
    }

    @PutMapping("/clashes/{clashId}/resolve")
    public ResponseEntity<DrawingClashRecord> resolveClash(@PathVariable Long clashId, @RequestBody Map<String, String> body) {
        String notes = body.getOrDefault("resolutionNotes", "Resolved on site.");
        String resolvedBy = body.getOrDefault("resolvedBy", "MEP Consultant");
        DrawingClashRecord resolved = drawingService.resolveClash(clashId, notes, resolvedBy);
        return ResponseEntity.ok(resolved);
    }

    @PostMapping("/{id}/analyze-ai")
    public ResponseEntity<DrawingRecord> triggerAiAnalysis(@PathVariable Long id) {
        DrawingRecord analyzed = aiPredictionService.analyzeBlueprintWithAi(id);
        return ResponseEntity.ok(analyzed);
    }

    // =========================================================================
    // SECURE SHARE TOKENS, LINK EXPIRY, REVOKE ACCESS & ACCESS TRACKING APIS
    // =========================================================================

    private static final java.util.concurrent.ConcurrentHashMap<String, Map<String, Object>> SHARE_TOKENS = new java.util.concurrent.ConcurrentHashMap<>();
    private static final java.util.concurrent.ConcurrentHashMap<Long, List<Map<String, Object>>> ACCESS_LOGS = new java.util.concurrent.ConcurrentHashMap<>();
    private static final java.util.concurrent.ConcurrentHashMap<Long, Map<String, Object>> REVOKED_DRAWINGS = new java.util.concurrent.ConcurrentHashMap<>();

    @PostMapping("/share/create")
    public ResponseEntity<?> createShareToken(@RequestBody Map<String, Object> body) {
        String token = "dwg_token_" + java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        long now = System.currentTimeMillis();
        int expiryHours = body.containsKey("expiryHours") ? Integer.parseInt(body.get("expiryHours").toString()) : 24;
        Long expiresAt = expiryHours > 0 ? (now + (long) expiryHours * 3600 * 1000) : null;

        Long drawingId = body.containsKey("drawingId") ? Long.parseLong(body.get("drawingId").toString()) : null;
        String modelTitle = body.getOrDefault("modelTitle", "3D Building Massing & Blueprint Model").toString();
        String orgName = body.getOrDefault("organizationName", "BuildWell Constructions Ltd").toString();
        String role = body.getOrDefault("createdByRole", "Site Engineering & CAD Team").toString();

        Map<String, Object> tokenRecord = new java.util.concurrent.ConcurrentHashMap<>();
        tokenRecord.put("token", token);
        tokenRecord.put("drawingId", drawingId != null ? drawingId : 0L);
        tokenRecord.put("modelTitle", modelTitle);
        tokenRecord.put("organizationName", orgName);
        tokenRecord.put("createdByRole", role);
        tokenRecord.put("createdAt", java.time.LocalDateTime.now().toString());
        tokenRecord.put("createdAtMillis", now);
        tokenRecord.put("expiryHours", expiryHours);
        tokenRecord.put("expiresAt", expiresAt != null ? expiresAt : -1L);
        tokenRecord.put("expiresAtFormatted", expiresAt != null ? new java.util.Date(expiresAt).toString() : "Never (Permanent)");
        tokenRecord.put("isRevoked", false);
        tokenRecord.put("accessCount", 0);

        if (body.containsKey("aiAnalysisJson")) {
            tokenRecord.put("aiAnalysisJson", body.get("aiAnalysisJson").toString());
        }

        SHARE_TOKENS.put(token, tokenRecord);

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("token", token);
        response.put("shareUrl", "http://localhost:3000/drawings/share?token=" + token);
        response.put("expiresAt", expiresAt != null ? expiresAt : -1L);
        response.put("expiresAtFormatted", tokenRecord.get("expiresAtFormatted"));
        response.put("tokenRecord", tokenRecord);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/share/validate")
    public ResponseEntity<?> validateShareToken(
            @RequestParam(required = false) String token,
            @RequestParam(required = false) Long drawingId,
            jakarta.servlet.http.HttpServletRequest request
    ) {
        String clientIp = request != null ? request.getRemoteAddr() : "127.0.0.1";
        String userAgent = request != null ? request.getHeader("User-Agent") : "Browser";

        // Check if drawing has been revoked by Chairman
        if (drawingId != null && REVOKED_DRAWINGS.containsKey(drawingId)) {
            Map<String, Object> revokeInfo = REVOKED_DRAWINGS.get(drawingId);
            Map<String, Object> error = new java.util.HashMap<>();
            error.put("valid", false);
            error.put("status", "REVOKED");
            error.put("revocationReason", revokeInfo.getOrDefault("reason", "Access terminated by Executive Chairman Directive"));
            error.put("revokedBy", revokeInfo.getOrDefault("revokedBy", "Chairman (Executive Board)"));
            error.put("revokedAt", revokeInfo.getOrDefault("revokedAt", java.time.LocalDateTime.now().toString()));
            error.put("message", "Access to this 3D building structural model was officially terminated by Chairman order.");
            return ResponseEntity.status(403).body(error);
        }

        if (token == null || token.isBlank()) {
            // Check direct drawing ID access
            if (drawingId != null) {
                return drawingService.getDrawingById(drawingId)
                        .map(d -> ResponseEntity.ok(Map.of("valid", true, "drawing", d, "status", "ACTIVE")))
                        .orElse(ResponseEntity.notFound().build());
            }
            return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Share token or Drawing ID required"));
        }

        Map<String, Object> tokenRecord = SHARE_TOKENS.get(token);
        if (tokenRecord == null) {
            return ResponseEntity.status(404).body(Map.of("valid", false, "status", "INVALID_TOKEN", "message", "Invalid or unknown share link token"));
        }

        // Check if token explicitly revoked
        if (Boolean.TRUE.equals(tokenRecord.get("isRevoked"))) {
            return ResponseEntity.status(403).body(Map.of(
                    "valid", false,
                    "status", "REVOKED",
                    "revokedBy", tokenRecord.getOrDefault("revokedBy", "Chairman (Executive Board)"),
                    "revocationReason", tokenRecord.getOrDefault("revokeReason", "Share link access revoked by Chairman Directive"),
                    "message", "This 3D model share link was revoked by the Chairman."
            ));
        }

        // Check expiry
        long now = System.currentTimeMillis();
        long expiresAt = Long.parseLong(tokenRecord.getOrDefault("expiresAt", "-1").toString());
        if (expiresAt > 0 && now > expiresAt) {
            return ResponseEntity.status(410).body(Map.of(
                    "valid", false,
                    "status", "EXPIRED",
                    "expiresAt", expiresAt,
                    "message", "This blueprint share link has expired. Request a new active link from the project administrator."
            ));
        }

        // Increment access count & log access
        int currentCount = Integer.parseInt(tokenRecord.getOrDefault("accessCount", "0").toString()) + 1;
        tokenRecord.put("accessCount", currentCount);
        tokenRecord.put("lastAccessedAt", java.time.LocalDateTime.now().toString());

        Long did = Long.parseLong(tokenRecord.getOrDefault("drawingId", "0").toString());
        Map<String, Object> logEntry = new java.util.HashMap<>();
        logEntry.put("timestamp", java.time.LocalDateTime.now().toString());
        logEntry.put("clientIp", clientIp);
        logEntry.put("userAgent", userAgent != null && userAgent.length() > 60 ? userAgent.substring(0, 60) + "..." : userAgent);
        logEntry.put("token", token);
        logEntry.put("accessNumber", currentCount);

        ACCESS_LOGS.computeIfAbsent(did, k -> new java.util.concurrent.CopyOnWriteArrayList<>()).add(logEntry);

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("valid", true);
        response.put("status", "ACTIVE");
        response.put("tokenRecord", tokenRecord);
        response.put("accessCount", currentCount);
        response.put("expiresAtFormatted", tokenRecord.get("expiresAtFormatted"));

        if (tokenRecord.containsKey("aiAnalysisJson")) {
            response.put("aiAnalysisJson", tokenRecord.get("aiAnalysisJson"));
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/revoke-access")
    public ResponseEntity<?> revokeAccess(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String reason = (body != null && body.containsKey("reason"))
                ? body.get("reason")
                : "Terminated by Executive Chairman Directive (Structural Non-Compliance / Review Halt Order)";
        String revokedBy = (body != null && body.containsKey("revokedBy"))
                ? body.get("revokedBy")
                : "Chairman (Executive Board)";
        String timestamp = java.time.LocalDateTime.now().toString();

        Map<String, Object> revokeRecord = new java.util.HashMap<>();
        revokeRecord.put("drawingId", id);
        revokeRecord.put("reason", reason);
        revokeRecord.put("revokedBy", revokedBy);
        revokeRecord.put("revokedAt", timestamp);
        revokeRecord.put("status", "REVOKED");

        REVOKED_DRAWINGS.put(id, revokeRecord);

        // Also invalidate any active share tokens associated with this drawing
        SHARE_TOKENS.values().forEach(t -> {
            Long tid = Long.parseLong(t.getOrDefault("drawingId", "0").toString());
            if (tid.equals(id)) {
                t.put("isRevoked", true);
                t.put("revokedBy", revokedBy);
                t.put("revokeReason", reason);
            }
        });

        // Also update DrawingRecord status if exists
        try {
            drawingService.getDrawingById(id).ifPresent(d -> {
                d.setStatus("REVOKED");
                d.setRevisionNotes("REVOKED BY CHAIRMAN: " + reason);
                drawingService.saveDrawing(d);
            });
        } catch (Exception ignored) {}

        return ResponseEntity.ok(Map.of(
                "success", true,
                "drawingId", id,
                "status", "REVOKED",
                "revokedBy", revokedBy,
                "reason", reason,
                "timestamp", timestamp
        ));
    }

    @GetMapping("/{id}/access-tracking")
    public ResponseEntity<?> getAccessTracking(@PathVariable Long id) {
        List<Map<String, Object>> logs = ACCESS_LOGS.getOrDefault(id, List.of());
        boolean isRevoked = REVOKED_DRAWINGS.containsKey(id);
        Map<String, Object> revokeInfo = isRevoked ? REVOKED_DRAWINGS.get(id) : null;

        Map<String, Object> result = new java.util.HashMap<>();
        result.put("drawingId", id);
        result.put("totalViews", logs.size());
        result.put("isRevoked", isRevoked);
        result.put("revocationInfo", revokeInfo);
        result.put("logs", logs);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/quota/check")
    public ResponseEntity<?> checkQuota(
            @RequestParam(defaultValue = "public") String role,
            @RequestParam(required = false) String clientKey
    ) {
        String normalizedRole = role.toLowerCase().trim();
        boolean isOrgUser = !normalizedRole.equals("public") && !normalizedRole.equals("guest");

        Map<String, Object> res = new java.util.HashMap<>();
        res.put("role", normalizedRole);
        res.put("isOrganizationUser", isOrgUser);
        res.put("quotaType", isOrgUser ? "INFINITY" : "DAILY_3_LIMIT");
        res.put("dailyMax", isOrgUser ? -1 : 3);
        res.put("status", "ACTIVE");
        res.put("allowedRoles", List.of("client", "admin", "pm", "pd", "contractor", "senior-site-engineer", "chairman"));

        return ResponseEntity.ok(res);
    }
}
