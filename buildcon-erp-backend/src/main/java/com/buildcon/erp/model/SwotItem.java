package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "swot_items")
public class SwotItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String type; // "STRENGTH", "WEAKNESS", "OPPORTUNITY", "THREAT"

    @Column(nullable = false, length = 200)
    private String value;

    @Column(name = "organization_id")
    private Long organizationId;

    public SwotItem() {}

    public SwotItem(String type, String value, Long organizationId) {
        this.type = type;
        this.value = value;
        this.organizationId = organizationId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
}
