package com.buildcon.erp.controller;

import com.buildcon.erp.model.ProjectDirector;
import com.buildcon.erp.model.Organization;
import com.buildcon.erp.model.Project;
import com.buildcon.erp.model.DashboardShellConfig;
import com.buildcon.erp.repository.ProjectDirectorRepository;
import com.buildcon.erp.repository.DashboardShellConfigRepository;
import com.buildcon.erp.repository.OrganizationRepository;
import com.buildcon.erp.repository.ProjectRepository;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.ProjectDirectorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Arrays;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/project-director")
public class ProjectDirectorController {

    @Autowired
    private ProjectDirectorService service;

    @Autowired
    private ProjectDirectorRepository projectDirectorRepository;

    @Autowired
    private DashboardShellConfigRepository dashboardShellConfigRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        ProjectDirector res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
    }

    private String currentHeaderDate() {
        return java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy, EEEE"));
    }

    private void seedPDData(Long orgId) {
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-director", "header_date", currentHeaderDate(), orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-director", "sidebar_menus", "Portfolio Overview|Milestone Tracker|Budget Control|Engineering Insights|Procurement Pipeline|Safety Metrics|Quality Inspections|AI Project Assistant|Settings", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-director", "ai_suggestions", "Highlight commercial risks|Cities breakdown|Which projects are delayed?|Profitability forecast.", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-director", "total_projects", "18", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-director", "total_project_value", "₹138.6 Cr", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-director", "total_cost_incurred", "₹105.4 Cr", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-director", "average_progress", "56%", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("project-director", "overall_profit_margin", "12.8%", orgId));
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

        String profileName = "Arvind Menon";
        String profileEmail = "pd@buildcon.com";
        String avatarInitials = "AM";
        List<ProjectDirector> pdUsers = projectDirectorRepository.findByOrganizationId(orgId);
        if (!pdUsers.isEmpty()) {
            ProjectDirector pd = pdUsers.get(0);
            profileName = pd.getUsername();
            profileEmail = pd.getEmail();
            avatarInitials = pd.getAvatarInitials();
            if (avatarInitials == null || avatarInitials.isBlank()) {
                String initials = Arrays.stream(pd.getUsername().split(" "))
                    .filter(n -> !n.isEmpty())
                    .map(n -> String.valueOf(n.charAt(0)))
                    .collect(Collectors.joining(""))
                    .toUpperCase();
                if (initials.length() > 2) {
                    initials = initials.substring(0, 2);
                }
                avatarInitials = initials.isEmpty() ? "AM" : initials;
                pd.setAvatarInitials(avatarInitials);
                projectDirectorRepository.save(pd);
            }
        }

        List<Project> projects = projectRepository.findByOrganizationId(orgId);
        if (projects.isEmpty()) {
            projectRepository.save(new Project("Skyline Residences", "Location A", 100000000.0, java.time.LocalDate.now(), java.time.LocalDate.now().plusYears(1), orgId));
            projectRepository.save(new Project("Greenfield Apartments", "Location B", 50000000.0, java.time.LocalDate.now(), java.time.LocalDate.now().plusYears(1), orgId));
            projects = projectRepository.findByOrganizationId(orgId);
        }

        List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "project-director");
        if (configs.isEmpty()) {
            seedPDData(orgId);
            configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "project-director");
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
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String email = payload.get("email");
        Long orgId = payload.containsKey("organizationId") ? Long.parseLong(payload.get("organizationId")) : null;

        if (orgId == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: organizationId is required."));
        }

        List<ProjectDirector> pdUsers = projectDirectorRepository.findByOrganizationId(orgId);
        if (!pdUsers.isEmpty()) {
            ProjectDirector pd = pdUsers.get(0);
            if (username != null && !username.isBlank()) pd.setUsername(username);
            if (email != null && !email.isBlank()) pd.setEmail(email);
            String avatarInitials = payload.get("avatarInitials");
            if (avatarInitials != null && !avatarInitials.isBlank()) pd.setAvatarInitials(avatarInitials);
            projectDirectorRepository.save(pd);
        }

        String[] configKeys = {
            "sidebar_menus", "ai_suggestions", "total_projects", "total_project_value", "total_cost_incurred", "average_progress", "overall_profit_margin"
        };

        for (String key : configKeys) {
            String val = payload.get(key);
            if (val != null && !val.isBlank()) {
                List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "project-director");
                boolean found = false;
                for (DashboardShellConfig c : configs) {
                    if (c.getConfigKey().equals(key)) {
                        c.setConfigValue(val);
                        dashboardShellConfigRepository.save(c);
                        found = true;
                    }
                }
                if (!found) {
                    dashboardShellConfigRepository.save(new DashboardShellConfig("project-director", key, val, orgId));
                }
            }
        }

        return ResponseEntity.ok(new MessageResponse("Configurations updated successfully."));
    }

    @PostMapping("/ai-chat")
    public ResponseEntity<?> aiChat(@RequestBody Map<String, String> payload) {
        String msg = payload.get("message");
        String orgIdStr = payload.get("organizationId");
        String cleanMsg = msg != null ? msg.toLowerCase() : "";

        String profileName = "Project Director";
        if (orgIdStr != null) {
            try {
                Long orgId = Long.parseLong(orgIdStr);
                List<ProjectDirector> pdUsers = projectDirectorRepository.findByOrganizationId(orgId);
                if (!pdUsers.isEmpty()) {
                    profileName = pdUsers.get(0).getUsername();
                }
            } catch (NumberFormatException ignored) {}
        }

        if (msg != null) {
            try {
                java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
                Map<String, Object> reqBody = Map.of(
                    "message", msg,
                    "role", "project-director",
                    "profileName", profileName,
                    "organizationId", orgIdStr != null ? orgIdStr : ""
                );
                
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                String jsonReq = mapper.writeValueAsString(reqBody);
                
                java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://erp-construction-1-python.onrender.com/api/ai/generic-chat"))
                    .header("Content-Type", "application/json")
                    .header("X-API-Key", "BuildconERPSecretKeyForSecurityAuthenticationJWT")
                    .POST(java.net.http.HttpRequest.BodyPublishers.ofString(jsonReq))
                    .build();
                
                java.net.http.HttpResponse<String> response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() == 200) {
                    Map<String, Object> resMap = mapper.readValue(response.body(), Map.class);
                    return ResponseEntity.ok(resMap);
                }
            } catch (Exception e) {
                System.out.println("Error calling generic AI chat service: " + e.getMessage());
            }
        }

        String response = "Hello! I'm your AI Project Assistant. Arvind Menon, we are tracking 18 active projects. Average progress is 56% and overall profit margin is 12.8%.";
        if (cleanMsg.contains("risk") || cleanMsg.contains("delay")) {
            response = "Phoenix Commercial Complex is flagged with High Delay risk (78% probability, 45 projected delay days).";
        } else if (cleanMsg.contains("city") || cleanMsg.contains("location")) {
            response = "Projects locations distribution: Chennai (8), Coimbatore (4), Madurai (3), Trichy (2), Pondicherry (1).";
        }
        return ResponseEntity.ok(Map.of("response", response));
    }
}
