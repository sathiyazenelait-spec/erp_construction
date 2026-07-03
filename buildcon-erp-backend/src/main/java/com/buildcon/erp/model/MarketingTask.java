package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "marketing_tasks")
public class MarketingTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String project;
    private String priority;
    private String due;
    private String status;

    @Column(name = "organization_id")
    private Long organizationId;

    public MarketingTask() {}

    public MarketingTask(String title, String project, String priority, String due, String status, Long organizationId) {
        this.title = title;
        this.project = project;
        this.priority = priority;
        this.due = due;
        this.status = status;
        this.organizationId = organizationId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getProject() { return project; }
    public void setProject(String project) { this.project = project; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getDue() { return due; }
    public void setDue(String due) { this.due = due; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
}
