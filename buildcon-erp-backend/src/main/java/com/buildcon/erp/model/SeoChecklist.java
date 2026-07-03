package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "seo_checklists")
public class SeoChecklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String page;
    private String priority;
    private String dueDate;
    private String status;

    @Column(name = "organization_id")
    private Long organizationId;

    public SeoChecklist() {}

    public SeoChecklist(String title, String page, String priority, String dueDate, String status, Long organizationId) {
        this.title = title;
        this.page = page;
        this.priority = priority;
        this.dueDate = dueDate;
        this.status = status;
        this.organizationId = organizationId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPage() { return page; }
    public void setPage(String page) { this.page = page; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
}
