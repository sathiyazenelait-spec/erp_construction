package com.buildcon.erp.controller;

import com.buildcon.erp.model.AuditLog;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping("/org/{orgId}")
    public ResponseEntity<List<AuditLog>> getLogs(@PathVariable Long orgId) {
        auditLogService.seedInitialLogs(orgId);
        List<AuditLog> logs = auditLogService.getLogsByOrg(orgId);
        return ResponseEntity.ok(logs);
    }

    @PostMapping
    public ResponseEntity<?> createLog(@RequestBody AuditLog log) {
        AuditLog saved = auditLogService.logAction(
            log.getAction(),
            log.getEntityName(),
            log.getEntityId(),
            log.getPerformedBy(),
            log.getUserRole(),
            log.getDetails(),
            log.getIpAddress(),
            log.getStatus(),
            log.getOrganizationId() != null ? log.getOrganizationId() : 1L
        );
        return ResponseEntity.ok(saved);
    }
}
