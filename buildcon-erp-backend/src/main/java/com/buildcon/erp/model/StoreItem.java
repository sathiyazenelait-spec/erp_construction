package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "store_items")
@Getter
@Setter
@NoArgsConstructor
public class StoreItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_code", length = 50)
    private String itemCode;

    @Column(name = "item_name", nullable = false, length = 120)
    private String itemName;

    @Column(length = 60)
    private String category;

    @Column(length = 20)
    private String unit;

    @Column(name = "current_stock")
    private Double currentStock;

    @Column(name = "reorder_level")
    private Double reorderLevel;

    @Column(name = "bin_location", length = 80)
    private String binLocation;

    @Column(name = "unit_price")
    private Double unitPrice;

    @Column(name = "organization_id")
    private Long organizationId;

    public StoreItem(String itemCode, String itemName, String category, String unit, Double currentStock, Double reorderLevel, String binLocation, Double unitPrice, Long organizationId) {
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.category = category;
        this.unit = unit;
        this.currentStock = currentStock;
        this.reorderLevel = reorderLevel;
        this.binLocation = binLocation;
        this.unitPrice = unitPrice;
        this.organizationId = organizationId;
    }
}

