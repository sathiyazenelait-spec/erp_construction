package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "recruitment_openings")
public class RecruitmentOpening {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(nullable = false, length = 50)
    private String targetHires;

    @Column(nullable = false, length = 50)
    private String applicationsCount;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "organization_id")
    private Long organizationId;

    public RecruitmentOpening() {
    }

    public RecruitmentOpening(String title, String department, String targetHires, String applicationsCount, String status, Long organizationId) {
        this.title = title;
        this.department = department;
        this.targetHires = targetHires;
        this.applicationsCount = applicationsCount;
        this.status = status;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getTargetHires() {
        return targetHires;
    }

    public void setTargetHires(String targetHires) {
        this.targetHires = targetHires;
    }

    public String getApplicationsCount() {
        return applicationsCount;
    }

    public void setApplicationsCount(String applicationsCount) {
        this.applicationsCount = applicationsCount;
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
