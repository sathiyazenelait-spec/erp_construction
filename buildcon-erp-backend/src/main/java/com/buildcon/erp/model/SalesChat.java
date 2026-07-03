package com.buildcon.erp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "sales_chats")
public class SalesChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "client_name", nullable = false, length = 100)
    private String clientName;

    @Column(name = "latest_message", length = 255)
    private String latestMessage;

    @Column(length = 50)
    private String time;

    @Column(nullable = false)
    private Boolean unread = false;

    @Column(name = "organization_id")
    private Long organizationId;

    public SalesChat() {
    }

    public SalesChat(String clientName, String latestMessage, String time, Boolean unread, Long organizationId) {
        this.clientName = clientName;
        this.latestMessage = latestMessage;
        this.time = time;
        this.unread = unread;
        this.organizationId = organizationId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getLatestMessage() {
        return latestMessage;
    }

    public void setLatestMessage(String latestMessage) {
        this.latestMessage = latestMessage;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Boolean getUnread() {
        return unread;
    }

    public void setUnread(Boolean unread) {
        this.unread = unread;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
