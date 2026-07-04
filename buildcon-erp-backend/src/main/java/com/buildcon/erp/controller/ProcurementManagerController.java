package com.buildcon.erp.controller;

import com.buildcon.erp.model.*;
import com.buildcon.erp.repository.*;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.ProcurementManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.buildcon.erp.security.services.UserDetailsImpl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/procurement-manager")
public class ProcurementManagerController {

    @Autowired
    private ProcurementManagerService service;

    @Autowired
    private ProcurementManagerRepository procurementManagerRepository;

    @Autowired
    private PmInventoryItemRepository pmInventoryItemRepository;

    @Autowired
    private PmRfqRepository pmRfqRepository;

    @Autowired
    private PmVendorRepository pmVendorRepository;

    @Autowired
    private PmRequisitionRepository pmRequisitionRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private DashboardShellConfigRepository dashboardShellConfigRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        ProcurementManager res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
    }

    private String currentHeaderDate() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy, EEEE"));
    }

    private synchronized String generateRfqId() {
        long count = pmRfqRepository.count();
        return String.format("RFQ-%03d", count + 102);
    }

    @GetMapping("/dashboard/org/{orgId}")
    public ResponseEntity<?> getDashboard(@PathVariable Long orgId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(orgId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }
        // Org details
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

        // Profile details
        String profileName = "Venkatesh K.";
        String profileEmail = "procurement@buildcon.com";
        String avatarInitials = "VK";
        List<ProcurementManager> pmUsers = procurementManagerRepository.findByOrganizationId(orgId);
        if (!pmUsers.isEmpty()) {
            ProcurementManager pm = pmUsers.get(0);
            profileName = pm.getUsername();
            profileEmail = pm.getEmail();
            avatarInitials = pm.getAvatarInitials();
            if (avatarInitials == null || avatarInitials.isBlank()) {
                String initials = Arrays.stream(pm.getUsername().split(" "))
                    .filter(n -> !n.isEmpty())
                    .map(n -> String.valueOf(n.charAt(0)))
                    .collect(java.util.stream.Collectors.joining(""))
                    .toUpperCase();
                if (initials.length() > 2) {
                    initials = initials.substring(0, 2);
                }
                avatarInitials = initials.isEmpty() ? "VK" : initials;
                pm.setAvatarInitials(avatarInitials);
                procurementManagerRepository.save(pm);
            }
        }

        // Projects
        List<Project> projects = projectRepository.findByOrganizationId(orgId);
        if (projects.isEmpty()) {
            projectRepository.save(new Project("Skyline Residences", "Location A", 100000000.0, LocalDate.now(), LocalDate.now().plusYears(1), orgId));
            projectRepository.save(new Project("Greenfield Apartments", "Location B", 50000000.0, LocalDate.now(), LocalDate.now().plusYears(1), orgId));
            projects = projectRepository.findByOrganizationId(orgId);
        }

        // Inventory
        List<PmInventoryItem> inventory = pmInventoryItemRepository.findByOrganizationId(orgId);
        if (inventory.isEmpty()) {
            service.seedProcurementData(orgId);
            inventory = pmInventoryItemRepository.findByOrganizationId(orgId);
        }

        // RFQs, Vendors, Requisitions
        List<PmRfq> rfqs = pmRfqRepository.findByOrganizationId(orgId);
        List<PmVendor> vendors = pmVendorRepository.findByOrganizationId(orgId);
        List<PmRequisition> requisitions = pmRequisitionRepository.findByOrganizationId(orgId);

        // Seed Purchase Orders if empty
        List<PurchaseOrder> pos = purchaseOrderRepository.findByOrganizationId(orgId);
        if (pos.isEmpty()) {
            purchaseOrderRepository.save(new PurchaseOrder("PO-101", "OPC 53 Grade Cement", 3000.0, 520.0, 1560000.0, LocalDate.now().withDayOfMonth(1), "Approved", orgId));
            purchaseOrderRepository.save(new PurchaseOrder("PO-102", "TMT Steel Rebar (12mm)", 50.0, 60000.0, 3000000.0, LocalDate.now().withDayOfMonth(1), "Approved", orgId));
            pos = purchaseOrderRepository.findByOrganizationId(orgId);
        }

        // Shell configs
        List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "procurement");
        if (configs.isEmpty()) {
            dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "header_date", currentHeaderDate(), orgId));
            dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "sidebar_menus", "Inventory Overview|Stock Ledger|RFQ Control Center|Vendor Management|Purchase Requisitions|AI Procurement Assistant|Settings", orgId));
            dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "ai_suggestions", "Forecast steel price trends.|Compare cement supplier delivery ratings.|Show low stock warnings.", orgId));
            dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "total_po_value", "₹45.6 Lakhs", orgId));
            dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "kpi_low_stock_desc", "Materials below safety threshold", orgId));
            dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "kpi_out_of_stock_desc", "Requires immediate replacement", orgId));
            dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "kpi_po_value_desc", "Seeded metric", orgId));
            configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "procurement");
        } else {
            boolean hasLowStock = false;
            boolean hasOutOfStock = false;
            boolean hasPoValue = false;
            for (DashboardShellConfig c : configs) {
                if ("header_date".equals(c.getConfigKey())) {
                    c.setConfigValue(currentHeaderDate());
                    dashboardShellConfigRepository.save(c);
                }
                if ("kpi_low_stock_desc".equals(c.getConfigKey())) hasLowStock = true;
                if ("kpi_out_of_stock_desc".equals(c.getConfigKey())) hasOutOfStock = true;
                if ("kpi_po_value_desc".equals(c.getConfigKey())) hasPoValue = true;
            }
            if (!hasLowStock) {
                dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "kpi_low_stock_desc", "Materials below safety threshold", orgId));
            }
            if (!hasOutOfStock) {
                dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "kpi_out_of_stock_desc", "Requires immediate replacement", orgId));
            }
            if (!hasPoValue) {
                dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "kpi_po_value_desc", "Seeded metric", orgId));
            }
            if (!hasLowStock || !hasOutOfStock || !hasPoValue) {
                configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "procurement");
            }
        }

        // Compute KPIs
        long lowStockCount = inventory.stream().filter(item -> "Low Stock".equalsIgnoreCase(item.getStatus())).count();
        long outOfStockCount = inventory.stream().filter(item -> "Out of Stock".equalsIgnoreCase(item.getStatus()) || item.getStock() <= 0).count();

        String kpiActiveSuppliers = vendors.size() + " Vendors";
        
        // Calculate PO Value MTD dynamically
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate today = LocalDate.now();
        List<PurchaseOrder> currentMonthPos = purchaseOrderRepository.findByOrganizationIdAndPoDateBetween(orgId, startOfMonth, today);
        double totalPoVal = currentMonthPos.stream().mapToDouble(PurchaseOrder::getTotalAmount).sum();
        String kpiTotalPOValueMTD;
        if (totalPoVal >= 10000000.0) {
            kpiTotalPOValueMTD = String.format("₹%.2f Crores", totalPoVal / 10000000.0);
        } else if (totalPoVal >= 100000.0) {
            kpiTotalPOValueMTD = String.format("₹%.1f Lakhs", totalPoVal / 100000.0);
        } else {
            kpiTotalPOValueMTD = String.format("₹%,.0f", totalPoVal);
        }

        String kpiLowStock = lowStockCount + " Alerts";
        String kpiOutOfStock = outOfStockCount + " Critical";


        Map<String, Object> response = new HashMap<>();
        response.put("organizationName", orgName);
        response.put("profileName", profileName);
        response.put("profileEmail", profileEmail);
        response.put("avatarInitials", avatarInitials);
        response.put("projects", projects);
        response.put("inventory", inventory);
        response.put("rfqs", rfqs);
        response.put("vendors", vendors);
        response.put("requisitions", requisitions);
        response.put("kpiActiveSuppliers", kpiActiveSuppliers);
        response.put("kpiTotalPOValueMTD", kpiTotalPOValueMTD);
        response.put("kpiLowStock", kpiLowStock);
        response.put("kpiOutOfStock", kpiOutOfStock);

        for (DashboardShellConfig c : configs) {
            if ("total_po_value".equals(c.getConfigKey())) {
                response.put(c.getConfigKey(), kpiTotalPOValueMTD);
            } else {
                response.put(c.getConfigKey(), c.getConfigValue());
            }
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/inventory")
    public ResponseEntity<?> addInventoryItem(@RequestBody PmInventoryItem item, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(item.getOrganizationId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }
        if (item.getStock() == null) item.setStock(0.0);
        if (item.getMinLimit() == null) item.setMinLimit(0.0);

        if (item.getStock() <= 0) {
            item.setStatus("Out of Stock");
        } else if (item.getStock() < item.getMinLimit()) {
            item.setStatus("Low Stock");
        } else {
            item.setStatus("In Stock");
        }

        PmInventoryItem saved = pmInventoryItemRepository.save(item);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/rfq")
    public ResponseEntity<?> createRFQ(@RequestBody PmRfq rfq, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(rfq.getOrganizationId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }
        rfq.setRfqId(generateRfqId());
        rfq.setStatus("Sent");
        rfq.setBidsCount(0);
        PmRfq saved = pmRfqRepository.save(rfq);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String username = payload.get("username");
        String email = payload.get("email");
        Long orgId = payload.containsKey("organizationId") ? Long.parseLong(payload.get("organizationId")) : null;

        if (orgId == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: organizationId is required."));
        }
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(orgId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }

        List<ProcurementManager> pmUsers = procurementManagerRepository.findByOrganizationId(orgId);
        if (!pmUsers.isEmpty()) {
            ProcurementManager pm = pmUsers.get(0);
            if (username != null && !username.isBlank()) pm.setUsername(username);
            if (email != null && !email.isBlank()) pm.setEmail(email);
            String avatarInitials = payload.get("avatarInitials");
            if (avatarInitials != null && !avatarInitials.isBlank()) pm.setAvatarInitials(avatarInitials);
            procurementManagerRepository.save(pm);
        }

        String sidebarMenus = payload.get("sidebar_menus");
        if (sidebarMenus != null && !sidebarMenus.isBlank()) {
            List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "procurement");
            boolean found = false;
            for (DashboardShellConfig c : configs) {
                if ("sidebar_menus".equals(c.getConfigKey())) {
                    c.setConfigValue(sidebarMenus);
                    dashboardShellConfigRepository.save(c);
                    found = true;
                }
            }
            if (!found) {
                dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "sidebar_menus", sidebarMenus, orgId));
            }
        }

        String aiSuggestions = payload.get("ai_suggestions");
        if (aiSuggestions != null && !aiSuggestions.isBlank()) {
            List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "procurement");
            boolean found = false;
            for (DashboardShellConfig c : configs) {
                if ("ai_suggestions".equals(c.getConfigKey())) {
                    c.setConfigValue(aiSuggestions);
                    dashboardShellConfigRepository.save(c);
                    found = true;
                }
            }
            if (!found) {
                dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "ai_suggestions", aiSuggestions, orgId));
            }
        }

        String kpiLowStockDesc = payload.get("kpi_low_stock_desc");
        if (kpiLowStockDesc != null && !kpiLowStockDesc.isBlank()) {
            List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "procurement");
            boolean found = false;
            for (DashboardShellConfig c : configs) {
                if ("kpi_low_stock_desc".equals(c.getConfigKey())) {
                    c.setConfigValue(kpiLowStockDesc);
                    dashboardShellConfigRepository.save(c);
                    found = true;
                }
            }
            if (!found) {
                dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "kpi_low_stock_desc", kpiLowStockDesc, orgId));
            }
        }

        String kpiOutOfStockDesc = payload.get("kpi_out_of_stock_desc");
        if (kpiOutOfStockDesc != null && !kpiOutOfStockDesc.isBlank()) {
            List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "procurement");
            boolean found = false;
            for (DashboardShellConfig c : configs) {
                if ("kpi_out_of_stock_desc".equals(c.getConfigKey())) {
                    c.setConfigValue(kpiOutOfStockDesc);
                    dashboardShellConfigRepository.save(c);
                    found = true;
                }
            }
            if (!found) {
                dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "kpi_out_of_stock_desc", kpiOutOfStockDesc, orgId));
            }
        }

        String kpiPoValueDesc = payload.get("kpi_po_value_desc");
        if (kpiPoValueDesc != null && !kpiPoValueDesc.isBlank()) {
            List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "procurement");
            boolean found = false;
            for (DashboardShellConfig c : configs) {
                if ("kpi_po_value_desc".equals(c.getConfigKey())) {
                    c.setConfigValue(kpiPoValueDesc);
                    dashboardShellConfigRepository.save(c);
                    found = true;
                }
            }
            if (!found) {
                dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "kpi_po_value_desc", kpiPoValueDesc, orgId));
            }
        }

        return ResponseEntity.ok(new MessageResponse("Configurations updated successfully."));
    }

    @GetMapping("/po/org/{orgId}")
    public ResponseEntity<?> getPurchaseOrders(@PathVariable Long orgId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(orgId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }
        return ResponseEntity.ok(purchaseOrderRepository.findByOrganizationId(orgId));
    }

    private synchronized String generatePoNumber() {
        long count = purchaseOrderRepository.count();
        return String.format("PO-%03d", count + 103);
    }

    @PostMapping("/po")
    public ResponseEntity<?> createPurchaseOrder(@RequestBody PurchaseOrder po, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(po.getOrganizationId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }
        if (po.getPoDate() == null) {
            po.setPoDate(LocalDate.now());
        }
        if (po.getStatus() == null) {
            po.setStatus("Approved");
        }
        if (po.getPoNumber() == null) {
            po.setPoNumber(generatePoNumber());
        }
        if (po.getTotalAmount() == null && po.getQuantity() != null && po.getUnitPrice() != null) {
            po.setTotalAmount(po.getQuantity() * po.getUnitPrice());
        }
        PurchaseOrder saved = purchaseOrderRepository.save(po);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/config/{orgId}/key/{key}")
    public ResponseEntity<?> getConfigVal(@PathVariable Long orgId, @PathVariable String key, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(orgId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }
        List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "procurement");
        for (DashboardShellConfig c : configs) {
            if (c.getConfigKey().equals(key)) {
                return ResponseEntity.ok(Map.of("value", c.getConfigValue()));
            }
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/ai-chat")
    public ResponseEntity<?> aiChat(@RequestBody Map<String, String> payload) {
        String msg = payload.get("message");
        String orgIdStr = payload.get("organizationId");
        String cleanMsg = msg != null ? msg.toLowerCase() : "";

        String profileName = "Procurement Manager";
        List<PmInventoryItem> inventoryItems = new ArrayList<>();
        if (orgIdStr != null) {
            try {
                Long orgId = Long.parseLong(orgIdStr);
                List<ProcurementManager> pmUsers = procurementManagerRepository.findByOrganizationId(orgId);
                if (!pmUsers.isEmpty()) {
                    profileName = pmUsers.get(0).getUsername();
                }
                inventoryItems = pmInventoryItemRepository.findByOrganizationId(orgId);
            } catch (NumberFormatException ignored) {}
        }

        // Try calling Python AI service dynamically
        if (orgIdStr != null && msg != null) {
            try {
                java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
                
                Map<String, Object> reqBody = new HashMap<>();
                reqBody.put("message", msg);
                reqBody.put("profileName", profileName);
                reqBody.put("organizationId", orgIdStr);
                
                List<Map<String, Object>> invList = new ArrayList<>();
                for (PmInventoryItem item : inventoryItems) {
                    Map<String, Object> itemMap = new HashMap<>();
                    itemMap.put("name", item.getName());
                    itemMap.put("stock", item.getStock());
                    itemMap.put("minLimit", item.getMinLimit());
                    itemMap.put("status", item.getStatus());
                    itemMap.put("unit", item.getUnit());
                    invList.add(itemMap);
                }
                reqBody.put("inventory", invList);
                
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                String jsonReq = mapper.writeValueAsString(reqBody);
                
                java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://erp-construction-1-python.onrender.com/api/ai/procurement-chat"))
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
                System.out.println("Error calling Python AI chat service, falling back: " + e.getMessage());
            }
        }

        // Fallback to local rule-based matching
        String response = "Hello " + profileName + "! I'm your AI Procurement Assistant. I forecast steel & cement price trends and optimize procurement order cycles to prevent stockouts.";

        if (cleanMsg.contains("steel") || cleanMsg.contains("price")) {
            response = "AI Alert: Steel prices are projected to rise by 4.2% next month due to scrap iron export duties. Recommend issuing active RFQs immediately to lock in rates.";
        } else if (cleanMsg.contains("cement")) {
            response = "Cement demands are holding steady. Suggest placing orders with UltraTech Cement (Rating 4.8) for optimal transit delivery times.";
        } else if (cleanMsg.contains("warning") || cleanMsg.contains("stock")) {
            response = "Inventory flags active: Solid Concrete Blocks are completely OUT OF STOCK. TMT Steel Rebar is below minimum safety threshold.";
        }

        return ResponseEntity.ok(Map.of("response", response));
    }
}
