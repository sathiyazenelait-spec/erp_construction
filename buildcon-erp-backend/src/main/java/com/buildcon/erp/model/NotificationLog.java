package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_logs")
@Getter
@Setter
@NoArgsConstructor
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String channel; // WHATSAPP, SMS, EMAIL, IN_APP

    @Column(nullable = false, length = 100)
    private String recipient; // Phone number or email

    @Column(name = "recipient_name", length = 100)
    private String recipientName;

    @Column(name = "template_name", length = 80)
    private String templateName;

    @Column(length = 200)
    private String subject;

    @Column(name = "message_content", nullable = false, length = 1500)
    private String messageContent;

    @Column(name = "delivery_status", length = 30)
    private String deliveryStatus; // SENT, DELIVERED, READ, FAILED

    @Column(name = "external_message_id", length = 100)
    private String externalMessageId;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "metadata_json", length = 1000)
    private String metadataJson;

    @Column(name = "organization_id")
    private Long organizationId;

    public NotificationLog(String channel, String recipient, String recipientName, String templateName, String subject, String messageContent, String deliveryStatus, String externalMessageId, LocalDateTime sentAt, String metadataJson, Long organizationId) {
        this.channel = channel;
        this.recipient = recipient;
        this.recipientName = recipientName;
        this.templateName = templateName;
        this.subject = subject;
        this.messageContent = messageContent;
        this.deliveryStatus = deliveryStatus != null ? deliveryStatus : "SENT";
        this.externalMessageId = externalMessageId;
        this.sentAt = sentAt != null ? sentAt : LocalDateTime.now();
        this.metadataJson = metadataJson;
        this.organizationId = organizationId;
    }
}
