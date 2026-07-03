package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pm_requisitions")
public class PmRequisition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String indentId;
    private String material;
    private String requestedBy;
    private String status;

    @Column(name = "organization_id")
    private Long organizationId;

    public PmRequisition() {}

    public PmRequisition(String indentId, String material, String requestedBy, String status, Long organizationId) {
        this.indentId = indentId;
        this.material = material;
        this.requestedBy = requestedBy;
        this.status = status;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIndentId() {
        return indentId;
    }

    public void setIndentId(String indentId) {
        this.indentId = indentId;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public String getRequestedBy() {
        return requestedBy;
    }

    public void setRequestedBy(String requestedBy) {
        this.requestedBy = requestedBy;
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
}
