package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pm_rfqs")
public class PmRfq {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String rfqId;
    private String material;
    private String quantity;
    private String status;
    private Integer bidsCount;

    @Column(name = "organization_id")
    private Long organizationId;

    public PmRfq() {}

    public PmRfq(String rfqId, String material, String quantity, String status, Integer bidsCount, Long organizationId) {
        this.rfqId = rfqId;
        this.material = material;
        this.quantity = quantity;
        this.status = status;
        this.bidsCount = bidsCount;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRfqId() {
        return rfqId;
    }

    public void setRfqId(String rfqId) {
        this.rfqId = rfqId;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getBidsCount() {
        return bidsCount;
    }

    public void setBidsCount(Integer bidsCount) {
        this.bidsCount = bidsCount;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
