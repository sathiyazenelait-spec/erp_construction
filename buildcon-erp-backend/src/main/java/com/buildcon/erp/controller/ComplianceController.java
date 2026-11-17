package com.buildcon.erp.controller;

import com.buildcon.erp.model.ComplianceRecord;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.ComplianceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/compliance")
public class ComplianceController {

    @Autowired
    private ComplianceService complianceService;

    @GetMapping("/org/{orgId}")
    public ResponseEntity<?> getDashboard(@PathVariable Long orgId) {
        List<ComplianceRecord> records = complianceService.getComplianceRecords(orgId);

        long total = records.size();
        long active = records.stream().filter(r -> "ACTIVE".equalsIgnoreCase(r.getStatus())).count();
        long expiringSoon = records.stream().filter(r -> "EXPIRING_SOON".equalsIgnoreCase(r.getStatus())).count();
        long expired = records.stream().filter(r -> "EXPIRED".equalsIgnoreCase(r.getStatus())).count();
        long renewalSubmitted = records.stream().filter(r -> "RENEWAL_SUBMITTED".equalsIgnoreCase(r.getStatus())).count();

        Map<String, Object> response = new HashMap<>();
        response.put("totalLicenses", total);
        response.put("activeLicenses", active);
        response.put("expiringSoon", expiringSoon);
        response.put("expiredLicenses", expired);
        response.put("renewalSubmitted", renewalSubmitted);
        response.put("complianceScorePercent", total > 0 ? Math.round(((double)(active + renewalSubmitted) / total) * 100.0) : 100);
        response.put("records", records);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/records")
    public ResponseEntity<?> addRecord(@RequestBody ComplianceRecord record) {
        ComplianceRecord saved = complianceService.saveComplianceRecord(record);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/records/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Status is required"));
        }
        Optional<ComplianceRecord> opt = complianceService.updateStatus(id, status);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Record not found with ID: " + id));
        }
        return ResponseEntity.ok(opt.get());
    }
}
