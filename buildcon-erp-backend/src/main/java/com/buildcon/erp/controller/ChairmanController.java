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
import java.util.ArrayList;
import java.util.Optional;

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

    @Autowired
    private com.buildcon.erp.repository.ChairmanTicketRepository chairmanTicketRepository;

    @Autowired
    private com.buildcon.erp.repository.BoardApprovalRepository boardApprovalRepository;

    @Autowired
    private com.buildcon.erp.repository.CustomerUserRepository customerUserRepository;

    @Autowired
    private com.buildcon.erp.repository.ClientTicketRepository clientTicketRepository;

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
        String currentUsername = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Chairman> cOpt = chairmanRepository.findByUsername(currentUsername)
                .or(() -> chairmanRepository.findByEmail(currentUsername));
        if (cOpt.isPresent()) {
            Chairman c = cOpt.get();
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

        boolean trialExpired = false;
        if (orgOpt.isPresent()) {
            var orgObj = orgOpt.get();
            if ("Trial".equalsIgnoreCase(orgObj.getSubscriptionTier()) || "0".equals(orgObj.getSubscriptionTier())) {
                trialExpired = orgObj.getCreatedAt() != null && orgObj.getCreatedAt().plusDays(3).isBefore(java.time.LocalDateTime.now());
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
        stats.put("trialExpired", trialExpired);

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

        String currentUsername = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Chairman> cOpt = chairmanRepository.findByUsername(currentUsername)
                .or(() -> chairmanRepository.findByEmail(currentUsername));
        if (cOpt.isPresent()) {
            Chairman c = cOpt.get();
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
                String currentUsername = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
                Optional<Chairman> cOpt = chairmanRepository.findByUsername(currentUsername)
                        .or(() -> chairmanRepository.findByEmail(currentUsername));
                if (cOpt.isPresent()) {
                    profileName = cOpt.get().getUsername();
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

    @GetMapping("/tickets/org/{orgId}")
    public ResponseEntity<List<com.buildcon.erp.model.ChairmanTicket>> getTicketsByOrg(@PathVariable Long orgId) {
        List<com.buildcon.erp.model.ChairmanTicket> tickets = chairmanTicketRepository.findByOrganizationId(orgId);
        if (tickets.isEmpty()) {
            chairmanTicketRepository.save(new com.buildcon.erp.model.ChairmanTicket("Managing Director", "Review of Q2 Revenue Targets", "Need a detailed report on commercial segment profitability.", "Strategic Directive", "High", "Open", "2026-07-01", orgId));
            chairmanTicketRepository.save(new com.buildcon.erp.model.ChairmanTicket("Contractor", "Delay in Skyline Residences", "Concrete supply logistics are causing 3 weeks delay in slab construction.", "Delay Escalation", "Critical", "In Investigation", "2026-07-05", orgId));
            chairmanTicketRepository.save(new com.buildcon.erp.model.ChairmanTicket("Marketing Manager", "Vite/Next.js SEO Campaign Plan", "Approve SEO budgets for digital campaigns.", "Marketing Campaign", "Medium", "Open", "2026-07-08", orgId));
            tickets = chairmanTicketRepository.findByOrganizationId(orgId);
        }
        return ResponseEntity.ok(tickets);
    }

    @PostMapping("/tickets")
    public ResponseEntity<com.buildcon.erp.model.ChairmanTicket> createTicket(@RequestBody com.buildcon.erp.model.ChairmanTicket ticket) {
        return ResponseEntity.ok(chairmanTicketRepository.save(ticket));
    }

    @PutMapping("/tickets/{id}/status")
    public ResponseEntity<com.buildcon.erp.model.ChairmanTicket> updateTicketStatus(@PathVariable Long id, @RequestBody String status) {
        com.buildcon.erp.model.ChairmanTicket ticket = chairmanTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        String cleanStatus = status.replace("\"", "").trim();
        ticket.setStatus(cleanStatus);
        return ResponseEntity.ok(chairmanTicketRepository.save(ticket));
    }

    // ==========================================
    // 08. BOARD APPROVALS WITH CHAIRMAN REMARKS
    // ==========================================

    @GetMapping("/approvals/org/{orgId}")
    public ResponseEntity<List<com.buildcon.erp.model.BoardApproval>> getApprovalsByOrg(@PathVariable Long orgId) {
        List<com.buildcon.erp.model.BoardApproval> approvals = boardApprovalRepository.findByOrganizationId(orgId);
        if (approvals.isEmpty()) {
            // Seed initial realistic board approval requests with historical chairman remarks
            boardApprovalRepository.save(new com.buildcon.erp.model.BoardApproval(
                "PO", "Steel Procurement - Commercial Complex Tower B (Fe550D TMT Rebar)", "Rajesh Kumar", "Senior Site Engineer", "₹ 75.0 Lakhs", "High", "26 May 2026", "Pending", null, null, null, orgId
            ));
            boardApprovalRepository.save(new com.buildcon.erp.model.BoardApproval(
                "Investment", "Coimbatore Branch Operations Hub Expansion", "Executive Board", "Corporate Strategy TL", "₹ 1.5 Cr", "High", "27 May 2026", "Pending", null, null, null, orgId
            ));
            boardApprovalRepository.save(new com.buildcon.erp.model.BoardApproval(
                "Capex", "Tower Crane High-Rise CAPEX - Skyline IT Park", "Karthik R", "Project Director", "₹ 1.2 Cr", "Medium", "28 May 2026", "Pending", null, null, null, orgId
            ));
            boardApprovalRepository.save(new com.buildcon.erp.model.BoardApproval(
                "Opex", "Sub-Contractor Structural Invoice - ABC Foundations Ltd", "Amit Kumar", "Procurement Manager", "₹ 15.0 Lakhs", "Low", "28 May 2026", "Pending", null, null, null, orgId
            ));
            boardApprovalRepository.save(new com.buildcon.erp.model.BoardApproval(
                "Material", "Bulk OPC 53 Grade Cement Supply Order - Skyline Heights", "Vijay Kumar", "Store Manager", "₹ 45.0 Lakhs", "Medium", "28 May 2026", "Pending", null, null, null, orgId
            ));
            boardApprovalRepository.save(new com.buildcon.erp.model.BoardApproval(
                "Project", "Additional Civil Variations & Foundation Deepening", "Priya Raj", "Construction Manager", "₹ 8.5 Lakhs", "Medium", "29 May 2026", "Pending", null, null, null, orgId
            ));

            // Seed Approved with Chairman Remarks
            boardApprovalRepository.save(new com.buildcon.erp.model.BoardApproval(
                "Capex", "Heavy Hydraulic Excavator Purchase (Tier-2 Fleet)", "Karthik R", "Project Director", "₹ 85.0 Lakhs", "High", "20 May 2026", "Approved",
                "Approved: Release 20% mobilization advance immediately. Balance linked to manufacturer commissioning certificate and 3-year warranty sign-off.",
                "Chairman (Executive Directive)", "21 May 2026", orgId
            ));
            boardApprovalRepository.save(new com.buildcon.erp.model.BoardApproval(
                "Opex", "Skilled & Semi-Skilled Labor Biometric Settlement Week 20", "Anita Sharma", "HR & Workforce Manager", "₹ 24.5 Lakhs", "High", "22 May 2026", "Approved",
                "Approved on fast-track: Verified with biometric access gates at North Site. Finance to disburse direct DBT within 24 hours.",
                "Chairman (Executive Directive)", "22 May 2026", orgId
            ));

            // Seed Rejected with Chairman Remarks
            boardApprovalRepository.save(new com.buildcon.erp.model.BoardApproval(
                "Material", "Imported Premium Walnut Paneling for Clubhouse", "Vijay Kumar", "Store Manager", "₹ 18.0 Lakhs", "Low", "15 May 2026", "Rejected",
                "Rejected: Non-essential luxury finish upgrade exceeding baseline BOQ by 22%. Utilize local engineered seasoned teak or renegotiate vendor rates.",
                "Chairman (Executive Directive)", "16 May 2026", orgId
            ));

            approvals = boardApprovalRepository.findByOrganizationId(orgId);
        }
        return ResponseEntity.ok(approvals);
    }

    @PostMapping("/approvals")
    public ResponseEntity<com.buildcon.erp.model.BoardApproval> createApproval(@RequestBody com.buildcon.erp.model.BoardApproval approval) {
        if (approval.getStatus() == null || approval.getStatus().isBlank()) {
            approval.setStatus("Pending");
        }
        if (approval.getDate() == null || approval.getDate().isBlank()) {
            approval.setDate(java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy")));
        }
        return ResponseEntity.ok(boardApprovalRepository.save(approval));
    }

    @PostMapping("/approvals/{id}/action")
    public ResponseEntity<com.buildcon.erp.model.BoardApproval> processApprovalAction(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        com.buildcon.erp.model.BoardApproval approval = boardApprovalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Board approval request not found with ID: " + id));

        String action = payload.getOrDefault("action", "APPROVED").toUpperCase();
        String remarks = payload.getOrDefault("remarks", "");

        if ("APPROVED".equalsIgnoreCase(action) || "APPROVE".equalsIgnoreCase(action)) {
            approval.setStatus("Approved");
        } else {
            approval.setStatus("Rejected");
        }

        approval.setChairmanRemarks(remarks);
        approval.setApprovedBy("Chairman (Executive Board)");
        approval.setActionDate(java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")));

        return ResponseEntity.ok(boardApprovalRepository.save(approval));
    }

    // ==========================================
    // 05. CLIENT DIRECTORY 360° REPORT
    // ==========================================

    @GetMapping("/clients/org/{orgId}")
    public ResponseEntity<?> getClientDirectoryByOrg(@PathVariable Long orgId) {
        List<Project> orgProjects = projectRepository.findByOrganizationId(orgId);
        List<com.buildcon.erp.model.CustomerUser> clientUsers = customerUserRepository.findByOrganizationId(orgId);
        List<com.buildcon.erp.model.ClientTicket> clientTickets = clientTicketRepository.findByOrganizationId(orgId);

        // Pre-defined detailed client directory profiles linked to the organization's projects
        List<Map<String, Object>> clientList = new ArrayList<>();

        // Client 1: ABC Developers
        Map<String, Object> c1 = new HashMap<>();
        c1.put("id", 1);
        c1.put("name", "ABC Developers Pvt Ltd");
        c1.put("contactPerson", "Suresh Menon (VP Infrastructure)");
        c1.put("email", "suresh.menon@abcdev.com");
        c1.put("phone", "+91 98401 23456");
        c1.put("clientType", "Commercial Real Estate Developer");
        c1.put("onboardingDate", "15 Jan 2024");
        c1.put("contractValueINR", "₹ 78.50 Cr");
        c1.put("receivedValueINR", "₹ 62.80 Cr");
        c1.put("outstandingValueINR", "₹ 15.70 Cr");
        c1.put("status", "Active");
        c1.put("overallRating", 4.9);
        c1.put("npsCategory", "Promoter (Score: +88)");
        c1.put("review", "Exceptional structural engineering and rigorous on-site QA/QC execution. Milestone billings and transparent digital twin updates have given our board complete confidence. Ready to award Phase 3.");
        c1.put("reviewDate", "12 Oct 2026");
        c1.put("ratingBreakdown", Map.of(
            "workmanship", 5.0,
            "speed", 4.8,
            "transparency", 5.0,
            "safety", 4.9
        ));
        c1.put("projectProgress", Map.of(
            "projectName", "Skyline Tech Park - Tower B & Commercial Wing",
            "location", "Chennai ECR Road IT Corridor",
            "builtupSqft", "215,000 sq.ft",
            "plannedProgress", 90,
            "actualProgress", 88,
            "delayStatus", "On Track (Minor 2-day monsoon buffer absorbed)",
            "delayDays", 0,
            "targetHandover", "31 Dec 2026",
            "projectedCompletion", "28 Dec 2026",
            "milestones", List.of(
                Map.of("name", "M1: Deep Foundation & Raft Slab", "progress", 100, "status", "Completed", "verifiedBy", "Chief QA/QC"),
                Map.of("name", "M2: 7-Story RCC Moment Frame Columns", "progress", 100, "status", "Completed", "verifiedBy", "Senior Site Engineer"),
                Map.of("name", "M3: Double-Glazed Blue Curtain Wall Facade", "progress", 92, "status", "Active Execution", "verifiedBy", "Facade Specialist"),
                Map.of("name", "M4: Central Chiller HVAC & Dual Wet Risers", "progress", 84, "status", "In Progress", "verifiedBy", "MEP Consultant"),
                Map.of("name", "M5: Final Acoustic Drywalls & Occupancy Snagging", "progress", 65, "status", "Scheduled Next", "verifiedBy", "Site PM")
            )
        ));
        c1.put("historyTimeline", List.of(
            Map.of("date", "15 Jan 2024", "title", "Master Turnkey EPC Agreement Executed", "details", "Agreement signed for 215,000 sq.ft IT Commercial Park at ₹78.5 Cr."),
            Map.of("date", "18 Aug 2024", "title", "Foundation Stage Handover Signoff", "details", "All 182 bored cast-in-situ piles passed ultrasonic integrity testing."),
            Map.of("date", "20 May 2025", "title", "7-Story Superstructure Topping-Out", "details", "Slab 7 cast completed 14 days ahead of scheduled baseline."),
            Map.of("date", "15 Oct 2026", "title", "Milestone 4 Progress Claim Approved", "details", "Client certified ₹14.2 Cr claim with zero deduction.")
        ));
        clientList.add(c1);

        // Client 2: XYZ Constructions
        Map<String, Object> c2 = new HashMap<>();
        c2.put("id", 2);
        c2.put("name", "XYZ Constructions & Hospitality");
        c2.put("contactPerson", "Meenakshi Sundaram (Director of Projects)");
        c2.put("email", "m.sundaram@xyzconstructions.com");
        c2.put("phone", "+91 98840 98765");
        c2.put("clientType", "Luxury Hospitality & Mixed Use");
        c2.put("onboardingDate", "10 Mar 2024");
        c2.put("contractValueINR", "₹ 52.00 Cr");
        c2.put("receivedValueINR", "₹ 38.50 Cr");
        c2.put("outstandingValueINR", "₹ 13.50 Cr");
        c2.put("status", "Active");
        c2.put("overallRating", 4.7);
        c2.put("npsCategory", "Promoter (Score: +79)");
        c2.put("review", "Great communication and adaptive problem solving. Material test certificates and weekly drone progress reports keep our executive team fully informed.");
        c2.put("reviewDate", "05 Nov 2026");
        c2.put("ratingBreakdown", Map.of(
            "workmanship", 4.8,
            "speed", 4.5,
            "transparency", 4.9,
            "safety", 4.7
        ));
        c2.put("projectProgress", Map.of(
            "projectName", "Grand Horizon Luxury Resort & Suites",
            "location", "Oravakal Industrial Hub",
            "builtupSqft", "145,000 sq.ft",
            "plannedProgress", 82,
            "actualProgress", 78,
            "delayStatus", "Delayed by 7 Days (Supply chain rebar transit hold; double shifts deployed)",
            "delayDays", 7,
            "targetHandover", "28 Feb 2027",
            "projectedCompletion", "05 Mar 2027",
            "milestones", List.of(
                Map.of("name", "M1: Earthwork & Retaining Shear Wall", "progress", 100, "status", "Completed", "verifiedBy", "Geotech Consultant"),
                Map.of("name", "M2: Podium Deck & Banquet Structure", "progress", 100, "status", "Completed", "verifiedBy", "Senior Site Engineer"),
                Map.of("name", "M3: Resort Block 1 & 2 Concrete Slabs", "progress", 90, "status", "Active", "verifiedBy", "Structural Auditor"),
                Map.of("name", "M4: Infinity Pool Hydraulic Plumbing", "progress", 70, "status", "Active", "verifiedBy", "MEP Consultant"),
                Map.of("name", "M5: Italian Marble & Landscape Decks", "progress", 45, "status", "Pending Slab Release", "verifiedBy", "Interior PM")
            )
        ));
        c2.put("historyTimeline", List.of(
            Map.of("date", "10 Mar 2024", "title", "Contract Award & Mobilization Advance", "details", "Mobilization advance of ₹5.2 Cr received."),
            Map.of("date", "25 Nov 2024", "title", "Retaining Wall & Basement Handover", "details", "Retaining wall zero-water seepage certification achieved."),
            Map.of("date", "12 Jul 2025", "title", "Banquet Hall Grand Arch Casting", "details", "Special post-tensioned beam casting successfully executed.")
        ));
        clientList.add(c2);

        // Client 3: Dr. Rajesh K (Homeowner Unit 402)
        Map<String, Object> c3 = new HashMap<>();
        c3.put("id", 3);
        c3.put("name", "Dr. Rajesh K. (Owner Unit 402)");
        c3.put("contactPerson", "Dr. Rajesh Kumar (Cardiologist)");
        c3.put("email", "rajesh.k@customer.com");
        c3.put("phone", "+91 97100 44556");
        c3.put("clientType", "Premium High-Rise Apartment Buyer");
        c3.put("onboardingDate", "22 Aug 2024");
        c3.put("contractValueINR", "₹ 2.15 Cr");
        c3.put("receivedValueINR", "₹ 1.83 Cr");
        c3.put("outstandingValueINR", "₹ 0.32 Cr");
        c3.put("status", "Active (Near Handover)");
        c3.put("overallRating", 5.0);
        c3.put("npsCategory", "Promoter (Score: +100)");
        c3.put("review", "BuildCon's homeowner portal and transparent milestone alerts have been extraordinary. Every snag raised was resolved within 48 hours by site engineers. High quality vitrified tiling and sanitary fitments!");
        c3.put("reviewDate", "18 Nov 2026");
        c3.put("ratingBreakdown", Map.of(
            "workmanship", 5.0,
            "speed", 5.0,
            "transparency", 5.0,
            "safety", 5.0
        ));
        c3.put("projectProgress", Map.of(
            "projectName", "Skyline Towers - Tower A, Unit 402 (3BHK Luxury)",
            "location", "Chennai ECR Road",
            "builtupSqft", "2,400 sq.ft",
            "plannedProgress", 96,
            "actualProgress", 94,
            "delayStatus", "Ahead of Schedule (Possession walk-through scheduled early)",
            "delayDays", 0,
            "targetHandover", "15 Jan 2027",
            "projectedCompletion", "05 Jan 2027",
            "milestones", List.of(
                Map.of("name", "M1: Superstructure Slab Casting", "progress", 100, "status", "Completed", "verifiedBy", "Senior Site Engineer"),
                Map.of("name", "M2: Gypsum Plastering & Electrical Conduiting", "progress", 100, "status", "Completed", "verifiedBy", "QA Inspector"),
                Map.of("name", "M3: Vitrified 1200x600 Flooring & Granite Sills", "progress", 100, "status", "Completed", "verifiedBy", "Finishes Lead"),
                Map.of("name", "M4: Modular Kitchen & Sanitary Fixtures", "progress", 90, "status", "Snagging Active", "verifiedBy", "Site PM"),
                Map.of("name", "M5: Final Key Handover & Occupancy Certificate", "progress", 80, "status", "Final Signoff", "verifiedBy", "Customer Relations")
            )
        ));
        c3.put("historyTimeline", List.of(
            Map.of("date", "22 Aug 2024", "title", "Unit 402 Allotment & Agreement Executed", "details", "Agreement executed for 2,400 sq.ft 3BHK flat."),
            Map.of("date", "14 May 2025", "title", "4th Floor Slab Milestone Cleared", "details", "4th floor slab payment installment released."),
            Map.of("date", "15 Nov 2026", "title", "Pre-Possession Snag Walk-Through", "details", "Balcony grouting snag ticket raised and resolved same day.")
        ));
        clientList.add(c3);

        // Client 4: PQR Builders
        Map<String, Object> c4 = new HashMap<>();
        c4.put("id", 4);
        c4.put("name", "PQR Builders & Infrastructure");
        c4.put("contactPerson", "Gautam Singhania (Head of Procurement)");
        c4.put("email", "gautam.s@pqrbuilders.com");
        c4.put("phone", "+91 99200 33221");
        c4.put("clientType", "Infrastructure Joint Venture Partner");
        c4.put("onboardingDate", "05 May 2024");
        c4.put("contractValueINR", "₹ 38.20 Cr");
        c4.put("receivedValueINR", "₹ 29.80 Cr");
        c4.put("outstandingValueINR", "₹ 8.40 Cr");
        c4.put("status", "Active");
        c4.put("overallRating", 4.6);
        c4.put("npsCategory", "Promoter (Score: +74)");
        c4.put("review", "Highly disciplined site operations and adherence to safety protocols. Zero lost-time injury record across 18 months of intensive civil works.");
        c4.put("reviewDate", "29 Sep 2026");
        c4.put("ratingBreakdown", Map.of(
            "workmanship", 4.7,
            "speed", 4.4,
            "transparency", 4.8,
            "safety", 5.0
        ));
        c4.put("projectProgress", Map.of(
            "projectName", "Urban Logistics Park & Grade-A PEB Hub",
            "location", "Sriperumbudur Industrial Corridor",
            "builtupSqft", "180,000 sq.ft",
            "plannedProgress", 75,
            "actualProgress", 72,
            "delayStatus", "Delayed by 4 Days (High-wind crane erection advisory; recovered)",
            "delayDays", 4,
            "targetHandover", "15 Apr 2027",
            "projectedCompletion", "19 Apr 2027",
            "milestones", List.of(
                Map.of("name", "M1: Heavy Industrial Apron Pavement", "progress", 100, "status", "Completed", "verifiedBy", "Civil Lead"),
                Map.of("name", "M2: Pre-Engineered Steel Truss Erection", "progress", 88, "status", "Active", "verifiedBy", "PEB Specialist"),
                Map.of("name", "M3: Standing Seam Insulated Roof Cladding", "progress", 75, "status", "Active", "verifiedBy", "Safety Head"),
                Map.of("name", "M4: Fire Hydrant & Automatic Sprinkler Grid", "progress", 60, "status", "In Progress", "verifiedBy", "Fire Safety Consultant")
            )
        ));
        c4.put("historyTimeline", List.of(
            Map.of("date", "05 May 2024", "title", "Turnkey PEB Warehouse EPC Signed", "details", "Project contract of ₹38.2 Cr signed with 12-month delivery target."),
            Map.of("date", "14 Feb 2025", "title", "Laser-Screed Industrial Flooring Completed", "details", "Achieved FM2 floor flatess standards verified by third-party testing.")
        ));
        clientList.add(c4);

        // Client 5: L&N Properties
        Map<String, Object> c5 = new HashMap<>();
        c5.put("id", 5);
        c5.put("name", "L&N Real Estate Assets Ltd");
        c5.put("contactPerson", "Anand Vardhan (Chief Investment Officer)");
        c5.put("email", "anand.vardhan@lnproperties.com");
        c5.put("phone", "+91 98111 66778");
        c5.put("clientType", "Institutional Real Estate Fund");
        c5.put("onboardingDate", "12 Nov 2024");
        c5.put("contractValueINR", "₹ 25.00 Cr");
        c5.put("receivedValueINR", "₹ 21.00 Cr");
        c5.put("outstandingValueINR", "₹ 4.00 Cr");
        c5.put("status", "Active");
        c5.put("overallRating", 4.8);
        c5.put("npsCategory", "Promoter (Score: +85)");
        c5.put("review", "Timely reporting and top-tier financial governance. BuildCon's digital ERP ensures every rupee spent is linked to verifiable site milestones.");
        c5.put("reviewDate", "14 Nov 2026");
        c5.put("ratingBreakdown", Map.of(
            "workmanship", 4.9,
            "speed", 4.7,
            "transparency", 5.0,
            "safety", 4.8
        ));
        c5.put("projectProgress", Map.of(
            "projectName", "L&N Boutique Executive Suites",
            "location", "Anna Nagar West",
            "builtupSqft", "65,000 sq.ft",
            "plannedProgress", 88,
            "actualProgress", 86,
            "delayStatus", "On Track",
            "delayDays", 0,
            "targetHandover", "30 Jan 2027",
            "projectedCompletion", "28 Jan 2027",
            "milestones", List.of(
                Map.of("name", "M1: Bored Piles & Raft Casting", "progress", 100, "status", "Completed", "verifiedBy", "Senior Site Engineer"),
                Map.of("name", "M2: 5-Story RCC Superstructure", "progress", 100, "status", "Completed", "verifiedBy", "Structural Auditor"),
                Map.of("name", "M3: Terracotta Louvered Exterior Cladding", "progress", 85, "status", "Active", "verifiedBy", "Architect Cell"),
                Map.of("name", "M4: VRF Air Conditioning & Smart BMS", "progress", 78, "status", "In Progress", "verifiedBy", "MEP Consultant")
            )
        ));
        c5.put("historyTimeline", List.of(
            Map.of("date", "12 Nov 2024", "title", "EPC Development Agreement Awarded", "details", "Agreement valued at ₹25 Cr executed with 14-month completion schedule."),
            Map.of("date", "10 Aug 2025", "title", "Superstructure Completion Inspection", "details", "Passed zero-defect audit by institutional lenders.")
        ));
        clientList.add(c5);

        Map<String, Object> response = new HashMap<>();
        response.put("organizationId", orgId);
        response.put("totalClients", clientList.size());
        response.put("clients", clientList);
        response.put("averageRating", 4.8);
        response.put("totalContractPortfolioINR", "₹ 211.85 Cr");
        response.put("totalCollectedINR", "₹ 164.43 Cr");
        response.put("totalOutstandingINR", "₹ 47.42 Cr");
        response.put("onTrackProjectsCount", 3);
        response.put("delayedProjectsCount", 2);

        return ResponseEntity.ok(response);
    }
}
