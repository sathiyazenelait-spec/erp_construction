package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "drawing_clash_records")
public class DrawingClashRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "drawing_id", nullable = false)
    private Long drawingId;

    private String drawingNumber;
    private String projectName;
    private String clashType; // HARD_CLASH, CLEARANCE_CLASH, MEP_STRUCTURAL_CLASH
    private String severity; // CRITICAL, MODERATE, LOW
    
    @Column(length = 1000)
    private String zoneDescription;
    
    private String elementA;
    private String elementB;
    private String coordinates;
    private String resolutionStatus; // OPEN, RESOLVED, WAIVED
    
    @Column(length = 1000)
    private String resolutionNotes;
    
    private String assignedTo;
    private String detectedDate;
    private String resolvedDate;

    @Column(name = "organization_id")
    private Long organizationId;

    public DrawingClashRecord() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDrawingId() {
        return drawingId;
    }

    public void setDrawingId(Long drawingId) {
        this.drawingId = drawingId;
    }

    public String getDrawingNumber() {
        return drawingNumber;
    }

    public void setDrawingNumber(String drawingNumber) {
        this.drawingNumber = drawingNumber;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getClashType() {
        return clashType;
    }

    public void setClashType(String clashType) {
        this.clashType = clashType;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getZoneDescription() {
        return zoneDescription;
    }

    public void setZoneDescription(String zoneDescription) {
        this.zoneDescription = zoneDescription;
    }

    public String getElementA() {
        return elementA;
    }

    public void setElementA(String elementA) {
        this.elementA = elementA;
    }

    public String getElementB() {
        return elementB;
    }

    public void setElementB(String elementB) {
        this.elementB = elementB;
    }

    public String getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }

    public String getResolutionStatus() {
        return resolutionStatus;
    }

    public void setResolutionStatus(String resolutionStatus) {
        this.resolutionStatus = resolutionStatus;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getDetectedDate() {
        return detectedDate;
    }

    public void setDetectedDate(String detectedDate) {
        this.detectedDate = detectedDate;
    }

    public String getResolvedDate() {
        return resolvedDate;
    }

    public void setResolvedDate(String resolvedDate) {
        this.resolvedDate = resolvedDate;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
