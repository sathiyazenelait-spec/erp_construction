package com.buildcon.erp.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "material_requests")
public class MaterialRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "material_name", nullable = false, length = 200)
    private String materialName;

    @Column(nullable = false, length = 100)
    private String quantity;

    @Column(length = 500)
    private String purpose;

    private LocalDate requestDate = LocalDate.now();

    @Column(length = 50)
    private String status = "Pending"; // Pending, Approved, Rejected

    public MaterialRequest() {
    }

    public MaterialRequest(Long projectId, String materialName, String quantity, String purpose, String status) {
        this.projectId = projectId;
        this.materialName = materialName;
        this.quantity = quantity;
        this.purpose = purpose;
        this.status = status;
        this.requestDate = LocalDate.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getMaterialName() {
        return materialName;
    }

    public void setMaterialName(String materialName) {
        this.materialName = materialName;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public LocalDate getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDate requestDate) {
        this.requestDate = requestDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
