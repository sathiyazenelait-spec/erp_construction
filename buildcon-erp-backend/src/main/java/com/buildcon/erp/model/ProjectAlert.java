package com.buildcon.erp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_alerts")
public class ProjectAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "project_name", nullable = false)
    private String projectName;

    @Column(name = "organization_id")
    private Long organizationId;

    @Column(name = "expected_progress")
    private Double expectedProgress;

    @Column(name = "actual_progress")
    private Double actualProgress;

    @Column(name = "delay_days")
    private Integer delayDays;

    @Column(name = "detected_issues", length = 1000)
    private String detectedIssues;

    @Column(name = "predicted_requirements", length = 1000)
    private String predictedRequirements;

    @Column(name = "justification_prompt", length = 1000)
    private String justificationPrompt;

    @Column(name = "site_engineer_justification", length = 1000)
    private String siteEngineerJustification;

    @Column(name = "alert_time")
    private LocalDateTime alertTime = LocalDateTime.now();

    private Boolean resolved = false;

    public ProjectAlert() {
    }

    public ProjectAlert(Long projectId, String projectName, Long organizationId, Double expectedProgress, Double actualProgress, Integer delayDays, String detectedIssues, String predictedRequirements, String justificationPrompt) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.organizationId = organizationId;
        this.expectedProgress = expectedProgress;
        this.actualProgress = actualProgress;
        this.delayDays = delayDays;
        this.detectedIssues = detectedIssues;
        this.predictedRequirements = predictedRequirements;
        this.justificationPrompt = justificationPrompt;
        this.alertTime = LocalDateTime.now();
        this.resolved = false;
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

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public Double getExpectedProgress() {
        return expectedProgress;
    }

    public void setExpectedProgress(Double expectedProgress) {
        this.expectedProgress = expectedProgress;
    }

    public Double getActualProgress() {
        return actualProgress;
    }

    public void setActualProgress(Double actualProgress) {
        this.actualProgress = actualProgress;
    }

    public Integer getDelayDays() {
        return delayDays;
    }

    public void setDelayDays(Integer delayDays) {
        this.delayDays = delayDays;
    }

    public String getDetectedIssues() {
        return detectedIssues;
    }

    public void setDetectedIssues(String detectedIssues) {
        this.detectedIssues = detectedIssues;
    }

    public String getPredictedRequirements() {
        return predictedRequirements;
    }

    public void setPredictedRequirements(String predictedRequirements) {
        this.predictedRequirements = predictedRequirements;
    }

    public String getJustificationPrompt() {
        return justificationPrompt;
    }

    public void setJustificationPrompt(String justificationPrompt) {
        this.justificationPrompt = justificationPrompt;
    }

    public String getSiteEngineerJustification() {
        return siteEngineerJustification;
    }

    public void setSiteEngineerJustification(String siteEngineerJustification) {
        this.siteEngineerJustification = siteEngineerJustification;
    }

    public LocalDateTime getAlertTime() {
        return alertTime;
    }

    public void setAlertTime(LocalDateTime alertTime) {
        this.alertTime = alertTime;
    }

    public Boolean getResolved() {
        return resolved;
    }

    public void setResolved(Boolean resolved) {
        this.resolved = resolved;
    }
}
