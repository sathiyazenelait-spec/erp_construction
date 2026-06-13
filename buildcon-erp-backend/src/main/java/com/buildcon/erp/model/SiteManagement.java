package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "site_managements")
@Getter
@Setter
@NoArgsConstructor
public class SiteManagement extends BaseUserEntity {

    private String roleName = "ROLE_SITE_MANAGEMENT";

    public SiteManagement(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}
