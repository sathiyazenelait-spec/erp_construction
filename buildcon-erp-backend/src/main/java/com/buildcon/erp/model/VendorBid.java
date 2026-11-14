package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "vendor_bids")
@Getter
@Setter
@NoArgsConstructor
public class VendorBid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rfq_number", length = 50)
    private String rfqNumber;

    @Column(name = "material_name", nullable = false, length = 120)
    private String materialName;

    @Column(name = "vendor_name", nullable = false, length = 120)
    private String vendorName;

    @Column(name = "quoted_rate", nullable = false)
    private Double quotedRate;

    @Column(length = 20)
    private String unit;

    @Column(name = "lead_time_days")
    private Integer leadTimeDays;

    @Column(name = "quote_date")
    private LocalDate quoteDate;

    @Column(length = 30)
    private String status; // SUBMITTED, UNDER_EVALUATION, ACCEPTED, REJECTED

    @Column(length = 500)
    private String terms;

    @Column(name = "organization_id")
    private Long organizationId;

    public VendorBid(String rfqNumber, String materialName, String vendorName, Double quotedRate, String unit, Integer leadTimeDays, LocalDate quoteDate, String status, String terms, Long organizationId) {
        this.rfqNumber = rfqNumber;
        this.materialName = materialName;
        this.vendorName = vendorName;
        this.quotedRate = quotedRate;
        this.unit = unit;
        this.leadTimeDays = leadTimeDays;
        this.quoteDate = quoteDate;
        this.status = status;
        this.terms = terms;
        this.organizationId = organizationId;
    }
}

