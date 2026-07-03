package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "safety_checklist_items")
public class SafetyChecklistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "rule_id", nullable = false, length = 20)
    private String ruleId; // e.g., "S-01", "S-02"

    @Column(nullable = false, length = 1000)
    private String ruleText;

    private Boolean checked = false;

    public SafetyChecklistItem() {
    }

    public SafetyChecklistItem(Long projectId, String ruleId, String ruleText, Boolean checked) {
        this.projectId = projectId;
        this.ruleId = ruleId;
        this.ruleText = ruleText;
        this.checked = checked;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getRuleId() {
        return ruleId;
    }

    public void setRuleId(String ruleId) {
        this.ruleId = ruleId;
    }

    public String getRuleText() {
        return ruleText;
    }

    public void setRuleText(String ruleText) {
        this.ruleText = ruleText;
    }

    public Boolean getChecked() {
        return checked;
    }

    public void setChecked(Boolean checked) {
        this.checked = checked;
    }
}
