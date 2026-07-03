package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "subcontractor_attendance")
public class SubcontractorAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "skilled_masons")
    private Integer skilledMasons;

    private Integer carpenters;

    @Column(name = "general_labor")
    private Integer generalLabor;

    private String date;

    @Column(name = "organization_id")
    private Long organizationId;

    @Column(name = "subcontractor_id")
    private Long subcontractorId;

    public SubcontractorAttendance() {}

    public SubcontractorAttendance(Integer skilledMasons, Integer carpenters, Integer generalLabor, String date, Long organizationId, Long subcontractorId) {
        this.skilledMasons = skilledMasons;
        this.carpenters = carpenters;
        this.generalLabor = generalLabor;
        this.date = date;
        this.organizationId = organizationId;
        this.subcontractorId = subcontractorId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSkilledMasons() {
        return skilledMasons;
    }

    public void setSkilledMasons(Integer skilledMasons) {
        this.skilledMasons = skilledMasons;
    }

    public Integer getCarpenters() {
        return carpenters;
    }

    public void setCarpenters(Integer carpenters) {
        this.carpenters = carpenters;
    }

    public Integer getGeneralLabor() {
        return generalLabor;
    }

    public void setGeneralLabor(Integer generalLabor) {
        this.generalLabor = generalLabor;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public Long getSubcontractorId() {
        return subcontractorId;
    }

    public void setSubcontractorId(Long subcontractorId) {
        this.subcontractorId = subcontractorId;
    }
}
