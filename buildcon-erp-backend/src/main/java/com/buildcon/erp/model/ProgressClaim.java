package com.buildcon.erp.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "progress_claims")
public class ProgressClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "subcontractor_id", nullable = false)
    private Long subcontractorId;

    @Column(length = 500)
    private String description;

    @Column(name = "amount_requested", nullable = false)
    private Double amountRequested;

    @Column(length = 30)
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED, PAID

    private LocalDate submittedDate = LocalDate.now();

    private LocalDate approvedDate;

    @Column(name = "payment_reference", length = 100)
    private String paymentReference;

    public ProgressClaim() {
    }

    public ProgressClaim(Long projectId, Long subcontractorId, String description, Double amountRequested) {
        this.projectId = projectId;
        this.subcontractorId = subcontractorId;
        this.description = description;
        this.amountRequested = amountRequested;
        this.status = "PENDING";
        this.submittedDate = LocalDate.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getSubcontractorId() {
        return subcontractorId;
    }

    public void setSubcontractorId(Long subcontractorId) {
        this.subcontractorId = subcontractorId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getAmountRequested() {
        return amountRequested;
    }

    public void setAmountRequested(Double amountRequested) {
        this.amountRequested = amountRequested;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getSubmittedDate() {
        return submittedDate;
    }

    public void setSubmittedDate(LocalDate submittedDate) {
        this.submittedDate = submittedDate;
    }

    public LocalDate getApprovedDate() {
        return approvedDate;
    }

    public void setApprovedDate(LocalDate approvedDate) {
        this.approvedDate = approvedDate;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }
}
