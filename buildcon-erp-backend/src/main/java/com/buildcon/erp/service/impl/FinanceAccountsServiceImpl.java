package com.buildcon.erp.service.impl;

import com.buildcon.erp.exception.CustomValidationException;
import com.buildcon.erp.exception.ValidationUtils;
import com.buildcon.erp.model.*;
import com.buildcon.erp.repository.*;
import com.buildcon.erp.service.FinanceAccountsService;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class FinanceAccountsServiceImpl implements FinanceAccountsService {

    @Autowired
    private FinanceAccountsRepository repository;

    @Autowired
    private FaTransactionRepository faTransactionRepository;

    @Autowired
    private FaCashflowForecastRepository faCashflowForecastRepository;

    @Autowired
    private DashboardShellConfigRepository dashboardShellConfigRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public FinanceAccounts register(GenericSignupRequest request) {
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

        FinanceAccounts item = new FinanceAccounts(
            request.getUsername(),
            request.getEmail(),
            encoder.encode(request.getPassword())
        );
        item.setOrganizationId(request.getOrganizationId());
        return repository.save(item);
    }

    private String currentHeaderDate() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy, EEEE"));
    }

    private String generateTxId(long offset) {
        long count = faTransactionRepository.count() + offset;
        return String.format("TX-%04d", count + 1);
    }

    @Override
    @Transactional
    public void seedFinanceData(Long orgId) {
        faTransactionRepository.save(new FaTransaction(generateTxId(0), "Skyline Client (Invoice #04)", "Receivable", 18000000.0, LocalDate.now().plusDays(6).format(DateTimeFormatter.ofPattern("dd MMM yyyy")), "Pending", orgId));
        faTransactionRepository.save(new FaTransaction(generateTxId(1), "Concrete Specialist Subcontractor", "Payable", 1200000.0, LocalDate.now().plusDays(1).format(DateTimeFormatter.ofPattern("dd MMM yyyy")), "Pending", orgId));
        faTransactionRepository.save(new FaTransaction(generateTxId(2), "UltraTech Cement Ltd", "Payable", 850000.0, LocalDate.now().minusDays(14).format(DateTimeFormatter.ofPattern("dd MMM yyyy")), "Paid", orgId));
        faTransactionRepository.save(new FaTransaction(generateTxId(3), "Aaditya Infra (Steel Vendor)", "Payable", 2400000.0, LocalDate.now().minusDays(18).format(DateTimeFormatter.ofPattern("dd MMM yyyy")), "Overdue", orgId));
        faTransactionRepository.save(new FaTransaction(generateTxId(4), "Greenfield Client (Invoice #02)", "Receivable", 25000000.0, LocalDate.now().minusDays(22).format(DateTimeFormatter.ofPattern("dd MMM yyyy")), "Paid", orgId));

        faCashflowForecastRepository.save(new FaCashflowForecast("Jan", 25000000.0, 18000000.0, orgId));
        faCashflowForecastRepository.save(new FaCashflowForecast("Feb", 32000000.0, 21000000.0, orgId));
        faCashflowForecastRepository.save(new FaCashflowForecast("Mar", 28000000.0, 24000000.0, orgId));
        faCashflowForecastRepository.save(new FaCashflowForecast("Apr", 40000000.0, 29000000.0, orgId));
        faCashflowForecastRepository.save(new FaCashflowForecast("May", 35000000.0, 31000000.0, orgId));

        dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "header_date", currentHeaderDate(), orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "sidebar_menus", "Finance Ledger|Accounts Receivables|Accounts Payables|Cash Flow Forecast|Payout Approvals|Tax & Compliance|AI Expense Audits|Settings", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "compliance_tax", "GST Filings MTD: Total Input Tax Credit (ITC) registered: ₹8.4 Lakhs. Return status is locked. Status: Filed Successfully|Subcontractor TDS Deductions: TDS deductions calculated at 1% / 2% on verified vendor payment certificates. Status: Filing due in 6 Days", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "ai_suggestions", "Predict working capital cash flows.|Audit recent vendor invoice variances.|Check subcontractor TDS filing compliance.", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "kpi_receivables_desc", "Outstanding client billings", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "kpi_payables_desc", "Subcontractors & vendors dues", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "kpi_net_cash_desc", "Forecasted total surplus", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("finance", "kpi_approvals_desc", "Total claims needing payout", orgId));
    }
}
