package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "website_health_metrics")
public class WebsiteHealthMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String parameterName;
    private String statusValue;
    private Boolean isGood;

    @Column(name = "organization_id")
    private Long organizationId;

    public WebsiteHealthMetric() {}

    public WebsiteHealthMetric(String parameterName, String statusValue, Boolean isGood, Long organizationId) {
        this.parameterName = parameterName;
        this.statusValue = statusValue;
        this.isGood = isGood;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    public String getStatusValue() {
        return statusValue;
    }

    public void setStatusValue(String statusValue) {
        this.statusValue = statusValue;
    }

    public Boolean getIsGood() {
        return isGood;
    }

    public void setIsGood(Boolean isGood) {
        this.isGood = isGood;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
