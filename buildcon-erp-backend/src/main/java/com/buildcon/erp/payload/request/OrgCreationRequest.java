package com.buildcon.erp.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrgCreationRequest {
    private String name;
    private String domain;
    private String subscriptionTier;
    private String location;
    private String phone;
    private String chairmanEmail;
    private String chairmanPassword;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getSubscriptionTier() { return subscriptionTier; }
    public void setSubscriptionTier(String subscriptionTier) { this.subscriptionTier = subscriptionTier; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getChairmanEmail() { return chairmanEmail; }
    public void setChairmanEmail(String chairmanEmail) { this.chairmanEmail = chairmanEmail; }

    public String getChairmanPassword() { return chairmanPassword; }
    public void setChairmanPassword(String chairmanPassword) { this.chairmanPassword = chairmanPassword; }
}
