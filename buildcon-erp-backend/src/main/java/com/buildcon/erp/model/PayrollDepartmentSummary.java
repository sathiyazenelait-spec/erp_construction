package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "payroll_department_summaries")
public class PayrollDepartmentSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(nullable = false, length = 50)
    private String employeeCount;

    @Column(nullable = false, length = 50)
    private String basicComponent;

    @Column(nullable = false, length = 50)
    private String deductions;

    @Column(nullable = false, length = 50)
    private String netPayout;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "organization_id")
    private Long organizationId;

    public PayrollDepartmentSummary() {
    }

    public PayrollDepartmentSummary(String department, String employeeCount, String basicComponent, String deductions, String netPayout, String status, Long organizationId) {
        this.department = department;
        this.employeeCount = employeeCount;
        this.basicComponent = basicComponent;
        this.deductions = deductions;
        this.netPayout = netPayout;
        this.status = status;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getEmployeeCount() {
        return employeeCount;
    }

    public void setEmployeeCount(String employeeCount) {
        this.employeeCount = employeeCount;
    }

    public String getBasicComponent() {
        return basicComponent;
    }

    public void setBasicComponent(String basicComponent) {
        this.basicComponent = basicComponent;
    }

    public String getDeductions() {
        return deductions;
    }

    public void setDeductions(String deductions) {
        this.deductions = deductions;
    }

    public String getNetPayout() {
        return netPayout;
    }

    public void setNetPayout(String netPayout) {
        this.netPayout = netPayout;
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
