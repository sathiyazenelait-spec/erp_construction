package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "channel_performance_metrics")
public class ChannelPerformanceMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String channel;
    private Integer leads;
    private Integer conversions;
    private String conversionRate;

    @Column(name = "organization_id")
    private Long organizationId;

    public ChannelPerformanceMetric() {}

    public ChannelPerformanceMetric(String channel, Integer leads, Integer conversions, String conversionRate, Long organizationId) {
        this.channel = channel;
        this.leads = leads;
        this.conversions = conversions;
        this.conversionRate = conversionRate;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public Integer getLeads() {
        return leads;
    }

    public void setLeads(Integer leads) {
        this.leads = leads;
    }

    public Integer getConversions() {
        return conversions;
    }

    public void setConversions(Integer conversions) {
        this.conversions = conversions;
    }

    public String getConversionRate() {
        return conversionRate;
    }

    public void setConversionRate(String conversionRate) {
        this.conversionRate = conversionRate;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
