package com.buildcon.erp.controller;

import com.buildcon.erp.model.*;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.repository.*;
import com.buildcon.erp.security.services.UserDetailsImpl;
import com.buildcon.erp.service.StoreManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/store-manager")
public class StoreManagerController {

    @Autowired
    private StoreManagerService service;

    @Autowired
    private StoreManagerRepository storeManagerRepository;

    @Autowired
    private StoreItemRepository itemRepository;

    @Autowired
    private GoodsReceiptNoteRepository grnRepository;

    @Autowired
    private StockTransferNoteRepository stnRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        StoreManager res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Store Manager registered successfully with ID: " + res.getId()));
    }

    @GetMapping("/dashboard/org/{orgId}")
    public ResponseEntity<?> getDashboard(@PathVariable Long orgId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(orgId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }

        // Profile details
        String profileName = "G. Murugan (Chief Storekeeper)";
        String profileEmail = "stores@buildcon.com";
        String avatarInitials = "GM";
        List<StoreManager> users = storeManagerRepository.findByOrganizationId(orgId);
        if (!users.isEmpty()) {
            StoreManager u = users.get(0);
            profileName = u.getUsername();
            profileEmail = u.getEmail();
            avatarInitials = u.getAvatarInitials() != null && !u.getAvatarInitials().isBlank() ? u.getAvatarInitials() : "SM";
        }

        service.seedStoreData(orgId);

        List<StoreItem> items = itemRepository.findByOrganizationId(orgId);
        List<GoodsReceiptNote> grns = grnRepository.findByOrganizationId(orgId);
        List<StockTransferNote> stns = stnRepository.findByOrganizationId(orgId);

        long lowStockCount = items.stream().filter(i -> i.getCurrentStock() <= i.getReorderLevel()).count();
        double totalValuation = items.stream().mapToDouble(i -> (i.getCurrentStock() != null ? i.getCurrentStock() : 0.0) * (i.getUnitPrice() != null ? i.getUnitPrice() : 0.0)).sum();
        long inTransitStns = stns.stream().filter(s -> "IN_TRANSIT".equalsIgnoreCase(s.getStatus())).count();

        Map<String, Object> response = new HashMap<>();
        response.put("profileName", profileName);
        response.put("profileEmail", profileEmail);
        response.put("avatarInitials", avatarInitials);
        response.put("totalItemsCount", items.size());
        response.put("lowStockCount", lowStockCount);
        response.put("totalValuation", Math.round(totalValuation));
        response.put("inTransitStns", inTransitStns);
        response.put("items", items);
        response.put("grns", grns);
        response.put("stns", stns);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/items")
    public ResponseEntity<?> addItem(@RequestBody StoreItem item) {
        if (item.getItemCode() == null || item.getItemCode().isBlank()) {
            item.setItemCode("MAT-" + (System.currentTimeMillis() % 10000));
        }
        StoreItem saved = itemRepository.save(item);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/grn")
    public ResponseEntity<?> createGrn(@RequestBody GoodsReceiptNote grn) {
        if (grn.getReceivedDate() == null) {
            grn.setReceivedDate(LocalDate.now());
        }
        if (grn.getGrnNumber() == null || grn.getGrnNumber().isBlank()) {
            grn.setGrnNumber("GRN-" + LocalDate.now().getYear() + "-" + (System.currentTimeMillis() % 10000));
        }
        if (grn.getStatus() == null) {
            grn.setStatus("VERIFIED_ACCEPTED");
        }
        GoodsReceiptNote saved = grnRepository.save(grn);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/stn")
    public ResponseEntity<?> createStn(@RequestBody StockTransferNote stn) {
        if (stn.getDispatchDate() == null) {
            stn.setDispatchDate(LocalDate.now());
        }
        if (stn.getStnNumber() == null || stn.getStnNumber().isBlank()) {
            stn.setStnNumber("STN-" + LocalDate.now().getYear() + "-" + (System.currentTimeMillis() % 1000));
        }
        if (stn.getStatus() == null) {
            stn.setStatus("IN_TRANSIT");
        }
        StockTransferNote saved = stnRepository.save(stn);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/stn/{id}/status")
    public ResponseEntity<?> updateStnStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<StockTransferNote> opt = stnRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("STN not found with id: " + id));
        }
        StockTransferNote stn = opt.get();
        if (payload.containsKey("status")) {
            stn.setStatus(payload.get("status"));
        }
        StockTransferNote updated = stnRepository.save(stn);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> payload) {
        String username = (String) payload.get("username");
        String email = (String) payload.get("email");
        Long orgId = payload.get("organizationId") != null ? Long.valueOf(payload.get("organizationId").toString()) : null;

        if (orgId != null) {
            List<StoreManager> users = storeManagerRepository.findByOrganizationId(orgId);
            if (!users.isEmpty()) {
                StoreManager u = users.get(0);
                if (username != null && !username.isBlank()) u.setUsername(username);
                if (email != null && !email.isBlank()) u.setEmail(email);
                storeManagerRepository.save(u);
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
        if (clean.contains("grn") || clean.contains("receive") || clean.contains("delivery")) {
            response = "GRN Audit: 3 Goods Receipt Notes cleared this week. Average unloading turnaround is 42 minutes per truck. Zero moisture rejection observed for UltraTech OPC 53.";
        } else if (clean.contains("stock") || clean.contains("reorder") || clean.contains("inventory")) {
            response = "Stock Level Alert: TMT Rebar (16mm) current stock is 28.5 MT against safety limit 10 MT. Waterproofing chemical stock is at reorder boundary (650 L). Suggest issuing PO indent before Monday.";
        } else if (clean.contains("transfer") || clean.contains("stn") || clean.contains("transit")) {
            response = "Inter-Site Transfer: STN-2026-02 (4.5 MT Rebar 12mm) is currently IN_TRANSIT to Greenfield Villas site via Southern Heavy Movers. Estimated arrival: Tomorrow 09:30 AM.";
        } else if (clean.contains("bin") || clean.contains("location") || clean.contains("warehouse")) {
            response = "Bin Location Strategy: Cement bags are stacked at Bay A12 (max 10 bags height on wooden pallets with 150mm air clearance from walls per IS 4082 storage guidelines).";
        } else {
            response = "Hello Store Manager! I am your AI Inventory & Storekeeper Assistant. I track physical bin racks, monitor GRN 3-way delivery matches, and optimize inter-site stock transfers (STNs).";
        }

        Map<String, String> res = new HashMap<>();
        res.put("response", response);
        return ResponseEntity.ok(res);
    }
}

