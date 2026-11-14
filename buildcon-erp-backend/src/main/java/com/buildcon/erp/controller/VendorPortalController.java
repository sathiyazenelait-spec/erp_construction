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
@RequestMapping({"/api/vendor-portal", "/api/vendor"})
public class VendorPortalController {

    @Autowired
    private VendorSupplierRepository vendorSupplierRepository;

    @Autowired
    private VendorBidRepository vendorBidRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private PmRfqRepository rfqRepository;

    @Autowired
    private PasswordEncoder encoder;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        if (vendorSupplierRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }
        if (vendorSupplierRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        VendorSupplier vs = new VendorSupplier(
            request.getUsername(),
            request.getEmail(),
            encoder.encode(request.getPassword())
        );
        vs.setOrganizationId(request.getOrganizationId());
        VendorSupplier saved = vendorSupplierRepository.save(vs);
        return ResponseEntity.ok(new MessageResponse("Vendor registered successfully with ID: " + saved.getId()));
    }

    @GetMapping("/dashboard/org/{orgId}")
    public ResponseEntity<?> getDashboard(@PathVariable Long orgId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(orgId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }

        String profileName = "Tata Tiscon Direct (Vendor)";
        String profileEmail = "vendor@tatatiscon.com";
        String avatarInitials = "TT";
        List<VendorSupplier> users = vendorSupplierRepository.findByOrganizationId(orgId);
        if (!users.isEmpty()) {
            VendorSupplier u = users.get(0);
            profileName = u.getUsername();
            profileEmail = u.getEmail();
            avatarInitials = u.getAvatarInitials() != null && !u.getAvatarInitials().isBlank() ? u.getAvatarInitials() : "VD";
        }

        // Seed default bids if empty
        List<VendorBid> bids = vendorBidRepository.findByOrganizationId(orgId);
        if (bids.isEmpty()) {
            vendorBidRepository.save(new VendorBid("RFQ-2026-01", "TMT Steel Rebar Fe500D (16mm)", "Tata Tiscon Direct", 67500.0, "MT", 3, LocalDate.now().minusDays(1), "ACCEPTED", "Delivery within 72 hrs. Payment 30 days post GRN verification.", orgId));
            vendorBidRepository.save(new VendorBid("RFQ-2026-02", "Structural Steel I-Beams (ISMB 300)", "Jindal Steel & Power", 71000.0, "MT", 7, LocalDate.now(), "UNDER_EVALUATION", "F.O.R. site delivery included.", orgId));
            bids = vendorBidRepository.findByOrganizationId(orgId);
        }

        // Fetch POs
        List<PurchaseOrder> pos = purchaseOrderRepository.findByOrganizationId(orgId);

        Map<String, Object> response = new HashMap<>();
        response.put("profileName", profileName);
        response.put("profileEmail", profileEmail);
        response.put("avatarInitials", avatarInitials);
        response.put("totalBids", bids.size());
        response.put("acceptedBids", bids.stream().filter(b -> "ACCEPTED".equalsIgnoreCase(b.getStatus())).count());
        response.put("openPosCount", pos.size());
        response.put("bids", bids);
        response.put("purchaseOrders", pos);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/bids")
    public ResponseEntity<?> submitBid(@RequestBody VendorBid bid) {
        if (bid.getQuoteDate() == null) {
            bid.setQuoteDate(LocalDate.now());
        }
        if (bid.getStatus() == null) {
            bid.setStatus("SUBMITTED");
        }
        VendorBid saved = vendorBidRepository.save(bid);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> payload) {
        String username = (String) payload.get("username");
        String email = (String) payload.get("email");
        Long orgId = payload.get("organizationId") != null ? Long.valueOf(payload.get("organizationId").toString()) : null;

        if (orgId != null) {
            List<VendorSupplier> users = vendorSupplierRepository.findByOrganizationId(orgId);
            if (!users.isEmpty()) {
                VendorSupplier u = users.get(0);
                if (username != null && !username.isBlank()) u.setUsername(username);
                if (email != null && !email.isBlank()) u.setEmail(email);
                vendorSupplierRepository.save(u);
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
        if (clean.contains("bid") || clean.contains("rfq") || clean.contains("quote")) {
            response = "RFQ Bid Status: Your quotation for RFQ-2026-01 (TMT Rebar @ ₹67,500/MT) has been marked ACCEPTED by the Procurement Manager. PO issuance is underway.";
        } else if (clean.contains("po") || clean.contains("order") || clean.contains("delivery")) {
            response = "Purchase Order Insights: 2 active purchase orders assigned. Recommended dispatch staging window is between 06:00 AM - 10:00 AM to align with site crane unloading availability.";
        } else if (clean.contains("payment") || clean.contains("invoice")) {
            response = "Payment Tracking: Invoices linked to verified GRN notes are cleared on a net-30 schedule. Advance payout vouchers are released upon gate-entry security receipt.";
        } else {
            response = "Hello Supplier Partner! I am your AI Vendor Assistant. I track live RFQs, confirm purchase order delivery schedules, and update invoice payment clearances.";
        }

        Map<String, String> res = new HashMap<>();
        res.put("response", response);
        return ResponseEntity.ok(res);
    }
}

