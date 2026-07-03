package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "sse_cube_tests")
public class SseCubeTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "test_id")
    private String testId;

    @Column(name = "mix_grade")
    private String mixGrade;

    @Column(name = "cast_date")
    private String castDate;

    @Column(name = "test_age")
    private String testAge;

    @Column(name = "strength_achieved")
    private Double strengthAchieved;

    @Column(name = "target_strength")
    private Double targetStrength;

    private String status;

    @Column(name = "organization_id")
    private Long organizationId;

    public SseCubeTest() {}

    public SseCubeTest(String testId, String mixGrade, String castDate, String testAge, Double strengthAchieved, Double targetStrength, String status, Long organizationId) {
        this.testId = testId;
        this.mixGrade = mixGrade;
        this.castDate = castDate;
        this.testAge = testAge;
        this.strengthAchieved = strengthAchieved;
        this.targetStrength = targetStrength;
        this.status = status;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTestId() {
        return testId;
    }

    public void setTestId(String testId) {
        this.testId = testId;
    }

    public String getMixGrade() {
        return mixGrade;
    }

    public void setMixGrade(String mixGrade) {
        this.mixGrade = mixGrade;
    }

    public String getCastDate() {
        return castDate;
    }

    public void setCastDate(String castDate) {
        this.castDate = castDate;
    }

    public String getTestAge() {
        return testAge;
    }

    public void setTestAge(String testAge) {
        this.testAge = testAge;
    }

    public Double getStrengthAchieved() {
        return strengthAchieved;
    }

    public void setStrengthAchieved(Double strengthAchieved) {
        this.strengthAchieved = strengthAchieved;
    }

    public Double getTargetStrength() {
        return targetStrength;
    }

    public void setTargetStrength(Double targetStrength) {
        this.targetStrength = targetStrength;
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
}
