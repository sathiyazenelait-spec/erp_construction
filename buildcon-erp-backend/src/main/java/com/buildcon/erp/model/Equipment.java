package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "equipment")
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "equipment_code", nullable = false, length = 50)
    private String equipmentCode;

    @Column(name = "machinery_type", nullable = false, length = 150)
    private String machineryType;

    @Column(name = "allocated_site", length = 150)
    private String allocatedSite;

    @Column(name = "diagnostics", length = 250)
    private String diagnostics;

    @Column(name = "scheduled_date", length = 100)
    private String scheduledDate;

    @Column(nullable = false, length = 50)
    private String status; // Active, Idle, Maintenance, Breakdown

    @Column(name = "organization_id")
    private Long organizationId;

    public Equipment() {
    }

    public Equipment(String equipmentCode, String machineryType, String allocatedSite, String diagnostics, String scheduledDate, String status, Long organizationId) {
        this.equipmentCode = equipmentCode;
        this.machineryType = machineryType;
        this.allocatedSite = allocatedSite;
        this.diagnostics = diagnostics;
        this.scheduledDate = scheduledDate;
        this.status = status;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEquipmentCode() {
        return equipmentCode;
    }

    public void setEquipmentCode(String equipmentCode) {
        this.equipmentCode = equipmentCode;
    }

    public String getMachineryType() {
        return machineryType;
    }

    public void setMachineryType(String machineryType) {
        this.machineryType = machineryType;
    }

    public String getAllocatedSite() {
        return allocatedSite;
    }

    public void setAllocatedSite(String allocatedSite) {
        this.allocatedSite = allocatedSite;
    }

    public String getDiagnostics() {
        return diagnostics;
    }

    public void setDiagnostics(String diagnostics) {
        this.diagnostics = diagnostics;
    }

    public String getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(String scheduledDate) {
        this.scheduledDate = scheduledDate;
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
