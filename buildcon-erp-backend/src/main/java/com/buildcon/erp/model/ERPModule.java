package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "erp_modules")
public class ERPModule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "module_key", nullable = false, unique = true)
    private String moduleKey;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String status = "Global Enable"; // "Global Enable" or "Global Disable"

    @Column(name = "tier_required", nullable = false)
    private String tierRequired = "Growth"; // "Growth" | "Premium" | "Enterprise"

    @Column(name = "active_orgs")
    private Integer activeOrgs = 0;

    public ERPModule() {
    }

    public ERPModule(String name, String moduleKey, String description, String status, String tierRequired, Integer activeOrgs) {
        this.name = name;
        this.moduleKey = moduleKey;
        this.description = description;
        this.status = status;
        this.tierRequired = tierRequired;
        this.activeOrgs = activeOrgs;
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

    public String getModuleKey() {
        return moduleKey;
    }

    public void setModuleKey(String moduleKey) {
        this.moduleKey = moduleKey;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTierRequired() {
        return tierRequired;
    }

    public void setTierRequired(String tierRequired) {
        this.tierRequired = tierRequired;
    }

    public Integer getActiveOrgs() {
        return activeOrgs;
    }

    public void setActiveOrgs(Integer activeOrgs) {
        this.activeOrgs = activeOrgs;
    }
}
