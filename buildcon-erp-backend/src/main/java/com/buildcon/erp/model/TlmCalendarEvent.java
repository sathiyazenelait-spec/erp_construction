package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tlm_calendar_events")
public class TlmCalendarEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private Integer date;
    private String channel;
    private String status;

    @Column(name = "organization_id")
    private Long organizationId;

    public TlmCalendarEvent() {}

    public TlmCalendarEvent(String title, Integer date, String channel, String status, Long organizationId) {
        this.title = title;
        this.date = date;
        this.channel = channel;
        this.status = status;
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

    public Integer getDate() {
        return date;
    }

    public void setDate(Integer date) {
        this.date = date;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
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
