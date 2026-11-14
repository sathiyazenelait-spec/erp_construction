package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "qa_qc_ncrs")
@Getter
@Setter
@NoArgsConstructor
public class QaQcNcr {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ncr_number", length = 50)
    private String ncrNumber;

    @Column(nullable = false)
    private String title;

    @Column(length = 30)
    private String severity; // CRITICAL, MAJOR, MINOR

    @Column(name = "contractor_name", length = 100)
    private String contractorName;

    @Column(length = 120)
    private String location;

    @Column(name = "defect_description", length = 1000)
    private String defectDescription;

    @Column(name = "root_cause", length = 500)
    private String rootCause;

    @Column(name = "corrective_action", length = 500)
    private String correctiveAction;

    @Column(length = 30)
    private String status; // OPEN, UNDER_REVIEW, RECTIFIED, CLOSED

    @Column(name = "target_date")
    private LocalDate targetDate;

    @Column(name = "resolved_date")
    private LocalDate resolvedDate;

    @Column(name = "organization_id")
    private Long organizationId;

    public QaQcNcr(String ncrNumber, String title, String severity, String contractorName, String location, String defectDescription, String rootCause, String correctiveAction, String status, LocalDate targetDate, Long organizationId) {
        this.ncrNumber = ncrNumber;
        this.title = title;
        this.severity = severity;
        this.contractorName = contractorName;
        this.location = location;
        this.defectDescription = defectDescription;
        this.rootCause = rootCause;
        this.correctiveAction = correctiveAction;
        this.status = status;
        this.targetDate = targetDate;
        this.organizationId = organizationId;
    }
}

