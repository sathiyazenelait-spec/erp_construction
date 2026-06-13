package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "procurement_managers")
@Getter
@Setter
@NoArgsConstructor
public class ProcurementManager extends BaseUserEntity {

    private String roleName = "ROLE_PROCUREMENT_MANAGER";

    public ProcurementManager(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}
