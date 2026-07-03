package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "sse_drawings")
public class SseDrawing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "drawing_id")
    private String drawingId;

    private String title;
    private String category;
    private String status;

    @Column(name = "organization_id")
    private Long organizationId;

    public SseDrawing() {}

    public SseDrawing(String drawingId, String title, String category, String status, Long organizationId) {
        this.drawingId = drawingId;
        this.title = title;
        this.category = category;
        this.status = status;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDrawingId() {
        return drawingId;
    }

    public void setDrawingId(String drawingId) {
        this.drawingId = drawingId;
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
