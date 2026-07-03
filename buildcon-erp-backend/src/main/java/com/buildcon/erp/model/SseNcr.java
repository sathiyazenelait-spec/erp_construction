package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "sse_ncrs")
public class SseNcr {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ncr_id")
    private String ncrId;

    private String title;
    private String description;

    @Column(name = "logged_date")
    private String loggedDate;

    @Column(name = "issued_to")
    private String issuedTo;

    private String status;

    @Column(name = "organization_id")
    private Long organizationId;

    public SseNcr() {}

    public SseNcr(String ncrId, String title, String description, String loggedDate, String issuedTo, String status, Long organizationId) {
        this.ncrId = ncrId;
        this.title = title;
        this.description = description;
        this.loggedDate = loggedDate;
        this.issuedTo = issuedTo;
        this.status = status;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNcrId() {
        return ncrId;
    }

    public void setNcrId(String ncrId) {
        this.ncrId = ncrId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLoggedDate() {
        return loggedDate;
    }

    public void setLoggedDate(String loggedDate) {
        this.loggedDate = loggedDate;
    }

    public String getIssuedTo() {
        return issuedTo;
    }

    public void setIssuedTo(String issuedTo) {
        this.issuedTo = issuedTo;
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
