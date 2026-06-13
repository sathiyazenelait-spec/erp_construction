package com.buildcon.erp.controller;

import com.buildcon.erp.payload.request.AiChatRequest;
import com.buildcon.erp.payload.response.AiChatResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class AiController {

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@RequestBody AiChatRequest request) {
        String message = request.getMessage().toLowerCase();
        String role = request.getRole() != null ? request.getRole().toLowerCase() : "user";
        
        String responseText = "I am the BuildWell AI Assistant. How can I help you with your role as " + role + "?";
        
        if (message.contains("hello") || message.contains("hi")) {
            responseText = "Hello! I am your BuildWell Copilot. As a " + role + ", I can analyze timelines, flag safety concerns, audit work claims, or check Aadhaar worker logs. What's on your mind today?";
        } else if (message.contains("claim") || message.contains("billing")) {
            responseText = "Understood. For progress claims: Subcontractors submit claims -> Quantity Surveyors check measurement logs against BOQ limits -> Project Managers approve them -> Finance releases payouts. You can manage or track this in the respective dashboard tab.";
        } else if (message.contains("cube") || message.contains("concrete") || message.contains("test")) {
            responseText = "Concrete strength logs: The Senior Site Engineer logs 7-day and 28-day compression cube test strengths. If tests fail (below specifications like M25/M30), a Non-Conformance Report (NCR) is generated automatically.";
        } else if (message.contains("aadhaar") || message.contains("worker")) {
            responseText = "Worker verification status: The Workforce Manager audits subcontractor headcounts and conducts Aadhaar verification checkouts. We keep worker identity profiles securely stored in the organization's database.";
        } else if (message.contains("cad") || message.contains("clash")) {
            responseText = "3D CAD coordination: Clash detection checks structure against mechanical, electrical, and plumbing (MEP) layouts. Unresolved clashes should be marked for review immediately.";
        } else if (message.contains("gantt") || message.contains("schedule") || message.contains("timeline")) {
            responseText = "Construction timeline: Project Managers can monitor phase progress and flag work items that fall behind schedule, automatically alerting construction superintendents.";
        } else if (message.contains("inventory") || message.contains("stock")) {
            responseText = "Supply control: The Procurement Manager manages inventory catalogs and issues Requests for Quotes (RFQs). System warnings trigger when critical materials drop below low-stock thresholds.";
        }
        
        return ResponseEntity.ok(new AiChatResponse(responseText));
    }
}
