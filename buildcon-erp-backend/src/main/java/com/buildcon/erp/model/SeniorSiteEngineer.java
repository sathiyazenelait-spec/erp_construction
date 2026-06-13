package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "senior_site_engineers")
@Getter
@Setter
@NoArgsConstructor
public class SeniorSiteEngineer extends BaseUserEntity {

    private String roleName = "ROLE_SENIOR_SITE_ENGINEER";

    public SeniorSiteEngineer(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}
