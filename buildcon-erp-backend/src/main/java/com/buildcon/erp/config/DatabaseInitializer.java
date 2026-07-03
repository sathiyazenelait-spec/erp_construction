package com.buildcon.erp.config;

import com.buildcon.erp.model.*;
import com.buildcon.erp.model.Package;
import com.buildcon.erp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

// @Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ERPModuleRepository erpModuleRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private PackageRepository packageRepository;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ChairmanRepository chairmanRepository;

    @Autowired
    private SiteManagementRepository siteManagementRepository;

    @Autowired
    private MDRepository mdRepository;

    @Autowired
    private ConstructionManagerRepository constructionManagerRepository;

    @Autowired
    private MarketingManagerRepository marketingManagerRepository;

    @Autowired
    private SeniorSiteEngineerRepository seniorSiteEngineerRepository;

    @Autowired
    private TrainingScheduleRepository trainingScheduleRepository;

    @Autowired
    private HRManagerRepository hrManagerRepository;

    @Autowired
    private SubcontractorRepository subcontractorRepository;

    @Autowired
    private ProjectManagerRepository projectManagerRepository;

    @Autowired
    private QuantitySurveyorRepository quantitySurveyorRepository;

    @Autowired
    private WorkforceManagerRepository workforceManagerRepository;

    @Autowired
    private DigitalMarketingTLRepository digitalMarketingTLRepository;

    @Autowired
    private MarketingCampaignRepository marketingCampaignRepository;

    @Autowired
    private TlmTeamMemberRepository tlmTeamMemberRepository;

    @Autowired
    private TlmCalendarEventRepository tlmCalendarEventRepository;

    @Autowired
    private MarketingMetricRepository marketingMetricRepository;

    @Autowired
    private MarketingTrendRepository marketingTrendRepository;

    @Autowired
    private SalesLeadRepository salesLeadRepository;

    @Autowired
    private MarketingTaskRepository marketingTaskRepository;

    @Autowired
    private ContentPlanItemRepository contentPlanItemRepository;

    @Autowired
    private MarketingReviewRepository marketingReviewRepository;

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

    @Autowired
    private AttendanceRecordRepository attendanceRecordRepository;

    @Autowired
    private SubcontractorAttendanceRepository subcontractorAttendanceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed roles
        Arrays.stream(ERole.values()).forEach(roleName -> {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(new Role(roleName));
            }
        });

        // Seed default Organization if none exist
        Organization defaultOrg;
        if (organizationRepository.count() == 0) {
            defaultOrg = new Organization(
                "BuildWell Constructions Ltd",
                "buildcon.com",
                "info@buildcon.com",
                "+91 99999 88888",
                "Chennai, India",
                "Active",
                "Enterprise"
            );
            defaultOrg.setOrgUsername("buildwellconstructionsltd&0123");
            defaultOrg.setOrgPassword("buildwell@123");
            defaultOrg = organizationRepository.save(defaultOrg);
        } else {
            defaultOrg = organizationRepository.findAll().get(0);
        }

        // Seed default projects if none exist
        if (projectRepository.count() == 0 && defaultOrg != null) {
            Project p = new Project();
            p.setName("skyvilla gesthouse");
            p.setLocation("Chennai ECR Road");
            p.setBudget(35000000.0);
            p.setStartDate(LocalDate.of(2026, 6, 1));
            p.setEndDate(LocalDate.of(2026, 12, 31));
            p.setStatus("Planning");
            p.setOrganizationId(defaultOrg.getId());
            p.setBuiltupSqft(25000.0);
            p.setFloors(2);
            p.setLocationType("District HQ City");
            p.setAiEstimatedHours(2400);
            p.setArchitectName("Sridhar Associates");
            p.setPlannedProgress(80);
            p.setActualProgress(85);
            projectRepository.save(p);

            Project p2 = new Project("Skyline Residences", "Chennai OMR Road", 55000000.0, LocalDate.of(2026, 1, 15), LocalDate.of(2026, 11, 30), defaultOrg.getId());
            p2.setStatus("Active");
            p2.setBuiltupSqft(45000.0);
            p2.setFloors(14);
            p2.setLocationType("Metropolitan");
            p2.setAiEstimatedHours(5400);
            p2.setArchitectName("Sridhar Associates");
            p2.setPlannedProgress(75);
            p2.setActualProgress(72);
            projectRepository.save(p2);

            Project p3 = new Project("Greenfield Apartments", "Chennai West", 28000000.0, LocalDate.of(2026, 2, 10), LocalDate.of(2026, 10, 15), defaultOrg.getId());
            p3.setStatus("Active");
            p3.setBuiltupSqft(32000.0);
            p3.setFloors(8);
            p3.setLocationType("Metropolitan");
            p3.setAiEstimatedHours(3200);
            p3.setArchitectName("Sridhar Associates");
            p3.setPlannedProgress(52);
            p3.setActualProgress(55);
            projectRepository.save(p3);

            Project p4 = new Project("Phoenix Commercial", "Chennai Central", 85000000.0, LocalDate.of(2026, 3, 5), LocalDate.of(2026, 12, 20), defaultOrg.getId());
            p4.setStatus("Active");
            p4.setBuiltupSqft(95000.0);
            p4.setFloors(20);
            p4.setLocationType("Metropolitan");
            p4.setAiEstimatedHours(8500);
            p4.setArchitectName("Sridhar Associates");
            p4.setPlannedProgress(42);
            p4.setActualProgress(30);
            projectRepository.save(p4);

            Project p5 = new Project("Lakeview Villas", "ECR Scenic", 42000000.0, LocalDate.of(2026, 4, 1), LocalDate.of(2026, 9, 30), defaultOrg.getId());
            p5.setStatus("Active");
            p5.setBuiltupSqft(18000.0);
            p5.setFloors(2);
            p5.setLocationType("District HQ City");
            p5.setAiEstimatedHours(1900);
            p5.setArchitectName("Sridhar Associates");
            p5.setPlannedProgress(60);
            p5.setActualProgress(65);
            projectRepository.save(p5);

            Project p6 = new Project("IT Park Phase - 1", "Siruseri IT corridor", 120000000.0, LocalDate.of(2026, 5, 12), LocalDate.of(2027, 3, 31), defaultOrg.getId());
            p6.setStatus("Active");
            p6.setBuiltupSqft(150000.0);
            p6.setFloors(12);
            p6.setLocationType("Metropolitan");
            p6.setAiEstimatedHours(11000);
            p6.setArchitectName("Sridhar Associates");
            p6.setPlannedProgress(45);
            p6.setActualProgress(40);
            projectRepository.save(p6);
        }

        // Seed default packages if none exist
        if (packageRepository.count() == 0) {
            packageRepository.save(new Package(
                "Growth",
                "Essential",
                "₹3,299 / month",
                "Essential ERP toolkit tailored for small building contractors.",
                "emerald",
                Arrays.asList(
                    "Executive Summary Dashboard",
                    "Company Portfolio Profile",
                    "Approval Center workflow",
                    "AI Executive Assistant chat access",
                    "Basic Account Settings"
                )
            ));

            packageRepository.save(new Package(
                "Premium",
                "Most Popular",
                "₹4,799 / month",
                "Complete financial control and site workforce tracking system.",
                "blue",
                Arrays.asList(
                    "Everything in Growth",
                    "Financial Command & expense tracking",
                    "Safety Center risk analysis logs",
                    "Workforce Analysis & allocation statistics"
                )
            ));

            packageRepository.save(new Package(
                "Enterprise",
                "Complete Suite",
                "₹8,999 / month",
                "Full-scale construction ERP with AI metrics and strategic planning.",
                "purple",
                Arrays.asList(
                    "Everything in Premium",
                    "Sales & Opportunities pipeline",
                    "Client Insights & communication tracking",
                    "Strategic Planning & projection matrices",
                    "Investment Tracker & multi-project audits",
                    "Board Reports builder"
                )
            ));
        }

        // Seed default admin user if none exist
        if (adminUserRepository.count() == 0) {
            AdminUser admin = new AdminUser(
                "admin",
                "admin@buildcon.com",
                passwordEncoder.encode("admin123")
            );
            adminUserRepository.save(admin);
        }

        // Seed default Chairman if none exist
        if (chairmanRepository.count() == 0 && defaultOrg != null) {
            com.buildcon.erp.model.Chairman chairman = new com.buildcon.erp.model.Chairman(
                "chairman",
                "chairman@buildcon.com",
                passwordEncoder.encode("chairman123"),
                defaultOrg.getId()
            );
            chairmanRepository.save(chairman);
        }

        // Seed or update Managing Director "mdbuildcon" to be associated with defaultOrg
        if (defaultOrg != null) {
            com.buildcon.erp.model.MD md = mdRepository.findByUsername("mdbuildcon")
                .orElse(new com.buildcon.erp.model.MD(
                    "mdbuildcon",
                    "md@buildcon.com",
                    passwordEncoder.encode("mdbuildcon123")
                ));
            md.setOrganizationId(defaultOrg.getId());
            mdRepository.save(md);
        }

        // Seed or update default Site Manager "site" to be associated with defaultOrg
        if (defaultOrg != null) {
            com.buildcon.erp.model.SiteManagement sm = siteManagementRepository.findByUsername("site")
                .orElse(new com.buildcon.erp.model.SiteManagement(
                    "site",
                    "site@buildcon.com",
                    passwordEncoder.encode("site123")
                ));
            sm.setOrganizationId(defaultOrg.getId());
            siteManagementRepository.save(sm);

            // Assign the default project 'skyvilla gesthouse' to this Site Manager
            java.util.List<Project> projects = projectRepository.findByOrganizationId(defaultOrg.getId());
            if (!projects.isEmpty()) {
                Project p = projects.get(0);
                p.setSiteManagementId(sm.getId());
                projectRepository.save(p);
            }

            // Seed "Karthik R." (Construction Manager)
            if (constructionManagerRepository.findByUsername("Karthik R.").isEmpty()) {
                ConstructionManager cm = new ConstructionManager(
                    "Karthik R.",
                    "karthik@buildcon.com",
                    passwordEncoder.encode("password123")
                );
                cm.setOrganizationId(defaultOrg.getId());
                constructionManagerRepository.save(cm);
            }

            // Seed "Ananya Sharma" (Marketing Manager)
            if (marketingManagerRepository.findByUsername("Ananya Sharma").isEmpty()) {
                MarketingManager mm = new MarketingManager(
                    "Ananya Sharma",
                    "ananya@buildcon.com",
                    passwordEncoder.encode("password123")
                );
                mm.setOrganizationId(defaultOrg.getId());
                marketingManagerRepository.save(mm);
            }

            // Seed "Amit Patel" (Site Supervisor)
            if (siteManagementRepository.findByUsername("Amit Patel").isEmpty()) {
                SiteManagement smUser = new SiteManagement(
                    "Amit Patel",
                    "amit@buildcon.com",
                    passwordEncoder.encode("password123")
                );
                smUser.setOrganizationId(defaultOrg.getId());
                siteManagementRepository.save(smUser);
            }

            // Seed "Rohan Sharma" (Civil Engineer / Senior Site Engineer)
            if (seniorSiteEngineerRepository.findByUsername("Rohan Sharma").isEmpty()) {
                SeniorSiteEngineer sse = new SeniorSiteEngineer(
                    "Rohan Sharma",
                    "rohan@buildcon.com",
                    passwordEncoder.encode("password123")
                );
                sse.setOrganizationId(defaultOrg.getId());
            }

            // Seed default HRManager
            if (hrManagerRepository.findByEmail("hrmanager@buildcon.com").isEmpty()) {
                HRManager hr = new HRManager(
                    "hrmanager",
                    "hrmanager@buildcon.com",
                    passwordEncoder.encode("password123")
                );
                hr.setOrganizationId(defaultOrg.getId());
                hrManagerRepository.save(hr);
            }

            // Seed default Training Schedules
            if (trainingScheduleRepository.findByOrganizationId(defaultOrg.getId()).isEmpty()) {
                trainingScheduleRepository.save(new TrainingSchedule("Toolbox Heights Safety Safety Inductions", "All site workers / staff", "420 Workers", "28 May 2025", "100% Completed", defaultOrg.getId()));
                trainingScheduleRepository.save(new TrainingSchedule("Heavy Equipment Operation", "Crane & Mixer Operators", "15 Operators", "10 Jun 2025", "In Progress", defaultOrg.getId()));
                trainingScheduleRepository.save(new TrainingSchedule("EHS Site Audits compliance", "Site Managers", "8 Managers", "15 Jun 2025", "Scheduled", defaultOrg.getId()));
                trainingScheduleRepository.save(new TrainingSchedule("Executive Leadership Program", "Directors & Managers", "12 Attendees", "20 May 2025", "72% Completed", defaultOrg.getId()));
            }

            // Seed default ERP modules
            if (erpModuleRepository.count() == 0) {
                erpModuleRepository.save(new ERPModule("Financial Command Center", "finance", "Expense tracking, balance sheets, profit forecasting, and accounts payable/receivable automation.", "Global Enable", "Premium", 36));
                erpModuleRepository.save(new ERPModule("Company Portfolio Tracker", "portfolio", "Multi-site construction progress visualization, budget performance, and contract value logging.", "Global Enable", "Growth", 42));
                erpModuleRepository.save(new ERPModule("Workforce & Payroll Analysis", "workforce", "Employee register, department structures, manager hierarchy alignment, and site timeclock reports.", "Global Enable", "Growth", 40));
                erpModuleRepository.save(new ERPModule("Safety & Compliance Audit", "safety", "Site incident reports, safety scorecard audits, and compliance checklist certifications.", "Global Enable", "Premium", 28));
                erpModuleRepository.save(new ERPModule("AI Executive Assistant Bot", "ai_bot", "Natural language query interface, automated summary generator, and contextual risk prediction model.", "Global Enable", "Enterprise", 12));
                erpModuleRepository.save(new ERPModule("Sales & CRM Pipeline", "sales", "Lead funnels, proposal generators, and client win/loss ratio calculators.", "Global Enable", "Premium", 30));
            }

            // Seed Digital Marketing TL (buildcon tl)
            if (digitalMarketingTLRepository.findByEmail("buildcontl@gmail.com").isEmpty()) {
                DigitalMarketingTL tl = new DigitalMarketingTL(
                    "buildcon tl",
                    "buildcontl@gmail.com",
                    "$2a$10$zR4SzGT5.aYS3lfXeLC3O.TZhfg6UMNE9Sy4H2DAxX5Pg7r3HLkEm"
                );
                tl.setOrganizationId(defaultOrg.getId());
                digitalMarketingTLRepository.save(tl);
            }

            // Seed additional active users to hit exactly 34 users in total
            if (subcontractorRepository.count() == 0) {
                for (int i = 1; i <= 10; i++) {
                    Subcontractor sub = new Subcontractor("subcontractor" + i, "sub" + i + "@buildcon.com", passwordEncoder.encode("password123"));
                    sub.setOrganizationId(defaultOrg.getId());
                    subcontractorRepository.save(sub);
                }
            }
            if (projectManagerRepository.count() == 0) {
                for (int i = 1; i <= 5; i++) {
                    ProjectManager pm = new ProjectManager("pm" + i, "pm" + i + "@buildcon.com", passwordEncoder.encode("password123"));
                    pm.setOrganizationId(defaultOrg.getId());
                    projectManagerRepository.save(pm);
                }
            }
            if (quantitySurveyorRepository.count() == 0) {
                for (int i = 1; i <= 5; i++) {
                    QuantitySurveyor qs = new QuantitySurveyor("qs" + i, "qs" + i + "@buildcon.com", passwordEncoder.encode("password123"));
                    qs.setOrganizationId(defaultOrg.getId());
                    quantitySurveyorRepository.save(qs);
                }
            }
            if (workforceManagerRepository.count() == 0) {
                for (int i = 1; i <= 5; i++) {
                    WorkforceManager wm = new WorkforceManager("wm" + i, "wm" + i + "@buildcon.com", passwordEncoder.encode("password123"));
                    wm.setOrganizationId(defaultOrg.getId());
                    workforceManagerRepository.save(wm);
                }
            }

            // Seed additional organizations up to 42 if organizations count is less than 42
            long currentOrgs = organizationRepository.count();
            if (currentOrgs < 42) {
                String[] names = {
                    "Vender Structural", "Alpha Builders", "Beta Infra", "Delta Projects", "Gamma Engineering", "Omega Site Solutions",
                    "Apex Constructions", "Summit Developments", "Vertex Builders", "Matrix Contractors", "Vanguard Infra",
                    "Titan Civil Solutions", "Pinnacle Structures", "Horizon Real Estate", "Zenith Designs", "Beacon Masonry",
                    "Core Foundations", "Prime Developers", "Unity Site Planners", "Sterling Contracts", "Alliance Concrete",
                    "Evergreen Landscapes", "Metro Transit Builders", "Prestige Commercials", "Signature Homes", "Pioneer Planners",
                    "Dynamic Excavations", "Elite Formworks", "Global Heavy Equipment", "Pristine Steel", "Rapid Framing",
                    "Solid Rock Masonry", "Vantage Point Surveyors", "Supreme Drywall", "Ironclad Enclosures", "Blue Sky Glazing",
                    "Falcon Demolition", "Nova Electricals", "Quantum Plumbings", "Vector HVACs", "Chronos Fire Safety",
                    "Shield Insulations"
                };
                int enterpriseCount = 13;
                int premiumCount = 14;
                int growthCount = 14;
                for (int i = 0; i < (42 - currentOrgs) && i < names.length; i++) {
                    String tier;
                    if (enterpriseCount > 0) {
                        tier = "Enterprise";
                        enterpriseCount--;
                    } else if (premiumCount > 0) {
                        tier = "Premium";
                        premiumCount--;
                    } else {
                        tier = "Growth";
                        growthCount--;
                    }
                    Organization seededOrg = new Organization(
                        names[i],
                        names[i].toLowerCase().replace(" ", "") + ".com",
                        "contact@" + names[i].toLowerCase().replace(" ", "") + ".com",
                        "+91 90000 000" + (10 + i),
                        "City Area " + (i + 1),
                        "Active",
                        tier
                    );
                    seededOrg.setOrgUsername(names[i].toLowerCase().replace(" ", "") + "&0123");
                    seededOrg.setOrgPassword(names[i].toLowerCase().split(" ")[0] + "@123");
                    organizationRepository.save(seededOrg);
                }
            }

            // Seed additional projects up to 186 if projects count is less than 186
            long currentProj = projectRepository.count();
            if (currentProj < 186) {
                List<Organization> allOrgs = organizationRepository.findAll();
                String[] projectNames = {
                    "Residential Tower A", "Office Complex Phase 1", "Highway Expansion Site 4", "Steel Structure Warehouse", "Avenue Green Villas",
                    "Hospital Wing Extension", "Mall Atrium Renovation", "Metro Station Demolition", "Water Treatment Plant", "Tech Park Zone Zone 2",
                    "Airport Runway Upgrade", "Sewerage Network Line B", "High-rise Foundation Piles", "Community Hall Restoration", "Coastal Bridge Piers",
                    "Solar Farm Substations", "University Lab Building", "IT Hub Floor Fitout", "Logistics Park Dock 3", "Sports Complex Arena",
                    "Smart City Streetlights", "Multi-level Car Parking", "Public Park Landscaping", "Railway Crossing Subway", "Hotel Lobby Makeover",
                    "River Embankment Walls", "Luxury Villa Cluster", "Power Grid Tower Lines", "Commercial Plazas Phase 3", "Library Reading Room",
                    "Industrial Piping Layout", "Auditorium Acoustics", "Exhibition Center Halls", "Harbor Dock Repair", "Urban Drainage Upgrade"
                };
                int orgIdx = 0;
                for (int i = 0; i < (186 - currentProj); i++) {
                    Organization org = allOrgs.isEmpty() ? defaultOrg : allOrgs.get(orgIdx % allOrgs.size());
                    orgIdx++;
                    String pName = projectNames[i % projectNames.length] + " " + (i / projectNames.length + 1);
                    Project p = new Project();
                    p.setName(pName);
                    p.setLocation("Location Area " + (i + 1));
                    p.setBudget(10000000.0 + (i * 250000.0));
                    p.setStartDate(LocalDate.of(2026, 6, 1).plusDays(i % 15));
                    p.setEndDate(LocalDate.of(2026, 12, 31).plusDays(i % 30));
                    p.setStatus(i % 4 == 0 ? "Planning" : (i % 4 == 1 ? "Active" : (i % 4 == 2 ? "Completed" : "Suspended")));
                    p.setOrganizationId(org.getId());
                    p.setBuiltupSqft(15000.0 + (i * 100));
                    p.setFloors(2 + (i % 5));
                    p.setLocationType(i % 2 == 0 ? "District HQ City" : "Metropolitan");
                    p.setAiEstimatedHours(1000 + i * 10);
                    p.setArchitectName("Architect Team " + (i % 10 + 1));
                    projectRepository.save(p);
                }
         
       }

            // Seed Digital Marketing Executive data if empty
            if (marketingTaskRepository.findByOrganizationId(defaultOrg.getId()).isEmpty()) {
                marketingTaskRepository.save(new MarketingTask("Create Instagram Reel", "Villa Project", "High", "11:00 AM", "In Progress", defaultOrg.getId()));
                marketingTaskRepository.save(new MarketingTask("Write Blog - Construction Tips", "SEO Blog", "Medium", "01:00 PM", "Pending", defaultOrg.getId()));
                marketingTaskRepository.save(new MarketingTask("Google Ads Optimization", "Villa Campaign", "High", "02:30 PM", "Pending", defaultOrg.getId()));
                marketingTaskRepository.save(new MarketingTask("Update Project Photos", "Commercial Project", "Low", "03:30 PM", "Pending", defaultOrg.getId()));
                marketingTaskRepository.save(new MarketingTask("Respond to GMB Reviews", "GMB Profile", "Medium", "04:30 PM", "Pending", defaultOrg.getId()));
                marketingTaskRepository.save(new MarketingTask("Facebook Ad Creatives", "Apartment Project", "High", "05:00 PM", "Pending", defaultOrg.getId()));

                contentPlanItemRepository.save(new ContentPlanItem("Blog - How to reduce construction cost", "Blog", "30 May 2025", "High", "Ideas", defaultOrg.getId()));
                contentPlanItemRepository.save(new ContentPlanItem("Reel - Villa construction steps", "Reel", "30 May 2025", "High", "Ideas", defaultOrg.getId()));
                contentPlanItemRepository.save(new ContentPlanItem("YouTube - Site walkthrough video", "Video", "31 May 2025", "Medium", "Ideas", defaultOrg.getId()));
                contentPlanItemRepository.save(new ContentPlanItem("Post - Client testimonial", "Carousel", "04 Jun 2025", "Medium", "Ideas", defaultOrg.getId()));
                contentPlanItemRepository.save(new ContentPlanItem("Carousel - Construction tips", "Carousel", "05 Jun 2025", "Low", "Ideas", defaultOrg.getId()));

                marketingReviewRepository.save(new MarketingReview("Rajesh Pillai", 5, "Excellent construction quality and timely delivery of Skyline Residences!", "2025-05-24", "", defaultOrg.getId()));
                marketingReviewRepository.save(new MarketingReview("Deepika Sen", 4, "Very professional staff and beautiful sample flats. Recommended.", "2025-05-22", "", defaultOrg.getId()));
                marketingReviewRepository.save(new MarketingReview("Vikram Malhotra", 5, "Customer service at Greenfield apartments is top-notch. Love the garden amenities.", "2025-05-20", "", defaultOrg.getId()));

                marketingMetricRepository.save(new MarketingMetric("website", 540.0, "lead_sources", "Website", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("google_ads", 320.0, "lead_sources", "Google Ads", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("instagram", 180.0, "lead_sources", "Instagram", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("facebook", 120.0, "lead_sources", "Facebook", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("referrals", 90.0, "lead_sources", "Referrals", defaultOrg.getId()));

                marketingMetricRepository.save(new MarketingMetric("organic_traffic", 22500.0, "seo_overview", "Organic Traffic", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("ranked_keywords", 850.0, "seo_overview", "Keywords Ranked", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("top_10_keywords", 145.0, "seo_overview", "Top 10 Keywords", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("backlinks", 1250.0, "seo_overview", "Backlinks", defaultOrg.getId()));

                marketingMetricRepository.save(new MarketingMetric("clicks", 12850.0, "google_ads_stats", "Clicks", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("impressions", 2150000.0, "google_ads_stats", "Impressions", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("ctr", 4.85, "google_ads_stats", "CTR Rate", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("conversions", 320.0, "google_ads_stats", "Conversions", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("cost", 180000.0, "google_ads_stats", "Total Cost", defaultOrg.getId()));

                marketingMetricRepository.save(new MarketingMetric("meta_reach", 320000.0, "meta_ads_stats", "Reach", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("meta_impressions", 1250000.0, "meta_ads_stats", "Impressions", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("meta_clicks", 18620.0, "meta_ads_stats", "Clicks", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("meta_leads", 220.0, "meta_ads_stats", "Leads", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("meta_cost", 58000.0, "meta_ads_stats", "Total Cost", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("meta_cpl", 264.0, "meta_ads_stats", "Cost Per Lead", defaultOrg.getId()));

                marketingMetricRepository.save(new MarketingMetric("instagram_followers", 28000.0, "social_followers", "Instagram", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("facebook_followers", 18000.0, "social_followers", "Facebook", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("linkedin_followers", 12000.0, "social_followers", "LinkedIn", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("youtube_subscribers", 5200.0, "social_followers", "YouTube", defaultOrg.getId()));

                marketingMetricRepository.save(new MarketingMetric("visitors", 12500.0, "website_stats", "Total Visitors", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("views", 28450.0, "website_stats", "Page Views", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("bounce_rate", 34.5, "website_stats", "Bounce Rate", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("avg_session", 260.0, "website_stats", "Avg. Session", defaultOrg.getId()));

                marketingMetricRepository.save(new MarketingMetric("perf_leads", 1250.0, "perf_stats", "Total Leads", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("perf_conversions", 320.0, "perf_stats", "Conversions", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("perf_rate", 25.6, "perf_stats", "Conversion Rate", defaultOrg.getId()));
                marketingMetricRepository.save(new MarketingMetric("perf_cpl", 384.0, "perf_stats", "Cost Per Lead", defaultOrg.getId()));

                marketingTrendRepository.save(new MarketingTrend("leads_trend", "1 May", 250.0, 210.0, defaultOrg.getId()));
                marketingTrendRepository.save(new MarketingTrend("leads_trend", "8 May", 480.0, 410.0, defaultOrg.getId()));
                marketingTrendRepository.save(new MarketingTrend("leads_trend", "15 May", 720.0, 630.0, defaultOrg.getId()));
                marketingTrendRepository.save(new MarketingTrend("leads_trend", "22 May", 980.0, 850.0, defaultOrg.getId()));
                marketingTrendRepository.save(new MarketingTrend("leads_trend", "31 May", 1250.0, 1100.0, defaultOrg.getId()));

                marketingTrendRepository.save(new MarketingTrend("click_trend", "1 May", 2800.0, 0.0, defaultOrg.getId()));
                marketingTrendRepository.save(new MarketingTrend("click_trend", "8 May", 5400.0, 0.0, defaultOrg.getId()));
                marketingTrendRepository.save(new MarketingTrend("click_trend", "15 May", 8200.0, 0.0, defaultOrg.getId()));
                marketingTrendRepository.save(new MarketingTrend("click_trend", "22 May", 10500.0, 0.0, defaultOrg.getId()));
                marketingTrendRepository.save(new MarketingTrend("click_trend", "31 May", 12850.0, 0.0, defaultOrg.getId()));

                marketingTrendRepository.save(new MarketingTrend("meta_performance", "1 May", 60000.0, 45.0, defaultOrg.getId()));
                marketingTrendRepository.save(new MarketingTrend("meta_performance", "8 May", 140000.0, 90.0, defaultOrg.getId()));
                marketingTrendRepository.save(new MarketingTrend("meta_performance", "15 May", 210000.0, 135.0, defaultOrg.getId()));
                marketingTrendRepository.save(new MarketingTrend("meta_performance", "22 May", 270000.0, 180.0, defaultOrg.getId()));
                marketingTrendRepository.save(new MarketingTrend("meta_performance", "31 May", 320000.0, 220.0, defaultOrg.getId()));

                seoChecklistRepository.save(new SeoChecklist("Optimize Page Title", "Home Page", "High", "28 May 2025", "In Progress", defaultOrg.getId()));
                seoChecklistRepository.save(new SeoChecklist("Meta Description Update", "Services Page", "Medium", "30 May 2025", "Pending", defaultOrg.getId()));
                seoChecklistRepository.save(new SeoChecklist("Add Keywords in Blog", "Construction Cost", "High", "31 May 2025", "Pending", defaultOrg.getId()));
                seoChecklistRepository.save(new SeoChecklist("Image Alt Text Optimization", "Portfolio Page", "Low", "01 Jun 2025", "Pending", defaultOrg.getId()));
                seoChecklistRepository.save(new SeoChecklist("Internal Linking", "Blog Page", "Medium", "01 Jun 2025", "Pending", defaultOrg.getId()));
                seoChecklistRepository.save(new SeoChecklist("Schema Markup Update", "All Pages", "High", "01 Jun 2025", "Pending", defaultOrg.getId()));

                audienceInsightRepository.save(new AudienceInsight("age", "25-34 Years", 46.0, defaultOrg.getId()));
                audienceInsightRepository.save(new AudienceInsight("gender", "Male (58%) | Female (42%)", 0.0, defaultOrg.getId()));
                audienceInsightRepository.save(new AudienceInsight("location", "Chennai", 35.0, defaultOrg.getId()));
                audienceInsightRepository.save(new AudienceInsight("device", "Mobile", 82.0, defaultOrg.getId()));

                websitePageMetricRepository.save(new WebsitePageMetric("/home", 12500L, defaultOrg.getId()));
                websitePageMetricRepository.save(new WebsitePageMetric("/services", 8200L, defaultOrg.getId()));
                websitePageMetricRepository.save(new WebsitePageMetric("/projects", 5400L, defaultOrg.getId()));
                websitePageMetricRepository.save(new WebsitePageMetric("/about-us", 2350L, defaultOrg.getId()));

                socialPostMetricRepository.save(new SocialPostMetric("Luxury Villa Walkthrough", "25K Reach", "2.5K Eng", defaultOrg.getId()));
                socialPostMetricRepository.save(new SocialPostMetric("Construction Timelapse", "18K Reach", "1.8K Eng", defaultOrg.getId()));
                socialPostMetricRepository.save(new SocialPostMetric("Interior Design Ideas", "15K Reach", "1.5K Eng", defaultOrg.getId()));
                socialPostMetricRepository.save(new SocialPostMetric("Site Progress Update", "12K Reach", "1.2K Eng", defaultOrg.getId()));

                aiSuggestionRepository.save(new AiSuggestion("💡 \"10 tips for modern house construction\"", defaultOrg.getId()));
                aiSuggestionRepository.save(new AiSuggestion("💡 \"Cost saving ideas for your dream home\"", defaultOrg.getId()));
                aiSuggestionRepository.save(new AiSuggestion("💡 \"How to choose the right construction company\"", defaultOrg.getId()));

                googleCampaignMetricRepository.save(new GoogleCampaignMetric("Villa Campaign", 4250, "₹80,000", defaultOrg.getId()));
                googleCampaignMetricRepository.save(new GoogleCampaignMetric("Apartment Campaign", 3100, "₹55,000", defaultOrg.getId()));
                googleCampaignMetricRepository.save(new GoogleCampaignMetric("Commercial Campaign", 2850, "₹30,000", defaultOrg.getId()));
                googleCampaignMetricRepository.save(new GoogleCampaignMetric("Remarketing Campaign", 1280, "₹15,000", defaultOrg.getId()));

                contentDistributionMetricRepository.save(new ContentDistributionMetric("Blog", 20, "#3B82F6", defaultOrg.getId()));
                contentDistributionMetricRepository.save(new ContentDistributionMetric("Reel", 30, "#EC4899", defaultOrg.getId()));
                contentDistributionMetricRepository.save(new ContentDistributionMetric("Video", 20, "#EF4444", defaultOrg.getId()));
                contentDistributionMetricRepository.save(new ContentDistributionMetric("Post", 15, "#F59E0B", defaultOrg.getId()));
                contentDistributionMetricRepository.save(new ContentDistributionMetric("Carousel", 15, "#10B981", defaultOrg.getId()));

                websiteHealthMetricRepository.save(new WebsiteHealthMetric("SSL Certificate", "Valid", true, defaultOrg.getId()));
                websiteHealthMetricRepository.save(new WebsiteHealthMetric("Broken Links", "0", true, defaultOrg.getId()));
                websiteHealthMetricRepository.save(new WebsiteHealthMetric("Page Speed Index", "1.4s", true, defaultOrg.getId()));
                websiteHealthMetricRepository.save(new WebsiteHealthMetric("Mobile Optimization", "Good", true, defaultOrg.getId()));
                websiteHealthMetricRepository.save(new WebsiteHealthMetric("SEO Score", "92/100", true, defaultOrg.getId()));

                projectPortfolioMetricRepository.save(new ProjectPortfolioMetric("Luxury Villa", "Skyline Residences", 2450, 120, 62, defaultOrg.getId()));
                projectPortfolioMetricRepository.save(new ProjectPortfolioMetric("Apartment Project", "Greenfield Apartments", 1850, 95, 32, defaultOrg.getId()));
                projectPortfolioMetricRepository.save(new ProjectPortfolioMetric("Commercial Building", "Coimbatore Hub", 1680, 80, 25, defaultOrg.getId()));
                projectPortfolioMetricRepository.save(new ProjectPortfolioMetric("Interior Project", "Show Flats Chennai", 1250, 60, 22, defaultOrg.getId()));

                channelPerformanceMetricRepository.save(new ChannelPerformanceMetric("Website", 540, 150, "27.7%", defaultOrg.getId()));
                channelPerformanceMetricRepository.save(new ChannelPerformanceMetric("Google ads", 320, 95, "29.6%", defaultOrg.getId()));
                channelPerformanceMetricRepository.save(new ChannelPerformanceMetric("Facebook", 120, 35, "29.1%", defaultOrg.getId()));
                channelPerformanceMetricRepository.save(new ChannelPerformanceMetric("Instagram", 180, 28, "15.5%", defaultOrg.getId()));
                channelPerformanceMetricRepository.save(new ChannelPerformanceMetric("Referrals", 90, 12, "13.3%", defaultOrg.getId()));
            }

            // Seed baseline Attendance records (June 01 to June 30) if empty
            if (attendanceRecordRepository.findByOrganizationId(defaultOrg.getId()).isEmpty()) {
                for (int d = 1; d <= 30; d++) {
                    String dayStr = String.format("%02d Jun", d);
                    int present = 580 + (int)(Math.random() * 25); // 580 - 605
                    int absent = 20 + (int)(Math.random() * 20);   // 20 - 40
                    attendanceRecordRepository.save(new AttendanceRecord(dayStr, present, absent, defaultOrg.getId()));
                }
            }

            // Seed baseline Labour Attendance records (June 01 to June 30) if empty
            if (subcontractorAttendanceRepository.findByOrganizationId(defaultOrg.getId()).isEmpty()) {
                for (int d = 1; d <= 30; d++) {
                    String dateStr = String.format("%02d Jun", d);
                    int masons = 20 + (int)(Math.random() * 15);      // 20 - 35
                    int carpenters = 10 + (int)(Math.random() * 10);  // 10 - 20
                    int generalLabor = 35 + (int)(Math.random() * 15); // 35 - 50
                    subcontractorAttendanceRepository.save(new SubcontractorAttendance(masons, carpenters, generalLabor, dateStr, defaultOrg.getId(), 1L));
                }
            }
        }
    }
}
