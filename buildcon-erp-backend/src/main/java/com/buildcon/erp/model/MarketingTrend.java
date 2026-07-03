package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "marketing_trends")
public class MarketingTrend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String chartName;
    private String label;
    private Double value1;
    private Double value2;

    @Column(name = "organization_id")
    private Long organizationId;

    public MarketingTrend() {}

    public MarketingTrend(String chartName, String label, Double value1, Double value2, Long organizationId) {
        this.chartName = chartName;
        this.label = label;
        this.value1 = value1;
        this.value2 = value2;
        this.organizationId = organizationId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getChartName() { return chartName; }
    public void setChartName(String chartName) { this.chartName = chartName; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public Double getValue1() { return value1; }
    public void setValue1(Double value1) { this.value1 = value1; }

    public Double getValue2() { return value2; }
    public void setValue2(Double value2) { this.value2 = value2; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
}
