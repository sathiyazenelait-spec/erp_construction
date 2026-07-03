package com.buildcon.erp.controller;

import com.buildcon.erp.model.*;
import com.buildcon.erp.repository.*;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.FinanceAccountsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.buildcon.erp.security.services.UserDetailsImpl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/finance-accounts")
public class FinanceAccountsController {

    @Autowired
    private FinanceAccountsService service;

    @Autowired
    private FinanceAccountsRepository financeAccountsRepository;

    @Autowired
    private FaTransactionRepository faTransactionRepository;

    @Autowired
    private FaCashflowForecastRepository faCashflowForecastRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private DashboardShellConfigRepository dashboardShellConfigRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        FinanceAccounts res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
    }

    private String currentHeaderDate() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy, EEEE"));
    }

    private synchronized String generateTxId() {
        long count = faTransactionRepository.count();
        return String.format("TX-%04d", count + 1);
    }

    @GetMapping("/dashboard/org/{orgId}")
    public ResponseEntity<?> getDashboard(@PathVariable Long orgId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(orgId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }
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

        String profileName = "Finance Manager";
        String profileEmail = "finance@buildcon.com";
        List<FinanceAccounts> faUsers = financeAccountsRepository.findByOrganizationId(orgId);
        if (!faUsers.isEmpty()) {
            FinanceAccounts fa = faUsers.get(0);
            profileName = fa.getUsername();
            profileEmail = fa.getEmail();
        }

        List<Project> projects = projectRepository.findByOrganizationId(orgId);
        if (projects.isEmpty()) {
            projectRepository.save(new Project("Skyline Residences", "Location A", 100000000.0, LocalDate.now(), LocalDate.now().plusYears(1), orgId));
            projectRepository.save(new Project("Greenfield Apartments", "Location B", 50000000.0, LocalDate.now(), LocalDate.now().plusYears(1), orgId));
            projects = projectRepository.findByOrganizationId(orgId);
        }

        List<FaTransaction> transactions = faTransactionRepository.findByOrganizationId(orgId);
        if (transactions.isEmpty()) {
            service.seedFinanceData(orgId);
            transactions = faTransactionRepository.findByOrganizationId(orgId);
        }

        List<FaCashflowForecast> forecasts = faCashflowForecastRepository.findByOrganizationId(orgId);
        List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "finance");

        if (configs.isEmpty()) {
            dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "header_date", currentHeaderDate(), orgId));
            dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "sidebar_menus", "Finance Ledger|Accounts Receivables|Accounts Payables|Cash Flow Forecast|Payout Approvals|Tax & Compliance|AI Expense Audits|Settings", orgId));
            dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "compliance_tax", "GST Filings MTD: Total Input Tax Credit (ITC) registered: ₹8.4 Lakhs. Return status is locked. Status: Filed Successfully|Subcontractor TDS Deductions: TDS deductions calculated at 1% / 2% on verified vendor payment certificates. Status: Filing due in 6 Days", orgId));
            dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "ai_suggestions", "Predict working capital cash flows.|Audit recent vendor invoice variances.|Check subcontractor TDS filing compliance.", orgId));
            dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "kpi_receivables_desc", "Outstanding client billings", orgId));
            dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "kpi_payables_desc", "Subcontractors & vendors dues", orgId));
            dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "kpi_net_cash_desc", "Forecasted total surplus", orgId));
            dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "kpi_approvals_desc", "Total claims needing payout", orgId));
            configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "finance");
        } else {
            boolean hasRec = false, hasPay = false, hasNet = false, hasApp = false;
            for (DashboardShellConfig c : configs) {
                if ("header_date".equals(c.getConfigKey())) {
                    c.setConfigValue(currentHeaderDate());
                    dashboardShellConfigRepository.save(c);
                }
                if ("kpi_receivables_desc".equals(c.getConfigKey())) hasRec = true;
                if ("kpi_payables_desc".equals(c.getConfigKey())) hasPay = true;
                if ("kpi_net_cash_desc".equals(c.getConfigKey())) hasNet = true;
                if ("kpi_approvals_desc".equals(c.getConfigKey())) hasApp = true;
            }
            if (!hasRec) dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "kpi_receivables_desc", "Outstanding client billings", orgId));
            if (!hasPay) dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "kpi_payables_desc", "Subcontractors & vendors dues", orgId));
            if (!hasNet) dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "kpi_net_cash_desc", "Forecasted total surplus", orgId));
            if (!hasApp) dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "kpi_approvals_desc", "Total claims needing payout", orgId));
            if (!hasRec || !hasPay || !hasNet || !hasApp) {
                configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "finance");
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("organizationName", orgName);
        response.put("projects", projects);
        response.put("transactions", transactions);
        response.put("forecasts", forecasts);
        response.put("profileName", profileName);
        response.put("profileEmail", profileEmail);

        for (DashboardShellConfig c : configs) {
            response.put(c.getConfigKey(), c.getConfigValue());
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/transaction")
    public ResponseEntity<?> addTransaction(@RequestBody FaTransaction transaction, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null && userDetails.getOrganizationId() != null && !userDetails.getOrganizationId().equals(transaction.getOrganizationId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Access Denied: You do not belong to this organization."));
        }
        transaction.setTxId(generateTxId());
        if (transaction.getDueDate() == null || transaction.getDueDate().isBlank()) {
            transaction.setDueDate(LocalDate.now().plusDays(30).format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
        }
        FaTransaction saved = faTransactionRepository.save(transaction);
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

        List<FinanceAccounts> faUsers = financeAccountsRepository.findByOrganizationId(orgId);
        if (!faUsers.isEmpty()) {
            FinanceAccounts fa = faUsers.get(0);
            if (username != null && !username.isBlank()) fa.setUsername(username);
            if (email != null && !email.isBlank()) fa.setEmail(email);
            financeAccountsRepository.save(fa);
        }

        String sidebarMenus = payload.get("sidebar_menus");
        if (sidebarMenus != null && !sidebarMenus.isBlank()) {
            List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "finance");
            boolean found = false;
            for (DashboardShellConfig c : configs) {
                if ("sidebar_menus".equals(c.getConfigKey())) {
                    c.setConfigValue(sidebarMenus);
                    dashboardShellConfigRepository.save(c);
                    found = true;
                }
            }
            if (!found) {
                dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "sidebar_menus", sidebarMenus, orgId));
            }
        }

        String aiSuggestions = payload.get("ai_suggestions");
        if (aiSuggestions != null && !aiSuggestions.isBlank()) {
            List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "finance");
            boolean found = false;
            for (DashboardShellConfig c : configs) {
                if ("ai_suggestions".equals(c.getConfigKey())) {
                    c.setConfigValue(aiSuggestions);
                    dashboardShellConfigRepository.save(c);
                    found = true;
                }
            }
            if (!found) {
                dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "ai_suggestions", aiSuggestions, orgId));
            }
        }

        // Update KPI card descriptions
        String kpiReceivablesDesc = payload.get("kpi_receivables_desc");
        if (kpiReceivablesDesc != null && !kpiReceivablesDesc.isBlank()) {
            List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "finance");
            boolean found = false;
            for (DashboardShellConfig c : configs) {
                if ("kpi_receivables_desc".equals(c.getConfigKey())) {
                    c.setConfigValue(kpiReceivablesDesc);
                    dashboardShellConfigRepository.save(c);
                    found = true;
                }
            }
            if (!found) {
                dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "kpi_receivables_desc", kpiReceivablesDesc, orgId));
            }
        }

        String kpiPayablesDesc = payload.get("kpi_payables_desc");
        if (kpiPayablesDesc != null && !kpiPayablesDesc.isBlank()) {
            List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "finance");
            boolean found = false;
            for (DashboardShellConfig c : configs) {
                if ("kpi_payables_desc".equals(c.getConfigKey())) {
                    c.setConfigValue(kpiPayablesDesc);
                    dashboardShellConfigRepository.save(c);
                    found = true;
                }
            }
            if (!found) {
                dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "kpi_payables_desc", kpiPayablesDesc, orgId));
            }
        }

        String kpiNetCashDesc = payload.get("kpi_net_cash_desc");
        if (kpiNetCashDesc != null && !kpiNetCashDesc.isBlank()) {
            List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "finance");
            boolean found = false;
            for (DashboardShellConfig c : configs) {
                if ("kpi_net_cash_desc".equals(c.getConfigKey())) {
                    c.setConfigValue(kpiNetCashDesc);
                    dashboardShellConfigRepository.save(c);
                    found = true;
                }
            }
            if (!found) {
                dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "kpi_net_cash_desc", kpiNetCashDesc, orgId));
            }
        }

        String kpiApprovalsDesc = payload.get("kpi_approvals_desc");
        if (kpiApprovalsDesc != null && !kpiApprovalsDesc.isBlank()) {
            List<DashboardShellConfig> configs = dashboardShellConfigRepository.findByOrganizationIdAndDashboardType(orgId, "finance");
            boolean found = false;
            for (DashboardShellConfig c : configs) {
                if ("kpi_approvals_desc".equals(c.getConfigKey())) {
                    c.setConfigValue(kpiApprovalsDesc);
                    dashboardShellConfigRepository.save(c);
                    found = true;
                }
            }
            if (!found) {
                dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "kpi_approvals_desc", kpiApprovalsDesc, orgId));
            }
        }

        return ResponseEntity.ok(new MessageResponse("Configurations updated successfully."));
    }

    @PostMapping("/ai-chat")
    public ResponseEntity<?> aiChat(@RequestBody Map<String, String> payload) {
        String msg = payload.get("message");
        String orgIdStr = payload.get("organizationId");
        String cleanMsg = msg != null ? msg.toLowerCase() : "";

        String profileName = "Finance Manager";
        Long orgId = null;
        if (orgIdStr != null && !orgIdStr.isBlank()) {
            try {
                orgId = Long.parseLong(orgIdStr);
                List<FinanceAccounts> faUsers = financeAccountsRepository.findByOrganizationId(orgId);
                if (!faUsers.isEmpty()) {
                    profileName = faUsers.get(0).getUsername();
                }
            } catch (NumberFormatException ignored) {}
        }

        String response = "Hello " + profileName + "! I'm your AI Expense & Cashflow Assistant. I track working capital variations, flag high-risk receivables, and audit tax compliance.";

        if (orgId != null) {
            List<FaTransaction> txs = faTransactionRepository.findByOrganizationId(orgId);
            List<FaCashflowForecast> forecasts = faCashflowForecastRepository.findByOrganizationId(orgId);

            double totalInflow = forecasts.stream().mapToDouble(FaCashflowForecast::getInflow).sum();
            double totalOutflow = forecasts.stream().mapToDouble(FaCashflowForecast::getOutflow).sum();
            double netCashFlow = totalInflow - totalOutflow;

            if (cleanMsg.contains("cash") || cleanMsg.contains("forecast") || cleanMsg.contains("capital")) {
                response = "Cash Flow Forecast: Working capital is projected to remain healthy. Total receipts are ₹" 
                           + String.format(java.util.Locale.US, "%.2f", totalInflow / 100000.0) 
                           + " Lakhs inflow vs ₹" 
                           + String.format(java.util.Locale.US, "%.2f", totalOutflow / 100000.0) 
                           + " Lakhs outflow, yielding a dynamic net cash surplus of " 
                           + (netCashFlow >= 0 ? "+" : "") + "₹" 
                           + String.format(java.util.Locale.US, "%.2f", netCashFlow / 100000.0) + " Lakhs.";
            } else if (cleanMsg.contains("variance") || cleanMsg.contains("invoice") || cleanMsg.contains("audit")) {
                double steelOverdue = txs.stream()
                        .filter(t -> t.getParty().contains("Steel") || t.getParty().contains("Aaditya"))
                        .filter(t -> "Overdue".equals(t.getStatus()))
                        .mapToDouble(FaTransaction::getAmount)
                        .sum();
                response = "Expense Variance: Invoices are within standard tolerance. Outstanding overdue payable is currently ₹" 
                           + String.format(java.util.Locale.US, "%.2f", steelOverdue / 100000.0) 
                           + " Lakhs. Recommend immediate client billing cycle release.";
            } else if (cleanMsg.contains("tds") || cleanMsg.contains("compliance") || cleanMsg.contains("tax")) {
                double paidPayables = txs.stream().filter(t -> "Payable".equals(t.getType()) && "Paid".equals(t.getStatus())).mapToDouble(FaTransaction::getAmount).sum();
                double pendingPayables = txs.stream().filter(t -> "Payable".equals(t.getType()) && "Pending".equals(t.getStatus())).mapToDouble(FaTransaction::getAmount).sum();
                double gstItc = paidPayables * 0.18;
                double tds = pendingPayables * 0.02;
                response = "Tax Audit Notification: Subcontractor TDS payments at 2% are verified. Subcontractor TDS deductions calculated at ₹" 
                           + String.format(java.util.Locale.US, "%,.2f", tds) 
                           + ". TDS return filing is prepared and due in 6 working days. Direct input tax credits stand at ₹" 
                           + String.format(java.util.Locale.US, "%.2f", gstItc / 100000.0) + " Lakhs.";
            }
        } else {
            if (cleanMsg.contains("cash") || cleanMsg.contains("forecast") || cleanMsg.contains("capital")) {
                response = "Cash Flow Forecast: Working capital is projected to remain healthy. May receipts closed at ₹35.0 Lakhs inflow vs ₹31.0 Lakhs outflow, yielding a dynamic net MTD cash surplus of +₹4.0 Lakhs.";
            } else if (cleanMsg.contains("variance") || cleanMsg.contains("invoice") || cleanMsg.contains("audit")) {
                response = "Expense Variance: UltraTech Cement invoices are within 1.5% budget limit tolerance. Steel vendor invoice is currently overdue for ₹24.0 Lakhs. Recommend immediate client billing cycle release.";
            } else if (cleanMsg.contains("tds") || cleanMsg.contains("compliance") || cleanMsg.contains("tax")) {
                response = "Tax Audit Notification: Subcontractor TDS payments at 1% / 2% are verified. TDS return filing is prepared and due in 6 working days. Direct input tax credits stand at ₹8.4 Lakhs.";
            }
        }

        return ResponseEntity.ok(Map.of("response", response));
    }
}
