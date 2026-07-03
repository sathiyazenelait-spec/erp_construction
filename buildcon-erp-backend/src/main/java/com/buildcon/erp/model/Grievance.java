package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "grievances")
public class Grievance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String employee;

    @Column(nullable = false, length = 100)
    private String type; // Category / Category type

    @Column(nullable = false, length = 100)
    private String date;

    @Column(nullable = false, length = 50)
    private String priority; // High, Medium, Low

    @Column(nullable = false, length = 50)
    private String status = "Open"; // Open, In Investigation, Resolved

    @Column(nullable = false, length = 1000)
    private String summary;

    @Column(name = "organization_id")
    private Long organizationId;

    public Grievance() {
    }

    public Grievance(String employee, String type, String date, String priority, String status, String summary, Long organizationId) {
        this.employee = employee;
        this.type = type;
        this.date = date;
        this.priority = priority;
        this.status = status;
        this.summary = summary;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployee() {
        return employee;
    }

    public void setEmployee(String employee) {
        this.employee = employee;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
