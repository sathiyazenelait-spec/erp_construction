package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "wm_headcount_audits")
public class WmHeadcountAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String contractor;
    private Integer expected;
    private Integer actual;
    private Integer variance;
    private String status;

    @Column(name = "organization_id")
    private Long organizationId;

    public WmHeadcountAudit() {}

    public WmHeadcountAudit(String contractor, Integer expected, Integer actual, Integer variance, String status, Long organizationId) {
        this.contractor = contractor;
        this.expected = expected;
        this.actual = actual;
        this.variance = variance;
        this.status = status;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContractor() {
        return contractor;
    }

    public void setContractor(String contractor) {
        this.contractor = contractor;
    }

    public Integer getExpected() {
        return expected;
    }

    public void setExpected(Integer expected) {
        this.expected = expected;
    }

    public Integer getActual() {
        return actual;
    }

    public void setActual(Integer actual) {
        this.actual = actual;
    }

    public Integer getVariance() {
        return variance;
    }

    public void setVariance(Integer variance) {
        this.variance = variance;
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
