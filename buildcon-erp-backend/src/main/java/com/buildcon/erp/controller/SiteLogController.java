package com.buildcon.erp.controller;

import com.buildcon.erp.model.DailyLog;
import com.buildcon.erp.model.SafetyChecklistItem;
import com.buildcon.erp.model.MaterialRequest;
import com.buildcon.erp.repository.DailyLogRepository;
import com.buildcon.erp.repository.SafetyChecklistItemRepository;
import com.buildcon.erp.repository.MaterialRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/site")
public class SiteLogController {

    @Autowired
    private DailyLogRepository dailyLogRepository;

    @Autowired
    private SafetyChecklistItemRepository safetyChecklistItemRepository;

    @Autowired
    private MaterialRequestRepository materialRequestRepository;

    // Daily Logs
    @GetMapping("/logs/{projectId}")
    public ResponseEntity<List<DailyLog>> getDailyLogs(@PathVariable Long projectId) {
        return ResponseEntity.ok(dailyLogRepository.findByProjectId(projectId));
    }

    @PostMapping("/logs/{projectId}")
    public ResponseEntity<DailyLog> addDailyLog(@PathVariable Long projectId, @RequestBody DailyLog dailyLog) {
        dailyLog.setProjectId(projectId);
        return ResponseEntity.ok(dailyLogRepository.save(dailyLog));
    }

    // Safety Audits / Checklist
    @GetMapping("/safety/{projectId}")
    public ResponseEntity<List<SafetyChecklistItem>> getSafetyChecklist(@PathVariable Long projectId) {
        List<SafetyChecklistItem> items = safetyChecklistItemRepository.findByProjectId(projectId);
        if (items.isEmpty()) {
            // Seed default safety rules for this project
            safetyChecklistItemRepository.save(new SafetyChecklistItem(projectId, "S-01", "All crew members wearing ISI helmets and steel-toe safety boots", true));
            safetyChecklistItemRepository.save(new SafetyChecklistItem(projectId, "S-02", "Scaffolding scaffolding anchoring rings verified & tagged green", true));
            safetyChecklistItemRepository.save(new SafetyChecklistItem(projectId, "S-03", "Temporary electrical grounding boxes and cables fully insulated", false));
            safetyChecklistItemRepository.save(new SafetyChecklistItem(projectId, "S-04", "Safety netting deployed around high-rise slab edges on Tower B", true));
            items = safetyChecklistItemRepository.findByProjectId(projectId);
        }
        return ResponseEntity.ok(items);
    }

    @PutMapping("/safety/{projectId}/item/{ruleId}")
    public ResponseEntity<SafetyChecklistItem> toggleSafetyItem(@PathVariable Long projectId, @PathVariable String ruleId) {
        SafetyChecklistItem item = safetyChecklistItemRepository.findByProjectIdAndRuleId(projectId, ruleId)
                .orElseThrow(() -> new RuntimeException("Safety checklist item not found"));
        item.setChecked(!item.getChecked());
        return ResponseEntity.ok(safetyChecklistItemRepository.save(item));
    }

    // Material Requests
    @GetMapping("/material-requests/{projectId}")
    public ResponseEntity<List<MaterialRequest>> getMaterialRequests(@PathVariable Long projectId) {
        return ResponseEntity.ok(materialRequestRepository.findByProjectId(projectId));
    }

    @PostMapping("/material-requests/{projectId}")
    public ResponseEntity<MaterialRequest> addMaterialRequest(@PathVariable Long projectId, @RequestBody MaterialRequest request) {
        request.setProjectId(projectId);
        return ResponseEntity.ok(materialRequestRepository.save(request));
    }

    // ── Update Material Request Status (Approve / Reject) ─────────────────────
    @PutMapping("/material-requests/{id}/status")
    public ResponseEntity<?> updateMaterialRequestStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        Optional<MaterialRequest> opt = materialRequestRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Material request not found with id: " + id);
        }
        String newStatus = payload.get("status");
        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().body("Status field is required. Valid values: Approved, Rejected, Pending");
        }
        MaterialRequest req = opt.get();
        req.setStatus(newStatus);
        return ResponseEntity.ok(materialRequestRepository.save(req));
    }
}

