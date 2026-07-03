package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "marketing_metrics")
public class MarketingMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String metricKey;
    private Double metricValue;
    private String category;
    private String label;

    @Column(name = "organization_id")
    private Long organizationId;

    public MarketingMetric() {}

    public MarketingMetric(String metricKey, Double metricValue, String category, String label, Long organizationId) {
        this.metricKey = metricKey;
        this.metricValue = metricValue;
        this.category = category;
        this.label = label;
        this.organizationId = organizationId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMetricKey() { return metricKey; }
    public void setMetricKey(String metricKey) { this.metricKey = metricKey; }

    public Double getMetricValue() { return metricValue; }
    public void setMetricValue(Double metricValue) { this.metricValue = metricValue; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
}
