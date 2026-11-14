package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "qa_qc_material_tests")
@Getter
@Setter
@NoArgsConstructor
public class QaQcMaterialTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "test_code", length = 50)
    private String testCode;

    @Column(name = "material_name", nullable = false, length = 120)
    private String materialName;

    @Column(name = "test_type", length = 80)
    private String testType;

    @Column(name = "batch_ref", length = 60)
    private String batchRef;

    @Column(name = "supplier_name", length = 100)
    private String supplierName;

    @Column(name = "standard_spec", length = 100)
    private String standardSpec;

    @Column(name = "observed_value", length = 100)
    private String observedValue;

    @Column(length = 20)
    private String result; // PASS, FAIL

    @Column(name = "tested_date")
    private LocalDate testedDate;

    @Column(name = "cert_doc_ref", length = 120)
    private String certDocRef;

    @Column(name = "organization_id")
    private Long organizationId;

    public QaQcMaterialTest(String testCode, String materialName, String testType, String batchRef, String supplierName, String standardSpec, String observedValue, String result, LocalDate testedDate, String certDocRef, Long organizationId) {
        this.testCode = testCode;
        this.materialName = materialName;
        this.testType = testType;
        this.batchRef = batchRef;
        this.supplierName = supplierName;
        this.standardSpec = standardSpec;
        this.observedValue = observedValue;
        this.result = result;
        this.testedDate = testedDate;
        this.certDocRef = certDocRef;
        this.organizationId = organizationId;
    }
}

