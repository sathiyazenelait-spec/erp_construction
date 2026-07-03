package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "subcontractor_contracts")
public class SubcontractorContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contract_id")
    private String contractId;

    @Column(name = "scope_name")
    private String scopeName;

    private Integer progress;
    private Double value;
    private Double certified;
    private String status;

    @Column(name = "organization_id")
    private Long organizationId;

    @Column(name = "subcontractor_id")
    private Long subcontractorId;

    public SubcontractorContract() {}

    public SubcontractorContract(String contractId, String scopeName, Integer progress, Double value, Double certified, String status, Long organizationId, Long subcontractorId) {
        this.contractId = contractId;
        this.scopeName = scopeName;
        this.progress = progress;
        this.value = value;
        this.certified = certified;
        this.status = status;
        this.organizationId = organizationId;
        this.subcontractorId = subcontractorId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContractId() {
        return contractId;
    }

    public void setContractId(String contractId) {
        this.contractId = contractId;
    }

    public String getScopeName() {
        return scopeName;
    }

    public void setScopeName(String scopeName) {
        this.scopeName = scopeName;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public Double getCertified() {
        return certified;
    }

    public void setCertified(Double certified) {
        this.certified = certified;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public Long getSubcontractorId() {
        return subcontractorId;
    }

    public void setSubcontractorId(Long subcontractorId) {
        this.subcontractorId = subcontractorId;
    }
}
