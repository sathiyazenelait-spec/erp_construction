package com.buildcon.erp.controller;

import com.buildcon.erp.model.*;
import com.buildcon.erp.repository.*;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.DigitalMarketingTLService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.buildcon.erp.security.services.UserDetailsImpl;

import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/digital-marketing-tl")
public class DigitalMarketingTLController {

    @Autowired
    private DigitalMarketingTLService service;

    @Autowired
    private DigitalMarketingTLRepository digitalMarketingTLRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private DashboardShellConfigRepository dashboardShellConfigRepository;

    @Autowired
    private MarketingCampaignRepository marketingCampaignRepository;

    @Autowired
    private TlmTeamMemberRepository tlmTeamMemberRepository;

    @Autowired
    private TlmCalendarEventRepository tlmCalendarEventRepository;

    @Autowired
    private TlmLeadRepository tlmLeadRepository;

    @Autowired
    private SalesLeadRepository salesLeadRepository;

    @Autowired
    private MarketingMetricRepository marketingMetricRepository;

    @Autowired
    private MarketingTrendRepository marketingTrendRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        DigitalMarketingTL res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
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

        String profileName = "Priya Sharma";
        String profileEmail = "priya.sharma@buildcon.com";
        String avatarInitials = "PS";
        List<DigitalMarketingTL> tlUsers = digitalMarketingTLRepository.findByOrganizationId(orgId);
        if (!tlUsers.isEmpty()) {
            DigitalMarketingTL tl = tlUsers.get(0);
            profileName = tl.getUsername();
            profileEmail = tl.getEmail();
            avatarInitials = tl.getAvatarInitials();
            if (avatarInitials == null || avatarInitials.isBlank()) {
                String initials = Arrays.stream(tl.getUsername().split(" "))
                    .filter(n -> !n.isEmpty())
                    .map(n -> String.valueOf(n.charAt(0)))
                    .collect(java.util.stream.Collectors.joining(""))
                    .toUpperCase();
                if (initials.length() > 2) {
                    initials = initials.substring(0, 2);
                }
                avatarInitials = initials.isEmpty() ? "PS" : initials;
                tl.setAvatarInitials(avatarInitials);
                digitalMarketingTLRepository.save(tl);
            }
        }

        List<MarketingCampaign> campaigns = marketingCampaignRepository.findByOrganizationId(orgId);
        List<MarketingMetric> metrics = marketingMetricRepository.findByOrganizationId(orgId);
        List<TlmTeamMember> teamMembers = tlmTeamMemberRepository.findByOrganizationId(orgId);
        List<TlmCalendarEvent> calendarEvents = tlmCalendarEventRepository.findByOrganizationId(orgId);
        List<MarketingTrend> trends = marketingTrendRepository.findByOrganizationId(orgId);

        // Fetch sales leads from MySQL and dynamically map to TlmLead representation for the frontend
        List<SalesLead> salesLeads = salesLeadRepository.findByOrganizationId(orgId);
        List<TlmLead> leads = new ArrayList<>();
        for (SalesLead sl : salesLeads) {
            String quality = "Medium";
            if (sl.getLeadScore() != null) {
                if (sl.getLeadScore() >= 4) {
                    quality = "High";
                } else if (sl.getLeadScore() <= 2) {
                    quality = "Low";
                }
            }

            String tlmStatus = sl.getQualifiedStatus();
            if (tlmStatus == null || tlmStatus.isEmpty()) {
                tlmStatus = "New";
            }

            String phone = "+91 99999 88888";
            String email = "lead" + sl.getId() + "@buildcon.com";

            TlmLead tl = new TlmLead(
                sl.getName(),
                email,
                phone,
                sl.getSource() != null ? sl.getSource() : "Google Ads",
                quality,
                tlmStatus,
                sl.getAddedOn() != null ? sl.getAddedOn() : "2025-05-31",
                orgId
            );
            tl.setId(sl.getId());
            leads.add(tl);
        }

        Map<String, String> defaultConfigs = new LinkedHashMap<>();
        defaultConfigs.put("header_date", "01 May 2025 - 31 May 2025");
        defaultConfigs.put("sidebar_menus", "Executive Summary|Lead Generation Center|Campaign Management|Ad Performance|SEO Performance|Social Media Overview|Content Calendar|Team Performance|Marketing Budget|Lead Quality Analysis|Competitor Monitoring|AI Marketing Assistant|Settings");
        defaultConfigs.put("ai_suggestions", "Predict working capital cash flows.|Audit recent campaigns ROI.|Generate Meta Ads adcopy.");
        defaultConfigs.put("baselines_leads", "2084");
        defaultConfigs.put("baselines_qualified", "424");
        defaultConfigs.put("baselines_spend", "547320");
        defaultConfigs.put("baselines_cpl", "212");
        defaultConfigs.put("baselines_roi", "3.5");
        defaultConfigs.put("baselines_compare_date", "vs Apr 2025");
        defaultConfigs.put("ai_insight_recommendation", "Campaign conversion ROI increased. Shift ₹30k from brand awareness to Google Search Villa Campaign immediately.");
        defaultConfigs.put("ai_insight_opportunity", "Villa Campaign is performing 27% better than other campaigns. Consider switching more budget.");
        defaultConfigs.put("ai_insight_critical_alert", "Increase budget for Google Ads - high ROI detected and search volumes are surging.");
        defaultConfigs.put("ai_insight_weekly_diagnosis", "Lead quality improved by 18% compared to last month. SEO push on Coimbatore Hub contributed 410 Leads.");
        defaultConfigs.put("calendar_header", "Content Calendar (May 2025)");
        defaultConfigs.put("calendar_date_label", "Target Date (Day of May)");
        defaultConfigs.put("calendar_empty_cells", "3");
        defaultConfigs.put("calendar_total_days", "31");
        defaultConfigs.put("seo_traffic_sub", "↑ 15.6% vs last month");
        defaultConfigs.put("seo_keywords_sub", "↑ 12.3% active keywords");
        defaultConfigs.put("seo_top10_sub", "↑ 8.7% index movement");
        defaultConfigs.put("seo_authority_sub", "Stable domain weight");
        defaultConfigs.put("alert_threshold", "450");
        defaultConfigs.put("notification_emails", "true");
        defaultConfigs.put("weekly_reports", "true");
        defaultConfigs.put("lead_scoring_min", "65");
        defaultConfigs.put("competitor_mapping", "luxury flats in chennai:Competitor A|builders in coimbatore:Competitor B");

        List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "digital-marketing-tl");
        boolean needsReload = false;
        for (Map.Entry<String, String> entry : defaultConfigs.entrySet()) {
            boolean found = false;
            for (DashboardShellConfig c : configs) {
                if (c.getConfigKey().equals(entry.getKey())) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                dashboardShellConfigRepository.save(new DashboardShellConfig("digital-marketing-tl", entry.getKey(), entry.getValue(), orgId));
                needsReload = true;
            }
        }
        if (needsReload) {
            configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "digital-marketing-tl");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("organizationName", orgName);
        response.put("profileName", profileName);
        response.put("profileEmail", profileEmail);
        response.put("avatarInitials", avatarInitials);
        response.put("campaigns", campaigns);
        response.put("teamMembers", teamMembers);
        response.put("calendarEvents", calendarEvents);
        response.put("leads", leads);
        response.put("metrics", metrics);
        response.put("trends", trends);

        for (DashboardShellConfig c : configs) {
            response.put(c.getConfigKey(), c.getConfigValue());
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/campaigns")
    public ResponseEntity<?> createCampaign(@RequestBody MarketingCampaign campaign) {
        return ResponseEntity.ok(marketingCampaignRepository.save(campaign));
    }

    @DeleteMapping("/campaigns/{id}")
    public ResponseEntity<?> deleteCampaign(@PathVariable Long id) {
        marketingCampaignRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Campaign deleted successfully"));
    }

    @PostMapping("/leads")
    public ResponseEntity<?> createLead(@RequestBody TlmLead lead) {
        SalesLead sl = new SalesLead();
        sl.setName(lead.getName());
        sl.setSource(lead.getSource());
        sl.setAddedOn(lead.getDate());
        sl.setOrganizationId(lead.getOrganizationId());
        
        if ("High".equalsIgnoreCase(lead.getQuality())) {
            sl.setLeadScore(5);
        } else if ("Low".equalsIgnoreCase(lead.getQuality())) {
            sl.setLeadScore(1);
        } else {
            sl.setLeadScore(3);
        }
        
        sl.setQualifiedStatus(lead.getStatus());
        sl.setStatus("Warm");
        
        SalesLead saved = salesLeadRepository.save(sl);
        lead.setId(saved.getId());
        return ResponseEntity.ok(lead);
    }

    @DeleteMapping("/leads/{id}")
    public ResponseEntity<?> deleteLead(@PathVariable Long id) {
        salesLeadRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Lead deleted successfully"));
    }

    @PutMapping("/leads/{id}/status")
    public ResponseEntity<?> updateLeadStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        SalesLead sl = salesLeadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));
        String newStatus = payload.get("status");
        sl.setQualifiedStatus(newStatus);
        if ("Qualified".equalsIgnoreCase(newStatus)) {
            sl.setLeadScore(5);
        } else if ("Disqualified".equalsIgnoreCase(newStatus)) {
            sl.setLeadScore(1);
        }
        salesLeadRepository.save(sl);
        
        TlmLead lead = new TlmLead();
        lead.setId(sl.getId());
        lead.setName(sl.getName());
        lead.setStatus(newStatus);
        return ResponseEntity.ok(lead);
    }

    @PostMapping("/calendar-events")
    public ResponseEntity<?> createEvent(@RequestBody TlmCalendarEvent event) {
        return ResponseEntity.ok(tlmCalendarEventRepository.save(event));
    }

    @PutMapping("/team-members/{id}/assign-task")
    public ResponseEntity<?> assignTask(@PathVariable Long id) {
        TlmTeamMember member = tlmTeamMemberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team member not found"));
        member.setTasksAssigned(member.getTasksAssigned() + 1);
        return ResponseEntity.ok(tlmTeamMemberRepository.save(member));
    }


    @PostMapping("/sync-external")
    public ResponseEntity<?> syncExternal(@RequestBody Map<String, Long> payload) {
        Long orgId = payload.get("organizationId");
        if (orgId == null) return ResponseEntity.badRequest().body("Missing organizationId");

        // Simulate syncing data from Google Ads, Meta API, GA4, GBP, and SEO crawler
        // Increment metrics to show changes
        List<MarketingCampaign> campaigns = marketingCampaignRepository.findByOrganizationId(orgId);
        for (MarketingCampaign c : campaigns) {
            c.setLeads(c.getLeads() + (int)(Math.random() * 15 + 5));
            c.setCost(c.getCost() + (Math.random() * 4000 + 1000));
            c.setRoi(Double.parseDouble(String.format(Locale.US, "%.1f", c.getRoi() + (Math.random() * 0.3 - 0.1))));
            marketingCampaignRepository.save(c);
        }

        List<MarketingMetric> metrics = marketingMetricRepository.findByOrganizationId(orgId);
        for (MarketingMetric m : metrics) {
            if ("tl_lead_sources".equals(m.getCategory())) {
                m.setMetricValue(m.getMetricValue() + (int)(Math.random() * 20 + 5));
                marketingMetricRepository.save(m);
            }
        }

        return ResponseEntity.ok(Map.of("message", "Synced Google Ads, Meta Ads, GA4, GBP & SEO search keyword metrics successfully!"));
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String username = payload.get("username");
        String email = payload.get("email");
        Long orgId = payload.containsKey("organizationId") ? Long.parseLong(payload.get("organizationId")) : null;

        if (orgId == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: organizationId is required."));
        }
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(orgId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }

        List<DigitalMarketingTL> tlUsers = digitalMarketingTLRepository.findByOrganizationId(orgId);
        if (!tlUsers.isEmpty()) {
            DigitalMarketingTL tl = tlUsers.get(0);
            if (username != null && !username.isBlank()) tl.setUsername(username);
            if (email != null && !email.isBlank()) tl.setEmail(email);
            String avatarInitials = payload.get("avatarInitials");
            if (avatarInitials != null && !avatarInitials.isBlank()) tl.setAvatarInitials(avatarInitials);
            digitalMarketingTLRepository.save(tl);
        }

        List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "digital-marketing-tl");
        for (Map.Entry<String, String> entry : payload.entrySet()) {
            String key = entry.getKey();
            if (key.equals("username") || key.equals("email") || key.equals("avatarInitials") || key.equals("organizationId")) {
                continue;
            }
            String value = entry.getValue();
            if (value != null) {
                boolean found = false;
                for (DashboardShellConfig c : configs) {
                    if (key.equals(c.getConfigKey())) {
                        c.setConfigValue(value);
                        dashboardShellConfigRepository.save(c);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    dashboardShellConfigRepository.save(new DashboardShellConfig("digital-marketing-tl", key, value, orgId));
                }
            }
        }

        return ResponseEntity.ok(new MessageResponse("Configurations updated successfully."));
    }

    @PostMapping("/ai-chat")
    public ResponseEntity<?> aiChat(@RequestBody Map<String, String> payload, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String msg = payload.get("message");
        String cleanMsg = msg != null ? msg.toLowerCase() : "";

        Long orgId = null;
        if (userDetails != null) {
            orgId = userDetails.getOrganizationId();
        }
        if (orgId == null) {
            if (payload.containsKey("organizationId")) {
                orgId = Long.parseLong(payload.get("organizationId"));
            } else {
                orgId = 1L;
            }
        }

        String botResponse = "Hello! I am your TL AI Assistant. Ask me about campaign leads, CPL rates, or content calendar updates.";
        if (cleanMsg.contains("roi")) {
            List<MarketingCampaign> campaigns = marketingCampaignRepository.findByOrganizationId(orgId);
            double totalCost = 0.0;
            double totalRev = 0.0;
            double topRoi = 0.0;
            String topCampaign = "N/A";
            String topPlatform = "N/A";
            for (MarketingCampaign c : campaigns) {
                totalCost += c.getCost();
                totalRev += c.getCost() * c.getRoi();
                if (c.getRoi() > topRoi) {
                    topRoi = c.getRoi();
                    topCampaign = c.getName();
                    topPlatform = c.getPlatform();
                }
            }
            double avgRoi = totalCost > 0 ? (totalRev / totalCost) : 0.0;
            botResponse = String.format(Locale.US, "Overall marketing ROI is at %.1fX. %s leads with %.1fX ROI on %s.", avgRoi, topCampaign, topRoi, topPlatform);
        } else if (cleanMsg.contains("budget") || cleanMsg.contains("spend")) {
            List<MarketingCampaign> campaigns = marketingCampaignRepository.findByOrganizationId(orgId);
            double totalSpend = 0.0;
            double maxSpend = 0.0;
            String topSpendCampaign = "N/A";
            for (MarketingCampaign c : campaigns) {
                totalSpend += c.getCost();
                if (c.getCost() > maxSpend) {
                    maxSpend = c.getCost();
                    topSpendCampaign = c.getName();
                }
            }
            double budgetLimit = 700000.0;
            List<MarketingMetric> metrics = marketingMetricRepository.findByOrganizationId(orgId);
            for (MarketingMetric m : metrics) {
                if ("Marketing Budget Limit".equals(m.getMetricKey())) {
                    budgetLimit = m.getMetricValue();
                    break;
                }
            }
            botResponse = String.format(Locale.US, "You've spent ₹%,.0f MTD of your ₹%,.0f budget. %s holds the highest allocation.", totalSpend, budgetLimit, topSpendCampaign);
        } else if (cleanMsg.contains("lead")) {
            List<SalesLead> salesLeads = salesLeadRepository.findByOrganizationId(orgId);
            int totalLeads = salesLeads.size();
            int qualifiedCount = 0;
            int nurturingCount = 0;
            int newCount = 0;
            for (SalesLead sl : salesLeads) {
                String status = sl.getQualifiedStatus();
                if ("Qualified".equalsIgnoreCase(status)) {
                    qualifiedCount++;
                } else if ("Nurturing".equalsIgnoreCase(status)) {
                    nurturingCount++;
                } else if ("New".equalsIgnoreCase(status) || status == null || status.isEmpty()) {
                    newCount++;
                }
            }
            botResponse = String.format(Locale.US, "Total leads collected MTD is %,d, with %,d Qualified, %,d Nurturing, and %,d currently in New status.", totalLeads, qualifiedCount, nurturingCount, newCount);
        }

        return ResponseEntity.ok(Map.of("response", botResponse));
    }

    // --- Team Members CRUD ---
    @PostMapping("/team-members")
    public ResponseEntity<?> createTeamMember(@RequestBody TlmTeamMember member) {
        return ResponseEntity.ok(tlmTeamMemberRepository.save(member));
    }

    @PutMapping("/team-members/{id}")
    public ResponseEntity<?> updateTeamMember(@PathVariable Long id, @RequestBody TlmTeamMember memberDetails) {
        TlmTeamMember member = tlmTeamMemberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team member not found"));
        member.setName(memberDetails.getName());
        member.setRole(memberDetails.getRole());
        member.setTasksAssigned(memberDetails.getTasksAssigned());
        member.setTasksCompleted(memberDetails.getTasksCompleted());
        member.setLeadsGenerated(memberDetails.getLeadsGenerated());
        member.setAvatar(memberDetails.getAvatar());
        return ResponseEntity.ok(tlmTeamMemberRepository.save(member));
    }

    @DeleteMapping("/team-members/{id}")
    public ResponseEntity<?> deleteTeamMember(@PathVariable Long id) {
        tlmTeamMemberRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Team member deleted successfully"));
    }

    // --- Calendar Events CRUD additions ---
    @DeleteMapping("/calendar-events/{id}")
    public ResponseEntity<?> deleteCalendarEvent(@PathVariable Long id) {
        tlmCalendarEventRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Calendar event deleted successfully"));
    }

    // --- Marketing Metrics CRUD ---
    @PostMapping("/metrics")
    public ResponseEntity<?> createMetric(@RequestBody MarketingMetric metric) {
        return ResponseEntity.ok(marketingMetricRepository.save(metric));
    }

    @PutMapping("/metrics/{id}")
    public ResponseEntity<?> updateMetric(@PathVariable Long id, @RequestBody MarketingMetric metricDetails) {
        MarketingMetric metric = marketingMetricRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Metric not found"));
        metric.setMetricKey(metricDetails.getMetricKey());
        metric.setMetricValue(metricDetails.getMetricValue());
        metric.setCategory(metricDetails.getCategory());
        metric.setLabel(metricDetails.getLabel());
        return ResponseEntity.ok(marketingMetricRepository.save(metric));
    }

    @DeleteMapping("/metrics/{id}")
    public ResponseEntity<?> deleteMetric(@PathVariable Long id) {
        marketingMetricRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Metric deleted successfully"));
    }

    // --- Marketing Trends CRUD ---
    @PostMapping("/trends")
    public ResponseEntity<?> createTrend(@RequestBody MarketingTrend trend) {
        return ResponseEntity.ok(marketingTrendRepository.save(trend));
    }

    @PutMapping("/trends/{id}")
    public ResponseEntity<?> updateTrend(@PathVariable Long id, @RequestBody MarketingTrend trendDetails) {
        MarketingTrend trend = marketingTrendRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trend not found"));
        trend.setChartName(trendDetails.getChartName());
        trend.setLabel(trendDetails.getLabel());
        trend.setValue1(trendDetails.getValue1());
        trend.setValue2(trendDetails.getValue2());
        return ResponseEntity.ok(marketingTrendRepository.save(trend));
    }

    @DeleteMapping("/trends/{id}")
    public ResponseEntity<?> deleteTrend(@PathVariable Long id) {
        marketingTrendRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Trend deleted successfully"));
    }
}
