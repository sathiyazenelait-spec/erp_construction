package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "construction_managers")
@Getter
@Setter
@NoArgsConstructor
public class ConstructionManager extends BaseUserEntity {

    private String roleName = "ROLE_CONSTRUCTION_MANAGER";

    public ConstructionManager(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}
