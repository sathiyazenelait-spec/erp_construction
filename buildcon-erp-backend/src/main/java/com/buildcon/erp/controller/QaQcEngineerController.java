package com.buildcon.erp.controller;

import com.buildcon.erp.model.*;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.repository.*;
import com.buildcon.erp.security.services.UserDetailsImpl;
import com.buildcon.erp.service.QaQcEngineerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping({"/api/qa-qc", "/api/qa-qc-engineer"})
public class QaQcEngineerController {

    @Autowired
    private QaQcEngineerService service;

    @Autowired
    private QaQcEngineerRepository qaQcEngineerRepository;

    @Autowired
    private QaQcInspectionRepository inspectionRepository;

    @Autowired
    private QaQcNcrRepository ncrRepository;

    @Autowired
    private QaQcMaterialTestRepository materialTestRepository;

    @Autowired
    private QaQcSafetyAuditRepository safetyAuditRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private DashboardShellConfigRepository dashboardShellConfigRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        QaQcEngineer res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("QA/QC Engineer registered successfully with ID: " + res.getId()));
    }

    @GetMapping("/dashboard/org/{orgId}")
    public ResponseEntity<?> getDashboard(@PathVariable Long orgId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(orgId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }

        // Ensure organization exists
        Optional<Organization> orgOpt = organizationRepository.findById(orgId);
        String orgName = "BuildWell Constructions";
        if (orgOpt.isEmpty()) {
            Organization newOrg = new Organization();
            newOrg.setId(orgId);
            newOrg.setName(orgName);
            organizationRepository.save(newOrg);
        } else {
            orgName = orgOpt.get().getName();
        }

        // Profile details
        String profileName = "R. Senthil Nathan (QA/QC Head)";
        String profileEmail = "qaqc@buildcon.com";
        String avatarInitials = "SN";
        List<QaQcEngineer> users = qaQcEngineerRepository.findByOrganizationId(orgId);
        if (!users.isEmpty()) {
            QaQcEngineer u = users.get(0);
            profileName = u.getUsername();
            profileEmail = u.getEmail();
            avatarInitials = u.getAvatarInitials() != null && !u.getAvatarInitials().isBlank() ? u.getAvatarInitials() : "QA";
        }

        // Seed data if empty
        service.seedQaQcData(orgId);

        List<QaQcInspection> inspections = inspectionRepository.findByOrganizationId(orgId);
        List<QaQcNcr> ncrs = ncrRepository.findByOrganizationId(orgId);
        List<QaQcMaterialTest> materialTests = materialTestRepository.findByOrganizationId(orgId);
        List<QaQcSafetyAudit> safetyAudits = safetyAuditRepository.findByOrganizationId(orgId);

        // Calculate KPI summary
        long totalInspections = inspections.size();
        long passedInspections = inspections.stream().filter(i -> "PASSED".equalsIgnoreCase(i.getStatus())).count();
        double passRate = totalInspections > 0 ? (double) passedInspections / totalInspections * 100.0 : 100.0;

        long openNcrs = ncrs.stream().filter(n -> "OPEN".equalsIgnoreCase(n.getStatus()) || "UNDER_REVIEW".equalsIgnoreCase(n.getStatus())).count();
        long closedNcrs = ncrs.stream().filter(n -> "CLOSED".equalsIgnoreCase(n.getStatus()) || "RECTIFIED".equalsIgnoreCase(n.getStatus())).count();

        long passMaterialTests = materialTests.stream().filter(t -> "PASS".equalsIgnoreCase(t.getResult())).count();

        Map<String, Object> response = new HashMap<>();
        response.put("organizationName", orgName);
        response.put("profileName", profileName);
        response.put("profileEmail", profileEmail);
        response.put("avatarInitials", avatarInitials);
        response.put("totalInspections", totalInspections);
        response.put("passRate", Math.round(passRate * 10.0) / 10.0);
        response.put("openNcrs", openNcrs);
        response.put("closedNcrs", closedNcrs);
        response.put("passMaterialTests", passMaterialTests);
        response.put("totalMaterialTests", materialTests.size());
        response.put("inspections", inspections);
        response.put("ncrs", ncrs);
        response.put("materialTests", materialTests);
        response.put("safetyAudits", safetyAudits);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/inspections")
    public ResponseEntity<?> addInspection(@RequestBody QaQcInspection inspection) {
        if (inspection.getInspectionDate() == null) {
            inspection.setInspectionDate(LocalDate.now());
        }
        if (inspection.getInspectionCode() == null || inspection.getInspectionCode().isBlank()) {
            inspection.setInspectionCode("INSP-" + (System.currentTimeMillis() % 10000));
        }
        QaQcInspection saved = inspectionRepository.save(inspection);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/ncrs")
    public ResponseEntity<?> createNcr(@RequestBody QaQcNcr ncr) {
        if (ncr.getNcrNumber() == null || ncr.getNcrNumber().isBlank()) {
            ncr.setNcrNumber("NCR-" + LocalDate.now().getYear() + "-" + (System.currentTimeMillis() % 1000));
        }
        if (ncr.getStatus() == null) {
            ncr.setStatus("OPEN");
        }
        QaQcNcr saved = ncrRepository.save(ncr);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/ncrs/{id}/status")
    public ResponseEntity<?> updateNcrStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<QaQcNcr> opt = ncrRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("NCR not found with id: " + id));
        }
        QaQcNcr ncr = opt.get();
        if (payload.containsKey("status")) {
            ncr.setStatus(payload.get("status"));
            if ("CLOSED".equalsIgnoreCase(ncr.getStatus()) || "RECTIFIED".equalsIgnoreCase(ncr.getStatus())) {
                ncr.setResolvedDate(LocalDate.now());
            }
        }
        if (payload.containsKey("correctiveAction")) {
            ncr.setCorrectiveAction(payload.get("correctiveAction"));
        }
        QaQcNcr updated = ncrRepository.save(ncr);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/material-tests")
    public ResponseEntity<?> addMaterialTest(@RequestBody QaQcMaterialTest test) {
        if (test.getTestedDate() == null) {
            test.setTestedDate(LocalDate.now());
        }
        if (test.getTestCode() == null || test.getTestCode().isBlank()) {
            test.setTestCode("TEST-" + (System.currentTimeMillis() % 10000));
        }
        QaQcMaterialTest saved = materialTestRepository.save(test);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/safety-audits")
    public ResponseEntity<?> addSafetyAudit(@RequestBody QaQcSafetyAudit audit) {
        if (audit.getAuditDate() == null) {
            audit.setAuditDate(LocalDate.now());
        }
        if (audit.getAuditCode() == null || audit.getAuditCode().isBlank()) {
            audit.setAuditCode("AUD-" + (System.currentTimeMillis() % 1000));
        }
        QaQcSafetyAudit saved = safetyAuditRepository.save(audit);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> payload) {
        String username = (String) payload.get("username");
        String email = (String) payload.get("email");
        Long orgId = payload.get("organizationId") != null ? Long.valueOf(payload.get("organizationId").toString()) : null;

        if (orgId != null) {
            List<QaQcEngineer> users = qaQcEngineerRepository.findByOrganizationId(orgId);
            if (!users.isEmpty()) {
                QaQcEngineer u = users.get(0);
                if (username != null && !username.isBlank()) u.setUsername(username);
                if (email != null && !email.isBlank()) u.setEmail(email);
                qaQcEngineerRepository.save(u);
                return ResponseEntity.ok(new MessageResponse("Profile updated successfully in MySQL."));
            }
        }
        return ResponseEntity.ok(new MessageResponse("Profile settings saved."));
    }

    @PostMapping("/ai-chat")
    public ResponseEntity<?> aiChat(@RequestBody Map<String, Object> payload) {
        String message = (String) payload.get("message");
        if (message == null) message = "";
        String clean = message.toLowerCase();

        String response;
        if (clean.contains("ncr") || clean.contains("defect")) {
            response = "Quality Audit Summary: 1 Critical NCR (Aggregate Flakiness 34%) was quarantined. Shear wall honeycombing (NCR-2026-001) is under micro-concrete grouting repair. Total open defect count: 2.";
        } else if (clean.contains("concrete") || clean.contains("cube") || clean.contains("slump")) {
            response = "Concrete Quality Standards: Grade M35 target strength is 43.25 MPa at 28 days. Recommended slump for pumped RCC slabs is 120-150mm. Strictly verify batching water-cement ratio at <= 0.42.";
        } else if (clean.contains("rebar") || clean.contains("steel") || clean.contains("tensile")) {
            response = "Steel Rebar Fe500D Compliance: Latest batch test TEST-801 yielded 542 N/mm² (passed threshold 500 N/mm²). Ensure lap splices are staggered by 1.3 times lap length and never located in high tension zones.";
        } else if (clean.contains("safety") || clean.contains("ppe")) {
            response = "Safety Compliance Status: Site PPE compliance rate is 96%. All workers on perimeter scaffolds above 15m must clip dual-lanyard harnesses to certified static wirelines.";
        } else {
            response = "Hello Quality Engineer! I am your AI QA/QC Assistant. I inspect test certifications (IS/ASTM/AASHTO), analyze concrete compression & steel yield trends, and guide ISO 9001 non-conformance root-cause resolutions.";
        }

        Map<String, String> res = new HashMap<>();
        res.put("response", response);
        return ResponseEntity.ok(res);
    }
}

