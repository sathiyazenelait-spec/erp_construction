package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pm_vendors")
public class PmVendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double rating;
    private String priceRating;
    private String deliveryRating;

    @Column(name = "organization_id")
    private Long organizationId;

    public PmVendor() {}

    public PmVendor(String name, Double rating, String priceRating, String deliveryRating, Long organizationId) {
        this.name = name;
        this.rating = rating;
        this.priceRating = priceRating;
        this.deliveryRating = deliveryRating;
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getPriceRating() {
        return priceRating;
    }

    public void setPriceRating(String priceRating) {
        this.priceRating = priceRating;
    }

    public String getDeliveryRating() {
        return deliveryRating;
    }

    public void setDeliveryRating(String deliveryRating) {
        this.deliveryRating = deliveryRating;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
