package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "client_tickets")
@Getter
@Setter
@NoArgsConstructor
public class ClientTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_code", length = 50)
    private String ticketCode;

    @Column(name = "client_name", length = 100)
    private String clientName;

    @Column(name = "unit_number", length = 50)
    private String unitNumber; // e.g. "Flat 402, Skyline Towers"

    @Column(length = 60)
    private String category; // Snagging, DLP Warranty, Billing, Maintenance, Query

    @Column(nullable = false, length = 160)
    private String subject;

    @Column(length = 1000)
    private String description;

    @Column(length = 30)
    private String priority; // HIGH, MEDIUM, LOW

    @Column(length = 30)
    private String status; // OPEN, IN_PROGRESS, RESOLVED, CLOSED

    @Column(name = "created_date")
    private LocalDate createdDate;

    @Column(name = "resolution_remarks", length = 500)
    private String resolutionRemarks;

    @Column(name = "organization_id")
    private Long organizationId;

    public ClientTicket(String ticketCode, String clientName, String unitNumber, String category, String subject, String description, String priority, String status, LocalDate createdDate, Long organizationId) {
        this.ticketCode = ticketCode;
        this.clientName = clientName;
        this.unitNumber = unitNumber;
        this.category = category;
        this.subject = subject;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.createdDate = createdDate;
        this.organizationId = organizationId;
    }
}

