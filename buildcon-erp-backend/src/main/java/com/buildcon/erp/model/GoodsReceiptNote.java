package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "goods_receipt_notes")
@Getter
@Setter
@NoArgsConstructor
public class GoodsReceiptNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "grn_number", length = 50)
    private String grnNumber;

    @Column(name = "po_number", length = 50)
    private String poNumber;

    @Column(name = "vendor_name", length = 120)
    private String vendorName;

    @Column(name = "received_date")
    private LocalDate receivedDate;

    @Column(name = "vehicle_number", length = 40)
    private String vehicleNumber;

    @Column(name = "challan_number", length = 60)
    private String challanNumber;

    @Column(name = "inspected_by", length = 80)
    private String inspectedBy;

    @Column(length = 40)
    private String status; // VERIFIED_ACCEPTED, PARTIAL_RECEIVED, REJECTED

    @Column(name = "total_received_qty")
    private Double totalReceivedQty;

    @Column(length = 500)
    private String remarks;

    @Column(name = "organization_id")
    private Long organizationId;

    public GoodsReceiptNote(String grnNumber, String poNumber, String vendorName, LocalDate receivedDate, String vehicleNumber, String challanNumber, String inspectedBy, String status, Double totalReceivedQty, String remarks, Long organizationId) {
        this.grnNumber = grnNumber;
        this.poNumber = poNumber;
        this.vendorName = vendorName;
        this.receivedDate = receivedDate;
        this.vehicleNumber = vehicleNumber;
        this.challanNumber = challanNumber;
        this.inspectedBy = inspectedBy;
        this.status = status;
        this.totalReceivedQty = totalReceivedQty;
        this.remarks = remarks;
        this.organizationId = organizationId;
    }
}

