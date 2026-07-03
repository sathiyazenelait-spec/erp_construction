package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "wm_attendance_trends")
public class WmAttendanceTrend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String day;
    private Integer masons;
    private Integer labourers;
    private Integer carpenters;

    @Column(name = "organization_id")
    private Long organizationId;

    public WmAttendanceTrend() {}

    public WmAttendanceTrend(String day, Integer masons, Integer labourers, Integer carpenters, Long organizationId) {
        this.day = day;
        this.masons = masons;
        this.labourers = labourers;
        this.carpenters = carpenters;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public Integer getMasons() {
        return masons;
    }

    public void setMasons(Integer masons) {
        this.masons = masons;
    }

    public Integer getLabourers() {
        return labourers;
    }

    public void setLabourers(Integer labourers) {
        this.labourers = labourers;
    }

    public Integer getCarpenters() {
        return carpenters;
    }

    public void setCarpenters(Integer carpenters) {
        this.carpenters = carpenters;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
