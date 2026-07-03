package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "sales_executives")
@Getter
@Setter
@NoArgsConstructor
public class SalesExecutive extends BaseUserEntity {

    private String roleName = "ROLE_SALES_EXECUTIVE";

    private String phone;
    private Boolean smsNotifications = true;
    private Boolean emailNotifications = true;
    private Boolean whatsappAlerts = true;

    public SalesExecutive(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Boolean getSmsNotifications() {
        return smsNotifications;
    }

    public void setSmsNotifications(Boolean smsNotifications) {
        this.smsNotifications = smsNotifications;
    }

    public Boolean getEmailNotifications() {
        return emailNotifications;
    }

    public void setEmailNotifications(Boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public Boolean getWhatsappAlerts() {
        return whatsappAlerts;
    }

    public void setWhatsappAlerts(Boolean whatsappAlerts) {
        this.whatsappAlerts = whatsappAlerts;
    }
}
