package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "sales_activities")
public class SalesActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String activity;

    @Column(name = "lead_name", nullable = false, length = 100)
    private String leadName;

    @Column(nullable = false, length = 50)
    private String type; // Call, Visit, Meeting, Proposal, WhatsApp

    @Column(nullable = false, length = 50)
    private String time;

    @Column(nullable = false, length = 50)
    private String status; // Completed, Pending

    @Column(length = 20)
    private String date; // e.g. "2025-05-28"

    @Column(name = "organization_id")
    private Long organizationId;

    public SalesActivity() {
    }

    public SalesActivity(String activity, String leadName, String type, String time, String status, Long organizationId) {
        this.activity = activity;
        this.leadName = leadName;
        this.type = type;
        this.time = time;
        this.status = status;
        this.organizationId = organizationId;
        this.date = java.time.LocalDate.now().toString();
    }

    public SalesActivity(String activity, String leadName, String type, String time, String status, String date, Long organizationId) {
        this.activity = activity;
        this.leadName = leadName;
        this.type = type;
        this.time = time;
        this.status = status;
        this.date = date;
        this.organizationId = organizationId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getActivity() {
        return activity;
    }

    public void setActivity(String activity) {
        this.activity = activity;
    }

    public String getLeadName() {
        return leadName;
    }

    public void setLeadName(String leadName) {
        this.leadName = leadName;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
