package com.buildcon.erp.controller;

import com.buildcon.erp.model.ConstructionManager;
import com.buildcon.erp.model.Organization;
import com.buildcon.erp.model.Project;
import com.buildcon.erp.model.DashboardShellConfig;
import com.buildcon.erp.repository.ConstructionManagerRepository;
import com.buildcon.erp.repository.DashboardShellConfigRepository;
import com.buildcon.erp.repository.OrganizationRepository;
import com.buildcon.erp.repository.ProjectRepository;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.ConstructionManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/construction-manager")
public class ConstructionManagerController {

    @Autowired
    private ConstructionManagerService service;

    @Autowired
    private ConstructionManagerRepository constructionManagerRepository;

    @Autowired
    private DashboardShellConfigRepository dashboardShellConfigRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private com.buildcon.erp.repository.EquipmentRepository equipmentRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        ConstructionManager res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
    }

    private String currentHeaderDate() {
        return java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy, EEEE"));
    }

    private void seedCMData(Long orgId) {
        dashboardShellConfigRepository.save(new DashboardShellConfig("construction-manager", "header_date", currentHeaderDate(), orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("construction-manager", "sidebar_menus", "Dashboard|Project Progress|Site Monitoring|Resource Management|Labour Productivity|Material Tracking|Equipment Monitoring|Quality Control|Safety Center|Procurement|Delay Management|Daily Site Reports|AI Construction Assistant|Settings", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("construction-manager", "ai_suggestions", "Which project is at risk?|Show material over-consumption|What is the reason for delay in Phoenix Commercial?|Predict completion date for all projects", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("construction-manager", "active_projects", "18", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("construction-manager", "on_time_projects", "14", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("construction-manager", "delayed_projects", "4", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("construction-manager", "workforce_onsite", "420", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("construction-manager", "safety_score", "96%", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("construction-manager", "qc_pass_rate", "98%", orgId));
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

        String profileName = "Karthik R.";
        String profileEmail = "cm@buildcon.com";
        String avatarInitials = "KR";
        java.util.List<ConstructionManager> cmUsers = constructionManagerRepository.findByOrganizationId(orgId);
        if (!cmUsers.isEmpty()) {
            ConstructionManager cm = cmUsers.get(0);
            profileName = cm.getUsername();
            profileEmail = cm.getEmail();
            avatarInitials = cm.getAvatarInitials();
            if (avatarInitials == null || avatarInitials.isBlank()) {
                String initials = java.util.Arrays.stream(cm.getUsername().split(" "))
                    .filter(n -> !n.isEmpty())
                    .map(n -> String.valueOf(n.charAt(0)))
                    .collect(java.util.stream.Collectors.joining(""))
                    .toUpperCase();
                if (initials.length() > 2) {
                    initials = initials.substring(0, 2);
                }
                avatarInitials = initials.isEmpty() ? "CM" : initials;
                cm.setAvatarInitials(avatarInitials);
                constructionManagerRepository.save(cm);
            }
        }

        java.util.List<Project> projects = projectRepository.findByOrganizationId(orgId);
        if (projects.isEmpty()) {
            projectRepository.save(new Project("Skyline Residences", "Location A", 100000000.0, java.time.LocalDate.now(), java.time.LocalDate.now().plusYears(1), orgId));
            projectRepository.save(new Project("Greenfield Apartments", "Location B", 50000000.0, java.time.LocalDate.now(), java.time.LocalDate.now().plusYears(1), orgId));
            projects = projectRepository.findByOrganizationId(orgId);
        }

        java.util.List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "construction-manager");
        if (configs.isEmpty()) {
            seedCMData(orgId);
            configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "construction-manager");
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

        java.util.List<ConstructionManager> cmUsers = constructionManagerRepository.findByOrganizationId(orgId);
        if (!cmUsers.isEmpty()) {
            ConstructionManager cm = cmUsers.get(0);
            if (username != null && !username.isBlank()) cm.setUsername(username);
            if (email != null && !email.isBlank()) cm.setEmail(email);
            String avatarInitials = payload.get("avatarInitials");
            if (avatarInitials != null && !avatarInitials.isBlank()) cm.setAvatarInitials(avatarInitials);
            constructionManagerRepository.save(cm);
        }

        String[] configKeys = {
            "sidebar_menus", "ai_suggestions", "active_projects", "on_time_projects",
            "delayed_projects", "workforce_onsite", "safety_score", "qc_pass_rate"
        };

        for (String key : configKeys) {
            String val = payload.get(key);
            if (val != null && !val.isBlank()) {
                java.util.List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "construction-manager");
                boolean found = false;
                for (DashboardShellConfig c : configs) {
                    if (c.getConfigKey().equals(key)) {
                        c.setConfigValue(val);
                        dashboardShellConfigRepository.save(c);
                        found = true;
                    }
                }
                if (!found) {
                    dashboardShellConfigRepository.save(new DashboardShellConfig("construction-manager", key, val, orgId));
                }
            }
        }

        return ResponseEntity.ok(new MessageResponse("Configurations updated successfully."));
    }

    @PostMapping("/ai-chat")
    public ResponseEntity<?> aiChat(@RequestBody java.util.Map<String, String> payload) {
        String msg = payload.get("message");
        String orgIdStr = payload.get("organizationId");

        String profileName = "Construction Manager";
        if (orgIdStr != null) {
            try {
                Long orgId = Long.parseLong(orgIdStr);
                java.util.List<ConstructionManager> cmUsers = constructionManagerRepository.findByOrganizationId(orgId);
                if (!cmUsers.isEmpty()) {
                    profileName = cmUsers.get(0).getUsername();
                }
            } catch (NumberFormatException ignored) {}
        }

        if (msg != null) {
            try {
                java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
                java.util.Map<String, Object> reqBody = java.util.Map.of(
                    "message", msg,
                    "role", "construction-manager",
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

        return ResponseEntity.ok(java.util.Map.of("response", "I will track construction details. Please select a dynamic recommendation shortcut."));
    }

    @GetMapping("/equipment/org/{orgId}")
    public ResponseEntity<java.util.List<com.buildcon.erp.model.Equipment>> getEquipmentByOrg(@PathVariable Long orgId) {
        java.util.List<com.buildcon.erp.model.Equipment> list = equipmentRepository.findByOrganizationId(orgId);
        if (list.isEmpty()) {
            equipmentRepository.save(new com.buildcon.erp.model.Equipment("EQ-102", "Liebherr Tower Crane 150", "Site A - Chennai", "Hydraulics Check", "30 May 2025", "Maintenance", orgId));
            equipmentRepository.save(new com.buildcon.erp.model.Equipment("EQ-104", "CAT Hydraulic Excavator 320", "Site C - Chennai", "Engine Breakdown", "Immediate (Repairs)", "Breakdown", orgId));
            equipmentRepository.save(new com.buildcon.erp.model.Equipment("EQ-108", "Mobile Concrete Mixer Truck", "Site B - Coimbatore", "Routine Service", "05 Jun 2025", "Active", orgId));
            equipmentRepository.save(new com.buildcon.erp.model.Equipment("EQ-101", "JCB Backhoe Loader 3DX", "Site A - Chennai", "Optimal", "N/A", "Active", orgId));
            equipmentRepository.save(new com.buildcon.erp.model.Equipment("EQ-103", "Volvo Asphalt Compactor", "Site B - Coimbatore", "Optimal", "N/A", "Idle", orgId));
            equipmentRepository.save(new com.buildcon.erp.model.Equipment("EQ-105", "Schwing Concrete Pump", "Site C - Chennai", "Optimal", "N/A", "Active", orgId));
            equipmentRepository.save(new com.buildcon.erp.model.Equipment("EQ-106", "Putzmeister Plastering Machine", "Site A - Chennai", "Optimal", "N/A", "Active", orgId));
            equipmentRepository.save(new com.buildcon.erp.model.Equipment("EQ-107", "Ajax Self Loading Mixer", "Site C - Chennai", "Optimal", "N/A", "Idle", orgId));
            list = equipmentRepository.findByOrganizationId(orgId);
        }
        return ResponseEntity.ok(list);
    }

    @PostMapping("/equipment")
    public ResponseEntity<com.buildcon.erp.model.Equipment> createEquipment(@RequestBody com.buildcon.erp.model.Equipment equipment) {
        return ResponseEntity.ok(equipmentRepository.save(equipment));
    }
}
