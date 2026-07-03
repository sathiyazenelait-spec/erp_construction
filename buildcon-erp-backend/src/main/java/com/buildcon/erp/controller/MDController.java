package com.buildcon.erp.controller;

import com.buildcon.erp.model.MD;
import com.buildcon.erp.model.Project;
import com.buildcon.erp.model.Organization;
import com.buildcon.erp.model.DashboardShellConfig;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.MDService;
import com.buildcon.erp.repository.MDRepository;
import com.buildcon.erp.repository.ProjectRepository;
import com.buildcon.erp.repository.DashboardShellConfigRepository;
import com.buildcon.erp.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.Arrays;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/md")
public class MDController {

    @Autowired
    private MDService service;

    @Autowired
    private MDRepository mdRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private DashboardShellConfigRepository dashboardShellConfigRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        MD res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
    }

    private String currentHeaderDate() {
        return java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy, EEEE"));
    }

    private void seedMDData(Long orgId) {
        dashboardShellConfigRepository.save(new DashboardShellConfig("md", "header_date", currentHeaderDate(), orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("md", "sidebar_menus", "Dashboard|Executive Command|Department Performance|Projects Command Center|Financial Overview|Sales & Business Pipeline|Client Management|Resource Management|Procurement Overview|Safety & Compliance|Risk Management|Approval Center|AI Business Assistant|Reports Center", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("md", "ai_suggestions", "Show delayed projects|Revenue forecast|Department performance|Cash flow prediction.", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("md", "revenue_mtd", "₹ 24.5 Cr", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("md", "net_profit_mtd", "₹ 5.8 Cr", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("md", "active_projects_count", "18", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("md", "leads_generated", "1,250", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("md", "cash_position", "₹ 12.1 Cr", orgId));
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

        String profileName = "Rajesh Kumar";
        String profileEmail = "md@buildcon.com";
        String avatarInitials = "RK";
        List<MD> mdUsers = mdRepository.findByOrganizationId(orgId);
        if (!mdUsers.isEmpty()) {
            MD md = mdUsers.get(0);
            profileName = md.getUsername();
            profileEmail = md.getEmail();
            avatarInitials = md.getAvatarInitials();
            if (avatarInitials == null || avatarInitials.isBlank()) {
                String initials = Arrays.stream(md.getUsername().split(" "))
                    .filter(n -> !n.isEmpty())
                    .map(n -> String.valueOf(n.charAt(0)))
                    .collect(Collectors.joining(""))
                    .toUpperCase();
                if (initials.length() > 2) {
                    initials = initials.substring(0, 2);
                }
                avatarInitials = initials.isEmpty() ? "RK" : initials;
                md.setAvatarInitials(avatarInitials);
                mdRepository.save(md);
            }
        }

        List<Project> projects = projectRepository.findByOrganizationId(orgId);
        if (projects.isEmpty()) {
            projectRepository.save(new Project("Skyline Residences", "Location A", 100000000.0, java.time.LocalDate.now(), java.time.LocalDate.now().plusYears(1), orgId));
            projectRepository.save(new Project("Greenfield Apartments", "Location B", 50000000.0, java.time.LocalDate.now(), java.time.LocalDate.now().plusYears(1), orgId));
            projects = projectRepository.findByOrganizationId(orgId);
        }

        List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "md");
        if (configs.isEmpty()) {
            seedMDData(orgId);
            configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "md");
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

        List<MD> mdUsers = mdRepository.findByOrganizationId(orgId);
        if (!mdUsers.isEmpty()) {
            MD md = mdUsers.get(0);
            if (username != null && !username.isBlank()) md.setUsername(username);
            if (email != null && !email.isBlank()) md.setEmail(email);
            String avatarInitials = payload.get("avatarInitials");
            if (avatarInitials != null && !avatarInitials.isBlank()) md.setAvatarInitials(avatarInitials);
            mdRepository.save(md);
        }

        String[] configKeys = {
            "sidebar_menus", "ai_suggestions", "revenue_mtd", "net_profit_mtd", "active_projects_count", "leads_generated", "cash_position"
        };

        for (String key : configKeys) {
            String val = payload.get(key);
            if (val != null && !val.isBlank()) {
                List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "md");
                boolean found = false;
                for (DashboardShellConfig c : configs) {
                    if (c.getConfigKey().equals(key)) {
                        c.setConfigValue(val);
                        dashboardShellConfigRepository.save(c);
                        found = true;
                    }
                }
                if (!found) {
                    dashboardShellConfigRepository.save(new DashboardShellConfig("md", key, val, orgId));
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

        String profileName = "Managing Director";
        if (orgIdStr != null) {
            try {
                Long orgId = Long.parseLong(orgIdStr);
                List<MD> mdUsers = mdRepository.findByOrganizationId(orgId);
                if (!mdUsers.isEmpty()) {
                    profileName = mdUsers.get(0).getUsername();
                }
            } catch (NumberFormatException ignored) {}
        }

        if (msg != null) {
            try {
                java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
                Map<String, Object> reqBody = Map.of(
                    "message", msg,
                    "role", "md",
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
                    Map<String, Object> resMap = mapper.readValue(response.body(), Map.class);
                    return ResponseEntity.ok(resMap);
                }
            } catch (Exception e) {
                System.out.println("Error calling generic AI chat service: " + e.getMessage());
            }
        }

        String response = "Hello! I'm your AI Business Assistant, Rajesh Kumar. Our organization currently has a 94.2% health index and total profit forecast is ₹5.8 Cr. Let me know if you need timeline projections or budget forecasting.";
        if (cleanMsg.contains("delay") || cleanMsg.contains("risk")) {
            response = "Phoenix Commercial Complex is delayed by 12 days. Reason: material delivery lags. Recommended action: expedite ready-mix concrete release.";
        } else if (cleanMsg.contains("revenue") || cleanMsg.contains("profit")) {
            response = "MTD Revenue stands at ₹ 24.5 Cr, and Net Profit is ₹ 5.8 Cr (Margin: 23.6%).";
        }
        return ResponseEntity.ok(Map.of("response", response));
    }

    @GetMapping("/executive/metrics")
    public ResponseEntity<?> getExecutiveMetrics(Principal principal) {
        String username = principal.getName();
        MD md = mdRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Managing Director not found"));

        Long orgId = md.getOrganizationId();
        List<Project> projects = orgId != null ? projectRepository.findByOrganizationId(orgId) : List.of();

        double healthIndex = 94.2;
        double targetEfficiency = 98.4;
        double totalProfitForecast = 32.4;
        String speedIndex = "A+ Optimal";

        List<Map<String, Object>> timeline = new ArrayList<>();
        timeline.add(Map.of("m", "Jan", "index", 88));
        timeline.add(Map.of("m", "Feb", "index", 90));
        timeline.add(Map.of("m", "Mar", "index", 89));
        timeline.add(Map.of("m", "Apr", "index", 91));
        timeline.add(Map.of("m", "May", "index", 92));

        if (!projects.isEmpty()) {
            double totalProgress = 0;
            int onTrackCount = 0;
            double totalBudget = 0;
            int criticalCount = 0;
            int delayedCount = 0;

            for (Project p : projects) {
                double progress = 0;
                try {
                    if (p.getWorkforceDetails() != null) {
                        progress = Double.parseDouble(p.getWorkforceDetails());
                    }
                } catch (NumberFormatException ignored) {}

                totalProgress += progress;
                totalBudget += p.getBudget() != null ? p.getBudget() : 0.0;

                String status = p.getStatus() != null ? p.getStatus() : "";
                if ("On Track".equalsIgnoreCase(status) || "Planning".equalsIgnoreCase(status)) {
                    onTrackCount++;
                } else if ("Critical".equalsIgnoreCase(status)) {
                    criticalCount++;
                } else if ("Delayed".equalsIgnoreCase(status)) {
                    delayedCount++;
                }
            }

            int count = projects.size();
            healthIndex = 100.0 - (criticalCount * 15.0) - (delayedCount * 5.0);
            if (healthIndex < 20.0) healthIndex = 20.0;

            targetEfficiency = ((double) onTrackCount / count) * 100.0;

            double budgetInCr = totalBudget > 1000 ? totalBudget / 10000000.0 : totalBudget;
            totalProfitForecast = budgetInCr * 0.15;

            if (criticalCount > 1) {
                speedIndex = "B Passable";
            } else if (criticalCount == 1 || delayedCount > 1) {
                speedIndex = "A Optimal";
            } else {
                speedIndex = "A+ Optimal";
            }
        }

        timeline.add(Map.of("m", "Jun", "index", (int) Math.round(healthIndex)));

        Map<String, Object> response = new HashMap<>();
        response.put("healthIndex", String.format("%.1f%%", healthIndex));
        response.put("targetEfficiency", String.format("%.1f%%", targetEfficiency));
        response.put("totalProfitForecast", String.format("₹ %.1f Cr", totalProfitForecast));
        response.put("operationSpeedIndex", speedIndex);
        response.put("timeline", timeline);

        return ResponseEntity.ok(response);
    }
}

