package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "marketing_managers")
@Getter
@Setter
@NoArgsConstructor
public class MarketingManager extends BaseUserEntity {

    private String roleName = "ROLE_MARKETING_MANAGER";

    public MarketingManager(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}
