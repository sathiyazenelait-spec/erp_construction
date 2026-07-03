package com.buildcon.erp.controller;

import com.buildcon.erp.model.ProgressClaim;
import com.buildcon.erp.service.ProgressClaimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/progress-claims")
public class ProgressClaimController {

    @Autowired
    private ProgressClaimService service;

    @PostMapping
    public ResponseEntity<ProgressClaim> submitClaim(@RequestBody ProgressClaim claim) {
        return ResponseEntity.ok(service.submitClaim(claim));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ProgressClaim> approveClaim(@PathVariable Long id) {
        return ResponseEntity.ok(service.approveClaim(id));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ProgressClaim> rejectClaim(@PathVariable Long id) {
        return ResponseEntity.ok(service.rejectClaim(id));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<ProgressClaim> payClaim(@PathVariable Long id, @RequestParam String paymentReference) {
        return ResponseEntity.ok(service.payClaim(id, paymentReference));
    }

    @PostMapping("/{id}/hold")
    public ResponseEntity<ProgressClaim> holdClaim(@PathVariable Long id) {
        return ResponseEntity.ok(service.holdClaim(id));
    }

    @GetMapping
    public ResponseEntity<List<ProgressClaim>> getAllClaims() {
        return ResponseEntity.ok(service.getAllClaims());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProgressClaim>> getClaimsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(service.getClaimsByProject(projectId));
    }

    @GetMapping("/subcontractor/{subId}")
    public ResponseEntity<List<ProgressClaim>> getClaimsBySubcontractor(@PathVariable Long subId) {
        return ResponseEntity.ok(service.getClaimsBySubcontractor(subId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ProgressClaim>> getClaimsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(service.getClaimsByStatus(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgressClaim> getClaimById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getClaimById(id));
    }
}
