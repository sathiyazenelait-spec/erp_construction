package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "revenue_entries")
public class RevenueEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String week; // e.g. "Week 1", "Week 2"

    @Column(nullable = false)
    private Long target;

    @Column(nullable = false)
    private Long achieved;

    @Column(name = "organization_id")
    private Long organizationId;

    public RevenueEntry() {}

    public RevenueEntry(String week, Long target, Long achieved, Long organizationId) {
        this.week = week;
        this.target = target;
        this.achieved = achieved;
        this.organizationId = organizationId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getWeek() { return week; }
    public void setWeek(String week) { this.week = week; }

    public Long getTarget() { return target; }
    public void setTarget(Long target) { this.target = target; }

    public Long getAchieved() { return achieved; }
    public void setAchieved(Long achieved) { this.achieved = achieved; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
}
