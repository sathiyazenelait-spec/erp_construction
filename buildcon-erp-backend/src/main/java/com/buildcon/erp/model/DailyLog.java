package com.buildcon.erp.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_logs")
public class DailyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    private LocalDate date = LocalDate.now();

    @Column(nullable = false, length = 1000)
    private String activity;

    @Column(length = 100)
    private String zone;

    @Column(name = "workforce_count")
    private Integer workforceCount;

    @Column(length = 50)
    private String status = "In Progress"; // Completed, In Progress, Delayed

    public DailyLog() {
    }

    public DailyLog(Long projectId, String activity, String zone, Integer workforceCount, String status) {
        this.projectId = projectId;
        this.activity = activity;
        this.zone = zone;
        this.workforceCount = workforceCount;
        this.status = status;
        this.date = LocalDate.now();
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getActivity() {
        return activity;
    }

    public void setActivity(String activity) {
        this.activity = activity;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public Integer getWorkforceCount() {
        return workforceCount;
    }

    public void setWorkforceCount(Integer workforceCount) {
        this.workforceCount = workforceCount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
