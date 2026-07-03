package com.buildcon.erp.service.impl;

import com.buildcon.erp.exception.CustomValidationException;
import com.buildcon.erp.exception.ValidationUtils;
import com.buildcon.erp.model.*;
import com.buildcon.erp.repository.*;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.service.ProcurementManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class ProcurementManagerServiceImpl implements ProcurementManagerService {

    @Autowired
    private ProcurementManagerRepository repository;

    @Autowired
    private PmInventoryItemRepository pmInventoryItemRepository;

    @Autowired
    private PmRfqRepository pmRfqRepository;

    @Autowired
    private PmVendorRepository pmVendorRepository;

    @Autowired
    private PmRequisitionRepository pmRequisitionRepository;

    @Autowired
    private DashboardShellConfigRepository dashboardShellConfigRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public ProcurementManager register(GenericSignupRequest request) {
        ValidationUtils.validateNotNull(request.getUsername(), "username");
        ValidationUtils.validateSpecialCharacters(request.getUsername(), "username");
        ValidationUtils.validateEmail(request.getEmail());
        ValidationUtils.validateNotNull(request.getPassword(), "password");

        if (repository.existsByUsername(request.getUsername())) {
            throw new CustomValidationException("Error: Username is already taken!");
        }
        if (repository.existsByEmail(request.getEmail())) {
            throw new CustomValidationException("Error: Email is already in use!");
        }

        ProcurementManager item = new ProcurementManager(
            request.getUsername(),
            request.getEmail(),
            encoder.encode(request.getPassword())
        );
        item.setOrganizationId(request.getOrganizationId());

        String initials = java.util.Arrays.stream(request.getUsername().split(" "))
            .filter(n -> !n.isEmpty())
            .map(n -> String.valueOf(n.charAt(0)))
            .collect(java.util.stream.Collectors.joining(""))
            .toUpperCase();
        if (initials.length() > 2) {
            initials = initials.substring(0, 2);
        }
        item.setAvatarInitials(initials.isEmpty() ? "VK" : initials);

        return repository.save(item);
    }

    private String currentHeaderDate() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy, EEEE"));
    }

    @Override
    @Transactional
    public void seedProcurementData(Long orgId) {
        // Seed Inventory
        pmInventoryItemRepository.save(new PmInventoryItem("OPC 53 Grade Cement", "Binders", 1200.0, 500.0, "Bags", "In Stock", orgId));
        pmInventoryItemRepository.save(new PmInventoryItem("TMT Steel Rebar (12mm)", "Structural", 4.2, 10.0, "Tons", "Low Stock", orgId));
        pmInventoryItemRepository.save(new PmInventoryItem("Coarse Aggregate (20mm)", "Aggregates", 80.0, 100.0, "m³", "Low Stock", orgId));
        pmInventoryItemRepository.save(new PmInventoryItem("River Sand / M-Sand", "Aggregates", 250.0, 80.0, "m³", "In Stock", orgId));
        pmInventoryItemRepository.save(new PmInventoryItem("Solid Concrete Blocks", "Masonry", 0.0, 1000.0, "Pcs", "Out of Stock", orgId));

        // Seed RFQs
        pmRfqRepository.save(new PmRfq("RFQ-102", "TMT Rebar 16mm Steel", "15 Tons", "Bids Received", 3, orgId));
        pmRfqRepository.save(new PmRfq("RFQ-103", "Ready Mix Concrete (M30)", "450 m³", "Sent", 1, orgId));
        pmRfqRepository.save(new PmRfq("RFQ-104", "Standard Vitrified Tiles", "2,200 sq.ft", "Draft", 0, orgId));

        // Seed Vendors
        pmVendorRepository.save(new PmVendor("UltraTech Cement", 4.8, "High", "Exemplary", orgId));
        pmVendorRepository.save(new PmVendor("JSW Steel", 4.6, "Moderate", "Reliable", orgId));
        pmVendorRepository.save(new PmVendor("Coromandel Aggregates", 4.2, "Low", "Moderate Delay", orgId));

        // Seed Requisitions
        pmRequisitionRepository.save(new PmRequisition("IND-905", "OPC 53 Cement (500 Bags)", "Vijay (Site supervisor)", "Approved", orgId));
        pmRequisitionRepository.save(new PmRequisition("IND-906", "Structural steel (12 Tons)", "Karthick (Senior Eng)", "Under Review", orgId));

        // Seed Configurations
        dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "header_date", currentHeaderDate(), orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "sidebar_menus", "Inventory Overview|Stock Ledger|RFQ Control Center|Vendor Management|Purchase Requisitions|AI Procurement Assistant|Settings", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "ai_suggestions", "Forecast steel price trends.|Compare cement supplier delivery ratings.|Show low stock warnings.", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "total_po_value", "₹45.6 Lakhs", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "kpi_low_stock_desc", "Materials below safety threshold", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "kpi_out_of_stock_desc", "Requires immediate replacement", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("procurement", "kpi_po_value_desc", "Seeded metric", orgId));

        // Seed Purchase Orders
        if (purchaseOrderRepository.findByOrganizationId(orgId).isEmpty()) {
            purchaseOrderRepository.save(new PurchaseOrder("PO-101", "OPC 53 Grade Cement", 3000.0, 520.0, 1560000.0, LocalDate.now().withDayOfMonth(1), "Approved", orgId));
            purchaseOrderRepository.save(new PurchaseOrder("PO-102", "TMT Steel Rebar (12mm)", 50.0, 60000.0, 3000000.0, LocalDate.now().withDayOfMonth(1), "Approved", orgId));
        }
    }
}
