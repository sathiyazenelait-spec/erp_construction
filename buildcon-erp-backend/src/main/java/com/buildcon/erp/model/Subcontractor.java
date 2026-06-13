package com.buildcon.erp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "subcontractors")
@Getter
@Setter
@NoArgsConstructor
public class Subcontractor extends BaseUserEntity {

    private String roleName = "ROLE_SUBCONTRACTOR";

    public Subcontractor(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}
