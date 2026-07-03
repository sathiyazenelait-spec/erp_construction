package com.buildcon.erp.service.impl;

import com.buildcon.erp.exception.CustomValidationException;
import com.buildcon.erp.exception.ValidationUtils;
import com.buildcon.erp.model.*;
import com.buildcon.erp.repository.*;
import com.buildcon.erp.service.WorkforceManagerService;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class WorkforceManagerServiceImpl implements WorkforceManagerService {

    @Autowired
    private WorkforceManagerRepository repository;

    @Autowired
    private WmHeadcountAuditRepository wmHeadcountAuditRepository;

    @Autowired
    private WmAttendanceTrendRepository wmAttendanceTrendRepository;

    @Autowired
    private DashboardShellConfigRepository dashboardShellConfigRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public WorkforceManager register(GenericSignupRequest request) {
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

        WorkforceManager item = new WorkforceManager(
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

    @Override
    @Transactional
    public void seedWorkforceData(Long orgId) {
        wmHeadcountAuditRepository.save(new WmHeadcountAudit("Subcontractor Hub", 80, 78, -2, "Verified", orgId));
        wmHeadcountAuditRepository.save(new WmHeadcountAudit("Indo Builders", 55, 54, -1, "Verified", orgId));

        wmAttendanceTrendRepository.save(new WmAttendanceTrend("Mon", 22, 85, 14, orgId));
        wmAttendanceTrendRepository.save(new WmAttendanceTrend("Tue", 24, 90, 15, orgId));
        wmAttendanceTrendRepository.save(new WmAttendanceTrend("Wed", 18, 72, 12, orgId));
        wmAttendanceTrendRepository.save(new WmAttendanceTrend("Thu", 25, 94, 16, orgId));
        wmAttendanceTrendRepository.save(new WmAttendanceTrend("Fri", 25, 92, 15, orgId));

        dashboardShellConfigRepository.save(new DashboardShellConfig("workforce", "header_date", currentHeaderDate(), orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("workforce", "sidebar_menus", "Workforce Overview|Worker Database|Headcount Audits|Payroll Integration|AI Workforce Planner|Settings", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("workforce", "guidelines",
            "The workforce manager is NOT directly responsible for salary processing, bank deposits, or cash handling." +
            "|Subcontractors are paid monthly based on their progress claims billing (certified by the Project Manager / Quantity Surveyor and processed by Finance & Accounts)." +
            "|Subcontractors pay their laborers directly in cash or bank transfer. The workforce database logs mobile numbers and attendance to cross-verify that subcontractors match headcount audits and safety limits.", orgId));
        dashboardShellConfigRepository.save(new DashboardShellConfig("workforce", "ai_suggestions", "Audit worker Aadhaar verification statuses.|Optimize critical path labor allocation.|Explain payroll integration rules.", orgId));
    }
}
