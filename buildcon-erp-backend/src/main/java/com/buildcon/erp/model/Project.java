package com.buildcon.erp.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 200)
    private String location;

    private Double budget;

    private LocalDate startDate;

    private LocalDate endDate;

    @Column(length = 50)
    private String status = "Planning"; // Planning, Active, Suspended, Completed

    @Column(name = "organization_id")
    private Long organizationId;

    @Column(name = "design_plan_name")
    private String designPlanName;

    @Column(name = "architect_spec_name")
    private String architectSpecName;

    @Column(name = "workforce_details")
    private String workforceDetails;

    @Column(name = "ai_suggested_budget")
    private Double aiSuggestedBudget;

    @Column(name = "ai_estimated_hours")
    private Integer aiEstimatedHours;

    @Column(name = "ai_hazard_warnings", length = 1000)
    private String aiHazardWarnings;

    private Double length;

    private Integer floors;

    public Project() {
    }

    public Project(String name, String location, Double budget, LocalDate startDate, LocalDate endDate, Long organizationId) {
        this.name = name;
        this.location = location;
        this.budget = budget;
        this.startDate = startDate;
        this.endDate = endDate;
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

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public String getDesignPlanName() {
        return designPlanName;
    }

    public void setDesignPlanName(String designPlanName) {
        this.designPlanName = designPlanName;
    }

    public String getArchitectSpecName() {
        return architectSpecName;
    }

    public void setArchitectSpecName(String architectSpecName) {
        this.architectSpecName = architectSpecName;
    }

    public String getWorkforceDetails() {
        return workforceDetails;
    }

    public void setWorkforceDetails(String workforceDetails) {
        this.workforceDetails = workforceDetails;
    }

    public Double getAiSuggestedBudget() {
        return aiSuggestedBudget;
    }

    public void setAiSuggestedBudget(Double aiSuggestedBudget) {
        this.aiSuggestedBudget = aiSuggestedBudget;
    }

    public Integer getAiEstimatedHours() {
        return aiEstimatedHours;
    }

    public void setAiEstimatedHours(Integer aiEstimatedHours) {
        this.aiEstimatedHours = aiEstimatedHours;
    }

    public String getAiHazardWarnings() {
        return aiHazardWarnings;
    }

    public void setAiHazardWarnings(String aiHazardWarnings) {
        this.aiHazardWarnings = aiHazardWarnings;
    }

    public Double getLength() {
        return length;
    }

    public void setLength(Double length) {
        this.length = length;
    }

    public Integer getFloors() {
        return floors;
    }

    public void setFloors(Integer floors) {
        this.floors = floors;
    }
}
