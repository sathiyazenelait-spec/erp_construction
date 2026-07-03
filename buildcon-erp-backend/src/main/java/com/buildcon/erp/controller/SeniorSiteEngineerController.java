package com.buildcon.erp.controller;

import com.buildcon.erp.model.*;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.repository.SseCubeTestRepository;
import com.buildcon.erp.repository.SseDrawingRepository;
import com.buildcon.erp.repository.SseNcrRepository;
import com.buildcon.erp.repository.OrganizationRepository;
import com.buildcon.erp.repository.ProjectRepository;
import com.buildcon.erp.service.SeniorSiteEngineerService;
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
@RequestMapping("/api/senior-site-engineer")
public class SeniorSiteEngineerController {

    @Autowired
    private SeniorSiteEngineerService service;

    @Autowired
    private SseCubeTestRepository sseCubeTestRepository;

    @Autowired
    private SseDrawingRepository sseDrawingRepository;

    @Autowired
    private SseNcrRepository sseNcrRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        SeniorSiteEngineer res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
    }

    private void seedSseData(Long orgId) {
        // Seed default Cube Tests
        sseCubeTestRepository.save(new SseCubeTest("CUB-401", "M30", "12 May 2026", "28 Days", 32.4, 30.0, "Pass", orgId));
        sseCubeTestRepository.save(new SseCubeTest("CUB-402", "M40", "15 May 2026", "28 Days", 42.8, 40.0, "Pass", orgId));
        sseCubeTestRepository.save(new SseCubeTest("CUB-403", "M30", "02 Jun 2026", "7 Days", 21.2, 20.0, "Pass", orgId));
        sseCubeTestRepository.save(new SseCubeTest("CUB-404", "M40", "05 Jun 2026", "7 Days", 18.5, 26.0, "Fail", orgId));
        sseCubeTestRepository.save(new SseCubeTest("CUB-405", "M30", "08 Jun 2026", "7 Days", 0.0, 20.0, "Pending", orgId));

        // Seed default CAD drawings
        sseDrawingRepository.save(new SseDrawing("DWG-101", "Tower A Structural Column Rebar Layout", "Structural", "Approved", orgId));
        sseDrawingRepository.save(new SseDrawing("DWG-102", "Tower B HVAC Duct Routing Plan", "MEP", "Clash Detected", orgId));
        sseDrawingRepository.save(new SseDrawing("DWG-103", "Ground Level Entrance Lobby Elevation", "Architectural", "Approved", orgId));
        sseDrawingRepository.save(new SseDrawing("DWG-104", "Basement Drainage and Riser Plumbing Layout", "MEP", "Under Revision", orgId));

        // Seed default NCRs
        sseNcrRepository.save(new SseNcr("NCR-2026-001", "M40 Concrete Compressive Deficit (Tower A columns)", "Slab concrete cast on June 5 failed Compaction Cube test limit (measured 18.5 N/mm² against required 26.0 N/mm²).", "09 Jun 2026", "Concrete Specialist Contractor", "Open / Under Inspection", orgId));
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

        List<SseCubeTest> cubeTests = sseCubeTestRepository.findByOrganizationId(orgId);
        if (cubeTests.isEmpty()) {
            seedSseData(orgId);
            cubeTests = sseCubeTestRepository.findByOrganizationId(orgId);
        }

        List<SseDrawing> drawings = sseDrawingRepository.findByOrganizationId(orgId);
        List<SseNcr> ncrs = sseNcrRepository.findByOrganizationId(orgId);

        Map<String, Object> response = new HashMap<>();
        response.put("organizationName", orgName);
        response.put("projects", projects);
        response.put("cubeTests", cubeTests);
        response.put("drawings", drawings);
        response.put("ncrs", ncrs);
        response.put("profileName", "Karthick Swaminathan");
        response.put("profileEmail", "senior-eng@buildcon.com");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/cube-test")
    public ResponseEntity<?> logCubeTest(@RequestBody SseCubeTest test) {
        SseCubeTest saved = sseCubeTestRepository.save(test);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/ai-chat")
    public ResponseEntity<?> aiChat(@RequestBody Map<String, String> payload) {
        String msg = payload.get("message");
        String cleanMsg = msg != null ? msg.toLowerCase() : "";
        String response = "I am processing quality compliance sheets. Cube test success rate stands at 91.6%.";

        if (cleanMsg.contains("cube") || cleanMsg.contains("strength") || cleanMsg.contains("audit")) {
            response = "Concrete Quality Alert: Cube test CUB-404 (Grade M40, 7 Days age) achieved 18.5 N/mm² vs required 26.0 N/mm² target. This marks a significant strength deficit. Recommend checking water-cement ratio logs.";
        } else if (cleanMsg.contains("clash") || cleanMsg.contains("drawing")) {
            response = "Blueprint Conflict: DWG-102 HVAC Duct Routing Plan clashes with main structural beam structural anchors in Tower B (Sector 3). Re-routing recommended to avoid Core cuts.";
        } else if (cleanMsg.contains("ncr") || cleanMsg.contains("conformity")) {
            response = "NCR Report Needed: Cube test fail on CUB-404 requires a formal Non-Conformity Report issued to the Concrete Specialist Subcontractor.";
        }

        return ResponseEntity.ok(Map.of("response", response));
    }
}

