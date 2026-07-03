package com.buildcon.erp.controller;

import com.buildcon.erp.model.*;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.repository.SubcontractorContractRepository;
import com.buildcon.erp.repository.SubcontractorAttendanceRepository;
import com.buildcon.erp.repository.SubcontractorIndentRepository;
import com.buildcon.erp.repository.SubcontractorRepository;
import com.buildcon.erp.repository.OrganizationRepository;
import com.buildcon.erp.repository.ProjectRepository;
import com.buildcon.erp.service.SubcontractorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/subcontractor")
public class SubcontractorController {

    @Autowired
    private SubcontractorService service;

    @Autowired
    private SubcontractorContractRepository subcontractorContractRepository;

    @Autowired
    private SubcontractorAttendanceRepository subcontractorAttendanceRepository;

    @Autowired
    private SubcontractorIndentRepository subcontractorIndentRepository;

    @Autowired
    private SubcontractorRepository subcontractorRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        Subcontractor res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
    }

    private void seedSubcontractorData(Long orgId) {
        // Seed default contracts
        subcontractorContractRepository.save(new SubcontractorContract("CON-301", "Foundation RCC Concreting", 100, 3500000.0, 3500000.0, "Completed", orgId, 1L));
        subcontractorContractRepository.save(new SubcontractorContract("CON-302", "Tower B - Slab Framing & Rebar Placement", 75, 4500000.0, 3000000.0, "Active", orgId, 1L));
        subcontractorContractRepository.save(new SubcontractorContract("CON-303", "Masonry Brick Walls (1st - 5th Floor)", 40, 2500000.0, 800000.0, "Active", orgId, 1L));

        // Seed default attendance
        subcontractorAttendanceRepository.save(new SubcontractorAttendance(25, 15, 42, "09 June 2026", orgId, 1L));

        // Seed default indents
        subcontractorIndentRepository.save(new SubcontractorIndent("OPC 53 Cement (300 Bags)", "Approved & Released", "08 Jun 2026", orgId, 1L));
        subcontractorIndentRepository.save(new SubcontractorIndent("TMT Steel Ties (12mm, 5 Tons)", "Under Review", "09 Jun 2026", orgId, 1L));
    }

    @GetMapping("/dashboard/org/{orgId}")
    public ResponseEntity<?> getDashboard(@PathVariable Long orgId) {
        // Ensure Organization exists
        Optional<Organization> orgOpt = organizationRepository.findById(orgId);
        String orgName = "BuildWell";
        if (orgOpt.isEmpty()) {
            Organization newOrg = new Organization();
            newOrg.setId(orgId);
            newOrg.setName("BuildWell");
            organizationRepository.save(newOrg);
        } else {
            orgName = orgOpt.get().getName();
        }

        // Ensure Projects exist
        List<Project> projects = projectRepository.findByOrganizationId(orgId);
        if (projects.isEmpty()) {
            projectRepository.save(new Project("Skyline Residences", "Location A", 100000000.0, LocalDate.now(), LocalDate.now().plusYears(1), orgId));
            projectRepository.save(new Project("Greenfield Apartments", "Location B", 50000000.0, LocalDate.now(), LocalDate.now().plusYears(1), orgId));
            projects = projectRepository.findByOrganizationId(orgId);
        }

        List<SubcontractorContract> contracts = subcontractorContractRepository.findByOrganizationId(orgId);
        if (contracts.isEmpty()) {
            seedSubcontractorData(orgId);
            contracts = subcontractorContractRepository.findByOrganizationId(orgId);
        }

        List<SubcontractorAttendance> attendances = subcontractorAttendanceRepository.findByOrganizationId(orgId);
        List<SubcontractorIndent> indents = subcontractorIndentRepository.findByOrganizationId(orgId);

        // Resolve profile from subcontractor table
        List<Subcontractor> subs = subcontractorRepository.findByOrganizationId(orgId);
        String profileCompany = "Subcontractor Hub";
        String profileEmail   = "sub@buildcon.com";
        if (!subs.isEmpty()) {
            if (subs.get(0).getUsername() != null) profileCompany = subs.get(0).getUsername();
            if (subs.get(0).getEmail()    != null) profileEmail   = subs.get(0).getEmail();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("organizationName", orgName);
        response.put("projects", projects);
        response.put("contracts", contracts);
        response.put("attendances", attendances);
        response.put("indents", indents);
        response.put("profileCompany", profileCompany);
        response.put("profileEmail", profileEmail);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/attendance")
    public ResponseEntity<?> logAttendance(@RequestBody SubcontractorAttendance attendance) {
        SubcontractorAttendance saved = subcontractorAttendanceRepository.save(attendance);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/indent")
    public ResponseEntity<?> logIndent(@RequestBody SubcontractorIndent indent) {
        SubcontractorIndent saved = subcontractorIndentRepository.save(indent);
        return ResponseEntity.ok(saved);
    }

    // ── Profile Update ────────────────────────────────────────────────────────
    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload) {
        String orgIdStr = payload.get("organizationId");
        if (orgIdStr == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: organizationId is required."));
        }
        Long orgId = Long.parseLong(orgIdStr);
        String companyName = payload.get("companyName");
        String email       = payload.get("email");
        List<Subcontractor> subs = subcontractorRepository.findByOrganizationId(orgId);
        if (!subs.isEmpty()) {
            Subcontractor sub = subs.get(0);
            if (companyName != null && !companyName.isBlank()) sub.setUsername(companyName);
            if (email       != null && !email.isBlank())       sub.setEmail(email);
            subcontractorRepository.save(sub);
        }
        return ResponseEntity.ok(new MessageResponse("Profile updated successfully."));
    }

    @PostMapping("/ai-chat")
    public ResponseEntity<?> aiChat(@RequestBody Map<String, String> payload) {
        String msg = payload.get("message");
        String cleanMsg = msg != null ? msg.toLowerCase() : "";
        String response = "Hello Contractor! I help you track progress milestones, predict invoice certification lead times, and optimize material indents.";

        if (cleanMsg.contains("claim") || cleanMsg.contains("invoice")) {
            response = "Claim Status Update: CLM-1 (Tower B Slab) has been certified for ₹30.0 Lakhs. Next billing cycle closes in 4 days. Please ensure measurement sheets are uploaded.";
        } else if (cleanMsg.contains("indent") || cleanMsg.contains("material")) {
            response = "Indent Prediction: OPC 53 Cement (300 Bags) has been Approved & Released. TMT Steel Ties (12mm, 5 Tons) is Under Review by PM and is expected to be approved within 24 hours.";
        } else if (cleanMsg.contains("delay") || cleanMsg.contains("milestone")) {
            response = "Milestone Warning: Tower B framing progress stands at 75%. Delay in framing completion will shift masonry start dates by approximately 5 working days.";
        }

        return ResponseEntity.ok(Map.of("response", response));
    }
}

