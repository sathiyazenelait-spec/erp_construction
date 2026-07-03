package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "leave_requests")
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_name", nullable = false, length = 100)
    private String employeeName;

    @Column(name = "employee_role", nullable = false, length = 100)
    private String employeeRole;

    @Column(name = "leave_type", nullable = false, length = 100)
    private String leaveType;

    @Column(nullable = false, length = 200)
    private String duration;

    @Column(length = 500)
    private String reason;

    @Column(length = 50)
    private String status = "Pending"; // Pending, Approved, Rejected

    @Column(name = "organization_id")
    private Long organizationId;

    public LeaveRequest() {
    }

    public LeaveRequest(String employeeName, String employeeRole, String leaveType, String duration, String reason, String status, Long organizationId) {
        this.employeeName = employeeName;
        this.employeeRole = employeeRole;
        this.leaveType = leaveType;
        this.duration = duration;
        this.reason = reason;
        this.status = status;
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

    public String getEmployeeRole() {
        return employeeRole;
    }

    public void setEmployeeRole(String employeeRole) {
        this.employeeRole = employeeRole;
    }

    public String getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(String leaveType) {
        this.leaveType = leaveType;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
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
