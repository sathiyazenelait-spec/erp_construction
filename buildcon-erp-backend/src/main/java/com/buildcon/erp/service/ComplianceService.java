package com.buildcon.erp.service;

import com.buildcon.erp.model.ComplianceRecord;
import com.buildcon.erp.repository.ComplianceRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class ComplianceService {

    @Autowired
    private ComplianceRecordRepository complianceRecordRepository;

    public List<ComplianceRecord> getComplianceRecords(Long orgId) {
        seedComplianceData(orgId);
        List<ComplianceRecord> list = complianceRecordRepository.findByOrganizationIdOrderByExpiryDateAsc(orgId);
        LocalDate today = LocalDate.now();
        // Update statuses dynamically based on current date
        for (ComplianceRecord r : list) {
            long daysLeft = ChronoUnit.DAYS.between(today, r.getExpiryDate());
            if (daysLeft < 0) {
                r.setStatus("EXPIRED");
            } else if (daysLeft <= (r.getRenewalReminderDays() != null ? r.getRenewalReminderDays() : 30)) {
                r.setStatus("EXPIRING_SOON");
            } else if (!"RENEWAL_SUBMITTED".equalsIgnoreCase(r.getStatus())) {
                r.setStatus("ACTIVE");
            }
        }
        return complianceRecordRepository.saveAll(list);
    }

    public ComplianceRecord saveComplianceRecord(ComplianceRecord record) {
        if (record.getStatus() == null) {
            record.setStatus("ACTIVE");
        }
        if (record.getIssueDate() == null) {
            record.setIssueDate(LocalDate.now());
        }
        return complianceRecordRepository.save(record);
    }

    public Optional<ComplianceRecord> updateStatus(Long id, String status) {
        return complianceRecordRepository.findById(id).map(r -> {
            r.setStatus(status);
            return complianceRecordRepository.save(r);
        });
    }

    public void seedComplianceData(Long orgId) {
        if (complianceRecordRepository.findByOrganizationIdOrderByExpiryDateAsc(orgId).isEmpty()) {
            LocalDate today = LocalDate.now();
            complianceRecordRepository.save(new ComplianceRecord(
                "Consent to Establish (CTE) & Operate (CTO)",
                "TNPCB/CTO/IND-2024-8891",
                "ENVIRONMENTAL",
                "State Pollution Control Board",
                today.minusMonths(11),
                today.plusDays(18), // Expiring soon
                30,
                "EXPIRING_SOON",
                "Stop work order & fine of $5,000/day under Water & Air Acts",
                "DOC-LEGAL-ENV-01.pdf",
                "P. Sundaram (Legal Officer)",
                orgId
            ));

            complianceRecordRepository.save(new ComplianceRecord(
                "Principal Employer Registration & Labour Licence",
                "CLA/PE/CHN-2023-412",
                "LABOUR_SAFETY",
                "Department of Labour Welfare",
                today.minusMonths(10),
                today.plusDays(45),
                60,
                "ACTIVE",
                "Non-compliance halts inter-state migrant labor deployment",
                "DOC-LEGAL-LABOUR-04.pdf",
                "V. Krishnan (HR Compliance)",
                orgId
            ));

            complianceRecordRepository.save(new ComplianceRecord(
                "Provisional Fire NOC & Fire Fighting Scheme",
                "DFRS/NOC/PROV-901",
                "FIRE_NOC",
                "Directorate of Fire & Rescue Services",
                today.minusYears(1),
                today.plusMonths(5),
                45,
                "ACTIVE",
                "High-rise tower height clearance suspension",
                "DOC-LEGAL-FIRE-10.pdf",
                "R. Senthil Nathan (QA/QC Head)",
                orgId
            ));

            complianceRecordRepository.save(new ComplianceRecord(
                "RERA Project Registration Certificate",
                "RERA/PRJ/TN/2023/108",
                "RERA",
                "Real Estate Regulatory Authority",
                today.minusYears(1).minusMonths(6),
                today.plusMonths(9),
                90,
                "ACTIVE",
                "Prohibition of marketing, booking, and allotment",
                "DOC-LEGAL-RERA-01.pdf",
                "Legal Directorate",
                orgId
            ));

            complianceRecordRepository.save(new ComplianceRecord(
                "Municipal High-Rise Building Planning Permit",
                "CMDA/PP/MSB/2023/044",
                "MUNICIPAL_PERMIT",
                "Metropolitan Development Authority",
                today.minusYears(2),
                today.minusDays(15), // Expired
                60,
                "EXPIRED",
                "Occupancy certificate (OC) denial risk",
                "DOC-LEGAL-CMDA-08.pdf",
                "Chief Liaison Officer",
                orgId
            ));
        }
    }
}
