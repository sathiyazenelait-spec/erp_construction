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

    public SalesExecutive(String username, String email, String password) {
        super(username, email, password);
    }

    public String getRoleName() {
        return roleName;
    }
}
