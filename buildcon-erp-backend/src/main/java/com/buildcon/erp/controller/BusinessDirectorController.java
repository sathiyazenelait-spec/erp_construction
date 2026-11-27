package com.buildcon.erp.controller;

import com.buildcon.erp.model.BusinessDirector;
import com.buildcon.erp.model.Organization;
import com.buildcon.erp.model.Project;
import com.buildcon.erp.model.DashboardShellConfig;
import com.buildcon.erp.repository.BusinessDirectorRepository;
import com.buildcon.erp.repository.DashboardShellConfigRepository;
import com.buildcon.erp.repository.OrganizationRepository;
import com.buildcon.erp.repository.ProjectRepository;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.BusinessDirectorService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/business-director")
public class BusinessDirectorController {

    @Autowired
    private BusinessDirectorService service;

    @Autowired
    private BusinessDirectorRepository businessDirectorRepository;

    @Autowired
    private DashboardShellConfigRepository dashboardShellConfigRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final Map<Long, Map<String, Object>> ORG_BD_DATA = new ConcurrentHashMap<>();

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        BusinessDirector res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
    }

    private String currentHeaderDate() {
        return java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy, EEEE"));
    }

    private synchronized Map<String, Object> getOrCreateOrgData(Long orgId) {
        if (!ORG_BD_DATA.containsKey(orgId)) {
            Map<String, Object> initial = generateDefaultSeedData(orgId);
            ORG_BD_DATA.put(orgId, initial);
        }
        return ORG_BD_DATA.get(orgId);
    }

    private Map<String, Object> generateDefaultSeedData(Long orgId) {
        Map<String, Object> data = new ConcurrentHashMap<>();

        // 1. Competitors
        List<Map<String, Object>> marketShare = new ArrayList<>(List.of(
            new HashMap<>(Map.of("name", "BuildWell Constructions", "value", 30, "color", "#10B981")),
            new HashMap<>(Map.of("name", "Competitor A", "value", 25, "color", "#3B82F6")),
            new HashMap<>(Map.of("name", "Competitor B", "value", 20, "color", "#F59E0B")),
            new HashMap<>(Map.of("name", "Competitor C", "value", 15, "color", "#8B5CF6")),
            new HashMap<>(Map.of("name", "Competitor D", "value", 10, "color", "#64748B"))
        ));
        List<Map<String, Object>> winRates = new ArrayList<>(List.of(
            new HashMap<>(Map.of("name", "BuildWell", "rate", 58)),
            new HashMap<>(Map.of("name", "Competitor A", "rate", 45)),
            new HashMap<>(Map.of("name", "Competitor B", "rate", 42)),
            new HashMap<>(Map.of("name", "Competitor C", "rate", 38))
        ));
        Map<String, Object> compMap = new ConcurrentHashMap<>();
        compMap.put("marketShare", marketShare);
        compMap.put("winRates", winRates);
        data.put("competitors", compMap);

        // 2. CRM
        Map<String, Object> crmMap = new ConcurrentHashMap<>();
        crmMap.put("kpi", new HashMap<>(Map.of(
            "totalClients", 320,
            "activeAccounts", 180,
            "potentialAccounts", 95,
            "inactiveAccounts", 45
        )));
        List<Map<String, Object>> clients = new ArrayList<>(List.of(
            new HashMap<>(Map.of("id", 1, "name", "ABC Developers Pvt Ltd", "contact", "Mr. Ramesh", "phone", "+91 98765 43210", "projects", 3, "status", "Active", "lastContact", "28 May 2025")),
            new HashMap<>(Map.of("id", 2, "name", "XYZ Constructions Ltd", "contact", "Ms. Suresh", "phone", "+91 87654 32109", "projects", 2, "status", "Active", "lastContact", "26 May 2025")),
            new HashMap<>(Map.of("id", 3, "name", "Greenfield Builders Group", "contact", "Mr. Rajan", "phone", "+91 76543 21098", "projects", 2, "status", "Active", "lastContact", "25 May 2025")),
            new HashMap<>(Map.of("id", 4, "name", "L&N Infraventures Inc", "contact", "Mr. Karthik", "phone", "+91 65432 10987", "projects", 1, "status", "Potential", "lastContact", "27 May 2025")),
            new HashMap<>(Map.of("id", 5, "name", "Oceanic Resorts & Hotels", "contact", "Mr. Vijay", "phone", "+91 95432 10987", "projects", 2, "status", "Active", "lastContact", "20 May 2025"))
        ));
        crmMap.put("clients", clients);
        data.put("crm", crmMap);

        // 3. Leads
        List<Map<String, Object>> leads = new ArrayList<>(List.of(
            new HashMap<>(Map.of("id", 1, "name", "Ravi Kumar", "source", "Google Ads", "phone", "+91 98765 43210", "location", "Chennai", "budget", "₹80 Lakhs - 1.2 Cr", "status", "Qualified")),
            new HashMap<>(Map.of("id", 2, "name", "Anita Verma", "source", "Website", "phone", "+91 87654 32109", "location", "Chennai", "budget", "₹1.5 Cr - 2.0 Cr", "status", "Qualified")),
            new HashMap<>(Map.of("id", 3, "name", "Manoj Singh", "source", "Referral", "phone", "+91 76543 21098", "location", "Coimbatore", "budget", "₹75 Lakhs - 1.0 Cr", "status", "Working")),
            new HashMap<>(Map.of("id", 4, "name", "Priya Iyer", "source", "Website", "phone", "+91 65432 10987", "location", "Bangalore", "budget", "₹2.0 Cr - 3.0 Cr", "status", "New")),
            new HashMap<>(Map.of("id", 5, "name", "Arun Prakash", "source", "Social Media", "phone", "+91 95432 10987", "location", "Trichy", "budget", "₹50 Lakhs - 80 Lakhs", "status", "Working"))
        ));
        Map<String, Object> leadsMap = new ConcurrentHashMap<>();
        leadsMap.put("leads", leads);
        leadsMap.put("totalCount", 1250);
        leadsMap.put("qualifiedCount", 520);
        data.put("leads", leadsMap);

        // 4. Marketing
        Map<String, Object> mktMap = new ConcurrentHashMap<>();
        mktMap.put("kpi", new HashMap<>(Map.of(
            "totalSpend", "₹ 24.5 L",
            "totalLeads", "1,250",
            "cpl", "₹ 196",
            "convRate", "8.1%"
        )));
        List<Map<String, Object>> spendBySource = new ArrayList<>(List.of(
            new HashMap<>(Map.of("name", "Google Ads", "value", 45, "color", "#10B981")),
            new HashMap<>(Map.of("name", "Website SEO", "value", 25, "color", "#3B82F6")),
            new HashMap<>(Map.of("name", "Social Media", "value", 20, "color", "#F59E0B")),
            new HashMap<>(Map.of("name", "Referrals", "value", 10, "color", "#8B5CF6"))
        ));
        List<Map<String, Object>> campaigns = new ArrayList<>(List.of(
            new HashMap<>(Map.of("name", "Search Ads", "channel", "Google Ads", "spend", "₹9,00,000", "leads", 420, "cpl", "₹185", "conv", "9.2%", "roi", "310%")),
            new HashMap<>(Map.of("name", "Display Ads", "channel", "Google Ads", "spend", "₹3,50,000", "leads", 120, "cpl", "₹210", "conv", "7.0%", "roi", "210%")),
            new HashMap<>(Map.of("name", "Facebook Ads", "channel", "Social Media", "spend", "₹4,20,000", "leads", 180, "cpl", "₹220", "conv", "6.5%", "roi", "250%")),
            new HashMap<>(Map.of("name", "Instagram Ads", "channel", "Social Media", "spend", "₹3,80,000", "leads", 150, "cpl", "₹230", "conv", "6.1%", "roi", "240%")),
            new HashMap<>(Map.of("name", "Email Campaigns", "channel", "Email", "spend", "₹1,50,000", "leads", 95, "cpl", "₹150", "conv", "10.2%", "roi", "380%"))
        ));
        mktMap.put("spendBySource", spendBySource);
        mktMap.put("campaigns", campaigns);
        data.put("marketing", mktMap);

        // 5. Opportunities
        Map<String, Object> oppMap = new ConcurrentHashMap<>();
        oppMap.put("kpi", new HashMap<>(Map.of(
            "pipelineValue", "₹ 55.0 Cr",
            "weightedValue", "₹ 35.8 Cr",
            "avgWinRate", "58.7%"
        )));
        List<Map<String, Object>> opps = new ArrayList<>(List.of(
            new HashMap<>(Map.of("id", 1, "p", "IT Park Project - Chennai", "v", 20.0, "w", 70, "stage", "Proposal")),
            new HashMap<>(Map.of("id", 2, "p", "Villa Community - ECR", "v", 8.0, "w", 60, "stage", "Negotiation")),
            new HashMap<>(Map.of("id", 3, "p", "Government School - Trichy", "v", 15.0, "w", 65, "stage", "Proposal")),
            new HashMap<>(Map.of("id", 4, "p", "Hospital Building - Madurai", "v", 12.0, "w", 40, "stage", "Inquiry"))
        ));
        oppMap.put("opportunities", opps);
        data.put("opportunities", oppMap);

        // 6. Pipeline
        Map<String, Object> pipeMap = new ConcurrentHashMap<>();
        pipeMap.put("kpi", new HashMap<>(Map.of(
            "totalPipeline", "₹ 68.5 Cr",
            "weightedValue", "₹ 28.4 Cr",
            "activeDeals", 42,
            "targetValue", "₹ 15.0 Cr"
        )));
        List<Map<String, Object>> pipelineData = new ArrayList<>(List.of(
            new HashMap<>(Map.of("id", 1, "name", "IT Park Project", "value", 25.0, "stage", "Proposal", "prob", "70%")),
            new HashMap<>(Map.of("id", 2, "name", "Commercial Complex", "value", 12.0, "stage", "Negotiation", "prob", "80%")),
            new HashMap<>(Map.of("id", 3, "name", "Apartment Project", "value", 18.0, "stage", "Qualification", "prob", "50%"))
        ));
        List<Map<String, Object>> byOwner = new ArrayList<>(List.of(
            new HashMap<>(Map.of("owner", "Arun Kumar", "value", "₹22.5 Cr")),
            new HashMap<>(Map.of("owner", "Priya Sharma", "value", "₹18.0 Cr")),
            new HashMap<>(Map.of("owner", "Vijay Prakash", "value", "₹15.5 Cr")),
            new HashMap<>(Map.of("owner", "Karthik S", "value", "₹12.5 Cr"))
        ));
        pipeMap.put("deals", pipelineData);
        pipeMap.put("byOwner", byOwner);
        data.put("pipeline", pipeMap);

        // 7. Proposals
        Map<String, Object> propMap = new ConcurrentHashMap<>();
        propMap.put("kpi", new HashMap<>(Map.of(
            "sent", 180,
            "underReview", 60,
            "accepted", 90,
            "rejected", 15,
            "conversionRate", "25.0%"
        )));
        List<Map<String, Object>> proposals = new ArrayList<>(List.of(
            new HashMap<>(Map.of("id", "prop-1", "name", "IT Park Project", "client", "ABC Developers", "value", "₹ 25.0 Cr", "status", "Under Review", "date", "15 June 2025")),
            new HashMap<>(Map.of("id", "prop-2", "name", "Luxury Villas", "client", "Oceanic Resorts", "value", "₹ 8.0 Cr", "status", "Accepted", "date", "20 June 2025")),
            new HashMap<>(Map.of("id", "prop-3", "name", "Commercial Complex", "client", "XYZ Constructions", "value", "₹ 12.0 Cr", "status", "Under Review", "date", "26 June 2025")),
            new HashMap<>(Map.of("id", "prop-4", "name", "Apartment Project", "client", "PQR Builders", "value", "₹ 18.0 Cr", "status", "Under Review", "date", "28 June 2025")),
            new HashMap<>(Map.of("id", "prop-5", "name", "Resort Project", "client", "Oceanic Resorts", "value", "₹ 7.8 Cr", "status", "Rejected", "date", "10 May 2025")),
            new HashMap<>(Map.of("id", "prop-6", "name", "School Building", "client", "Govt Schools", "value", "₹ 12.0 Cr", "status", "Accepted", "date", "28 May 2025"))
        ));
        propMap.put("proposals", proposals);
        data.put("proposals", propMap);

        // 8. Reports
        List<Map<String, Object>> reports = new ArrayList<>(List.of(
            new HashMap<>(Map.of("id", 1, "name", "Monthly Sales Progress Report - May 2025", "type", "PDF", "size", "3.5 MB", "date", "28 May 2025")),
            new HashMap<>(Map.of("id", 2, "name", "Tender Participation Log - May 2025", "type", "XLSX", "size", "8.2 MB", "date", "27 May 2025")),
            new HashMap<>(Map.of("id", 3, "name", "Marketing Spend & Leads Analysis - Q1 2025", "type", "PDF", "size", "5.4 MB", "date", "20 May 2025")),
            new HashMap<>(Map.of("id", 4, "name", "Signed Contracts Ledger - Q1 2025", "type", "PDF", "size", "4.1 MB", "date", "15 May 2025"))
        ));
        Map<String, Object> repMap = new ConcurrentHashMap<>();
        repMap.put("reports", reports);
        data.put("reports", repMap);

        // 9. Targets
        Map<String, Object> tgtMap = new ConcurrentHashMap<>();
        tgtMap.put("kpi", new HashMap<>(Map.of(
            "targetRevenue", "₹ 15.0 Cr",
            "achievedRevenue", "₹ 12.4 Cr (83%)",
            "incentivesEarned", "₹ 2.45 Cr",
            "teamLimit", "₹ 48.5 L"
        )));
        List<Map<String, Object>> monthlyProgress = new ArrayList<>(List.of(
            new HashMap<>(Map.of("title", "Projects Target", "current", 10, "target", 10, "label", "10 / 10 Won (100%)", "percent", 100, "color", "emerald")),
            new HashMap<>(Map.of("title", "Revenue Target", "current", 12.4, "target", 15.0, "label", "₹12.4 Cr / ₹15.0 Cr (83%)", "percent", 83, "color", "blue")),
            new HashMap<>(Map.of("title", "Qualified Leads Quota", "current", 520, "target", 600, "label", "520 / 600 Leads (87%)", "percent", 87, "color", "amber")),
            new HashMap<>(Map.of("title", "Tenders Won Rate", "current", 4, "target", 5, "label", "4 / 5 Won (80%)", "percent", 80, "color", "violet"))
        ));
        tgtMap.put("progress", monthlyProgress);
        data.put("targets", tgtMap);

        // 10. Team
        Map<String, Object> teamMap = new ConcurrentHashMap<>();
        teamMap.put("kpi", new HashMap<>(Map.of(
            "totalMembers", "15 Members",
            "activeMembers", "15 Members",
            "topPerformer", "Arun Kumar",
            "teamAchievement", "118%"
        )));
        List<Map<String, Object>> team = new ArrayList<>(List.of(
            new HashMap<>(Map.of("id", 1, "name", "Arun Kumar", "leads", 312, "proposals", 45, "wins", 12, "value", "₹ 28.4 Cr", "achieved", 126)),
            new HashMap<>(Map.of("id", 2, "name", "Priya Sharma", "leads", 299, "proposals", 38, "wins", 9, "value", "₹ 22.7 Cr", "achieved", 108)),
            new HashMap<>(Map.of("id", 3, "name", "Vijay Prakash", "leads", 245, "proposals", 30, "wins", 7, "value", "₹ 18.5 Cr", "achieved", 100)),
            new HashMap<>(Map.of("id", 4, "name", "Karthik S", "leads", 190, "proposals", 26, "wins", 8, "value", "₹ 16.5 Cr", "achieved", 92)),
            new HashMap<>(Map.of("id", 5, "name", "Sneha Reddy", "leads", 154, "proposals", 22, "wins", 5, "value", "₹ 11.2 Cr", "achieved", 88))
        ));
        teamMap.put("team", team);
        data.put("team", teamMap);

        // 11. Tenders
        Map<String, Object> tenderMap = new ConcurrentHashMap<>();
        tenderMap.put("kpi", new HashMap<>(Map.of(
            "totalTenders", 35,
            "participated", "22 Bids",
            "shortlisted", "8 Bids",
            "won", "4 Won"
        )));
        List<Map<String, Object>> tenders = new ArrayList<>(List.of(
            new HashMap<>(Map.of("id", 1, "name", "IT Park Phase - 2", "value", "₹ 25.0 Cr", "status", "Shortlisted", "date", "15 June 2025")),
            new HashMap<>(Map.of("id", 2, "name", "Govt School Building", "value", "₹ 12.0 Cr", "status", "Won", "date", "28 May 2025")),
            new HashMap<>(Map.of("id", 3, "name", "Highway Rest Area - ECR", "value", "₹ 8.0 Cr", "status", "Participated", "date", "25 May 2025")),
            new HashMap<>(Map.of("id", 4, "name", "Medical College - Madurai", "value", "₹ 40.0 Cr", "status", "Lost", "date", "18 May 2025")),
            new HashMap<>(Map.of("id", 5, "name", "Police Station - Coimbatore", "value", "₹ 6.0 Cr", "status", "Shortlisted", "date", "02 June 2025")),
            new HashMap<>(Map.of("id", 6, "name", "Bus Terminal - Salem", "value", "₹ 16.0 Cr", "status", "Won", "date", "12 May 2025"))
        ));
        tenderMap.put("tenders", tenders);
        data.put("tenders", tenderMap);

        return data;
    }

    // ==========================================
    // 1. SEED / RESET ENDPOINT
    // ==========================================
    @PostMapping("/seed/org/{orgId}")
    public ResponseEntity<?> seedOrganizationBD(@PathVariable Long orgId) {
        Map<String, Object> fresh = generateDefaultSeedData(orgId);
        ORG_BD_DATA.put(orgId, fresh);
        seedBDData(orgId);
        return ResponseEntity.ok(Map.of("message", "Business Director data successfully seeded for Organization " + orgId, "status", "SUCCESS"));
    }

    // ==========================================
    // 2. COMPETITORS
    // ==========================================
    @GetMapping("/competitors/org/{orgId}")
    public ResponseEntity<?> getCompetitors(@PathVariable Long orgId) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        return ResponseEntity.ok(orgData.get("competitors"));
    }

    @PostMapping("/competitors/org/{orgId}")
    public ResponseEntity<?> updateCompetitors(@PathVariable Long orgId, @RequestBody Map<String, Object> payload) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        orgData.put("competitors", payload);
        return ResponseEntity.ok(payload);
    }

    // ==========================================
    // 3. CRM
    // ==========================================
    @GetMapping("/crm/org/{orgId}")
    public ResponseEntity<?> getCRM(@PathVariable Long orgId) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        return ResponseEntity.ok(orgData.get("crm"));
    }

    @PostMapping("/crm/org/{orgId}")
    public ResponseEntity<?> updateCRM(@PathVariable Long orgId, @RequestBody Map<String, Object> payload) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        orgData.put("crm", payload);
        return ResponseEntity.ok(payload);
    }

    @PostMapping("/crm/org/{orgId}/add-client")
    public ResponseEntity<?> addCRMClient(@PathVariable Long orgId, @RequestBody Map<String, Object> client) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        Map<String, Object> crm = (Map<String, Object>) orgData.get("crm");
        List<Map<String, Object>> list = (List<Map<String, Object>>) crm.get("clients");
        client.put("id", list.size() + 1);
        list.add(0, client);
        return ResponseEntity.ok(client);
    }

    // ==========================================
    // 4. LEADS
    // ==========================================
    @GetMapping("/leads/org/{orgId}")
    public ResponseEntity<?> getLeads(@PathVariable Long orgId) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        return ResponseEntity.ok(orgData.get("leads"));
    }

    @PostMapping("/leads/org/{orgId}")
    public ResponseEntity<?> updateLeads(@PathVariable Long orgId, @RequestBody Map<String, Object> payload) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        orgData.put("leads", payload);
        return ResponseEntity.ok(payload);
    }

    @PostMapping("/leads/org/{orgId}/add")
    public ResponseEntity<?> addLead(@PathVariable Long orgId, @RequestBody Map<String, Object> lead) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        Map<String, Object> leadsMap = (Map<String, Object>) orgData.get("leads");
        List<Map<String, Object>> list = (List<Map<String, Object>>) leadsMap.get("leads");
        lead.put("id", list.size() + 1);
        list.add(0, lead);
        return ResponseEntity.ok(lead);
    }

    // ==========================================
    // 5. MARKETING
    // ==========================================
    @GetMapping("/marketing/org/{orgId}")
    public ResponseEntity<?> getMarketing(@PathVariable Long orgId) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        return ResponseEntity.ok(orgData.get("marketing"));
    }

    @PostMapping("/marketing/org/{orgId}")
    public ResponseEntity<?> updateMarketing(@PathVariable Long orgId, @RequestBody Map<String, Object> payload) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        orgData.put("marketing", payload);
        return ResponseEntity.ok(payload);
    }

    // ==========================================
    // 6. OPPORTUNITIES
    // ==========================================
    @GetMapping("/opportunities/org/{orgId}")
    public ResponseEntity<?> getOpportunities(@PathVariable Long orgId) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        return ResponseEntity.ok(orgData.get("opportunities"));
    }

    @PostMapping("/opportunities/org/{orgId}")
    public ResponseEntity<?> updateOpportunities(@PathVariable Long orgId, @RequestBody Map<String, Object> payload) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        orgData.put("opportunities", payload);
        return ResponseEntity.ok(payload);
    }

    @PostMapping("/opportunities/org/{orgId}/add")
    public ResponseEntity<?> addOpportunity(@PathVariable Long orgId, @RequestBody Map<String, Object> opp) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        Map<String, Object> oppMap = (Map<String, Object>) orgData.get("opportunities");
        List<Map<String, Object>> list = (List<Map<String, Object>>) oppMap.get("opportunities");
        opp.put("id", list.size() + 1);
        list.add(0, opp);
        return ResponseEntity.ok(opp);
    }

    // ==========================================
    // 7. PIPELINE
    // ==========================================
    @GetMapping("/pipeline/org/{orgId}")
    public ResponseEntity<?> getPipeline(@PathVariable Long orgId) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        return ResponseEntity.ok(orgData.get("pipeline"));
    }

    @PostMapping("/pipeline/org/{orgId}")
    public ResponseEntity<?> updatePipeline(@PathVariable Long orgId, @RequestBody Map<String, Object> payload) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        orgData.put("pipeline", payload);
        return ResponseEntity.ok(payload);
    }

    // ==========================================
    // 8. PROPOSALS
    // ==========================================
    @GetMapping("/proposals/org/{orgId}")
    public ResponseEntity<?> getProposals(@PathVariable Long orgId) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        return ResponseEntity.ok(orgData.get("proposals"));
    }

    @PostMapping("/proposals/org/{orgId}")
    public ResponseEntity<?> updateProposals(@PathVariable Long orgId, @RequestBody Map<String, Object> payload) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        orgData.put("proposals", payload);
        return ResponseEntity.ok(payload);
    }

    @PostMapping("/proposals/org/{orgId}/add")
    public ResponseEntity<?> addProposal(@PathVariable Long orgId, @RequestBody Map<String, Object> prop) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        Map<String, Object> propMap = (Map<String, Object>) orgData.get("proposals");
        List<Map<String, Object>> list = (List<Map<String, Object>>) propMap.get("proposals");
        prop.put("id", "prop-" + (list.size() + 1));
        list.add(0, prop);
        return ResponseEntity.ok(prop);
    }

    // ==========================================
    // 9. REPORTS
    // ==========================================
    @GetMapping("/reports/org/{orgId}")
    public ResponseEntity<?> getReports(@PathVariable Long orgId) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        return ResponseEntity.ok(orgData.get("reports"));
    }

    @PostMapping("/reports/org/{orgId}")
    public ResponseEntity<?> updateReports(@PathVariable Long orgId, @RequestBody Map<String, Object> payload) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        orgData.put("reports", payload);
        return ResponseEntity.ok(payload);
    }

    // ==========================================
    // 10. TARGETS
    // ==========================================
    @GetMapping("/targets/org/{orgId}")
    public ResponseEntity<?> getTargets(@PathVariable Long orgId) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        return ResponseEntity.ok(orgData.get("targets"));
    }

    @PostMapping("/targets/org/{orgId}")
    public ResponseEntity<?> updateTargets(@PathVariable Long orgId, @RequestBody Map<String, Object> payload) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        orgData.put("targets", payload);
        return ResponseEntity.ok(payload);
    }

    // ==========================================
    // 11. TEAM
    // ==========================================
    @GetMapping("/team/org/{orgId}")
    public ResponseEntity<?> getTeam(@PathVariable Long orgId) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        return ResponseEntity.ok(orgData.get("team"));
    }

    @PostMapping("/team/org/{orgId}")
    public ResponseEntity<?> updateTeam(@PathVariable Long orgId, @RequestBody Map<String, Object> payload) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        orgData.put("team", payload);
        return ResponseEntity.ok(payload);
    }

    // ==========================================
    // 12. TENDERS
    // ==========================================
    @GetMapping("/tenders/org/{orgId}")
    public ResponseEntity<?> getTenders(@PathVariable Long orgId) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        return ResponseEntity.ok(orgData.get("tenders"));
    }

    @PostMapping("/tenders/org/{orgId}")
    public ResponseEntity<?> updateTenders(@PathVariable Long orgId, @RequestBody Map<String, Object> payload) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        orgData.put("tenders", payload);
        return ResponseEntity.ok(payload);
    }

    @PostMapping("/tenders/org/{orgId}/add")
    public ResponseEntity<?> addTender(@PathVariable Long orgId, @RequestBody Map<String, Object> tender) {
        Map<String, Object> orgData = getOrCreateOrgData(orgId);
        Map<String, Object> tenderMap = (Map<String, Object>) orgData.get("tenders");
        List<Map<String, Object>> list = (List<Map<String, Object>>) tenderMap.get("tenders");
        tender.put("id", list.size() + 1);
        list.add(0, tender);
        return ResponseEntity.ok(tender);
    }

    // ==========================================
    // DASHBOARD & SETTINGS
    // ==========================================
    private void seedBDData(Long orgId) {
        dashboardShellConfigRepository.save(new DashboardShellConfig("business-director", "header_date", currentHeaderDate(), orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("business-director", "sidebar_menus", "Dashboard|Leads Management|Opportunities|Tenders|Clients & CRM|Marketing Analytics|Sales Pipeline|Proposals|Competitor Analysis|Reports & Analytics|AI Sales Assistant|Targets & Incentives|Team Performance|Settings", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("business-director", "ai_suggestions", "Best converting channel?|Leads likely to close|Forecast next month sales|Win-loss ratio analysis.", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("business-director", "total_leads", "1,250", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("business-director", "qualified_leads", "520", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("business-director", "proposals_sent", "180", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("business-director", "projects_won", "42", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("business-director", "pipeline_value", "₹124.8 Cr", orgId));
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

        String profileName = "Rajesh Verma";
        String profileEmail = "bd@buildcon.com";
        String avatarInitials = "RV";
        String currentUsername = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<BusinessDirector> bdOpt = businessDirectorRepository.findByUsername(currentUsername);
        if (bdOpt.isPresent()) {
            BusinessDirector bd = bdOpt.get();
            profileName = bd.getUsername();
            profileEmail = bd.getEmail();
            avatarInitials = bd.getAvatarInitials();
            if (avatarInitials == null || avatarInitials.isBlank()) {
                String initials = Arrays.stream(bd.getUsername().split(" "))
                    .filter(n -> !n.isEmpty())
                    .map(n -> String.valueOf(n.charAt(0)))
                    .collect(Collectors.joining(""))
                    .toUpperCase();
                if (initials.length() > 2) {
                    initials = initials.substring(0, 2);
                }
                avatarInitials = initials.isEmpty() ? "RV" : initials;
                bd.setAvatarInitials(avatarInitials);
                businessDirectorRepository.save(bd);
            }
        }

        List<Project> projects = projectRepository.findByOrganizationId(orgId);
        if (projects.isEmpty()) {
            projectRepository.save(new Project("Skyline Residences", "Location A", 100000000.0, java.time.LocalDate.now(), java.time.LocalDate.now().plusYears(1), orgId));
            projectRepository.save(new Project("Greenfield Apartments", "Location B", 50000000.0, java.time.LocalDate.now(), java.time.LocalDate.now().plusYears(1), orgId));
            projects = projectRepository.findByOrganizationId(orgId);
        }

        List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "business-director");
        if (configs.isEmpty()) {
            seedBDData(orgId);
            configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "business-director");
        } else {
            for (DashboardShellConfig c : configs) {
                if ("header_date".equals(c.getConfigKey())) {
                    c.setConfigValue(currentHeaderDate());
                    dashboardShellConfigRepository.save(c);
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
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
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String email = payload.get("email");
        Long orgId = payload.containsKey("organizationId") ? Long.parseLong(payload.get("organizationId")) : null;

        if (orgId == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: organizationId is required."));
        }

        String currentUsername = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<BusinessDirector> bdOpt = businessDirectorRepository.findByUsername(currentUsername);
        if (bdOpt.isPresent()) {
            BusinessDirector bd = bdOpt.get();
            if (username != null && !username.isBlank()) bd.setUsername(username);
            if (email != null && !email.isBlank()) bd.setEmail(email);
            String avatarInitials = payload.get("avatarInitials");
            if (avatarInitials != null && !avatarInitials.isBlank()) bd.setAvatarInitials(avatarInitials);
            businessDirectorRepository.save(bd);
        }

        String[] configKeys = {
            "sidebar_menus", "ai_suggestions", "total_leads", "qualified_leads", "proposals_sent", "projects_won", "pipeline_value"
        };

        for (String key : configKeys) {
            String val = payload.get(key);
            if (val != null && !val.isBlank()) {
                List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "business-director");
                boolean found = false;
                for (DashboardShellConfig c : configs) {
                    if (c.getConfigKey().equals(key)) {
                        c.setConfigValue(val);
                        dashboardShellConfigRepository.save(c);
                        found = true;
                    }
                }
                if (!found) {
                    dashboardShellConfigRepository.save(new DashboardShellConfig("business-director", key, val, orgId));
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

        String profileName = "Business Director";
        if (orgIdStr != null) {
            try {
                Long orgId = Long.parseLong(orgIdStr);
                String currentUsername = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
                Optional<BusinessDirector> bdOpt = businessDirectorRepository.findByUsername(currentUsername);
                if (bdOpt.isPresent()) {
                    profileName = bdOpt.get().getUsername();
                }
            } catch (NumberFormatException ignored) {}
        }

        if (msg != null) {
            try {
                java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
                Map<String, Object> reqBody = Map.of(
                    "message", msg,
                    "role", "business-director",
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

        String response = "Hello! I'm your AI Sales Assistant. Google Ads currently yields the highest quality leads (Qualified leads: 520, Win Ratio: 23.3%). Pipeline value is ₹124.8 Cr.";
        if (cleanMsg.contains("tender")) {
            response = "We have won 4 tenders MTD, and IT Park Phase - 2 (₹ 25.0 Cr) is currently shortlisted with a high conversion score.";
        } else if (cleanMsg.contains("proposal")) {
            response = "We have sent 180 proposals MTD, and 60 proposals are currently under review by clients.";
        }
        return ResponseEntity.ok(Map.of("response", response));
    }
}
