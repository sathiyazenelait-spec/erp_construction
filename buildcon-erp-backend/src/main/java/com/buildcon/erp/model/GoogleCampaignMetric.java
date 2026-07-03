package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "google_campaign_metrics")
public class GoogleCampaignMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer clicks;
    private String cost;

    @Column(name = "organization_id")
    private Long organizationId;

    public GoogleCampaignMetric() {}

    public GoogleCampaignMetric(String name, Integer clicks, String cost, Long organizationId) {
        this.name = name;
        this.clicks = clicks;
        this.cost = cost;
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

    public Integer getClicks() {
        return clicks;
    }

    public void setClicks(Integer clicks) {
        this.clicks = clicks;
    }

    public String getCost() {
        return cost;
    }

    public void setCost(String cost) {
        this.cost = cost;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
