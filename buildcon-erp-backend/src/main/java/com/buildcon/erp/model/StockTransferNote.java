package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "stock_transfer_notes")
@Getter
@Setter
@NoArgsConstructor
public class StockTransferNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stn_number", length = 50)
    private String stnNumber;

    @Column(name = "source_site", nullable = false, length = 120)
    private String sourceSite;

    @Column(name = "destination_site", nullable = false, length = 120)
    private String destinationSite;

    @Column(name = "material_name", nullable = false, length = 120)
    private String materialName;

    @Column(nullable = false)
    private Double quantity;

    @Column(length = 20)
    private String unit;

    @Column(name = "dispatch_date")
    private LocalDate dispatchDate;

    @Column(name = "expected_arrival")
    private LocalDate expectedArrival;

    @Column(name = "transporter_name", length = 100)
    private String transporterName;

    @Column(length = 30)
    private String status; // IN_TRANSIT, RECEIVED, DISPATCHED

    @Column(name = "organization_id")
    private Long organizationId;

    public StockTransferNote(String stnNumber, String sourceSite, String destinationSite, String materialName, Double quantity, String unit, LocalDate dispatchDate, LocalDate expectedArrival, String transporterName, String status, Long organizationId) {
        this.stnNumber = stnNumber;
        this.sourceSite = sourceSite;
        this.destinationSite = destinationSite;
        this.materialName = materialName;
        this.quantity = quantity;
        this.unit = unit;
        this.dispatchDate = dispatchDate;
        this.expectedArrival = expectedArrival;
        this.transporterName = transporterName;
        this.status = status;
        this.organizationId = organizationId;
    }
}

