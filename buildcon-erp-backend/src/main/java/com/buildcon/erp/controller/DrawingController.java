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
}
