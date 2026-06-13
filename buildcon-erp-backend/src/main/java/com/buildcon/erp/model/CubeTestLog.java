package com.buildcon.erp.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "cube_test_logs")
public class CubeTestLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    private LocalDate sampleDate = LocalDate.now();

    @Column(length = 20)
    private String grade; // M20, M25, M30, etc.

    @Column(name = "strength_7_days")
    private Double compressiveStrength7Days;

    @Column(name = "strength_28_days")
    private Double compressiveStrength28Days;

    @Column(length = 20)
    private String status = "PENDING"; // PENDING, PASS, FAIL

    @Column(length = 50)
    private String loggedBy;

    public CubeTestLog() {
    }

    public CubeTestLog(Long projectId, String grade, Double compressiveStrength7Days, Double compressiveStrength28Days, String loggedBy) {
        this.projectId = projectId;
        this.grade = grade;
        this.compressiveStrength7Days = compressiveStrength7Days;
        this.compressiveStrength28Days = compressiveStrength28Days;
        this.loggedBy = loggedBy;
        this.sampleDate = LocalDate.now();
        this.status = "PENDING";
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

    public LocalDate getSampleDate() {
        return sampleDate;
    }

    public void setSampleDate(LocalDate sampleDate) {
        this.sampleDate = sampleDate;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public Double getCompressiveStrength7Days() {
        return compressiveStrength7Days;
    }

    public void setCompressiveStrength7Days(Double compressiveStrength7Days) {
        this.compressiveStrength7Days = compressiveStrength7Days;
    }

    public Double getCompressiveStrength28Days() {
        return compressiveStrength28Days;
    }

    public void setCompressiveStrength28Days(Double compressiveStrength28Days) {
        this.compressiveStrength28Days = compressiveStrength28Days;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLoggedBy() {
        return loggedBy;
    }

    public void setLoggedBy(String loggedBy) {
        this.loggedBy = loggedBy;
    }
}
