package com.buildcon.erp.controller;

import com.buildcon.erp.model.MeetingActionItem;
import com.buildcon.erp.model.MeetingRecord;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/meetings")
public class MeetingController {

    @Autowired
    private MeetingService meetingService;

    @GetMapping("/org/{orgId}")
    public ResponseEntity<?> getMeetingDashboard(@PathVariable Long orgId) {
        List<MeetingRecord> meetings = meetingService.getMeetings(orgId);
        List<MeetingActionItem> actionItems = meetingService.getActionItems(orgId);

        long openActions = actionItems.stream().filter(a -> !"COMPLETED".equalsIgnoreCase(a.getStatus())).count();
        long completedActions = actionItems.stream().filter(a -> "COMPLETED".equalsIgnoreCase(a.getStatus())).count();

        Map<String, Object> response = new HashMap<>();
        response.put("totalMeetings", meetings.size());
        response.put("totalActionItems", actionItems.size());
        response.put("openActionItems", openActions);
        response.put("completedActionItems", completedActions);
        response.put("meetings", meetings);
        response.put("actionItems", actionItems);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/schedule")
    public ResponseEntity<?> scheduleMeeting(@RequestBody MeetingRecord meeting) {
        MeetingRecord saved = meetingService.createMeeting(meeting);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/action-items")
    public ResponseEntity<?> createActionItem(@RequestBody MeetingActionItem item) {
        MeetingActionItem saved = meetingService.createActionItem(item);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/action-items/{id}/status")
    public ResponseEntity<?> updateActionStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Status is required"));
        }
        Optional<MeetingActionItem> opt = meetingService.updateActionItemStatus(id, status);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Action item not found with ID: " + id));
        }
        return ResponseEntity.ok(opt.get());
    }
}
