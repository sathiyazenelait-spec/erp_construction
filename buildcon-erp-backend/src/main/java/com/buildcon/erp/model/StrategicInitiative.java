package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "strategic_initiatives")
public class StrategicInitiative {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String owner;

    @Column(length = 100)
    private String timeline;

    private Integer progress;

    @Column(length = 50)
    private String status; // "On Track", "Delayed"

    @Column(name = "organization_id")
    private Long organizationId;

    public StrategicInitiative() {}

    public StrategicInitiative(String name, String owner, String timeline, Integer progress, String status, Long organizationId) {
        this.name = name;
        this.owner = owner;
        this.timeline = timeline;
        this.progress = progress;
        this.status = status;
        this.organizationId = organizationId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }

    public String getTimeline() { return timeline; }
    public void setTimeline(String timeline) { this.timeline = timeline; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
}
