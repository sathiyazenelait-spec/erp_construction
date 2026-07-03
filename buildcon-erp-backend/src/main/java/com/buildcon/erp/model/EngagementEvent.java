package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "engagement_events")
public class EngagementEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 100)
    private String type; // Townhall, Team Outing, Training, Celebration

    @Column(nullable = false, length = 100)
    private String date;

    @Column(nullable = false, length = 200)
    private String location;

    @Column(nullable = false, length = 50)
    private String status = "Scheduled"; // Scheduled, Completed

    @Column(nullable = false)
    private Integer registered = 0;

    @Column(name = "organization_id")
    private Long organizationId;

    public EngagementEvent() {
    }

    public EngagementEvent(String title, String type, String date, String location, String status, Integer registered, Long organizationId) {
        this.title = title;
        this.type = type;
        this.date = date;
        this.location = location;
        this.status = status;
        this.registered = registered;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getRegistered() {
        return registered;
    }

    public void setRegistered(Integer registered) {
        this.registered = registered;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
