package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "compliance_checklists")
public class ComplianceChecklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String task;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false, length = 100)
    private String dueDate;

    @Column(nullable = false, length = 50)
    private String status; // done, pending

    @Column(name = "organization_id")
    private Long organizationId;

    public ComplianceChecklist() {
    }

    public ComplianceChecklist(String task, String category, String dueDate, String status, Long organizationId) {
        this.task = task;
        this.category = category;
        this.dueDate = dueDate;
        this.status = status;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTask() {
        return task;
    }

    public void setTask(String task) {
        this.task = task;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
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
