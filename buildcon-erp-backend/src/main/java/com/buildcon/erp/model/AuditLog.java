package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false, length = 50)
    private String action; // CREATE, UPDATE, APPROVE, REJECT, DELETE, LOGIN

    @Column(name = "entity_name", length = 100)
    private String entityName; // e.g. PurchaseOrder, Inspection, Contract

    @Column(name = "entity_id", length = 100)
    private String entityId;

    @Column(name = "performed_by", nullable = false, length = 100)
    private String performedBy;

    @Column(name = "user_role", length = 80)
    private String userRole;

    @Column(length = 1000)
    private String details;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(length = 30)
    private String status; // SUCCESS, FAILED, WARNING

    @Column(name = "organization_id")
    private Long organizationId;

    public AuditLog(LocalDateTime timestamp, String action, String entityName, String entityId, String performedBy, String userRole, String details, String ipAddress, String status, Long organizationId) {
        this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
        this.action = action;
        this.entityName = entityName;
        this.entityId = entityId;
        this.performedBy = performedBy;
        this.userRole = userRole;
        this.details = details;
        this.ipAddress = ipAddress;
        this.status = status != null ? status : "SUCCESS";
        this.organizationId = organizationId;
    }
}
