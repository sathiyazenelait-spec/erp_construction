package com.buildcon.erp.controller;

import com.buildcon.erp.model.*;
import com.buildcon.erp.repository.*;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.MarketingManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/marketing-manager")
public class MarketingManagerController {

    @Autowired
    private MarketingManagerService service;

    @Autowired
    private MarketingCampaignRepository marketingCampaignRepository;

    @Autowired
    private MarketingMetricRepository marketingMetricRepository;

    @Autowired
    private MarketingTrendRepository marketingTrendRepository;

    @Autowired
    private SocialPostMetricRepository socialPostMetricRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        MarketingManager res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
    }

    private void updateOrCreateMetric(List<MarketingMetric> metrics, String key, Double val, String category, String label, Long orgId) {
        MarketingMetric metric = metrics.stream()
            .filter(m -> key.equals(m.getMetricKey()))
            .findFirst()
            .orElse(null);
        if (metric != null) {
            metric.setMetricValue(val);
            marketingMetricRepository.save(metric);
        } else {
            MarketingMetric newMetric = new MarketingMetric(key, val, category, label, orgId);
            marketingMetricRepository.save(newMetric);
            metrics.add(newMetric);
        }
    }

    @GetMapping("/dashboard/org/{orgId}")
    public ResponseEntity<?> getDashboard(@PathVariable Long orgId) {
        List<MarketingCampaign> campaigns = marketingCampaignRepository.findByOrganizationId(orgId);

        // Dynamically compute KPI metrics based on live campaigns
        double totalLeads = 0;
        double totalCost = 0;
        double totalRevenue = 0;
        for (MarketingCampaign c : campaigns) {
            totalLeads += c.getLeads() != null ? c.getLeads() : 0;
            double cost = c.getCost() != null ? c.getCost() : 0;
            totalCost += cost;
            double roi = c.getRoi() != null ? c.getRoi() : 0;
            totalRevenue += cost * roi;
        }
        double adSpendsLakhs = totalCost / 100000.0;
        double overallRoi = totalCost > 0 ? totalRevenue / totalCost : 0.0;

        List<MarketingMetric> metrics = marketingMetricRepository.findByOrganizationId(orgId);
        
        // Sync calculated KPI metrics with the database/list
        updateOrCreateMetric(metrics, "mgr_total_leads", totalLeads, "marketing_manager_kpis", "Total Leads (MTD)", orgId);
        updateOrCreateMetric(metrics, "mgr_ad_spends", Double.parseDouble(String.format(Locale.US, "%.2f", adSpendsLakhs)), "marketing_manager_kpis", "Ad Spends MTD", orgId);
        updateOrCreateMetric(metrics, "mgr_roi", Double.parseDouble(String.format(Locale.US, "%.2f", overallRoi)), "marketing_manager_kpis", "Overall Marketing ROI", orgId);

        // Ensure subtitle metrics exist
        boolean hasSpendSub = metrics.stream().anyMatch(m -> "mgr_spend_sub".equals(m.getMetricKey()));
        if (!hasSpendSub) {
            updateOrCreateMetric(metrics, "mgr_spend_sub", 0.0, "marketing_manager_kpi_subs", "Within budget allocations", orgId);
        }
        boolean hasRoiSub = metrics.stream().anyMatch(m -> "mgr_roi_sub".equals(m.getMetricKey()));
        if (!hasRoiSub) {
            updateOrCreateMetric(metrics, "mgr_roi_sub", 0.0, "marketing_manager_kpi_subs", "Optimal efficiency ratio", orgId);
        }
        boolean hasConvSub = metrics.stream().anyMatch(m -> "mgr_conv_rate_sub".equals(m.getMetricKey()));
        if (!hasConvSub) {
            updateOrCreateMetric(metrics, "mgr_conv_rate_sub", 0.0, "marketing_manager_kpi_subs", "↑ 0.8% increase", orgId);
        }

        // Sync channel metrics dynamically too!
        Map<String, Double> platformLeads = new HashMap<>();
        for (MarketingCampaign c : campaigns) {
            platformLeads.put(c.getPlatform(), platformLeads.getOrDefault(c.getPlatform(), 0.0) + (c.getLeads() != null ? c.getLeads() : 0));
        }
        for (Map.Entry<String, Double> entry : platformLeads.entrySet()) {
            updateOrCreateMetric(metrics, entry.getKey(), entry.getValue(), "marketing_manager_channels", entry.getKey(), orgId);
        }

        List<MarketingTrend> trends = marketingTrendRepository.findByOrganizationId(orgId);
        List<SocialPostMetric> socialPosts = socialPostMetricRepository.findByOrganizationId(orgId);

        Map<String, Object> response = new HashMap<>();
        response.put("campaigns", campaigns);
        response.put("metrics", metrics);
        response.put("trends", trends);
        response.put("socialPosts", socialPosts);
        response.put("aiSuggestions", List.of(
            "Which platform has the lowest CPL?",
            "Show Google Ads search trends",
            "Forecast leads next month",
            "Analyze competitor traffic metrics"
        ));

        return ResponseEntity.ok(response);
    }
    @PostMapping("/sync-external")
    public ResponseEntity<?> syncExternal(@RequestBody Map<String, Long> payload) {
        Long orgId = payload.get("organizationId");
        if (orgId == null) return ResponseEntity.badRequest().body("Missing organizationId");

        // Simulate syncing data from Google Ads, Meta API, GA4, GBP, and SEO crawler
        // Increment campaign metrics dynamically
        List<MarketingCampaign> campaigns = marketingCampaignRepository.findByOrganizationId(orgId);
        for (MarketingCampaign c : campaigns) {
            c.setLeads(c.getLeads() + (int)(Math.random() * 20 + 5));
            c.setCost(c.getCost() + (Math.random() * 5000 + 1000));
            if (c.getLeads() > 0) {
                c.setCpl(String.valueOf(Math.round(c.getCost() / c.getLeads())));
            }
            c.setRoi(Double.parseDouble(String.format(Locale.US, "%.1f", c.getRoi() + (Math.random() * 0.4 - 0.1))));
            marketingCampaignRepository.save(c);
        }

        // Dynamically compute new KPI totals
        double totalLeads = 0;
        double totalCost = 0;
        double totalRevenue = 0;
        for (MarketingCampaign c : campaigns) {
            totalLeads += c.getLeads() != null ? c.getLeads() : 0;
            double cost = c.getCost() != null ? c.getCost() : 0;
            totalCost += cost;
            double roi = c.getRoi() != null ? c.getRoi() : 0;
            totalRevenue += cost * roi;
        }
        double adSpendsLakhs = totalCost / 100000.0;
        double overallRoi = totalCost > 0 ? totalRevenue / totalCost : 3.8;

        List<MarketingMetric> metrics = marketingMetricRepository.findByOrganizationId(orgId);
        updateOrCreateMetric(metrics, "mgr_total_leads", totalLeads, "marketing_manager_kpis", "Total Leads (MTD)", orgId);
        updateOrCreateMetric(metrics, "mgr_ad_spends", Double.parseDouble(String.format(Locale.US, "%.2f", adSpendsLakhs)), "marketing_manager_kpis", "Ad Spends MTD", orgId);
        updateOrCreateMetric(metrics, "mgr_roi", Double.parseDouble(String.format(Locale.US, "%.2f", overallRoi)), "marketing_manager_kpis", "Overall Marketing ROI", orgId);

        // Update channels
        Map<String, Double> platformLeads = new HashMap<>();
        for (MarketingCampaign c : campaigns) {
            platformLeads.put(c.getPlatform(), platformLeads.getOrDefault(c.getPlatform(), 0.0) + (c.getLeads() != null ? c.getLeads() : 0));
        }
        for (Map.Entry<String, Double> entry : platformLeads.entrySet()) {
            updateOrCreateMetric(metrics, entry.getKey(), entry.getValue(), "marketing_manager_channels", entry.getKey(), orgId);
        }

        // Synchronize follower count updates randomly on sync
        for (MarketingMetric m : metrics) {
            if ("social_followers".equals(m.getCategory())) {
                m.setMetricValue(m.getMetricValue() + (int)(Math.random() * 150 + 50));
                marketingMetricRepository.save(m);
            }
        }

        // Synchronize social media post reach & engagement metrics dynamically on sync
        List<SocialPostMetric> socialPosts = socialPostMetricRepository.findByOrganizationId(orgId);
        for (SocialPostMetric sp : socialPosts) {
            try {
                String cleanReach = sp.getReach().replace("K Reach", "").replace(" Reach", "").trim();
                double reachVal = Double.parseDouble(cleanReach);
                reachVal += Math.random() * 5 + 1;
                sp.setReach(String.format(Locale.US, "%.1fK Reach", reachVal));
            } catch (Exception e) {
                sp.setReach("30.5K Reach");
            }
            try {
                String cleanEng = sp.getEngagement().replace("K Eng", "").replace(" Eng", "").trim();
                double engVal = Double.parseDouble(cleanEng);
                engVal += Math.random() * 0.5 + 0.1;
                sp.setEngagement(String.format(Locale.US, "%.1fK Eng", engVal));
            } catch (Exception e) {
                sp.setEngagement("3.2K Eng");
            }
            socialPostMetricRepository.save(sp);
        }

        // Update latest month's trend data point (May/latest) to match the new sync state
        List<MarketingTrend> trends = marketingTrendRepository.findByOrganizationId(orgId);
        if (!trends.isEmpty()) {
            MarketingTrend lastTrend = trends.get(trends.size() - 1);
            lastTrend.setValue1(Double.parseDouble(String.format(Locale.US, "%.2f", adSpendsLakhs)));
            lastTrend.setValue2(totalLeads);
            marketingTrendRepository.save(lastTrend);
        }

        return ResponseEntity.ok(Map.of("message", "Synced Google Ads, Meta Ads, GA4, GBP & SEO search keyword metrics successfully!"));
    }

    @PostMapping("/ai-chat")
    public ResponseEntity<?> aiChat(@RequestBody Map<String, String> payload) {
        String msg = payload.get("message");
        String cleanMsg = msg != null ? msg.toLowerCase() : "";

        String botResponse = "I can analyze your campaigns, spends, and lead conversions. Ask me about ROI, budget status, or CPL!";
        if (cleanMsg.contains("roi")) {
            botResponse = "Our ROI metrics show overall marketing efficiency at 3.8X. Google Ads leads with 3.8X, and Meta Ads shows high engagement with 4.6X ROI.";
        } else if (cleanMsg.contains("cpl") || cleanMsg.contains("cost per lead")) {
            botResponse = "Current Cost Per Lead (CPL) is lowest for Coimbatore Hub SEO push (₹195), while Skyline Residences Google Ads CPL is ₹293.";
        } else if (cleanMsg.contains("spend") || cleanMsg.contains("budget")) {
            botResponse = "We have spent ₹4.8 Lakhs MTD. Skyline Residences launch holds the highest spend share at ₹2.2 L.";
        } else if (cleanMsg.contains("forecast") || cleanMsg.contains("next month")) {
            botResponse = "Based on current conversion rates and SEO visibility trends, next month's leads are forecasted to grow by 12% to approximately 2,070 leads.";
        }

        return ResponseEntity.ok(Map.of("response", botResponse));
    }
}
