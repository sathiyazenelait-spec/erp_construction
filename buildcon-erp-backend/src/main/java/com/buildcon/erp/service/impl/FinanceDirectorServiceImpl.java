package com.buildcon.erp.service.impl;

import com.buildcon.erp.exception.CustomValidationException;
import com.buildcon.erp.exception.ValidationUtils;
import com.buildcon.erp.model.FinanceDirector;
import com.buildcon.erp.model.DashboardShellConfig;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.repository.FinanceDirectorRepository;
import com.buildcon.erp.repository.DashboardShellConfigRepository;
import com.buildcon.erp.service.FinanceDirectorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FinanceDirectorServiceImpl implements FinanceDirectorService {

    @Autowired
    private FinanceDirectorRepository repository;

    @Autowired
    private DashboardShellConfigRepository dashboardShellConfigRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public FinanceDirector register(GenericSignupRequest request) {
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

        FinanceDirector item = new FinanceDirector(
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
        item.setAvatarInitials(initials.isEmpty() ? "FD" : initials);

        return repository.save(item);
    }

    private String currentHeaderDate() {
        return java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy, EEEE"));
    }

    @Override
    @Transactional
    public void seedFDData(Long orgId) {
        dashboardShellConfigRepository.save(new DashboardShellConfig("finance-director", "header_date", currentHeaderDate(), orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("finance-director", "sidebar_menus", "Financial Overview|Cash Flow Center|Revenue Management|Receivables|Payables|Expenses Ledger|Project Cost Control|Budget Monitoring|Tax & Compliance|Audit & Statutory|Fixed Assets Inventory|Investment Tracker|Financial Reports|Approval Center|AI Finance Assistant|Profile Settings", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("finance-director", "ai_suggestions", "Why profit margin decreased?|Least profitable project|Year-end profit forecast", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("finance-director", "revenue_mtd", "₹24.5 Cr", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("finance-director", "gross_profit", "₹7.6 Cr", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("finance-director", "net_profit", "₹5.8 Cr", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("finance-director", "cash_position", "₹12.1 Cr", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("finance-director", "cash_30_days", "₹14.3 Cr", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("finance-director", "cash_60_days", "₹16.8 Cr", orgId));
    }
}
