package com.buildcon.erp.controller;

import com.buildcon.erp.model.*;
import com.buildcon.erp.repository.*;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.DigitalMarketingExecutiveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/digital-marketing-executive")
public class DigitalMarketingExecutiveController {

    @Autowired
    private DigitalMarketingExecutiveService service;

    @Autowired
    private MarketingTaskRepository marketingTaskRepository;

    @Autowired
    private ContentPlanItemRepository contentPlanItemRepository;

    @Autowired
    private MarketingReviewRepository marketingReviewRepository;

    @Autowired
    private MarketingMetricRepository marketingMetricRepository;

    @Autowired
    private DigitalMarketingExecutiveRepository digitalMarketingExecutiveRepository;

    @Autowired
    private ProjectRepository projectRepository;

    // Injecting remaining dynamic model repositories
    @Autowired
    private MarketingTrendRepository marketingTrendRepository;

    @Autowired
    private SeoChecklistRepository seoChecklistRepository;

    @Autowired
    private AudienceInsightRepository audienceInsightRepository;

    @Autowired
    private WebsitePageMetricRepository websitePageMetricRepository;

    @Autowired
    private SocialPostMetricRepository socialPostMetricRepository;

    @Autowired
    private AiSuggestionRepository aiSuggestionRepository;

    @Autowired
    private GoogleCampaignMetricRepository googleCampaignMetricRepository;

    @Autowired
    private ContentDistributionMetricRepository contentDistributionMetricRepository;

    @Autowired
    private WebsiteHealthMetricRepository websiteHealthMetricRepository;

    @Autowired
    private ProjectPortfolioMetricRepository projectPortfolioMetricRepository;

    @Autowired
    private ChannelPerformanceMetricRepository channelPerformanceMetricRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        DigitalMarketingExecutive res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
    }

    @GetMapping("/dashboard/org/{orgId}")
    public ResponseEntity<?> getDashboard(@PathVariable Long orgId) {
        List<MarketingTask> tasks = marketingTaskRepository.findByOrganizationId(orgId);
        List<ContentPlanItem> contentPlanItems = contentPlanItemRepository.findByOrganizationId(orgId);
        List<MarketingReview> reviews = marketingReviewRepository.findByOrganizationId(orgId);
        List<MarketingMetric> metrics = marketingMetricRepository.findByOrganizationId(orgId);
        List<Project> projects = projectRepository.findByOrganizationId(orgId);
 
        // Loading newly defined dynamic datasets
        List<MarketingTrend> trends = marketingTrendRepository.findByOrganizationId(orgId);
        List<SeoChecklist> seoChecklists = seoChecklistRepository.findByOrganizationId(orgId);
        List<AudienceInsight> audienceInsights = audienceInsightRepository.findByOrganizationId(orgId);
        List<WebsitePageMetric> pageMetrics = websitePageMetricRepository.findByOrganizationId(orgId);
        List<SocialPostMetric> socialPosts = socialPostMetricRepository.findByOrganizationId(orgId);
        List<AiSuggestion> aiSuggestions = aiSuggestionRepository.findByOrganizationId(orgId);
 
        List<GoogleCampaignMetric> googleCampaigns = googleCampaignMetricRepository.findByOrganizationId(orgId);
        List<ContentDistributionMetric> contentDistributions = contentDistributionMetricRepository.findByOrganizationId(orgId);
        List<WebsiteHealthMetric> websiteHealths = websiteHealthMetricRepository.findByOrganizationId(orgId);
        List<ProjectPortfolioMetric> projectPortfolios = projectPortfolioMetricRepository.findByOrganizationId(orgId);
        List<ChannelPerformanceMetric> channelPerformances = channelPerformanceMetricRepository.findByOrganizationId(orgId);
 
        Map<String, Object> response = new HashMap<>();
        response.put("tasks", tasks);
        response.put("contentPlanItems", contentPlanItems);
        response.put("reviews", reviews);
        response.put("metrics", metrics);
        response.put("projects", projects);

        response.put("trends", trends);
        response.put("seoChecklists", seoChecklists);
        response.put("audienceInsights", audienceInsights);
        response.put("pageMetrics", pageMetrics);
        response.put("socialPosts", socialPosts);
        response.put("aiSuggestions", aiSuggestions);

        response.put("googleCampaigns", googleCampaigns);
        response.put("contentDistributions", contentDistributions);
        response.put("websiteHealths", websiteHealths);
        response.put("projectPortfolios", projectPortfolios);
        response.put("channelPerformances", channelPerformances);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/tasks")
    public ResponseEntity<?> createTask(@RequestBody MarketingTask task) {
        if (task.getStatus() == null || task.getStatus().isEmpty()) {
            task.setStatus("Pending");
        }
        return ResponseEntity.ok(marketingTaskRepository.save(task));
    }

    @PutMapping("/tasks/{id}/status")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        MarketingTask task = marketingTaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(payload.get("status"));
        return ResponseEntity.ok(marketingTaskRepository.save(task));
    }

    @PostMapping("/reviews/{id}/reply")
    public ResponseEntity<?> replyToReview(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        MarketingReview review = marketingReviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setReply(payload.get("reply"));
        return ResponseEntity.ok(marketingReviewRepository.save(review));
    }

    @GetMapping("/settings/user/{username}")
    public ResponseEntity<?> getSettings(@PathVariable String username) {
        DigitalMarketingExecutive exec = digitalMarketingExecutiveRepository.findByUsername(username)
                .or(() -> digitalMarketingExecutiveRepository.findByEmail(username))
                .orElseThrow(() -> new RuntimeException("Executive not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("name", exec.getUsername());
        response.put("email", exec.getEmail());
        response.put("phone", exec.getPhone() != null ? exec.getPhone() : "+91 98765 43210");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/settings/user/{username}")
    public ResponseEntity<?> updateSettings(@PathVariable String username, @RequestBody Map<String, String> payload) {
        DigitalMarketingExecutive exec = digitalMarketingExecutiveRepository.findByUsername(username)
                .or(() -> digitalMarketingExecutiveRepository.findByEmail(username))
                .orElseThrow(() -> new RuntimeException("Executive not found"));

        if (payload.containsKey("email")) exec.setEmail(payload.get("email"));
        if (payload.containsKey("phone")) exec.setPhone(payload.get("phone"));
        
        digitalMarketingExecutiveRepository.save(exec);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }
}
