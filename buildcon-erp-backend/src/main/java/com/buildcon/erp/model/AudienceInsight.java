package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "audience_insights")
public class AudienceInsight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private String label;
    private Double value;

    @Column(name = "organization_id")
    private Long organizationId;

    public AudienceInsight() {}

    public AudienceInsight(String category, String label, Double value, Long organizationId) {
        this.category = category;
        this.label = label;
        this.value = value;
        this.organizationId = organizationId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
}
