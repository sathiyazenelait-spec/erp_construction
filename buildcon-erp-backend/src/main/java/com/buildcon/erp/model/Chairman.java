package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "chairmen")
@Getter
@Setter
@NoArgsConstructor
public class Chairman {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, unique = true, nullable = false)
    private String username;

    @Column(length = 50, unique = true, nullable = false)
    private String email;

    @Column(length = 120, nullable = false)
    private String password;

    @Column(length = 50)
    private String chairmanRole = "ROLE_CHAIRMAN";

    @Column(name = "organization_id", unique = true)
    private Long organizationId;

    @Column(length = 100)
    private String name;

    @Column(length = 20)
    private String phone;

    @Column(name = "mfa_enabled")
    private Boolean mfaEnabled = false;

    @Column(name = "mfa_secret")
    private String mfaSecret;

    @Column(name = "notify_curing_delay")
    private Boolean notifyCuringDelay = true;

    @Column(name = "notify_budget_deficit")
    private Boolean notifyBudgetDeficit = true;

    @Column(name = "notify_material_delay")
    private Boolean notifyMaterialDelay = true;

    @Column(name = "notify_frequency", length = 20)
    private String notifyFrequency = "INSTANT";

    @Column(name = "fastapi_url")
    private String fastapiUrl = "http://localhost:8000";

    @Column(name = "sms_gateway_key")
    private String smsGatewayKey;

    @Column(name = "smtp_host")
    private String smtpHost;

    @Column(name = "smtp_port")
    private Integer smtpPort;

    @Column(name = "avatar_initials", length = 10)
    private String avatarInitials;

    public Chairman(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public Chairman(String username, String email, String password, Long organizationId) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.organizationId = organizationId;
    }

    public String getAvatarInitials() {
        return avatarInitials;
    }

    public void setAvatarInitials(String avatarInitials) {
        this.avatarInitials = avatarInitials;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getChairmanRole() {
        return chairmanRole;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Boolean getMfaEnabled() {
        return mfaEnabled;
    }

    public void setMfaEnabled(Boolean mfaEnabled) {
        this.mfaEnabled = mfaEnabled;
    }

    public String getMfaSecret() {
        return mfaSecret;
    }

    public void setMfaSecret(String mfaSecret) {
        this.mfaSecret = mfaSecret;
    }

    public Boolean getNotifyCuringDelay() {
        return notifyCuringDelay;
    }

    public void setNotifyCuringDelay(Boolean notifyCuringDelay) {
        this.notifyCuringDelay = notifyCuringDelay;
    }

    public Boolean getNotifyBudgetDeficit() {
        return notifyBudgetDeficit;
    }

    public void setNotifyBudgetDeficit(Boolean notifyBudgetDeficit) {
        this.notifyBudgetDeficit = notifyBudgetDeficit;
    }

    public Boolean getNotifyMaterialDelay() {
        return notifyMaterialDelay;
    }

    public void setNotifyMaterialDelay(Boolean notifyMaterialDelay) {
        this.notifyMaterialDelay = notifyMaterialDelay;
    }

    public String getNotifyFrequency() {
        return notifyFrequency;
    }

    public void setNotifyFrequency(String notifyFrequency) {
        this.notifyFrequency = notifyFrequency;
    }

    public String getFastapiUrl() {
        return fastapiUrl;
    }

    public void setFastapiUrl(String fastapiUrl) {
        this.fastapiUrl = fastapiUrl;
    }

    public String getSmsGatewayKey() {
        return smsGatewayKey;
    }

    public void setSmsGatewayKey(String smsGatewayKey) {
        this.smsGatewayKey = smsGatewayKey;
    }

    public String getSmtpHost() {
        return smtpHost;
    }

    public void setSmtpHost(String smtpHost) {
        this.smtpHost = smtpHost;
    }

    public Integer getSmtpPort() {
        return smtpPort;
    }

    public void setSmtpPort(Integer smtpPort) {
        this.smtpPort = smtpPort;
    }
}
