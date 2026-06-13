package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "workforce_managers")
@Getter
@Setter
@NoArgsConstructor
public class WorkforceManager extends BaseUserEntity {

    private String roleName = "ROLE_WORKFORCE_MANAGER";

    public WorkforceManager(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}
