package com.buildcon.erp.controller;

import com.buildcon.erp.model.ProjectAlert;
import com.buildcon.erp.service.ProjectAlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/alerts")
public class ProjectAlertController {

    @Autowired
    private ProjectAlertService service;

    @PostMapping
    public ResponseEntity<ProjectAlert> createAlert(@RequestBody ProjectAlert alert) {
        return ResponseEntity.ok(service.createAlert(alert));
    }

    @GetMapping("/org/{orgId}")
    public ResponseEntity<List<ProjectAlert>> getAlertsByOrganization(@PathVariable Long orgId) {
        return ResponseEntity.ok(service.getAlertsByOrganization(orgId));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProjectAlert>> getAlertsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(service.getAlertsByProject(projectId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectAlert> getAlertById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getAlertById(id));
    }

    @PutMapping("/{id}/justification")
    public ResponseEntity<ProjectAlert> submitJustification(@PathVariable Long id, @RequestBody String justification) {
        // Strip any wrapping quotes from request body if sent as plain text / JSON string
        if (justification != null && (justification.startsWith("\"") && justification.endsWith("\""))) {
            justification = justification.substring(1, justification.length() - 1);
        }
        return ResponseEntity.ok(service.submitJustification(id, justification));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<ProjectAlert> resolveAlert(@PathVariable Long id) {
        return ResponseEntity.ok(service.resolveAlert(id));
    }
}
