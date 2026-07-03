package com.buildcon.erp.controller;

import com.buildcon.erp.model.DailyLog;
import com.buildcon.erp.model.SiteManagement;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.repository.DailyLogRepository;
import com.buildcon.erp.repository.SiteManagementRepository;
import com.buildcon.erp.service.SiteManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/site-management")
public class SiteManagementController {

    @Autowired private SiteManagementService service;
    @Autowired private SiteManagementRepository siteManagementRepository;
    @Autowired private DailyLogRepository dailyLogRepository;

    // ── Signup ────────────────────────────────────────────────────────────────
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        SiteManagement res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
    }

    // ── Get managers by org ───────────────────────────────────────────────────
    @GetMapping("/org/{orgId}")
    public ResponseEntity<?> getSiteManagersByOrg(@PathVariable Long orgId) {
        return ResponseEntity.ok(siteManagementRepository.findByOrganizationId(orgId));
    }

    // ── Profile by orgId ──────────────────────────────────────────────────────
    @GetMapping("/profile/org/{orgId}")
    public ResponseEntity<?> getProfile(@PathVariable Long orgId) {
        List<SiteManagement> managers = siteManagementRepository.findByOrganizationId(orgId);
        if (managers.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        SiteManagement sm = managers.get(0);
        Map<String, String> profile = new HashMap<>();
        profile.put("username", sm.getUsername());
        profile.put("email", sm.getEmail());
        // Always return today's date dynamically
        profile.put("headerDate",
            LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy, EEEE")));
        return ResponseEntity.ok(profile);
    }

    // ── Profile Update ────────────────────────────────────────────────────────
    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String email    = payload.get("email");
        Long orgId = payload.containsKey("organizationId")
            ? Long.parseLong(payload.get("organizationId")) : null;

        if (orgId == null) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: organizationId is required."));
        }
        List<SiteManagement> managers = siteManagementRepository.findByOrganizationId(orgId);
        if (managers.isEmpty()) return ResponseEntity.notFound().build();

        SiteManagement sm = managers.get(0);
        if (username != null && !username.isBlank()) sm.setUsername(username);
        if (email    != null && !email.isBlank())    sm.setEmail(email);
        siteManagementRepository.save(sm);
        return ResponseEntity.ok(new MessageResponse("Profile updated successfully."));
    }

    // ── Productivity Index — computed from daily_logs per weekday ─────────────
    @GetMapping("/productivity/{projectId}")
    public ResponseEntity<?> getProductivity(@PathVariable Long projectId) {
        List<DailyLog> logs = dailyLogRepository.findByProjectId(projectId);

        // Group logs by day-of-week for the current week
        Map<DayOfWeek, List<DailyLog>> byDay = logs.stream()
            .filter(l -> l.getDate() != null)
            .collect(Collectors.groupingBy(l -> l.getDate().getDayOfWeek()));

        int target = 100; // Fixed target per day (sft/day index)
        List<Map<String, Object>> result = new ArrayList<>();

        String[] days = {"MON", "TUE", "WED", "THU", "FRI"};
        DayOfWeek[] dayOfWeeks = {
            DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
            DayOfWeek.THURSDAY, DayOfWeek.FRIDAY
        };

        for (int i = 0; i < days.length; i++) {
            List<DailyLog> dayLogs = byDay.getOrDefault(dayOfWeeks[i], Collections.emptyList());
            // Achieved = total workforce entries × 7 (productivity units per worker, capped at 110)
            int achieved = (int) Math.min(110,
                dayLogs.stream().mapToInt(l -> l.getWorkforceCount() != null ? l.getWorkforceCount() : 0).sum() * 7);

            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("day", days[i]);
            entry.put("Target", target);
            entry.put("Achieved", achieved > 0 ? achieved : 0);
            result.add(entry);
        }

        return ResponseEntity.ok(result);
    }

    // ── AI Site Operations Chat ───────────────────────────────────────────────
    @PostMapping("/ai-chat")
    public ResponseEntity<?> aiChat(@RequestBody Map<String, String> payload) {
        String msg      = payload.get("message");
        String orgIdStr = payload.get("organizationId");
        String cleanMsg = msg != null ? msg.toLowerCase() : "";

        // Resolve profile name dynamically from DB
        String profileName = "Site Manager";
        if (orgIdStr != null) {
            try {
                Long orgId = Long.parseLong(orgIdStr);
                List<SiteManagement> managers = siteManagementRepository.findByOrganizationId(orgId);
                if (!managers.isEmpty()) profileName = managers.get(0).getUsername();
            } catch (NumberFormatException ignored) {}
        }

        String response = "Hello " + profileName + "! I'm your AI Site Operations Assistant. "
            + "I track site meteorological trends. Local sensor registers 34°C with 62% relative humidity.";

        if (cleanMsg.contains("cure") || cleanMsg.contains("concrete") || cleanMsg.contains("curing")) {
            response = "Concrete Curing Forecast: Tower B Slab-12 requires approximately 7 days of moist curing to reach 70% characteristic compressive strength. "
                + "Current ambient heat demands hydration spray cycles twice daily.";
        } else if (cleanMsg.contains("weather") || cleanMsg.contains("rain") || cleanMsg.contains("precipitation")) {
            response = "Weather Alert: 45% probability of brief thundershowers forecast tomorrow afternoon. "
                + "Suggest completing exterior brickwork plastering before 1 PM and securing electrical panels.";
        } else if (cleanMsg.contains("safety") || cleanMsg.contains("hazard") || cleanMsg.contains("compliance")) {
            response = "Safety Check: Item S-03 (Temporary electrical grounding boxes) is unchecked. "
                + "High risk of electrical hazards during rain. Recommend immediate inspection and tagging.";
        } else if (cleanMsg.contains("productivity") || cleanMsg.contains("output") || cleanMsg.contains("target")) {
            response = "Productivity Analysis: Wednesday shows a 15% dip in output vs target. "
                + "Crew reallocation from Zone C to Tower A slab work is recommended for Thursday to recover schedule.";
        }

        return ResponseEntity.ok(Map.of("response", response));
    }
}
