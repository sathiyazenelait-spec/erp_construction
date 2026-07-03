package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "subcontractor_indents")
public class SubcontractorIndent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String material;
    private String status;
    private String date;

    @Column(name = "organization_id")
    private Long organizationId;

    @Column(name = "subcontractor_id")
    private Long subcontractorId;

    public SubcontractorIndent() {}

    public SubcontractorIndent(String material, String status, String date, Long organizationId, Long subcontractorId) {
        this.material = material;
        this.status = status;
        this.date = date;
        this.organizationId = organizationId;
        this.subcontractorId = subcontractorId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
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
