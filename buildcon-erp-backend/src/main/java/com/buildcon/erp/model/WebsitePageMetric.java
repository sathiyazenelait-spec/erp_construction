package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "website_page_metrics")
public class WebsitePageMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Long views;

    @Column(name = "organization_id")
    private Long organizationId;

    public WebsitePageMetric() {}

    public WebsitePageMetric(String name, Long views, Long organizationId) {
        this.name = name;
        this.views = views;
        this.organizationId = organizationId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getViews() { return views; }
    public void setViews(Long views) { this.views = views; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
}
