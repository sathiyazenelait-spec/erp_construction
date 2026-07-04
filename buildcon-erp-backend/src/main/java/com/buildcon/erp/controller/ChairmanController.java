package com.buildcon.erp.controller;

import com.buildcon.erp.model.Chairman;
import com.buildcon.erp.model.Project;
import com.buildcon.erp.model.ProgressClaim;
import com.buildcon.erp.payload.request.ChairmanSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.ChairmanService;
import com.buildcon.erp.repository.ProjectRepository;
import com.buildcon.erp.repository.ProgressClaimRepository;
import com.buildcon.erp.repository.ProjectManagerRepository;
import com.buildcon.erp.repository.ChairmanRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import java.util.Arrays;
import java.util.stream.Collectors;
import com.buildcon.erp.model.DashboardShellConfig;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/chairman")
public class ChairmanController {

    @Autowired
    private ChairmanService chairmanService;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProgressClaimRepository progressClaimRepository;

    @Autowired
    private ProjectManagerRepository projectManagerRepository;

    @Autowired
    private ChairmanRepository chairmanRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.buildcon.erp.repository.OrganizationRepository organizationRepository;

    @Autowired
    private com.buildcon.erp.repository.DashboardShellConfigRepository dashboardShellConfigRepository;

    @GetMapping("/settings")
    public ResponseEntity<?> getSettings(Principal principal) {
        String username = principal.getName();
        Chairman chairman = chairmanRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Chairman not found"));

        Map<String, Object> settings = new HashMap<>();
        settings.put("username", chairman.getUsername());
        settings.put("email", chairman.getEmail());
        settings.put("name", chairman.getName() != null && !chairman.getName().isEmpty() ? chairman.getName() : chairman.getUsername());
        settings.put("phone", chairman.getPhone());
        settings.put("mfaEnabled", chairman.getMfaEnabled() != null ? chairman.getMfaEnabled() : false);
        settings.put("mfaSecret", chairman.getMfaSecret());
        settings.put("notifyCuringDelay", chairman.getNotifyCuringDelay() != null ? chairman.getNotifyCuringDelay() : true);
        settings.put("notifyBudgetDeficit", chairman.getNotifyBudgetDeficit() != null ? chairman.getNotifyBudgetDeficit() : true);
        settings.put("notifyMaterialDelay", chairman.getNotifyMaterialDelay() != null ? chairman.getNotifyMaterialDelay() : true);
        settings.put("notifyFrequency", chairman.getNotifyFrequency() != null ? chairman.getNotifyFrequency() : "INSTANT");
        settings.put("fastapiUrl", chairman.getFastapiUrl() != null ? chairman.getFastapiUrl() : "https://erp-construction-1-python.onrender.com");
        settings.put("smsGatewayKey", chairman.getSmsGatewayKey());
        settings.put("smtpHost", chairman.getSmtpHost());
        settings.put("smtpPort", chairman.getSmtpPort());

        com.buildcon.erp.model.Organization org = organizationRepository.findById(chairman.getOrganizationId())
                .orElse(null);
        if (org != null) {
            settings.put("orgName", org.getName());
            settings.put("orgUsername", org.getOrgUsername());
            settings.put("orgPassword", org.getOrgPassword());
        }

        return ResponseEntity.ok(settings);
    }

    @PutMapping("/settings/profile")
    public ResponseEntity<?> updateProfile(Principal principal, @RequestBody Map<String, String> payload) {
        String username = principal.getName();
        Chairman chairman = chairmanRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Chairman not found"));

        String newEmail = payload.get("email");
        if (newEmail != null && !newEmail.equalsIgnoreCase(chairman.getEmail())) {
            if (chairmanRepository.existsByEmail(newEmail)) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
            }
            chairman.setEmail(newEmail);
        }
        chairman.setName(payload.get("name"));
        chairman.setPhone(payload.get("phone"));
        chairmanRepository.save(chairman);

        return ResponseEntity.ok(new MessageResponse("Profile updated successfully!"));
    }

    @PutMapping("/settings/security")
    public ResponseEntity<?> updateSecurity(Principal principal, @RequestBody Map<String, String> payload) {
        String username = principal.getName();
        Chairman chairman = chairmanRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Chairman not found"));

        // Password change logic
        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");
        if (currentPassword != null && !currentPassword.isEmpty() && newPassword != null && !newPassword.isEmpty()) {
            if (!passwordEncoder.matches(currentPassword, chairman.getPassword())) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Current password is incorrect!"));
            }
            chairman.setPassword(passwordEncoder.encode(newPassword));
        }

        // MFA toggle logic
        String mfaEnabledStr = payload.get("mfaEnabled");
        if (mfaEnabledStr != null) {
            boolean mfaEnabled = Boolean.parseBoolean(mfaEnabledStr);
            if (mfaEnabled && (chairman.getMfaEnabled() == null || !chairman.getMfaEnabled())) {
                String mfaSecret = payload.get("mfaSecret");
                String mfaCode = payload.get("mfaCode");
                if (mfaSecret == null || mfaSecret.isEmpty() || mfaCode == null || mfaCode.length() != 6) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid MFA verification code (must be 6 digits)."));
                }
                chairman.setMfaEnabled(true);
                chairman.setMfaSecret(mfaSecret);
            } else if (!mfaEnabled) {
                chairman.setMfaEnabled(false);
                chairman.setMfaSecret(null);
            }
        }

        chairmanRepository.save(chairman);
        return ResponseEntity.ok(new MessageResponse("Security settings updated successfully!"));
    }

    @PutMapping("/settings/notifications")
    public ResponseEntity<?> updateNotifications(Principal principal, @RequestBody Map<String, Object> payload) {
        String username = principal.getName();
        Chairman chairman = chairmanRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Chairman not found"));

        if (payload.containsKey("notifyCuringDelay")) {
            chairman.setNotifyCuringDelay((Boolean) payload.get("notifyCuringDelay"));
        }
        if (payload.containsKey("notifyBudgetDeficit")) {
            chairman.setNotifyBudgetDeficit((Boolean) payload.get("notifyBudgetDeficit"));
        }
        if (payload.containsKey("notifyMaterialDelay")) {
            chairman.setNotifyMaterialDelay((Boolean) payload.get("notifyMaterialDelay"));
        }
        if (payload.containsKey("notifyFrequency")) {
            chairman.setNotifyFrequency((String) payload.get("notifyFrequency"));
        }

        chairmanRepository.save(chairman);
        return ResponseEntity.ok(new MessageResponse("Notification settings updated successfully!"));
    }

    @PutMapping("/settings/integrations")
    public ResponseEntity<?> updateIntegrations(Principal principal, @RequestBody Map<String, Object> payload) {
        String username = principal.getName();
        Chairman chairman = chairmanRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Chairman not found"));

        if (payload.containsKey("fastapiUrl")) {
            chairman.setFastapiUrl((String) payload.get("fastapiUrl"));
        }
        if (payload.containsKey("smsGatewayKey")) {
            chairman.setSmsGatewayKey((String) payload.get("smsGatewayKey"));
        }
        if (payload.containsKey("smtpHost")) {
            chairman.setSmtpHost((String) payload.get("smtpHost"));
        }
        if (payload.containsKey("smtpPort")) {
            Object portObj = payload.get("smtpPort");
            if (portObj instanceof Number) {
                chairman.setSmtpPort(((Number) portObj).intValue());
            } else if (portObj instanceof String && !((String) portObj).isEmpty()) {
                try {
                    chairman.setSmtpPort(Integer.parseInt((String) portObj));
                } catch (NumberFormatException e) {
                    chairman.setSmtpPort(null);
                }
            } else {
                chairman.setSmtpPort(null);
            }
        }

        chairmanRepository.save(chairman);
        return ResponseEntity.ok(new MessageResponse("System integration settings updated successfully!"));
    }

    @PutMapping("/settings/org-credentials")
    public ResponseEntity<?> updateOrgCredentials(Principal principal, @RequestBody Map<String, String> payload) {
        String username = principal.getName();
        Chairman chairman = chairmanRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Chairman not found"));

        com.buildcon.erp.model.Organization org = organizationRepository.findById(chairman.getOrganizationId())
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        String newOrgUsername = payload.get("orgUsername");
        String newOrgPassword = payload.get("orgPassword");

        if (newOrgUsername == null || newOrgUsername.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Organization username cannot be empty!"));
        }
        if (newOrgPassword == null || newOrgPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Organization password cannot be empty!"));
        }

        org.setOrgUsername(newOrgUsername.trim());
        org.setOrgPassword(newOrgPassword.trim());
        organizationRepository.save(org);

        return ResponseEntity.ok(new MessageResponse("Organization credentials updated successfully!"));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerChairman(@RequestBody ChairmanSignupRequest signUpRequest) {
        Chairman chairman = chairmanService.registerChairman(signUpRequest);
        return ResponseEntity.ok(new MessageResponse("Chairman registered successfully with ID: " + chairman.getId()));
    }

    private void seedChairmanConfigs(Long orgId) {
        dashboardShellConfigRepository.save(new DashboardShellConfig("chairman", "header_date", currentHeaderDate(), orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("chairman", "sidebar_menus", "Dashboard|Executive Summary|Board Approvals|Client Directory|Financial Snapshot|Investment Tracker|Safety Audits|Sales Pipeline|System Settings|Strategy Sandbox|Subscription Package|Workforce Overview", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("chairman", "ai_suggestions", "Profile settings|System preferences|Theme customization settings|Notification alerts settings.", orgId));
    }

    @GetMapping("/dashboard/{orgId}")
    public ResponseEntity<?> getDashboardStats(@PathVariable Long orgId) {
        return getDashboardStatsUnified(orgId);
    }

    @GetMapping("/dashboard/org/{orgId}")
    public ResponseEntity<?> getDashboardStatsOrg(@PathVariable Long orgId) {
        return getDashboardStatsUnified(orgId);
    }

    private ResponseEntity<?> getDashboardStatsUnified(Long orgId) {
        List<Project> projects = projectRepository.findByOrganizationId(orgId);
        
        long totalProjects = projects.size();
        long activeProjects = 0;
        long delayedProjects = 0;
        long planningProjects = 0;
        double totalBudget = 0.0;
        double totalExpenses = 0.0;

        for (Project project : projects) {
            totalBudget += project.getBudget() != null ? project.getBudget() : 0.0;
            
            String status = project.getStatus();
            if ("Active".equalsIgnoreCase(status)) {
                activeProjects++;
            } else if ("Delayed".equalsIgnoreCase(status) || "Suspended".equalsIgnoreCase(status)) {
                delayedProjects++;
            } else {
                planningProjects++;
            }

            // Sum up approved/paid progress claims for totalExpenses
            List<ProgressClaim> claims = progressClaimRepository.findByProjectId(project.getId());
            for (ProgressClaim claim : claims) {
                if ("APPROVED".equalsIgnoreCase(claim.getStatus()) || "PAID".equalsIgnoreCase(claim.getStatus())) {
                    totalExpenses += claim.getAmountRequested() != null ? claim.getAmountRequested() : 0.0;
                }
            }
        }

        // Count PMs to estimate dynamic workforce metrics
        long pmCount = projectManagerRepository.findByOrganizationId(orgId).size();
        long simulatedStaffCount = 12 + (pmCount * 3);
        long simulatedLabourCount = 140 + (activeProjects * 38);

        java.util.Optional<com.buildcon.erp.model.Organization> orgOpt = organizationRepository.findById(orgId);
        String orgName = "BuildCon Organization";
        String subscriptionTier = "Enterprise";
        if (orgOpt.isPresent()) {
            orgName = orgOpt.get().getName();
            subscriptionTier = orgOpt.get().getSubscriptionTier();
        }

        String profileName = "Chairman User";
        String profileEmail = "chairman@buildcon.com";
        String avatarInitials = "CH";
        List<Chairman> users = chairmanRepository.findByOrganizationId(orgId);
        if (!users.isEmpty()) {
            Chairman c = users.get(0);
            profileName = c.getUsername();
            profileEmail = c.getEmail();
            avatarInitials = c.getAvatarInitials();
            if (avatarInitials == null || avatarInitials.isBlank()) {
                String initials = Arrays.stream(c.getUsername().split(" "))
                    .filter(n -> !n.isEmpty())
                    .map(n -> String.valueOf(n.charAt(0)))
                    .collect(Collectors.joining(""))
                    .toUpperCase();
                if (initials.length() > 2) {
                    initials = initials.substring(0, 2);
                }
                avatarInitials = initials.isEmpty() ? "CH" : initials;
                c.setAvatarInitials(avatarInitials);
                chairmanRepository.save(c);
            }
        }

        List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "chairman");
        if (configs.isEmpty()) {
            seedChairmanConfigs(orgId);
            configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "chairman");
        } else {
            for (DashboardShellConfig c : configs) {
                if ("header_date".equals(c.getConfigKey())) {
                    c.setConfigValue(currentHeaderDate());
                    dashboardShellConfigRepository.save(c);
                }
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProjects", totalProjects);
        stats.put("activeProjects", activeProjects);
        stats.put("delayedProjects", delayedProjects);
        stats.put("planningProjects", planningProjects);
        stats.put("totalBudget", totalBudget);
        stats.put("totalExpenses", totalExpenses);
        stats.put("staffCount", simulatedStaffCount);
        stats.put("labourCount", simulatedLabourCount);
        stats.put("orgName", orgName);
        stats.put("subscriptionTier", subscriptionTier);
        stats.put("profileName", profileName);
        stats.put("profileEmail", profileEmail);
        stats.put("avatarInitials", avatarInitials);

        for (DashboardShellConfig c : configs) {
            stats.put(c.getConfigKey(), c.getConfigValue());
        }

        return ResponseEntity.ok(stats);
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String email = payload.get("email");
        Long orgId = payload.containsKey("organizationId") ? Long.parseLong(payload.get("organizationId")) : null;

        if (orgId == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: organizationId is required."));
        }

        List<Chairman> users = chairmanRepository.findByOrganizationId(orgId);
        if (!users.isEmpty()) {
            Chairman c = users.get(0);
            if (username != null && !username.isBlank()) c.setUsername(username);
            if (email != null && !email.isBlank()) c.setEmail(email);
            String avatarInitials = payload.get("avatarInitials");
            if (avatarInitials != null && !avatarInitials.isBlank()) c.setAvatarInitials(avatarInitials);
            chairmanRepository.save(c);
        }

        String[] configKeys = {
            "sidebar_menus", "ai_suggestions"
        };

        for (String key : configKeys) {
            String val = payload.get(key);
            if (val != null && !val.isBlank()) {
                List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "chairman");
                boolean found = false;
                for (DashboardShellConfig cfg : configs) {
                    if (cfg.getConfigKey().equals(key)) {
                        cfg.setConfigValue(val);
                        dashboardShellConfigRepository.save(cfg);
                        found = true;
                    }
                }
                if (!found) {
                    dashboardShellConfigRepository.save(new DashboardShellConfig("chairman", key, val, orgId));
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

        String profileName = "Chairman User";
        if (orgIdStr != null) {
            try {
                Long orgId = Long.parseLong(orgIdStr);
                List<Chairman> users = chairmanRepository.findByOrganizationId(orgId);
                if (!users.isEmpty()) {
                    profileName = users.get(0).getUsername();
                }
            } catch (NumberFormatException ignored) {}
        }

        if (msg != null) {
            try {
                java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
                Map<String, Object> reqBody = Map.of(
                    "message", msg,
                    "role", "chairman",
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

        String response = "Hello Chairman! I'm your AI Strategy Assistant. We are tracking 18 total projects, average progress 56%, and cumulative budget value ₹138.6 Cr.";
        if (cleanMsg.contains("projects")) {
            response = "We have 18 total projects in the portfolio (12 On Track, 4 Delayed, 2 Critical).";
        }
        return ResponseEntity.ok(Map.of("response", response));
    }

    private String currentHeaderDate() {
        return java.time.format.DateTimeFormatter.ofPattern("EEEE, dd MMMM yyyy").format(java.time.LocalDate.now());
    }
}