package com.buildcon.erp.controller;

import com.buildcon.erp.model.ProjectManager;
import com.buildcon.erp.model.Organization;
import com.buildcon.erp.model.Project;
import com.buildcon.erp.model.DashboardShellConfig;
import com.buildcon.erp.repository.ProjectManagerRepository;
import com.buildcon.erp.repository.DashboardShellConfigRepository;
import com.buildcon.erp.repository.OrganizationRepository;
import com.buildcon.erp.repository.ProjectRepository;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.ProjectManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/project-manager")
public class ProjectManagerController {

    @Autowired
    private ProjectManagerService service;

    @Autowired
    private ProjectManagerRepository projectManagerRepository;

    @Autowired
    private DashboardShellConfigRepository dashboardShellConfigRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        ProjectManager res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
    }

    private String currentHeaderDate() {
        return java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy, EEEE"));
    }

    private void seedPMData(Long orgId) {
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-manager", "header_date", currentHeaderDate(), orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-manager", "sidebar_menus", "Executive Summary|Project Command Center|Project Timeline|Budget Monitoring|Client Management|BOQ Tracking|Progress Monitoring|Subcontractor Management|Change Orders|Risk Center|Document Control|Approval Center|Pre-Project AI Estimator|AI Project Assistant|Settings", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-manager", "ai_suggestions", "Predict completion date.|Which subcontractor is underperforming?|Budget overrun forecast.", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-manager", "project_value", "₹12.5 Cr", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-manager", "progress", "64%", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-manager", "budget_used", "58%", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-manager", "profit_margin", "18%", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-manager", "pending_approvals", "12", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-manager", "delay_risk", "Low", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-manager", "budget_value_project", "₹12,50,00,000", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-manager", "budget_value_approved", "₹10,00,00,000", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-manager", "budget_value_actual", "₹7,25,00,000", orgId));
    }

    @GetMapping("/dashboard/org/{orgId}")
    public ResponseEntity<?> getDashboard(@PathVariable Long orgId) {
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

        String profileName = "Ramanathan S.";
        String profileEmail = "pm@buildcon.com";
        String avatarInitials = "RS";
        java.util.List<ProjectManager> pmUsers = projectManagerRepository.findByOrganizationId(orgId);
        if (!pmUsers.isEmpty()) {
            ProjectManager pm = pmUsers.get(0);
            profileName = pm.getUsername();
            profileEmail = pm.getEmail();
            avatarInitials = pm.getAvatarInitials();
            if (avatarInitials == null || avatarInitials.isBlank()) {
                String initials = java.util.Arrays.stream(pm.getUsername().split(" "))
                    .filter(n -> !n.isEmpty())
                    .map(n -> String.valueOf(n.charAt(0)))
                    .collect(java.util.stream.Collectors.joining(""))
                    .toUpperCase();
                if (initials.length() > 2) {
                    initials = initials.substring(0, 2);
                }
                avatarInitials = initials.isEmpty() ? "PM" : initials;
                pm.setAvatarInitials(avatarInitials);
                projectManagerRepository.save(pm);
            }
        }

        java.util.List<Project> projects = projectRepository.findByOrganizationId(orgId);
        if (projects.isEmpty()) {
            projectRepository.save(new Project("Skyline Residences", "Location A", 100000000.0, java.time.LocalDate.now(), java.time.LocalDate.now().plusYears(1), orgId));
            projectRepository.save(new Project("Greenfield Apartments", "Location B", 50000000.0, java.time.LocalDate.now(), java.time.LocalDate.now().plusYears(1), orgId));
            projects = projectRepository.findByOrganizationId(orgId);
        }

        java.util.List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "project-manager");
        if (configs.isEmpty()) {
            seedPMData(orgId);
            configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "project-manager");
        } else {
            for (DashboardShellConfig c : configs) {
                if ("header_date".equals(c.getConfigKey())) {
                    c.setConfigValue(currentHeaderDate());
                    dashboardShellConfigRepository.save(c);
                }
            }
        }

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("organizationName", orgName);
        response.put("profileName", profileName);
        response.put("profileEmail", profileEmail);
        response.put("avatarInitials", avatarInitials);
        response.put("projects", projects);

        for (DashboardShellConfig c : configs) {
            response.put(c.getConfigKey(), c.getConfigValue());
        }

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody java.util.Map<String, String> payload) {
        String username = payload.get("username");
        String email = payload.get("email");
        Long orgId = payload.containsKey("organizationId") ? Long.parseLong(payload.get("organizationId")) : null;

        if (orgId == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: organizationId is required."));
        }

        java.util.List<ProjectManager> pmUsers = projectManagerRepository.findByOrganizationId(orgId);
        if (!pmUsers.isEmpty()) {
            ProjectManager pm = pmUsers.get(0);
            if (username != null && !username.isBlank()) pm.setUsername(username);
            if (email != null && !email.isBlank()) pm.setEmail(email);
            String avatarInitials = payload.get("avatarInitials");
            if (avatarInitials != null && !avatarInitials.isBlank()) pm.setAvatarInitials(avatarInitials);
            projectManagerRepository.save(pm);
        }

        String[] configKeys = {
            "sidebar_menus", "ai_suggestions", "project_value", "progress", "budget_used",
            "profit_margin", "pending_approvals", "delay_risk", "budget_value_project",
            "budget_value_approved", "budget_value_actual"
        };

        for (String key : configKeys) {
            String val = payload.get(key);
            if (val != null && !val.isBlank()) {
                java.util.List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "project-manager");
                boolean found = false;
                for (DashboardShellConfig c : configs) {
                    if (c.getConfigKey().equals(key)) {
                        c.setConfigValue(val);
                        dashboardShellConfigRepository.save(c);
                        found = true;
                    }
                }
                if (!found) {
                    dashboardShellConfigRepository.save(new DashboardShellConfig("project-manager", key, val, orgId));
                }
            }
        }

        return ResponseEntity.ok(new MessageResponse("Configurations updated successfully."));
    }

    @PostMapping("/ai-chat")
    public ResponseEntity<?> aiChat(@RequestBody java.util.Map<String, String> payload) {
        String msg = payload.get("message");
        String orgIdStr = payload.get("organizationId");

        String profileName = "Project Manager";
        if (orgIdStr != null) {
            try {
                Long orgId = Long.parseLong(orgIdStr);
                java.util.List<ProjectManager> pmUsers = projectManagerRepository.findByOrganizationId(orgId);
                if (!pmUsers.isEmpty()) {
                    profileName = pmUsers.get(0).getUsername();
                }
            } catch (NumberFormatException ignored) {}
        }

        if (msg != null) {
            try {
                java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
                java.util.Map<String, Object> reqBody = java.util.Map.of(
                    "message", msg,
                    "role", "project-manager",
                    "profileName", profileName,
                    "organizationId", orgIdStr != null ? orgIdStr : ""
                );
                
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                String jsonReq = mapper.writeValueAsString(reqBody);
                
                java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("http://localhost:8001/api/ai/generic-chat"))
                    .header("Content-Type", "application/json")
                    .header("X-API-Key", "BuildconERPSecretKeyForSecurityAuthenticationJWT")
                    .POST(java.net.http.HttpRequest.BodyPublishers.ofString(jsonReq))
                    .build();
                
                java.net.http.HttpResponse<String> response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() == 200) {
                    java.util.Map<String, Object> resMap = mapper.readValue(response.body(), java.util.Map.class);
                    return ResponseEntity.ok(resMap);
                }
            } catch (Exception e) {
                System.out.println("Error calling generic AI chat service: " + e.getMessage());
            }
        }

        return ResponseEntity.ok(java.util.Map.of("response", "I will look into the project details. Please select one of the queries on the right."));
    }
}
