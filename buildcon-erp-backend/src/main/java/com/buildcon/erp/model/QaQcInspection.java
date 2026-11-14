package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "qa_qc_inspections")
@Getter
@Setter
@NoArgsConstructor
public class QaQcInspection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "inspection_code", length = 50)
    private String inspectionCode;

    @Column(nullable = false)
    private String title;

    @Column(length = 60)
    private String category; // Structural, Civil, MEP, Finishing, Pre-Pour Concrete

    @Column(length = 120)
    private String location;

    @Column(name = "inspector_name", length = 80)
    private String inspectorName;

    @Column(length = 30)
    private String status; // PASSED, FAILED, CONDITIONAL

    @Column(name = "inspection_date")
    private LocalDate inspectionDate;

    @Column(length = 500)
    private String remarks;

    @Column(name = "organization_id")
    private Long organizationId;

    public QaQcInspection(String inspectionCode, String title, String category, String location, String inspectorName, String status, LocalDate inspectionDate, String remarks, Long organizationId) {
        this.inspectionCode = inspectionCode;
        this.title = title;
        this.category = category;
        this.location = location;
        this.inspectorName = inspectorName;
        this.status = status;
        this.inspectionDate = inspectionDate;
        this.remarks = remarks;
        this.organizationId = organizationId;
    }
}

