package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "drawing_records")
public class DrawingRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "drawing_number", nullable = false)
    private String drawingNumber;

    @Column(nullable = false)
    private String title;

    private String category; // ARCHITECTURAL, STRUCTURAL, ELECTRICAL, PLUMBING, HVAC
    private String discipline;
    private String revision; // v1.0, v2.0, v3.0-IFC
    private String revisionNotes;
    private String fileUrl;
    private String fileName;
    private String fileType; // DWG, DXF, PDF, IFC, PNG, JPG
    private Long fileSizeBytes;
    
    private String status; // DRAFT, UNDER_REVIEW, APPROVED_FOR_CONSTRUCTION, REJECTED, SUPERSEDED
    private String approvedBy;
    private String approvalDate;
    private String uploadedBy;
    private String uploadDate;
    
    private String projectName;
    private Long projectId;
    private String linkedTaskId;
    private String scaleRatio; // 1:50, 1:100
    
    private Double carpetAreaSqft;
    private Double builtupAreaSqft;
    private Double wallLengthMeters;
    private Integer openingCount;
    private Integer clashesCount;

    @Column(columnDefinition = "LONGTEXT")
    private String aiAnalysisJson;

    @Column(name = "organization_id")
    private Long organizationId;

    public DrawingRecord() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDrawingNumber() {
        return drawingNumber;
    }

    public void setDrawingNumber(String drawingNumber) {
        this.drawingNumber = drawingNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDiscipline() {
        return discipline;
    }

    public void setDiscipline(String discipline) {
        this.discipline = discipline;
    }

    public String getRevision() {
        return revision;
    }

    public void setRevision(String revision) {
        this.revision = revision;
    }

    public String getRevisionNotes() {
        return revisionNotes;
    }

    public void setRevisionNotes(String revisionNotes) {
        this.revisionNotes = revisionNotes;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSizeBytes() {
        return fileSizeBytes;
    }

    public void setFileSizeBytes(Long fileSizeBytes) {
        this.fileSizeBytes = fileSizeBytes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }

    public String getApprovalDate() {
        return approvalDate;
    }

    public void setApprovalDate(String approvalDate) {
        this.approvalDate = approvalDate;
    }

    public String getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public String getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(String uploadDate) {
        this.uploadDate = uploadDate;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getLinkedTaskId() {
        return linkedTaskId;
    }

    public void setLinkedTaskId(String linkedTaskId) {
        this.linkedTaskId = linkedTaskId;
    }

    public String getScaleRatio() {
        return scaleRatio;
    }

    public void setScaleRatio(String scaleRatio) {
        this.scaleRatio = scaleRatio;
    }

    public Double getCarpetAreaSqft() {
        return carpetAreaSqft;
    }

    public void setCarpetAreaSqft(Double carpetAreaSqft) {
        this.carpetAreaSqft = carpetAreaSqft;
    }

    public Double getBuiltupAreaSqft() {
        return builtupAreaSqft;
    }

    public void setBuiltupAreaSqft(Double builtupAreaSqft) {
        this.builtupAreaSqft = builtupAreaSqft;
    }

    public Double getWallLengthMeters() {
        return wallLengthMeters;
    }

    public void setWallLengthMeters(Double wallLengthMeters) {
        this.wallLengthMeters = wallLengthMeters;
    }

    public Integer getOpeningCount() {
        return openingCount;
    }

    public void setOpeningCount(Integer openingCount) {
        this.openingCount = openingCount;
    }

    public Integer getClashesCount() {
        return clashesCount;
    }

    public void setClashesCount(Integer clashesCount) {
        this.clashesCount = clashesCount;
    }

    public String getAiAnalysisJson() {
        return aiAnalysisJson;
    }

    public void setAiAnalysisJson(String aiAnalysisJson) {
        this.aiAnalysisJson = aiAnalysisJson;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
