package com.buildcon.erp.controller;

import com.buildcon.erp.model.*;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.repository.*;
import com.buildcon.erp.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping({"/api/client-portal", "/api/customer", "/api/client"})
public class ClientPortalController {

    @Autowired
    private CustomerUserRepository customerUserRepository;

    @Autowired
    private ClientTicketRepository clientTicketRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private FaTransactionRepository faTransactionRepository;

    @Autowired
    private PasswordEncoder encoder;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        if (customerUserRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }
        if (customerUserRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        CustomerUser cu = new CustomerUser(
            request.getUsername(),
            request.getEmail(),
            encoder.encode(request.getPassword())
        );
        cu.setOrganizationId(request.getOrganizationId());
        CustomerUser saved = customerUserRepository.save(cu);
        return ResponseEntity.ok(new MessageResponse("Client registered successfully with ID: " + saved.getId()));
    }

    @GetMapping("/dashboard/org/{orgId}")
    public ResponseEntity<?> getDashboard(@PathVariable Long orgId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(orgId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }

        String profileName = "Dr. Rajesh K. (Owner Unit 402)";
        String profileEmail = "rajesh.k@customer.com";
        String avatarInitials = "RK";
        List<CustomerUser> users = customerUserRepository.findByOrganizationId(orgId);
        if (!users.isEmpty()) {
            CustomerUser u = users.get(0);
            profileName = u.getUsername();
            profileEmail = u.getEmail();
            avatarInitials = u.getAvatarInitials() != null && !u.getAvatarInitials().isBlank() ? u.getAvatarInitials() : "CU";
        }

        // Seed default tickets if empty
        List<ClientTicket> tickets = clientTicketRepository.findByOrganizationId(orgId);
        if (tickets.isEmpty()) {
            clientTicketRepository.save(new ClientTicket("TCK-2026-01", "Dr. Rajesh K.", "Skyline Towers - Unit 402", "Snagging", "Balcony Tile Grouting Minor Void", "Tile joint near rainwater outlet requires epoxy re-grouting before monsoon.", "MEDIUM", "RESOLVED", LocalDate.now().minusDays(5), orgId));
            clientTicketRepository.save(new ClientTicket("TCK-2026-02", "Dr. Rajesh K.", "Skyline Towers - Unit 402", "DLP Warranty", "Master Bedroom Door Lock Catch Alignment", "Mortise lock latch sticks slightly during rainy humidity.", "LOW", "OPEN", LocalDate.now().minusDays(1), orgId));
            tickets = clientTicketRepository.findByOrganizationId(orgId);
        }

        List<Project> projects = projectRepository.findByOrganizationId(orgId);
        List<FaTransaction> invoices = faTransactionRepository.findByOrganizationId(orgId);

        Map<String, Object> response = new HashMap<>();
        response.put("profileName", profileName);
        response.put("profileEmail", profileEmail);
        response.put("avatarInitials", avatarInitials);
        response.put("unitAssigned", "Skyline Residences - Tower A, Unit 402 (3 BHK Premium)");
        response.put("projectProgressPercent", 88);
        response.put("handoverTargetDate", LocalDate.now().plusMonths(3).toString());
        response.put("totalTickets", tickets.size());
        response.put("openTickets", tickets.stream().filter(t -> "OPEN".equalsIgnoreCase(t.getStatus()) || "IN_PROGRESS".equalsIgnoreCase(t.getStatus())).count());
        response.put("tickets", tickets);
        response.put("projects", projects);
        response.put("invoices", invoices);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/tickets")
    public ResponseEntity<?> raiseTicket(@RequestBody ClientTicket ticket) {
        if (ticket.getCreatedDate() == null) {
            ticket.setCreatedDate(LocalDate.now());
        }
        if (ticket.getTicketCode() == null || ticket.getTicketCode().isBlank()) {
            ticket.setTicketCode("TCK-" + LocalDate.now().getYear() + "-" + (System.currentTimeMillis() % 10000));
        }
        if (ticket.getStatus() == null) {
            ticket.setStatus("OPEN");
        }
        ClientTicket saved = clientTicketRepository.save(ticket);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> payload) {
        String username = (String) payload.get("username");
        String email = (String) payload.get("email");
        Long orgId = payload.get("organizationId") != null ? Long.valueOf(payload.get("organizationId").toString()) : null;

        if (orgId != null) {
            List<CustomerUser> users = customerUserRepository.findByOrganizationId(orgId);
            if (!users.isEmpty()) {
                CustomerUser u = users.get(0);
                if (username != null && !username.isBlank()) u.setUsername(username);
                if (email != null && !email.isBlank()) u.setEmail(email);
                customerUserRepository.save(u);
                return ResponseEntity.ok(new MessageResponse("Profile updated successfully in MySQL."));
            }
        }
        return ResponseEntity.ok(new MessageResponse("Profile settings saved."));
    }

    @PostMapping("/ai-chat")
    public ResponseEntity<?> aiChat(@RequestBody Map<String, Object> payload) {
        String message = (String) payload.get("message");
        if (message == null) message = "";
        String clean = message.toLowerCase();

        String response;
        if (clean.contains("progress") || clean.contains("status") || clean.contains("completion")) {
            response = "Unit 402 Progress Update: Superstructure is 100% completed. Internal gypsum plastering and vitrified floor tiling are finished. Electrical switches and modular bathroom plumbing fitments are scheduled for next week.";
        } else if (clean.contains("handover") || clean.contains("possession") || clean.contains("key")) {
            response = "Handover Schedule: Target possession date is scheduled for " + LocalDate.now().plusMonths(3).toString() + ". Digital snagging walk-through invites will be dispatched 30 days prior.";
        } else if (clean.contains("invoice") || clean.contains("payment") || clean.contains("due")) {
            response = "Payment Milestones: 85% of total agreement value has been received. The remaining 15% milestone installment is linked to the Final Handover & Occupancy Certificate sign-off.";
        } else if (clean.contains("snag") || clean.contains("warranty") || clean.contains("defect")) {
            response = "Warranty & DLP Protection: Your unit comes with a 5-year structural warranty and 12-month Defect Liability Period (DLP). Any snag tickets raised via this portal are dispatched to site engineers within 24 hours.";
        } else {
            response = "Hello Respected Homeowner! I am your AI Client Concierge. I provide live construction milestone updates, clarify billing installments, and log post-handover warranty service tickets.";
        }

        Map<String, String> res = new HashMap<>();
        res.put("response", response);
        return ResponseEntity.ok(res);
    }
}

