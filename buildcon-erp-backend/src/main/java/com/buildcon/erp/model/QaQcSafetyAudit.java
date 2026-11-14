package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "qa_qc_safety_audits")
@Getter
@Setter
@NoArgsConstructor
public class QaQcSafetyAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "audit_code", length = 50)
    private String auditCode;

    @Column(nullable = false, length = 120)
    private String area;

    @Column(name = "ppe_compliance_percent")
    private Integer ppeCompliancePercent;

    @Column(name = "scaffolding_status", length = 50)
    private String scaffoldingStatus;

    @Column(name = "fire_equipment_status", length = 50)
    private String fireEquipmentStatus;

    @Column(name = "safety_officer", length = 80)
    private String safetyOfficer;

    @Column(name = "audit_date")
    private LocalDate auditDate;

    @Column(name = "corrective_notes", length = 500)
    private String correctiveNotes;

    @Column(name = "organization_id")
    private Long organizationId;

    public QaQcSafetyAudit(String auditCode, String area, Integer ppeCompliancePercent, String scaffoldingStatus, String fireEquipmentStatus, String safetyOfficer, LocalDate auditDate, String correctiveNotes, Long organizationId) {
        this.auditCode = auditCode;
        this.area = area;
        this.ppeCompliancePercent = ppeCompliancePercent;
        this.scaffoldingStatus = scaffoldingStatus;
        this.fireEquipmentStatus = fireEquipmentStatus;
        this.safetyOfficer = safetyOfficer;
        this.auditDate = auditDate;
        this.correctiveNotes = correctiveNotes;
        this.organizationId = organizationId;
    }
}

