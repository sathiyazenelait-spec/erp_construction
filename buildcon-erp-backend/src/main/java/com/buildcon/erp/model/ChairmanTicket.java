package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "chairman_tickets")
@Getter
@Setter
@NoArgsConstructor
public class ChairmanTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String sender = "Chairman";

    @Column(nullable = false, length = 100)
    private String recipient;

    @Column(nullable = false, length = 150)
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "ticket_type", length = 100)
    private String ticketType;

    @Column(length = 20)
    private String priority = "Medium";

    @Column(length = 30)
    private String status = "Open";

    @Column(length = 20)
    private String date;

    @Column(name = "organization_id")
    private Long organizationId;

    public ChairmanTicket(String recipient, String subject, String description, String ticketType, String priority, String status, String date, Long organizationId) {
        this.recipient = recipient;
        this.subject = subject;
        this.description = description;
        this.ticketType = ticketType;
        this.priority = priority;
        this.status = status;
        this.date = date;
        this.organizationId = organizationId;
    }
}
