package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "social_post_metrics")
public class SocialPostMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String reach;
    private String engagement;

    @Column(name = "organization_id")
    private Long organizationId;

    public SocialPostMetric() {}

    public SocialPostMetric(String title, String reach, String engagement, Long organizationId) {
        this.title = title;
        this.reach = reach;
        this.engagement = engagement;
        this.organizationId = organizationId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getReach() { return reach; }
    public void setReach(String reach) { this.reach = reach; }

    public String getEngagement() { return engagement; }
    public void setEngagement(String engagement) { this.engagement = engagement; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
}
