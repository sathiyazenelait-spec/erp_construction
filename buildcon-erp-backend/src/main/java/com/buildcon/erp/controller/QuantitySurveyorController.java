package com.buildcon.erp.controller;

import com.buildcon.erp.model.QuantitySurveyor;
import com.buildcon.erp.model.Organization;
import com.buildcon.erp.model.Project;
import com.buildcon.erp.model.DashboardShellConfig;
import com.buildcon.erp.repository.QuantitySurveyorRepository;
import com.buildcon.erp.repository.DashboardShellConfigRepository;
import com.buildcon.erp.repository.OrganizationRepository;
import com.buildcon.erp.repository.ProjectRepository;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.QuantitySurveyorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/quantity-surveyor")
public class QuantitySurveyorController {

    @Autowired
    private QuantitySurveyorService service;

    @Autowired
    private QuantitySurveyorRepository quantitySurveyorRepository;

    @Autowired
    private DashboardShellConfigRepository dashboardShellConfigRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        QuantitySurveyor res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
    }

    private String currentHeaderDate() {
        return java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy, EEEE"));
    }

    private void seedQSData(Long orgId) {
        dashboardShellConfigRepository.save(new DashboardShellConfig("quantity-surveyor", "header_date", currentHeaderDate(), orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("quantity-surveyor", "sidebar_menus", "Cost Control Center|BOQ Management|Quantity Tracking|Budget vs Actual|Measurement Book|Client Billing|Subcontractor Billing|Variation Orders|Rate Analysis|Cost Forecasting|Claims Management|AI Cost Assistant|Settings", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("quantity-surveyor", "ai_suggestions", "Predict final project cost.|Which item exceeds budget?|Material wastage analysis.|Profitability forecast.", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("quantity-surveyor", "boq_value", "₹12.5 Cr", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("quantity-surveyor", "executed_work", "₹7.2 Cr", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("quantity-surveyor", "remaining_balance", "₹5.3 Cr", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("quantity-surveyor", "earthwork", "450 m³", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("quantity-surveyor", "concrete_rcc", "1,200 m³", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("quantity-surveyor", "brickwork", "8,500 Sq.Ft", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("quantity-surveyor", "vo_pending", "8", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("quantity-surveyor", "vo_approved", "4", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("quantity-surveyor", "vo_total_value", "₹18 Lakhs", orgId));
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

        String profileName = "Meenakshi Sundaram";
        String profileEmail = "qs@buildcon.com";
        String avatarInitials = "MS";
        java.util.List<QuantitySurveyor> qsUsers = quantitySurveyorRepository.findByOrganizationId(orgId);
        if (!qsUsers.isEmpty()) {
            QuantitySurveyor qs = qsUsers.get(0);
            profileName = qs.getUsername();
            profileEmail = qs.getEmail();
            avatarInitials = qs.getAvatarInitials();
            if (avatarInitials == null || avatarInitials.isBlank()) {
                String initials = java.util.Arrays.stream(qs.getUsername().split(" "))
                    .filter(n -> !n.isEmpty())
                    .map(n -> String.valueOf(n.charAt(0)))
                    .collect(java.util.stream.Collectors.joining(""))
                    .toUpperCase();
                if (initials.length() > 2) {
                    initials = initials.substring(0, 2);
                }
                avatarInitials = initials.isEmpty() ? "MS" : initials;
                qs.setAvatarInitials(avatarInitials);
                quantitySurveyorRepository.save(qs);
            }
        }

        java.util.List<Project> projects = projectRepository.findByOrganizationId(orgId);
        if (projects.isEmpty()) {
            projectRepository.save(new Project("Skyline Residences", "Location A", 100000000.0, java.time.LocalDate.now(), java.time.LocalDate.now().plusYears(1), orgId));
            projectRepository.save(new Project("Greenfield Apartments", "Location B", 50000000.0, java.time.LocalDate.now(), java.time.LocalDate.now().plusYears(1), orgId));
            projects = projectRepository.findByOrganizationId(orgId);
        }

        java.util.List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "quantity-surveyor");
        if (configs.isEmpty()) {
            seedQSData(orgId);
            configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "quantity-surveyor");
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

        java.util.List<QuantitySurveyor> qsUsers = quantitySurveyorRepository.findByOrganizationId(orgId);
        if (!qsUsers.isEmpty()) {
            QuantitySurveyor qs = qsUsers.get(0);
            if (username != null && !username.isBlank()) qs.setUsername(username);
            if (email != null && !email.isBlank()) qs.setEmail(email);
            String avatarInitials = payload.get("avatarInitials");
            if (avatarInitials != null && !avatarInitials.isBlank()) qs.setAvatarInitials(avatarInitials);
            quantitySurveyorRepository.save(qs);
        }

        String[] configKeys = {
            "sidebar_menus", "ai_suggestions", "boq_value", "executed_work", "remaining_balance",
            "earthwork", "concrete_rcc", "brickwork", "vo_pending", "vo_approved", "vo_total_value"
        };

        for (String key : configKeys) {
            String val = payload.get(key);
            if (val != null && !val.isBlank()) {
                java.util.List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "quantity-surveyor");
                boolean found = false;
                for (DashboardShellConfig c : configs) {
                    if (c.getConfigKey().equals(key)) {
                        c.setConfigValue(val);
                        dashboardShellConfigRepository.save(c);
                        found = true;
                    }
                }
                if (!found) {
                    dashboardShellConfigRepository.save(new DashboardShellConfig("quantity-surveyor", key, val, orgId));
                }
            }
        }

        return ResponseEntity.ok(new MessageResponse("Configurations updated successfully."));
    }

    @PostMapping("/ai-chat")
    public ResponseEntity<?> aiChat(@RequestBody java.util.Map<String, String> payload) {
        String msg = payload.get("message");
        String orgIdStr = payload.get("organizationId");
        String cleanMsg = msg != null ? msg.toLowerCase() : "";

        String profileName = "Quantity Surveyor";
        if (orgIdStr != null) {
            try {
                Long orgId = Long.parseLong(orgIdStr);
                java.util.List<QuantitySurveyor> qsUsers = quantitySurveyorRepository.findByOrganizationId(orgId);
                if (!qsUsers.isEmpty()) {
                    profileName = qsUsers.get(0).getUsername();
                }
            } catch (NumberFormatException ignored) {}
        }

        if (msg != null) {
            try {
                java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
                java.util.Map<String, Object> reqBody = java.util.Map.of(
                    "message", msg,
                    "role", "quantity-surveyor",
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

        String response = "Current BOQ balance stands at ₹5.3 Cr. Steel wastage rate on slab reinforcement is 4.8%. Estimated cost to complete is ₹12.65 Cr based on materials index shifts.";
        if (cleanMsg.contains("profitable")) {
            response = "The Villa Community project in Coimbatore currently registers the lowest margins (18.6%) due to a ₹1.8 Cr cost overrun.";
        }
        return ResponseEntity.ok(java.util.Map.of("response", response));
    }
}

