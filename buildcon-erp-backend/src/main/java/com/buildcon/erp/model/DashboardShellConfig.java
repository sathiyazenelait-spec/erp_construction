package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "dashboard_shell_configs")
public class DashboardShellConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dashboard_type")
    private String dashboardType; // "workforce" or "finance"

    @Column(name = "config_key")
    private String configKey; // "sidebar_menus", "guidelines", "compliance_tax", "header_date", "ai_suggestions"

    @Column(name = "config_value", length = 3000)
    private String configValue;

    @Column(name = "organization_id")
    private Long organizationId;

    public DashboardShellConfig() {}

    public DashboardShellConfig(String dashboardType, String configKey, String configValue, Long organizationId) {
        this.dashboardType = dashboardType;
        this.configKey = configKey;
        this.configValue = configValue;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDashboardType() {
        return dashboardType;
    }

    public void setDashboardType(String dashboardType) {
        this.dashboardType = dashboardType;
    }

    public String getConfigKey() {
        return configKey;
    }

    public void setConfigKey(String configKey) {
        this.configKey = configKey;
    }

    public String getConfigValue() {
        return configValue;
    }

    public void setConfigValue(String configValue) {
        this.configValue = configValue;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
