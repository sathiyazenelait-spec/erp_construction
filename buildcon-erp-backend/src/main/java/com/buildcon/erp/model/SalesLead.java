package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "sales_leads")
public class SalesLead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 50)
    private String source;

    @Column(name = "project_type", length = 50)
    private String projectType;

    @Column(length = 100)
    private String location;

    @Column(length = 50)
    private String budget;

    @Column(length = 20)
    private String status; // Hot, Warm, Cold

    @Column(name = "added_on", length = 50)
    private String addedOn;

    // Qualification Details
    @Column(length = 50)
    private String timeline;

    @Column(name = "plot_size", length = 50)
    private String plotSize;

    @Column(length = 50)
    private String floors;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(name = "budget_fit", length = 20)
    private String budgetFit;

    @Column(name = "decision_maker", length = 100)
    private String decisionMaker;

    @Column(name = "timeline_fit", length = 20)
    private String timelineFit;

    @Column(name = "requirement_clarity", length = 50)
    private String requirementClarity;

    @Column(length = 100)
    private String competition;

    @Column(name = "lead_score")
    private Integer leadScore = 3;

    @Column(name = "qualified_status", length = 50)
    private String qualifiedStatus;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "organization_id")
    private Long organizationId;

    public SalesLead() {
    }

    public SalesLead(String name, String source, String projectType, String location, String budget, String status, String addedOn, Long organizationId) {
        this.name = name;
        this.source = source;
        this.projectType = projectType;
        this.location = location;
        this.budget = budget;
        this.status = status;
        this.addedOn = addedOn;
        this.organizationId = organizationId;
    }

    // Getters and Setters
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

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getProjectType() {
        return projectType;
    }

    public void setProjectType(String projectType) {
        this.projectType = projectType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getBudget() {
        return budget;
    }

    public void setBudget(String budget) {
        this.budget = budget;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAddedOn() {
        return addedOn;
    }

    public void setAddedOn(String addedOn) {
        this.addedOn = addedOn;
    }

    public String getTimeline() {
        return timeline;
    }

    public void setTimeline(String timeline) {
        this.timeline = timeline;
    }

    public String getPlotSize() {
        return plotSize;
    }

    public void setPlotSize(String plotSize) {
        this.plotSize = plotSize;
    }

    public String getFloors() {
        return floors;
    }

    public void setFloors(String floors) {
        this.floors = floors;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public String getBudgetFit() {
        return budgetFit;
    }

    public void setBudgetFit(String budgetFit) {
        this.budgetFit = budgetFit;
    }

    public String getDecisionMaker() {
        return decisionMaker;
    }

    public void setDecisionMaker(String decisionMaker) {
        this.decisionMaker = decisionMaker;
    }

    public String getTimelineFit() {
        return timelineFit;
    }

    public void setTimelineFit(String timelineFit) {
        this.timelineFit = timelineFit;
    }

    public String getRequirementClarity() {
        return requirementClarity;
    }

    public void setRequirementClarity(String requirementClarity) {
        this.requirementClarity = requirementClarity;
    }

    public String getCompetition() {
        return competition;
    }

    public void setCompetition(String competition) {
        this.competition = competition;
    }

    public Integer getLeadScore() {
        return leadScore;
    }

    public void setLeadScore(Integer leadScore) {
        this.leadScore = leadScore;
    }

    public String getQualifiedStatus() {
        return qualifiedStatus;
    }

    public void setQualifiedStatus(String qualifiedStatus) {
        this.qualifiedStatus = qualifiedStatus;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
