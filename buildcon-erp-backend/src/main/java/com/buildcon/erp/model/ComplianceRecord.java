package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "compliance_records")
@Getter
@Setter
@NoArgsConstructor
public class ComplianceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "license_name", nullable = false, length = 150)
    private String licenseName;

    @Column(name = "license_number", length = 100)
    private String licenseNumber;

    @Column(nullable = false, length = 80)
    private String category; // ENVIRONMENTAL, LABOUR_SAFETY, MUNICIPAL_PERMIT, FIRE_NOC, POLLUTION_CONTROL, RERA

    @Column(name = "issuing_authority", length = 150)
    private String issuingAuthority;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "renewal_reminder_days")
    private Integer renewalReminderDays; // e.g. 30, 60 days before expiry

    @Column(length = 40)
    private String status; // ACTIVE, EXPIRING_SOON, EXPIRED, RENEWAL_SUBMITTED

    @Column(name = "penalty_risk_clause", length = 500)
    private String penaltyRiskClause;

    @Column(name = "document_ref", length = 200)
    private String documentRef;

    @Column(name = "assigned_officer", length = 100)
    private String assignedOfficer;

    @Column(name = "organization_id")
    private Long organizationId;

    public ComplianceRecord(String licenseName, String licenseNumber, String category, String issuingAuthority, LocalDate issueDate, LocalDate expiryDate, Integer renewalReminderDays, String status, String penaltyRiskClause, String documentRef, String assignedOfficer, Long organizationId) {
        this.licenseName = licenseName;
        this.licenseNumber = licenseNumber;
        this.category = category;
        this.issuingAuthority = issuingAuthority;
        this.issueDate = issueDate;
        this.expiryDate = expiryDate;
        this.renewalReminderDays = renewalReminderDays != null ? renewalReminderDays : 30;
        this.status = status != null ? status : "ACTIVE";
        this.penaltyRiskClause = penaltyRiskClause;
        this.documentRef = documentRef;
        this.assignedOfficer = assignedOfficer;
        this.organizationId = organizationId;
    }
}
