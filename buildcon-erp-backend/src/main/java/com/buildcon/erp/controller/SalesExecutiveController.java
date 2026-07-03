package com.buildcon.erp.controller;

import com.buildcon.erp.model.*;
import com.buildcon.erp.repository.*;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.SalesExecutiveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/sales-executive")
public class SalesExecutiveController {

    @Autowired
    private SalesLeadRepository salesLeadRepository;

    @Autowired
    private SalesProposalRepository salesProposalRepository;

    @Autowired
    private SalesActivityRepository salesActivityRepository;

    @Autowired
    private SalesChatRepository salesChatRepository;

    @Autowired
    private SalesMessageRepository salesMessageRepository;

    @Autowired
    private SalesExecutiveRepository salesExecutiveRepository;

    @Autowired
    private SalesExecutiveService salesExecutiveService;

    @Autowired
    private RevenueEntryRepository revenueEntryRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        SalesExecutive res = salesExecutiveService.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
    }

    // No-op seedLeads method to keep code clean and prevent compilation errors if called elsewhere
    private void seedLeads(Long orgId) {
    }

    @GetMapping("/summary/org/{orgId}")
    public ResponseEntity<?> getSummaryStats(@PathVariable Long orgId) {
        List<SalesLead> leads = salesLeadRepository.findByOrganizationId(orgId);

        long totalLeads = leads.size();
        long hotCount = leads.stream().filter(l -> "Hot".equalsIgnoreCase(l.getStatus())).count();
        long warmCount = leads.stream().filter(l -> "Warm".equalsIgnoreCase(l.getStatus())).count();
        long coldCount = leads.stream().filter(l -> "Cold".equalsIgnoreCase(l.getStatus())).count();

        long pipelineValue = 0;
        for (SalesLead lead : leads) {
            try {
                String valStr = lead.getBudget().replaceAll("[^0-9]", "").trim();
                if (!valStr.isEmpty()) {
                    long val = Long.parseLong(valStr);
                    if (lead.getBudget().contains("Cr")) {
                        pipelineValue += val * 10000000;
                    } else if (lead.getBudget().contains("L")) {
                        pipelineValue += val * 100000;
                    } else {
                        pipelineValue += val;
                    }
                }
            } catch (Exception e) {
                // Ignore
            }
        }
        if (pipelineValue == 0) {
            pipelineValue = 37500000; // default baseline (₹3.75 Cr)
        }

        List<SalesProposal> proposals = salesProposalRepository.findByOrganizationId(orgId);
        long wonDeals = proposals.stream().filter(p -> "Approved".equalsIgnoreCase(p.getStatus())).count();

        List<RevenueEntry> revEntries = revenueEntryRepository.findByOrganizationId(orgId);
        long totalAchieved = revEntries.stream().mapToLong(RevenueEntry::getAchieved).sum();
        long totalTarget = revEntries.stream().mapToLong(RevenueEntry::getTarget).max().orElse(10000000L);
        if (totalTarget == 0) totalTarget = 10000000L;

        double achievementRate = (totalAchieved * 100.0) / totalTarget;
        double cr = totalLeads > 0 ? (wonDeals * 100.0 / totalLeads) : 0;

        String formattedTarget = "₹1,00,00,000";
        try {
            java.text.NumberFormat nf = java.text.NumberFormat.getCurrencyInstance(new java.util.Locale("en", "IN"));
            formattedTarget = nf.format(totalTarget).split("\\.")[0];
        } catch(Exception e) {}

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalLeads", totalLeads);
        summary.put("wonDeals", wonDeals);
        summary.put("revenueAchieved", "₹" + String.format("%.1f L", totalAchieved / 100000.0));
        summary.put("conversionRate", String.format("%.1f%%", cr));
        summary.put("pipelineValue", pipelineValue);
        summary.put("hotCount", hotCount);
        summary.put("warmCount", warmCount);
        summary.put("coldCount", coldCount);
        summary.put("monthlyTarget", formattedTarget);
        summary.put("achievementRate", String.format("%.1f%%", achievementRate));

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/leads/org/{orgId}")
    public ResponseEntity<List<SalesLead>> getLeadsByOrg(@PathVariable Long orgId) {
        List<SalesLead> list = salesLeadRepository.findByOrganizationId(orgId);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/leads")
    public ResponseEntity<SalesLead> createLead(@RequestBody SalesLead lead) {
        if (lead.getStatus() == null || lead.getStatus().isEmpty()) {
            lead.setStatus("Hot");
        }
        if (lead.getAddedOn() == null || lead.getAddedOn().isEmpty()) {
            lead.setAddedOn("28 May 2025");
        }
        return ResponseEntity.ok(salesLeadRepository.save(lead));
    }

    @PutMapping("/leads/{id}/qualify")
    public ResponseEntity<SalesLead> qualifyLead(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        SalesLead lead = salesLeadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found: " + id));

        if (payload.containsKey("budgetFit")) lead.setBudgetFit((String) payload.get("budgetFit"));
        if (payload.containsKey("decisionMaker")) lead.setDecisionMaker((String) payload.get("decisionMaker"));
        if (payload.containsKey("timelineFit")) lead.setTimelineFit((String) payload.get("timelineFit"));
        if (payload.containsKey("timeline")) lead.setTimeline((String) payload.get("timeline"));
        if (payload.containsKey("plotSize")) lead.setPlotSize((String) payload.get("plotSize"));
        if (payload.containsKey("floors")) lead.setFloors((String) payload.get("floors"));
        if (payload.containsKey("requirements")) lead.setRequirements((String) payload.get("requirements"));
        if (payload.containsKey("requirementClarity")) lead.setRequirementClarity((String) payload.get("requirementClarity"));
        if (payload.containsKey("competition")) lead.setCompetition((String) payload.get("competition"));
        if (payload.containsKey("leadScore")) lead.setLeadScore((Integer) payload.get("leadScore"));
        if (payload.containsKey("qualifiedStatus")) lead.setQualifiedStatus((String) payload.get("qualifiedStatus"));
        if (payload.containsKey("remarks")) lead.setRemarks((String) payload.get("remarks"));

        return ResponseEntity.ok(salesLeadRepository.save(lead));
    }

    @DeleteMapping("/leads/{id}")
    public ResponseEntity<?> deleteLead(@PathVariable Long id) {
        salesLeadRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Lead deleted successfully"));
    }

    @GetMapping("/proposals/org/{orgId}")
    public ResponseEntity<List<SalesProposal>> getProposalsByOrg(@PathVariable Long orgId) {
        List<SalesProposal> list = salesProposalRepository.findByOrganizationId(orgId);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/proposals")
    public ResponseEntity<SalesProposal> createProposal(@RequestBody SalesProposal proposal) {
        return ResponseEntity.ok(salesProposalRepository.save(proposal));
    }

    @GetMapping("/activities/org/{orgId}")
    public ResponseEntity<List<SalesActivity>> getActivitiesByOrg(@PathVariable Long orgId) {
        List<SalesActivity> list = salesActivityRepository.findByOrganizationId(orgId);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/activities")
    public ResponseEntity<SalesActivity> createActivity(@RequestBody SalesActivity activity) {
        return ResponseEntity.ok(salesActivityRepository.save(activity));
    }

    @GetMapping("/chats/org/{orgId}")
    public ResponseEntity<?> getChats(@PathVariable Long orgId) {
        List<SalesChat> chats = salesChatRepository.findByOrganizationId(orgId);

        List<Map<String, Object>> response = new ArrayList<>();
        for (SalesChat c : chats) {
            Map<String, Object> cMap = new HashMap<>();
            cMap.put("id", String.valueOf(c.getId()));
            cMap.put("name", c.getClientName());
            cMap.put("latest", c.getLatestMessage());
            cMap.put("time", c.getTime());
            cMap.put("unread", c.getUnread());

            List<SalesMessage> messages = salesMessageRepository.findByChatId(c.getId());
            List<Map<String, Object>> msgList = new ArrayList<>();
            for (SalesMessage m : messages) {
                Map<String, Object> mMap = new HashMap<>();
                mMap.put("id", String.valueOf(m.getId()));
                mMap.put("sender", m.getSender());
                mMap.put("text", m.getText());
                mMap.put("time", m.getTime());
                msgList.add(mMap);
            }
            cMap.put("messages", msgList);
            response.add(cMap);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/chats")
    public ResponseEntity<?> createChat(@RequestBody Map<String, Object> payload) {
        String clientName = (String) payload.get("clientName");
        Long organizationId = payload.get("organizationId") != null
                ? Long.valueOf(payload.get("organizationId").toString()) : null;

        if (clientName == null || clientName.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "clientName is required"));
        }

        SalesChat newChat = salesChatRepository.save(
                new SalesChat(clientName, "", new java.util.Date().toString(), false, organizationId)
        );

        Map<String, Object> response = new HashMap<>();
        response.put("id", String.valueOf(newChat.getId()));
        response.put("name", newChat.getClientName());
        response.put("latest", newChat.getLatestMessage());
        response.put("time", newChat.getTime());
        response.put("unread", newChat.getUnread());
        response.put("messages", new ArrayList<>());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/chats/{chatId}/messages")
    public ResponseEntity<SalesMessage> createMessage(@PathVariable Long chatId, @RequestBody SalesMessage message) {
        message.setChatId(chatId);
        SalesMessage saved = salesMessageRepository.save(message);

        SalesChat chat = salesChatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found: " + chatId));
        chat.setLatestMessage(message.getText());
        chat.setTime(message.getTime());
        salesChatRepository.save(chat);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/settings/user/{username}")
    public ResponseEntity<?> getSalesSettings(@PathVariable String username) {
        SalesExecutive exec = salesExecutiveRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Sales Executive not found: " + username));
        Map<String, Object> settings = new HashMap<>();
        settings.put("name", exec.getUsername());
        settings.put("email", exec.getEmail());
        settings.put("phone", exec.getPhone() != null ? exec.getPhone() : "+91 98765 43210");
        settings.put("smsNotifications", exec.getSmsNotifications() != null ? exec.getSmsNotifications() : true);
        settings.put("emailNotifications", exec.getEmailNotifications() != null ? exec.getEmailNotifications() : true);
        settings.put("whatsappAlerts", exec.getWhatsappAlerts() != null ? exec.getWhatsappAlerts() : true);
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/settings/user/{username}")
    public ResponseEntity<?> updateSalesSettings(@PathVariable String username, @RequestBody Map<String, Object> payload) {
        SalesExecutive exec = salesExecutiveRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Sales Executive not found: " + username));

        if (payload.containsKey("email")) {
            exec.setEmail((String) payload.get("email"));
        }
        if (payload.containsKey("phone")) {
            exec.setPhone((String) payload.get("phone"));
        }
        if (payload.containsKey("smsNotifications")) {
            exec.setSmsNotifications((Boolean) payload.get("smsNotifications"));
        }
        if (payload.containsKey("emailNotifications")) {
            exec.setEmailNotifications((Boolean) payload.get("emailNotifications"));
        }
        if (payload.containsKey("whatsappAlerts")) {
            exec.setWhatsappAlerts((Boolean) payload.get("whatsappAlerts"));
        }

        salesExecutiveRepository.save(exec);
        return ResponseEntity.ok(Map.of("message", "Settings updated successfully"));
    }

    // ─── REVENUE CHART ────────────────────────────────────────────────
    @GetMapping("/revenue/org/{orgId}")
    public ResponseEntity<?> getRevenueByOrg(@PathVariable Long orgId) {
        List<RevenueEntry> entries = revenueEntryRepository.findByOrganizationId(orgId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (RevenueEntry e : entries) {
            Map<String, Object> row = new HashMap<>();
            row.put("id", e.getId());
            row.put("name", e.getWeek());
            row.put("Target", e.getTarget() / 100000);   // convert to Lakhs
            row.put("Achieved", e.getAchieved() / 100000);
            result.add(row);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/revenue")
    public ResponseEntity<?> upsertRevenue(@RequestBody Map<String, Object> payload) {
        Long orgId = payload.get("organizationId") != null ? Long.valueOf(payload.get("organizationId").toString()) : null;
        String week = (String) payload.get("week");
        Long target = payload.get("target") != null ? Long.valueOf(payload.get("target").toString()) * 100000 : 0L;
        Long achieved = payload.get("achieved") != null ? Long.valueOf(payload.get("achieved").toString()) * 100000 : 0L;

        List<RevenueEntry> existing = revenueEntryRepository.findByOrganizationId(orgId);
        RevenueEntry entry = existing.stream()
                .filter(e -> e.getWeek().equals(week))
                .findFirst()
                .orElse(new RevenueEntry());
        entry.setWeek(week);
        entry.setTarget(target);
        entry.setAchieved(achieved);
        entry.setOrganizationId(orgId);
        revenueEntryRepository.save(entry);

        Map<String, Object> row = new HashMap<>();
        row.put("name", entry.getWeek());
        row.put("Target", entry.getTarget() / 100000);
        row.put("Achieved", entry.getAchieved() / 100000);
        return ResponseEntity.ok(row);
    }

    // ─── AI INSIGHTS ──────────────────────────────────────────────────
    @GetMapping("/ai-insights/org/{orgId}")
    public ResponseEntity<?> getAiInsights(@PathVariable Long orgId) {
        List<SalesLead> leads = salesLeadRepository.findByOrganizationId(orgId);
        List<SalesActivity> activities = salesActivityRepository.findByOrganizationId(orgId);

        List<String> insights = new ArrayList<>();
        List<String> actions = new ArrayList<>();

        long hotCount   = leads.stream().filter(l -> "Hot".equalsIgnoreCase(l.getStatus())).count();
        long warmCount  = leads.stream().filter(l -> "Warm".equalsIgnoreCase(l.getStatus())).count();
        long coldCount  = leads.stream().filter(l -> "Cold".equalsIgnoreCase(l.getStatus())).count();
        long pending    = activities.stream().filter(a -> "Pending".equalsIgnoreCase(a.getStatus())).count();
        long qualified  = leads.stream().filter(l -> l.getQualifiedStatus() != null && !l.getQualifiedStatus().isEmpty()).count();

        if (hotCount > 0) {
            leads.stream().filter(l -> "Hot".equalsIgnoreCase(l.getStatus())).findFirst().ifPresent(l -> {
                insights.add(l.getName() + " is a Hot Lead — highest conversion probability this month.");
                actions.add("Call " + l.getName() + " today — Hot Lead, prioritize immediately!");
            });
        }
        if (warmCount > 0) {
            leads.stream().filter(l -> "Warm".equalsIgnoreCase(l.getStatus())).findFirst().ifPresent(l ->
                    insights.add(l.getName() + " is Warm — a follow-up call can upgrade them to Hot."));
        }
        if (coldCount > 0) {
            insights.add(coldCount + " Cold lead(s) need re-engagement. Share a testimonial video or revised proposal.");
            actions.add("Re-engage " + coldCount + " Cold lead(s) with a fresh offer this week.");
        }
        if (pending > 0) {
            insights.add(pending + " follow-up task(s) are overdue — completing them prevents lead loss.");
            actions.add("Clear " + pending + " pending follow-up(s) before end of day.");
        }
        if (qualified > 0) {
            insights.add(qualified + " lead(s) fully qualified — move them to proposal stage now.");
            actions.add("Send proposals to " + qualified + " qualified lead(s) — they are ready to close.");
        }
        if (leads.isEmpty()) {
            insights.add("No leads registered yet. Add leads to unlock AI-driven insights.");
        }

        // Top source analysis
        Map<String, Long> sourceCounts = new HashMap<>();
        for (SalesLead l : leads) {
            String src = l.getSource() != null ? l.getSource() : "Unknown";
            sourceCounts.put(src, sourceCounts.getOrDefault(src, 0L) + 1);
        }
        sourceCounts.entrySet().stream().max(Map.Entry.comparingByValue()).ifPresent(e ->
                insights.add(e.getKey() + " is your top lead source (" + e.getValue() + " leads) — invest more budget here."));

        // Project type analysis
        long villaCount = leads.stream().filter(l -> "Villa".equalsIgnoreCase(l.getProjectType())).count();
        long aptCount   = leads.stream().filter(l -> "Apartment".equalsIgnoreCase(l.getProjectType())).count();
        if (villaCount > aptCount && villaCount > 0)
            insights.add("Villa projects dominate (" + villaCount + " leads) — focus your pitch on villa packages.");
        else if (aptCount > 0)
            insights.add("Apartment projects are strong this month — tailor proposals for apartment clients.");

        if (actions.isEmpty()) actions.add("Add more leads to unlock personalized AI action recommendations.");

        Map<String, Object> response = new HashMap<>();
        response.put("insights", insights);
        response.put("actions", actions);
        response.put("summary", Map.of(
                "totalLeads", leads.size(),
                "hotLeads", hotCount,
                "warmLeads", warmCount,
                "coldLeads", coldCount,
                "pendingFollowUps", pending,
                "qualifiedLeads", qualified
        ));
        return ResponseEntity.ok(response);
    }

    // ─── CALENDAR EVENTS ──────────────────────────────────────────────
    @GetMapping("/calendar/org/{orgId}")
    public ResponseEntity<?> getCalendarEvents(@PathVariable Long orgId) {
        List<SalesActivity> activities = salesActivityRepository.findByOrganizationId(orgId);

        // Backfill dates for legacy seeded records that have no date
        String[] dateSeed = {"2025-05-26", "2025-05-27", "2025-05-28", "2025-05-28", "2025-05-29"};
        for (int i = 0; i < activities.size(); i++) {
            SalesActivity a = activities.get(i);
            if (a.getDate() == null || a.getDate().isEmpty()) {
                a.setDate(i < dateSeed.length ? dateSeed[i] : java.time.LocalDate.now().toString());
                salesActivityRepository.save(a);
            }
        }

        // Group by date
        Map<String, List<Map<String, Object>>> grouped = new LinkedHashMap<>();
        for (SalesActivity a : activities) {
            String date = a.getDate() != null ? a.getDate() : java.time.LocalDate.now().toString();
            grouped.computeIfAbsent(date, k -> new ArrayList<>());
            Map<String, Object> ev = new HashMap<>();
            ev.put("id", a.getId());
            ev.put("title", a.getActivity());
            ev.put("leadName", a.getLeadName());
            ev.put("type", a.getType());
            ev.put("time", a.getTime());
            ev.put("status", a.getStatus());
            grouped.get(date).add(ev);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, List<Map<String, Object>>> entry : grouped.entrySet()) {
            Map<String, Object> day = new HashMap<>();
            day.put("date", entry.getKey());
            day.put("events", entry.getValue());
            result.add(day);
        }
        return ResponseEntity.ok(result);
    }
}
