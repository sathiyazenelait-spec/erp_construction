package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "strategic_goals")
public class StrategicGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String target;

    private Integer progress;

    @Column(length = 50)
    private String color;

    @Column(name = "organization_id")
    private Long organizationId;

    public StrategicGoal() {}

    public StrategicGoal(String name, String target, Integer progress, String color, Long organizationId) {
        this.name = name;
        this.target = target;
        this.progress = progress;
        this.color = color;
        this.organizationId = organizationId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
}
