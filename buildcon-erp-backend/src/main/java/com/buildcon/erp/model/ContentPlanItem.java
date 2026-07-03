package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "content_plan_items")
public class ContentPlanItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String type;
    private String dueDate;
    private String priority;
    private String status; // "Ideas", "In Progress", "Scheduled", "Published"

    @Column(name = "organization_id")
    private Long organizationId;

    public ContentPlanItem() {}

    public ContentPlanItem(String title, String type, String dueDate, String priority, String status, Long organizationId) {
        this.title = title;
        this.type = type;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
        this.organizationId = organizationId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
}
