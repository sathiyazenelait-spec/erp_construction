package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "workers")
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "worker_id", nullable = false, unique = true, length = 50)
    private String workerId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 20)
    private String mobile;

    @Column(nullable = false, length = 20)
    private String aadhaar;

    @Column(nullable = false, length = 100)
    private String subcontractor;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "verification_status", nullable = false, length = 50)
    private String verificationStatus;

    @Column(name = "photo_uploaded", nullable = false)
    private Boolean photoUploaded = false;

    @Column(name = "organization_id")
    private Long organizationId;

    public Worker() {
    }

    public Worker(String workerId, String name, String mobile, String aadhaar, String subcontractor, String category, String verificationStatus, Boolean photoUploaded, Long organizationId) {
        this.workerId = workerId;
        this.name = name;
        this.mobile = mobile;
        this.aadhaar = aadhaar;
        this.subcontractor = subcontractor;
        this.category = category;
        this.verificationStatus = verificationStatus;
        this.photoUploaded = photoUploaded;
        this.organizationId = organizationId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWorkerId() {
        return workerId;
    }

    public void setWorkerId(String workerId) {
        this.workerId = workerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getAadhaar() {
        return aadhaar;
    }

    public void setAadhaar(String aadhaar) {
        this.aadhaar = aadhaar;
    }

    public String getSubcontractor() {
        return subcontractor;
    }

    public void setSubcontractor(String subcontractor) {
        this.subcontractor = subcontractor;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public Boolean getPhotoUploaded() {
        return photoUploaded;
    }

    public void setPhotoUploaded(Boolean photoUploaded) {
        this.photoUploaded = photoUploaded;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
