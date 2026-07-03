package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pm_inventory_items")
public class PmInventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private Double stock;
    private Double minLimit;
    private String unit;
    private String status;

    @Column(name = "organization_id")
    private Long organizationId;

    public PmInventoryItem() {}

    public PmInventoryItem(String name, String category, Double stock, Double minLimit, String unit, String status, Long organizationId) {
        this.name = name;
        this.category = category;
        this.stock = stock;
        this.minLimit = minLimit;
        this.unit = unit;
        this.status = status;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getStock() {
        return stock;
    }

    public void setStock(Double stock) {
        this.stock = stock;
    }

    public Double getMinLimit() {
        return minLimit;
    }

    public void setMinLimit(Double minLimit) {
        this.minLimit = minLimit;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
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
