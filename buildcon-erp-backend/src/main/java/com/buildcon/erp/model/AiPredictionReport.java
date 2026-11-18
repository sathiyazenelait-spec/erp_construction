package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ai_prediction_reports")
public class AiPredictionReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long projectId;
    private String projectName;

    // 1. Project Delay Prediction
    private Double delayRiskPercentage;
    private Integer predictedDelayDays;
    private String criticalPathRisk;

    // 2. Cost Overrun Prediction
    private Double costOverrunProbability;
    private Double projectedCostVariance;
    private String budgetBreachRisk;

    // 3. Safety Risk Prediction
    private Double safetyRiskScore; // 0-100
    private String highRiskZone;

    // 4. Material Demand Forecast (JSON of 30, 60, 90 days requirements)
    @Column(columnDefinition = "LONGTEXT")
    private String materialDemandForecastJson;

    // 5. Additional Predictions & Root Cause Insights
    @Column(columnDefinition = "LONGTEXT")
    private String actionableRecommendationsJson;

    private String generatedAt;

    @Column(name = "organization_id")
    private Long organizationId;

    public AiPredictionReport() {}

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

    public Double getDelayRiskPercentage() {
        return delayRiskPercentage;
    }

    public void setDelayRiskPercentage(Double delayRiskPercentage) {
        this.delayRiskPercentage = delayRiskPercentage;
    }

    public Integer getPredictedDelayDays() {
        return predictedDelayDays;
    }

    public void setPredictedDelayDays(Integer predictedDelayDays) {
        this.predictedDelayDays = predictedDelayDays;
    }

    public String getCriticalPathRisk() {
        return criticalPathRisk;
    }

    public void setCriticalPathRisk(String criticalPathRisk) {
        this.criticalPathRisk = criticalPathRisk;
    }

    public Double getCostOverrunProbability() {
        return costOverrunProbability;
    }

    public void setCostOverrunProbability(Double costOverrunProbability) {
        this.costOverrunProbability = costOverrunProbability;
    }

    public Double getProjectedCostVariance() {
        return projectedCostVariance;
    }

    public void setProjectedCostVariance(Double projectedCostVariance) {
        this.projectedCostVariance = projectedCostVariance;
    }

    public String getBudgetBreachRisk() {
        return budgetBreachRisk;
    }

    public void setBudgetBreachRisk(String budgetBreachRisk) {
        this.budgetBreachRisk = budgetBreachRisk;
    }

    public Double getSafetyRiskScore() {
        return safetyRiskScore;
    }

    public void setSafetyRiskScore(Double safetyRiskScore) {
        this.safetyRiskScore = safetyRiskScore;
    }

    public String getHighRiskZone() {
        return highRiskZone;
    }

    public void setHighRiskZone(String highRiskZone) {
        this.highRiskZone = highRiskZone;
    }

    public String getMaterialDemandForecastJson() {
        return materialDemandForecastJson;
    }

    public void setMaterialDemandForecastJson(String materialDemandForecastJson) {
        this.materialDemandForecastJson = materialDemandForecastJson;
    }

    public String getActionableRecommendationsJson() {
        return actionableRecommendationsJson;
    }

    public void setActionableRecommendationsJson(String actionableRecommendationsJson) {
        this.actionableRecommendationsJson = actionableRecommendationsJson;
    }

    public String getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(String generatedAt) {
        this.generatedAt = generatedAt;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
