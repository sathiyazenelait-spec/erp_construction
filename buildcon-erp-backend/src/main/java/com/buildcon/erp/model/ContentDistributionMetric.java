package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "content_distribution_metrics")
public class ContentDistributionMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer value;
    private String color;

    @Column(name = "organization_id")
    private Long organizationId;

    public ContentDistributionMetric() {}

    public ContentDistributionMetric(String name, Integer value, String color, Long organizationId) {
        this.name = name;
        this.value = value;
        this.color = color;
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

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
