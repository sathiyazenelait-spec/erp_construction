package com.buildcon.erp.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StaffSignupRequest {
    private String username;
    private String email;
    private String password;
    private String staffRole; // e.g. ROLE_PROJECT_MANAGER
    private Long organizationId;

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getStaffRole() {
        return staffRole;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
