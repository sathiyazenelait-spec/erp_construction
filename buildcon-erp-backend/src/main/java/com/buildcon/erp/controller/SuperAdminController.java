package com.buildcon.erp.controller;

import com.buildcon.erp.model.*;
import com.buildcon.erp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/super-admin")
public class SuperAdminController {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ERPModuleRepository erpModuleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private ChairmanRepository chairmanRepository;

    @Autowired
    private MDRepository mdRepository;

    @Autowired
    private SiteManagementRepository siteManagementRepository;

    @Autowired
    private ConstructionManagerRepository constructionManagerRepository;

    @Autowired
    private MarketingManagerRepository marketingManagerRepository;

    @Autowired
    private SeniorSiteEngineerRepository seniorSiteEngineerRepository;

    @Autowired
    private HRManagerRepository hrManagerRepository;

    @Autowired
    private QuantitySurveyorRepository quantitySurveyorRepository;

    @Autowired
    private ProcurementManagerRepository procurementManagerRepository;

    @Autowired
    private FinanceAccountsRepository financeAccountsRepository;

    @Autowired
    private WorkforceManagerRepository workforceManagerRepository;

    @Autowired
    private SubcontractorRepository subcontractorRepository;

    @Autowired
    private DigitalMarketingTLRepository digitalMarketingTLRepository;

    @Autowired
    private DigitalMarketingExecutiveRepository digitalMarketingExecutiveRepository;

    @Autowired
    private SalesExecutiveRepository salesExecutiveRepository;

    @Autowired
    private FinanceDirectorRepository financeDirectorRepository;

    @Autowired
    private ProjectDirectorRepository projectDirectorRepository;

    @Autowired
    private ProjectManagerRepository projectManagerRepository;

    @Autowired
    private BusinessDirectorRepository businessDirectorRepository;

    private long countTotalUsers() {
        return userRepository.count() +
               adminUserRepository.count() +
               chairmanRepository.count() +
               mdRepository.count() +
               siteManagementRepository.count() +
               constructionManagerRepository.count() +
               marketingManagerRepository.count() +
               seniorSiteEngineerRepository.count() +
               hrManagerRepository.count() +
               quantitySurveyorRepository.count() +
               procurementManagerRepository.count() +
               financeAccountsRepository.count() +
               workforceManagerRepository.count() +
               subcontractorRepository.count() +
               digitalMarketingTLRepository.count() +
               digitalMarketingExecutiveRepository.count() +
               salesExecutiveRepository.count() +
               financeDirectorRepository.count() +
               projectDirectorRepository.count() +
               projectManagerRepository.count() +
               businessDirectorRepository.count();
    }

    @GetMapping("/telemetry")
    public ResponseEntity<?> getTelemetry() {
        long totalOrgs = organizationRepository.count();
        long totalProjects = projectRepository.count();
        long activeUsers = countTotalUsers();

        // Calculate dynamic MRR based on organization subscription tiers
        double mrr = 0.0;
        List<Organization> orgs = organizationRepository.findAll();
        for (Organization org : orgs) {
            String tier = org.getSubscriptionTier();
            if ("Enterprise".equalsIgnoreCase(tier)) {
                mrr += 89990.0;
            } else if ("Premium".equalsIgnoreCase(tier)) {
                mrr += 47990.0;
            } else {
                mrr += 32990.0;
            }
        }

        // Format MRR
        String platformMrrStr = String.format("₹ %.1f Lakhs", mrr / 100000.0);

        // Dynamic AI calls
        long aiCallsMTD = totalProjects * 760 + activeUsers * 8;

        // Fluctuating AI Model Usage
        Random r = new Random();
        int basePro = 50 + r.nextInt(10); // 50-60%
        int baseFlash = 25 + r.nextInt(10); // 25-35%
        int baseSonnet = 100 - basePro - baseFlash;

        List<Map<String, Object>> aiModelUsage = List.of(
            Map.of("name", "Gemini 1.5 Pro", "value", basePro, "color", "#10B981"),
            Map.of("name", "Gemini 1.5 Flash", "value", baseFlash, "color", "#3B82F6"),
            Map.of("name", "Claude 3.5 Sonnet", "value", baseSonnet, "color", "#8B5CF6")
        );

        // Platform Monthly Recurring Revenue (₹) - Last 6 months chart data
        List<Map<String, Object>> platformRevenue = List.of(
            Map.of("m", "Jan", "rev", (int)(mrr * 0.5), "aiCalls", (int)(aiCallsMTD * 0.3)),
            Map.of("m", "Feb", "rev", (int)(mrr * 0.6), "aiCalls", (int)(aiCallsMTD * 0.4)),
            Map.of("m", "Mar", "rev", (int)(mrr * 0.7), "aiCalls", (int)(aiCallsMTD * 0.5)),
            Map.of("m", "Apr", "rev", (int)(mrr * 0.8), "aiCalls", (int)(aiCallsMTD * 0.65)),
            Map.of("m", "May", "rev", (int)(mrr * 0.9), "aiCalls", (int)(aiCallsMTD * 0.8)),
            Map.of("m", "Jun", "rev", (int)mrr, "aiCalls", (int)aiCallsMTD)
        );

        String aiOperationsSuggestion = String.format(
            "Platform AI utilization spiked by **29%%** in the past week (running %dK calls). Consider switching high-concurrency background routing queries to **Gemini 1.5 Flash** to optimize monthly API expenses.",
            aiCallsMTD / 1000
        );

        Map<String, Object> data = new HashMap<>();
        data.put("totalOrganizations", totalOrgs);
        data.put("totalProjects", totalProjects);
        data.put("platformMRR", platformMrrStr);
        data.put("activeUsers", activeUsers);
        data.put("aiCallsMTD", String.format("%dK Calls", aiCallsMTD / 1000));
        data.put("aiModelUsage", aiModelUsage);
        data.put("platformRevenue", platformRevenue);
        data.put("aiOperationsSuggestion", aiOperationsSuggestion);

        return ResponseEntity.ok(data);
    }

    @GetMapping("/health")
    public ResponseEntity<?> getHealth() {
        Random rand = new Random();

        double cpuLoad = 10.0 + rand.nextDouble() * 15.0; // 10% - 25%
        double ramUsed = 4.0 + rand.nextDouble() * 2.0; // 4GB - 6GB
        int activeConnections = 150 + rand.nextInt(50); // 150 - 200
        int dbLatency = 2 + rand.nextInt(7); // 2ms - 9ms
        double redisHitRate = 97.0 + rand.nextDouble() * 2.5; // 97% - 99.5%
        int apiGatewayLatency = 95 + rand.nextInt(30); // 95ms - 125ms

        // Dynamic System logs using real DB names
        List<Map<String, String>> logs = new ArrayList<>();
        List<String> userNames = new ArrayList<>();
        List<String> userEmails = new ArrayList<>();
        List<String> projectNames = new ArrayList<>();

        // Add defaults
        userNames.add("Rajesh Kumar");
        userEmails.add("chairman@buildcon.com");
        projectNames.add("skyvilla gesthouse");

        for (com.buildcon.erp.model.Chairman c : chairmanRepository.findAll()) {
            userNames.add(c.getUsername());
            userEmails.add(c.getEmail());
        }
        for (com.buildcon.erp.model.Project p : projectRepository.findAll()) {
            projectNames.add(p.getName());
        }

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        LocalTime now = LocalTime.now();

        // 1. Auth Log
        String user1 = userNames.get(rand.nextInt(userNames.size()));
        logs.add(Map.of(
            "timestamp", now.minusSeconds(15).format(timeFormatter),
            "service", "Auth",
            "level", "INFO",
            "message", "User " + user1 + " successfully authenticated via chairman route."
        ));

        // 2. DB Proxy Log
        String email2 = userEmails.get(rand.nextInt(userEmails.size()));
        String proj2 = projectNames.get(rand.nextInt(projectNames.size()));
        logs.add(Map.of(
            "timestamp", now.minusSeconds(45).format(timeFormatter),
            "service", "DB-Proxy",
            "level", "INFO",
            "message", "Query optimized on Table 'projects' for project '" + proj2 + "' by user '" + email2 + "'."
        ));

        // 3. AI Router Log
        logs.add(Map.of(
            "timestamp", now.minusSeconds(105).format(timeFormatter),
            "service", "AI-Router",
            "level", "WARN",
            "message", "Claude API responded with " + (800 + rand.nextInt(120)) + "ms latency. Routing fallback threshold near limits."
        ));

        // 4. Core Engine Log
        logs.add(Map.of(
            "timestamp", now.minusSeconds(180).format(timeFormatter),
            "service", "Core-Engine",
            "level", "INFO",
            "message", "Scheduled garbage cleanup finished. Freed " + (350 + rand.nextInt(100)) + "MB heap allocation."
        ));

        // 5. Billing Log
        logs.add(Map.of(
            "timestamp", now.minusSeconds(320).format(timeFormatter),
            "service", "Billing-Svc",
            "level", "ERROR",
            "message", "Webhook invoice failed for tenant ID: org-" + (rand.nextInt(10) + 1) + " (Past Due trigger set)."
        ));

        Map<String, Object> data = new HashMap<>();
        data.put("cpuLoad", String.format("%.1f%%", cpuLoad));
        data.put("ramUsed", String.format("%.1fGB", ramUsed));
        data.put("ramTotal", "16.0GB");
        data.put("dbActiveConnections", activeConnections);
        data.put("dbLatency", String.format("%dms", dbLatency));
        data.put("redisHitRate", String.format("%.1f%%", redisHitRate));
        data.put("redisKeyEvictions", 0);
        data.put("apiGatewayLatency", String.format("%dms", apiGatewayLatency));
        data.put("apiGatewayErrorRate", "< 0.01%");
        data.put("logs", logs);

        return ResponseEntity.ok(data);
    }

    @GetMapping("/modules")
    public ResponseEntity<?> getModules() {
        return ResponseEntity.ok(erpModuleRepository.findAll());
    }

    @PutMapping("/modules/{id}/toggle")
    public ResponseEntity<?> toggleModule(@PathVariable Long id) {
        Optional<ERPModule> opt = erpModuleRepository.findById(id);
        if (opt.isPresent()) {
            ERPModule module = opt.get();
            if ("Global Enable".equals(module.getStatus())) {
                module.setStatus("Global Disable");
            } else {
                module.setStatus("Global Enable");
            }
            erpModuleRepository.save(module);
            return ResponseEntity.ok(module);
        }
        return ResponseEntity.notFound().build();
    }
}
