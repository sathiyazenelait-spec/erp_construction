package com.buildcon.erp.controller;

import com.buildcon.erp.model.BusinessDirector;
import com.buildcon.erp.model.Organization;
import com.buildcon.erp.model.Project;
import com.buildcon.erp.model.DashboardShellConfig;
import com.buildcon.erp.repository.BusinessDirectorRepository;
import com.buildcon.erp.repository.DashboardShellConfigRepository;
import com.buildcon.erp.repository.OrganizationRepository;
import com.buildcon.erp.repository.ProjectRepository;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.BusinessDirectorService;
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
@RequestMapping("/api/business-director")
public class BusinessDirectorController {

    @Autowired
    private BusinessDirectorService service;

    @Autowired
    private BusinessDirectorRepository businessDirectorRepository;

    @Autowired
    private DashboardShellConfigRepository dashboardShellConfigRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        BusinessDirector res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
    }

    private String currentHeaderDate() {
        return java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy, EEEE"));
    }

    private void seedBDData(Long orgId) {
        dashboardShellConfigRepository.save(new DashboardShellConfig("business-director", "header_date", currentHeaderDate(), orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("business-director", "sidebar_menus", "Dashboard|Leads Management|Opportunities|Tenders|Clients & CRM|Marketing Analytics|Sales Pipeline|Proposals|Competitor Analysis|Reports & Analytics|AI Sales Assistant|Targets & Incentives|Team Performance|Settings", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("business-director", "ai_suggestions", "Best converting channel?|Leads likely to close|Forecast next month sales|Win-loss ratio analysis.", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("business-director", "total_leads", "1,250", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("business-director", "qualified_leads", "520", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("business-director", "proposals_sent", "180", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("business-director", "projects_won", "42", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("business-director", "pipeline_value", "₹124.8 Cr", orgId));
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

        String profileName = "Rajesh Verma";
        String profileEmail = "bd@buildcon.com";
        String avatarInitials = "RV";
        String currentUsername = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<BusinessDirector> bdOpt = businessDirectorRepository.findByUsername(currentUsername);
        if (bdOpt.isPresent()) {
            BusinessDirector bd = bdOpt.get();
            profileName = bd.getUsername();
            profileEmail = bd.getEmail();
            avatarInitials = bd.getAvatarInitials();
            if (avatarInitials == null || avatarInitials.isBlank()) {
                String initials = Arrays.stream(bd.getUsername().split(" "))
                    .filter(n -> !n.isEmpty())
                    .map(n -> String.valueOf(n.charAt(0)))
                    .collect(Collectors.joining(""))
                    .toUpperCase();
                if (initials.length() > 2) {
                    initials = initials.substring(0, 2);
                }
                avatarInitials = initials.isEmpty() ? "RV" : initials;
                bd.setAvatarInitials(avatarInitials);
                businessDirectorRepository.save(bd);
            }
        }

        List<Project> projects = projectRepository.findByOrganizationId(orgId);
        if (projects.isEmpty()) {
            projectRepository.save(new Project("Skyline Residences", "Location A", 100000000.0, java.time.LocalDate.now(), java.time.LocalDate.now().plusYears(1), orgId));
            projectRepository.save(new Project("Greenfield Apartments", "Location B", 50000000.0, java.time.LocalDate.now(), java.time.LocalDate.now().plusYears(1), orgId));
            projects = projectRepository.findByOrganizationId(orgId);
        }

        List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "business-director");
        if (configs.isEmpty()) {
            seedBDData(orgId);
            configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "business-director");
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

        String currentUsername = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<BusinessDirector> bdOpt = businessDirectorRepository.findByUsername(currentUsername);
        if (bdOpt.isPresent()) {
            BusinessDirector bd = bdOpt.get();
            if (username != null && !username.isBlank()) bd.setUsername(username);
            if (email != null && !email.isBlank()) bd.setEmail(email);
            String avatarInitials = payload.get("avatarInitials");
            if (avatarInitials != null && !avatarInitials.isBlank()) bd.setAvatarInitials(avatarInitials);
            businessDirectorRepository.save(bd);
        }

        String[] configKeys = {
            "sidebar_menus", "ai_suggestions", "total_leads", "qualified_leads", "proposals_sent", "projects_won", "pipeline_value"
        };

        for (String key : configKeys) {
            String val = payload.get(key);
            if (val != null && !val.isBlank()) {
                List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "business-director");
                boolean found = false;
                for (DashboardShellConfig c : configs) {
                    if (c.getConfigKey().equals(key)) {
                        c.setConfigValue(val);
                        dashboardShellConfigRepository.save(c);
                        found = true;
                    }
                }
                if (!found) {
                    dashboardShellConfigRepository.save(new DashboardShellConfig("business-director", key, val, orgId));
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

        String profileName = "Business Director";
        if (orgIdStr != null) {
            try {
                Long orgId = Long.parseLong(orgIdStr);
                String currentUsername = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
                Optional<BusinessDirector> bdOpt = businessDirectorRepository.findByUsername(currentUsername);
                if (bdOpt.isPresent()) {
                    profileName = bdOpt.get().getUsername();
                }
            } catch (NumberFormatException ignored) {}
        }

        if (msg != null) {
            try {
                java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
                Map<String, Object> reqBody = Map.of(
                    "message", msg,
                    "role", "business-director",
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

        String response = "Hello! I'm your AI Sales Assistant. Google Ads currently yields the highest quality leads (Qualified leads: 520, Win Ratio: 23.3%). Pipeline value is ₹124.8 Cr.";
        if (cleanMsg.contains("tender")) {
            response = "We have won 4 tenders MTD, and IT Park Phase - 2 (₹ 25.0 Cr) is currently shortlisted with a high conversion score.";
        } else if (cleanMsg.contains("proposal")) {
            response = "We have sent 180 proposals MTD, and 60 proposals are currently under review by clients.";
        }
        return ResponseEntity.ok(Map.of("response", response));
    }
}
