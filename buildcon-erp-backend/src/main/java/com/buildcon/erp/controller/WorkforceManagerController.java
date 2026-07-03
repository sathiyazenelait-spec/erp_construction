package com.buildcon.erp.controller;

import com.buildcon.erp.model.*;
import com.buildcon.erp.repository.*;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.WorkforceManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.buildcon.erp.security.services.UserDetailsImpl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/workforce-manager")
public class WorkforceManagerController {

    @Autowired private WorkforceManagerService service;
    @Autowired private WorkforceManagerRepository workforceManagerRepository;
    @Autowired private WorkerRepository workerRepository;
    @Autowired private OrganizationRepository organizationRepository;
    @Autowired private ProjectRepository projectRepository;
    @Autowired private WmHeadcountAuditRepository wmHeadcountAuditRepository;
    @Autowired private WmAttendanceTrendRepository wmAttendanceTrendRepository;
    @Autowired private DashboardShellConfigRepository dashboardShellConfigRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        WorkforceManager res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private String currentHeaderDate() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy, EEEE"));
    }

    private synchronized String generateWorkerId() {
        long count = workerRepository.count();
        return String.format("WRK-%03d", count + 1);
    }

    // ── Dashboard endpoint ────────────────────────────────────────────────────
    @GetMapping("/dashboard/org/{orgId}")
    public ResponseEntity<?> getDashboard(@PathVariable Long orgId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(orgId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }

        // Organization name from DB
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

        // Profile name & email from workforce_manager table
        String profileName  = "Workforce Manager";
        String profileEmail = "workforce@buildcon.com";
        List<WorkforceManager> wmUsers = workforceManagerRepository.findByOrganizationId(orgId);
        if (!wmUsers.isEmpty()) {
            profileName  = wmUsers.get(0).getUsername();
            profileEmail = wmUsers.get(0).getEmail();
        }

        // Projects
        List<Project> projects = projectRepository.findByOrganizationId(orgId);
        if (projects.isEmpty()) {
            projectRepository.save(new Project("Skyline Residences",   "Location A", 100000000.0, LocalDate.now(), LocalDate.now().plusYears(1), orgId));
            projectRepository.save(new Project("Greenfield Apartments","Location B",  50000000.0, LocalDate.now(), LocalDate.now().plusYears(1), orgId));
            projects = projectRepository.findByOrganizationId(orgId);
        }

        // Headcount Audits
        List<WmHeadcountAudit> audits = wmHeadcountAuditRepository.findByOrganizationId(orgId);
        if (audits.isEmpty()) {
            service.seedWorkforceData(orgId);
            audits = wmHeadcountAuditRepository.findByOrganizationId(orgId);
        }

        // Attendance Trends
        List<WmAttendanceTrend> trends = wmAttendanceTrendRepository.findByOrganizationId(orgId);

        // Workers
        List<Worker> workers = workerRepository.findByOrganizationId(orgId);
        if (workers.isEmpty()) {
            workerRepository.save(new Worker(generateWorkerId(), "Ramesh Kumar",  "9876543210", "4532-8765-1092", "Subcontractor Hub", "Mason",       "Verified",             true,  orgId));
            workerRepository.save(new Worker(generateWorkerId(), "Murugan Swamy", "8765432109", "9812-7634-9012", "Subcontractor Hub", "Labourer",    "Verified",             true,  orgId));
            workerRepository.save(new Worker(generateWorkerId(), "Shankar Das",   "7654321098", "1098-2345-6712", "Subcontractor Hub", "Carpenter",   "Pending Verification", false, orgId));
            workerRepository.save(new Worker(generateWorkerId(), "Amit Sharma",   "9012345678", "7612-9834-0192", "Indo Builders",     "Electrician", "Verified",             true,  orgId));
            workerRepository.save(new Worker(generateWorkerId(), "Vicky Yadav",   "9988776655", "3490-1289-5634", "Indo Builders",     "Labourer",    "Unverified",           false, orgId));
            workers = workerRepository.findByOrganizationId(orgId);
        }

        // Compute Attendance Rate dynamically from headcount audit data
        int totalExpected = audits.stream().mapToInt(a -> a.getExpected() != null ? a.getExpected() : 0).sum();
        int totalActual   = audits.stream().mapToInt(a -> a.getActual()   != null ? a.getActual()   : 0).sum();
        int totalAbsent   = totalExpected - totalActual;
        double rate = totalExpected > 0 ? ((double) totalActual / totalExpected) * 100.0 : 0.0;
        String attendanceRateStr = String.format("%.1f%%", rate);

        // Shell configs — always refresh header_date to today
        List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "workforce");
        if (configs.isEmpty()) {
            dashboardShellConfigRepository.save(new DashboardShellConfig("workforce", "header_date", currentHeaderDate(), orgId));
            dashboardShellConfigRepository.save(new DashboardShellConfig("workforce", "sidebar_menus", "Workforce Overview|Worker Database|Headcount Audits|Payroll Integration|AI Workforce Planner|Settings", orgId));
            dashboardShellConfigRepository.save(new DashboardShellConfig("workforce", "guidelines",
                "The workforce manager is NOT directly responsible for salary processing, bank deposits, or cash handling." +
                "|Subcontractors are paid monthly based on their progress claims billing (certified by the Project Manager / Quantity Surveyor and processed by Finance & Accounts)." +
                "|Subcontractors pay their laborers directly in cash or bank transfer. The workforce database logs mobile numbers and attendance to cross-verify that subcontractors match headcount audits and safety limits.", orgId));
            dashboardShellConfigRepository.save(new DashboardShellConfig("workforce", "ai_suggestions", "Audit worker Aadhaar verification statuses.|Optimize critical path labor allocation.|Explain payroll integration rules.", orgId));
            configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "workforce");
        } else {
            for (DashboardShellConfig c : configs) {
                if ("header_date".equals(c.getConfigKey())) {
                    c.setConfigValue(currentHeaderDate());
                    dashboardShellConfigRepository.save(c);
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("organizationName", orgName);
        response.put("projects",   projects);
        response.put("audits",     audits);
        response.put("trends",     trends);
        response.put("workers",    workers);
        response.put("profileName",      profileName);
        response.put("profileEmail",     profileEmail);
        response.put("attendanceRate",   attendanceRateStr);
        response.put("absentCount",      totalAbsent);

        for (DashboardShellConfig c : configs) {
            response.put(c.getConfigKey(), c.getConfigValue());
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/workers/org/{orgId}")
    public ResponseEntity<?> getWorkersByOrg(@PathVariable Long orgId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(orgId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }
        return ResponseEntity.ok(workerRepository.findByOrganizationId(orgId));
    }

    // ── Register Worker with server-side ID ───────────────────────────────────
    @PostMapping("/workers")
    public ResponseEntity<?> registerWorker(@RequestBody Worker worker, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(worker.getOrganizationId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }
        worker.setWorkerId(generateWorkerId());
        if (worker.getVerificationStatus() == null || worker.getVerificationStatus().isEmpty()) {
            worker.setVerificationStatus("Pending Verification");
        }
        if (worker.getPhotoUploaded() == null) {
            worker.setPhotoUploaded(false);
        }
        return ResponseEntity.ok(workerRepository.save(worker));
    }

    // ── Profile Update ────────────────────────────────────────────────────────
    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String username = payload.get("username");
        String email    = payload.get("email");
        Long orgId = payload.containsKey("organizationId") ? Long.parseLong(payload.get("organizationId")) : null;

        if (orgId == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: organizationId is required."));
        }
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(orgId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }
        List<WorkforceManager> wmUsers = workforceManagerRepository.findByOrganizationId(orgId);
        if (!wmUsers.isEmpty()) {
            WorkforceManager wm = wmUsers.get(0);
            if (username != null && !username.isBlank()) wm.setUsername(username);
            if (email    != null && !email.isBlank())    wm.setEmail(email);
            workforceManagerRepository.save(wm);
        }

        String sidebarMenus = payload.get("sidebar_menus");
        if (sidebarMenus != null && !sidebarMenus.isBlank()) {
            List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "workforce");
            boolean found = false;
            for (DashboardShellConfig c : configs) {
                if ("sidebar_menus".equals(c.getConfigKey())) {
                    c.setConfigValue(sidebarMenus);
                    dashboardShellConfigRepository.save(c);
                    found = true;
                }
            }
            if (!found) {
                dashboardShellConfigRepository.save(new DashboardShellConfig("workforce", "sidebar_menus", sidebarMenus, orgId));
            }
        }

        String aiSuggestions = payload.get("ai_suggestions");
        if (aiSuggestions != null && !aiSuggestions.isBlank()) {
            List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "workforce");
            boolean found = false;
            for (DashboardShellConfig c : configs) {
                if ("ai_suggestions".equals(c.getConfigKey())) {
                    c.setConfigValue(aiSuggestions);
                    dashboardShellConfigRepository.save(c);
                    found = true;
                }
            }
            if (!found) {
                dashboardShellConfigRepository.save(new DashboardShellConfig("workforce", "ai_suggestions", aiSuggestions, orgId));
            }
        }

        return ResponseEntity.ok(new MessageResponse("Configurations updated successfully."));
    }

    // ── Submit Headcount Audit ────────────────────────────────────────────────
    @PostMapping("/headcount-audits")
    public ResponseEntity<?> submitHeadcountAudit(@RequestBody Map<String, Object> payload,
                                                   @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long orgId;
        try {
            orgId = Long.parseLong(payload.get("organizationId").toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: organizationId is required."));
        }
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(orgId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }
        String contractor = payload.getOrDefault("contractor", "").toString().trim();
        if (contractor.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: contractor name is required."));
        }
        int expected = 0, actual = 0;
        try { expected = Integer.parseInt(payload.getOrDefault("expected", "0").toString()); } catch (Exception ignored) {}
        try { actual   = Integer.parseInt(payload.getOrDefault("actual",   "0").toString()); } catch (Exception ignored) {}
        int variance = expected - actual;
        String status = Math.abs(variance) <= 2 ? "Verified" : "Variance Flagged";

        WmHeadcountAudit audit = new WmHeadcountAudit(contractor, expected, actual, variance, status, orgId);
        WmHeadcountAudit saved = wmHeadcountAuditRepository.save(audit);
        return ResponseEntity.ok(saved);
    }

    // ── Get Headcount Audits by org ───────────────────────────────────────────
    @GetMapping("/headcount-audits/org/{orgId}")
    public ResponseEntity<?> getHeadcountAudits(@PathVariable Long orgId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(orgId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }
        return ResponseEntity.ok(wmHeadcountAuditRepository.findByOrganizationId(orgId));
    }

    // ── AI Chat with dynamic profile name ─────────────────────────────────────
    @PostMapping("/ai-chat")
    public ResponseEntity<?> aiChat(@RequestBody Map<String, String> payload) {
        String msg      = payload.get("message");
        String orgIdStr = payload.get("organizationId");
        String cleanMsg = msg != null ? msg.toLowerCase() : "";

        String profileName = "Workforce Manager";
        if (orgIdStr != null) {
            try {
                Long orgId = Long.parseLong(orgIdStr);
                List<WorkforceManager> wmUsers = workforceManagerRepository.findByOrganizationId(orgId);
                if (!wmUsers.isEmpty()) profileName = wmUsers.get(0).getUsername();
            } catch (NumberFormatException ignored) {}
        }

        String response = "Hello " + profileName + "! I'm your AI Workforce Assistant. I audit contractor crew size compliance, flag verification anomalies, and help allocate labour based on schedule critical paths.";

        if (cleanMsg.contains("aadhaar") || cleanMsg.contains("verify") || cleanMsg.contains("audit")) {
            response = "Aadhaar Compliance Alert: Workers with 'Pending Verification' or 'Unverified' status have unsubmitted details or photo mismatches. Please prioritise their onboarding immediately.";
        } else if (cleanMsg.contains("allocation") || cleanMsg.contains("critical") || cleanMsg.contains("optimize")) {
            response = "Allocation Suggestion: Critical concrete pour planned for Tower A on Thursday. Recommend shifting 5 general labourers from excavation team to Concrete Specialist crew.";
        } else if (cleanMsg.contains("payroll") || cleanMsg.contains("subcontractor")) {
            response = "Payroll Notice: Attendance data is automatically mapped to Subcontractor Hub billing. Cash payments processed by contractors are cross-referenced with daily supervisor attendance checklists.";
        }

        return ResponseEntity.ok(Map.of("response", response));
    }
}
