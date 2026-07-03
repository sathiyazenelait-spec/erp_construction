package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "fa_cashflow_forecasts")
public class FaCashflowForecast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String month;
    private Double inflow;
    private Double outflow;

    @Column(name = "organization_id")
    private Long organizationId;

    public FaCashflowForecast() {}

    public FaCashflowForecast(String month, Double inflow, Double outflow, Long organizationId) {
        this.month = month;
        this.inflow = inflow;
        this.outflow = outflow;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Double getInflow() {
        return inflow;
    }

    public void setInflow(Double inflow) {
        this.inflow = inflow;
    }

    public Double getOutflow() {
        return outflow;
    }

    public void setOutflow(Double outflow) {
        this.outflow = outflow;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
