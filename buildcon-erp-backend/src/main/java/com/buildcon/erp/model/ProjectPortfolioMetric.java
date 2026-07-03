package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "project_portfolio_metrics")
public class ProjectPortfolioMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    private Integer views;
    private Integer leads;
    private Integer enquiries;

    @Column(name = "organization_id")
    private Long organizationId;

    public ProjectPortfolioMetric() {}

    public ProjectPortfolioMetric(String name, String location, Integer views, Integer leads, Integer enquiries, Long organizationId) {
        this.name = name;
        this.location = location;
        this.views = views;
        this.leads = leads;
        this.enquiries = enquiries;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getViews() {
        return views;
    }

    public void setViews(Integer views) {
        this.views = views;
    }

    public Integer getLeads() {
        return leads;
    }

    public void setLeads(Integer leads) {
        this.leads = leads;
    }

    public Integer getEnquiries() {
        return enquiries;
    }

    public void setEnquiries(Integer enquiries) {
        this.enquiries = enquiries;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
