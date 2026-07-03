package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "performance_appraisals")
public class PerformanceAppraisal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String employeeName;

    @Column(nullable = false, length = 100)
    private String role;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(nullable = false, length = 50)
    private String selfRating;

    @Column(nullable = false, length = 50)
    private String managerRating;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(name = "organization_id")
    private Long organizationId;

    public PerformanceAppraisal() {
    }

    public PerformanceAppraisal(String employeeName, String role, String department, String selfRating, String managerRating, String category, Long organizationId) {
        this.employeeName = employeeName;
        this.role = role;
        this.department = department;
        this.selfRating = selfRating;
        this.managerRating = managerRating;
        this.category = category;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getSelfRating() {
        return selfRating;
    }

    public void setSelfRating(String selfRating) {
        this.selfRating = selfRating;
    }

    public String getManagerRating() {
        return managerRating;
    }

    public void setManagerRating(String managerRating) {
        this.managerRating = managerRating;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
