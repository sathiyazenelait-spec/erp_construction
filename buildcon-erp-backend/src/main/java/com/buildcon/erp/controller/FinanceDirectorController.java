package com.buildcon.erp.controller;

import com.buildcon.erp.model.FinanceDirector;
import com.buildcon.erp.model.Organization;
import com.buildcon.erp.model.Project;
import com.buildcon.erp.model.DashboardShellConfig;
import com.buildcon.erp.repository.FinanceDirectorRepository;
import com.buildcon.erp.repository.DashboardShellConfigRepository;
import com.buildcon.erp.repository.OrganizationRepository;
import com.buildcon.erp.repository.ProjectRepository;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.FinanceDirectorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.buildcon.erp.security.services.UserDetailsImpl;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/finance-director")
public class FinanceDirectorController {

    @Autowired
    private FinanceDirectorService service;

    @Autowired
    private FinanceDirectorRepository financeDirectorRepository;

    @Autowired
    private DashboardShellConfigRepository dashboardShellConfigRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private com.buildcon.erp.repository.FaTransactionRepository faTransactionRepository;

    @Autowired
    private com.buildcon.erp.repository.FaCashflowForecastRepository faCashflowForecastRepository;

    private synchronized String generateTxId() {
        long count = faTransactionRepository.count();
        return String.format("TX-%04d", count + 1);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        FinanceDirector res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
    }

    private String currentHeaderDate() {
        return java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy, EEEE"));
    }

    @GetMapping("/dashboard/org/{orgId}")
    public ResponseEntity<?> getDashboard(@PathVariable Long orgId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(orgId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }
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

        String profileName = "Suresh Kumar";
        String profileEmail = "fd@buildcon.com";
        String avatarInitials = "SK";
        java.util.List<FinanceDirector> fdUsers = financeDirectorRepository.findByOrganizationId(orgId);
        if (!fdUsers.isEmpty()) {
            FinanceDirector fd = fdUsers.get(0);
            profileName = fd.getUsername();
            profileEmail = fd.getEmail();
            avatarInitials = fd.getAvatarInitials();
            if (avatarInitials == null || avatarInitials.isBlank()) {
                String initials = java.util.Arrays.stream(fd.getUsername().split(" "))
                    .filter(n -> !n.isEmpty())
                    .map(n -> String.valueOf(n.charAt(0)))
                    .collect(java.util.stream.Collectors.joining(""))
                    .toUpperCase();
                if (initials.length() > 2) {
                    initials = initials.substring(0, 2);
                }
                avatarInitials = initials.isEmpty() ? "FD" : initials;
                fd.setAvatarInitials(avatarInitials);
                financeDirectorRepository.save(fd);
            }
        }

        java.util.List<Project> projects = projectRepository.findByOrganizationId(orgId);
        if (projects.isEmpty()) {
            projectRepository.save(new Project("Skyline Residences", "Location A", 100000000.0, java.time.LocalDate.now(), java.time.LocalDate.now().plusYears(1), orgId));
            projectRepository.save(new Project("Greenfield Apartments", "Location B", 50000000.0, java.time.LocalDate.now(), java.time.LocalDate.now().plusYears(1), orgId));
            projects = projectRepository.findByOrganizationId(orgId);
        }

        java.util.List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "finance-director");
        if (configs.isEmpty()) {
            service.seedFDData(orgId);
            configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "finance-director");
        } else {
            for (DashboardShellConfig c : configs) {
                if ("header_date".equals(c.getConfigKey())) {
                    c.setConfigValue(currentHeaderDate());
                    dashboardShellConfigRepository.save(c);
                }
            }
        }

        java.util.List<com.buildcon.erp.model.FaTransaction> transactions = faTransactionRepository.findByOrganizationId(orgId);
        if (transactions.isEmpty()) {
            faTransactionRepository.save(new com.buildcon.erp.model.FaTransaction(generateTxId(), "ABC Builders", "Receivable", 12000000.0, "45 Days", "Overdue", orgId));
            faTransactionRepository.save(new com.buildcon.erp.model.FaTransaction(generateTxId(), "XYZ Developers", "Receivable", 8500000.0, "30 Days", "Pending", orgId));
            faTransactionRepository.save(new com.buildcon.erp.model.FaTransaction(generateTxId(), "Villa Client", "Receivable", 3200000.0, "15 Days", "Pending", orgId));

            faTransactionRepository.save(new com.buildcon.erp.model.FaTransaction(generateTxId(), "Cement Supplier Corp", "Payable", 4800000.0, "In 7 Days", "Pending", orgId));
            faTransactionRepository.save(new com.buildcon.erp.model.FaTransaction(generateTxId(), "Global Steel Inc", "Payable", 6200000.0, "In 15 Days", "Pending", orgId));
            faTransactionRepository.save(new com.buildcon.erp.model.FaTransaction(generateTxId(), "MEP Contracting Ltd", "Payable", 2200000.0, "In 21 Days", "Pending", orgId));
            transactions = faTransactionRepository.findByOrganizationId(orgId);
        }

        java.util.List<com.buildcon.erp.model.FaCashflowForecast> forecasts = faCashflowForecastRepository.findByOrganizationId(orgId);
        if (forecasts.isEmpty()) {
            faCashflowForecastRepository.save(new com.buildcon.erp.model.FaCashflowForecast("Jun 24", 18.5, 14.2, orgId));
            faCashflowForecastRepository.save(new com.buildcon.erp.model.FaCashflowForecast("Jul 24", 19.2, 14.8, orgId));
            faCashflowForecastRepository.save(new com.buildcon.erp.model.FaCashflowForecast("Aug 24", 20.1, 15.5, orgId));
            faCashflowForecastRepository.save(new com.buildcon.erp.model.FaCashflowForecast("Sep 24", 21.5, 16.0, orgId));
            faCashflowForecastRepository.save(new com.buildcon.erp.model.FaCashflowForecast("Oct 24", 22.0, 16.8, orgId));
            faCashflowForecastRepository.save(new com.buildcon.erp.model.FaCashflowForecast("Nov 24", 21.8, 16.5, orgId));
            faCashflowForecastRepository.save(new com.buildcon.erp.model.FaCashflowForecast("Dec 24", 23.4, 17.2, orgId));
            faCashflowForecastRepository.save(new com.buildcon.erp.model.FaCashflowForecast("Jan 25", 22.8, 17.0, orgId));
            faCashflowForecastRepository.save(new com.buildcon.erp.model.FaCashflowForecast("Feb 25", 23.9, 17.8, orgId));
            faCashflowForecastRepository.save(new com.buildcon.erp.model.FaCashflowForecast("Mar 25", 25.2, 18.5, orgId));
            faCashflowForecastRepository.save(new com.buildcon.erp.model.FaCashflowForecast("Apr 25", 24.1, 18.0, orgId));
            faCashflowForecastRepository.save(new com.buildcon.erp.model.FaCashflowForecast("May 25", 24.5, 18.2, orgId));
            forecasts = faCashflowForecastRepository.findByOrganizationId(orgId);
        }

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("organizationName", orgName);
        response.put("profileName", profileName);
        response.put("profileEmail", profileEmail);
        response.put("avatarInitials", avatarInitials);
        response.put("projects", projects);
        response.put("transactions", transactions);
        response.put("forecasts", forecasts);

        for (DashboardShellConfig c : configs) {
            response.put(c.getConfigKey(), c.getConfigValue());
        }

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody java.util.Map<String, String> payload, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String username = payload.get("username");
        String email = payload.get("email");
        Long orgId = payload.containsKey("organizationId") ? Long.parseLong(payload.get("organizationId")) : null;

        if (orgId == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: organizationId is required."));
        }
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(orgId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }

        java.util.List<FinanceDirector> fdUsers = financeDirectorRepository.findByOrganizationId(orgId);
        if (!fdUsers.isEmpty()) {
            FinanceDirector fd = fdUsers.get(0);
            if (username != null && !username.isBlank()) fd.setUsername(username);
            if (email != null && !email.isBlank()) fd.setEmail(email);
            String avatarInitials = payload.get("avatarInitials");
            if (avatarInitials != null && !avatarInitials.isBlank()) fd.setAvatarInitials(avatarInitials);
            financeDirectorRepository.save(fd);
        }

        String[] configKeys = {
            "sidebar_menus", "ai_suggestions", "revenue_mtd", "gross_profit",
            "net_profit", "cash_position", "cash_30_days", "cash_60_days"
        };

        for (String key : configKeys) {
            String val = payload.get(key);
            if (val != null && !val.isBlank()) {
                java.util.List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "finance-director");
                boolean found = false;
                for (DashboardShellConfig c : configs) {
                    if (c.getConfigKey().equals(key)) {
                        c.setConfigValue(val);
                        dashboardShellConfigRepository.save(c);
                        found = true;
                    }
                }
                if (!found) {
                    dashboardShellConfigRepository.save(new DashboardShellConfig("finance-director", key, val, orgId));
                }
            }
        }

        return ResponseEntity.ok(new MessageResponse("Configurations updated successfully."));
    }

    @PostMapping("/ai-chat")
    public ResponseEntity<?> aiChat(@RequestBody java.util.Map<String, String> payload) {
        String msg = payload.get("message");
        String orgIdStr = payload.get("organizationId");

        String profileName = "Finance Director";
        if (orgIdStr != null) {
            try {
                Long orgId = Long.parseLong(orgIdStr);
                java.util.List<FinanceDirector> fdUsers = financeDirectorRepository.findByOrganizationId(orgId);
                if (!fdUsers.isEmpty()) {
                    profileName = fdUsers.get(0).getUsername();
                }
            } catch (NumberFormatException ignored) {}
        }

        if (msg != null) {
            try {
                java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
                java.util.Map<String, Object> reqBody = java.util.Map.of(
                    "message", msg,
                    "role", "finance-director",
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
                    java.util.Map<String, Object> resMap = mapper.readValue(response.body(), java.util.Map.class);
                    return ResponseEntity.ok(resMap);
                }
            } catch (Exception e) {
                System.out.println("Error calling generic AI chat service: " + e.getMessage());
            }
        }

        return ResponseEntity.ok(java.util.Map.of("response", "I will retrieve financial figures. Please select an AI recommendation option."));
    }
}
